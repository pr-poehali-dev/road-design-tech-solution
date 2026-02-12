"""API для админ-панели с аутентификацией"""
import json
import os
import hashlib
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

ADMIN_PASSWORD = "1989d1985R!1964Li.#"


def handler(event, context):
    """Обработка запросов к админ-панели"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Проверка авторизации
    auth_header = event.get('headers', {}).get('Authorization', '')
    if not verify_auth(auth_header):
        return {
            'statusCode': 401,
            'headers': headers(),
            'body': json.dumps({'error': 'Unauthorized'}),
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


def verify_auth(auth_header):
    """Проверка пароля администратора"""
    if not auth_header.startswith('Bearer '):
        return False
    password = auth_header.replace('Bearer ', '')
    return password == ADMIN_PASSWORD


def handle_get(event, conn):
    """GET запросы: получение данных"""
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'users')
    
    if resource == 'users':
        return get_all_users(conn)
    elif resource == 'user':
        user_id = params.get('id')
        return get_user_details(conn, user_id)
    elif resource == 'stats':
        return get_platform_stats(conn)
    elif resource == 'clients':
        partner_id = params.get('partner_id')
        return get_partner_clients(conn, partner_id)
    
    return error_response('Unknown resource', 400)


def handle_post(event, conn):
    """POST запросы: создание"""
    body = json.loads(event.get('body', '{}'))
    action = body.get('action')
    
    if action == 'update_user_role':
        return update_user_role(conn, body)
    elif action == 'assign_client':
        return assign_client_to_partner(conn, body)
    
    return error_response('Unknown action', 400)


def handle_put(event, conn):
    """PUT запросы: обновление"""
    body = json.loads(event.get('body', '{}'))
    resource = body.get('resource')
    
    if resource == 'user':
        return update_user(conn, body)
    
    return error_response('Unknown resource', 400)


def handle_delete(event, conn):
    """DELETE запросы: удаление"""
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource')
    
    if resource == 'user':
        user_id = params.get('id')
        return delete_user(conn, user_id)
    
    return error_response('Unknown resource', 400)


def get_all_users(conn):
    """Получить всех пользователей"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                u.id,
                u.name,
                u.phone,
                u.role,
                u.status,
                u.is_online,
                u.last_seen,
                u.registered_at,
                COUNT(DISTINCT cc.id) as clients_count,
                COUNT(DISTINCT m.id) as messages_count
            FROM users u
            LEFT JOIN crm_clients cc ON cc.partner_id = u.id
            LEFT JOIN messages m ON m.user_id = u.id
            GROUP BY u.id
            ORDER BY u.registered_at DESC
        """)
        
        users = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'users': users}, default=str),
            'isBase64Encoded': False
        }


def get_user_details(conn, user_id):
    """Получить детали пользователя"""
    if not user_id:
        return error_response('Missing user_id', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                u.*,
                COUNT(DISTINCT cc.id) as clients_count,
                COUNT(DISTINCT m.id) as messages_count,
                COALESCE(SUM(cc.deal_amount), 0) as total_deals
            FROM users u
            LEFT JOIN crm_clients cc ON cc.partner_id = u.id
            LEFT JOIN messages m ON m.user_id = u.id
            WHERE u.id = %s
            GROUP BY u.id
        """, (user_id,))
        
        user = cur.fetchone()
        
        if not user:
            return error_response('User not found', 404)
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'user': user}, default=str),
            'isBase64Encoded': False
        }


def get_platform_stats(conn):
    """Получить общую статистику платформы"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM users WHERE is_online = true) as online_users,
                (SELECT COUNT(*) FROM messages) as total_messages,
                (SELECT COUNT(*) FROM crm_clients) as total_clients,
                (SELECT COALESCE(SUM(deal_amount), 0) FROM crm_clients) as total_revenue
        """)
        
        stats = cur.fetchone()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'stats': stats}, default=str),
            'isBase64Encoded': False
        }


def get_partner_clients(conn, partner_id):
    """Получить клиентов партнера"""
    if not partner_id:
        return error_response('Missing partner_id', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT * FROM crm_clients
            WHERE partner_id = %s
            ORDER BY created_at DESC
        """, (partner_id,))
        
        clients = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'clients': clients}, default=str),
            'isBase64Encoded': False
        }


def update_user_role(conn, body):
    """Обновить роль пользователя"""
    user_id = body.get('user_id')
    role = body.get('role')
    
    if not user_id or not role:
        return error_response('Missing user_id or role', 400)
    
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE users 
            SET role = %s
            WHERE id = %s
        """, (role, user_id))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def update_user(conn, body):
    """Обновить данные пользователя"""
    user_id = body.get('id')
    updates = body.get('updates', {})
    
    if not user_id or not updates:
        return error_response('Missing id or updates', 400)
    
    set_clause = ', '.join([f"{key} = %s" for key in updates.keys()])
    values = list(updates.values()) + [user_id]
    
    with conn.cursor() as cur:
        cur.execute(f"""
            UPDATE users 
            SET {set_clause}
            WHERE id = %s
        """, values)
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def delete_user(conn, user_id):
    """Удалить пользователя"""
    if not user_id:
        return error_response('Missing user_id', 400)
    
    with conn.cursor() as cur:
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def assign_client_to_partner(conn, body):
    """Назначить клиента партнеру"""
    client_id = body.get('client_id')
    partner_id = body.get('partner_id')
    
    if not client_id or not partner_id:
        return error_response('Missing client_id or partner_id', 400)
    
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE crm_clients 
            SET partner_id = %s
            WHERE id = %s
        """, (partner_id, client_id))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def headers():
    """Заголовки CORS"""
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }


def error_response(message, status_code):
    """Ответ с ошибкой"""
    return {
        'statusCode': status_code,
        'headers': headers(),
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }
