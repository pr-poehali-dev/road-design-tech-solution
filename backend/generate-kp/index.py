"""Генерация коммерческого предложения и дорожной карты через ИИ на основе загруженных файлов"""
import json
import os
import base64
import re
import httpx
from datetime import datetime

PRICE_LIST = [
    {"code": "ОП-ОКС.БЗУ", "name": "Благоустройство земельного участка (БЗУ под ключ)", "unit": "га", "price_per_unit": 500000, "min_order_sum": 500000, "special_rules": "Округление площади: 1.1–1.4 как 1 га; 1.5–1.9 как 2 га"},
    {"code": "ОП-ППТ понижающие условия", "name": "ППТ, гос, понижающие условия", "unit": "га", "price_per_unit": 215000, "special_rules": "Коэффициент 0.15 для понижающих условий"},
    {"code": "ОП-ППТ госконтракт", "name": "ППТ, госконтракт", "unit": "га", "price_per_unit": 450000, "special_rules": "Коэффициент 0.3 для госконтрактов"},
    {"code": "ОП-ППТ коммерческий", "name": "ППТ, коммерческий контракт", "unit": "га", "price_per_unit": 1500000, "special_rules": "Коэффициент 1 для коммерческих контрактов"},
    {"code": "ОП-ПМТ понижающие условия", "name": "ПМТ, гос, понижающие условия", "unit": "га", "price_per_unit": 215000},
    {"code": "ОП-ПМТ госконтракт", "name": "ПМТ, госконтракт", "unit": "га", "price_per_unit": 450000},
    {"code": "ОП-ПМТ коммерческий", "name": "ПМТ, коммерческий контракт", "unit": "га", "price_per_unit": 1500000},
    {"code": "ИИ-ИГДИ", "name": "Инженерно-геодезические изыскания", "unit": "га", "price_per_unit": 40000},
    {"code": "ИИ-ИЭИ", "name": "Инженерно-экологические изыскания", "unit": "га", "price_per_unit": 65000},
    {"code": "ОП-ПГО до 100", "name": "ПГО до 100 га", "unit": "га", "price_per_unit": 24000},
    {"code": "ОП-ПГО 100-500", "name": "ПГО 100–500 га", "unit": "га", "price_per_unit": 23000},
    {"code": "ОП-ПГО 500-2000", "name": "ПГО 500–2000 га", "unit": "га", "price_per_unit": 22000},
    {"code": "ОП-ПГО 2000-5000", "name": "ПГО 2000–5000 га", "unit": "га", "price_per_unit": 21000},
    {"code": "ОП-ПГО более 5000", "name": "ПГО более 5000 га", "unit": "га", "price_per_unit": 20000},
    {"code": "ОП-ЛИК.КОНС.ГДП", "name": "Ликвидация/консервация/рекультивация горнодобывающих участков", "unit": "га", "price_per_unit": 100000},
    {"code": "СОПГЭ", "name": "Сопровождение экспертизы (ГЭ/НГЭ)", "unit": "комплект", "price_per_unit": 200000},
    {"code": "ОП-ЛО.НС.АД до 1000", "name": "Дорога НС, до 1000 м²", "unit": "м²", "price_per_unit": 700},
    {"code": "ОП-ЛО.НС.АД 1000-5000", "name": "Дорога НС, 1000–5000 м²", "unit": "м²", "price_per_unit": 600},
    {"code": "ОП-ЛО.НС.АД 5000-10000", "name": "Дорога НС, 5000–10000 м²", "unit": "м²", "price_per_unit": 550},
    {"code": "ОП-ЛО.НС.АД более 10000", "name": "Дорога НС, более 10000 м²", "unit": "м²", "price_per_unit": 500},
    {"code": "ОП-ЛО.РЕК.АД до 1000", "name": "Дорога реконструкция, до 1000 м²", "unit": "м²", "price_per_unit": 2000},
    {"code": "ОП-ЛО.РЕК.АД 1000-5000", "name": "Дорога реконструкция, 1000–5000 м²", "unit": "м²", "price_per_unit": 1400},
    {"code": "ОП-ОКС.НС.МОСТ", "name": "Мостовое сооружение, новое", "unit": "м²", "price_per_unit": 11000},
    {"code": "ОП-ОКС.РЕК.МОСТ", "name": "Мостовое сооружение, реконструкция", "unit": "м²", "price_per_unit": 9000},
    {"code": "ОП-ДП до 100", "name": "Дизайн-проект интерьеров до 100 м²", "unit": "м²", "price_per_unit": 5000},
    {"code": "ОП-ДП 100-200", "name": "Дизайн-проект 100–200 м²", "unit": "м²", "price_per_unit": 4000},
    {"code": "ОП-ДП 200-500", "name": "Дизайн-проект 200–500 м²", "unit": "м²", "price_per_unit": 3000},
    {"code": "ОП-ОКС.НС до 100", "name": "ОКС — новое строительство, до 100 м³", "unit": "м³", "price_per_unit": 5000},
    {"code": "ОП-ОКС.НС 100-500", "name": "ОКС — новое строительство, 100–500 м³", "unit": "м³", "price_per_unit": 4000},
    {"code": "ОП-ОКС.НС 500-5000", "name": "ОКС — новое строительство, 500–5000 м³", "unit": "м³", "price_per_unit": 2000},
    {"code": "ОП-ОКС.НС более 5000", "name": "ОКС — новое строительство, более 5000 м³", "unit": "м³", "price_per_unit": 1500},
    {"code": "ОП-ОКС.РЕК до 100", "name": "ОКС — реконструкция, до 100 м³", "unit": "м³", "price_per_unit": 3000},
    {"code": "ОП-ОКС.РЕК 100-500", "name": "ОКС — реконструкция, 100–500 м³", "unit": "м³", "price_per_unit": 2500},
    {"code": "ОП-ОКС.КР до 100", "name": "ОКС — капитальный ремонт, до 100 м³", "unit": "м³", "price_per_unit": 2000},
    {"code": "ОП-ОКС.КР 100-500", "name": "ОКС — капитальный ремонт, 100–500 м³", "unit": "м³", "price_per_unit": 1500},
    {"code": "ОП-АН", "name": "Авторский надзор", "unit": "месяц", "price_per_unit": 100000},
    {"code": "ОП-НТС", "name": "Научно-техническое сопровождение (НТС)", "unit": "месяц", "price_per_unit": 1500000, "min_order_sum": 1500000},
    {"code": "ОП-ТНЗ 1 сотрудник", "name": "Технадзор/техсопровождение, 1 сотрудник", "unit": "чел.-месяц", "price_per_unit": 350000},
    {"code": "ОП-ТНЗ 2-5 сотрудников", "name": "Технадзор/техсопровождение, 2–5 сотрудников", "unit": "чел.-месяц", "price_per_unit": 300000},
    {"code": "ОП-ЮРЗ 1 сотрудник", "name": "Юридическое сопровождение, 1 юрист", "unit": "чел.-месяц", "price_per_unit": 300000},
    {"code": "ОП-ЮРЗ 2-5 сотрудников", "name": "Юридическое сопровождение, 2–5 юристов", "unit": "чел.-месяц", "price_per_unit": 250000},
]

