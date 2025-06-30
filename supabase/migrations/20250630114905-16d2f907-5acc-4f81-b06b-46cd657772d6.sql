
-- Обновляем роль для администратора info@madiluxe.com на 'admin'
UPDATE public.admins 
SET role = 'admin' 
WHERE email = 'info@madiluxe.com';
