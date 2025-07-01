
-- Временно упрощаем RLS политики для products
-- Удаляем сложные политики которые могут вызывать рекурсию
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Service role full access to products" ON public.products;

-- Создаем простую политику - публичный доступ для чтения активных продуктов
CREATE POLICY "Public can read active products" 
  ON public.products 
  FOR SELECT 
  USING (is_active = true);

-- Разрешаем service_role полный доступ без сложных проверок
CREATE POLICY "Service role manages products" 
  ON public.products 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Упрощаем политики для admin_sessions - только service_role доступ
DROP POLICY IF EXISTS "Service role manages admin sessions" ON public.admin_sessions;

CREATE POLICY "Service role only admin sessions" 
  ON public.admin_sessions 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);
