"""
Хранилище КП и дорожных карт: сохранение, получение, список, отправка в производство.
"""
import json
import os
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    action = body.get('action') or event.get('queryStringParameters', {}).get('action', 'list_kp')

    conn = get_conn()
    cur = conn.cursor()

    try:
        # --- Сохранить КП ---
        if action == 'save_kp':
            kp_data = body['kp_data']
            cur.execute(
                """INSERT INTO saved_kp (title, client, total_sum, kp_data, files_text, extra_prompt)
                   VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, created_at""",
                (
                    kp_data.get('title', 'Без названия'),
                    kp_data.get('client', ''),
                    int(kp_data.get('total_sum', 0)),
                    json.dumps(kp_data, ensure_ascii=False),
                    body.get('files_text', ''),
                    body.get('extra_prompt', ''),
                )
            )
            row = cur.fetchone()
            conn.commit()
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'id': str(row[0]), 'created_at': str(row[1])}, ensure_ascii=False),
            }

        # --- Сохранить дорожную карту ---
        elif action == 'save_roadmap':
            roadmap_data = body['roadmap_data']
            cur.execute(
                """INSERT INTO saved_roadmaps (kp_id, project_name, total_duration, roadmap_data)
                   VALUES (%s, %s, %s, %s) RETURNING id, created_at""",
                (
                    body.get('kp_id') or None,
                    roadmap_data.get('project_name', 'Без названия'),
                    roadmap_data.get('total_duration', ''),
                    json.dumps(roadmap_data, ensure_ascii=False),
                )
            )
            row = cur.fetchone()
            conn.commit()
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'id': str(row[0]), 'created_at': str(row[1])}, ensure_ascii=False),
            }

        # --- Список всех КП ---
        elif action == 'list_kp':
            cur.execute(
                """SELECT k.id, k.title, k.client, k.total_sum, k.status, k.sent_to_production, k.created_at,
                          r.id as roadmap_id, r.project_name as roadmap_name, r.total_duration
                   FROM saved_kp k
                   LEFT JOIN saved_roadmaps r ON r.kp_id = k.id
                   ORDER BY k.created_at DESC
                   LIMIT 100"""
            )
            rows = cur.fetchall()
            result = []
            seen = set()
            for r in rows:
                kp_id = str(r[0])
                if kp_id in seen:
                    continue
                seen.add(kp_id)
                result.append({
                    'id': kp_id,
                    'title': r[1],
                    'client': r[2],
                    'total_sum': r[3],
                    'status': r[4],
                    'sent_to_production': r[5],
                    'created_at': str(r[6]),
                    'roadmap_id': str(r[7]) if r[7] else None,
                    'roadmap_name': r[8],
                    'roadmap_duration': r[9],
                })
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'kp_list': result}, ensure_ascii=False),
            }

        # --- Получить КП по ID ---
        elif action == 'get_kp':
            kp_id = body.get('kp_id') or event.get('queryStringParameters', {}).get('kp_id')
            cur.execute("SELECT kp_data, files_text, extra_prompt FROM saved_kp WHERE id = %s", (kp_id,))
            row = cur.fetchone()
            if not row:
                return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'КП не найдено'})}

            roadmap = None
            cur.execute("SELECT roadmap_data FROM saved_roadmaps WHERE kp_id = %s ORDER BY created_at DESC LIMIT 1", (kp_id,))
            rm = cur.fetchone()
            if rm:
                roadmap = json.loads(rm[0]) if isinstance(rm[0], str) else rm[0]

            kp_data = json.loads(row[0]) if isinstance(row[0], str) else row[0]
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({
                    'kp_data': kp_data,
                    'roadmap_data': roadmap,
                    'files_text': row[1],
                    'extra_prompt': row[2],
                }, ensure_ascii=False),
            }

        # --- Отправить в производство ---
        elif action == 'send_to_production':
            kp_id = body['kp_id']
            cur.execute("UPDATE saved_kp SET sent_to_production = TRUE, status = 'in_production' WHERE id = %s", (kp_id,))
            conn.commit()
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'success': True}, ensure_ascii=False),
            }

        else:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': f'Неизвестное действие: {action}'})}

    finally:
        cur.close()
        conn.close()
