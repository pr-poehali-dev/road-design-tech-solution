"""EVDEN 2.0: Telegram — приём входящих сообщений (webhook) и отправка исходящих, привязанных к сделке"""
import json
import os
import urllib.request
import urllib.parse
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event, context):
    """Обрабатывает Telegram webhook (входящие сообщения) и запросы на отправку сообщений клиенту сделки"""
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
        params = event.get('queryStringParameters') or {}
        body = json.loads(event.get('body', '{}')) if event.get('body') else {}

        if method == 'POST' and params.get('mode') == 'webhook':
            return handle_telegram_webhook(conn, body)

        if method == 'POST' and body.get('resource') == 'send':
            return send_message(conn, body)

        if method == 'POST' and body.get('resource') == 'register-webhook':
            return register_webhook(body)

        if method == 'GET':
            return get_messages(conn, params)

        return error_response('Unknown request', 400)
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        conn.close()


def handle_telegram_webhook(conn, update):
    """Принимает апдейт от Telegram, сохраняет сообщение и привязывает к сделке по chat_id или username"""
    message = update.get('message') or update.get('edited_message')
    if not message:
        return ok_response({'ok': True})

    chat = message.get('chat', {})
    chat_id = str(chat.get('id', ''))
    username = chat.get('username', '')
    text = message.get('text', '')
    sender_name = message.get('from', {}).get('first_name', 'Клиент')

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id FROM evden_deals WHERE telegram_chat_id = %s", (chat_id,))
        deal = cur.fetchone()

        if not deal and username:
            cur.execute("SELECT id FROM evden_deals WHERE telegram_username = %s", (username,))
            deal = cur.fetchone()
            if deal:
                cur.execute("UPDATE evden_deals SET telegram_chat_id = %s WHERE id = %s", (chat_id, deal['id']))

        deal_id = deal['id'] if deal else None

        cur.execute("""
            INSERT INTO evden_messages (deal_id, channel, direction, sender_name, telegram_chat_id, text)
            VALUES (%s, 'telegram', 'in', %s, %s, %s)
            RETURNING *
        """, (deal_id, sender_name, chat_id, text))
        conn.commit()

    if not deal_id:
        notify_unassigned(chat_id, username, text)

    return ok_response({'ok': True, 'deal_id': deal_id})


def notify_unassigned(chat_id, username, text):
    """Уведомляет ответственных о сообщении от неопознанного контакта"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    admin_chat = os.environ.get('TELEGRAM_CHAT_ID')
    if not bot_token or not admin_chat:
        return
    try:
        send_telegram_raw(bot_token, admin_chat, f"Новое сообщение без привязки к сделке\nОт: @{username or 'неизвестен'} (chat_id={chat_id})\nТекст: {text}")
    except Exception:
        pass


def register_webhook(body):
    """Служебный метод: регистрирует URL этой же функции как webhook в Telegram Bot API"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return error_response('TELEGRAM_BOT_TOKEN not configured', 500)

    target_url = body.get('function_url')
    if not target_url:
        return error_response('Provide function_url in body — the public URL of this function', 400)

    webhook_url = f"{target_url}?mode=webhook"
    api_url = f"https://api.telegram.org/bot{bot_token}/setWebhook"
    data = urllib.parse.urlencode({'url': webhook_url}).encode('utf-8')
    req = urllib.request.Request(api_url, data=data, method='POST')
    with urllib.request.urlopen(req, timeout=15) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    return ok_response({'success': True, 'telegram_response': result, 'webhook_url': webhook_url})


def send_message(conn, body):
    """Отправляет сообщение клиенту в Telegram, привязанное к сделке"""
    deal_id = body.get('deal_id')
    text = (body.get('text') or '').strip()
    if not deal_id or not text:
        return error_response('deal_id and text are required', 400)

    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return error_response('TELEGRAM_BOT_TOKEN not configured', 500)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT telegram_chat_id, company_name FROM evden_deals WHERE id = %s", (deal_id,))
        deal = cur.fetchone()

    if not deal:
        return error_response('Deal not found', 404)
    if not deal.get('telegram_chat_id'):
        return error_response('У сделки нет привязанного Telegram-чата: клиент ещё не писал боту', 400)

    send_telegram_raw(bot_token, deal['telegram_chat_id'], text)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO evden_messages (deal_id, channel, direction, sender_name, telegram_chat_id, text)
            VALUES (%s, 'telegram', 'out', 'Менеджер', %s, %s)
            RETURNING *
        """, (deal_id, deal['telegram_chat_id'], text))
        msg = cur.fetchone()
        conn.commit()

    return ok_response({'success': True, 'message': msg})


def send_telegram_raw(bot_token, chat_id, text):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = urllib.parse.urlencode({'chat_id': chat_id, 'text': text}).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))


def get_messages(conn, params):
    deal_id = params.get('deal_id')
    if not deal_id:
        return error_response('Missing deal_id', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT * FROM evden_messages WHERE deal_id = %s ORDER BY created_at ASC
        """, (deal_id,))
        messages = cur.fetchall()

    return ok_response({'messages': messages})


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def ok_response(data):
    return {
        'statusCode': 200,
        'headers': cors_headers(),
        'body': json.dumps(data, default=str),
        'isBase64Encoded': False,
    }


def error_response(message, status):
    return {
        'statusCode': status,
        'headers': cors_headers(),
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False,
    }
