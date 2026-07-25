"""Модуль «Экипаж»: регистрация/вход, профили, ранги, приглашения, начисление очков, оргструктура, загрузка фото"""
import json
import os
import hashlib
import secrets
import base64
import uuid
from datetime import datetime, timedelta

import psycopg2
from psycopg2.extras import RealDictCursor
import boto3

ROLES = {
    'engineer': 'Инженер',
    'sales': 'Продажник',
    'accountant': 'Бухгалтер',
    'marketer': 'Маркетолог',
    'admin': 'Администратор',
    'lead': 'Руководитель',
    'universal': 'Универсал',
}

RANKS = [
    (0, 99, 'Курсант'),
    (100, 499, 'Младший офицер'),
    (500, 999, 'Офицер'),
    (1000, 4999, 'Старший офицер'),
    (5000, 19999, 'Капитан'),
    (20000, 10**12, 'Адмирал флота'),
]


def rank_for(points):
    for low, high, name in RANKS:
        if low <= points <= high:
            return name
    return 'Курсант'


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


def hash_pw(password):
    salt = 'deod_crew_salt_v1'
    return hashlib.sha256((salt + password).encode()).hexdigest()


def member_public(m, include_email=False):
    data = {
        'id': m['id'],
        'callsign': m['callsign'],
        'role': m['role'],
        'role_label': ROLES.get(m['role'], 'Универсал'),
        'department': m.get('department'),
        'points': m['points'],
        'rank': rank_for(m['points']),
        'avatar_url': m.get('avatar_url'),
        'motto': m.get('motto'),
        'suit_status': m.get('suit_status'),
        'position_title': m.get('position_title'),
        'parent_id': m.get('parent_id'),
        'is_admin': m['is_admin'],
        'is_online': m.get('is_online', False),
        'created_at': m.get('created_at'),
    }
    if include_email:
        data['email'] = m['email']
    return data


def require_admin(me):
    """Возвращает error-response если сотрудник не является супер-админом станции, иначе None."""
    if not me or not me.get('is_admin'):
        return err('Доступно только администратору станции', 403)
    return None


