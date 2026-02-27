CREATE TABLE IF NOT EXISTS saved_kp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client TEXT,
    total_sum BIGINT,
    kp_data JSONB NOT NULL,
    files_text TEXT,
    extra_prompt TEXT,
    status VARCHAR(50) DEFAULT 'active',
    sent_to_production BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kp_id UUID REFERENCES saved_kp(id),
    project_name TEXT NOT NULL,
    total_duration TEXT,
    roadmap_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_kp_created ON saved_kp(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_roadmaps_kp_id ON saved_roadmaps(kp_id);
