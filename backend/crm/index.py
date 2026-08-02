"""API для CRM системы партнеров с партнерской сетью"""
import json
import os
import hashlib
import string
import random
import base64
import uuid
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
import boto3


# Grade configuration: (min_turnover, grade_name, personal_%, line1_%, line2_%, line3_%, line4_%)
GRADES = [
    (75_000_000, 'Амбассадор',          18, 0.5, 1.5, 3, 7),
    (40_000_000, 'Генеральный партнёр', 15, 1.5, 3,   5, 8),
    (25_000_000, 'Старший партнёр',     12, 3,   5,   8, 0),
    (10_000_000, 'Партнёр',             10, 5,   8,   0, 0),
    (0,          'Агент',                8,  0,   0,   0, 0),
]

FIRST_DEAL_PERSONAL_PERCENT = 16


def handler(event, context):
    """Обработка запросов к CRM"""
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
        else:
            return error_response('Method not allowed', 405)
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        conn.close()


# ------------------------------------------------------------------ routing --

def handle_get(event, conn):
    """GET запросы"""
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'clients')

    if resource == 'profile':
        partner_id = _parse_partner_id(params.get('partner_id'))
        if isinstance(partner_id, dict):
            return partner_id
        return get_profile(conn, partner_id)

    if resource == 'network':
        partner_id = _parse_partner_id(params.get('partner_id'))
        if isinstance(partner_id, dict):
            return partner_id
        return get_network(conn, partner_id)

    partner_id = _parse_partner_id(params.get('partner_id'))
    if isinstance(partner_id, dict):
        return partner_id

    if resource == 'clients':
        return get_clients(conn, partner_id, params)
    elif resource == 'client':
        client_id = params.get('id')
        return get_client_details(conn, partner_id, client_id)
    elif resource == 'tasks':
        return get_tasks(conn, partner_id)
    elif resource == 'activities':
        return get_activities(conn, partner_id, params)
    elif resource == 'stats':
        return get_partner_stats(conn, partner_id)
    elif resource == 'stages':
        return get_stages(conn, partner_id)
    elif resource == 'contacts':
        return get_contacts(conn, partner_id, params.get('client_id'))
    elif resource == 'documents':
        return get_documents(conn, partner_id, params.get('client_id'))
    elif resource == 'custom_fields':
        return get_custom_fields(conn, partner_id)
    elif resource == 'analytics':
        return get_analytics(conn, partner_id)

    return error_response('Unknown resource', 400)


def handle_post(event, conn):
    """POST запросы: создание + auth"""
    body = json.loads(event.get('body', '{}'))
    resource = body.get('resource')

    if resource == 'register':
        return register_partner(conn, body)
    if resource == 'login':
        return login_partner(conn, body)
    if resource == 'crew_login':
        headers = event.get('headers') or {}
        token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
        return crew_login(conn, token)
    if resource == 'profile':
        partner_id = _parse_partner_id(body.get('partner_id'))
        if isinstance(partner_id, dict):
            return partner_id
        return get_profile(conn, partner_id)

    partner_id = _parse_partner_id(body.get('partner_id'))
    if isinstance(partner_id, dict):
        return partner_id

    if resource == 'client':
        return create_client(conn, partner_id, body)
    elif resource == 'task':
        return create_task(conn, partner_id, body)
    elif resource == 'activity':
        return create_activity(conn, partner_id, body)
    elif resource == 'stage':
        return create_stage(conn, partner_id, body)
    elif resource == 'contact':
        return create_contact(conn, partner_id, body)
    elif resource == 'document':
        return create_document(conn, partner_id, body)
    elif resource == 'upload_document':
        return upload_document(conn, partner_id, body)
    elif resource == 'custom_field':
        return create_custom_field(conn, partner_id, body)
    elif resource == 'custom_field_value':
        return set_custom_field_value(conn, partner_id, body)
    elif resource == 'bulk_import':
        return bulk_import_clients(conn, partner_id, body)

    return error_response('Unknown resource', 400)


def handle_put(event, conn):
    """PUT запросы: обновление"""
    body = json.loads(event.get('body', '{}'))
    resource = body.get('resource')

    partner_id = _parse_partner_id(body.get('partner_id'))
    if isinstance(partner_id, dict):
        return partner_id

    if resource == 'client':
        return update_client(conn, partner_id, body)
    elif resource == 'task':
        return update_task(conn, partner_id, body)
    elif resource == 'stage':
        return update_stage(conn, partner_id, body)
    elif resource == 'stages_reorder':
        return reorder_stages(conn, partner_id, body)
    elif resource == 'contact':
        return update_contact(conn, partner_id, body)

    return error_response('Unknown resource', 400)


def handle_delete(event, conn):
    """DELETE запросы"""
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource')
    item_id = params.get('id')

    partner_id = _parse_partner_id(params.get('partner_id'))
    if isinstance(partner_id, dict):
        return partner_id

    if not item_id:
        return error_response('Missing id', 400)

    if resource == 'client':
        return delete_client(conn, partner_id, item_id)
    elif resource == 'task':
        return delete_task(conn, partner_id, item_id)
    elif resource == 'stage':
        return delete_stage(conn, partner_id, item_id)
    elif resource == 'contact':
        return delete_contact(conn, partner_id, item_id)
    elif resource == 'document':
        return delete_document(conn, partner_id, item_id)

    return error_response('Unknown resource', 400)


