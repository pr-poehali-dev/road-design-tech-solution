"""
Универсальный API для партнерской системы DEOD
Включает: авторизацию, чат, CRM и админку
"""
import json
import os
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db():
    """Получить подключение к БД"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Главный обработчик всех API запросов"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    path = event.get('path', '')
    params = event.get('queryStringParameters') or {}
    
    try:
        # ========== AUTH ENDPOINTS ==========
        
        if '/auth/register' in path and method == 'POST':
            return handle_register(event)
        elif '/auth/login' in path and method == 'POST':
            return handle_login(event)
        elif '/auth/admin' in path and method == 'POST':
            return handle_admin_login(event)
        
        # ========== CHAT ENDPOINTS ==========
        
        elif '/chat/messages' in path:
            if method == 'GET':
                return handle_get_messages(params)
            elif method == 'POST':
                return handle_send_message(event)
        elif '/chat/channels' in path:
            if method == 'GET':
                return handle_get_channels(params)
            elif method == 'POST':
                return handle_create_channel(event)
        elif '/chat/online' in path and method == 'GET':
            return handle_get_online_users()
        elif '/chat/users' in path and method == 'GET':
            return handle_get_all_users()
        
        # ========== CRM ENDPOINTS ==========
        
        elif '/crm/clients' in path:
            if method == 'GET':
                return handle_get_clients(params)
            elif method == 'POST':
                return handle_create_client(event)
            elif method == 'PUT':
                return handle_update_client(path, event)
        elif '/crm/tasks' in path:
            if method == 'GET':
                return handle_get_tasks(params)
            elif method == 'POST':
                return handle_create_task(event)
            elif method == 'PUT':
                return handle_update_task(path, event)
        elif '/crm/activities' in path:
            if method == 'GET':
                return handle_get_activities(params)
            elif method == 'POST':
                return handle_create_activity(event)
        elif '/crm/stats' in path and method == 'GET':
            return handle_get_crm_stats(params)
        
        # ========== ADMIN ENDPOINTS ==========
        
        elif '/admin/users' in path:
            if method == 'GET' and '/users/' not in path:
                return handle_admin_get_users()
            elif method == 'GET' and '/users/' in path:
                return handle_admin_get_user(path)
            elif method == 'PUT':
                return handle_admin_update_user(path, event)
        elif '/admin/stats' in path and method == 'GET':
            return handle_admin_stats()
        elif '/admin/channels' in path and method == 'GET':
            return handle_admin_channels()
        elif '/admin/broadcast' in path and method == 'POST':
            return handle_admin_broadcast(event)
        
        return error_response('Endpoint not found', 404)
        
    except Exception as e:
        return error_response(str(e), 500)

# ========== AUTH HANDLERS ==========

def handle_register(event):
    body = json.loads(event.get('body', '{}'))
    name = body.get('name')
    phone = body.get('contact')
    asset = body.get('asset')
    expected_income = body.get('expectedIncome')
    
    if not name or not phone:
        return error_response('name and phone required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT * FROM users WHERE phone = %s", (phone,))
    user = cur.fetchone()
    
    if user:
        cur.execute("""
            UPDATE users 
            SET name = %s, asset = %s, expected_income = %s, 
                is_online = true, last_seen = CURRENT_TIMESTAMP
            WHERE phone = %s
            RETURNING id, name, phone, grade, is_admin
        """, (name, asset, expected_income, phone))
    else:
        cur.execute("""
            INSERT INTO users (name, phone, asset, expected_income, is_online)
            VALUES (%s, %s, %s, %s, true)
            RETURNING id, name, phone, grade, is_admin
        """, (name, phone, asset, expected_income))
        
        user_id = cur.fetchone()['id']
        cur.execute("""
            INSERT INTO channel_members (channel_id, user_id)
            SELECT id, %s FROM channels WHERE type = 'public'
            ON CONFLICT DO NOTHING
        """, (user_id,))
        
        cur.execute("""
            SELECT id, name, phone, grade, is_admin 
            FROM users WHERE id = %s
        """, (user_id,))
    
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'user': dict(user)})

def handle_login(event):
    body = json.loads(event.get('body', '{}'))
    phone = body.get('phone')
    
    if not phone:
        return error_response('phone required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        UPDATE users 
        SET is_online = true, last_seen = CURRENT_TIMESTAMP
        WHERE phone = %s
        RETURNING id, name, phone, grade, is_admin
    """, (phone,))
    
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    if not user:
        return error_response('User not found', 404)
    
    return success_response({'user': dict(user)})

