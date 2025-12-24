-- DEAD SPACE Platform: AI-экосистема для проектного института

-- 1. Прайс-лист услуг с правилами расчета
CREATE TABLE IF NOT EXISTS ds_price_list (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    alias VARCHAR(100) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL,
    volume_range VARCHAR(100),
    price_per_unit NUMERIC(12, 2) NOT NULL,
    min_order_sum NUMERIC(12, 2),
    special_rules TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Проекты (основная сущность)
CREATE TABLE IF NOT EXISTS ds_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    partner_id INTEGER,
    status VARCHAR(50) DEFAULT 'draft',
    total_sum NUMERIC(15, 2) DEFAULT 0,
    margin NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Технические задания (ТЗ)
CREATE TABLE IF NOT EXISTS ds_technical_specs (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES ds_projects(id),
    raw_request TEXT NOT NULL,
    parsed_data JSONB,
    object_type VARCHAR(255),
    sections_required TEXT[],
    ai_analysis JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP
);

-- 4. Коммерческие предложения (КП)
CREATE TABLE IF NOT EXISTS ds_commercial_offers (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES ds_projects(id),
    tech_spec_id INTEGER REFERENCES ds_technical_specs(id),
    items JSONB NOT NULL,
    total_sum NUMERIC(15, 2) NOT NULL,
    pdf_url TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP
);

-- 5. План-график работ
CREATE TABLE IF NOT EXISTS ds_schedules (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES ds_projects(id),
    title VARCHAR(500) NOT NULL,
    stage_number INTEGER NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    assignee_type VARCHAR(50) DEFAULT 'ai',
    assignee_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    ai_generated BOOLEAN DEFAULT true,
    dependencies INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 6. Производственные документы
CREATE TABLE IF NOT EXISTS ds_documents (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES ds_projects(id),
    schedule_id INTEGER REFERENCES ds_schedules(id),
    title VARCHAR(500) NOT NULL,
    section_code VARCHAR(100),
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'ai_draft',
    reviewer_notes TEXT,
    ai_metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    approved_at TIMESTAMP
);

-- 7. Партнеры/Франчайзи
CREATE TABLE IF NOT EXISTS ds_partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    commission_rate NUMERIC(5, 2) DEFAULT 15.00,
    password_hash TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. История активности (аудит)
CREATE TABLE IF NOT EXISTS ds_activity_log (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES ds_projects(id),
    partner_id INTEGER REFERENCES ds_partners(id),
    action_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Клиентские комментарии и согласования
CREATE TABLE IF NOT EXISTS ds_client_comments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES ds_projects(id),
    document_id INTEGER REFERENCES ds_documents(id),
    comment TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- 10. Unit-экономика
CREATE TABLE IF NOT EXISTS ds_economics (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES ds_projects(id),
    partner_id INTEGER REFERENCES ds_partners(id),
    revenue NUMERIC(15, 2) DEFAULT 0,
    cost NUMERIC(15, 2) DEFAULT 0,
    margin NUMERIC(15, 2) DEFAULT 0,
    partner_commission NUMERIC(15, 2) DEFAULT 0,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_ds_projects_partner ON ds_projects(partner_id);
CREATE INDEX IF NOT EXISTS idx_ds_projects_status ON ds_projects(status);
CREATE INDEX IF NOT EXISTS idx_ds_schedules_project ON ds_schedules(project_id);
CREATE INDEX IF NOT EXISTS idx_ds_schedules_status ON ds_schedules(status);
CREATE INDEX IF NOT EXISTS idx_ds_documents_project ON ds_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_ds_activity_project ON ds_activity_log(project_id);
CREATE INDEX IF NOT EXISTS idx_ds_activity_partner ON ds_activity_log(partner_id);