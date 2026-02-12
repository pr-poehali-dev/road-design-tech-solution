"""API для работы с чатом: сообщения, каналы, пользователи онлайн"""
import json
import os
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event, context):
    """Обработка запросов к чату"""
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
        else:
            return error_response('Method not allowed', 405)
    finally:
        conn.close()


def handle_get(event, conn):
    """GET запросы: получение сообщений, пользователей онлайн"""
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'messages')
    
    if action == 'messages':
        channel_id = params.get('channel_id', 'general')
        return get_messages(conn, channel_id)
    
    elif action == 'online_users':
        return get_online_users(conn)
    
    elif action == 'channels':
        return get_channels(conn)
    
    return error_response('Unknown action', 400)


def handle_post(event, conn):
    """POST запросы: отправка сообщений, обновление статуса"""
    body = json.loads(event.get('body', '{}'))
    action = body.get('action')
    
    if action == 'send_message':
        return send_message(conn, body)
    
    elif action == 'update_online':
        return update_online_status(conn, body)
    
    elif action == 'register_user':
        return register_user(conn, body)
    
    return error_response('Unknown action', 400)


def get_messages(conn, channel_id):
    """Получить сообщения канала"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                m.id,
                m.channel_id,
                m.user_id,
                u.name as user_name,
                m.content,
                m.message_type,
                m.file_url,
                m.file_name,
                m.created_at
            FROM t_p24285059_road_design_tech_sol.chat_messages m
            LEFT JOIN t_p24285059_road_design_tech_sol.chat_users u ON m.user_id = u.id
            WHERE m.channel_id = %s
            ORDER BY m.created_at ASC
            LIMIT 100
        """, (channel_id,))
        
        messages = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({
                'messages': messages,
                'channel_id': channel_id
            }, default=str),
            'isBase64Encoded': False
        }


def get_online_users(conn):
    """Получить список пользователей онлайн"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                u.id,
                u.name,
                u.phone,
                u.is_online,
                u.last_seen
            FROM t_p24285059_road_design_tech_sol.chat_users u
            WHERE u.is_online = true
            ORDER BY u.name
        """)
        
        users = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({
                'users': users,
                'count': len(users)
            }, default=str),
            'isBase64Encoded': False
        }


def get_channels(conn):
    """Получить список каналов пользователя"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                c.id,
                c.name,
                c.type,
                c.created_at,
                COUNT(DISTINCT cm.user_id) as members_count,
                (SELECT COUNT(*) FROM t_p24285059_road_design_tech_sol.chat_messages WHERE channel_id = c.id) as messages_count
            FROM t_p24285059_road_design_tech_sol.chat_channels c
            LEFT JOIN t_p24285059_road_design_tech_sol.chat_channel_members cm ON c.id = cm.channel_id
            GROUP BY c.id, c.name, c.type, c.created_at
            ORDER BY c.created_at DESC
        """)
        
        channels = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'channels': channels}, default=str),
            'isBase64Encoded': False
        }


def send_message(conn, body):
    """Отправить сообщение"""
    channel_id = body.get('channel_id')
    user_id = body.get('user_id')
    content = body.get('content', '')
    message_type = body.get('message_type', 'text')
    file_url = body.get('file_url')
    file_name = body.get('file_name')
    
    if not channel_id or not user_id:
        return error_response('Missing channel_id or user_id', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO t_p24285059_road_design_tech_sol.chat_messages (channel_id, user_id, content, message_type, file_url, file_name)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, created_at
        """, (channel_id, user_id, content, message_type, file_url, file_name))
        
        result = cur.fetchone()
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({
                'success': True,
                'message_id': result['id'],
                'created_at': str(result['created_at'])
            }),
            'isBase64Encoded': False
        }


def update_online_status(conn, body):
    """Обновить онлайн статус пользователя"""
    user_id = body.get('user_id')
    is_online = body.get('is_online', True)
    
    if not user_id:
        return error_response('Missing user_id', 400)
    
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE t_p24285059_road_design_tech_sol.chat_users 
            SET is_online = %s, last_seen = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (is_online, user_id))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers(),
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def register_user(conn, body):
    """Зарегистрировать/получить пользователя"""
    name = body.get('name')
    phone = body.get('phone')
    
    if not name or not phone:
        return error_response('Missing name or phone', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Проверяем существует ли пользователь
        cur.execute("SELECT * FROM t_p24285059_road_design_tech_sol.chat_users WHERE phone = %s", (phone,))
        user = cur.fetchone()
        
        if user:
            # Обновляем статус онлайн
            cur.execute("""
                UPDATE t_p24285059_road_design_tech_sol.chat_users 
                SET is_online = true, last_seen = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, name, phone, role
            """, (user['id'],))
            updated_user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers(),
                'body': json.dumps({'user': updated_user}, default=str),
                'isBase64Encoded': False
            }
        else:
            # Создаем нового пользователя
            cur.execute("""
                INSERT INTO t_p24285059_road_design_tech_sol.chat_users (name, phone, is_online, role)
                VALUES (%s, %s, true, 'partner')
                RETURNING id, name, phone, role
            """, (name, phone))
            new_user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers(),
                'body': json.dumps({'user': new_user}, default=str),
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