def handle_admin_login(event):
    body = json.loads(event.get('body', '{}'))
    password = body.get('password')
    
    if password == '1989d1985R!1964Li.#':
        return success_response({'authenticated': True, 'role': 'admin'})
    
    return error_response('Invalid password', 401)

# ========== CHAT HANDLERS ==========

def handle_get_messages(params):
    channel_id = params.get('channel_id')
    if not channel_id:
        return error_response('channel_id required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT m.*, u.name as user_name
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.channel_id = %s
        ORDER BY m.created_at ASC
    """, (channel_id,))
    
    messages = cur.fetchall()
    cur.close()
    conn.close()
    
    for msg in messages:
        msg['created_at'] = msg['created_at'].isoformat()
    
    return success_response({'messages': messages})

def handle_send_message(event):
    body = json.loads(event.get('body', '{}'))
    channel_id = body.get('channel_id')
    user_id = body.get('user_id')
    text = body.get('text')
    
    if not channel_id or not user_id:
        return error_response('channel_id and user_id required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        INSERT INTO messages 
        (channel_id, user_id, text, file_name, file_url, file_type, voice_url, voice_duration)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, created_at
    """, (channel_id, user_id, text, body.get('file_name'), body.get('file_url'),
          body.get('file_type'), body.get('voice_url'), body.get('voice_duration')))
    
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'created_at': result['created_at'].isoformat()})

def handle_get_channels(params):
    user_id = params.get('user_id')
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT DISTINCT c.id, c.name, c.type, c.created_at,
            (SELECT COUNT(*) FROM messages WHERE channel_id = c.id) as message_count
        FROM channels c
        LEFT JOIN channel_members cm ON c.id = cm.channel_id
        WHERE c.type = 'public' 
            OR (cm.user_id = %s AND user_id IS NOT NULL)
        ORDER BY c.created_at DESC
    """, (user_id,) if user_id else (None,))
    
    channels = cur.fetchall()
    cur.close()
    conn.close()
    
    for ch in channels:
        ch['created_at'] = ch['created_at'].isoformat()
    
    return success_response({'channels': channels})

def handle_create_channel(event):
    body = json.loads(event.get('body', '{}'))
    name = body.get('name')
    channel_type = body.get('type', 'group')
    created_by = body.get('created_by')
    member_ids = body.get('member_ids', [])
    
    if not name or not created_by:
        return error_response('name and created_by required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        INSERT INTO channels (name, type, created_by)
        VALUES (%s, %s, %s)
        RETURNING id, created_at
    """, (name, channel_type, created_by))
    
    result = cur.fetchone()
    channel_id = result['id']
    
    for user_id in [created_by] + member_ids:
        cur.execute("""
            INSERT INTO channel_members (channel_id, user_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
        """, (channel_id, user_id))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': channel_id, 'created_at': result['created_at'].isoformat()})

def handle_get_online_users():
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT COUNT(*) as count,
            json_agg(json_build_object('id', id, 'name', name, 'last_seen', last_seen)) as users
        FROM users
        WHERE is_online = true 
            AND last_seen > NOW() - INTERVAL '5 minutes'
    """)
    
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    return success_response({'online_count': result['count'], 'users': result['users'] or []})

def handle_get_all_users():
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT id, name, phone, grade, is_online, last_seen
        FROM users
        ORDER BY name
    """)
    
    users = cur.fetchall()
    cur.close()
    conn.close()
    
    for u in users:
        u['last_seen'] = u['last_seen'].isoformat()
    
    return success_response({'users': users})

# ========== CRM HANDLERS ==========

def handle_get_clients(params):
    owner_id = params.get('owner_id')
    if not owner_id:
        return error_response('owner_id required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT c.*,
            (SELECT COUNT(*) FROM crm_tasks WHERE client_id = c.id AND status != 'completed') as pending_tasks
        FROM crm_clients c
        WHERE c.owner_id = %s
        ORDER BY c.updated_at DESC
    """, (owner_id,))
    
    clients = cur.fetchall()
    cur.close()
    conn.close()
    
    for client in clients:
        client['created_at'] = client['created_at'].isoformat()
        client['updated_at'] = client['updated_at'].isoformat()
        if client['expected_close_date']:
            client['expected_close_date'] = client['expected_close_date'].isoformat()
    
    return success_response({'clients': clients})

def handle_create_client(event):
    body = json.loads(event.get('body', '{}'))
    owner_id = body.get('owner_id')
    company_name = body.get('company_name')
    
    if not owner_id or not company_name:
        return error_response('owner_id and company_name required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        INSERT INTO crm_clients 
        (owner_id, company_name, contact_person, phone, email, status, budget, probability, expected_close_date, source, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, created_at
    """, (owner_id, company_name, body.get('contact_person'), body.get('phone'),
          body.get('email'), body.get('status', 'lead'), body.get('budget'),
          body.get('probability', 20), body.get('expected_close_date'),
          body.get('source'), body.get('notes')))
    
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'created_at': result['created_at'].isoformat()})

