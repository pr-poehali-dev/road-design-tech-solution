import json
import os
from typing import Dict, Any
import psycopg2
import requests


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''Генерирует ТЗ и КП на основе описания проекта клиента через YandexGPT'''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    client_name = body_data.get('client_name', '')
    project_description = body_data.get('project_description', '')
    email = body_data.get('email', '')
    phone = body_data.get('phone', '')
    
    if not project_description:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Описание проекта обязательно'}),
            'isBase64Encoded': False
        }
    
    # Получаем прайс-лист из БД
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute('SELECT name, special_rules, price_per_unit, min_order_sum, unit FROM ds_price_list ORDER BY name')
    price_rows = cur.fetchall()
    cur.close()
    conn.close()
    
    price_list_text = "Прайс-лист услуг DEAD SPACE:\n\n"
    for row in price_rows:
        name, special_rules, price_per_unit, min_order_sum, unit = row
        price_list_text += f"• {name}: {price_per_unit:,} руб. за {unit}\n"
        if special_rules:
            price_list_text += f"  Примечание: {special_rules}\n"
        if min_order_sum:
            price_list_text += f"  Минимальная сумма заказа: {min_order_sum:,} руб.\n"
        price_list_text += "\n"
    
    # Генерируем ТЗ и КП через YandexGPT
    prompt = f"""Ты - менеджер студии DEAD SPACE. Клиент оставил заявку на проект.

Имя клиента: {client_name or 'Не указано'}
Email: {email or 'Не указан'}
Телефон: {phone or 'Не указан'}
Описание проекта: {project_description}

{price_list_text}

Твоя задача:
1. Создать детальное ТЕХНИЧЕСКОЕ ЗАДАНИЕ на основе описания клиента
2. Создать КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ с расчётом стоимости

ФОРМАТ ОТВЕТА (строго JSON):
{{
  "technical_specification": "Детальное ТЗ в формате markdown с разделами: Цель проекта, Функциональные требования, Дизайн, Технические требования",
  "proposal": "КП в формате markdown с разделами: О проекте, Этапы работ, Стоимость (таблица с услугами и ценами), Сроки",
  "total_price_min": число (минимальная стоимость в рублях),
  "total_price_max": число (максимальная стоимость в рублях)
}}

Важно:
- Используй только услуги из прайс-листа
- Указывай реалистичные цены на основе прайса
- ТЗ должно быть конкретным и детальным
- КП должно быть профессиональным и понятным
- Все цены в рублях"""

    headers = {
        'Authorization': f'Api-Key {os.environ["YANDEXGPT_API_KEY"]}',
        'Content-Type': 'application/json'
    }
    
    folder_id = os.environ['YANDEX_FOLDER_ID']
    payload = {
        'modelUri': f'gpt://{folder_id}/yandexgpt-lite',
        'completionOptions': {
            'stream': False,
            'temperature': 0.7,
            'maxTokens': 4000
        },
        'messages': [
            {'role': 'user', 'text': prompt}
        ]
    }
    
    response = requests.post(
        'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
        headers=headers,
        json=payload
    )
    
    response.raise_for_status()
    yandex_result = response.json()
    result_text = yandex_result['result']['alternatives'][0]['message']['text']
    
    # Парсим JSON из ответа (может быть обёрнут в markdown ```json)
    if '```json' in result_text:
        result_text = result_text.split('```json')[1].split('```')[0].strip()
    elif '```' in result_text:
        result_text = result_text.split('```')[1].split('```')[0].strip()
    
    result = json.loads(result_text)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, ensure_ascii=False),
        'isBase64Encoded': False
    }