def get_member_by_token(conn, token):
    if not token:
        return None
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT m.* FROM crew_members m
            JOIN crew_sessions s ON s.member_id = m.id
            WHERE s.token = %s AND s.expires_at > NOW()
        """, (token,))
        return cur.fetchone()


def handler(event, context):
    """Обрабатывает регистрацию, вход, профили, список экипажа, баллы и приглашения раздела «Экипаж»"""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors(), 'body': '', 'isBase64Encoded': False}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        params = event.get('queryStringParameters') or {}
        headers = event.get('headers') or {}
        token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
        body = {}
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except Exception:
                body = {}
        action = body.get('action') or params.get('action')

        # public actions
        if action == 'register':
            return do_register(conn, body)
        if action == 'login':
            return do_login(conn, body)

        # authed actions
        me = get_member_by_token(conn, token)
        if not me:
            return err('Требуется авторизация', 401)

        # обновляем присутствие
        with conn.cursor() as cur:
            cur.execute("UPDATE crew_members SET is_online = TRUE, last_seen = NOW() WHERE id = %s", (me['id'],))
            conn.commit()

        if action == 'me':
            return ok({'member': member_public(me, include_email=True)})
        if action == 'list':
            return do_list(conn, params)
        if action == 'profile':
            return do_profile(conn, params.get('id'))
        if action == 'update_profile':
            return do_update_profile(conn, me, body)
        if action == 'points_history':
            return do_points_history(conn, params.get('id'))
        if action == 'add_points':
            return do_add_points(conn, me, body)
        if action == 'create_invite':
            return do_create_invite(conn, me, body)
        if action == 'list_invites':
            return do_list_invites(conn, me)
        if action == 'set_role':
            return do_set_role(conn, me, body)
        if action == 'org_tree':
            return do_org_tree(conn)
        if action == 'set_parent':
            return do_set_parent(conn, me, body)
        if action == 'set_position':
            return do_set_position(conn, me, body)
        if action == 'upload_avatar':
            return do_upload_avatar(conn, me, body)
        if action == 'logout':
            return do_logout(conn, token)

        return err('Неизвестное действие', 400)
    except Exception as exc:
        return err(str(exc), 500)
    finally:
        conn.close()


def do_register(conn, body):
    email = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''
    callsign = (body.get('callsign') or '').strip()
    invite_code = (body.get('invite_code') or '').strip()

    if not email or not password or not callsign:
        return err('Email, пароль и позывной обязательны', 400)
    if len(password) < 6:
        return err('Пароль минимум 6 символов', 400)

    role = 'universal'
    department = None
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id FROM crew_members WHERE email = %s", (email,))
        if cur.fetchone():
            return err('Сотрудник с таким email уже существует', 409)

        cur.execute("SELECT COUNT(*) AS c FROM crew_members")
        is_first = cur.fetchone()['c'] == 0

        invite = None
        if invite_code:
            cur.execute("SELECT * FROM crew_invitations WHERE code = %s", (invite_code,))
            invite = cur.fetchone()
            if not invite:
                return err('Приглашение не найдено', 404)
            if invite['expires_at'] and invite['expires_at'] < datetime.utcnow():
                return err('Срок приглашения истёк', 410)
            if invite['used_count'] >= invite['max_uses']:
                return err('Приглашение исчерпано', 410)
            role = invite['role'] or 'universal'
            department = invite['department']

        cur.execute("""
            INSERT INTO crew_members (email, password_hash, callsign, role, department, is_admin, is_online, last_seen)
            VALUES (%s, %s, %s, %s, %s, %s, TRUE, NOW())
            RETURNING *
        """, (email, hash_pw(password), callsign, role, department, is_first))
        member = cur.fetchone()

        if invite:
            cur.execute("UPDATE crew_invitations SET used_count = used_count + 1 WHERE id = %s", (invite['id'],))

        token = create_session(cur, member['id'])
        conn.commit()

    return ok({'member': member_public(member, include_email=True), 'token': token})


def do_login(conn, body):
    email = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''
    if not email or not password:
        return err('Email и пароль обязательны', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM crew_members WHERE email = %s", (email,))
        member = cur.fetchone()
        if not member or member['password_hash'] != hash_pw(password):
            return err('Неверный email или пароль', 401)

        cur.execute("UPDATE crew_members SET is_online = TRUE, last_seen = NOW() WHERE id = %s", (member['id'],))
        token = create_session(cur, member['id'])
        conn.commit()

    return ok({'member': member_public(member, include_email=True), 'token': token})


def create_session(cur, member_id):
    token = secrets.token_hex(32)
    expires = datetime.utcnow() + timedelta(days=30)
    cur.execute("INSERT INTO crew_sessions (member_id, token, expires_at) VALUES (%s, %s, %s)", (member_id, token, expires))
    return token


def do_list(conn, params):
    role = params.get('role')
    search = params.get('search')
    query = "SELECT * FROM crew_members WHERE 1=1"
    args = []
    if role and role != 'all':
        query += " AND role = %s"
        args.append(role)
    if search:
        query += " AND (callsign ILIKE %s OR department ILIKE %s)"
        args.extend([f'%{search}%', f'%{search}%'])
    query += " ORDER BY points DESC, callsign ASC"
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, args)
        members = cur.fetchall()
    return ok({'members': [member_public(m) for m in members]})


def do_profile(conn, member_id):
    if not member_id:
        return err('Не указан id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM crew_members WHERE id = %s", (member_id,))
        member = cur.fetchone()
        if not member:
            return err('Сотрудник не найден', 404)
        cur.execute("SELECT * FROM crew_achievements WHERE member_id = %s ORDER BY created_at DESC", (member_id,))
        achievements = cur.fetchall()
    return ok({'member': member_public(member), 'achievements': achievements})


def do_update_profile(conn, me, body):
    updates = {}
    for field in ['callsign', 'avatar_url', 'motto', 'suit_status', 'department']:
        if field in body and body[field] is not None:
            updates[field] = body[field]
    if not updates:
        return err('Нет полей для обновления', 400)
    set_clause = ', '.join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [me['id']]
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(f"UPDATE crew_members SET {set_clause} WHERE id = %s RETURNING *", values)
        member = cur.fetchone()
        conn.commit()
    return ok({'member': member_public(member, include_email=True)})


def do_points_history(conn, member_id):
    if not member_id:
        return err('Не указан id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT h.*, c.callsign AS by_callsign
            FROM crew_points_history h
            LEFT JOIN crew_members c ON c.id = h.created_by
            WHERE h.member_id = %s ORDER BY h.id DESC LIMIT 100
        """, (member_id,))
        history = cur.fetchall()
    return ok({'history': history})


