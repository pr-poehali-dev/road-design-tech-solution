"""Радужный мост: единая переписка с клиентами через Email (IMAP/SMTP), Telegram и MAX"""
import json
import os
import re
import ssl
import smtplib
import imaplib
import email as email_lib
import urllib.request
import urllib.parse
from email.header import decode_header
from email.mime.text import MIMEText
from email.utils import parseaddr

import psycopg2
from psycopg2.extras import RealDictCursor


IMAP_HOST = 'imap.beget.com'
IMAP_PORT = 993
SMTP_HOST = 'smtp.beget.com'
SMTP_PORT = 465


def handler(event, context):
    """Обрабатывает запросы модуля 'Радужный мост': список диалогов, сообщения, отправка писем/Telegram,
    синхронизация входящей почты по IMAP, приём Telegram webhook."""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors(), 'body': '', 'isBase64Encoded': False}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        params = event.get('queryStringParameters') or {}
        body = {}
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except Exception:
                body = {}

        if method == 'POST' and params.get('mode') == 'telegram_webhook':
            return handle_telegram_webhook(conn, body)

        resource = body.get('resource') or params.get('resource')

        if method == 'GET':
            if resource == 'conversations':
                return get_conversations(conn, params)
            if resource == 'messages':
                return get_messages(conn, params)
            return error_response('Unknown resource', 400)

        if method == 'POST':
            if resource == 'send_email':
                return send_email(conn, body)
            if resource == 'send_telegram':
                return send_telegram(conn, body)
            if resource == 'sync_email':
                return sync_email(conn, body)
            if resource == 'mark_read':
                return mark_read(conn, body)
            if resource == 'register_telegram_webhook':
                return register_telegram_webhook(body)
            return error_response('Unknown resource', 400)

        return error_response('Method not allowed', 405)
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        conn.close()


# ------------------------------------------------------------ conversations --

def get_conversations(conn, params):
    """Список диалогов партнёра: по одному на клиента, с последним сообщением и счётчиком непрочитанных."""
    partner_id = _parse_int(params.get('partner_id'))
    if partner_id is None:
        return error_response('Missing partner_id', 400)
    channel = params.get('channel')  # опциональный фильтр по каналу

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        query = """
            SELECT DISTINCT ON (c.id)
                c.id AS client_id,
                c.company_name,
                c.contact_person,
                c.email,
                c.phone,
                c.telegram_chat_id,
                c.telegram_username,
                c.unread_messages_count,
                c.last_message_at,
                m.channel AS last_channel,
                m.body AS last_message,
                m.direction AS last_direction,
                m.created_at AS last_message_created_at
            FROM crm_clients c
            JOIN bridge_messages m ON m.client_id = c.id
            WHERE c.partner_id = %s
        """
        args = [partner_id]
        if channel:
            query += " AND m.channel = %s"
            args.append(channel)
        query += " ORDER BY c.id, m.created_at DESC"

        cur.execute(query, args)
        rows = cur.fetchall()

    rows.sort(key=lambda r: r['last_message_created_at'] or '', reverse=True)
    return ok_response({'conversations': rows})


def get_messages(conn, params):
    """История сообщений по клиенту (все каналы) или по конкретному каналу"""
    client_id = _parse_int(params.get('client_id'))
    if client_id is None:
        return error_response('Missing client_id', 400)
    channel = params.get('channel')

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        query = "SELECT * FROM bridge_messages WHERE client_id = %s"
        args = [client_id]
        if channel:
            query += " AND channel = %s"
            args.append(channel)
        query += " ORDER BY created_at ASC"
        cur.execute(query, args)
        messages = cur.fetchall()

    return ok_response({'messages': messages})


def mark_read(conn, body):
    """Отметить сообщения клиента как прочитанные"""
    client_id = body.get('client_id')
    if not client_id:
        return error_response('Missing client_id', 400)
    with conn.cursor() as cur:
        cur.execute("UPDATE bridge_messages SET is_read = TRUE WHERE client_id = %s AND direction = 'in'", (client_id,))
        cur.execute("UPDATE crm_clients SET unread_messages_count = 0 WHERE id = %s", (client_id,))
        conn.commit()
    return ok_response({'success': True})


# ------------------------------------------------------------------- email --

def _decode_mime_words(s):
    if not s:
        return ''
    parts = decode_header(s)
    decoded = ''
    for text, enc in parts:
        if isinstance(text, bytes):
            decoded += text.decode(enc or 'utf-8', errors='ignore')
        else:
            decoded += text
    return decoded


