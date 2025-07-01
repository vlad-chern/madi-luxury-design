
-- Создаем таблицу для SEO настроек
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Политика доступа - только для service_role (через edge функции)
CREATE POLICY "Service role can manage seo settings" 
  ON public.seo_settings 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Добавляем триггер для обновления updated_at
CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Вставляем начальные настройки
INSERT INTO public.seo_settings (setting_key, setting_value, is_active) VALUES 
('robots_txt', 'User-agent: *
Disallow: /admin
Allow: /

Sitemap: https://madiluxe.com/sitemap.xml', true),
('sitemap_auto_update', 'true', true);