# -------------------------------------------------------------------- auth --

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def generate_invite_code():
    """Generate random 8-character uppercase alphanumeric invite code"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=8))


def register_partner(conn, body):
    """Register a new partner in the network"""
    name = (body.get('name') or '').strip()
    phone = (body.get('phone') or '').strip()
    password = (body.get('password') or '').strip()
    email = (body.get('email') or '').strip()
    company = (body.get('company') or '').strip()
    invite_code_ref = (body.get('invite_code') or '').strip()

    if not name or not phone or not password:
        return error_response('name, phone and password are required', 400)

    password_hash = hash_password(password)
    new_invite_code = generate_invite_code()
    parent_id = None

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Check duplicate phone
        cur.execute("SELECT id FROM users WHERE phone = %s", (phone,))
        if cur.fetchone():
            return error_response('User with this phone already exists', 409)

        # Ensure unique invite code
        while True:
            cur.execute("SELECT id FROM users WHERE invite_code = %s", (new_invite_code,))
            if not cur.fetchone():
                break
            new_invite_code = generate_invite_code()

        # Resolve parent from referral invite code
        if invite_code_ref:
            cur.execute("SELECT id FROM users WHERE invite_code = %s", (invite_code_ref,))
            parent_row = cur.fetchone()
            if parent_row:
                parent_id = parent_row['id']

        cur.execute("""
            INSERT INTO users (
                name, phone, password_hash, email, company,
                invite_code, parent_id, grade, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING id, name, phone, email, company, invite_code,
                      parent_id, grade, created_at
        """, (
            name, phone, password_hash, email, company,
            new_invite_code, parent_id, 'Агент'
        ))

        user = cur.fetchone()
        conn.commit()

        return ok_response({'success': True, 'user': user})


def login_partner(conn, body):
    """Authenticate partner by phone + password"""
    phone = (body.get('phone') or '').strip()
    password = (body.get('password') or '').strip()

    if not phone or not password:
        return error_response('phone and password are required', 400)

    password_hash = hash_password(password)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, name, phone, email, company, invite_code, parent_id,
                   grade, is_admin, created_at, asset, expected_income
            FROM users
            WHERE phone = %s AND password_hash = %s
        """, (phone, password_hash))

        user = cur.fetchone()
        if not user:
            return error_response('Invalid phone or password', 401)

        cur.execute(
            "UPDATE users SET is_online = true, last_seen = NOW() WHERE id = %s",
            (user['id'],)
        )
        conn.commit()

        return ok_response({'success': True, 'user': user})


def crew_login(conn, token):
    """Автоматический вход в CRM для сотрудников станции DEOD (без пароля).

    Принимает crew-токен (сессия /deod.space), проверяет его в crew_sessions,
    находит существующего CRM-партнёра по email сотрудника или создаёт нового
    (доступ считается служебным — is_admin=true, пароль не используется).
    """
    if not token:
        return error_response('Missing crew token', 401)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT m.id, m.email, m.callsign, m.is_admin
            FROM crew_members m
            JOIN crew_sessions s ON s.member_id = m.id
            WHERE s.token = %s AND s.expires_at > NOW()
        """, (token,))
        member = cur.fetchone()

        if not member:
            return error_response('Invalid or expired crew session', 401)

        email = (member.get('email') or '').strip()

        user = None
        if email:
            cur.execute("""
                SELECT id, name, phone, email, company, invite_code, parent_id,
                       grade, is_admin, created_at, asset, expected_income
                FROM users
                WHERE email = %s
            """, (email,))
            user = cur.fetchone()

        if not user:
            new_invite_code = generate_invite_code()
            while True:
                cur.execute("SELECT id FROM users WHERE invite_code = %s", (new_invite_code,))
                if not cur.fetchone():
                    break
                new_invite_code = generate_invite_code()

            placeholder_phone = f"crew-{member['id']}"

            cur.execute("""
                INSERT INTO users (
                    name, phone, email, company, invite_code,
                    grade, is_admin, created_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (phone) DO NOTHING
                RETURNING id, name, phone, email, company, invite_code,
                          parent_id, grade, is_admin, created_at, asset, expected_income
            """, (
                member['callsign'], placeholder_phone, email or None, 'DEOD',
                new_invite_code, 'Сотрудник УК', bool(member.get('is_admin'))
            ))
            user = cur.fetchone()
            conn.commit()

        cur.execute(
            "UPDATE users SET is_online = true, last_seen = NOW() WHERE id = %s",
            (user['id'],)
        )
        conn.commit()

        return ok_response({'success': True, 'user': user})


def get_profile(conn, partner_id):
    """Return user profile with invite_code"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, name, phone, email, company, invite_code, parent_id,
                   grade, is_admin, created_at, asset, expected_income
            FROM users
            WHERE id = %s
        """, (partner_id,))

        user = cur.fetchone()
        if not user:
            return error_response('User not found', 404)

        return ok_response({'user': user})


# ----------------------------------------------------------------- clients --

def get_clients(conn, partner_id, params):
    """Получить клиентов партнера (с revenue-полями, ЛПР и ближайшей открытой задачей)"""
    stage = params.get('stage')

    query = """
        SELECT
            c.*, c.contact_person AS contact_name,
            COUNT(DISTINCT a.id) AS activities_count,
            COUNT(DISTINCT t.id) AS tasks_count,
            dm.full_name AS decision_maker_name,
            dm.phone AS decision_maker_phone,
            nt.id AS open_task_id,
            nt.title AS open_task_title,
            nt.due_date AS open_task_due_date,
            nt.status AS open_task_status
        FROM crm_clients c
        LEFT JOIN crm_activities a ON a.client_id = c.id
        LEFT JOIN crm_tasks t ON t.client_id = c.id
        LEFT JOIN LATERAL (
            SELECT full_name, phone FROM crm_contacts
            WHERE client_id = c.id AND is_decision_maker = TRUE
            ORDER BY id ASC LIMIT 1
        ) dm ON TRUE
        LEFT JOIN LATERAL (
            SELECT id, title, due_date, status FROM crm_tasks
            WHERE client_id = c.id AND status != 'completed'
            ORDER BY due_date ASC NULLS LAST LIMIT 1
        ) nt ON TRUE
        WHERE c.partner_id = %s
    """
    query_params = [partner_id]

    if stage:
        query += " AND c.stage = %s"
        query_params.append(stage)

    query += """ GROUP BY c.id, dm.full_name, dm.phone,
                 nt.id, nt.title, nt.due_date, nt.status
                 ORDER BY c.created_at DESC"""

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, query_params)
        clients = cur.fetchall()

    return ok_response({'clients': clients})


def get_client_details(conn, partner_id, client_id):
    """Получить детали клиента (с revenue-полями)"""
    if not client_id:
        return error_response('Missing client id', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT *, contact_person AS contact_name FROM crm_clients
            WHERE id = %s AND partner_id = %s
        """, (client_id, partner_id))

        client = cur.fetchone()
        if not client:
            return error_response('Client not found', 404)

        cur.execute("""
            SELECT * FROM crm_activities
            WHERE client_id = %s
            ORDER BY created_at DESC
            LIMIT 50
        """, (client_id,))
        activities = cur.fetchall()

        cur.execute("""
            SELECT * FROM crm_tasks
            WHERE client_id = %s
            ORDER BY due_date ASC
        """, (client_id,))
        tasks = cur.fetchall()

        cur.execute("""
            SELECT * FROM crm_contacts WHERE client_id = %s ORDER BY is_decision_maker DESC, id ASC
        """, (client_id,))
        contacts = cur.fetchall()

        cur.execute("""
            SELECT * FROM crm_documents WHERE client_id = %s ORDER BY created_at DESC
        """, (client_id,))
        documents = cur.fetchall()

        cur.execute("""
            SELECT cf.id AS field_id, cf.field_key, cf.label, cf.field_type, cfv.value
            FROM crm_custom_fields cf
            LEFT JOIN crm_custom_field_values cfv ON cfv.field_id = cf.id AND cfv.client_id = %s
            WHERE cf.partner_id = %s
            ORDER BY cf.sort_order ASC
        """, (client_id, partner_id))
        custom_fields = cur.fetchall()

    return ok_response({
        'client': client,
        'activities': activities,
        'tasks': tasks,
        'contacts': contacts,
        'documents': documents,
        'custom_fields': custom_fields,
    })


