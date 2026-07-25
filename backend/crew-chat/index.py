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
            return get_messages(conn, params, me)

        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
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
