"""EVDEN 2.0: CRUD для сделок, импульсов и комментариев + ИИ-анализ тональности через YandexGPT"""
import json
import os
import urllib.request
import urllib.error
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event, context):
    """Обрабатывает запросы к сделкам, импульсам и комментариям EVDEN 2.0, включая ИИ-анализ тональности"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers(),
            'body': '',
            'isBase64Encoded': False
        }

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)

    try:
        if method == 'GET':
            return handle_get(event, conn)
        elif method == 'POST':
            return handle_post(event, conn)
        elif method == 'PUT':
            return handle_put(event, conn)
        elif method == 'DELETE':
            return handle_delete(event, conn)
        return error_response('Method not allowed', 405)
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        conn.close()


# ------------------------------------------------------------------ routing --

def handle_get(event, conn):
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'deals')

    if resource == 'deals':
        return get_deals(conn, params)
    if resource == 'deal':
        return get_deal_details(conn, params.get('id'))
    if resource == 'stats':
        return get_stats(conn)
    if resource == 'impulses':
        return get_all_impulses(conn)

    return error_response('Unknown resource', 400)


def handle_post(event, conn):
    body = json.loads(event.get('body', '{}'))
    resource = body.get('resource')

    if resource == 'deal':
        return create_deal(conn, body)
    if resource == 'impulse':
        return create_impulse(conn, body)
    if resource == 'comment':
        return create_comment(conn, body)
    if resource == 'voice-command':
        return handle_voice_command(conn, body)

    return error_response('Unknown resource', 400)


def handle_put(event, conn):
    body = json.loads(event.get('body', '{}'))
    resource = body.get('resource')

    if resource == 'deal':
        return update_deal(conn, body)
    if resource == 'impulse':
        return update_impulse(conn, body)

    return error_response('Unknown resource', 400)


def handle_delete(event, conn):
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource')
    item_id = params.get('id')

    if not item_id:
        return error_response('Missing id', 400)

    if resource == 'deal':
        return delete_deal(conn, item_id)
    if resource == 'impulse':
        return delete_impulse(conn, item_id)

    return error_response('Unknown resource', 400)


# ------------------------------------------------------------------- deals --

PHASES = ['ether', 'gravity', 'docking', 'foundation']


def get_all_impulses(conn):
    """Все импульсы по всем сделкам сразу — для общей доски Kanban"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT i.*, d.company_name AS deal_name
            FROM evden_impulses i
            JOIN evden_deals d ON d.id = i.deal_id
            ORDER BY i.created_at DESC
        """)
        impulses = cur.fetchall()
    return ok_response({'impulses': impulses})


def get_deals(conn, params):
    phase = params.get('phase')
    query = """
        SELECT d.*,
            (SELECT COUNT(*) FROM evden_impulses i WHERE i.deal_id = d.id AND i.status != 'done') AS open_impulses,
            (SELECT COUNT(*) FROM evden_comments c WHERE c.deal_id = d.id) AS comments_count,
            (SELECT COUNT(*) FROM evden_messages m WHERE m.deal_id = d.id) AS messages_count
        FROM evden_deals d
    """
    args = []
    if phase:
        query += " WHERE d.phase = %s"
        args.append(phase)
    query += " ORDER BY d.updated_at DESC"

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, args)
        deals = cur.fetchall()

    return ok_response({'deals': deals})


def get_deal_details(conn, deal_id):
    if not deal_id:
        return error_response('Missing deal id', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM evden_deals WHERE id = %s", (deal_id,))
        deal = cur.fetchone()
        if not deal:
            return error_response('Deal not found', 404)

        cur.execute("SELECT * FROM evden_impulses WHERE deal_id = %s ORDER BY created_at DESC", (deal_id,))
        impulses = cur.fetchall()

        cur.execute("SELECT * FROM evden_comments WHERE deal_id = %s ORDER BY created_at DESC", (deal_id,))
        comments = cur.fetchall()

        cur.execute("SELECT * FROM evden_messages WHERE deal_id = %s ORDER BY created_at ASC", (deal_id,))
        messages = cur.fetchall()

    return ok_response({
        'deal': deal,
        'impulses': impulses,
        'comments': comments,
        'messages': messages,
    })


def create_deal(conn, body):
    d = body.get('data') or body
    company_name = (d.get('company_name') or '').strip()
    if not company_name:
        return error_response('company_name is required', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO evden_deals (
                company_name, contact_person, phone, email, telegram_username,
                object_address, work_type, phase, budget, probability, source, notes
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            company_name,
            d.get('contact_person', ''),
            d.get('phone', ''),
            d.get('email', ''),
            d.get('telegram_username', ''),
            d.get('object_address', ''),
            d.get('work_type', ''),
            d.get('phase', 'ether'),
            d.get('budget', 0),
            d.get('probability', 20),
            d.get('source', 'manual'),
            d.get('notes', ''),
        ))
        deal = cur.fetchone()
        conn.commit()

    return ok_response({'success': True, 'deal': deal})


def update_deal(conn, body):
    deal_id = body.get('id')
    updates = body.get('updates', {})
    if not deal_id or not updates:
        return error_response('Missing id or updates', 400)

    allowed = {
        'company_name', 'contact_person', 'phone', 'email', 'telegram_username',
        'telegram_chat_id', 'object_address', 'work_type', 'phase', 'budget',
        'probability', 'health', 'notes', 'bidzaar_purchase_id',
    }
    filtered = {k: v for k, v in updates.items() if k in allowed}
    if not filtered:
        return error_response('No valid fields to update', 400)

    filtered['updated_at'] = datetime.utcnow().isoformat()
    set_clause = ', '.join(f"{k} = %s" for k in filtered)
    values = list(filtered.values()) + [deal_id]

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(f"UPDATE evden_deals SET {set_clause} WHERE id = %s RETURNING *", values)
        deal = cur.fetchone()
        conn.commit()

    if not deal:
        return error_response('Deal not found', 404)

    return ok_response({'success': True, 'deal': deal})


def delete_deal(conn, deal_id):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM evden_impulses WHERE deal_id = %s", (deal_id,))
        cur.execute("DELETE FROM evden_comments WHERE deal_id = %s", (deal_id,))
        cur.execute("DELETE FROM evden_messages WHERE deal_id = %s", (deal_id,))
        cur.execute("DELETE FROM evden_deals WHERE id = %s", (deal_id,))
        conn.commit()
    return ok_response({'success': True})


# --------------------------------------------------------------- impulses --

def create_impulse(conn, body):
    d = body.get('data') or body
    title = (d.get('title') or '').strip()
    deal_id = d.get('deal_id')
    if not title or not deal_id:
        return error_response('title and deal_id are required', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO evden_impulses (deal_id, title, description, assignee, priority, status, due_date, source)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            deal_id,
            title,
            d.get('description', ''),
            d.get('assignee', 'Не назначен'),
            d.get('priority', 'medium'),
            d.get('status', 'open'),
            d.get('due_date'),
            d.get('source', 'manual'),
        ))
        impulse = cur.fetchone()
        conn.commit()

    return ok_response({'success': True, 'impulse': impulse})


def update_impulse(conn, body):
    impulse_id = body.get('id')
    updates = body.get('updates', {})
    if not impulse_id or not updates:
        return error_response('Missing id or updates', 400)

    allowed = {'title', 'description', 'assignee', 'priority', 'status', 'due_date'}
    filtered = {k: v for k, v in updates.items() if k in allowed}
    if not filtered:
        return error_response('No valid fields to update', 400)

    filtered['updated_at'] = datetime.utcnow().isoformat()
    set_clause = ', '.join(f"{k} = %s" for k in filtered)
    values = list(filtered.values()) + [impulse_id]

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(f"UPDATE evden_impulses SET {set_clause} WHERE id = %s RETURNING *", values)
        impulse = cur.fetchone()
        conn.commit()

    if not impulse:
        return error_response('Impulse not found', 404)

    return ok_response({'success': True, 'impulse': impulse})


def delete_impulse(conn, impulse_id):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM evden_impulses WHERE id = %s", (impulse_id,))
        conn.commit()
    return ok_response({'success': True})


# --------------------------------------------------------- comments + ai --

def create_comment(conn, body):
    d = body.get('data') or body
    deal_id = d.get('deal_id')
    text = (d.get('text') or '').strip()
    if not deal_id or not text:
        return error_response('deal_id and text are required', 400)

    analysis = analyze_comment_with_ai(text)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO evden_comments (deal_id, author, text, channel, tone, ai_summary)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            deal_id,
            d.get('author', 'Менеджер'),
            text,
            d.get('channel', 'internal'),
            analysis.get('tone', 'neutral'),
            analysis.get('summary', ''),
        ))
        comment = cur.fetchone()

        created_impulses = []
        for task_title in analysis.get('suggested_impulses', []):
            cur.execute("""
                INSERT INTO evden_impulses (deal_id, title, priority, status, source)
                VALUES (%s, %s, %s, 'open', 'ai_comment')
                RETURNING *
            """, (deal_id, task_title, analysis.get('priority', 'medium')))
            created_impulses.append(cur.fetchone())

        if analysis.get('risk_detected'):
            cur.execute("UPDATE evden_deals SET health = 'yellow', updated_at = NOW() WHERE id = %s AND health = 'green'", (deal_id,))

        conn.commit()

    return ok_response({
        'success': True,
        'comment': comment,
        'ai_analysis': analysis,
        'created_impulses': created_impulses,
    })


def call_yandex_gpt(system_prompt, user_text, max_tokens=400, temperature=0.2):
    """Вызывает YandexGPT (Yandex Cloud Foundation Models API) и возвращает текст ответа модели"""
    api_key = os.environ.get('YANDEXGPT_API_KEY')
    # Реальный folder ID, привязанный к сервисному аккаунту используемого API-ключа
    # (значение из секрета YANDEX_FOLDER_ID не совпадало — уточнено через ошибку API Yandex Cloud)
    folder_id = 'b1gklpmhbjtrd1etalgf'

    if not api_key:
        raise RuntimeError('YANDEXGPT_API_KEY not configured')

    req_body = json.dumps({
        'modelUri': f'gpt://{folder_id}/yandexgpt/latest',
        'completionOptions': {
            'stream': False,
            'temperature': temperature,
            'maxTokens': str(max_tokens),
        },
        'messages': [
            {'role': 'system', 'text': system_prompt},
            {'role': 'user', 'text': user_text},
        ],
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
        data=req_body,
        headers={
            'Authorization': f'Api-Key {api_key}',
            'Content-Type': 'application/json',
            'x-folder-id': folder_id,
        },
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    return result['result']['alternatives'][0]['message']['text']


def analyze_comment_with_ai(text):
    """Вызывает YandexGPT для анализа тональности комментария и извлечения задач"""
    fallback = {'tone': 'neutral', 'summary': '', 'suggested_impulses': [], 'risk_detected': False, 'priority': 'medium'}

    system_prompt = (
        "Ты аналитик CRM для инженерных изысканий и проектирования. "
        "Проанализируй комментарий по сделке и верни СТРОГО JSON без markdown-обёрток, без пояснений, только JSON вида:\n"
        '{"tone": "positive|neutral|negative", "summary": "краткое резюме на русском одним предложением", '
        '"suggested_impulses": ["список задач, если из текста явно следует действие, иначе пустой массив"], '
        '"risk_detected": true или false, "priority": "critical|high|medium|low"}'
    )

    try:
        content = call_yandex_gpt(system_prompt, text, max_tokens=400, temperature=0.2)
        content = content.strip().replace('```json', '').replace('```', '').strip()
        start = content.find('{')
        end = content.rfind('}')
        if start != -1 and end != -1:
            content = content[start:end + 1]
        parsed = json.loads(content)

        return {
            'tone': parsed.get('tone', 'neutral'),
            'summary': parsed.get('summary', ''),
            'suggested_impulses': parsed.get('suggested_impulses', []) or [],
            'risk_detected': bool(parsed.get('risk_detected', False)),
            'priority': parsed.get('priority', 'medium'),
        }
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode('utf-8', errors='ignore')
        print(f'[AI ERROR] HTTPError {exc.code}: {error_body[:500]}')
        return fallback
    except Exception as exc:
        print(f'[AI ERROR] {type(exc).__name__}: {exc}')
        return fallback


# --------------------------------------------------------------- voice ai --

def handle_voice_command(conn, body):
    """Распознаёт голосовую команду и выполняет действие в системе"""
    transcript = (body.get('transcript') or '').strip()
    if not transcript:
        return error_response('transcript is required', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id, company_name FROM evden_deals ORDER BY updated_at DESC LIMIT 30")
        deals_list = cur.fetchall()

    deals_context = '\n'.join(f"id={d['id']}: {d['company_name']}" for d in deals_list)

    system_prompt = (
        "Ты голосовой ассистент CRM «Неврон» для инженерных изысканий и проектирования. "
        "У пользователя есть список текущих сделок:\n" + deals_context + "\n\n"
        "Разбери голосовую команду и верни СТРОГО JSON без markdown, без пояснений, только JSON вида:\n"
        '{"action": "create_impulse|move_phase|none", '
        '"deal_id": <id сделки из списка или null>, '
        '"impulse_title": "<текст задачи, если action=create_impulse>", '
        '"new_phase": "ether|gravity|docking|foundation или null", '
        '"reply": "короткий голосовой ответ пользователю на русском"}'
    )

    try:
        content = call_yandex_gpt(system_prompt, transcript, max_tokens=400, temperature=0.2)
        content = content.strip().replace('```json', '').replace('```', '').strip()
        start = content.find('{')
        end = content.rfind('}')
        if start != -1 and end != -1:
            content = content[start:end + 1]
        parsed = json.loads(content)
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode('utf-8', errors='ignore')
        print(f'[VOICE AI ERROR] HTTPError {exc.code}: {error_body[:500]}')
        return ok_response({'success': False, 'reply': f'ИИ отклонил запрос: {exc.code}'})
    except Exception as exc:
        return ok_response({'success': False, 'reply': f'Не удалось распознать команду: {exc}'})

    action = parsed.get('action', 'none')
    deal_id = parsed.get('deal_id')
    executed = {}

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if action == 'create_impulse' and deal_id and parsed.get('impulse_title'):
            cur.execute("""
                INSERT INTO evden_impulses (deal_id, title, status, source)
                VALUES (%s, %s, 'open', 'voice')
                RETURNING *
            """, (deal_id, parsed['impulse_title']))
            executed['impulse'] = cur.fetchone()
            conn.commit()
        elif action == 'move_phase' and deal_id and parsed.get('new_phase') in PHASES:
            cur.execute("""
                UPDATE evden_deals SET phase = %s, updated_at = NOW() WHERE id = %s RETURNING *
            """, (parsed['new_phase'], deal_id))
            executed['deal'] = cur.fetchone()
            conn.commit()

    return ok_response({
        'success': True,
        'action': action,
        'reply': parsed.get('reply', 'Готово'),
        'executed': executed,
    })


# ---------------------------------------------------------------- stats --

def get_stats(conn):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT phase, COUNT(*) AS cnt FROM evden_deals GROUP BY phase")
        by_phase = {row['phase']: row['cnt'] for row in cur.fetchall()}

        cur.execute("SELECT COUNT(*) AS cnt FROM evden_deals")
        total_deals = cur.fetchone()['cnt']

        cur.execute("SELECT COALESCE(SUM(budget), 0) AS total FROM evden_deals")
        total_budget = cur.fetchone()['total']

        cur.execute("SELECT COUNT(*) AS cnt FROM evden_impulses WHERE status = 'done'")
        closed_impulses = cur.fetchone()['cnt']

        cur.execute("SELECT COUNT(*) AS cnt FROM evden_impulses WHERE status != 'done'")
        open_impulses = cur.fetchone()['cnt']

    return ok_response({
        'total_deals': total_deals,
        'total_budget': total_budget,
        'by_phase': by_phase,
        'closed_impulses': closed_impulses,
        'open_impulses': open_impulses,
    })


# ---------------------------------------------------------------- helpers --

def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def ok_response(data):
    return {
        'statusCode': 200,
        'headers': cors_headers(),
        'body': json.dumps(data, default=str),
        'isBase64Encoded': False,
    }


def error_response(message, status):
    return {
        'statusCode': status,
        'headers': cors_headers(),
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False,
    }