
-- Удаляем существующие политики для bucket product-images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Создаем новые политики для bucket product-images
CREATE POLICY "Anyone can view product images" ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images" ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images" ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images" ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'product-images');

-- Убеждаемся, что bucket публичный
UPDATE storage.buckets 
SET public = true 
WHERE id = 'product-images';
