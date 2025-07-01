
-- Удаляем все существующие политики для categories
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Service role manages categories" ON public.categories;
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;

-- Создаем простую политику для публичного чтения категорий
CREATE POLICY "Allow public read access to categories" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Разрешаем service_role полный доступ для админки
CREATE POLICY "Service role manages categories" 
  ON public.categories 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Удаляем все существующие политики для products
DROP POLICY IF EXISTS "Service role manages products" ON public.products;
DROP POLICY IF EXISTS "Allow public read active products" ON public.products;
DROP POLICY IF EXISTS "Public can read active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Service role full access to products" ON public.products;

-- Создаем простую политику для публичного чтения активных продуктов
CREATE POLICY "Allow public read active products" 
  ON public.products 
  FOR SELECT 
  USING (is_active = true);

-- Разрешаем service_role полный доступ
CREATE POLICY "Service role manages products" 
  ON public.products 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Удаляем все существующие политики для orders
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Service role manages orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.orders;

-- Разрешаем всем создавать заказы (для формы заявки)
CREATE POLICY "Anyone can create orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (true);

-- Разрешаем service_role полный доступ для админки
CREATE POLICY "Service role manages orders" 
  ON public.orders 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);
