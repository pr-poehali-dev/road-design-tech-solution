-- Радужный мост: вложения писем, множественные почтовые ящики, авто-создание лидов

CREATE TABLE IF NOT EXISTS bridge_attachments (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL REFERENCES bridge_messages(id),
    file_name VARCHAR(500) NOT NULL,
    mime VARCHAR(200),
    size_bytes INTEGER,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_bridge_attachments_message ON bridge_attachments(message_id);

-- К какому почтовому ящику относится сообщение (для фильтра "куда пришло" / "с какой почты отправлено")
ALTER TABLE bridge_messages ADD COLUMN IF NOT EXISTS mailbox VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_bridge_messages_mailbox ON bridge_messages(mailbox);

-- Признак того, что клиент создан автоматически по входящему письму с неизвестного адреса
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS auto_created BOOLEAN NOT NULL DEFAULT FALSE;
