"""API для CRM системы партнеров"""
import json
import os
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event, context):
    """Обработка запросов к CRM"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
            },
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
    finally:
        conn.close()


def handle_get(event, conn):
    """GET запросы"""
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'clients')
    partner_id = params.get('partner_id')
    
    if not partner_id:
        return error_response('Missing partner_id', 400)
    
    try:
        partner_id = int(partner_id)
    except (ValueError, TypeError):
        return error_response('Invalid partner_id: must be a number', 400)
    
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
    """POST запросы: создание"""
    body = json.loads(event.get('body', '{}'))
    resource = body.get('resource')
    partner_id = body.get('partner_id')
    
    if not partner_id:
        return error_response('Missing partner_id', 400)
    
    try:
        partner_id = int(partner_id)
    except (ValueError, TypeError):
        return error_response('Invalid partner_id: must be a number', 400)
    
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
    partner_id = body.get('partner_id')
    
    if not partner_id:
        return error_response('Missing partner_id', 400)
    
    try:
        partner_id = int(partner_id)
    except (ValueError, TypeError):
        return error_response('Invalid partner_id: must be a number', 400)
    
    if resource == 'client':
        return update_client(conn, partner_id, body)
    elif resource == 'task':
        return update_task(conn, partner_id, body)
    
    return error_response('Unknown resource', 400)


def handle_delete(event, conn):
    """DELETE запросы"""
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource')
    partner_id = params.get('partner_id')
    item_id = params.get('id')
    
    if not partner_id or not item_id:
        return error_response('Missing partner_id or id', 400)
    
    try:
        partner_id = int(partner_id)
    except (ValueError, TypeError):
        return error_response('Invalid partner_id: must be a number', 400)
    
    if resource == 'client':
        return delete_client(conn, partner_id, item_id)
    elif resource == 'task':
        return delete_task(conn, partner_id, item_id)
    
    return error_response('Unknown resource', 400)


def get_clients(conn, partner_id, params):
    """Получить клиентов партнера"""
    stage = params.get('stage')
    
    query = """
        SELECT 
            c.*,
            COUNT(DISTINCT a.id) as activities_count,
            COUNT(DISTINCT t.id) as tasks_count
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
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'clients': clients}, default=str),
            'isBase64Encoded': False
        }


def get_client_details(conn, partner_id, client_id):
    """Получить детали клиента"""
    if not client_id:
        return error_response('Missing client_id', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT * FROM crm_clients
            WHERE id = %s AND partner_id = %s
        """, (client_id, partner_id))
        
        client = cur.fetchone()
        
        if not client:
            return error_response('Client not found', 404)
        
        # Получаем активности
        cur.execute("""
            SELECT * FROM crm_activities
            WHERE client_id = %s
            ORDER BY created_at DESC
            LIMIT 50
        """, (client_id,))
        activities = cur.fetchall()
        
        # Получаем задачи
        cur.execute("""
            SELECT * FROM crm_tasks
            WHERE client_id = %s
            ORDER BY due_date ASC
        """, (client_id,))
        tasks = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({
                'client': client,
                'activities': activities,
                'tasks': tasks
            }, default=str),
            'isBase64Encoded': False
        }


def get_tasks(conn, partner_id):
    """Получить задачи партнера"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                t.*,
                c.company_name as client_name
            FROM crm_tasks t
            LEFT JOIN crm_clients c ON t.client_id = c.id
            WHERE t.partner_id = %s
            ORDER BY t.due_date ASC
        """, (partner_id,))
        
        tasks = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'tasks': tasks}, default=str),
            'isBase64Encoded': False
        }


def get_activities(conn, partner_id, params):
    """Получить активности партнера"""
    client_id = params.get('client_id')
    
    query = """
        SELECT 
            a.*,
            c.company_name as client_name
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
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'activities': activities}, default=str),
            'isBase64Encoded': False
        }