def handle_update_client(path, event):
    client_id = path.split('/clients/')[1].split('/')[0]
    body = json.loads(event.get('body', '{}'))
    
    conn = get_db()
    cur = conn.cursor()
    
    fields = []
    values = []
    for key in ['company_name', 'contact_person', 'phone', 'email', 'status', 'budget', 'probability', 'expected_close_date', 'source', 'notes']:
        if key in body:
            fields.append(f"{key} = %s")
            values.append(body[key])
    
    if not fields:
        return error_response('No fields to update', 400)
    
    fields.append("updated_at = CURRENT_TIMESTAMP")
    values.append(client_id)
    
    cur.execute(f"UPDATE crm_clients SET {', '.join(fields)} WHERE id = %s", values)
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'status': 'updated'})

def handle_get_tasks(params):
    owner_id = params.get('owner_id')
    if not owner_id:
        return error_response('owner_id required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT t.*, c.company_name
        FROM crm_tasks t
        LEFT JOIN crm_clients c ON t.client_id = c.id
        WHERE t.owner_id = %s
        ORDER BY 
            CASE t.priority 
                WHEN 'urgent' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                ELSE 4
            END,
            t.due_date ASC NULLS LAST
    """, (owner_id,))
    
    tasks = cur.fetchall()
    cur.close()
    conn.close()
    
    for task in tasks:
        task['created_at'] = task['created_at'].isoformat()
        if task['due_date']:
            task['due_date'] = task['due_date'].isoformat()
    
    return success_response({'tasks': tasks})

def handle_create_task(event):
    body = json.loads(event.get('body', '{}'))
    owner_id = body.get('owner_id')
    title = body.get('title')
    
    if not owner_id or not title:
        return error_response('owner_id and title required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        INSERT INTO crm_tasks 
        (owner_id, client_id, title, description, due_date, priority, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id, created_at
    """, (owner_id, body.get('client_id'), title, body.get('description'),
          body.get('due_date'), body.get('priority', 'medium'), body.get('status', 'pending')))
    
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'created_at': result['created_at'].isoformat()})

def handle_update_task(path, event):
    task_id = path.split('/tasks/')[1].split('/')[0]
    body = json.loads(event.get('body', '{}'))
    
    conn = get_db()
    cur = conn.cursor()
    
    fields = []
    values = []
    for key in ['title', 'description', 'due_date', 'priority', 'status']:
        if key in body:
            fields.append(f"{key} = %s")
            values.append(body[key])
    
    if not fields:
        return error_response('No fields to update', 400)
    
    values.append(task_id)
    cur.execute(f"UPDATE crm_tasks SET {', '.join(fields)} WHERE id = %s", values)
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'status': 'updated'})

def handle_get_activities(params):
    client_id = params.get('client_id')
    if not client_id:
        return error_response('client_id required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT a.*, u.name as user_name
        FROM crm_activities a
        JOIN users u ON a.user_id = u.id
        WHERE a.client_id = %s
        ORDER BY a.created_at DESC
    """, (client_id,))
    
    activities = cur.fetchall()
    cur.close()
    conn.close()
    
    for act in activities:
        act['created_at'] = act['created_at'].isoformat()
    
    return success_response({'activities': activities})

def handle_create_activity(event):
    body = json.loads(event.get('body', '{}'))
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        INSERT INTO crm_activities (client_id, user_id, type, description)
        VALUES (%s, %s, %s, %s)
        RETURNING id, created_at
    """, (body.get('client_id'), body.get('user_id'), body.get('type'), body.get('description')))
    
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'id': result['id'], 'created_at': result['created_at'].isoformat()})

