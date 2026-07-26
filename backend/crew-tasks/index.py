"""Бортовой журнал: тактические манёвры (задачи) экипажа станции DEOD + ИИ-советник (OpenRouter)"""
import json
import os

import httpx
import psycopg2
from psycopg2.extras import RealDictCursor

PRIORITY_LABELS = {
    'critical': 'Критическая угроза',
    'high': 'Высокая угроза',
    'medium': 'Средняя угроза',
    'low': 'Низкая угроза',
}

STATUS_LABELS = {
    'planned': 'На старте',
    'in_progress': 'В зоне поражения',
    'review': 'На подтверждении',
    'done': 'Миссия выполнена',
    'failed': 'Провалено',
}


def cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def ok(data):
    return {'statusCode': 200, 'headers': cors(), 'body': json.dumps(data, default=str), 'isBase64Encoded': False}


def err(message, status=400):
    return {'statusCode': status, 'headers': cors(), 'body': json.dumps({'error': message}), 'isBase64Encoded': False}


def auth(conn, token):
    if not token:
        return None
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT m.id, m.callsign, m.is_admin, m.avatar_url, m.role FROM crew_members m
            JOIN crew_sessions s ON s.member_id = m.id
            WHERE s.token = %s AND s.expires_at > NOW() AND m.is_active = TRUE
        """, (token,))
        return cur.fetchone()


def task_public(t):
    return {
        'id': t['id'],
        'title': t['title'],
        'comment': t.get('comment'),
        'deadline': t.get('deadline'),
        'priority': t['priority'],
        'priority_label': PRIORITY_LABELS.get(t['priority'], t['priority']),
        'status': t['status'],
        'status_label': STATUS_LABELS.get(t['status'], t['status']),
        'assignee_id': t.get('assignee_id'),
        'assignee_callsign': t.get('assignee_callsign'),
        'assignee_avatar': t.get('assignee_avatar'),
        'created_by': t.get('created_by'),
        'creator_callsign': t.get('creator_callsign'),
        'reminder_at': t.get('reminder_at'),
        'ai_analysis': t.get('ai_analysis'),
        'created_at': t.get('created_at'),
        'updated_at': t.get('updated_at'),
    }


def handler(event, context):
    """Обрабатывает CRUD манёвров «Бортового журнала» и ИИ-анализ манёвра через OpenRouter"""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors(), 'body': '', 'isBase64Encoded': False}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        headers = event.get('headers') or {}
        token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
        me = auth(conn, token)
        if not me:
            return err('Требуется авторизация', 401)

        params = event.get('queryStringParameters') or {}
        body = {}
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except Exception:
                body = {}
        action = body.get('action') or params.get('action') or 'list'

        if method == 'GET' or action == 'list':
            return do_list(conn, params)
        if action == 'create':
            return do_create(conn, me, body)
        if action == 'update':
            return do_update(conn, me, body)
        if action == 'delete':
            return do_delete(conn, me, body)
        if action == 'ai_analyze':
            return do_ai_analyze(conn, me, body)

        return err('Неизвестное действие', 400)
    except Exception as exc:
        return err(str(exc), 500)
    finally:
        conn.close()


def do_list(conn, params):
    assignee_id = params.get('assignee_id')
    status = params.get('status')
    query = """
        SELECT t.*, a.callsign AS assignee_callsign, a.avatar_url AS assignee_avatar, c.callsign AS creator_callsign
        FROM crew_tasks t
        LEFT JOIN crew_members a ON a.id = t.assignee_id
        LEFT JOIN crew_members c ON c.id = t.created_by
        WHERE 1=1
    """
    args = []
    if assignee_id:
        query += " AND t.assignee_id = %s"
        args.append(assignee_id)
    if status:
        query += " AND t.status = %s"
        args.append(status)
    query += " ORDER BY (t.deadline IS NULL), t.deadline ASC, t.id DESC"
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, args)
        tasks = cur.fetchall()
    return ok({'tasks': [task_public(t) for t in tasks], 'priority_labels': PRIORITY_LABELS, 'status_labels': STATUS_LABELS})


def do_create(conn, me, body):
    title = (body.get('title') or '').strip()
    if not title:
        return err('Название манёвра обязательно', 400)
    comment = (body.get('comment') or '').strip() or None
    deadline = body.get('deadline') or None
    priority = body.get('priority') or 'medium'
    if priority not in PRIORITY_LABELS:
        priority = 'medium'
    assignee_id = body.get('assignee_id') or None
    reminder_at = body.get('reminder_at') or None

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO crew_tasks (title, comment, deadline, priority, status, assignee_id, created_by, reminder_at)
            VALUES (%s, %s, %s, %s, 'planned', %s, %s, %s)
            RETURNING *
        """, (title, comment, deadline, priority, assignee_id, me['id'], reminder_at))
        task = cur.fetchone()
        conn.commit()
        cur.execute("""
            SELECT t.*, a.callsign AS assignee_callsign, a.avatar_url AS assignee_avatar, c.callsign AS creator_callsign
            FROM crew_tasks t
            LEFT JOIN crew_members a ON a.id = t.assignee_id
            LEFT JOIN crew_members c ON c.id = t.created_by
            WHERE t.id = %s
        """, (task['id'],))
        task = cur.fetchone()
    return ok({'task': task_public(task)})