def _get_email_body(msg):
    """Извлекает текстовое тело письма (предпочитая text/plain)"""
    if msg.is_multipart():
        plain, html = '', ''
        for part in msg.walk():
            ctype = part.get_content_type()
            disp = str(part.get('Content-Disposition') or '')
            if 'attachment' in disp:
                continue
            try:
                payload = part.get_payload(decode=True)
                if not payload:
                    continue
                charset = part.get_content_charset() or 'utf-8'
                text = payload.decode(charset, errors='ignore')
            except Exception:
                continue
            if ctype == 'text/plain' and not plain:
                plain = text
            elif ctype == 'text/html' and not html:
                html = text
        if plain:
            return plain
        if html:
            return re.sub('<[^<]+?>', ' ', html)
        return ''
    else:
        try:
            payload = msg.get_payload(decode=True)
            charset = msg.get_content_charset() or 'utf-8'
            return payload.decode(charset, errors='ignore') if payload else ''
        except Exception:
            return ''


def sync_email(conn, body):
    """Синхронизирует входящую почту по IMAP: скачивает новые письма, привязывает к клиенту по email,
    сохраняет как непривязанные если отправитель неизвестен."""
    partner_id = body.get('partner_id')
    if not partner_id:
        return error_response('Missing partner_id', 400)

    address = os.environ.get('EMAIL_ADDRESS')
    password = os.environ.get('EMAIL_PASSWORD')
    if not address or not password:
        return error_response('EMAIL_ADDRESS / EMAIL_PASSWORD не настроены', 500)

    imported = 0
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT email_message_id FROM bridge_messages WHERE channel = 'email' AND email_message_id IS NOT NULL")
        known_ids = {r['email_message_id'] for r in cur.fetchall()}

        cur.execute("SELECT id, email FROM crm_clients WHERE partner_id = %s AND email IS NOT NULL AND email != ''", (partner_id,))
        clients_by_email = {r['email'].lower(): r['id'] for r in cur.fetchall() if r['email']}

    imap = imaplib.IMAP4_SSL(IMAP_HOST, IMAP_PORT)
    try:
        imap.login(address, password)
        imap.select('INBOX')
        status, data = imap.search(None, 'ALL')
        if status != 'OK':
            return error_response('Не удалось получить список писем', 502)

        ids = data[0].split()
        recent_ids = ids[-100:]  # последние 100 писем, чтобы не грузить всю историю каждый раз

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            for msg_id in recent_ids:
                status, msg_data = imap.fetch(msg_id, '(RFC822)')
                if status != 'OK' or not msg_data or not msg_data[0]:
                    continue
                raw = msg_data[0][1]
                msg = email_lib.message_from_bytes(raw)

                message_id = (msg.get('Message-ID') or '').strip()
                if message_id and message_id in known_ids:
                    continue

                from_name, from_addr = parseaddr(msg.get('From', ''))
                from_addr = (from_addr or '').lower()
                subject = _decode_mime_words(msg.get('Subject', ''))
                body_text = _get_email_body(msg)[:20000]
                to_addr = parseaddr(msg.get('To', ''))[1]

                client_id = clients_by_email.get(from_addr)

                cur.execute("""
                    INSERT INTO bridge_messages (
                        partner_id, client_id, channel, direction, sender_name,
                        subject, body, email_message_id, email_from, email_to
                    ) VALUES (%s, %s, 'email', 'in', %s, %s, %s, %s, %s, %s)
                """, (
                    partner_id, client_id, from_name or from_addr,
                    subject, body_text, message_id or None, from_addr, to_addr,
                ))

                if client_id:
                    cur.execute("""
                        UPDATE crm_clients
                        SET last_message_at = NOW(), unread_messages_count = unread_messages_count + 1
                        WHERE id = %s
                    """, (client_id,))

                imported += 1

            conn.commit()
    finally:
        try:
            imap.close()
        except Exception:
            pass
        imap.logout()

    return ok_response({'success': True, 'imported': imported})


