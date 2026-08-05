"""Радужный мост: единая переписка с клиентами через Email (IMAP/SMTP, несколько ящиков),
Telegram и MAX. Поддерживает вложения, автосоздание лида по неизвестному отправителю,
разделение на входящие/отправленные и фильтр по почтовому ящику."""
import json
import os
import re
import ssl
import uuid
import base64
import smtplib
import imaplib
import email as email_lib
import urllib.request
import urllib.parse
from email.header import decode_header
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.utils import parseaddr

import boto3
import psycopg2
from psycopg2.extras import RealDictCursor


IMAP_HOST = 'imap.beget.com'
IMAP_PORT = 993
SMTP_HOST = 'smtp.beget.com'
SMTP_PORT = 465
MAX_ATTACH_SIZE = 25 * 1024 * 1024  # 25 МБ на файл
DEFAULT_MAILBOX_ADDRESS = 'info@sppi.ooo'


def handler(event, context):
    """Обрабатывает запросы модуля 'Радужный мост': список диалогов, сообщения, отправка писем/Telegram,
    синхронизация входящей почты по нескольким IMAP-ящикам, приём Telegram webhook, вложения."""
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
            if resource == 'email_list':
                return get_email_list(conn, params)
            if resource == 'mailboxes':
                return get_mailboxes()
            if resource == 'folders':
                return get_folders(conn, params)
            if resource == 'signatures':
                return get_signatures(conn, params)
            if resource == 'notifications':
                return get_notifications(conn, params)
            if resource == 'folder_messages':
                return get_folder_messages(conn, params)
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
            if resource == 'import_range':
                return import_range(conn, body)
            if resource == 'save_folder':
                return save_folder(conn, body)
            if resource == 'move_message':
                return move_message(conn, body)
            if resource == 'save_signature':
                return save_signature(conn, body)
            if resource == 'upload_signature_image':
                return upload_signature_image(body)
            if resource == 'delete_message':
                return delete_message(conn, body)
            if resource == 'delete_conversation':
                return delete_conversation(conn, body)
            if resource == 'delete_folder':
                return delete_folder(conn, body)
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
    mailbox = params.get('mailbox')  # опциональный фильтр по почтовому ящику

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
                c.auto_created,
                m.channel AS last_channel,
                m.body AS last_message,
                m.direction AS last_direction,
                m.mailbox AS last_mailbox,
                m.created_at AS last_message_created_at
            FROM crm_clients c
            JOIN bridge_messages m ON m.client_id = c.id
            WHERE c.partner_id = %s AND m.is_duplicate = FALSE
        """
        args = [partner_id]
        if channel:
            query += " AND m.channel = %s"
            args.append(channel)
        if mailbox:
            query += " AND m.mailbox = %s"
            args.append(mailbox)
        query += " ORDER BY c.id, m.created_at DESC"

        cur.execute(query, args)
        rows = cur.fetchall()

    rows.sort(key=lambda r: r['last_message_created_at'] or '', reverse=True)
    return ok_response({'conversations': rows})


def get_messages(conn, params):
    """История сообщений по клиенту (все каналы) или по конкретному каналу, вместе с вложениями"""
    client_id = _parse_int(params.get('client_id'))
    if client_id is None:
        return error_response('Missing client_id', 400)
    channel = params.get('channel')

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        query = """
            SELECT m.*, f.name AS folder_name, f.color AS folder_color
            FROM bridge_messages m
            LEFT JOIN bridge_folders f ON f.id = m.folder_id
            WHERE m.client_id = %s AND m.is_duplicate = FALSE
        """
        args = [client_id]
        if channel:
            query += " AND m.channel = %s"
            args.append(channel)
        query += " ORDER BY m.created_at DESC"
        cur.execute(query, args)
        messages = cur.fetchall()

        _attach_attachments(cur, messages)

    return ok_response({'messages': messages})


def get_email_list(conn, params):
    """Раздельный список писем: 'Входящие' (direction=in) или 'Отправленные' (direction=out),
    с фильтром по почтовому ящику."""
    partner_id = _parse_int(params.get('partner_id'))
    if partner_id is None:
        return error_response('Missing partner_id', 400)
    direction = params.get('direction', 'in')
    if direction not in ('in', 'out'):
        return error_response("direction must be 'in' or 'out'", 400)
    mailbox = params.get('mailbox')
    limit = _parse_int(params.get('limit')) or 100
    folder_id = params.get('folder_id')

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        query = """
            SELECT m.*, c.company_name, c.contact_person,
                   f.name AS folder_name, f.color AS folder_color
            FROM bridge_messages m
            LEFT JOIN crm_clients c ON c.id = m.client_id
            LEFT JOIN bridge_folders f ON f.id = m.folder_id
            WHERE m.partner_id = %s AND m.channel = 'email' AND m.direction = %s AND m.is_duplicate = FALSE
        """
        args = [partner_id, direction]
        if mailbox:
            query += " AND m.mailbox = %s"
            args.append(mailbox)
        if folder_id == 'none':
            query += " AND m.folder_id IS NULL"
        elif folder_id:
            query += " AND m.folder_id = %s"
            args.append(_parse_int(folder_id))
        query += " ORDER BY m.created_at DESC LIMIT %s"
        args.append(limit)

        cur.execute(query, args)
        messages = cur.fetchall()
        _attach_attachments(cur, messages)

    return ok_response({'messages': messages})


def get_mailboxes():
    """Список настроенных почтовых ящиков, доступных для отправки/фильтрации"""
    boxes = [{'address': b['address']} for b in _get_mailboxes()]
    return ok_response({'mailboxes': boxes})


def get_notifications(conn, params):
    """Новые входящие письма, о которых ещё не показывали уведомление.
    Возвращает отправителя и название папки, куда письмо попало по правилу сортировки."""
    partner_id = _parse_int(params.get('partner_id'))
    if partner_id is None:
        return error_response('Missing partner_id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT m.id, m.subject, m.sender_name, m.email_from, m.client_id,
                   f.name AS folder_name, f.color AS folder_color
            FROM bridge_messages m
            LEFT JOIN bridge_folders f ON f.id = m.folder_id
            WHERE m.partner_id = %s AND m.direction = 'in' AND m.notified = FALSE AND m.is_duplicate = FALSE
            ORDER BY m.created_at ASC LIMIT 20
        """, (partner_id,))
        rows = cur.fetchall()
        if rows:
            cur.execute("UPDATE bridge_messages SET notified = TRUE WHERE id = ANY(%s)", ([r['id'] for r in rows],))
            conn.commit()
    return ok_response({'notifications': rows})


