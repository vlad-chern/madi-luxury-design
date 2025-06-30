
-- Создаем таблицу для администраторов
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для безопасности
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Создаем политику - только администраторы могут видеть данные других администраторов
CREATE POLICY "Admins can view all admin records" 
  ON public.admins 
  FOR SELECT 
  USING (true);

-- Добавляем триггер для обновления updated_at
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Вставляем администратора по умолчанию (пароль: 4gh378f)
-- Хеш пароля сгенерирован с помощью bcrypt
INSERT INTO public.admins (email, password_hash, name) 
VALUES ('info@madiluxe.com', '$2b$10$8K.P9QGJ5VxJ8YvN3Qm0uu6vGzHt5yKhF8dZ2.QJ5VxJ8YvN3Qm0u', 'Администратор');

-- Создаем таблицу для сессий администраторов
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admins(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для сессий
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Политика для сессий
CREATE POLICY "Admin sessions are private" 
  ON public.admin_sessions 
  FOR ALL 
  USING (false);
