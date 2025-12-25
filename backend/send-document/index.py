import json
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


def generate_pdf(document_data: dict) -> bytes:
    """Генерация PDF из данных документа"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    story = []
    styles = getSampleStyleSheet()
    
    # Заголовок
    title = Paragraph(f"<b>{document_data['section']}</b>", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 20))
    
    # Метаданные
    meta = f"Раздел: {document_data['sectionCode']}<br/>"
    meta += f"Версия: {document_data['version']}<br/>"
    meta += f"Статус: {document_data['status']}<br/>"
    meta += f"Дата: {document_data['createdAt']}"
    story.append(Paragraph(meta, styles['Normal']))
    story.append(Spacer(1, 30))
    
    # Содержимое документа
    content_lines = document_data['content'].split('\n')
    for line in content_lines:
        if line.strip():
            story.append(Paragraph(line, styles['Normal']))
            story.append(Spacer(1, 12))
    
    doc.build(story)
    buffer.seek(0)
    return buffer.read()


def send_email(to_email: str, subject: str, body: str, pdf_data: bytes, filename: str):
    """Отправка email с PDF вложением"""
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        raise ValueError('SMTP настройки не заполнены. Добавьте SMTP_HOST, SMTP_USER, SMTP_PASSWORD в секреты проекта')
    
    # Создание письма
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = subject
    
    # Текст письма
    msg.attach(MIMEText(body, 'html', 'utf-8'))
    
    # PDF вложение
    pdf_attachment = MIMEApplication(pdf_data, _subtype='pdf')
    pdf_attachment.add_header('Content-Disposition', 'attachment', filename=filename)
    msg.attach(pdf_attachment)
    
    # Отправка
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)


def handler(event: dict, context) -> dict:
    """API для отправки документа клиенту на email с PDF"""
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    try:
        data = json.loads(event.get('body', '{}'))
        client_email = data.get('clientEmail')
        client_name = data.get('clientName', 'Уважаемый клиент')
        project_name = data.get('projectName', 'Проект')
        document = data.get('document')
        
        if not client_email or not document:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Укажите clientEmail и document'})
            }
        
        # Генерация PDF
        pdf_data = generate_pdf(document)
        filename = f"{document['sectionCode']}_{project_name.replace(' ', '_')}.pdf"
        
        # Формирование письма
        subject = f"Готов документ: {document['section']} — {project_name}"
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Здравствуйте, {client_name}!</h2>
            <p>Готов раздел проектной документации для согласования:</p>
            <ul>
                <li><b>Проект:</b> {project_name}</li>
                <li><b>Раздел:</b> {document['section']} ({document['sectionCode']})</li>
                <li><b>Версия:</b> {document['version']}</li>
                <li><b>Статус:</b> {document['status']}</li>
            </ul>
            <p>Документ прикреплён к письму в формате PDF.</p>
            <p>Если есть замечания — оставьте их в личном кабинете на сайте, мы оперативно доработаем.</p>
            <br>
            <p style="color: #666; font-size: 12px;">
                С уважением,<br>
                Команда проектного института
            </p>
        </body>
        </html>
        """
        
        # Отправка email
        send_email(client_email, subject, body, pdf_data, filename)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': f'Документ отправлен на {client_email}',
                'filename': filename
            })
        }
        
    except ValueError as e:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка отправки: {str(e)}'})
        }
