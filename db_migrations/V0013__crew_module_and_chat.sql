-- Раздел «Экипаж» + чат «Межзвездная связь»

CREATE TABLE IF NOT EXISTS crew_members (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    callsign VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'universal',
    department VARCHAR(60),
    points INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT,
    motto VARCHAR(255),
    suit_status VARCHAR(120) DEFAULT 'Готов к миссии',
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crew_sessions (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES crew_members(id),
    token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_crew_sessions_token ON crew_sessions(token);

CREATE TABLE IF NOT EXISTS crew_points_history (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES crew_members(id),
    delta INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    source VARCHAR(40) NOT NULL DEFAULT 'manual',
    created_by INTEGER REFERENCES crew_members(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_crew_points_member ON crew_points_history(member_id);

CREATE TABLE IF NOT EXISTS crew_achievements (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES crew_members(id),
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(60) DEFAULT 'Award',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crew_invitations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    role VARCHAR(30) DEFAULT 'universal',
    department VARCHAR(60),
    max_uses INTEGER NOT NULL DEFAULT 1,
    used_count INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER REFERENCES crew_members(id),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_crew_invitations_code ON crew_invitations(code);

CREATE TABLE IF NOT EXISTS crew_channels (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(40) DEFAULT 'Hash',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crew_messages (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER NOT NULL REFERENCES crew_channels(id),
    member_id INTEGER NOT NULL REFERENCES crew_members(id),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_crew_messages_channel ON crew_messages(channel_id, id);

INSERT INTO crew_channels (slug, name, icon, sort_order) VALUES
    ('general', 'Общий канал', 'Hash', 1),
    ('deadspace', 'DEAD SPACE', 'Rocket', 2),
    ('engineering', 'Инженерный отсек', 'Wrench', 3),
    ('bridge', 'Капитанский мостик', 'ShieldCheck', 4)
ON CONFLICT (slug) DO NOTHING;
