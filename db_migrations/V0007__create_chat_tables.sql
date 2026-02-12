-- Таблица пользователей чата
CREATE TABLE IF NOT EXISTS chat_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'partner',
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица каналов
CREATE TABLE IF NOT EXISTS chat_channels (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('public', 'group', 'direct')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    channel_id VARCHAR(100) NOT NULL REFERENCES chat_channels(id),
    user_id INTEGER NOT NULL REFERENCES chat_users(id),
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'voice')),
    file_url TEXT,
    file_name VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_id ON chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Таблица участников каналов
CREATE TABLE IF NOT EXISTS chat_channel_members (
    id SERIAL PRIMARY KEY,
    channel_id VARCHAR(100) NOT NULL REFERENCES chat_channels(id),
    user_id INTEGER NOT NULL REFERENCES chat_users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(channel_id, user_id)
);

-- Создаем общий канал по умолчанию
INSERT INTO chat_channels (id, name, type) 
VALUES ('general', 'Общий чат', 'public')
ON CONFLICT (id) DO NOTHING;