def create_client(conn, partner_id, body):
    """Создать клиента (с revenue-полями). quick=True — минимальная быстрая сделка (только название)."""
    d = body.get('data') or body

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO crm_clients (
                partner_id, company_name, contact_person, legal_name, email, phone,
                stage, deal_amount, notes, description,
                revenue, planned_revenue, contract_amount, received_amount,
                next_action_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s
            )
            RETURNING id, created_at
        """, (
            partner_id,
            d.get('company_name', ''),
            d.get('contact_name') or d.get('contact_person', ''),
            d.get('legal_name') or '',
            d.get('email', ''),
            d.get('phone', ''),
            d.get('stage') or 'new',
            d.get('deal_amount', 0),
            d.get('notes', ''),
            d.get('description', ''),
            d.get('revenue', 0),
            d.get('planned_revenue', 0),
            d.get('contract_amount', 0),
            d.get('received_amount', 0),
            d.get('next_action_at'),
        ))

        result = cur.fetchone()

        # Папка в депозитарии создаётся автоматически для каждой сделки сразу при создании
        _ensure_client_folder(cur, result['id'], partner_id)

        conn.commit()

    return ok_response({
        'success': True,
        'id': result['id'],
        'created_at': str(result['created_at']),
    })


def bulk_import_clients(conn, partner_id, body):
    """Массовый импорт сделок (например из Excel). rows — список объектов с полями сделки."""
    rows = body.get('rows') or []
    if not isinstance(rows, list) or not rows:
        return error_response('rows must be a non-empty array', 400)

    inserted = 0
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        for d in rows:
            if not isinstance(d, dict):
                continue
            company_name = (d.get('company_name') or '').strip()
            contact_name = (d.get('contact_name') or d.get('contact_person') or '').strip()
            if not company_name and not contact_name:
                continue
            cur.execute("""
                INSERT INTO crm_clients (
                    partner_id, company_name, contact_person, legal_name, email, phone,
                    stage, deal_amount, notes, description,
                    revenue, planned_revenue, contract_amount, received_amount
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                partner_id,
                company_name,
                contact_name,
                d.get('legal_name', ''),
                d.get('email', ''),
                d.get('phone', ''),
                d.get('stage', 'new'),
                d.get('deal_amount', 0) or 0,
                d.get('notes', ''),
                d.get('description', ''),
                d.get('revenue', 0) or 0,
                d.get('planned_revenue', 0) or 0,
                d.get('contract_amount', 0) or 0,
                d.get('received_amount', 0) or 0,
            ))
            inserted += 1
        conn.commit()

    return ok_response({'success': True, 'imported': inserted})


def _ensure_client_folder(cur, client_id, partner_id):
    """Создаёт папку в 'Галактический реестр' для сделки, если её ещё нет. Возвращает folder_id."""
    cur.execute(
        "SELECT legal_name, company_name, depo_folder_id FROM crm_clients WHERE id = %s AND partner_id = %s",
        (client_id, partner_id),
    )
    client = cur.fetchone()
    if not client:
        return None
    if client['depo_folder_id']:
        return client['depo_folder_id']

    folder_name = client['legal_name'] or client['company_name'] or f'Сделка #{client_id}'
    cur.execute("SELECT id FROM depo_folders WHERE name = 'Галактический реестр' AND parent_id IS NULL LIMIT 1")
    root = cur.fetchone()
    root_id = root['id'] if root else None
    cur.execute(
        "INSERT INTO depo_folders (name, parent_id, kind) VALUES (%s, %s, 'folder') RETURNING id",
        (folder_name, root_id),
    )
    folder_id = cur.fetchone()['id']
    cur.execute("UPDATE crm_clients SET depo_folder_id = %s WHERE id = %s", (folder_id, client_id))
    return folder_id


