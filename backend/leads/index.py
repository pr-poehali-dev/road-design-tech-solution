"""
Обработчик заявок: сохранение в БД и отправка уведомлений в Telegram.
Автоматически отправляет уведомления при каждой новой заявке.
"""
import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime
import urllib.request
import urllib.parse

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Сохраняет заявку в базу данных и отправляет уведомление в Telegram
    """
    method: str = event.get('httpMethod', 'GET')
    
    # CORS для всех запросов
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    # GET - получить все заявки
    if method == 'GET':
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT id, type, name, phone, email, company, message, source, status, 
                       created_at, updated_at
                FROM leads 
                ORDER BY created_at DESC
            """)
            
            rows = cur.fetchall()
            leads = []
            for row in rows:
                leads.append({
                    'id': str(row[0]),
                    'type': row[1],
                    'name': row[2],
                    'phone': row[3],
                    'email': row[4],
                    'company': row[5],
                    'message': row[6],
                    'source': row[7],
                    'status': row[8],
                    'createdAt': row[9].isoformat() if row[9] else None,
                    'updatedAt': row[10].isoformat() if row[10] else None
                })
            
            cur.close()
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'leads': leads}),
                'isBase64Encoded': False
            }
        finally:
            conn.close()
    
    # POST - создать заявку
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        lead_type = body_data.get('type', 'Не указан')
        name = body_data.get('name', 'Не указано')
        phone = body_data.get('phone', '')
        email = body_data.get('email', '')
        company = body_data.get('company', '')
        message = body_data.get('message', '')
        source = body_data.get('source', 'Не указан')
        
        # Сохранение в БД
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        try:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO leads (type, name, phone, email, company, message, source, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'new')
                RETURNING id
            """, (lead_type, name, phone, email, company, message, source))
            
            lead_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            
            # Отправка в Telegram
            telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
            telegram_chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
            
            if telegram_token and telegram_chat_id:
                telegram_message = f"""🔔 Новая заявка #{lead_id}

📋 Тип: {lead_type}
👤 Имя: {name}
📞 Телефон: {phone}
✉️ Email: {email}
🏢 Компания: {company}
💬 Сообщение: {message}
📍 Источник: {source}

⏰ {datetime.now().strftime('%d.%m.%Y %H:%M')}"""
                
                try:
                    telegram_url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
                    telegram_data = urllib.parse.urlencode({
                        'chat_id': telegram_chat_id,
                        'text': telegram_message,
                        'parse_mode': 'HTML'
                    }).encode('utf-8')
                    
                    req = urllib.request.Request(telegram_url, data=telegram_data)
                    urllib.request.urlopen(req)
                except Exception as e:
                    print(f"Telegram error: {str(e)}")
            
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({
                    'success': True,
                    'leadId': lead_id,
                    'message': 'Заявка успешно сохранена'
                }),
                'isBase64Encoded': False
            }
        finally:
            conn.close()
    
    # PUT - обновить статус заявки
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        lead_id = body_data.get('id')
        status = body_data.get('status')
        
        if not lead_id or not status:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'ID and status are required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        try:
            cur = conn.cursor()
            cur.execute("""
                UPDATE leads 
                SET status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (status, lead_id))
            conn.commit()
            cur.close()
            
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'success': True, 'message': 'Статус обновлён'}),
                'isBase64Encoded': False
            }
        finally:
            conn.close()
    
    # DELETE - удалить заявку
    if method == 'DELETE':
        params = event.get('queryStringParameters') or {}
        lead_id = params.get('id')
        
        if not lead_id:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'ID is required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        try:
            cur = conn.cursor()
            cur.execute("DELETE FROM leads WHERE id = %s", (lead_id,))
            conn.commit()
            cur.close()
            
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'success': True, 'message': 'Заявка удалена'}),
                'isBase64Encoded': False
            }
        finally:
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': cors_headers,
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }