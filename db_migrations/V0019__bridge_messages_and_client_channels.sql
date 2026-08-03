-- Радужный мост: единая переписка с клиентами (Email, Telegram, MAX)

CREATE TABLE IF NOT EXISTS bridge_messages (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL,
    client_id INTEGER,
    channel VARCHAR(20) NOT NULL,           -- 'email' | 'telegram' | 'max'
    direction VARCHAR(10) NOT NULL,         -- 'in' | 'out'
    sender_name VARCHAR(200),
    subject VARCHAR(500),
    body TEXT,
    email_message_id VARCHAR(500),          -- уникальный Message-ID письма (для дедупликации при IMAP-опросе)
    email_from VARCHAR(255),
    email_to VARCHAR(255),
    telegram_chat_id VARCHAR(100),
    telegram_username VARCHAR(200),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_bridge_messages_partner ON bridge_messages(partner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bridge_messages_client ON bridge_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_bridge_messages_channel ON bridge_messages(channel);

-- Привязка Telegram-чата и признак непрочитанного к клиенту сделки
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS telegram_chat_id VARCHAR(100);
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS telegram_username VARCHAR(200);
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS max_chat_id VARCHAR(100);
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP;
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS unread_messages_count INTEGER NOT NULL DEFAULT 0;
