
-- Удаляем проблемную политику, которая вызывает бесконечную рекурсию
DROP POLICY IF EXISTS "Only admins can manage admins" ON public.admins;

-- Удаляем старую политику если она есть
DROP POLICY IF EXISTS "Admins can view all admin records" ON public.admins;

-- Создаем новую простую политику для просмотра записей администраторов
-- Позволяем всем аутентифицированным пользователям читать записи админов
-- (проверка прав будет происходить на уровне edge функций)
CREATE POLICY "Allow authenticated read access to admins" 
  ON public.admins 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Создаем политику для обновления записей администраторов
-- Только через edge функции с проверкой токена сессии
CREATE POLICY "Allow service role to manage admins" 
  ON public.admins 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Исправляем политику для admin_sessions
DROP POLICY IF EXISTS "Admin sessions are private" ON public.admin_sessions;

-- Новая политика для сессий - доступ только для service_role
CREATE POLICY "Service role can manage admin sessions" 
  ON public.admin_sessions 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);
