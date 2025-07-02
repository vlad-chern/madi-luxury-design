
-- Создаем bucket для изображений товаров, если его еще нет
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('product-images', 'product-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Создаем политики для bucket product-images
CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload" ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update" ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete" ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'product-images');

-- Убеждаемся, что в таблице products колонка images правильно настроена
-- Она должна хранить массив путей к файлам в storage
ALTER TABLE products 
ALTER COLUMN images SET DEFAULT '{}';

-- Добавляем комментарий для ясности
COMMENT ON COLUMN products.images IS 'Array of file paths in product-images storage bucket';
