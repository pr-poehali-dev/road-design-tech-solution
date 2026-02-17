"""API для CRM системы партнеров с партнерской сетью"""
import json
import os
import hashlib
import string
import random
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor


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

    return error_response('Unknown resource', 400)


def handle_post(event, conn):
    """POST запросы: создание + auth"""
    body = json.loads(event.get('body', '{}'))
    resource = body.get('resource')

    if resource == 'register':
        return register_partner(conn, body)
    if resource == 'login':
        return login_partner(conn, body)
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
    """Получить клиентов партнера (с revenue-полями)"""
    stage = params.get('stage')

    query = """
        SELECT
            c.*,
            COUNT(DISTINCT a.id) AS activities_count,
            COUNT(DISTINCT t.id) AS tasks_count
        FROM crm_clients c
        LEFT JOIN crm_activities a ON a.client_id = c.id
        LEFT JOIN crm_tasks t ON t.client_id = c.id
        WHERE c.partner_id = %s
    """
    query_params = [partner_id]

    if stage:
        query += " AND c.stage = %s"
        query_params.append(stage)

    query += " GROUP BY c.id ORDER BY c.created_at DESC"

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
            SELECT * FROM crm_clients
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

    return ok_response({
        'client': client,
        'activities': activities,
        'tasks': tasks,
    })


def create_client(conn, partner_id, body):
    """Создать клиента (с revenue-полями)"""
    d = body.get('data') or body

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO crm_clients (
                partner_id, company_name, contact_name, email, phone,
                stage, deal_amount, notes, description,
                revenue, planned_revenue, contract_amount, received_amount
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s
            )
            RETURNING id, created_at
        """, (
            partner_id,
            d.get('company_name', ''),
            d.get('contact_name') or d.get('contact_person', ''),
            d.get('email', ''),
            d.get('phone', ''),
            d.get('stage', 'lead'),
            d.get('deal_amount', 0),
            d.get('notes', ''),
            d.get('description', ''),
            d.get('revenue', 0),
            d.get('planned_revenue', 0),
            d.get('contract_amount', 0),
            d.get('received_amount', 0),
        ))

        result = cur.fetchone()
        conn.commit()

    return ok_response({
        'success': True,
        'id': result['id'],
        'created_at': str(result['created_at']),
    })


def update_client(conn, partner_id, body):
    """Обновить клиента — все поля включая revenue-поля"""
    client_id = body.get('id')
    updates = body.get('updates', {})

    if not client_id or not updates:
        return error_response('Missing id or updates', 400)

    allowed_fields = {
        'company_name', 'contact_name', 'email', 'phone', 'stage',
        'deal_amount', 'notes', 'description', 'status', 'source',
        'revenue', 'planned_revenue', 'contract_amount', 'received_amount',
    }

    filtered = {k: v for k, v in updates.items() if k in allowed_fields}
    if not filtered:
        return error_response('No valid fields to update', 400)

    filtered['updated_at'] = datetime.utcnow().isoformat()

    set_clause = ', '.join(f"{key} = %s" for key in filtered)
    values = list(filtered.values()) + [client_id, partner_id]

    with conn.cursor() as cur:
        cur.execute(
            f"UPDATE crm_clients SET {set_clause} WHERE id = %s AND partner_id = %s",
            values,
        )
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
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
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