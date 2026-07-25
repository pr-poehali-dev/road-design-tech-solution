-- Единственный супер-админ станции DEOD: ipzlenko@gmail.com
UPDATE crew_members SET is_admin = FALSE WHERE email <> 'ipzlenko@gmail.com';
UPDATE crew_members SET is_admin = TRUE WHERE email = 'ipzlenko@gmail.com';

UPDATE users SET is_admin = FALSE WHERE email IS DISTINCT FROM 'ipzlenko@gmail.com';
UPDATE users SET is_admin = TRUE WHERE email = 'ipzlenko@gmail.com';