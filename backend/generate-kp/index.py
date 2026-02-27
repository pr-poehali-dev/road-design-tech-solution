"""Генерация коммерческого предложения и дорожной карты через ИИ на основе загруженных файлов"""
import json
import os
import base64
import re
import io
import httpx
from datetime import datetime


def extract_text_from_pdf(data: bytes) -> str:
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(data))
        texts = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                texts.append(t)
        return '\n'.join(texts)
    except Exception as e:
        return f'[Ошибка чтения PDF: {e}]'


def extract_text_from_docx(data: bytes) -> str:
    try:
        import docx
        doc = docx.Document(io.BytesIO(data))
        parts = []

        def get_cell_text(cell):
            return ' '.join(p.text.strip() for p in cell.paragraphs if p.text.strip())

        for block in doc.element.body:
            tag = block.tag.split('}')[-1] if '}' in block.tag else block.tag
            if tag == 'p':
                from docx.oxml.ns import qn
                para_xml = block
                para = None
                for p in doc.paragraphs:
                    if p._element is para_xml:
                        para = p
                        break
                if para and para.text.strip():
                    style = para.style.name if para.style else ''
                    if 'Heading' in style or 'heading' in style:
                        parts.append(f'\n## {para.text.strip()}')
                    else:
                        parts.append(para.text.strip())
            elif tag == 'tbl':
                for tbl in doc.tables:
                    if tbl._element is block:
                        rows = tbl.rows
                        if not rows:
                            continue
                        header_cells = [get_cell_text(c) for c in rows[0].cells]
                        has_header = any(header_cells)
                        if has_header:
                            parts.append('\nТАБЛИЦА:')
                            parts.append(' | '.join(header_cells))
                            parts.append('-' * 40)
                        for row in (rows[1:] if has_header else rows):
                            row_texts = [get_cell_text(c) for c in row.cells]
                            non_empty = [t for t in row_texts if t]
                            if non_empty:
                                if has_header:
                                    pairs = []
                                    for h, v in zip(header_cells, row_texts):
                                        if v:
                                            pairs.append(f'{h}: {v}' if h else v)
                                    parts.append(', '.join(pairs))
                                else:
                                    parts.append(' | '.join(non_empty))
                        break

        return '\n'.join(parts)
    except Exception as e:
        return f'[Ошибка чтения DOCX: {e}]'


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
    {"code": "ИИ-ОБМ", "name": "Обследование строительных конструкций (обмерные работы)", "unit": "м³", "price_per_unit": 500},
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

# ЭТАП 1: Промпт для извлечения параметров из ТЗ (быстрый, без расчётов)
PARSE_SYSTEM_PROMPT = """Ты — технический аналитик проектно-инжиниринговой компании.
Прочитай техническое задание и извлеки ВСЕ ключевые параметры.

ВАЖНО: читай документ ПОЛНОСТЬЮ, включая таблицы. Ищи числа во всех разделах.

Отвечай ТОЛЬКО JSON:
{
  "client": "название заказчика или организации",
  "object_name": "полное наименование объекта",
  "work_type": "новое строительство / реконструкция / капитальный ремонт / изыскания",
  "location": "адрес или местоположение объекта",
  "area_ha": число или null (площадь участка/территории в га; если указаны м² — переведи в га),
  "volume_m3": число или null (строительный объём в м³; если не указан явно — оцени по аналогам исходя из типа и площади объекта),
  "area_m2": число или null (площадь строений в м² — для дорог, мостов, интерьеров),
  "has_state_expertise": true/false (требуется ли госэкспертиза),
  "has_eco_expertise": true/false (требуется ли ГЭЭ или экологическая экспертиза),
  "has_author_supervision": true/false (требуется ли авторский надзор),
  "supervision_months": число или null (сколько месяцев авторского надзора),
  "has_nts": true/false (требуется ли НТС — научно-техническое сопровождение),
  "nts_months": число или null,
  "has_geodesy": true/false (нужны ли геодезические изыскания ИГДИ),
  "has_ecology": true/false (нужны ли экологические изыскания ИЭИ),
  "has_geology": true/false (нужны ли геологические изыскания),
  "has_survey": true/false (нужно ли обследование конструкций ОБМ),
  "survey_volume_m3": число или null (объём обследования в м³),
  "object_type": "ОКС / дорога / мост / интерьер / ПГО / ППТ / ПМТ / БЗУ / другое",
  "financing": "бюджет / коммерческий / госконтракт",
  "notes": "важные особые условия из ТЗ"
}"""

