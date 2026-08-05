-- Помечаем дублирующиеся письма (оставляем видимой только самую раннюю запись на каждый email_message_id)
ALTER TABLE bridge_messages ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE bridge_messages
SET is_duplicate = TRUE
WHERE channel = 'email' AND email_message_id IS NOT NULL
AND id NOT IN (
  SELECT MIN(id) FROM bridge_messages WHERE channel = 'email' AND email_message_id IS NOT NULL GROUP BY email_message_id
);

-- Защита от повторного дублирования на уровне базы: один email_message_id — одна видимая запись
CREATE UNIQUE INDEX IF NOT EXISTS idx_bridge_messages_unique_email_id
ON bridge_messages(email_message_id)
WHERE channel = 'email' AND email_message_id IS NOT NULL AND is_duplicate = FALSE;