def update_client(conn, partner_id, body):
    """Обновить клиента — все поля включая revenue-поля.
    При смене этапа (stage) автоматически создаётся папка сделки в депозитарии, если её ещё нет."""
    client_id = body.get('id')
    updates = body.get('updates', {})

    if not client_id or not updates:
        return error_response('Missing id or updates', 400)

    allowed_fields = {
        'company_name', 'contact_person', 'contact_name', 'legal_name', 'email', 'phone', 'stage',
        'deal_amount', 'notes', 'description', 'status', 'source',
        'revenue', 'planned_revenue', 'contract_amount', 'received_amount',
        'next_action_at', 'last_action_at', 'depo_folder_id',
    }

    filtered = {}
    for k, v in updates.items():
        if k not in allowed_fields:
            continue
        col = 'contact_person' if k == 'contact_name' else k
        filtered[col] = v
    if not filtered:
        return error_response('No valid fields to update', 400)

    if 'stage' in filtered:
        filtered['last_action_at'] = datetime.utcnow().isoformat()

    filtered['updated_at'] = datetime.utcnow().isoformat()

    set_clause = ', '.join(f"{key} = %s" for key in filtered)
    values = list(filtered.values()) + [client_id, partner_id]

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f"UPDATE crm_clients SET {set_clause} WHERE id = %s AND partner_id = %s",
            values,
        )
        if 'stage' in filtered:
            _ensure_client_folder(cur, client_id, partner_id)
        conn.commit()

    return ok_response({'success': True})


def delete_client(conn, partner_id, client_id):
    """Удалить клиента и связанные записи"""
    with conn.cursor() as cur:
        cur.execute(
            "DELETE FROM crm_activities WHERE client_id = %s AND partner_id = %s",
            (client_id, partner_id),
        )
        cur.execute(
            "DELETE FROM crm_tasks WHERE client_id = %s AND partner_id = %s",
            (client_id, partner_id),
        )
        cur.execute(
            "DELETE FROM crm_contacts WHERE client_id = %s AND partner_id = %s",
            (client_id, partner_id),
        )
        cur.execute(
            "DELETE FROM crm_custom_field_values WHERE client_id = %s",
            (client_id,),
        )
        cur.execute(
            "DELETE FROM crm_documents WHERE client_id = %s AND partner_id = %s",
            (client_id, partner_id),
        )
        cur.execute(
            "DELETE FROM crm_clients WHERE id = %s AND partner_id = %s",
            (client_id, partner_id),
        )
        conn.commit()

    return ok_response({'success': True})


# ------------------------------------------------------------------- tasks --

def get_tasks(conn, partner_id):
    """Получить задачи партнера"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT
                t.*,
                c.company_name AS client_name
            FROM crm_tasks t
            LEFT JOIN crm_clients c ON t.client_id = c.id
            WHERE t.partner_id = %s
            ORDER BY t.due_date ASC
        """, (partner_id,))
        tasks = cur.fetchall()

    return ok_response({'tasks': tasks})


def create_task(conn, partner_id, body):
    """Создать задачу"""
    d = body.get('data') or body

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO crm_tasks (
                partner_id, client_id, title, description,
                due_date, priority, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at
        """, (
            partner_id,
            d.get('client_id'),
            d.get('title'),
            d.get('description'),
            d.get('due_date'),
            d.get('priority', 'medium'),
            d.get('status', 'pending'),
        ))

        result = cur.fetchone()
        conn.commit()

    return ok_response({
        'success': True,
        'id': result['id'],
        'created_at': str(result['created_at']),
    })


def update_task(conn, partner_id, body):
    """Обновить задачу"""
    task_id = body.get('id')
    updates = body.get('updates', {})

    if not task_id or not updates:
        return error_response('Missing id or updates', 400)

    allowed_fields = {
        'title', 'description', 'due_date', 'priority', 'status', 'client_id',
    }
    filtered = {k: v for k, v in updates.items() if k in allowed_fields}
    if not filtered:
        return error_response('No valid fields to update', 400)

    set_clause = ', '.join(f"{key} = %s" for key in filtered)
    values = list(filtered.values()) + [task_id, partner_id]

    with conn.cursor() as cur:
        cur.execute(
            f"UPDATE crm_tasks SET {set_clause} WHERE id = %s AND partner_id = %s",
            values,
        )
        conn.commit()

    return ok_response({'success': True})


def delete_task(conn, partner_id, task_id):
    """Удалить задачу"""
    with conn.cursor() as cur:
        cur.execute(
            "DELETE FROM crm_tasks WHERE id = %s AND partner_id = %s",
            (task_id, partner_id),
        )
        conn.commit()

    return ok_response({'success': True})


# -------------------------------------------------------------- activities --

def get_activities(conn, partner_id, params):
    """Получить активности партнера"""
    client_id = params.get('client_id')

    query = """
        SELECT
            a.*,
            c.company_name AS client_name
        FROM crm_activities a
        LEFT JOIN crm_clients c ON a.client_id = c.id
        WHERE a.partner_id = %s
    """
    query_params = [partner_id]

    if client_id:
        query += " AND a.client_id = %s"
        query_params.append(client_id)

    query += " ORDER BY a.created_at DESC LIMIT 100"

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, query_params)
        activities = cur.fetchall()

    return ok_response({'activities': activities})


def create_activity(conn, partner_id, body):
    """Создать активность"""
    d = body.get('data') or body

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO crm_activities (
                partner_id, client_id, type, description
            ) VALUES (%s, %s, %s, %s)
            RETURNING id, created_at
        """, (
            partner_id,
            d.get('client_id'),
            d.get('type') or d.get('activity_type', ''),
            d.get('description') or d.get('notes', ''),
        ))

        result = cur.fetchone()
        conn.commit()

    return ok_response({
        'success': True,
        'id': result['id'],
        'created_at': str(result['created_at']),
    })


# ------------------------------------------------------------------- stats --

