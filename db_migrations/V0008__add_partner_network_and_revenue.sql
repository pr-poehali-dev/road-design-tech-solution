
-- Добавляем поля для партнёрской сети в таблицу users
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_code VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR(255);

-- Генерируем invite_code для всех существующих пользователей
UPDATE users SET invite_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT || id::TEXT) FROM 1 FOR 8)) WHERE invite_code IS NULL;

-- Добавляем поля оборота в crm_clients (сделки)
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS revenue BIGINT DEFAULT 0;
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS planned_revenue BIGINT DEFAULT 0;
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS contract_amount BIGINT DEFAULT 0;
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS received_amount BIGINT DEFAULT 0;
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS description TEXT;

-- Индекс для быстрого поиска по инвайт-коду
CREATE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_users_parent_id ON users(parent_id);