def get_partner_stats(conn, partner_id):
    """Получить статистику партнера"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                COUNT(DISTINCT c.id) as total_clients,
                COUNT(DISTINCT CASE WHEN c.stage = 'lead' THEN c.id END) as leads_count,
                COUNT(DISTINCT CASE WHEN c.stage = 'qualified' THEN c.id END) as qualified_count,
                COUNT(DISTINCT CASE WHEN c.stage = 'proposal' THEN c.id END) as proposal_count,
                COUNT(DISTINCT CASE WHEN c.stage = 'negotiation' THEN c.id END) as negotiation_count,
                COUNT(DISTINCT CASE WHEN c.stage = 'closed_won' THEN c.id END) as won_count,
                COUNT(DISTINCT CASE WHEN c.stage = 'closed_lost' THEN c.id END) as lost_count,
                COALESCE(SUM(CASE WHEN c.stage = 'closed_won' THEN c.deal_amount END), 0) as total_revenue,
                COUNT(DISTINCT t.id) as total_tasks,
                COUNT(DISTINCT CASE WHEN t.status = 'pending' THEN t.id END) as pending_tasks,
                COUNT(DISTINCT a.id) as total_activities
            FROM crm_clients c
            LEFT JOIN crm_tasks t ON t.partner_id = %s
            LEFT JOIN crm_activities a ON a.partner_id = %s
            WHERE c.partner_id = %s
        """, (partner_id, partner_id, partner_id))
        
        stats = cur.fetchone()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'stats': stats}, default=str),
            'isBase64Encoded': False
        }


def create_client(conn, partner_id, body):
    """Создать клиента"""
    data = body.get('data') or body
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO crm_clients (
                partner_id, company_name, contact_person, email, phone,
                stage, deal_amount, source, notes
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at
        """, (
            partner_id,
            data.get('company_name', ''),
            data.get('contact_person') or data.get('contact_name', ''),
            data.get('email', ''),
            data.get('phone', ''),
            data.get('stage', 'lead'),
            data.get('deal_amount', 0),
            data.get('source', ''),
            data.get('notes', '')
        ))
        
        result = cur.fetchone()
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({
                'success': True,
                'id': result['id'],
                'created_at': str(result['created_at'])
            }),
            'isBase64Encoded': False
        }


def update_client(conn, partner_id, body):
    """Обновить клиента"""
    client_id = body.get('id')
    updates = body.get('updates', {})
    
    if not client_id or not updates:
        return error_response('Missing id or updates', 400)
    
    set_clause = ', '.join([f"{key} = %s" for key in updates.keys()])
    values = list(updates.values()) + [client_id, partner_id]
    
    with conn.cursor() as cur:
        cur.execute(f"""
            UPDATE crm_clients 
            SET {set_clause}
            WHERE id = %s AND partner_id = %s
        """, values)
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def delete_client(conn, partner_id, client_id):
    """Удалить клиента"""
    with conn.cursor() as cur:
        cur.execute("""
            DELETE FROM crm_clients 
            WHERE id = %s AND partner_id = %s
        """, (client_id, partner_id))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def create_task(conn, partner_id, body):
    """Создать задачу"""
    data = body.get('data', {})
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO crm_tasks (
                partner_id, client_id, title, description, due_date, priority, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at
        """, (
            partner_id,
            data.get('client_id'),
            data.get('title'),
            data.get('description'),
            data.get('due_date'),
            data.get('priority', 'medium'),
            data.get('status', 'pending')
        ))
        
        result = cur.fetchone()
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({
                'success': True,
                'id': result['id'],
                'created_at': str(result['created_at'])
            }),
            'isBase64Encoded': False
        }


def update_task(conn, partner_id, body):
    """Обновить задачу"""
    task_id = body.get('id')
    updates = body.get('updates', {})
    
    if not task_id or not updates:
        return error_response('Missing id or updates', 400)
    
    set_clause = ', '.join([f"{key} = %s" for key in updates.keys()])
    values = list(updates.values()) + [task_id, partner_id]
    
    with conn.cursor() as cur:
        cur.execute(f"""
            UPDATE crm_tasks 
            SET {set_clause}
            WHERE id = %s AND partner_id = %s
        """, values)
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def delete_task(conn, partner_id, task_id):
    """Удалить задачу"""
    with conn.cursor() as cur:
        cur.execute("""
            DELETE FROM crm_tasks 
            WHERE id = %s AND partner_id = %s
        """, (task_id, partner_id))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def create_activity(conn, partner_id, body):
    """Создать активность"""
    data = body.get('data', {})
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO crm_activities (
                partner_id, client_id, activity_type, subject, notes
            ) VALUES (%s, %s, %s, %s, %s)
            RETURNING id, created_at
        """, (
            partner_id,
            data.get('client_id'),
            data.get('activity_type'),
            data.get('subject'),
            data.get('notes')
        ))
        
        result = cur.fetchone()
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({
                'success': True,
                'id': result['id'],
                'created_at': str(result['created_at'])
            }),
            'isBase64Encoded': False
        }


def headers():
    """Заголовки CORS"""
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
    }


def error_response(message, status_code):
    """Ответ с ошибкой"""
    return {
        'statusCode': status_code,
        'headers': headers(),
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }