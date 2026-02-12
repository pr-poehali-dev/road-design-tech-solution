-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    asset VARCHAR(255),
    expected_income INTEGER,
    grade VARCHAR(50) DEFAULT 'Партнёр',
    is_admin BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat channels table
CREATE TABLE channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('public', 'group', 'direct')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channel members table
CREATE TABLE channel_members (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER REFERENCES channels(id),
    user_id INTEGER REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(channel_id, user_id)
);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER REFERENCES channels(id),
    user_id INTEGER REFERENCES users(id),
    text TEXT,
    file_name VARCHAR(255),
    file_url TEXT,
    file_type VARCHAR(100),
    voice_url TEXT,
    voice_duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CRM Clients table
CREATE TABLE crm_clients (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'lead' CHECK (status IN ('lead', 'contact', 'negotiation', 'proposal', 'contract', 'won', 'lost')),
    budget BIGINT,
    probability INTEGER CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    source VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CRM Tasks table
CREATE TABLE crm_tasks (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    client_id INTEGER REFERENCES crm_clients(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CRM Activities table
CREATE TABLE crm_activities (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES crm_clients(id),
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('call', 'meeting', 'email', 'note', 'status_change')),
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create default public channels
INSERT INTO channels (name, type) VALUES ('Общий чат', 'public');
INSERT INTO channels (name, type) VALUES ('Техподдержка', 'public');

-- Create indexes for performance
CREATE INDEX idx_messages_channel ON messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_online ON users(is_online, last_seen);
CREATE INDEX idx_crm_clients_owner ON crm_clients(owner_id, status);
CREATE INDEX idx_crm_tasks_owner ON crm_tasks(owner_id, status);
CREATE INDEX idx_channel_members ON channel_members(channel_id, user_id);