def get_folder_messages(conn, params):
    """Все письма (входящие и исходящие) внутри конкретной папки, сгруппированные по диалогам,
    для просмотра содержимого папки в 'Радужном мосте'."""
    partner_id = _parse_int(params.get('partner_id'))
    folder_id = _parse_int(params.get('folder_id'))
    if partner_id is None or folder_id is None:
        return error_response('Missing partner_id or folder_id', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT m.*, c.company_name, c.contact_person
            FROM bridge_messages m
            LEFT JOIN crm_clients c ON c.id = m.client_id
            WHERE m.partner_id = %s AND m.folder_id = %s AND m.is_duplicate = FALSE
            ORDER BY m.created_at DESC
        """, (partner_id, folder_id))
        messages = cur.fetchall()
        _attach_attachments(cur, messages)

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


# ------------------------------------------------------------------ folders --

def get_folders(conn, params):
    """Список папок почты партнёра вместе с правилами автосортировки по адресам"""
    partner_id = _parse_int(params.get('partner_id'))
    if partner_id is None:
        return error_response('Missing partner_id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT f.*, COUNT(m.id) FILTER (WHERE m.is_duplicate = FALSE) AS messages_count
            FROM bridge_folders f
            LEFT JOIN bridge_messages m ON m.folder_id = f.id
            WHERE f.partner_id = %s
            GROUP BY f.id
            ORDER BY f.sort_order ASC, f.id ASC
        """, (partner_id,))
        folders = cur.fetchall()
        cur.execute("SELECT * FROM bridge_folder_rules WHERE partner_id = %s", (partner_id,))
        rules = cur.fetchall()
    rules_by_folder = {}
    for r in rules:
        rules_by_folder.setdefault(r['folder_id'], []).append(r['email_address'])
    for f in folders:
        f['rule_addresses'] = rules_by_folder.get(f['id'], [])
    return ok_response({'folders': folders})


def save_folder(conn, body):
    """Создаёт или переименовывает папку почты"""
    partner_id = body.get('partner_id')
    name = (body.get('name') or '').strip()
    if not partner_id or not name:
        return error_response('partner_id and name are required', 400)
    folder_id = body.get('id')
    color = body.get('color') or '#45A29E'
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if folder_id:
            cur.execute("""
                UPDATE bridge_folders SET name = %s, color = %s
                WHERE id = %s AND partner_id = %s RETURNING *
            """, (name, color, folder_id, partner_id))
        else:
            cur.execute("SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM bridge_folders WHERE partner_id = %s", (partner_id,))
            order = cur.fetchone()['n']
            cur.execute("""
                INSERT INTO bridge_folders (partner_id, name, color, sort_order)
                VALUES (%s, %s, %s, %s) RETURNING *
            """, (partner_id, name, color, order))
        folder = cur.fetchone()
        conn.commit()
    return ok_response({'success': True, 'folder': folder})


