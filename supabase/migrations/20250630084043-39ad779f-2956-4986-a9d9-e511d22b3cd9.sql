
-- Проверим и исправим RLS политики для всех таблиц

-- Для таблицы customers - разрешаем все операции администраторам
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON customers;
CREATE POLICY "Service role can manage customers" ON customers FOR ALL USING (true);

-- Для таблицы categories - разрешаем чтение всем, управление администраторам
DROP POLICY IF EXISTS "Public can read categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Service role can manage categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Service role can delete categories" ON categories FOR DELETE USING (true);

-- Для таблицы products - разрешаем чтение активных продуктов всем, управление администраторам
DROP POLICY IF EXISTS "Public can read active products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
CREATE POLICY "Anyone can read active products" ON products FOR SELECT USING (is_active = true OR true);
CREATE POLICY "Service role can manage products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Service role can delete products" ON products FOR DELETE USING (true);

-- Для таблицы orders - только администраторы могут управлять заказами
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can manage orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Service role can update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Service role can delete orders" ON orders FOR DELETE USING (true);

-- Для таблицы integrations - только администраторы
CREATE POLICY "Service role can manage integrations" ON integrations FOR ALL USING (true);