PRICE_LIST_STR = json.dumps(PRICE_LIST, ensure_ascii=False)

KP_SYSTEM_PROMPT = f"""Ты — эксперт по составлению коммерческих предложений для проектно-инжиниринговой компании.
На основе предоставленных документов (ТЗ, технические задания, файлы) составь детальное Коммерческое Предложение (КП) на русском языке.

ПРАЙС-ЛИСТ компании (используй ТОЛЬКО эти позиции для расчёта стоимости):
{PRICE_LIST_STR}

АЛГОРИТМ СОСТАВЛЕНИЯ КП:
1. Внимательно прочитай ТЗ и определи: тип объекта, вид работ (НС/реконструкция/КР), площадь (га), объём (м³ или м²), наличие экспертиз.
2. Для КАЖДОГО вида работ из ТЗ найди подходящую позицию из прайса по коду.
3. Если в ТЗ указана площадь участка — используй её для расчёта позиций в га (ИГДИ, ИЭИ и т.д.).
4. Для ОКС определи строительный объём (м³) из ТЗ или оцени по аналогии.
5. Рассчитай итог: volume × price_per_unit = total. Проверь арифметику.
6. Если позиции нет в прайсе — добавь с пометкой "ориентировочно" и разумной оценкой.
7. Сложи все total → total_sum. Проверь сумму ещё раз.

ВАЖНЫЕ ПРАВИЛА:
- Новое строительство ОКС объёмом более 5000 м³ → код "ОП-ОКС.НС более 5000", цена 1500 руб/м³
- Инженерные изыскания: ИГДИ (40000 руб/га), ИЭИ (65000 руб/га) — обязательны для большинства объектов
- Сопровождение экспертизы (СОПГЭ) — 200000 руб за комплект
- Авторский надзор (ОП-АН) — 100000 руб/месяц
- НТС (ОП-НТС) — 1500000 руб/месяц, включай только если явно требуется
- Если объём не указан — пиши volume=0 и notes="по факту обмеров"
- Применяй правила min_order_sum и special_rules из прайса

СТРУКТУРА КП:
1. Титульная страница: название, клиент, дата, объект, вид работ, основание, источник финансирования
2. Краткое резюме: суть проекта 3-5 предложений
3. Разделы работ: "Инженерные изыскания", "Проектирование", "Сопровождение экспертиз", "Дополнительные услуги"
4. В каждом разделе — таблица: Код | Наименование | Ед. | Объём | Цена за ед. | Итого
5. Итоговая стоимость с разбивкой: базовый пакет и опции
6. Сроки реализации по этапам
7. Условия оплаты (аванс 40%, промежуточные платежи, финальный расчёт)
8. Особые условия и исключения

Отвечай ТОЛЬКО JSON в формате:
{{
  "kp": {{
    "title": "...",
    "client": "...",
    "date": "...",
    "object_name": "...",
    "work_type": "...",
    "summary": "...",
    "sections": [{{"name": "...", "items": [{{"code": "...", "name": "...", "unit": "...", "volume": 0, "price_per_unit": 0, "total": 0, "notes": "..."}}]}}],
    "total_sum": 0,
    "total_sum_words": "...",
    "timeline": [{{"phase": "...", "duration": "...", "description": "..."}}],
    "payment_conditions": ["..."],
    "special_conditions": ["..."],
    "validity": "30 дней"
  }}
}}"""