def move_message(conn, body):
    """Перемещает письмо в папку. Запоминает правило: последующие письма с этого адреса
    будут автоматически попадать в ту же папку."""
    partner_id = body.get('partner_id')
    message_id = body.get('message_id')
    folder_id = body.get('folder_id')  # None -> вынуть из папки
    apply_rule = body.get('apply_rule', True)
    if not partner_id or not message_id:
        return error_response('partner_id and message_id are required', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            UPDATE bridge_messages SET folder_id = %s
            WHERE id = %s AND partner_id = %s RETURNING *
        """, (folder_id, message_id, partner_id))
        msg = cur.fetchone()
        if not msg:
            return error_response('Письмо не найдено', 404)

        counterpart = (msg['email_from'] if msg['direction'] == 'in' else msg['email_to']) or ''
        counterpart = counterpart.strip().lower()

        if apply_rule and counterpart:
            if folder_id:
                cur.execute("""
                    INSERT INTO bridge_folder_rules (partner_id, folder_id, email_address)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (partner_id, email_address)
                    DO UPDATE SET folder_id = EXCLUDED.folder_id
                """, (partner_id, folder_id, counterpart))
                # существующие письма этого адресата тоже переносим в папку
                cur.execute("""
                    UPDATE bridge_messages SET folder_id = %s
                    WHERE partner_id = %s AND channel = 'email'
                      AND (LOWER(email_from) = %s OR LOWER(email_to) = %s)
                """, (folder_id, partner_id, counterpart, counterpart))
            else:
                cur.execute("""
                    DELETE FROM bridge_folder_rules WHERE partner_id = %s AND email_address = %s
                """, (partner_id, counterpart))
        conn.commit()
    return ok_response({'success': True})


def _folder_for_address(cur, partner_id, address):
    """Папка по правилу автосортировки для адреса отправителя (или None)"""
    if not address:
        return None
    cur.execute("""
        SELECT folder_id FROM bridge_folder_rules
        WHERE partner_id = %s AND email_address = %s
    """, (partner_id, address.strip().lower()))
    row = cur.fetchone()
    return row['folder_id'] if row else None


def delete_folder(conn, body):
    """Удаляет папку почты. Письма из неё не стираются, просто становятся 'без папки'."""
    partner_id = body.get('partner_id')
    folder_id = body.get('folder_id')
    if not partner_id or not folder_id:
        return error_response('partner_id and folder_id are required', 400)
    with conn.cursor() as cur:
        cur.execute("UPDATE bridge_messages SET folder_id = NULL WHERE folder_id = %s AND partner_id = %s", (folder_id, partner_id))
        cur.execute("DELETE FROM bridge_folder_rules WHERE folder_id = %s AND partner_id = %s", (folder_id, partner_id))
        cur.execute("DELETE FROM bridge_folders WHERE id = %s AND partner_id = %s", (folder_id, partner_id))
        conn.commit()
    return ok_response({'success': True})


def delete_message(conn, body):
    """Удаляет одно письмо/сообщение вместе с его вложениями"""
    partner_id = body.get('partner_id')
    message_id = body.get('message_id')
    if not partner_id or not message_id:
        return error_response('partner_id and message_id are required', 400)
    with conn.cursor() as cur:
        cur.execute("DELETE FROM bridge_attachments WHERE message_id = %s", (message_id,))
        cur.execute("DELETE FROM bridge_messages WHERE id = %s AND partner_id = %s", (message_id, partner_id))
        conn.commit()
    return ok_response({'success': True})


def delete_conversation(conn, body):
    """Удаляет всю переписку с клиентом (все сообщения и вложения по всем каналам)"""
    partner_id = body.get('partner_id')
    client_id = body.get('client_id')
    if not partner_id or not client_id:
        return error_response('partner_id and client_id are required', 400)
    with conn.cursor() as cur:
        cur.execute("""
            DELETE FROM bridge_attachments WHERE message_id IN (
                SELECT id FROM bridge_messages WHERE client_id = %s AND partner_id = %s
            )
        """, (client_id, partner_id))
        cur.execute("DELETE FROM bridge_messages WHERE client_id = %s AND partner_id = %s", (client_id, partner_id))
        conn.commit()
    return ok_response({'success': True})


# --------------------------------------------------------------- signatures --

def get_signatures(conn, params):
    """Список подписей партнёра для писем"""
    partner_id = _parse_int(params.get('partner_id'))
    if partner_id is None:
        return error_response('Missing partner_id', 400)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT * FROM bridge_signatures WHERE partner_id = %s
            ORDER BY is_default DESC, id ASC
        """, (partner_id,))
        signatures = cur.fetchall()
    return ok_response({'signatures': signatures})


def save_signature(conn, body):
    """Создаёт или обновляет подпись к письмам"""
    partner_id = body.get('partner_id')
    name = (body.get('name') or '').strip()
    html = body.get('html') or ''
    if not partner_id or not name:
        return error_response('partner_id and name are required', 400)
    sig_id = body.get('id')
    is_default = bool(body.get('is_default'))

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if is_default:
            cur.execute("UPDATE bridge_signatures SET is_default = FALSE WHERE partner_id = %s", (partner_id,))
        if sig_id:
            cur.execute("""
                UPDATE bridge_signatures SET name = %s, html = %s, is_default = %s, updated_at = NOW()
                WHERE id = %s AND partner_id = %s RETURNING *
            """, (name, html, is_default, sig_id, partner_id))
        else:
            cur.execute("""
                INSERT INTO bridge_signatures (partner_id, name, html, is_default)
                VALUES (%s, %s, %s, %s) RETURNING *
            """, (partner_id, name, html, is_default))
        signature = cur.fetchone()
        conn.commit()
    return ok_response({'success': True, 'signature': signature})


def upload_signature_image(body):
    """Загружает картинку для подписи в хранилище и возвращает публичную ссылку"""
    data_url = body.get('data') or ''
    name = body.get('name') or 'image.png'
    mime = body.get('mime') or 'image/png'
    raw_b64 = data_url.split(',', 1)[1] if ',' in data_url else data_url
    try:
        raw = base64.b64decode(raw_b64)
    except Exception:
        return error_response('Некорректный файл', 400)
    if len(raw) > 5 * 1024 * 1024:
        return error_response('Картинка больше 5 МБ', 400)
    url = _upload_bytes(raw, name, mime, prefix='signatures')
    return ok_response({'success': True, 'url': url})


