-- Чиним "потерянные" сделки: у них stage='new', но такой стадии нет в воронке партнёра
-- (ключи стадий кастомные), из-за чего карточки не отображались ни в одной колонке канбана.
-- Переносим каждую такую сделку на первую по порядку реальную стадию воронки её партнёра.

UPDATE crm_clients c
SET stage = fs.stage_key
FROM (
    SELECT DISTINCT ON (partner_id) partner_id, stage_key
    FROM crm_stages
    ORDER BY partner_id, sort_order ASC
) fs
WHERE c.partner_id = fs.partner_id
  AND c.stage = 'new'
  AND NOT EXISTS (
      SELECT 1 FROM crm_stages s WHERE s.partner_id = c.partner_id AND s.stage_key = 'new'
  );
