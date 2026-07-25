"""EVDEN 2.0: интеграция с тендерной площадкой BIDZAAR (мониторинг закупок и импорт в сделки)"""
import json
import os
import urllib.request
import urllib.error
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

BIDZAAR_INTEGRATOR_ID = '5bbede70-583c-4b80-9afa-d7622063f607'
BIDZAAR_BASE = f'https://phoenix.bidzaar.com/api/aggregator-integrator/{BIDZAAR_INTEGRATOR_ID}/procedures/purchases'


def handler(event, context):
    """Получает список тендеров с BIDZAAR, кэширует их и позволяет создать сделку на основе тендера"""
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
            return fetch_and_list(conn, event)
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            if body.get('resource') == 'import':
                return import_to_deal(conn, body)
        return error_response('Method not allowed', 405)
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        conn.close()


def fetch_and_list(conn, event):
    params = event.get('queryStringParameters') or {}
    page_size = params.get('pageSize', '20')
    from_date = params.get('fromDate') or (datetime.utcnow() - timedelta(days=7)).strftime('%Y-%m-%dT00:00:00')

    url = f"{BIDZAAR_BASE}?PageSize={page_size}&FromDate={from_date}"

    try:
        req = urllib.request.Request(url, headers={'Accept': 'application/json'})
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode('utf-8', errors='ignore')
        return error_response(
            f'BIDZAAR API вернул ошибку {exc.code}: доступ ограничен по IP или требуется другой формат авторизации. Ответ: {error_body[:300]}',
            502,
        )
    except Exception as exc:
        return error_response(f'Не удалось связаться с BIDZAAR: {exc}', 502)

    items = raw if isinstance(raw, list) else raw.get('items') or raw.get('data') or []

    cached = []
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        for item in items[:50]:
            purchase_id = str(item.get('id') or item.get('purchaseId') or item.get('number') or '')
            if not purchase_id:
                continue
            cur.execute("""
                INSERT INTO evden_bidzaar_cache (purchase_id, title, customer_name, region, price, law, raw_data, fetched_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (purchase_id) DO UPDATE SET
                    title = EXCLUDED.title,
                    customer_name = EXCLUDED.customer_name,
                    region = EXCLUDED.region,
                    price = EXCLUDED.price,
                    law = EXCLUDED.law,
                    raw_data = EXCLUDED.raw_data,
                    fetched_at = NOW()
                RETURNING *
            """, (
                purchase_id,
                item.get('title') or item.get('name') or item.get('subject', ''),
                item.get('customerName') or item.get('customer', ''),
                item.get('region', ''),
                item.get('price') or item.get('maxPrice') or 0,
                item.get('law') or item.get('federalLaw', ''),
                json.dumps(item),
            ))
            cached.append(cur.fetchone())
        conn.commit()

    return ok_response({'purchases': cached, 'total_from_api': len(items)})


def import_to_deal(conn, body):
    purchase_id = body.get('purchase_id')
    if not purchase_id:
        return error_response('purchase_id is required', 400)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM evden_bidzaar_cache WHERE purchase_id = %s", (purchase_id,))
        purchase = cur.fetchone()
        if not purchase:
            return error_response('Purchase not found in cache', 404)

        cur.execute("""
            INSERT INTO evden_deals (company_name, budget, phase, source, bidzaar_purchase_id, notes, object_address)
            VALUES (%s, %s, 'ether', 'bidzaar', %s, %s, %s)
            RETURNING *
        """, (
            purchase.get('customer_name') or purchase.get('title') or f'Тендер {purchase_id}',
            purchase.get('price') or 0,
            purchase_id,
            f"Импортировано из BIDZAAR: {purchase.get('title', '')}",
            purchase.get('region', ''),
        ))
        deal = cur.fetchone()

        cur.execute("""
            INSERT INTO evden_impulses (deal_id, title, priority, status, source)
            VALUES (%s, %s, 'high', 'open', 'bidzaar')
        """, (deal['id'], f"Изучить документацию тендера №{purchase_id} и принять решение об участии"))

        conn.commit()

    return ok_response({'success': True, 'deal': deal})


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