-- Убираем повторяющиеся пустые "строки" (остатки от опустевших HTML-ячеек: \r\n и пробелы),
-- которые остаются в начале письма после предыдущей очистки от HTML.
UPDATE bridge_messages
SET body = btrim(regexp_replace(body, '(\s*\r?\n){2,}', E'\n\n', 'g'))
WHERE channel = 'email'
  AND body ~ E'(\\s*\r?\n){3,}';
