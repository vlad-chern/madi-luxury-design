
-- Добавляем поля для английских переводов в таблицу categories
ALTER TABLE public.categories 
ADD COLUMN name_en TEXT,
ADD COLUMN description_en TEXT;

-- Добавляем поля для английских переводов в таблицу products
ALTER TABLE public.products 
ADD COLUMN name_en TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN includes_en TEXT[],
ADD COLUMN specifications_en JSONB DEFAULT '{}'::jsonb;

-- Обновляем существующие записи, копируя испанские версии как заглушки для английских
UPDATE public.categories 
SET name_en = name, description_en = description 
WHERE name_en IS NULL;

UPDATE public.products 
SET name_en = name, description_en = description, includes_en = includes, specifications_en = specifications 
WHERE name_en IS NULL;
