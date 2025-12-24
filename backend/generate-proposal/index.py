import json
import os
from typing import Dict, Any
import psycopg2
from openai import OpenAI

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Генерирует ТЗ и КП на основе описания проекта от клиента
    Args: event - dict с httpMethod, body (client_name, project_description, email, phone)
    Returns: HTTP response с ТЗ и КП
    '''
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
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
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
            'body': json.dumps({'error': 'Описание проекта обязательно'})
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
    
    # Генерируем ТЗ и КП через OpenRouter
    client = OpenAI(
        api_key=os.environ['OPENROUTER_API_KEY'],
        base_url='https://openrouter.ai/api/v1'
    )
    
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

    response = client.chat.completions.create(
        model='openai/gpt-4o-mini',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0.7,
        response_format={"type": "json_object"}
    )
    
    result = json.loads(response.choices[0].message.content)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, ensure_ascii=False)
    }