def handle_get_crm_stats(params):
    owner_id = params.get('owner_id')
    if not owner_id:
        return error_response('owner_id required', 400)
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT 
            COUNT(*) as total_clients,
            COUNT(*) FILTER (WHERE status = 'lead') as leads,
            COUNT(*) FILTER (WHERE status = 'won') as won_deals,
            COALESCE(SUM(budget) FILTER (WHERE status = 'won'), 0) as total_revenue,
            COALESCE(SUM(budget) FILTER (WHERE status IN ('negotiation', 'proposal', 'contract')), 0) as pipeline_value
        FROM crm_clients
        WHERE owner_id = %s
    """, (owner_id,))
    
    stats = dict(cur.fetchone())
    cur.close()
    conn.close()
    
    return success_response({'stats': stats})

# ========== ADMIN HANDLERS ==========

def handle_admin_get_users():
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT u.*,
            (SELECT COUNT(*) FROM crm_clients WHERE owner_id = u.id) as client_count,
            (SELECT COUNT(*) FROM crm_tasks WHERE owner_id = u.id AND status != 'completed') as active_tasks
        FROM users u
        ORDER BY u.created_at DESC
    """)
    
    users = cur.fetchall()
    cur.close()
    conn.close()
    
    for user in users:
        user['created_at'] = user['created_at'].isoformat()
        user['last_seen'] = user['last_seen'].isoformat()
    
    return success_response({'users': users})

def handle_admin_get_user(path):
    user_id = path.split('/users/')[1].split('/')[0]
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return error_response('User not found', 404)
    
    cur.execute("""
        SELECT id, company_name, status, budget, probability
        FROM crm_clients
        WHERE owner_id = %s
        ORDER BY updated_at DESC
    """, (user_id,))
    clients = cur.fetchall()
    
    cur.execute("""
        SELECT id, title, status, priority, due_date
        FROM crm_tasks
        WHERE owner_id = %s AND status != 'completed'
        ORDER BY due_date ASC NULLS LAST
    """, (user_id,))
    tasks = cur.fetchall()
    
    cur.close()
    conn.close()
    
    user['created_at'] = user['created_at'].isoformat()
    user['last_seen'] = user['last_seen'].isoformat()
    
    for task in tasks:
        task['created_at'] = task['created_at'].isoformat()
        if task['due_date']:
            task['due_date'] = task['due_date'].isoformat()
    
    return success_response({'user': dict(user), 'clients': clients, 'tasks': tasks})

def handle_admin_update_user(path, event):
    user_id = path.split('/users/')[1].split('/')[0]
    body = json.loads(event.get('body', '{}'))
    
    conn = get_db()
    cur = conn.cursor()
    
    fields = []
    values = []
    for key in ['name', 'phone', 'grade', 'asset', 'expected_income', 'is_admin']:
        if key in body:
            fields.append(f"{key} = %s")
            values.append(body[key])
    
    if not fields:
        return error_response('No fields to update', 400)
    
    values.append(user_id)
    cur.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = %s", values)
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'status': 'updated'})

def handle_admin_stats():
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT 
            (SELECT COUNT(*) FROM users) as total_users,
            (SELECT COUNT(*) FROM users WHERE is_online = true) as online_users,
            (SELECT COUNT(*) FROM crm_clients) as total_clients,
            (SELECT COUNT(*) FROM messages) as total_messages,
            (SELECT COALESCE(SUM(budget), 0) FROM crm_clients WHERE status = 'won') as total_revenue,
            (SELECT COALESCE(SUM(budget), 0) FROM crm_clients WHERE status IN ('negotiation', 'proposal', 'contract')) as pipeline_value
    """)
    
    stats = dict(cur.fetchone())
    cur.close()
    conn.close()
    
    return success_response({'stats': stats})

def handle_admin_channels():
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT c.*,
            (SELECT COUNT(*) FROM channel_members WHERE channel_id = c.id) as member_count,
            (SELECT COUNT(*) FROM messages WHERE channel_id = c.id) as message_count
        FROM channels c
        ORDER BY c.created_at DESC
    """)
    
    channels = cur.fetchall()
    cur.close()
    conn.close()
    
    for ch in channels:
        ch['created_at'] = ch['created_at'].isoformat()
    
    return success_response({'channels': channels})

def handle_admin_broadcast(event):
    body = json.loads(event.get('body', '{}'))
    message = body.get('message')
    
    if not message:
        return error_response('message required', 400)
    
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO messages (channel_id, user_id, text)
        SELECT 1, 
            (SELECT id FROM users WHERE is_admin = true LIMIT 1),
            %s
    """, (message,))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return success_response({'status': 'sent'})

# ========== HELPER FUNCTIONS ==========

def success_response(data: dict) -> dict:
    """Успешный ответ"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, ensure_ascii=False),
        'isBase64Encoded': False
    }

def error_response(message: str, status_code: int = 400) -> dict:
    """Ответ с ошибкой"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}, ensure_ascii=False),
        'isBase64Encoded': False
    }
