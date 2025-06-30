
-- Populate categories
INSERT INTO categories (id, name, description, slug) VALUES
('b9f142cd-83f2-45cb-9b44-d1c10147e5f9', 'Cocinas', 'Diseños funcionales y elegantes que transforman el corazón del hogar', 'cocinas'),
('4cbd74e6-fc6b-472a-a6f9-226868efea05', 'Vestidores', 'Organización con estilo: espacios hechos a medida para tu día a día', 'vestidores'),
('ef8702d8-ea32-4940-b017-1d2d4aff937e', 'Armarios y Zonas de Entrada', 'Soluciones que combinan funcionalidad y diseño', 'armarios')
ON CONFLICT (id) DO NOTHING;

-- Populate products
INSERT INTO products (
  id, name, slug, description, price_from, price_type, category_id, 
  images, includes, specifications, is_active
) VALUES
(
  'prod-cocina-moderna-1',
  'Cocina Moderna Premium',
  'cocina-moderna-premium',
  'Combinación luxuriosa de texturas sedosas y madera noble, creando una cocina que es puro placer sensorial.',
  8000,
  'from',
  'b9f142cd-83f2-45cb-9b44-d1c10147e5f9',
  ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
  ARRAY[
    'Diseño personalizado y asesoramiento profesional',
    'Fabricación artesanal con materiales premium',
    'Instalación profesional completa',
    'Garantía de 5 años en estructura',
    'Garantía de 2 años en acabados'
  ],
  jsonb_build_object(
    'Tiempo de entrega', '6-8 semanas',
    'Materiales', 'Madera noble, mármol natural, herrajes premium',
    'Acabados', 'Personalizables según preferencias',
    'Dimensiones', 'Adaptables al espacio disponible'
  ),
  true
),
(
  'prod-vestidor-lujo-1',
  'Vestidor de Lujo Personalizado',
  'vestidor-lujo-personalizado',
  'Combinación luxuriosa de texturas sedosas y madera noble, creando un vestidor que es puro placer sensorial.',
  12000,
  'from',
  '4cbd74e6-fc6b-472a-a6f9-226868efea05',
  ARRAY['/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png'],
  ARRAY[
    'Diseño personalizado y asesoramiento profesional',
    'Fabricación artesanal con materiales premium',
    'Instalación profesional completa',
    'Garantía de 5 años en estructura',
    'Garantía de 2 años en acabados'
  ],
  jsonb_build_object(
    'Tiempo de entrega', '6-8 semanas',
    'Materiales', 'Madera noble, mármol natural, herrajes premium',
    'Acabados', 'Personalizables según preferencias',
    'Dimensiones', 'Adaptables al espacio disponible'
  ),
  true
),
(
  'prod-armario-entrada-1',
  'Armario de Entrada Premium',
  'armario-entrada-premium',
  'Solución elegante para zonas de entrada que combina funcionalidad y diseño sofisticado.',
  4500,
  'from',
  'ef8702d8-ea32-4940-b017-1d2d4aff937e',
  ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
  ARRAY[
    'Diseño personalizado y asesoramiento profesional',
    'Fabricación artesanal con materiales premium',
    'Instalación profesional completa',
    'Garantía de 3 años en estructura',
    'Garantía de 1 año en acabados'
  ],
  jsonb_build_object(
    'Tiempo de entrega', '4-6 semanas',
    'Materiales', 'Madera noble, herrajes premium',
    'Acabados', 'Personalizables según preferencias',
    'Dimensiones', 'Adaptables al espacio disponible'
  ),
  true
)
ON CONFLICT (id) DO NOTHING;

-- Add test customers
INSERT INTO customers (id, name, email, phone, address, notes) VALUES
('cust-test-1', 'Ana García', 'ana.garcia@email.com', '+34 600 123 456', 'Calle Mayor 123, Madrid', 'Cliente interesado en cocinas modernas'),
('cust-test-2', 'Carlos López', 'carlos.lopez@email.com', '+34 650 789 012', 'Avenida Central 45, Barcelona', 'Busca vestidor personalizado'),
('cust-test-3', 'María Rodríguez', 'maria.rodriguez@email.com', '+34 610 345 678', 'Plaza España 78, Valencia', 'Interesada en armarios de entrada')
ON CONFLICT (id) DO NOTHING;

-- Add integrations table for Telegram and Facebook
CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable all operations for authenticated users" ON integrations
    FOR ALL USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER integrations_updated_at
    BEFORE UPDATE ON integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default integration configs
INSERT INTO integrations (name, config, is_active) VALUES
('telegram', jsonb_build_object('bot_token', '', 'chat_id', ''), false),
('facebook_capi', jsonb_build_object('access_token', '', 'pixel_id', ''), false)
ON CONFLICT (name) DO NOTHING;
