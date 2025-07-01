
-- Удаляем проблемные политики, которые вызывают бесконечную рекурсию
DROP POLICY IF EXISTS "Only admins can manage admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can view all admin records" ON public.admins;
DROP POLICY IF EXISTS "Allow authenticated read access to admins" ON public.admins;

-- Создаем простые политики без рекурсии
-- Позволяем service_role полный доступ (для edge функций)
CREATE POLICY "Service role full access to admins" 
  ON public.admins 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Позволяем аутентифицированным пользователям читать записи админов
-- (проверка конкретных прав будет в edge функциях)
CREATE POLICY "Authenticated can read admins" 
  ON public.admins 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Исправляем политики для admin_sessions
DROP POLICY IF EXISTS "Admin sessions are private" ON public.admin_sessions;
DROP POLICY IF EXISTS "Service role can manage admin sessions" ON public.admin_sessions;

-- Создаем простую политику для сессий
CREATE POLICY "Service role manages admin sessions" 
  ON public.admin_sessions 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Исправляем политики для products (если есть проблемы)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

-- Создаем публичную политику для просмотра активных продуктов
CREATE POLICY "Anyone can view active products" 
  ON public.products 
  FOR SELECT 
  USING (is_active = true);

-- Позволяем service_role полный доступ к продуктам
CREATE POLICY "Service role full access to products" 
  ON public.products 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);
