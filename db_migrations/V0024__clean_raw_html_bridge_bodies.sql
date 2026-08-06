-- Приводим уже сохранённые письма с "сырым" HTML-телом (например от Bidzaar) к читаемому тексту:
-- убираем <style>/<script> целиком, HTML-комментарии, заменяем блочные теги на переносы строк,
-- вырезаем оставшиеся теги, декодируем частые HTML-сущности и схлопываем лишние пустые строки.
WITH cleaned AS (
  SELECT id,
    btrim(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    regexp_replace(
                      regexp_replace(body, '<(script|style)[^>]*>.*?</\1>', ' ', 'gi'),
                    '<!--.*?-->', ' ', 'gi'),
                  '<(br|/p|/div|/tr|/li|/h[1-6])[^>]*>', chr(10), 'gi'),
                '<[^>]+>', ' ', 'g'),
              '&nbsp;', ' ', 'g'),
            '&amp;', '&', 'g'),
          '&lt;', '<', 'g'),
        '&gt;', '>', 'g'),
      '&quot;', '"', 'g')
    ) AS body1
  FROM bridge_messages
  WHERE channel = 'email'
    AND (body LIKE '%<html%' OR body LIKE '%<!doctype%' OR body ILIKE '%<div%' OR body ILIKE '%<table%')
)
UPDATE bridge_messages m
SET body = btrim(
  regexp_replace(
    regexp_replace(cleaned.body1, '[ \t]+', ' ', 'g'),
    E'\n[ \t]*\n+', E'\n\n', 'g'
  )
)
FROM cleaned
WHERE m.id = cleaned.id;