def get_partner_stats(conn, partner_id):
    """Получить статистику партнера (включая revenue-агрегаты)"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT
                COUNT(*)                                               AS total_clients,
                COUNT(CASE WHEN stage = 'lead'        THEN 1 END)     AS leads_count,
                COUNT(CASE WHEN stage = 'qualified'   THEN 1 END)     AS qualified_count,
                COUNT(CASE WHEN stage = 'proposal'    THEN 1 END)     AS proposal_count,
                COUNT(CASE WHEN stage = 'negotiation' THEN 1 END)     AS negotiation_count,
                COUNT(CASE WHEN stage = 'closed_won'  THEN 1 END)     AS won_count,
                COUNT(CASE WHEN stage = 'closed_lost' THEN 1 END)     AS lost_count,
                COALESCE(SUM(CASE WHEN stage = 'closed_won'
                                  THEN deal_amount END), 0)           AS total_deal_amount,
                COALESCE(SUM(revenue), 0)                              AS total_revenue,
                COALESCE(SUM(planned_revenue), 0)                      AS total_planned,
                COALESCE(SUM(contract_amount), 0)                      AS total_contracts,
                COALESCE(SUM(received_amount), 0)                      AS total_received
            FROM crm_clients
            WHERE partner_id = %s
        """, (partner_id,))
        client_stats = cur.fetchone()

        cur.execute("""
            SELECT
                COUNT(*)                                           AS total_tasks,
                COUNT(CASE WHEN status = 'pending'   THEN 1 END)  AS pending_tasks,
                COUNT(CASE WHEN status = 'completed' THEN 1 END)  AS completed_tasks
            FROM crm_tasks
            WHERE partner_id = %s
        """, (partner_id,))
        task_stats = cur.fetchone()

        cur.execute("""
            SELECT COUNT(*) AS total_activities
            FROM crm_activities
            WHERE partner_id = %s
        """, (partner_id,))
        activity_stats = cur.fetchone()

    stats = {**client_stats, **task_stats, **activity_stats}
    return ok_response({'stats': stats})


# ----------------------------------------------------------------- network --

def calculate_grade(total_revenue):
    """Determine grade and commission percentages from total turnover."""
    for min_turnover, grade_name, personal, l1, l2, l3, l4 in GRADES:
        if total_revenue >= min_turnover:
            return {
                'grade': grade_name,
                'personal_percent': personal,
                'line1_percent': l1,
                'line2_percent': l2,
                'line3_percent': l3,
                'line4_percent': l4,
            }
    return {
        'grade': 'Агент',
        'personal_percent': 8,
        'line1_percent': 0,
        'line2_percent': 0,
        'line3_percent': 0,
        'line4_percent': 0,
    }


def _partner_crm_stats(cur, partner_id):
    """Return aggregated CRM revenue stats for one partner."""
    cur.execute("""
        SELECT
            COALESCE(SUM(revenue), 0)         AS total_revenue,
            COALESCE(SUM(planned_revenue), 0) AS total_planned,
            COALESCE(SUM(contract_amount), 0) AS total_contracts,
            COALESCE(SUM(received_amount), 0) AS total_received,
            COALESCE(SUM(deal_amount), 0)     AS total_deal_amount,
            COUNT(*)                           AS deals_count,
            COUNT(CASE WHEN stage = 'closed_won' THEN 1 END) AS won_deals
        FROM crm_clients
        WHERE partner_id = %s
    """, (partner_id,))
    return cur.fetchone()


def _build_network_tree(cur, parent_id, current_line, max_line):
    """Recursively fetch partner children up to *max_line* levels deep."""
    if current_line > max_line:
        return []

    cur.execute("""
        SELECT id, name, phone, email, company, invite_code, grade, created_at
        FROM users
        WHERE parent_id = %s
        ORDER BY created_at ASC
    """, (parent_id,))
    children = cur.fetchall()

    nodes = []
    for child in children:
        stats = _partner_crm_stats(cur, child['id'])
        grade_info = calculate_grade(float(stats['total_revenue']))

        nodes.append({
            'id': child['id'],
            'name': child['name'],
            'phone': child['phone'],
            'email': child['email'],
            'company': child['company'],
            'invite_code': child['invite_code'],
            'grade': grade_info['grade'],
            'created_at': child['created_at'],
            'line': current_line,
            'stats': {
                'total_revenue': stats['total_revenue'],
                'total_planned': stats['total_planned'],
                'total_contracts': stats['total_contracts'],
                'total_received': stats['total_received'],
                'total_deal_amount': stats['total_deal_amount'],
                'deals_count': stats['deals_count'],
                'won_deals': stats['won_deals'],
            },
            'children': _build_network_tree(cur, child['id'], current_line + 1, max_line),
        })

    return nodes


def _collect_line(tree, target_line):
    """Flatten the tree and return only nodes at a given line level."""
    result = []
    for node in tree:
        if node['line'] == target_line:
            result.append(node)
        if node.get('children'):
            result.extend(_collect_line(node['children'], target_line))
    return result


def get_network(conn, partner_id):
    """Return full partner network tree (4 lines), stats per line, commissions."""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Own stats
        own_stats = _partner_crm_stats(cur, partner_id)
        own_revenue = float(own_stats['total_revenue'])
        grade_info = calculate_grade(own_revenue)

        # Check first-deal bonus for Агент
        first_deal_bonus = False
        if grade_info['grade'] == 'Агент':
            cur.execute("""
                SELECT COUNT(*) AS cnt
                FROM crm_clients
                WHERE partner_id = %s AND stage = 'closed_won'
            """, (partner_id,))
            won_row = cur.fetchone()
            if won_row and won_row['cnt'] <= 1:
                first_deal_bonus = True

        personal_pct = FIRST_DEAL_PERSONAL_PERCENT if first_deal_bonus else grade_info['personal_percent']
        personal_commission = own_revenue * personal_pct / 100

        # Build tree (4 levels)
        tree = _build_network_tree(cur, partner_id, 1, 4)

        # Aggregate per-line stats
        line_stats = []
        for line_num in range(1, 5):
            partners_at_line = _collect_line(tree, line_num)
            line_revenue = sum(float(p['stats']['total_revenue']) for p in partners_at_line)
            line_deals = sum(int(p['stats']['deals_count']) for p in partners_at_line)
            line_won = sum(int(p['stats']['won_deals']) for p in partners_at_line)

            pct_key = f'line{line_num}_percent'
            commission_pct = grade_info.get(pct_key, 0)
            commission_amount = line_revenue * commission_pct / 100 if commission_pct else 0

            line_stats.append({
                'line': line_num,
                'partners_count': len(partners_at_line),
                'total_revenue': line_revenue,
                'total_deals': line_deals,
                'won_deals': line_won,
                'commission_percent': commission_pct,
                'commission_amount': round(commission_amount, 2),
            })

        total_network_revenue = sum(ls['total_revenue'] for ls in line_stats)
        total_network_commission = sum(ls['commission_amount'] for ls in line_stats)

    return ok_response({
        'partner_id': partner_id,
        'grade': grade_info,
        'first_deal_bonus': first_deal_bonus,
        'own_stats': own_stats,
        'personal_commission_percent': personal_pct,
        'personal_commission': round(personal_commission, 2),
        'network_tree': tree,
        'line_stats': line_stats,
        'total_network_revenue': total_network_revenue,
        'total_network_commission': round(total_network_commission, 2),
        'total_income': round(personal_commission + total_network_commission, 2),
    })


