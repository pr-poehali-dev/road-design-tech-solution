-- Обновляем таблицу crm_clients
ALTER TABLE crm_clients 
  ADD COLUMN IF NOT EXISTS partner_id INTEGER REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS stage VARCHAR(50) DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS deal_amount BIGINT DEFAULT 0;

-- Копируем данные из owner_id в partner_id
UPDATE crm_clients SET partner_id = owner_id WHERE partner_id IS NULL;

-- Обновляем таблицу crm_tasks
ALTER TABLE crm_tasks
  ADD COLUMN IF NOT EXISTS partner_id INTEGER REFERENCES users(id);

-- Обновляем таблицу crm_activities
ALTER TABLE crm_activities
  ADD COLUMN IF NOT EXISTS partner_id INTEGER REFERENCES users(id);

-- Индексы для CRM
CREATE INDEX IF NOT EXISTS idx_crm_clients_partner ON crm_clients(partner_id);
CREATE INDEX IF NOT EXISTS idx_crm_clients_stage ON crm_clients(stage);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_partner ON crm_tasks(partner_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_partner ON crm_activities(partner_id);