def _attach_attachments(cur, messages):
    """Добавляет к каждому сообщению список вложений (attachments: [...])"""
    if not messages:
        return
    ids = [m['id'] for m in messages]
    cur.execute("SELECT * FROM bridge_attachments WHERE message_id = ANY(%s) ORDER BY id ASC", (ids,))
    atts_by_message = {}
    for a in cur.fetchall():
        atts_by_message.setdefault(a['message_id'], []).append(a)
    for m in messages:
        m['attachments'] = atts_by_message.get(m['id'], [])


# ------------------------------------------------------------------- email --

def _get_mailboxes():
    """Настроенные почтовые ящики (адрес + пароль), для которых заведены секреты"""
    boxes = []
    addr1 = os.environ.get('EMAIL_ADDRESS')
    pass1 = os.environ.get('EMAIL_PASSWORD')
    if addr1 and pass1:
        boxes.append({'address': addr1, 'password': pass1})

    pass2 = os.environ.get('INFO_EMAIL_PASSWORD')
    if pass2:
        boxes.append({'address': DEFAULT_MAILBOX_ADDRESS, 'password': pass2})

    return boxes


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


def _extract_email_attachments(msg):
    """Достаёт вложения письма: [(filename, mime, raw_bytes), ...]"""
    atts = []
    if not msg.is_multipart():
        return atts
    for part in msg.walk():
        disp = str(part.get('Content-Disposition') or '')
        filename = part.get_filename()
        if not filename:
            continue
        if 'attachment' not in disp and 'inline' not in disp:
            continue
        filename = _decode_mime_words(filename)
        try:
            payload = part.get_payload(decode=True)
        except Exception:
            continue
        if not payload:
            continue
        atts.append((filename, part.get_content_type(), payload))
    return atts


def _upload_bytes(raw, filename, mime, prefix='bridge'):
    ext = filename.rsplit('.', 1)[-1].lower()[:8] if '.' in filename else ''
    key = f"{prefix}/{uuid.uuid4().hex}{('.' + ext) if ext else ''}"
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=mime or 'application/octet-stream')
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def _save_attachment(cur, message_id, filename, mime, raw):
    if len(raw) > MAX_ATTACH_SIZE:
        return
    url = _upload_bytes(raw, filename, mime)
    cur.execute("""
        INSERT INTO bridge_attachments (message_id, file_name, mime, size_bytes, url)
        VALUES (%s, %s, %s, %s, %s)
    """, (message_id, filename, mime, len(raw), url))


def _get_default_stage_key(cur, partner_id):
    """Первая по порядку стадия воронки партнёра (та, что крайняя слева в канбане) —
    именно на неё должны попадать новые лиды, созданные автоматически по письму.
    Ключи стадий у каждого партнёра свои (настраиваются в CRM), поэтому 'new' захардкодить нельзя."""
    cur.execute("""
        SELECT stage_key FROM crm_stages WHERE partner_id = %s ORDER BY sort_order ASC LIMIT 1
    """, (partner_id,))
    row = cur.fetchone()
    return row['stage_key'] if row else 'new'


def _find_client_or_create(cur, partner_id, clients_by_email, counterpart_addr, counterpart_name, own_addresses, default_stage_key):
    """Находит клиента по email; если не найден и адрес не наш собственный — создаёт новый лид
    на первой стадии воронки партнёра."""
    if not counterpart_addr:
        return None
    client_id = clients_by_email.get(counterpart_addr)
    if client_id:
        return client_id
    if counterpart_addr in own_addresses:
        return None

    company_name = counterpart_name or counterpart_addr
    cur.execute("""
        INSERT INTO crm_clients (partner_id, company_name, contact_person, email, stage, auto_created)
        VALUES (%s, %s, %s, %s, %s, TRUE)
        RETURNING id
    """, (partner_id, company_name, counterpart_name or '', counterpart_addr, default_stage_key))
    new_id = cur.fetchone()['id']
    clients_by_email[counterpart_addr] = new_id
    return new_id