# ------------------------------------------------------------------ stages --

DEFAULT_STAGES = [
    ('new', 'Новый лид', '#12232b', '#66FCF1'),
    ('first-contact', 'Первый контакт', '#1F2833', '#45A29E'),
    ('evaluation', 'Квалификация', '#2b1f33', '#C89BFF'),
    ('proposal', 'Коммерческое предложение', '#3a2412', '#FF9B4D'),
    ('negotiation', 'Переговоры', '#3a1414', '#FF8080'),
    ('closed-won', 'Успешно реализовано', '#0f2b26', '#5eead4'),
    ('closed-lost', 'Закрыто и не реализовано', '#1F2833', '#6B7684'),
]


def _ensure_default_stages(cur, partner_id):
    """Создаёт стандартный набор этапов для партнёра, если у него их ещё нет."""
    cur.execute("SELECT COUNT(*) AS c FROM crm_stages WHERE partner_id = %s", (partner_id,))
    if cur.fetchone()['c'] > 0:
        return
    for i, (key, label, color, text_color) in enumerate(DEFAULT_STAGES):
        is_won = key == 'closed-won'
        is_lost = key == 'closed-lost'
        cur.execute("""
            INSERT INTO crm_stages (partner_id, stage_key, label, sort_order, color, text_color, is_closed_won, is_closed_lost)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (partner_id, stage_key) DO NOTHING
        """, (partner_id, key, label, i, color, text_color, is_won, is_lost))


def get_stages(conn, partner_id):
    """Получить этапы воронки партнёра (создаёт стандартные при первом обращении)"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        _ensure_default_stages(cur, partner_id)
        conn.commit()
        cur.execute("SELECT * FROM crm_stages WHERE partner_id = %s ORDER BY sort_order ASC", (partner_id,))
        stages = cur.fetchall()
    return ok_response({'stages': stages})


def create_stage(conn, partner_id, body):
    """Добавить новый этап воронки"""
    label = (body.get('label') or '').strip()
    if not label:
        return error_response('label is required', 400)
    stage_key = (body.get('stage_key') or '').strip() or label.lower().replace(' ', '-')
    color = body.get('color') or '#1F2833'
    text_color = body.get('text_color') or '#66FCF1'

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        _ensure_default_stages(cur, partner_id)
        cur.execute("SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM crm_stages WHERE partner_id = %s", (partner_id,))
        next_order = cur.fetchone()['next_order']
        cur.execute("""
            INSERT INTO crm_stages (partner_id, stage_key, label, sort_order, color, text_color)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (partner_id, stage_key, label, next_order, color, text_color))
        stage = cur.fetchone()
        conn.commit()
    return ok_response({'stage': stage})


def update_stage(conn, partner_id, body):
    """Переименовать этап / изменить цвет"""
    stage_id = body.get('id')
    if not stage_id:
        return error_response('Missing id', 400)
    allowed = {'label', 'color', 'text_color'}
    updates = {k: v for k, v in (body.get('updates') or {}).items() if k in allowed}
    if not updates:
        return error_response('No valid fields to update', 400)
    set_clause = ', '.join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [stage_id, partner_id]
    with conn.cursor() as cur:
        cur.execute(f"UPDATE crm_stages SET {set_clause} WHERE id = %s AND partner_id = %s", values)
        conn.commit()
    return ok_response({'success': True})


def delete_stage(conn, partner_id, stage_id):
    """Удалить этап воронки"""
    with conn.cursor() as cur:
        cur.execute("DELETE FROM crm_stages WHERE id = %s AND partner_id = %s", (stage_id, partner_id))
        conn.commit()
    return ok_response({'success': True})


def reorder_stages(conn, partner_id, body):
    """Изменить порядок этапов. order — список id этапов в новом порядке."""
    order = body.get('order') or []
    if not isinstance(order, list) or not order:
        return error_response('order must be a non-empty array of stage ids', 400)
    with conn.cursor() as cur:
        for i, stage_id in enumerate(order):
            cur.execute(
                "UPDATE crm_stages SET sort_order = %s WHERE id = %s AND partner_id = %s",
                (i, stage_id, partner_id),
            )
        conn.commit()
    return ok_response({'success': True})


# ----------------------------------------------------------------- contacts --

def get_contacts(conn, partner_id, client_id):
    """Получить контактных лиц сделки"""
    if not client_id:
        return error_response('Missing client_id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "SELECT * FROM crm_contacts WHERE client_id = %s AND partner_id = %s ORDER BY is_decision_maker DESC, id ASC",
            (client_id, partner_id),
        )
        contacts = cur.fetchall()
    return ok_response({'contacts': contacts})


