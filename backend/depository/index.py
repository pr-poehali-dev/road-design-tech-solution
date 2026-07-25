"""Голографический депозитарий: папки, файлы (S3), теги, поиск, ИИ-автотеги и смысловой поиск"""
import json
import os
import base64
import uuid
import re

import psycopg2
from psycopg2.extras import RealDictCursor
import boto3


def cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def ok(data, status=200):
    return {'statusCode': status, 'headers': cors(), 'body': json.dumps(data, default=str), 'isBase64Encoded': False}


def err(message, status=400):
    return {'statusCode': status, 'headers': cors(), 'body': json.dumps({'error': message}), 'isBase64Encoded': False}


def auth(conn, token):
    if not token:
        return None
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT m.* FROM crew_members m
            JOIN crew_sessions s ON s.member_id = m.id
            WHERE s.token = %s AND s.expires_at > NOW()
        """, (token,))
        return cur.fetchone()


def s3_client():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def cdn_url(key):
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def log_activity(cur, file_id, member_id, action, details=None):
    cur.execute(
        "INSERT INTO depo_activity (file_id, member_id, action, details) VALUES (%s, %s, %s, %s)",
        (file_id, member_id, action, details),
    )


def folder_path(conn, folder_id):
    """Строит полный путь папки вида /Казначейство/Проект/Договоры"""
    if not folder_id:
        return '/'
    parts = []
    fid = folder_id
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        for _ in range(20):
            cur.execute("SELECT id, name, parent_id FROM depo_folders WHERE id = %s", (fid,))
            row = cur.fetchone()
            if not row:
                break
            parts.append(row['name'])
            fid = row['parent_id']
            if not fid:
                break
    return '/' + '/'.join(reversed(parts))


def handler(event, context):
    """CRUD папок и файлов депозитария, загрузка/скачивание, поиск и ИИ-функции"""
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
        action = body.get('action') or params.get('action')

        if action == 'folders':
            return list_folders(conn, params)
        if action == 'files':
            return list_files(conn, params)
        if action == 'file':
            return get_file(conn, params)
        if action == 'create_folder':
            return create_folder(conn, me, body)
        if action == 'upload':
            return upload_file(conn, me, body)
        if action == 'update_file':
            return update_file(conn, me, body)
        if action == 'trash_file':
            return trash_file(conn, me, body)
        if action == 'restore_file':
            return restore_file(conn, me, body)
        if action == 'search':
            return search_files(conn, params)
        if action == 'ai_search':
            return ai_search(conn, params)
        if action == 'recent':
            return recent_files(conn, params)
        if action == 'save_from_chat':
            return save_from_chat(conn, me, body)
        if action == 'activity':
            return get_activity(conn, params)

        return err('Неизвестное действие', 400)
    except Exception as exc:
        return err(str(exc), 500)
    finally:
        conn.close()


def list_folders(conn, params):
    parent = params.get('parent_id')
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if parent in (None, '', 'null', 'root'):
            cur.execute("SELECT * FROM depo_folders WHERE parent_id IS NULL ORDER BY kind DESC, name ASC")
        else:
            cur.execute("SELECT * FROM depo_folders WHERE parent_id = %s ORDER BY kind DESC, name ASC", (int(parent),))
        folders = cur.fetchall()
        # count files per folder
        for f in folders:
            cur.execute("SELECT COUNT(*) AS c FROM depo_files WHERE folder_id = %s AND is_trashed = FALSE", (f['id'],))
            f['file_count'] = cur.fetchone()['c']
            cur.execute("SELECT COUNT(*) AS c FROM depo_folders WHERE parent_id = %s", (f['id'],))
            f['sub_count'] = cur.fetchone()['c']
    return ok({'folders': folders})


def list_files(conn, params):
    folder_id = params.get('folder_id')
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if folder_id in (None, '', 'null', 'root'):
            cur.execute("SELECT * FROM depo_files WHERE folder_id IS NULL AND is_trashed = FALSE ORDER BY updated_at DESC")
        else:
            cur.execute("SELECT * FROM depo_files WHERE folder_id = %s AND is_trashed = FALSE ORDER BY updated_at DESC", (int(folder_id),))
        files = cur.fetchall()
    path = folder_path(conn, int(folder_id)) if folder_id and folder_id not in ('root', 'null') else '/'
    return ok({'files': files, 'path': path})


def get_file(conn, params):
    fid = params.get('id')
    if not fid:
        return err('Не указан id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT f.*, m.callsign AS owner_name FROM depo_files f
            LEFT JOIN crew_members m ON m.id = f.owner_id WHERE f.id = %s
        """, (int(fid),))
        f = cur.fetchone()
        if not f:
            return err('Файл не найден', 404)
    f['path'] = folder_path(conn, f['folder_id'])
    return ok({'file': f})


