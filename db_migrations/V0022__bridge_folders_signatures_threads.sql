-- Папки почты для сортировки писем
CREATE TABLE IF NOT EXISTS bridge_folders (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    color VARCHAR(20) DEFAULT '#45A29E',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bridge_folders_partner ON bridge_folders(partner_id);

-- Правила автосортировки: письма с этого адреса автоматом попадают в папку
CREATE TABLE IF NOT EXISTS bridge_folder_rules (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL,
    folder_id INTEGER NOT NULL REFERENCES bridge_folders(id),
    email_address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_bridge_folder_rules_addr
    ON bridge_folder_rules(partner_id, email_address);

-- Подписи к письмам (с поддержкой картинок в HTML)
CREATE TABLE IF NOT EXISTS bridge_signatures (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    html TEXT NOT NULL DEFAULT '',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bridge_signatures_partner ON bridge_signatures(partner_id);

-- Поля для цепочек писем, копий и папок в сообщениях
ALTER TABLE bridge_messages ADD COLUMN IF NOT EXISTS folder_id INTEGER;
ALTER TABLE bridge_messages ADD COLUMN IF NOT EXISTS email_in_reply_to VARCHAR(500);
ALTER TABLE bridge_messages ADD COLUMN IF NOT EXISTS email_references TEXT;
ALTER TABLE bridge_messages ADD COLUMN IF NOT EXISTS email_cc TEXT;
ALTER TABLE bridge_messages ADD COLUMN IF NOT EXISTS email_to_all TEXT;
ALTER TABLE bridge_messages ADD COLUMN IF NOT EXISTS notified BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_bridge_messages_folder ON bridge_messages(folder_id);
CREATE INDEX IF NOT EXISTS idx_bridge_messages_partner_created ON bridge_messages(partner_id, created_at DESC);
