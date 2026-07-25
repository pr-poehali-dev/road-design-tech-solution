-- Оргструктура экипажа + личные сообщения (отдельная таблица)

ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES crew_members(id);
ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS position_title VARCHAR(120);

CREATE TABLE IF NOT EXISTS crew_dm (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES crew_members(id),
    recipient_id INTEGER NOT NULL REFERENCES crew_members(id),
    text TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_crew_dm_pair ON crew_dm(sender_id, recipient_id, id);
CREATE INDEX IF NOT EXISTS idx_crew_dm_recipient ON crew_dm(recipient_id, id);
CREATE INDEX IF NOT EXISTS idx_crew_members_parent ON crew_members(parent_id);
