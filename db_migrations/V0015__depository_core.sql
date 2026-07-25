-- Голографический депозитарий: папки, файлы, теги

CREATE TABLE IF NOT EXISTS depo_folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER REFERENCES depo_folders(id),
    kind VARCHAR(20) NOT NULL DEFAULT 'folder', -- department | project | folder
    owner_id INTEGER REFERENCES crew_members(id),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_depo_folders_parent ON depo_folders(parent_id);

CREATE TABLE IF NOT EXISTS depo_files (
    id SERIAL PRIMARY KEY,
    folder_id INTEGER REFERENCES depo_folders(id),
    name VARCHAR(500) NOT NULL,
    url TEXT NOT NULL,
    mime VARCHAR(120),
    size_bytes BIGINT DEFAULT 0,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    ai_summary TEXT,
    text_content TEXT,
    owner_id INTEGER REFERENCES crew_members(id),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_trashed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_depo_files_folder ON depo_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_depo_files_owner ON depo_files(owner_id);
CREATE INDEX IF NOT EXISTS idx_depo_files_trashed ON depo_files(is_trashed);

CREATE TABLE IF NOT EXISTS depo_activity (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES depo_files(id),
    member_id INTEGER REFERENCES crew_members(id),
    action VARCHAR(40) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_depo_activity_file ON depo_activity(file_id, id);

-- Корневые папки-отделы
INSERT INTO depo_folders (name, kind, is_public) VALUES
    ('Галактический реестр', 'department', TRUE),
    ('DEAD SPACE', 'department', TRUE),
    ('Альянс', 'department', TRUE),
    ('Казначейство', 'department', TRUE),
    ('Инженерный отсек', 'department', TRUE),
    ('Орбитальный вещатель', 'department', TRUE),
    ('Капитанский мостик', 'department', TRUE),
    ('Экипаж', 'department', TRUE)
ON CONFLICT DO NOTHING;
