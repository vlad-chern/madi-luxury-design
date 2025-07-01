
-- Исправляем структуру базы данных
-- Добавляем недостающие поля для многоязычности в категории
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Добавляем недостающие поля для многоязычности в продукты
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS includes_en TEXT[],
ADD COLUMN IF NOT EXISTS specifications_en JSONB DEFAULT '{}';

-- Обновляем политики RLS для публичного доступа к данным
DROP POLICY IF EXISTS "Public can read categories" ON categories;
DROP POLICY IF EXISTS "Public can read active products" ON products;
DROP POLICY IF EXISTS "Public can create orders" ON orders;

-- Создаем новые политики для публичного доступа
CREATE POLICY "Enable read access for all users" ON categories
FOR SELECT USING (true);

CREATE POLICY "Enable read access for active products" ON products
FOR SELECT USING (is_active = true);

CREATE POLICY "Enable insert for orders" ON orders
FOR INSERT WITH CHECK (true);

-- Обновляем структуру заказов для лучшей интеграции
ALTER TABLE orders 
ALTER COLUMN status SET DEFAULT 'new';

-- Добавляем индексы для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Обновляем триггеры для обновления updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Исправляем типы данных для цен
ALTER TABLE products 
ALTER COLUMN price_from TYPE DECIMAL(10,2),
ALTER COLUMN price_fixed TYPE DECIMAL(10,2);

-- Обновляем ограничения для статуса заказов
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('new', 'processing', 'completed', 'cancelled'));

-- Обновляем ограничения для типа цены продуктов
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_price_type_check;

ALTER TABLE products 
ADD CONSTRAINT products_price_type_check 
CHECK (price_type IN ('from', 'fixed'));