def sync_email(conn, body):
    """Синхронизирует входящую почту по всем настроенным IMAP-ящикам: скачивает новые письма,
    привязывает к клиенту по email, создаёт нового лида если отправитель неизвестен.
    Защищена advisory-блокировкой: если синхронизация для этого партнёра уже выполняется
    (например, запущена параллельно фоновым таймером и ручной кнопкой), повторный запуск
    просто пропускается — это устраняет дублирование писем из-за гонки запросов."""
    partner_id = body.get('partner_id')
    if not partner_id:
        return error_response('Missing partner_id', 400)

    with conn.cursor() as lock_cur:
        lock_cur.execute("SELECT pg_try_advisory_lock(918273645, %s)", (int(partner_id),))
        got_lock = lock_cur.fetchone()[0]
    if not got_lock:
        return ok_response({'success': True, 'imported': 0, 'linked': 0, 'created_leads': 0, 'skipped': 'sync already in progress'})

    try:
        boxes = _get_mailboxes()
        if not boxes:
            return error_response('Не настроен ни один почтовый ящик', 500)

        own_addresses = {b['address'].lower() for b in boxes}

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT email_message_id FROM bridge_messages
                WHERE channel = 'email' AND email_message_id IS NOT NULL AND is_duplicate = FALSE
            """)
            known_ids = {r['email_message_id'] for r in cur.fetchall()}

            cur.execute("SELECT id, email FROM crm_clients WHERE partner_id = %s AND email IS NOT NULL AND email != ''", (partner_id,))
            clients_by_email = {r['email'].lower(): r['id'] for r in cur.fetchall() if r['email']}

            default_stage_key = _get_default_stage_key(cur, partner_id)

        total_imported = 0
        total_created = 0
        errors = []

        for box in boxes:
            try:
                imported, created = _sync_mailbox(conn, partner_id, box['address'], box['password'], known_ids, clients_by_email, own_addresses, default_stage_key)
                total_imported += imported
                total_created += created
            except Exception as exc:
                errors.append(f"{box['address']}: {exc}")

        linked = _backfill_unlinked_emails(conn, partner_id)

        result = {'success': True, 'imported': total_imported, 'linked': linked, 'created_leads': total_created}
        if errors:
            result['errors'] = errors
        return ok_response(result)
    finally:
        with conn.cursor() as lock_cur:
            lock_cur.execute("SELECT pg_advisory_unlock(918273645, %s)", (int(partner_id),))


def _sync_mailbox(conn, partner_id, address, password, known_ids, clients_by_email, own_addresses, default_stage_key):
    """Синхронизирует последние 30 писем одного почтового ящика"""
    imported = 0
    created_leads = 0

    imap = imaplib.IMAP4_SSL(IMAP_HOST, IMAP_PORT, timeout=15)
    try:
        imap.login(address, password)
        imap.select('INBOX')
        status, data = imap.search(None, 'ALL')
        if status != 'OK':
            raise RuntimeError('Не удалось получить список писем')

        ids = data[0].split()
        recent_ids = ids[-30:]  # последние 30 писем за проход, чтобы уложиться в таймаут функции
        if not recent_ids:
            return 0, 0

        id_set = b','.join(recent_ids)
        status, msg_data = imap.fetch(id_set, '(RFC822)')
        if status != 'OK' or not msg_data:
            raise RuntimeError('Не удалось получить письма')

        raw_messages = [part[1] for part in msg_data if isinstance(part, tuple)]

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            for raw in raw_messages:
                msg = email_lib.message_from_bytes(raw)

                message_id = (msg.get('Message-ID') or '').strip()
                if message_id and message_id in known_ids:
                    continue

                from_name, from_addr = parseaddr(msg.get('From', ''))
                from_name = _decode_mime_words(from_name) or from_addr
                from_addr = (from_addr or '').lower()
                subject = _decode_mime_words(msg.get('Subject', ''))
                body_text = _get_email_body(msg)[:20000]
                to_addr = parseaddr(msg.get('To', ''))[1]

                in_reply_to = (msg.get('In-Reply-To') or '').strip() or None
                references = (msg.get('References') or '').strip() or None
                cc_raw = _decode_mime_words(msg.get('Cc', ''))
                cc_list = _split_addresses(cc_raw)
                to_all = _split_addresses(_decode_mime_words(msg.get('To', '')))

                client_id = _find_client_or_create(cur, partner_id, clients_by_email, from_addr, from_name, own_addresses, default_stage_key)
                if client_id and from_addr not in clients_by_email:
                    created_leads += 1

                folder_id = _folder_for_address(cur, partner_id, from_addr)

                cur.execute("""
                    INSERT INTO bridge_messages (
                        partner_id, client_id, channel, direction, sender_name,
                        subject, body, email_message_id, email_from, email_to, mailbox,
                        email_in_reply_to, email_references, email_cc, email_to_all, folder_id
                    ) VALUES (%s, %s, 'email', 'in', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (email_message_id) WHERE channel = 'email' AND email_message_id IS NOT NULL AND is_duplicate = FALSE
                    DO NOTHING
                    RETURNING id
                """, (
                    partner_id, client_id, from_name or from_addr,
                    subject, body_text, message_id or None, from_addr, to_addr, address,
                    in_reply_to, references,
                    ', '.join(cc_list) if cc_list else None,
                    ', '.join(to_all) if to_all else None,
                    folder_id,
                ))
                inserted_row = cur.fetchone()
                if not inserted_row:
                    # письмо уже было сохранено параллельным процессом — пропускаем
                    known_ids.add(message_id)
                    continue
                msg_id = inserted_row['id']

                for filename, mime, raw_bytes in _extract_email_attachments(msg):
                    _save_attachment(cur, msg_id, filename, mime, raw_bytes)

                if client_id:
                    cur.execute("""
                        UPDATE crm_clients
                        SET last_message_at = NOW(), unread_messages_count = unread_messages_count + 1
                        WHERE id = %s
                    """, (client_id,))

                known_ids.add(message_id)
                imported += 1

            conn.commit()
    finally:
        try:
            imap.close()
        except Exception:
            pass
        imap.logout()

    return imported, created_leads


def _backfill_unlinked_emails(conn, partner_id):
    """Привязывает ранее сохранённые письма без client_id к клиентам, если с тех пор
    в CRM появился клиент с совпадающим email (письмо могло прийти раньше, чем завели карточку)."""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id, email FROM crm_clients WHERE partner_id = %s AND email IS NOT NULL AND email != ''", (partner_id,))
        clients_by_email = {r['email'].lower(): r['id'] for r in cur.fetchall() if r['email']}
        if not clients_by_email:
            return 0

        cur.execute("""
            SELECT id, email_from FROM bridge_messages
            WHERE partner_id = %s AND channel = 'email' AND client_id IS NULL AND email_from IS NOT NULL
        """, (partner_id,))
        unlinked = cur.fetchall()

        linked_count = 0
        touched_clients = set()
        for row in unlinked:
            client_id = clients_by_email.get((row['email_from'] or '').lower())
            if not client_id:
                continue
            cur.execute("UPDATE bridge_messages SET client_id = %s WHERE id = %s", (client_id, row['id']))
            touched_clients.add(client_id)
            linked_count += 1

        for client_id in touched_clients:
            cur.execute("""
                UPDATE crm_clients SET
                    last_message_at = NOW(),
                    unread_messages_count = (
                        SELECT COUNT(*) FROM bridge_messages
                        WHERE client_id = %s AND direction = 'in' AND is_read = FALSE
                    )
                WHERE id = %s
            """, (client_id, client_id))

        conn.commit()

    return linked_count


def _split_addresses(value):
    """Разбирает строку или список адресов в чистый список email-ов"""
    if not value:
        return []
    items = value if isinstance(value, list) else re.split(r'[,;]\s*', str(value))
    result = []
    for item in items:
        addr = parseaddr(str(item).strip())[1].strip().lower()
        if addr and '@' in addr and addr not in result:
            result.append(addr)
    return result


def _fetch_url_bytes(url):
    """Скачивает файл по ссылке (для вложений из депозитария)"""
    req = urllib.request.Request(url, headers={'User-Agent': 'bridge/1.0'})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read()


def send_email(conn, body):
    """Отправляет письмо через SMTP: несколько получателей, копии, ответ в цепочке письма,
    подпись, вложения (в том числе из депозитария), опциональное создание нового лида."""
    client_id = body.get('client_id')
    partner_id = body.get('partner_id')
    subject = (body.get('subject') or '').strip()
    text = (body.get('body') or '').strip()
    mailbox_address = (body.get('mailbox') or '').strip()
    attachments_in = body.get('attachments') or []
    depo_files = body.get('depo_files') or []      # [{name, mime, url}]
    reply_to_message_id = body.get('reply_to_message_id')
    signature_id = body.get('signature_id')
    create_lead = bool(body.get('create_lead'))

    to_list = _split_addresses(body.get('to'))
    cc_list = _split_addresses(body.get('cc'))

    if not partner_id or not text:
        return error_response('partner_id and body are required', 400)

    boxes = _get_mailboxes()
    if not boxes:
        return error_response('Не настроен ни один почтовый ящик', 500)

    box = next((b for b in boxes if b['address'] == mailbox_address), None) or boxes[0]
    address, password = box['address'], box['password']
    own_addresses = {b['address'].lower() for b in boxes}

    in_reply_to = None
    references = None

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # ---- ответ в цепочке: подтягиваем заголовки исходного письма
        if reply_to_message_id:
            cur.execute("""
                SELECT subject, email_message_id, email_references, email_from
                FROM bridge_messages WHERE id = %s AND partner_id = %s
            """, (reply_to_message_id, partner_id))
            src = cur.fetchone()
            if src:
                in_reply_to = src['email_message_id']
                refs = (src['email_references'] or '').strip()
                references = f"{refs} {in_reply_to}".strip() if in_reply_to else refs or None
                if not subject and src['subject']:
                    base = src['subject']
                    subject = base if base.lower().startswith('re:') else f"Re: {base}"

        # ---- получатель по клиенту, если явно не задан
        if not to_list and client_id:
            cur.execute("SELECT email FROM crm_clients WHERE id = %s", (client_id,))
            row = cur.fetchone()
            if row and row['email']:
                to_list = [row['email'].strip().lower()]

        if not to_list:
            return error_response('Не указан email получателя', 400)

        # ---- подпись
        signature_html = ''
        if signature_id:
            cur.execute("SELECT html FROM bridge_signatures WHERE id = %s AND partner_id = %s", (signature_id, partner_id))
            sig = cur.fetchone()
            if sig:
                signature_html = sig['html'] or ''

        # ---- создание нового лида по новому адресату
        if create_lead and not client_id:
            primary = to_list[0]
            cur.execute("""
                SELECT id FROM crm_clients WHERE partner_id = %s AND LOWER(email) = %s LIMIT 1
            """, (partner_id, primary))
            existing = cur.fetchone()
            if existing:
                client_id = existing['id']
            else:
                stage_key = _get_default_stage_key(cur, partner_id)
                cur.execute("""
                    INSERT INTO crm_clients (partner_id, company_name, contact_person, email, stage, auto_created)
                    VALUES (%s, %s, %s, %s, %s, TRUE) RETURNING id
                """, (partner_id, primary, '', primary, stage_key))
                client_id = cur.fetchone()['id']
        elif not client_id:
            cur.execute("""
                SELECT id FROM crm_clients WHERE partner_id = %s AND LOWER(email) = %s LIMIT 1
            """, (partner_id, to_list[0]))
            existing = cur.fetchone()
            if existing:
                client_id = existing['id']

        conn.commit()

    # ---- сборка письма
    depo_attachments = []
    for f in depo_files:
        url = f.get('url')
        if not url:
            continue
        try:
            raw = _fetch_url_bytes(url)
        except Exception:
            continue
        if len(raw) > MAX_ATTACH_SIZE:
            continue
        depo_attachments.append((f.get('name') or 'file', f.get('mime') or 'application/octet-stream', raw))

    decoded_attachments = []
    for att in attachments_in:
        name = att.get('name') or 'file'
        data_url = att.get('data') or ''
        mime = att.get('mime') or 'application/octet-stream'
        raw_b64 = data_url.split(',', 1)[1] if ',' in data_url else data_url
        try:
            raw = base64.b64decode(raw_b64)
        except Exception:
            continue
        if len(raw) > MAX_ATTACH_SIZE:
            return error_response(f'Файл "{name}" превышает 25 МБ', 400)
        decoded_attachments.append((name, mime, raw))

    all_attachments = decoded_attachments + depo_attachments

    body_html = text.replace('\n', '<br>')
    if signature_html:
        body_html = f"{body_html}<br><br>{signature_html}"
        plain_text = text
    else:
        plain_text = text

    msg = MIMEMultipart('mixed')
    alt = MIMEMultipart('alternative')
    alt.attach(MIMEText(plain_text, 'plain', 'utf-8'))
    alt.attach(MIMEText(f"<div>{body_html}</div>", 'html', 'utf-8'))
    msg.attach(alt)

    new_message_id = f"<{uuid.uuid4().hex}@{address.split('@')[-1]}>"
    msg['Message-ID'] = new_message_id
    msg['Subject'] = subject or '(без темы)'
    msg['From'] = address
    msg['To'] = ', '.join(to_list)
    if cc_list:
        msg['Cc'] = ', '.join(cc_list)
    if in_reply_to:
        msg['In-Reply-To'] = in_reply_to
    if references:
        msg['References'] = references

    for name, mime, raw in all_attachments:
        part = MIMEApplication(raw, Name=name)
        part['Content-Disposition'] = f'attachment; filename="{name}"'
        msg.attach(part)

    recipients = to_list + cc_list

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
        server.login(address, password)
        server.sendmail(address, recipients, msg.as_string())

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        folder_id = _folder_for_address(cur, partner_id, to_list[0])
        cur.execute("""
            INSERT INTO bridge_messages (
                partner_id, client_id, channel, direction, sender_name,
                subject, body, email_from, email_to, mailbox,
                email_message_id, email_in_reply_to, email_references,
                email_cc, email_to_all, folder_id, is_read, notified
            ) VALUES (%s, %s, 'email', 'out', 'Менеджер', %s, %s, %s, %s, %s,
                      %s, %s, %s, %s, %s, %s, TRUE, TRUE)
            RETURNING *
        """, (
            partner_id, client_id, subject, text, address, to_list[0], address,
            new_message_id, in_reply_to, references,
            ', '.join(cc_list) if cc_list else None,
            ', '.join(to_list), folder_id,
        ))
        message = cur.fetchone()

        for name, mime, raw in all_attachments:
            _save_attachment(cur, message['id'], name, mime, raw)

        if client_id:
            cur.execute("UPDATE crm_clients SET last_message_at = NOW() WHERE id = %s", (client_id,))
        conn.commit()

        cur.execute("SELECT * FROM bridge_attachments WHERE message_id = %s", (message['id'],))
        message['attachments'] = cur.fetchall()

    return ok_response({'success': True, 'message': message, 'client_id': client_id})


# ------------------------------------------------------------- import_range --

def _imap_date(date_str):
    """'YYYY-MM-DD' -> '01-Jul-2026' (формат для IMAP SEARCH)"""
    from datetime import datetime
    d = datetime.strptime(date_str, '%Y-%m-%d')
    return d.strftime('%d-%b-%Y')


def _imap_date_plus_one(date_str):
    from datetime import datetime, timedelta
    d = datetime.strptime(date_str, '%Y-%m-%d') + timedelta(days=1)
    return d.strftime('%d-%b-%Y')


def _find_folder(imap, keywords):
    """Ищет имя папки на IMAP-сервере, содержащее одно из ключевых слов (например 'sent')"""
    typ, data = imap.list()
    if typ != 'OK':
        return None
    for line in data:
        if not line:
            continue
        text = line.decode(errors='ignore') if isinstance(line, bytes) else str(line)
        m = re.search(r'"([^"]+)"\s*$', text)
        name = m.group(1) if m else text.split()[-1].strip('"')
        low = name.lower()
        for kw in keywords:
            if kw in low:
                return name
    return None


def import_range(conn, body):
    """Служебный метод: загружает исторические письма (входящие или отправленные) за указанный
    период из конкретного почтового ящика — постранично (offset/limit), чтобы не упереться
    в таймаут функции. Вызывается несколько раз подряд, пока has_more == True."""
    partner_id = body.get('partner_id')
    mailbox_address = (body.get('mailbox') or '').strip()
    date_from = body.get('date_from')  # 'YYYY-MM-DD'
    date_to = body.get('date_to')      # 'YYYY-MM-DD' включительно
    folder = body.get('folder', 'INBOX')  # 'INBOX' | 'SENT' (логическое имя, реальное определяется автоматически)
    offset = int(body.get('offset', 0))
    limit = min(int(body.get('limit', 10)), 20)

    if not partner_id or not mailbox_address or not date_from or not date_to:
        return error_response('partner_id, mailbox, date_from, date_to are required', 400)
    if folder not in ('INBOX', 'SENT'):
        return error_response("folder must be 'INBOX' or 'SENT'", 400)

    boxes = _get_mailboxes()
    box = next((b for b in boxes if b['address'] == mailbox_address), None)
    if not box:
        return error_response('Указанный почтовый ящик не настроен', 400)
    own_addresses = {b['address'].lower() for b in boxes}

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT email_message_id FROM bridge_messages
            WHERE channel = 'email' AND email_message_id IS NOT NULL AND is_duplicate = FALSE
        """)
        known_ids = {r['email_message_id'] for r in cur.fetchall()}
        cur.execute("SELECT id, email FROM crm_clients WHERE partner_id = %s AND email IS NOT NULL AND email != ''", (partner_id,))
        clients_by_email = {r['email'].lower(): r['id'] for r in cur.fetchall() if r['email']}
        default_stage_key = _get_default_stage_key(cur, partner_id)

    imap = imaplib.IMAP4_SSL(IMAP_HOST, IMAP_PORT, timeout=20)
    try:
        imap.login(box['address'], box['password'])

        real_folder = 'INBOX' if folder == 'INBOX' else (_find_folder(imap, ['sent', 'отправ']) or 'Sent')
        status, _ = imap.select(f'"{real_folder}"', readonly=True)
        if status != 'OK':
            return error_response(f'Папка "{real_folder}" недоступна', 502)

        since = _imap_date(date_from)
        before = _imap_date_plus_one(date_to)
        status, data = imap.search(None, f'(SINCE "{since}" BEFORE "{before}")')
        if status != 'OK':
            return error_response('Ошибка поиска писем', 502)

        ids = data[0].split()
        total = len(ids)
        page_ids = ids[offset:offset + limit]

        imported = 0
        if page_ids:
            id_set = b','.join(page_ids)
            status, msg_data = imap.fetch(id_set, '(RFC822)')
            if status == 'OK' and msg_data:
                raw_messages = [part[1] for part in msg_data if isinstance(part, tuple)]
                direction = 'in' if folder == 'INBOX' else 'out'

                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    for raw in raw_messages:
                        msg = email_lib.message_from_bytes(raw)
                        message_id = (msg.get('Message-ID') or '').strip()
                        if message_id and message_id in known_ids:
                            continue

                        subject = _decode_mime_words(msg.get('Subject', ''))
                        body_text = _get_email_body(msg)[:20000]

                        if direction == 'in':
                            from_name, from_addr = parseaddr(msg.get('From', ''))
                            from_name = _decode_mime_words(from_name) or from_addr
                            from_addr = (from_addr or '').lower()
                            to_addr = parseaddr(msg.get('To', ''))[1]
                            counterpart_addr, counterpart_name = from_addr, from_name
                            sender_name = from_name or from_addr
                        else:
                            _, to_addr_raw = parseaddr(msg.get('To', ''))
                            to_addr = (to_addr_raw or '').lower()
                            from_addr = mailbox_address
                            counterpart_addr, counterpart_name = to_addr, None
                            sender_name = 'Менеджер'

                        client_id = _find_client_or_create(cur, partner_id, clients_by_email, counterpart_addr, counterpart_name, own_addresses, default_stage_key)

                        cur.execute("""
                            INSERT INTO bridge_messages (
                                partner_id, client_id, channel, direction, sender_name,
                                subject, body, email_message_id, email_from, email_to, mailbox
                            ) VALUES (%s, %s, 'email', %s, %s, %s, %s, %s, %s, %s, %s)
                            ON CONFLICT (email_message_id) WHERE channel = 'email' AND email_message_id IS NOT NULL AND is_duplicate = FALSE
                            DO NOTHING
                            RETURNING id
                        """, (
                            partner_id, client_id, direction, sender_name,
                            subject, body_text, message_id or None, from_addr, to_addr, mailbox_address,
                        ))
                        inserted_row = cur.fetchone()
                        if not inserted_row:
                            if message_id:
                                known_ids.add(message_id)
                            continue
                        msg_id = inserted_row['id']

                        for filename, mime, raw_bytes in _extract_email_attachments(msg):
                            _save_attachment(cur, msg_id, filename, mime, raw_bytes)

                        if client_id and direction == 'in':
                            cur.execute("""
                                UPDATE crm_clients
                                SET last_message_at = NOW(), unread_messages_count = unread_messages_count + 1
                                WHERE id = %s
                            """, (client_id,))
                        elif client_id:
                            cur.execute("UPDATE crm_clients SET last_message_at = NOW() WHERE id = %s", (client_id,))

                        if message_id:
                            known_ids.add(message_id)
                        imported += 1

                    conn.commit()
    finally:
        try:
            imap.logout()
        except Exception:
            pass

    next_offset = offset + limit
    has_more = next_offset < total

    result = {
        'success': True,
        'folder': folder,
        'imported': imported,
        'total': total,
        'offset': offset,
        'next_offset': next_offset,
        'has_more': has_more,
    }
    if not has_more:
        result['linked'] = _backfill_unlinked_emails(conn, partner_id)

    return ok_response(result)


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
        message['attachments'] = []
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