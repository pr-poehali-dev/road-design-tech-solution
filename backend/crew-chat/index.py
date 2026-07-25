"""Чат «Межзвездная связь»: реальные сообщения между сотрудниками экипажа, каналы, polling"""
import json
import os

import psycopg2
from psycopg2.extras import RealDictCursor


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
            SELECT m.id, m.callsign, m.avatar_url, m.role FROM crew_members m
            JOIN crew_sessions s ON s.member_id = m.id
            WHERE s.token = %s AND s.expires_at > NOW()
        """, (token,))
        return cur.fetchone()


def handler(event, context):
    """Возвращает и принимает сообщения чата «Межзвездная связь» с привязкой к сотруднику и каналу"""
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

        if method == 'GET':
            action = params.get('action', 'messages')
            if action == 'channels':
                return get_channels(conn)
            if action == 'recipients':
                return get_recipients(conn, me)
            if action == 'dm':
                return get_dm(conn, params, me)
            return get_messages(conn, params, me)

        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            if body.get('recipient_id'):
                return send_dm(conn, body, me)
            return send_message(conn, body, me)

        return err('Метод не поддерживается', 405)
    except Exception as exc:
        return err(str(exc), 500)
    finally:
        conn.close()


def get_channels(conn):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM crew_channels ORDER BY sort_order ASC")
        channels = cur.fetchall()
        cur.execute("SELECT COUNT(*) AS c FROM crew_members WHERE is_online = TRUE")
        online = cur.fetchone()['c']
    return ok({'channels': channels, 'online': online})


def get_messages(conn, params, me):
    channel_slug = params.get('channel', 'general')
    after_id = int(params.get('after') or 0)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id FROM crew_channels WHERE slug = %s", (channel_slug,))
        ch = cur.fetchone()
        if not ch:
            return err('Канал не найден', 404)
        cur.execute("""
            SELECT msg.id, msg.text, msg.created_at, msg.member_id,
                   m.callsign, m.avatar_url, m.role
            FROM crew_messages msg
            JOIN crew_members m ON m.id = msg.member_id
            WHERE msg.channel_id = %s AND msg.id > %s
            ORDER BY msg.id ASC
            LIMIT 200
        """, (ch['id'], after_id))
        rows = cur.fetchall()
    messages = [{
        'id': r['id'],
        'text': r['text'],
        'created_at': r['created_at'],
        'member_id': r['member_id'],
        'callsign': r['callsign'],
        'avatar_url': r['avatar_url'],
        'role': r['role'],
        'mine': r['member_id'] == me['id'],
    } for r in rows]
    return ok({'messages': messages})


def send_message(conn, body, me):
    channel_slug = body.get('channel', 'general')
    text = (body.get('text') or '').strip()
    if not text:
        return err('Пустое сообщение', 400)
    if len(text) > 2000:
        text = text[:2000]
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id FROM crew_channels WHERE slug = %s", (channel_slug,))
        ch = cur.fetchone()
        if not ch:
            return err('Канал не найден', 404)
        cur.execute("""
            INSERT INTO crew_messages (channel_id, member_id, text)
            VALUES (%s, %s, %s) RETURNING id, text, created_at
        """, (ch['id'], me['id'], text))
        msg = cur.fetchone()
        # +2 балла за активность в чате (базовое авто-начисление)
        cur.execute("UPDATE crew_members SET points = points + 2, last_seen = NOW(), is_online = TRUE WHERE id = %s", (me['id'],))
        cur.execute("""
            INSERT INTO crew_points_history (member_id, delta, reason, source)
            VALUES (%s, 2, 'Активность в Межзвездной связи', 'chat')
        """, (me['id'],))
        conn.commit()
    return ok({'message': {
        'id': msg['id'],
        'text': msg['text'],
        'created_at': msg['created_at'],
        'member_id': me['id'],
        'callsign': me['callsign'],
        'avatar_url': me['avatar_url'],
        'role': me['role'],
        'mine': True,
    }})


def get_recipients(conn, me):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, callsign, avatar_url, role, is_online
            FROM crew_members WHERE id <> %s ORDER BY is_online DESC, callsign ASC
        """, (me['id'],))
        people = cur.fetchall()
        cur.execute("""
            SELECT sender_id, COUNT(*) AS c FROM crew_dm
            WHERE recipient_id = %s AND is_read = FALSE GROUP BY sender_id
        """, (me['id'],))
        unread = {r['sender_id']: r['c'] for r in cur.fetchall()}
    for p in people:
        p['unread'] = unread.get(p['id'], 0)
    return ok({'recipients': people})


def get_dm(conn, params, me):
    other_id = int(params.get('with') or 0)
    after_id = int(params.get('after') or 0)
    if not other_id:
        return err('Не указан собеседник', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT d.id, d.text, d.created_at, d.sender_id, d.recipient_id,
                   m.callsign, m.avatar_url, m.role
            FROM crew_dm d JOIN crew_members m ON m.id = d.sender_id
            WHERE ((d.sender_id = %s AND d.recipient_id = %s)
                OR (d.sender_id = %s AND d.recipient_id = %s))
              AND d.id > %s
            ORDER BY d.id ASC LIMIT 300
        """, (me['id'], other_id, other_id, me['id'], after_id))
        rows = cur.fetchall()
        # пометить входящие как прочитанные
        cur.execute("UPDATE crew_dm SET is_read = TRUE WHERE recipient_id = %s AND sender_id = %s AND is_read = FALSE",
                    (me['id'], other_id))
        conn.commit()
    messages = [{
        'id': r['id'],
        'text': r['text'],
        'created_at': r['created_at'],
        'member_id': r['sender_id'],
        'callsign': r['callsign'],
        'avatar_url': r['avatar_url'],
        'role': r['role'],
        'mine': r['sender_id'] == me['id'],
    } for r in rows]
    return ok({'messages': messages})


def send_dm(conn, body, me):
    recipient_id = int(body.get('recipient_id'))
    text = (body.get('text') or '').strip()
    if not text:
        return err('Пустое сообщение', 400)
    if len(text) > 2000:
        text = text[:2000]
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id FROM crew_members WHERE id = %s", (recipient_id,))
        if not cur.fetchone():
            return err('Получатель не найден', 404)
        cur.execute("""
            INSERT INTO crew_dm (sender_id, recipient_id, text) VALUES (%s, %s, %s)
            RETURNING id, text, created_at
        """, (me['id'], recipient_id, text))
        msg = cur.fetchone()
        cur.execute("UPDATE crew_members SET points = points + 2, last_seen = NOW(), is_online = TRUE WHERE id = %s", (me['id'],))
        cur.execute("""
            INSERT INTO crew_points_history (member_id, delta, reason, source)
            VALUES (%s, 2, 'Личное сообщение в Межзвездной связи', 'chat')
        """, (me['id'],))
        conn.commit()
    return ok({'message': {
        'id': msg['id'],
        'text': msg['text'],
        'created_at': msg['created_at'],
        'member_id': me['id'],
        'callsign': me['callsign'],
        'avatar_url': me['avatar_url'],
        'role': me['role'],
        'mine': True,
    }})