def do_update(conn, me, body):
    task_id = body.get('id')
    if not task_id:
        return err('Не указан id манёвра', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM crew_tasks WHERE id = %s", (task_id,))
        task = cur.fetchone()
        if not task:
            return err('Манёвр не найден', 404)

        is_owner = me['is_admin'] or task['created_by'] == me['id'] or task['assignee_id'] == me['id']
        if not is_owner:
            return err('Нет доступа к этому манёвру', 403)

        allowed = {'title', 'comment', 'deadline', 'priority', 'status', 'assignee_id', 'reminder_at'}
        updates = {k: v for k, v in body.items() if k in allowed}
        if 'priority' in updates and updates['priority'] not in PRIORITY_LABELS:
            return err('Некорректный уровень угрозы', 400)
        if 'status' in updates and updates['status'] not in STATUS_LABELS:
            return err('Некорректный статус манёвра', 400)
        if not updates:
            return err('Нет полей для обновления', 400)

        set_clause = ', '.join(f"{k} = %s" for k in updates) + ", updated_at = NOW()"
        values = list(updates.values()) + [task_id]
        cur.execute(f"UPDATE crew_tasks SET {set_clause} WHERE id = %s", values)
        conn.commit()

        cur.execute("""
            SELECT t.*, a.callsign AS assignee_callsign, a.avatar_url AS assignee_avatar, c.callsign AS creator_callsign
            FROM crew_tasks t
            LEFT JOIN crew_members a ON a.id = t.assignee_id
            LEFT JOIN crew_members c ON c.id = t.created_by
            WHERE t.id = %s
        """, (task_id,))
        task = cur.fetchone()
    return ok({'task': task_public(task)})


def do_delete(conn, me, body):
    task_id = body.get('id')
    if not task_id:
        return err('Не указан id манёвра', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM crew_tasks WHERE id = %s", (task_id,))
        task = cur.fetchone()
        if not task:
            return err('Манёвр не найден', 404)
        if not (me['is_admin'] or task['created_by'] == me['id']):
            return err('Нет доступа к этому манёвру', 403)
        cur.execute("DELETE FROM crew_tasks WHERE id = %s", (task_id,))
        conn.commit()
    return ok({'success': True})


def call_ai(system_prompt, user_text, max_tokens=500, temperature=0.4):
    """Вызывает LLM через OpenRouter и возвращает текст ответа модели"""
    api_key = os.environ.get('OPENROUTER_API_KEY', '')
    if not api_key:
        raise RuntimeError('OPENROUTER_API_KEY not configured')

    response = httpx.post(
        'https://openrouter.ai/api/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://poehali.dev',
            'X-Title': 'DEOD Tactical Log',
        },
        json={
            'model': 'deepseek/deepseek-chat',
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_text},
            ],
            'max_tokens': max_tokens,
            'temperature': temperature,
        },
        timeout=30.0,
    )
    result = response.json()
    if 'choices' not in result:
        error_field = result.get('error')
        if isinstance(error_field, dict):
            error_msg = error_field.get('message', str(result))
        else:
            error_msg = error_field or str(result)
        raise RuntimeError(f'OpenRouter error: {error_msg}')
    return result['choices'][0]['message']['content']


def do_ai_analyze(conn, me, body):
    """ИИ-советник манёвра: оценка сложности, риски, ноу-хау, рекомендации по приоритету"""
    task_id = body.get('id')
    if not task_id:
        return err('Не указан id манёвра', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT t.*, a.callsign AS assignee_callsign
            FROM crew_tasks t
            LEFT JOIN crew_members a ON a.id = t.assignee_id
            WHERE t.id = %s
        """, (task_id,))
        task = cur.fetchone()
        if not task:
            return err('Манёвр не найден', 404)

    system_prompt = (
        "Ты — тактический ИИ-советник на борту космической станции. Экипаж ведёт задачи как «манёвры». "
        "Проанализируй манёвр и дай короткий практичный разбор на русском языке в стиле военного тактика "
        "(без канцелярита, по делу, дружелюбно-жёстко). Ответь СТРОГО обычным текстом (не JSON), используя структуру:\n"
        "⚔️ Сложность: (оценка в процентах и одна фраза)\n"
        "⚠️ Риски: (1-2 главных риска)\n"
        "💡 Ноу-хау: (1 конкретный совет как ускорить/упростить)\n"
        "🎯 Рекомендация: (что делать в первую очередь)\n"
        "Пиши кратко, по 1 строке на каждый пункт, без лишних вступлений."
    )
    deadline_txt = f", дедлайн: {task['deadline']}" if task.get('deadline') else ", дедлайн не указан"
    user_text = (
        f"Манёвр: {task['title']}\n"
        f"Комментарий: {task.get('comment') or '—'}\n"
        f"Уровень угрозы: {PRIORITY_LABELS.get(task['priority'], task['priority'])}{deadline_txt}\n"
        f"Ответственный: {task.get('assignee_callsign') or 'не назначен'}"
    )

    try:
        analysis = call_ai(system_prompt, user_text)
    except Exception as exc:
        return err(f'ИИ-советник временно недоступен: {exc}', 502)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("UPDATE crew_tasks SET ai_analysis = %s, updated_at = NOW() WHERE id = %s RETURNING *", (analysis, task_id))
        conn.commit()

    return ok({'ai_analysis': analysis})