# ЭТАП 2: Промпт для генерации КП на основе извлечённых параметров
KP_SYSTEM_PROMPT = f"""Ты — эксперт по составлению коммерческих предложений для проектно-инжиниринговой компании.

ПРАЙС-ЛИСТ компании (используй ТОЛЬКО эти позиции):
{PRICE_LIST_STR}

Тебе передают уже извлечённые параметры из ТЗ. На их основе составь КП.

ПРАВИЛА РАСЧЁТА:

1. ИНЖЕНЕРНЫЕ ИЗЫСКАНИЯ (если has_geodesy/has_ecology true):
   - ИИ-ИГДИ: volume = area_ha, total = area_ha × 40000
   - ИИ-ИЭИ: volume = area_ha, total = area_ha × 65000
   - ИИ-ОБМ: если has_survey, volume = survey_volume_m3, total = survey_volume_m3 × 500

2. ПРОЕКТИРОВАНИЕ ОКС (object_type = ОКС):
   - Используй volume_m3 из параметров
   - ЕСЛИ volume_m3 = null или 0 → ОЦЕНИ сам по типу объекта (НЕ ставь 0!)
     * Жилой дом 3-5 этажей: ~5000-15000 м³
     * Административное здание: ~3000-10000 м³
     * Промышленный объект: ~10000-50000 м³
   - НС до 100 м³: 5000/м³; 100-500: 4000; 500-5000: 2000; >5000: 1500
   - РЕК до 100 м³: 3000/м³; 100-500: 2500
   - КР до 100 м³: 2000/м³; 100-500: 1500

3. ДОРОГИ (object_type = дорога):
   - Используй area_m2
   - НС до 1000 м²: 700/м²; 1000-5000: 600; 5000-10000: 550; >10000: 500
   - РЕК до 1000 м²: 2000/м²; 1000-5000: 1400

4. ЭКСПЕРТИЗЫ:
   - СОПГЭ: если has_state_expertise или has_eco_expertise → 1 комплект × 200000

5. ДОПОЛНИТЕЛЬНЫЕ:
   - ОП-АН: если has_author_supervision → supervision_months × 100000
   - ОП-НТС: если has_nts → nts_months × 1500000

ВАЖНО: НЕ СТАВЬ volume=0 если параметр известен или можно оценить!
Арифметика: total = volume × price_per_unit, проверь каждую строку!
total_sum = сумма всех total.

Отвечай ТОЛЬКО JSON:
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
1. Обзор проекта: Цели, ключевые результаты
2. Этапы реализации: Детальная разбивка по фазам
3. Ключевые вехи: Контрольные точки и критерии приёмки
4. Риски и митигация: Основные риски и пути их снижения
5. Команда и ресурсы: Необходимые специалисты и ресурсы
6. Критический путь: Наиболее важные зависимости

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


def call_ai(system_prompt: str, user_message: str, max_tokens: int = 4000) -> str:
    api_key = os.environ.get('OPENROUTER_API_KEY', '')

    response = httpx.post(
        'https://openrouter.ai/api/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        json={
            'model': 'deepseek/deepseek-chat',
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_message}
            ],
            'max_tokens': max_tokens,
            'temperature': 0.2,
        },
        timeout=28.0
    )

    result = response.json()
    if 'choices' not in result:
        error_msg = result.get('error', {}).get('message', str(result))
        raise Exception(f"OpenRouter error: {error_msg}")
    return result['choices'][0]['message']['content']


def extract_json(text: str) -> dict:
    text = text.strip()
    if '```json' in text:
        text = text.split('```json')[1].split('```')[0].strip()
    elif '```' in text:
        text = text.split('```')[1].split('```')[0].strip()
    return json.loads(text)


def handler(event: dict, context) -> dict:
    """Генерация КП и дорожной карты через ИИ (двухэтапный подход: парсинг ТЗ → генерация КП)"""

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

    if action == 'ping':
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'status': 'ok'})
        }

    files_text = body.get('files_text', '')
    extra_prompt = body.get('extra_prompt', '')
    kp_data = body.get('kp_data', None)
    files_b64 = body.get('files_b64', [])

    # Парсинг файлов
    parsed_texts = []
    for f in files_b64:
        name = f.get('name', '')
        b64 = f.get('data', '')
        raw = base64.b64decode(b64)
        if name.lower().endswith('.pdf'):
            text = extract_text_from_pdf(raw)
        elif name.lower().endswith('.docx'):
            text = extract_text_from_docx(raw)
        else:
            text = raw.decode('utf-8', errors='replace')
        parsed_texts.append(f'=== ФАЙЛ: {name} ===\n{text}')

    combined_text = '\n\n'.join(parsed_texts) if parsed_texts else files_text

    if action == 'generate_kp':
        # ЭТАП 1: Извлечь параметры из ТЗ
        parse_message = f"""ТЕХНИЧЕСКОЕ ЗАДАНИЕ:
{combined_text}

{f'ДОПОЛНИТЕЛЬНЫЕ ТРЕБОВАНИЯ: {extra_prompt}' if extra_prompt else ''}

Извлеки все параметры из этого ТЗ."""

        params_response = call_ai(PARSE_SYSTEM_PROMPT, parse_message, max_tokens=1000)
        params = extract_json(params_response)

        # ЭТАП 2: Сгенерировать КП на основе параметров
        kp_message = f"""ПАРАМЕТРЫ ОБЪЕКТА (извлечены из ТЗ):
{json.dumps(params, ensure_ascii=False, indent=2)}

{f'ДОПОЛНИТЕЛЬНЫЕ ТРЕБОВАНИЯ КЛИЕНТА: {extra_prompt}' if extra_prompt else ''}

Составь коммерческое предложение на основе этих параметров."""

        ai_response = call_ai(KP_SYSTEM_PROMPT, kp_message, max_tokens=4000)
        result_data = extract_json(ai_response)

    elif action == 'generate_roadmap':
        user_message = f"""СОДЕРЖИМОЕ ДОКУМЕНТОВ:
{combined_text}

{f'ДОПОЛНИТЕЛЬНЫЕ ТРЕБОВАНИЯ: {extra_prompt}' if extra_prompt else ''}
"""
        if kp_data:
            user_message += f"\nКОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ:\n{json.dumps(kp_data, ensure_ascii=False)}"
        user_message += "\n\nСоставь дорожную карту реализации проекта."

        ai_response = call_ai(ROADMAP_SYSTEM_PROMPT, user_message, max_tokens=3000)
        result_data = extract_json(ai_response)

    else:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Unknown action: {action}'})
        }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(result_data, ensure_ascii=False)
    }