def create_contact(conn, partner_id, body):
    """Добавить контактное лицо к сделке"""
    client_id = body.get('client_id')
    full_name = (body.get('full_name') or '').strip()
    if not client_id or not full_name:
        return error_response('client_id and full_name are required', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if body.get('is_decision_maker'):
            cur.execute(
                "UPDATE crm_contacts SET is_decision_maker = FALSE WHERE client_id = %s",
                (client_id,),
            )
        cur.execute("""
            INSERT INTO crm_contacts (client_id, partner_id, full_name, position_title, phone, email, is_decision_maker)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            client_id, partner_id, full_name,
            body.get('position_title', ''), body.get('phone', ''), body.get('email', ''),
            bool(body.get('is_decision_maker', False)),
        ))
        contact = cur.fetchone()
        conn.commit()
    return ok_response({'contact': contact})


def update_contact(conn, partner_id, body):
    """Обновить контактное лицо"""
    contact_id = body.get('id')
    if not contact_id:
        return error_response('Missing id', 400)
    allowed = {'full_name', 'position_title', 'phone', 'email', 'is_decision_maker'}
    updates = {k: v for k, v in (body.get('updates') or {}).items() if k in allowed}
    if not updates:
        return error_response('No valid fields to update', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if updates.get('is_decision_maker'):
            cur.execute(
                "SELECT client_id FROM crm_contacts WHERE id = %s AND partner_id = %s",
                (contact_id, partner_id),
            )
            row = cur.fetchone()
            if row:
                cur.execute(
                    "UPDATE crm_contacts SET is_decision_maker = FALSE WHERE client_id = %s",
                    (row['client_id'],),
                )
        set_clause = ', '.join(f"{k} = %s" for k in updates)
        values = list(updates.values()) + [contact_id, partner_id]
        cur.execute(f"UPDATE crm_contacts SET {set_clause} WHERE id = %s AND partner_id = %s", values)
        conn.commit()
    return ok_response({'success': True})


def delete_contact(conn, partner_id, contact_id):
    """Удалить контактное лицо"""
    with conn.cursor() as cur:
        cur.execute("DELETE FROM crm_contacts WHERE id = %s AND partner_id = %s", (contact_id, partner_id))
        conn.commit()
    return ok_response({'success': True})


# ---------------------------------------------------------------- documents --

def get_documents(conn, partner_id, client_id):
    """Получить документы, прикреплённые к сделке"""
    if not client_id:
        return error_response('Missing client_id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "SELECT * FROM crm_documents WHERE client_id = %s AND partner_id = %s ORDER BY created_at DESC",
            (client_id, partner_id),
        )
        documents = cur.fetchall()
    return ok_response({'documents': documents})


def create_document(conn, partner_id, body):
    """Прикрепить документ к сделке. Если у сделки нет папки в депозитарии — создаёт её автоматически
    внутри 'Галактический реестр' по юридическому названию клиента."""
    client_id = body.get('client_id')
    name = (body.get('name') or '').strip()
    url = (body.get('url') or '').strip()
    if not client_id or not name or not url:
        return error_response('client_id, name and url are required', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        folder_id = _ensure_client_folder(cur, client_id, partner_id)
        if folder_id is None:
            return error_response('Client not found', 404)

        cur.execute("""
            INSERT INTO crm_documents (client_id, partner_id, depo_file_id, name, url, mime, size_bytes, uploaded_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            client_id, partner_id, body.get('depo_file_id'), name, url,
            body.get('mime', ''), body.get('size_bytes', 0), body.get('uploaded_by'),
        ))
        document = cur.fetchone()
        conn.commit()
    return ok_response({'document': document, 'folder_id': folder_id})


def delete_document(conn, partner_id, document_id):
    """Удалить документ из сделки (сам файл в депозитарии остаётся)"""
    with conn.cursor() as cur:
        cur.execute("DELETE FROM crm_documents WHERE id = %s AND partner_id = %s", (document_id, partner_id))
        conn.commit()
    return ok_response({'success': True})


MAX_DOC_SIZE = 30 * 1024 * 1024


def upload_document(conn, partner_id, body):
    """Загружает файл (base64) в S3, создаёт запись в депозитарии (папка сделки создаётся
    автоматически по юр.названию клиента в 'Галактический реестр') и прикрепляет к сделке."""
    client_id = body.get('client_id')
    name = (body.get('name') or 'file').strip()
    data_url = body.get('data') or ''
    mime = body.get('mime') or 'application/octet-stream'
    if not client_id or not data_url:
        return error_response('client_id and data are required', 400)

    if ',' in data_url:
        _, b64 = data_url.split(',', 1)
    else:
        b64 = data_url
    raw = base64.b64decode(b64)
    if len(raw) > MAX_DOC_SIZE:
        return error_response('Файл превышает 30 МБ', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        folder_id = _ensure_client_folder(cur, client_id, partner_id)
        if folder_id is None:
            return error_response('Client not found', 404)

        ext = name.rsplit('.', 1)[-1].lower()[:8] if '.' in name else ''
        key = f"depository/{uuid.uuid4().hex}{('.' + ext) if ext else ''}"
        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        )
        s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=mime)
        url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

        cur.execute("""
            INSERT INTO depo_files (folder_id, name, url, mime, size_bytes, is_public)
            VALUES (%s, %s, %s, %s, %s, TRUE)
            RETURNING id
        """, (folder_id, name, url, mime, len(raw)))
        depo_file_id = cur.fetchone()['id']

        cur.execute("""
            INSERT INTO crm_documents (client_id, partner_id, depo_file_id, name, url, mime, size_bytes)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (client_id, partner_id, depo_file_id, name, url, mime, len(raw)))
        document = cur.fetchone()
        conn.commit()

    return ok_response({'document': document, 'folder_id': folder_id})


# ------------------------------------------------------------ custom fields --

def get_custom_fields(conn, partner_id):
    """Получить список кастомных полей, настроенных партнёром"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "SELECT * FROM crm_custom_fields WHERE partner_id = %s ORDER BY sort_order ASC",
            (partner_id,),
        )
        fields = cur.fetchall()
    return ok_response({'custom_fields': fields})


