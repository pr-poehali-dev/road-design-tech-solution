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
    
    # Базовые данные клиента
    client_name = body_data.get('client_name', '')
    email = body_data.get('email', '')
    phone = body_data.get('phone', '')
    
    # Данные для ТЗ
    spec_data = body_data.get('spec_data', {})
    object_type = spec_data.get('objectType', '')
    address = spec_data.get('address', '')
    area = spec_data.get('area', '')
    floors = spec_data.get('floors', '')
    purpose = spec_data.get('purpose', '')
    soil_type = spec_data.get('soilType', '')
    seismicity = spec_data.get('seismicity', '')
    climate = spec_data.get('climate', '')
    requirements = spec_data.get('requirements', '')
    
    # Данные для КП
    proposal_data = body_data.get('proposal_data', {})
    project_name = proposal_data.get('projectName', '')
    sections = proposal_data.get('sections', [])
    timeline = proposal_data.get('timeline', '')
    
    # Для обратной совместимости
    project_description = body_data.get('project_description', '')
    
    if not (object_type or project_description):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Укажите тип объекта или описание проекта'}),
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
    
    # Формируем детальное описание объекта
    object_description = ''
    if object_type or address:
        object_description = f"""
**ДАННЫЕ ОБЪЕКТА:**
- Тип объекта: {object_type or 'Не указан'}
- Адрес строительства: {address or 'Не указан'}
- Общая площадь: {area + ' м²' if area else 'Не указана'}
- Этажность: {floors or 'Не указана'}
- Назначение: {purpose or 'Не указано'}
- Тип грунта: {soil_type or 'Не указан'}
- Сейсмичность: {seismicity + ' баллов' if seismicity else 'Не указана'}
- Климатический район: {climate or 'Не указан'}
- Особые требования: {requirements or 'Нет'}
"""
    elif project_description:
        object_description = f"Описание проекта: {project_description}"
    
    # Генерируем ТЗ и КП через YandexGPT
    prompt = f"""Ты - главный инженер проектного института DEAD SPACE. Клиент оставил заявку на проектирование.

**ДАННЫЕ ЗАКАЗЧИКА:**
Компания/ФИО: {client_name or 'Не указано'}
Email: {email or 'Не указан'}
Телефон: {phone or 'Не указан'}

{object_description}

**ПРАЙС-ЛИСТ УСЛУГ:**
{price_list_text}

**ТВОЯ ЗАДАЧА:**
1. Создать ТЕХНИЧЕСКОЕ ЗАДАНИЕ на проектирование объекта строительства согласно ГОСТ Р 21.1101-2013
2. Создать КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ с детальной сметой по разделам проектной документации

**ФОРМАТ ОТВЕТА (строго JSON):**
{{
  "technical_specification": "ТЗ в markdown с разделами:\n1. Общие сведения об объекте\n2. Исходные данные (площадь, этажность, назначение, адрес)\n3. Инженерно-геологические условия\n4. Требования к проектной документации\n5. Состав разделов проектной документации\n6. Требования к инженерным системам\n7. Требования по энергоэффективности и экологии\n8. Сроки проектирования",
  "proposal": "КП в markdown с разделами:\n## Коммерческое предложение\n### О компании DEAD SPACE\n### Объект проектирования\n### Состав проектной документации\n(Таблица: Раздел | Стоимость | Срок)\n### Общая стоимость\n### Этапы работ и оплата\n### Гарантии\n### Контакты",
  "total_price_min": число (минимальная стоимость в рублях),
  "total_price_max": число (максимальная стоимость в рублях),
  "sections": ["ПЗ", "ПЗУ", "АР", "КР", "..."] (массив разделов проектной документации)
}}

**ВАЖНЫЕ ТРЕБОВАНИЯ:**
- Используй только разделы и услуги из прайс-листа
- Указывай реалистичные сроки (ПЗ - 5 дней, АР - 15 дней, КР - 20 дней и т.д.)
- В ТЗ обязательно укажи нормативные документы (ГОСТ, СП, СанПиН)
- В КП детально распиши каждый раздел проектной документации
- Все цены в рублях
- ТЗ должно быть конкретным, с техническими параметрами
- КП должно быть профессиональным, с обоснованием цен"""

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