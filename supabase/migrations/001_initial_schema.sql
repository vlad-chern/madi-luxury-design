
-- Создание таблицы категорий
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы продуктов
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_from DECIMAL(10,2),
  price_fixed DECIMAL(10,2),
  price_type TEXT DEFAULT 'from' CHECK (price_type IN ('from', 'fixed')),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  includes TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы заявок
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  product_id UUID REFERENCES products(id),
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание тестовой таблицы клиентов
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка начальных данных для категорий
INSERT INTO categories (name, description, slug) VALUES
('Cocinas', 'Современные кухни', 'cocinas'),
('Vestidores', 'Гардеробные комнаты', 'vestidores'),
('Armarios y Zonas de Entrada', 'Шкафы и прихожие', 'armarios');

-- Настройка RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Политики для публичного чтения
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);

-- Политики для аутентифицированных пользователей (админов)
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage customers" ON customers FOR ALL USING (auth.role() = 'authenticated');

-- Функции для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
