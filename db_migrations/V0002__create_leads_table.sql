-- Создаём таблицу для хранения заявок
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    company VARCHAR(255),
    message TEXT,
    source VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по статусу
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Индекс для сортировки по дате
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);