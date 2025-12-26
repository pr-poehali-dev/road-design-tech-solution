import json

def handler(event: dict, context) -> dict:
    """
    Расчёт сметы на строительство промышленного склада по прайс-листу DEAD SPACE.
    Принимает параметры склада, возвращает детализированную смету с позициями.
    """
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    try:
        body = json.loads(event.get('body', '{}'))
        params = body.get('params', {})
        volume = body.get('volume', 0)
        
        length = params.get('length', 48)
        width = params.get('width', 24)
        height = params.get('height', 8)
        area = length * width
        
        items = []
        total = 0
        
        if volume <= 100:
            price_per_m3 = 500
        elif volume <= 500:
            price_per_m3 = 400
        elif volume <= 5000:
            price_per_m3 = 200
        else:
            price_per_m3 = 150
        
        warehouse_cost = volume * price_per_m3
        items.append({
            'code': 'ОП-ОКС.НС.СПиПП',
            'name': 'Проектирование склада (ПД+РД+ИИ+согласования)',
            'unit': 'м³',
            'quantity': volume,
            'price_per_unit': price_per_m3,
            'sum': warehouse_cost
        })
        total += warehouse_cost
        
        igdi_cost = area * 40000 / 10000
        items.append({
            'code': 'ИИ-ИГДИ',
            'name': 'Инженерно-геодезические изыскания',
            'unit': 'га',
            'quantity': round(area / 10000, 2),
            'price_per_unit': 40000,
            'sum': igdi_cost
        })
        total += igdi_cost
        
        iei_cost = area * 65000 / 10000
        items.append({
            'code': 'ИИ-ИЭИ',
            'name': 'Инженерно-экологические изыскания',
            'unit': 'га',
            'quantity': round(area / 10000, 2),
            'price_per_unit': 65000,
            'sum': iei_cost
        })
        total += iei_cost
        
        obm_cost = volume * 500
        items.append({
            'code': 'ИИ-ОБМ',
            'name': 'Обмерные работы',
            'unit': 'м³',
            'quantity': volume,
            'price_per_unit': 500,
            'sum': obm_cost
        })
        total += obm_cost
        
        gates_count = params.get('gatesCount', 2)
        windows_count = params.get('windowsCount', 4)
        
        expertise_cost = 200000
        items.append({
            'code': 'СОПГЭ',
            'name': 'Сопровождение экспертизы (ГЭ/НГЭ)',
            'unit': 'комплект',
            'quantity': 1,
            'price_per_unit': 200000,
            'sum': expertise_cost
        })
        total += expertise_cost
        
        construction_estimate = calculate_construction_cost(params, volume, area)
        items.append({
            'code': 'СТРОИТЕЛЬСТВО',
            'name': 'Ориентировочная стоимость строительства',
            'unit': 'комплект',
            'quantity': 1,
            'price_per_unit': construction_estimate,
            'sum': construction_estimate
        })
        total += construction_estimate
        
        result = {
            'items': items,
            'subtotal': total,
            'vat': total * 0.2,
            'total': total * 1.2,
            'volume': volume,
            'area': area,
            'params': params
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }


def calculate_construction_cost(params: dict, volume: float, area: float) -> float:
    """
    Расчёт ориентировочной стоимости строительства склада.
    Учитывает материалы, конструкции, ворота, окна.
    """
    construction_type = params.get('constructionType', 'steel')
    wall_material = params.get('wallMaterial', 'sandwich')
    gates_count = params.get('gatesCount', 2)
    windows_count = params.get('windowsCount', 4)
    
    base_cost_per_m3 = 8000
    
    if construction_type == 'steel':
        type_multiplier = 1.0
    elif construction_type == 'concrete':
        type_multiplier = 1.3
    else:
        type_multiplier = 0.7
    
    if wall_material == 'sandwich':
        wall_multiplier = 1.0
    elif wall_material == 'proflist':
        wall_multiplier = 0.7
    else:
        wall_multiplier = 1.5
    
    base = volume * base_cost_per_m3 * type_multiplier * wall_multiplier
    
    gates_cost = gates_count * 350000
    windows_cost = windows_count * 25000
    
    total = base + gates_cost + windows_cost
    
    return round(total, 2)
