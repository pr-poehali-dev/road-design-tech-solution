-- Помечаем повторно импортированные письма без Message-ID (например с trade@enplus-td.ru),
-- которые из-за отсутствия уникального идентификатора письма раньше засчитывались как новые
-- при каждой проверке почты. Оставляем видимой только самую раннюю копию каждого письма.
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY email_from, subject, body
           ORDER BY id ASC
         ) AS rn
  FROM bridge_messages
  WHERE channel = 'email' AND email_message_id IS NULL AND is_duplicate = FALSE
)
UPDATE bridge_messages m
SET is_duplicate = TRUE
FROM ranked
WHERE m.id = ranked.id AND ranked.rn > 1;