ROADMAP_SYSTEM_PROMPT = """Ты — опытный менеджер проектов. На основе технического задания и коммерческого предложения составь подробную дорожную карту реализации проекта.

СТРУКТУРА ДОРОЖНОЙ КАРТЫ:
1. **Обзор проекта**: Цели, ключевые результаты
2. **Этапы реализации**: Детальная разбивка по фазам
3. **Ключевые вехи**: Контрольные точки и критерии приёмки
4. **Риски и митигация**: Основные риски и пути их снижения
5. **Команда и ресурсы**: Необходимые специалисты и ресурсы
6. **Критический путь**: Наиболее важные зависимости

Отвечай ТОЛЬКО JSON в формате:
{
  "roadmap": {
    "project_name": "...",
    "total_duration": "...",
    "overview": "...",
    "phases": [{"id": 1, "name": "...", "duration": "...", "start_week": 1, "end_week": 4, "tasks": ["..."], "deliverables": ["..."], "responsible": "..."}],
    "milestones": [{"week": 4, "name": "...", "criteria": "..."}],
    "risks": [{"risk": "...", "probability": "высокая/средняя/низкая", "impact": "высокий/средний/низкий", "mitigation": "..."}],
    "team": [{"role": "...", "count": 1, "tasks": "..."}],
    "critical_path": ["..."]
  }
}"""


def call_ai(system_prompt: str, user_message: str) -> str:
    api_key = os.environ.get('OPENROUTER_API_KEY', '')
    
    response = httpx.post(
        'https://openrouter.ai/api/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        json={
            'model': 'deepseek/deepseek-chat-v3-0324',
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_message}
            ],
            'max_tokens': 8000,
            'temperature': 0.3,
        },
        timeout=120.0
    )
    
    result = response.json()
    if 'choices' not in result:
        error_msg = result.get('error', {}).get('message', str(result))
        raise Exception(f"OpenRouter error: {error_msg}")
    return result['choices'][0]['message']['content']


def extract_json(text: str) -> dict:
    text = text.strip()
    # Remove markdown code blocks if present
    if '```json' in text:
        text = text.split('```json')[1].split('```')[0].strip()
    elif '```' in text:
        text = text.split('```')[1].split('```')[0].strip()
    return json.loads(text)


def handler(event: dict, context) -> dict:
    """Генерация КП и дорожной карты через ИИ на основе загруженных файлов"""
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    body = json.loads(event.get('body', '{}'))
    action = body.get('action', 'generate_kp')
    files_text = body.get('files_text', '')
    extra_prompt = body.get('extra_prompt', '')
    kp_data = body.get('kp_data', None)

    user_message = f"""СОДЕРЖИМОЕ ЗАГРУЖЕННЫХ ДОКУМЕНТОВ:
{files_text}

{f'ДОПОЛНИТЕЛЬНЫЕ ТРЕБОВАНИЯ ОТ КЛИЕНТА: {extra_prompt}' if extra_prompt else ''}

Составь {'коммерческое предложение' if action == 'generate_kp' else 'дорожную карту'} на основе этих материалов."""

    if action == 'generate_roadmap' and kp_data:
        user_message += f"\n\nКОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ (уже согласовано):\n{json.dumps(kp_data, ensure_ascii=False)}"

    system_prompt = KP_SYSTEM_PROMPT if action == 'generate_kp' else ROADMAP_SYSTEM_PROMPT

    ai_response = call_ai(system_prompt, user_message)
    result_data = extract_json(ai_response)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(result_data, ensure_ascii=False)
    }