def create_custom_field(conn, partner_id, body):
    """Добавить кастомное поле в карточку сделки"""
    label = (body.get('label') or '').strip()
    if not label:
        return error_response('label is required', 400)
    field_key = (body.get('field_key') or '').strip() or label.lower().replace(' ', '_')
    field_type = body.get('field_type') or 'text'

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM crm_custom_fields WHERE partner_id = %s",
            (partner_id,),
        )
        next_order = cur.fetchone()['next_order']
        cur.execute("""
            INSERT INTO crm_custom_fields (partner_id, field_key, label, field_type, sort_order)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *
        """, (partner_id, field_key, label, field_type, next_order))
        field = cur.fetchone()
        conn.commit()

        if body.get('client_id') and body.get('value') is not None:
            cur.execute("""
                INSERT INTO crm_custom_field_values (client_id, field_id, value)
                VALUES (%s, %s, %s)
                ON CONFLICT (client_id, field_id) DO UPDATE SET value = EXCLUDED.value
            """, (body['client_id'], field['id'], str(body['value'])))
            conn.commit()

    return ok_response({'custom_field': field})


def set_custom_field_value(conn, partner_id, body):
    """Установить значение кастомного поля для сделки"""
    client_id = body.get('client_id')
    field_id = body.get('field_id')
    value = body.get('value', '')
    if not client_id or not field_id:
        return error_response('client_id and field_id are required', 400)
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO crm_custom_field_values (client_id, field_id, value)
            VALUES (%s, %s, %s)
            ON CONFLICT (client_id, field_id) DO UPDATE SET value = EXCLUDED.value
        """, (client_id, field_id, str(value)))
        conn.commit()
    return ok_response({'success': True})


# ------------------------------------------------------------------ analytics --

def get_analytics(conn, partner_id):
    """Аналитика воронки: конверсия между этапами, задачи, рекомендации на основе данных."""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        _ensure_default_stages(cur, partner_id)
        conn.commit()

        cur.execute("SELECT stage_key, label, sort_order FROM crm_stages WHERE partner_id = %s ORDER BY sort_order ASC", (partner_id,))
        stages = cur.fetchall()

        cur.execute("""
            SELECT stage, COUNT(*) AS cnt, COALESCE(SUM(deal_amount), 0) AS total_amount
            FROM crm_clients WHERE partner_id = %s GROUP BY stage
        """, (partner_id,))
        by_stage = {r['stage']: r for r in cur.fetchall()}

        funnel = []
        for s in stages:
            row = by_stage.get(s['stage_key'], {'cnt': 0, 'total_amount': 0})
            funnel.append({
                'stage_key': s['stage_key'],
                'label': s['label'],
                'count': row['cnt'],
                'total_amount': row['total_amount'],
            })

        conversions = []
        for i in range(len(funnel) - 1):
            cur_count = funnel[i]['count']
            next_count = funnel[i + 1]['count']
            rate = round((next_count / cur_count) * 100, 1) if cur_count > 0 else 0
            conversions.append({
                'from': funnel[i]['label'],
                'to': funnel[i + 1]['label'],
                'rate': rate,
            })

        cur.execute("""
            SELECT
                COUNT(CASE WHEN status != 'completed' AND due_date < NOW() THEN 1 END) AS overdue,
                COUNT(CASE WHEN status != 'completed' AND due_date >= NOW() AND due_date < NOW() + INTERVAL '3 days' THEN 1 END) AS upcoming,
                COUNT(CASE WHEN status != 'completed' THEN 1 END) AS open_total,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_total
            FROM crm_tasks WHERE partner_id = %s
        """, (partner_id,))
        task_stats = cur.fetchone()

        cur.execute("""
            SELECT COUNT(*) AS c FROM crm_clients
            WHERE partner_id = %s
              AND stage NOT IN ('closed-won', 'closed-lost', 'closed_won', 'closed_lost')
              AND COALESCE(last_action_at, created_at) < NOW() - INTERVAL '7 days'
        """, (partner_id,))
        stale_deals = cur.fetchone()['c']

        cur.execute("""
            SELECT COUNT(*) AS total, COUNT(CASE WHEN stage IN ('closed-won','closed_won') THEN 1 END) AS won
            FROM crm_clients WHERE partner_id = %s
        """, (partner_id,))
        conv_row = cur.fetchone()
        overall_conversion = round((conv_row['won'] / conv_row['total']) * 100, 1) if conv_row['total'] > 0 else 0

    recommendations = []
    if task_stats['overdue'] > 0:
        recommendations.append(f"У вас {task_stats['overdue']} просроченных задач — разберите их в первую очередь.")
    if stale_deals > 0:
        recommendations.append(f"{stale_deals} сделок без движения больше недели — стоит связаться с клиентами.")
    if conversions:
        weakest = min(conversions, key=lambda c: c['rate']) if any(c['rate'] for c in conversions) else None
        if weakest and weakest['rate'] < 30:
            recommendations.append(f"Самая слабая конверсия — с этапа «{weakest['from']}» на «{weakest['to']}» ({weakest['rate']}%). Стоит пересмотреть работу на этом этапе.")
    if not recommendations:
        recommendations.append('Воронка в порядке — критичных проблем не обнаружено.')

    return ok_response({
        'funnel': funnel,
        'conversions': conversions,
        'task_stats': task_stats,
        'stale_deals': stale_deals,
        'overall_conversion': overall_conversion,
        'recommendations': recommendations,
    })


# ----------------------------------------------------------------- helpers --

def _parse_partner_id(raw):
    """Parse and validate partner_id.  Returns int or error response dict."""
    if raw is None:
        return error_response('Missing partner_id', 400)
    try:
        return int(raw)
    except (ValueError, TypeError):
        return error_response('Invalid partner_id: must be a number', 400)


def cors_headers():
    """Standard CORS + JSON headers."""
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
    }


def ok_response(payload):
    """200 JSON response."""
    return {
        'statusCode': 200,
        'headers': cors_headers(),
        'body': json.dumps(payload, default=str),
        'isBase64Encoded': False,
    }


def error_response(message, status_code):
    """Error JSON response."""
    return {
        'statusCode': status_code,
        'headers': cors_headers(),
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False,
    }