def create_folder(conn, me, body):
    name = (body.get('name') or '').strip()
    parent_id = body.get('parent_id')
    kind = body.get('kind') or 'folder'
    if not name:
        return err('Укажите название папки', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "INSERT INTO depo_folders (name, parent_id, kind, owner_id) VALUES (%s, %s, %s, %s) RETURNING *",
            (name, parent_id if parent_id else None, kind, me['id']),
        )
        folder = cur.fetchone()
        conn.commit()
    return ok({'folder': folder})


MAX_SIZE = 30 * 1024 * 1024


def upload_file(conn, me, body):
    name = (body.get('name') or 'file').strip()
    folder_id = body.get('folder_id')
    data_url = body.get('data') or ''
    mime = body.get('mime') or 'application/octet-stream'
    description = body.get('description') or ''
    tags = body.get('tags') or []
    if not data_url:
        return err('Нет данных файла', 400)

    if ',' in data_url:
        _, b64 = data_url.split(',', 1)
    else:
        b64 = data_url
    raw = base64.b64decode(b64)
    if len(raw) > MAX_SIZE:
        return err('Файл превышает 30 МБ', 400)

    ext = ''
    if '.' in name:
        ext = name.rsplit('.', 1)[-1].lower()[:8]
    key = f"depository/{uuid.uuid4().hex}{('.' + ext) if ext else ''}"
    s3_client().put_object(Bucket='files', Key=key, Body=raw, ContentType=mime)
    url = cdn_url(key)

    # извлечение текста для поиска (только текстовые форматы)
    text_content = ''
    if mime.startswith('text/') or ext in ('txt', 'md', 'csv', 'json', 'xml', 'log'):
        try:
            text_content = raw.decode('utf-8', errors='ignore')[:20000]
        except Exception:
            text_content = ''

    # ИИ-автотеги
    ai_tags, ai_summary = ai_autotag(name, text_content, mime)
    all_tags = list(dict.fromkeys([*tags, *ai_tags]))

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO depo_files (folder_id, name, url, mime, size_bytes, description, tags, ai_summary, text_content, owner_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *
        """, (folder_id if folder_id else None, name, url, mime, len(raw), description, all_tags, ai_summary, text_content, me['id']))
        f = cur.fetchone()
        log_activity(cur, f['id'], me['id'], 'upload', name)
        conn.commit()
    f['path'] = folder_path(conn, f['folder_id'])
    return ok({'file': f})


def save_from_chat(conn, me, body):
    """Сохраняет файл из чата (по URL) в депозитарий без повторной загрузки в S3"""
    name = (body.get('name') or 'file').strip()
    url = body.get('url') or ''
    mime = body.get('mime') or 'application/octet-stream'
    size = body.get('size') or 0
    folder_id = body.get('folder_id')
    tags = body.get('tags') or []
    if not url:
        return err('Нет ссылки на файл', 400)
    ai_tags, ai_summary = ai_autotag(name, '', mime)
    all_tags = list(dict.fromkeys([*tags, *ai_tags]))
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO depo_files (folder_id, name, url, mime, size_bytes, tags, ai_summary, owner_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *
        """, (folder_id if folder_id else None, name, url, mime, size, all_tags, ai_summary, me['id']))
        f = cur.fetchone()
        log_activity(cur, f['id'], me['id'], 'save_from_chat', name)
        conn.commit()
    f['path'] = folder_path(conn, f['folder_id'])
    return ok({'file': f})


