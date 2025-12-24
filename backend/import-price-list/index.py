import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Импортирует прайс-лист услуг в базу данных DEAD SPACE
    Args: event - HTTP event, context - runtime context
    Returns: HTTP response с результатом импорта
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
            'body': json.dumps({'error': 'Только POST метод поддерживается'}),
            'isBase64Encoded': False
        }
    
    # Прайс-лист
    price_list = [
        {"code": "ОП-ОКС.БЗУ", "alias": "op-oks-bzu", "name": "Благоустройство земельного участка (БЗУ под ключ)", "unit": "га", "volume_range": "до 1 га", "price_per_unit": 500000, "min_order_sum": 500000, "special_rules": "Округление площади: 1.1–1.4 как 1 га; 1.5–1.9 как 2 га"},
        {"code": "ОП-ППТ понижающие условия", "alias": "op-ppt-kef-0-15", "name": "ППТ, гос, понижающие условия", "unit": "га", "volume_range": None, "price_per_unit": 215000, "min_order_sum": None, "special_rules": "Коэффициент 0.15 для понижающих условий"},
        {"code": "ОП-ППТ госконтракт", "alias": "op-ppt-kef-0-3", "name": "ППТ, госконтракт", "unit": "га", "volume_range": None, "price_per_unit": 450000, "min_order_sum": None, "special_rules": "Коэффициент 0.3 для госконтрактов"},
        {"code": "ОП-ППТ коммерческий", "alias": "op-ppt-kef-1", "name": "ППТ, коммерческий контракт", "unit": "га", "volume_range": None, "price_per_unit": 1500000, "min_order_sum": None, "special_rules": "Коэффициент 1 для коммерческих контрактов"},
        {"code": "ОП-ПМТ понижающие условия", "alias": "op-pmt-kef-0-15", "name": "ПМТ, гос, понижающие условия", "unit": "га", "volume_range": None, "price_per_unit": 215000, "min_order_sum": None, "special_rules": "Коэффициент 0.15"},
        {"code": "ОП-ПМТ госконтракт", "alias": "op-pmt-kef-0-3", "name": "ПМТ, госконтракт", "unit": "га", "volume_range": None, "price_per_unit": 450000, "min_order_sum": None, "special_rules": "Коэффициент 0.3"},
        {"code": "ОП-ПМТ коммерческий", "alias": "op-pmt-kef-1", "name": "ПМТ, коммерческий контракт", "unit": "га", "volume_range": None, "price_per_unit": 1500000, "min_order_sum": None, "special_rules": "Коэффициент 1"},
        {"code": "ИИ-ИГДИ", "alias": "ii-igdi", "name": "Инженерно-геодезические изыскания", "unit": "га", "volume_range": None, "price_per_unit": 40000, "min_order_sum": None, "special_rules": None},
        {"code": "ИИ-ИЭИ", "alias": "ii-iei", "name": "Инженерно-экологические изыскания", "unit": "га", "volume_range": None, "price_per_unit": 65000, "min_order_sum": None, "special_rules": None},
        {"code": "ОП-ПГО до 100", "alias": "op-pgo-do-100", "name": "ПГО до 100 га", "unit": "га", "volume_range": "до 100 га", "price_per_unit": 24000, "min_order_sum": None, "special_rules": None},
        {"code": "ОП-ПГО 100-500", "alias": "op-pgo-100-500", "name": "ПГО 100–500 га", "unit": "га", "volume_range": "100–500 га", "price_per_unit": 23000, "min_order_sum": None, "special_rules": None},
        {"code": "ОП-ПГО 500-2000", "alias": "op-pgo-500-2000", "name": "ПГО 500–2000 га", "unit": "га", "volume_range": "500–2000 га", "price_per_unit": 22000, "min_order_sum": None, "special_rules": None},
        {"code": "ОП-ПГО 2000-5000", "alias": "op-pgo-2000-5000", "name": "ПГО 2000–5000 га", "unit": "га", "volume_range": "2000–5000 га", "price_per_unit": 21000, "min_order_sum": None, "special_rules": None},
        {"code": "ОП-ПГО более 5000", "alias": "op-pgo-bolee-5000", "name": "ПГО более 5000 га", "unit": "га", "volume_range": "более 5000 га", "price_per_unit": 20000, "min_order_sum": None, "special_rules": None},
        {"code": "СОПГЭ", "alias": "sopge", "name": "Сопровождение экспертизы (ГЭ/НГЭ)", "unit": "комплект", "volume_range": None, "price_per_unit": 200000, "min_order_sum": None, "special_rules": "Может считаться по разделам по отдельному запросу"}
    ]
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL не настроен'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    inserted = 0
    skipped = 0
    
    for item in price_list:
        try:
            cur.execute("""
                INSERT INTO ds_price_list 
                (code, alias, name, unit, volume_range, price_per_unit, min_order_sum, special_rules)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (code) DO NOTHING
            """, (
                item['code'],
                item['alias'],
                item['name'],
                item['unit'],
                item.get('volume_range'),
                item['price_per_unit'],
                item.get('min_order_sum'),
                item.get('special_rules')
            ))
            if cur.rowcount > 0:
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            conn.rollback()
            cur.close()
            conn.close()
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Ошибка при вставке: {str(e)}'}),
                'isBase64Encoded': False
            }
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'message': 'Прайс-лист успешно импортирован',
            'inserted': inserted,
            'skipped': skipped,
            'total': len(price_list)
        }),
        'isBase64Encoded': False
    }