def send_email(conn, body):
    """Отправляет письмо клиенту через SMTP и сохраняет в истории переписки"""
    client_id = body.get('client_id')
    partner_id = body.get('partner_id')
    subject = (body.get('subject') or '').strip()
    text = (body.get('body') or '').strip()
    to_override = (body.get('to') or '').strip()

    if not partner_id or not text:
        return error_response('partner_id and body are required', 400)

    address = os.environ.get('EMAIL_ADDRESS')
    password = os.environ.get('EMAIL_PASSWORD')
    if not address or not password:
        return error_response('EMAIL_ADDRESS / EMAIL_PASSWORD не настроены', 500)

    to_addr = to_override
    if not to_addr and client_id:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT email FROM crm_clients WHERE id = %s", (client_id,))
            row = cur.fetchone()
            to_addr = row['email'] if row else ''

    if not to_addr:
        return error_response('Не указан email получателя (у клиента нет email)', 400)

    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = subject or '(без темы)'
    msg['From'] = address
    msg['To'] = to_addr

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
        server.login(address, password)
        server.sendmail(address, [to_addr], msg.as_string())

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO bridge_messages (
                partner_id, client_id, channel, direction, sender_name,
                subject, body, email_from, email_to
            ) VALUES (%s, %s, 'email', 'out', 'Менеджер', %s, %s, %s, %s)
            RETURNING *
        """, (partner_id, client_id, subject, text, address, to_addr))
        message = cur.fetchone()
        if client_id:
            cur.execute("UPDATE crm_clients SET last_message_at = NOW() WHERE id = %s", (client_id,))
        conn.commit()

    return ok_response({'success': True, 'message': message})


# ---------------------------------------------------------------- telegram --

def send_telegram_raw(bot_token, chat_id, text):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = urllib.parse.urlencode({'chat_id': chat_id, 'text': text}).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))


def send_telegram(conn, body):
    """Отправляет сообщение клиенту в Telegram (клиент должен был хотя бы раз написать боту)"""
    client_id = body.get('client_id')
    partner_id = body.get('partner_id')
    text = (body.get('body') or body.get('text') or '').strip()

    if not client_id or not partner_id or not text:
        return error_response('client_id, partner_id and body are required', 400)

    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return error_response('TELEGRAM_BOT_TOKEN не настроен', 500)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT telegram_chat_id FROM crm_clients WHERE id = %s", (client_id,))
        row = cur.fetchone()

    if not row or not row.get('telegram_chat_id'):
        return error_response('У клиента нет привязанного Telegram-чата: клиент ещё не писал боту', 400)

    send_telegram_raw(bot_token, row['telegram_chat_id'], text)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            INSERT INTO bridge_messages (partner_id, client_id, channel, direction, sender_name, body, telegram_chat_id)
            VALUES (%s, %s, 'telegram', 'out', 'Менеджер', %s, %s)
            RETURNING *
        """, (partner_id, client_id, text, row['telegram_chat_id']))
        message = cur.fetchone()
        cur.execute("UPDATE crm_clients SET last_message_at = NOW() WHERE id = %s", (client_id,))
        conn.commit()

    return ok_response({'success': True, 'message': message})


def handle_telegram_webhook(conn, update):
    """Принимает апдейт от Telegram-бота: сохраняет входящее сообщение и привязывает к клиенту
    по chat_id или username (клиент должен быть предварительно создан в CRM с указанным telegram_username)."""
    message = update.get('message') or update.get('edited_message')
    if not message:
        return ok_response({'ok': True})

    chat = message.get('chat', {})
    chat_id = str(chat.get('id', ''))
    username = chat.get('username', '')
    text = message.get('text', '')
    sender_name = message.get('from', {}).get('first_name', 'Клиент')

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id, partner_id FROM crm_clients WHERE telegram_chat_id = %s", (chat_id,))
        client = cur.fetchone()

        if not client and username:
            cur.execute("SELECT id, partner_id FROM crm_clients WHERE telegram_username = %s", (username,))
            client = cur.fetchone()
            if client:
                cur.execute("UPDATE crm_clients SET telegram_chat_id = %s WHERE id = %s", (chat_id, client['id']))

        client_id = client['id'] if client else None
        partner_id = client['partner_id'] if client else None

        cur.execute("""
            INSERT INTO bridge_messages (partner_id, client_id, channel, direction, sender_name, body, telegram_chat_id, telegram_username)
            VALUES (%s, %s, 'telegram', 'in', %s, %s, %s, %s)
        """, (partner_id, client_id, sender_name, text, chat_id, username))

        if client_id:
            cur.execute("""
                UPDATE crm_clients SET last_message_at = NOW(), unread_messages_count = unread_messages_count + 1
                WHERE id = %s
            """, (client_id,))

        conn.commit()

    return ok_response({'ok': True, 'client_id': client_id})


def register_telegram_webhook(body):
    """Служебный метод: регистрирует URL этой функции как webhook в Telegram Bot API"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return error_response('TELEGRAM_BOT_TOKEN not configured', 500)

    target_url = body.get('function_url')
    if not target_url:
        return error_response('Provide function_url in body — the public URL of this function', 400)

    webhook_url = f"{target_url}?mode=telegram_webhook"
    api_url = f"https://api.telegram.org/bot{bot_token}/setWebhook"
    data = urllib.parse.urlencode({'url': webhook_url}).encode('utf-8')
    req = urllib.request.Request(api_url, data=data, method='POST')
    with urllib.request.urlopen(req, timeout=15) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    return ok_response({'success': True, 'telegram_response': result, 'webhook_url': webhook_url})


# ----------------------------------------------------------------- helpers --

def _parse_int(raw):
    if raw is None:
        return None
    try:
        return int(raw)
    except (ValueError, TypeError):
        return None


def cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def ok_response(data):
    return {'statusCode': 200, 'headers': cors(), 'body': json.dumps(data, default=str), 'isBase64Encoded': False}


def error_response(message, status):
    return {'statusCode': status, 'headers': cors(), 'body': json.dumps({'error': message}), 'isBase64Encoded': False}