def update_file(conn, me, body):
    fid = body.get('id')
    if not fid:
        return err('Не указан id', 400)
    updates = {}
    if 'name' in body:
        updates['name'] = body['name']
    if 'description' in body:
        updates['description'] = body['description']
    if 'tags' in body:
        updates['tags'] = body['tags']
    if 'folder_id' in body:
        updates['folder_id'] = body['folder_id'] if body['folder_id'] else None
    if 'is_public' in body:
        updates['is_public'] = bool(body['is_public'])
    if not updates:
        return err('Нет изменений', 400)
    set_parts = ', '.join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [int(fid)]
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(f"UPDATE depo_files SET {set_parts}, updated_at = NOW() WHERE id = %s RETURNING *", values)
        f = cur.fetchone()
        if not f:
            return err('Файл не найден', 404)
        log_activity(cur, f['id'], me['id'], 'update')
        conn.commit()
    f['path'] = folder_path(conn, f['folder_id'])
    return ok({'file': f})


def trash_file(conn, me, body):
    fid = body.get('id')
    if not fid:
        return err('Не указан id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("UPDATE depo_files SET is_trashed = TRUE WHERE id = %s RETURNING id", (int(fid),))
        row = cur.fetchone()
        if not row:
            return err('Файл не найден', 404)
        log_activity(cur, int(fid), me['id'], 'trash')
        conn.commit()
    return ok({'ok': True})


def restore_file(conn, me, body):
    fid = body.get('id')
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("UPDATE depo_files SET is_trashed = FALSE WHERE id = %s RETURNING id", (int(fid),))
        conn.commit()
    return ok({'ok': True})


def search_files(conn, params):
    q = (params.get('q') or '').strip()
    if not q:
        return ok({'files': []})
    like = f'%{q}%'
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT * FROM depo_files
            WHERE is_trashed = FALSE
              AND (name ILIKE %s OR description ILIKE %s OR text_content ILIKE %s
                   OR array_to_string(tags, ' ') ILIKE %s)
            ORDER BY updated_at DESC LIMIT 100
        """, (like, like, like, like))
        files = cur.fetchall()
    for f in files:
        f['path'] = folder_path(conn, f['folder_id'])
    return ok({'files': files})


def recent_files(conn, params):
    limit = int(params.get('limit') or 8)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM depo_files WHERE is_trashed = FALSE ORDER BY updated_at DESC LIMIT %s", (limit,))
        files = cur.fetchall()
    for f in files:
        f['path'] = folder_path(conn, f['folder_id'])
    return ok({'files': files})


def get_activity(conn, params):
    fid = params.get('file_id')
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT a.*, m.callsign FROM depo_activity a
            LEFT JOIN crew_members m ON m.id = a.member_id
            WHERE a.file_id = %s ORDER BY a.id DESC LIMIT 50
        """, (int(fid),))
        rows = cur.fetchall()
    return ok({'activity': rows})


# ---------- ИИ ----------

def _openai_chat(messages, max_tokens=300):
    """Обращается к LLM через OpenRouter (доступен из РФ)."""
    api_key = os.environ.get('OPENROUTER_API_KEY', '')
    if not api_key:
        return None
    try:
        import httpx
        resp = httpx.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://poehali.dev',
                'X-Title': 'DEOD Depository',
            },
            json={
                'model': 'deepseek/deepseek-chat',
                'messages': messages,
                'max_tokens': max_tokens,
                'temperature': 0.2,
            },
            timeout=30.0,
        )
        result = resp.json()
        if 'choices' not in result:
            return None
        return result['choices'][0]['message']['content']
    except Exception:
        return None