def do_add_points(conn, me, body):
    if err_resp := require_admin(me):
        return err_resp
    member_id = body.get('member_id')
    delta = body.get('delta')
    reason = (body.get('reason') or '').strip()
    if not member_id or delta is None or not reason:
        return err('member_id, delta и reason обязательны', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("UPDATE crew_members SET points = GREATEST(0, points + %s) WHERE id = %s RETURNING *", (int(delta), member_id))
        member = cur.fetchone()
        if not member:
            return err('Сотрудник не найден', 404)
        cur.execute("""
            INSERT INTO crew_points_history (member_id, delta, reason, source, created_by)
            VALUES (%s, %s, %s, 'manual', %s)
        """, (member_id, int(delta), reason, me['id']))
        conn.commit()
    return ok({'member': member_public(member)})


def do_create_invite(conn, me, body):
    if err_resp := require_admin(me):
        return err_resp
    role = body.get('role') or 'universal'
    department = body.get('department')
    max_uses = int(body.get('max_uses') or 1)
    ttl_days = body.get('ttl_days')
    expires = None
    if ttl_days:
        expires = datetime.utcnow() + timedelta(days=int(ttl_days))
    code = secrets.token_urlsafe(8)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO crew_invitations (code, role, department, max_uses, expires_at, created_by)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING *
        """, (code, role, department, max_uses, expires, me['id']))
        invite = cur.fetchone()
        conn.commit()
    return ok({'invite': invite})


def do_list_invites(conn, me):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM crew_invitations ORDER BY id DESC LIMIT 50")
        invites = cur.fetchall()
    return ok({'invites': invites})


def do_set_role(conn, me, body):
    if err_resp := require_admin(me):
        return err_resp
    member_id = body.get('member_id')
    role = body.get('role')
    if not member_id or role not in ROLES:
        return err('Некорректные данные', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("UPDATE crew_members SET role = %s WHERE id = %s RETURNING *", (role, member_id))
        member = cur.fetchone()
        if not member:
            return err('Сотрудник не найден', 404)
        conn.commit()
    return ok({'member': member_public(member)})


def do_org_tree(conn):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM crew_members ORDER BY points DESC, callsign ASC")
        members = cur.fetchall()
    return ok({'members': [member_public(m) for m in members]})


def do_set_parent(conn, me, body):
    if err_resp := require_admin(me):
        return err_resp
    member_id = body.get('member_id')
    parent_id = body.get('parent_id')  # может быть None (снять руководителя)
    if not member_id:
        return err('Не указан member_id', 400)
    if parent_id and int(parent_id) == int(member_id):
        return err('Сотрудник не может подчиняться сам себе', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("UPDATE crew_members SET parent_id = %s WHERE id = %s RETURNING *", (parent_id, member_id))
        member = cur.fetchone()
        if not member:
            return err('Сотрудник не найден', 404)
        conn.commit()
    return ok({'member': member_public(member)})


def do_set_position(conn, me, body):
    member_id = body.get('member_id')
    if member_id and int(member_id) != int(me['id']):
        if err_resp := require_admin(me):
            return err_resp
    position = (body.get('position_title') or '').strip() or None
    department = body.get('department')
    if not member_id:
        return err('Не указан member_id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if department is not None:
            cur.execute("UPDATE crew_members SET position_title = %s, department = %s WHERE id = %s RETURNING *",
                        (position, department, member_id))
        else:
            cur.execute("UPDATE crew_members SET position_title = %s WHERE id = %s RETURNING *",
                        (position, member_id))
        member = cur.fetchone()
        if not member:
            return err('Сотрудник не найден', 404)
        conn.commit()
    return ok({'member': member_public(member)})


def do_upload_avatar(conn, me, body):
    data_url = body.get('image') or ''
    target_id = body.get('member_id') or me['id']
    if int(target_id) != int(me['id']):
        if err_resp := require_admin(me):
            return err_resp
    if not data_url:
        return err('Нет изображения', 400)
    if ',' in data_url:
        header, b64 = data_url.split(',', 1)
    else:
        header, b64 = 'image/png', data_url
    content_type = 'image/png'
    if 'image/jpeg' in header or 'image/jpg' in header:
        content_type = 'image/jpeg'
    elif 'image/webp' in header:
        content_type = 'image/webp'
    ext = {'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp'}[content_type]
    raw = base64.b64decode(b64)
    if len(raw) > 6 * 1024 * 1024:
        return err('Файл слишком большой (макс 6 МБ)', 400)

    key = f"crew/avatars/{uuid.uuid4().hex}.{ext}"
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)
    url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("UPDATE crew_members SET avatar_url = %s WHERE id = %s RETURNING *", (url, target_id))
        member = cur.fetchone()
        conn.commit()
    return ok({'member': member_public(member), 'url': url})


def do_logout(conn, token):
    with conn.cursor() as cur:
        cur.execute("UPDATE crew_members SET is_online = FALSE WHERE id = (SELECT member_id FROM crew_sessions WHERE token = %s)", (token,))
        conn.commit()
    return ok({'ok': True})