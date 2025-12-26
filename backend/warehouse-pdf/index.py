import json
from datetime import datetime

def handler(event: dict, context) -> dict:
    """
    Генерация PDF технического отчёта по результатам проектирования склада.
    Формирует HTML-отчёт с параметрами, сметой, ГОСТами и рендерами.
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
        estimate = body.get('estimate', {})
        
        html_content = generate_html_report(params, estimate)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Content-Disposition': f'attachment; filename="warehouse_report_{datetime.now().strftime("%Y%m%d")}.html"'
            },
            'body': html_content,
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }


def generate_html_report(params: dict, estimate: dict) -> str:
    """
    Генерирует HTML-отчёт с полной информацией о проекте склада.
    """
    
    construction_type_names = {
        'steel': 'Стальной каркас',
        'concrete': 'Железобетонный каркас',
        'frameless': 'Бескаркасный ангар'
    }
    
    roof_type_names = {
        'single': 'Односкатная',
        'double': 'Двускатная',
        'arch': 'Арочная'
    }
    
    wall_material_names = {
        'sandwich': 'Сэндвич-панели',
        'proflist': 'Профлист',
        'concrete': 'Бетонные плиты'
    }
    
    gates_type_names = {
        'swing': 'Распашные',
        'sliding': 'Откатные',
        'sectional': 'Секционные',
        'dock': 'Док-уровень'
    }
    
    items_html = ''
    for item in estimate.get('items', []):
        items_html += f'''
        <tr>
            <td>{item['code']}</td>
            <td>{item['name']}</td>
            <td>{item['unit']}</td>
            <td>{item['quantity']}</td>
            <td>{item['price_per_unit']:,.2f} ₽</td>
            <td>{item['sum']:,.2f} ₽</td>
        </tr>
        '''
    
    html = f'''
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>Технический отчёт - Проектирование склада</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 40px;
                color: #333;
                line-height: 1.6;
            }}
            .header {{
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 3px solid #2196f3;
            }}
            .header h1 {{
                color: #1976d2;
                margin: 0;
            }}
            .header p {{
                color: #666;
                margin: 5px 0;
            }}
            .section {{
                margin-bottom: 30px;
            }}
            .section h2 {{
                color: #1976d2;
                border-bottom: 2px solid #64b5f6;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }}
            th {{
                background-color: #2196f3;
                color: white;
            }}
            tr:nth-child(even) {{
                background-color: #f5f5f5;
            }}
            .total-row {{
                background-color: #e3f2fd !important;
                font-weight: bold;
                font-size: 1.1em;
            }}
            .params-grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }}
            .param-item {{
                padding: 10px;
                background-color: #f9f9f9;
                border-left: 4px solid #2196f3;
            }}
            .param-label {{
                color: #666;
                font-size: 0.9em;
            }}
            .param-value {{
                font-weight: bold;
                font-size: 1.1em;
                color: #333;
            }}
            .gost-list {{
                list-style-type: none;
                padding: 0;
            }}
            .gost-list li {{
                padding: 8px;
                margin: 5px 0;
                background-color: #f0f0f0;
                border-left: 3px solid #4caf50;
            }}
            .warning {{
                background-color: #fff3cd;
                border: 1px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
            }}
            .footer {{
                margin-top: 50px;
                padding-top: 20px;
                border-top: 2px solid #ddd;
                text-align: center;
                color: #666;
                font-size: 0.9em;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>ТЕХНИЧЕСКИЙ ОТЧЁТ</h1>
            <p>ПО РЕЗУЛЬТАТАМ ИНЖЕНЕРНО-ПРОЕКТНЫХ ИЗЫСКАНИЙ</p>
            <p>ДЛЯ ПОДГОТОВКИ ПРОЕКТНОЙ ДОКУМЕНТАЦИИ</p>
            <p>Промышленное здание - Склад</p>
            <p>Дата: {datetime.now().strftime("%d.%m.%Y")}</p>
        </div>

        <div class="section">
            <h2>1. Основные параметры здания</h2>
            <div class="params-grid">
                <div class="param-item">
                    <div class="param-label">Длина здания</div>
                    <div class="param-value">{params.get('length', 0)} м</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Ширина здания</div>
                    <div class="param-value">{params.get('width', 0)} м</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Высота до нижнего пояса</div>
                    <div class="param-value">{params.get('height', 0)} м</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Объём здания</div>
                    <div class="param-value">{estimate.get('volume', 0):,.2f} м³</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Площадь застройки</div>
                    <div class="param-value">{estimate.get('area', 0):,.2f} м²</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Тип конструкции</div>
                    <div class="param-value">{construction_type_names.get(params.get('constructionType', 'steel'))}</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Тип кровли</div>
                    <div class="param-value">{roof_type_names.get(params.get('roofType', 'double'))}</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Угол наклона кровли</div>
                    <div class="param-value">{params.get('roofAngle', 0)}°</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Шаг колонн</div>
                    <div class="param-value">{params.get('columnStep', 6)} м</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Материал стен</div>
                    <div class="param-value">{wall_material_names.get(params.get('wallMaterial', 'sandwich'))}</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Толщина стен</div>
                    <div class="param-value">{params.get('wallThickness', 150)} мм</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Количество ворот</div>
                    <div class="param-value">{params.get('gatesCount', 2)} шт ({gates_type_names.get(params.get('gatesType', 'sectional'))})</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Количество окон</div>
                    <div class="param-value">{params.get('windowsCount', 4)} шт</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Регион строительства</div>
                    <div class="param-value">{params.get('region', 'Московская область')}</div>
                </div>
                <div class="param-item">
                    <div class="param-label">Назначение</div>
                    <div class="param-value">{params.get('purpose', 'Хранение общих грузов')}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>2. Детализированная смета</h2>
            <table>
                <thead>
                    <tr>
                        <th>Код</th>
                        <th>Наименование работ</th>
                        <th>Ед. изм.</th>
                        <th>Объём</th>
                        <th>Цена за ед.</th>
                        <th>Стоимость</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                    <tr class="total-row">
                        <td colspan="5">ИТОГО без НДС:</td>
                        <td>{estimate.get('subtotal', 0):,.2f} ₽</td>
                    </tr>
                    <tr>
                        <td colspan="5">НДС 20%:</td>
                        <td>{estimate.get('vat', 0):,.2f} ₽</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="5">ИТОГО с НДС:</td>
                        <td>{estimate.get('total', 0):,.2f} ₽</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>3. Нормативная база проектирования</h2>
            <ul class="gost-list">
                <li><strong>ГОСТ 27751-2014</strong> - Надежность строительных конструкций и оснований</li>
                <li><strong>СП 20.13330.2016</strong> - Нагрузки и воздействия</li>
                <li><strong>ГОСТ 23118-2012</strong> - Конструкции стальные строительные. Общие технические условия</li>
                <li><strong>СП 16.13330.2017</strong> - Стальные конструкции</li>
                <li><strong>СП 63.13330.2018</strong> - Железобетонные конструкции</li>
                <li><strong>ГОСТ 20372-2015</strong> - Фермы стропильные стальные</li>
                <li><strong>ГОСТ 24045-2016</strong> - Панели стеновые с металлическими обшивками</li>
                <li><strong>СП 4.13130.2013</strong> - Противопожарные требования</li>
                <li><strong>СП 2.13130.2020</strong> - Системы противопожарной защиты</li>
            </ul>
        </div>

        <div class="section">
            <h2>4. Состав проектной документации</h2>
            <table>
                <tr>
                    <th>Раздел</th>
                    <th>Наименование</th>
                </tr>
                <tr><td>ПЗ</td><td>Пояснительная записка</td></tr>
                <tr><td>ПП</td><td>Проект планировочной организации земельного участка</td></tr>
                <tr><td>АР</td><td>Архитектурные решения</td></tr>
                <tr><td>КР</td><td>Конструктивные решения</td></tr>
                <tr><td>ИОС</td><td>Инженерное оборудование, сети и системы</td></tr>
                <tr><td>ПОС</td><td>Проект организации строительства</td></tr>
                <tr><td>ООС</td><td>Охрана окружающей среды</td></tr>
                <tr><td>ПБ</td><td>Пожарная безопасность</td></tr>
                <tr><td>ОДИ</td><td>Обеспечение доступа инвалидов</td></tr>
                <tr><td>СМ</td><td>Смета на строительство</td></tr>
            </table>
        </div>

        <div class="warning">
            <strong>⚠️ ВАЖНОЕ ПРИМЕЧАНИЕ:</strong><br>
            Настоящий отчёт является предварительным расчётом. Для точного определения стоимости
            и технических решений требуется разработка полной проектной документации с учётом:
            <ul>
                <li>Инженерно-геологических изысканий на участке строительства</li>
                <li>Детального технического задания заказчика</li>
                <li>Климатических особенностей региона</li>
                <li>Требований местных органов надзора</li>
            </ul>
            Проектная документация подлежит обязательному согласованию в органах государственной
            экспертизы согласно Градостроительному кодексу РФ.
        </div>

        <div class="footer">
            <p>Документ сгенерирован автоматически системой DEAD SPACE</p>
            <p>Проектная организация: ООО "DEAD SPACE"</p>
            <p>Дата формирования: {datetime.now().strftime("%d.%m.%Y %H:%M")}</p>
        </div>
    </body>
    </html>
    '''
    
    return html