def ai_autotag(name, text, mime):
    """Возвращает (tags, summary). Быстрый эвристический анализ + GPT при наличии текста."""
    tags = []
    lname = name.lower()
    heur = {
        'договор': 'договор', 'contract': 'договор', 'смет': 'смета', 'счет': 'счёт',
        'счёт': 'счёт', 'акт': 'акт', 'отчет': 'отчёт', 'отчёт': 'отчёт',
        'презентац': 'презентация', 'чертеж': 'чертёж', 'чертёж': 'чертёж',
        'invoice': 'счёт', 'report': 'отчёт',
    }
    for k, v in heur.items():
        if k in lname and v not in tags:
            tags.append(v)
    if mime.startswith('image/'):
        tags.append('изображение')
    elif mime.startswith('video/'):
        tags.append('видео')
    elif 'pdf' in mime:
        tags.append('pdf')

    summary = ''
    snippet = (text or '')[:4000]
    if snippet.strip():
        out = _openai_chat([
            {'role': 'system', 'content': 'Ты классификатор документов. Верни строго JSON {"tags": ["..."], "summary": "одно предложение по-русски"}. Теги — 2-5 коротких русских слов: тип документа, тема, контрагент/сумма если есть.'},
            {'role': 'user', 'content': f'Файл: {name}\nСодержимое:\n{snippet}'},
        ], max_tokens=200)
        if out:
            try:
                m = re.search(r'\{.*\}', out, re.S)
                parsed = json.loads(m.group(0)) if m else {}
                for t in parsed.get('tags', [])[:5]:
                    if isinstance(t, str) and t.strip() and t.strip() not in tags:
                        tags.append(t.strip())
                summary = parsed.get('summary', '') or ''
            except Exception:
                pass
    return tags[:8], summary


STOP_WORDS = {
    'и', 'в', 'на', 'по', 'с', 'со', 'за', 'от', 'до', 'для', 'о', 'об', 'к', 'у',
    'где', 'все', 'весь', 'вся', 'что', 'как', 'найди', 'найти', 'покажи', 'показать',
    'мне', 'файл', 'файлы', 'документ', 'документы', 'а', 'но', 'или', 'этот', 'эта',
    'прошлый', 'этом', 'году', 'год',
}


def _fallback_keywords(q):
    words = re.findall(r'[\wа-яёА-ЯЁ]{3,}', q.lower())
    kws = [w for w in words if w not in STOP_WORDS]
    return kws or [q]


def ai_search(conn, params):
    """Смысловой поиск: GPT формирует ключевые слова, затем полнотекстовый поиск по БД.
    Если ИИ недоступен — запрос разбивается на значимые слова (без стоп-слов)."""
    q = (params.get('q') or '').strip()
    if not q:
        return ok({'files': [], 'interpreted': ''})
    keywords = _fallback_keywords(q)
    interpreted = q
    used_ai = False
    out = _openai_chat([
        {'role': 'system', 'content': 'Пользователь ищет файлы в хранилище. Из запроса извлеки ключевые слова для поиска. Верни строго JSON {"keywords": ["слово1","слово2"], "interpreted": "краткая интерпретация запроса"}. Только по-русски.'},
        {'role': 'user', 'content': q},
    ], max_tokens=150)
    if out:
        try:
            m = re.search(r'\{.*\}', out, re.S)
            parsed = json.loads(m.group(0)) if m else {}
            kws = [k for k in parsed.get('keywords', []) if isinstance(k, str) and k.strip()]
            if kws:
                keywords = kws
                used_ai = True
            interpreted = parsed.get('interpreted', q) or q
        except Exception:
            pass

    conds = []
    args = []
    for kw in keywords[:6]:
        like = f'%{kw}%'
        conds.append("(name ILIKE %s OR description ILIKE %s OR text_content ILIKE %s OR array_to_string(tags, ' ') ILIKE %s)")
        args.extend([like, like, like, like])
    where = ' OR '.join(conds) if conds else 'TRUE'
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(f"SELECT * FROM depo_files WHERE is_trashed = FALSE AND ({where}) ORDER BY updated_at DESC LIMIT 100", args)
        files = cur.fetchall()
    for f in files:
        f['path'] = folder_path(conn, f['folder_id'])
    return ok({'files': files, 'interpreted': interpreted, 'keywords': keywords, 'ai': used_ai})