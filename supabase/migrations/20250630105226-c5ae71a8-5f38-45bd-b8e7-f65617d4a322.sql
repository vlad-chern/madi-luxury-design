
-- Создаем enum для ролей
CREATE TYPE public.admin_role AS ENUM ('admin', 'content_manager', 'sales');

-- Добавляем колонку role в таблицу admins
ALTER TABLE public.admins ADD COLUMN role public.admin_role NOT NULL DEFAULT 'admin';

-- Обновляем существующего администратора, устанавливая роль admin
UPDATE public.admins SET role = 'admin' WHERE email = 'info@madiluxe.com';

-- Создаем функцию для проверки ролей администратора
CREATE OR REPLACE FUNCTION public.check_admin_role(_admin_id uuid, _required_role admin_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = _admin_id
      AND is_active = true
      AND (role = _required_role OR role = 'admin')
  )
$$;

-- Создаем политику для управления администраторами (только админы могут управлять другими админами)
CREATE POLICY "Only admins can manage admins" 
  ON public.admins 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.admin_sessions s 
      JOIN public.admins a ON s.admin_id = a.id 
      WHERE s.session_token = current_setting('request.headers')::json->>'authorization'
        AND a.role = 'admin'
        AND a.is_active = true
        AND s.expires_at > now()
    )
  );
