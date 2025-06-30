
-- Добавляем поле для изображения категории
ALTER TABLE categories ADD COLUMN image_url TEXT;

-- Обновляем существующие категории с изображениями по умолчанию
UPDATE categories SET image_url = '/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png' WHERE slug = 'cocinas';
UPDATE categories SET image_url = '/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png' WHERE slug = 'vestidores';
UPDATE categories SET image_url = '/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png' WHERE slug = 'armarios';

-- Создаем storage bucket для изображений (если не существует)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('madiluxe', 'madiluxe', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Создаем политики для bucket madiluxe
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'madiluxe');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'madiluxe' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'madiluxe' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'madiluxe' AND auth.role() = 'authenticated');
