
-- Удаляем существующие данные
DELETE FROM products;
DELETE FROM categories;

-- Добавляем категории
INSERT INTO categories (id, name, description, slug) VALUES
(gen_random_uuid(), 'Vestidores', 'Vestidores de lujo personalizados', 'vestidores'),
(gen_random_uuid(), 'Cocinas', 'Cocinas de diseño exclusivo', 'cocinas'),
(gen_random_uuid(), 'Baños', 'Baños de lujo y elegancia', 'banos'),
(gen_random_uuid(), 'Salones', 'Muebles de salón premium', 'salones'),
(gen_random_uuid(), 'Dormitorios', 'Dormitorios de ensueño', 'dormitorios');

-- Obtener IDs de categorías para usar en productos
DO $$
DECLARE
    vestidores_id UUID;
    cocinas_id UUID;
    banos_id UUID;
    salones_id UUID;
    dormitorios_id UUID;
BEGIN
    SELECT id INTO vestidores_id FROM categories WHERE slug = 'vestidores';
    SELECT id INTO cocinas_id FROM categories WHERE slug = 'cocinas';
    SELECT id INTO banos_id FROM categories WHERE slug = 'banos';
    SELECT id INTO salones_id FROM categories WHERE slug = 'salones';
    SELECT id INTO dormitorios_id FROM categories WHERE slug = 'dormitorios';

    -- Добавляем продукты с данными из сайта
    INSERT INTO products (name, slug, description, price_type, price_from, category_id, images, includes, specifications, is_active) VALUES
    (
        'Vestidor Clásico Premium',
        'vestidor-clasico-premium',
        'Combinación luxuriosa de texturas sedosas y madera noble, creando un vestidor que es puro placer sensorial.',
        'from',
        2500,
        vestidores_id,
        ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop'],
        ARRAY[
            'Diseño personalizado y asesoramiento profesional',
            'Fabricación artesanal con materiales premium',
            'Instalación profesional completa',
            'Garantía de 5 años en estructura',
            'Garantía de 2 años en acabados'
        ],
        '{"Tiempo de entrega": "6-8 semanas", "Materiales": "Madera noble, mármol natural, herrajes premium", "Acabados": "Personalizables según preferencias", "Dimensiones": "Adaptables al espacio disponible"}'::jsonb,
        true
    ),
    (
        'Cocina Moderna Exclusiva',
        'cocina-moderna-exclusiva',
        'Diseño vanguardista que combina funcionalidad y estética, creando el corazón perfecto para tu hogar.',
        'from',
        5000,
        cocinas_id,
        ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop'],
        ARRAY[
            'Diseño 3D personalizado',
            'Electrodomésticos de alta gama incluidos',
            'Encimeras de materiales premium',
            'Instalación completa',
            'Garantía extendida'
        ],
        '{"Tiempo de entrega": "8-10 semanas", "Materiales": "Granito, acero inoxidable, madera noble", "Electrodomésticos": "Marca premium incluida", "Dimensiones": "Medidas exactas según espacio"}'::jsonb,
        true
    ),
    (
        'Baño Spa de Lujo',
        'bano-spa-lujo',
        'Transforma tu baño en un oasis de relajación con acabados de lujo y tecnología avanzada.',
        'from',
        3500,
        banos_id,
        ARRAY['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=800&fit=crop'],
        ARRAY[
            'Diseño personalizado completo',
            'Sanitarios de alta gama',
            'Sistema de hidromasaje',
            'Iluminación LED integrada',
            'Instalación profesional'
        ],
        '{"Tiempo de entrega": "5-7 semanas", "Materiales": "Mármol natural, cerámicas premium", "Tecnología": "Sistema hidromasaje incluido", "Garantía": "3 años en instalaciones"}'::jsonb,
        true
    ),
    (
        'Salón Contemporáneo',
        'salon-contemporaneo',
        'Mobiliario de salón que combina comfort y elegancia, diseñado para crear espacios únicos.',
        'from',
        4000,
        salones_id,
        ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop'],
        ARRAY[
            'Muebles a medida',
            'Tapicería premium',
            'Acabados personalizables',
            'Entrega e instalación',
            'Garantía de calidad'
        ],
        '{"Tiempo de entrega": "4-6 semanas", "Materiales": "Maderas nobles, tejidos premium", "Personalización": "Colores y acabados a elección", "Dimensiones": "Adaptado al espacio"}'::jsonb,
        true
    ),
    (
        'Dormitorio Principal Suite',
        'dormitorio-principal-suite',
        'El refugio perfecto para el descanso, con muebles elegantes y funcionales que crean una atmósfera única.',
        'from',
        3000,
        dormitorios_id,
        ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop'],
        ARRAY[
            'Cama y cabecero personalizados',
            'Armarios empotrados',
            'Mesitas de noche a juego',
            'Iluminación ambiental',
            'Instalación completa'
        ],
        '{"Tiempo de entrega": "6-8 semanas", "Materiales": "Madera maciza, herrajes de calidad", "Acabados": "Lacados y barnizados premium", "Garantía": "5 años en estructura"}'::jsonb,
        true
    );

    -- Добавляем тестовых клиентов
    INSERT INTO customers (name, email, phone, address, notes) VALUES
    ('María García', 'maria.garcia@email.com', '+34 600 123 456', 'Calle Mayor 123, Madrid', 'Cliente VIP - Vestidor premium'),
    ('Juan López', 'juan.lopez@email.com', '+34 600 789 012', 'Avenida Libertad 45, Barcelona', 'Interesado en cocina moderna'),
    ('Ana Martínez', 'ana.martinez@email.com', '+34 600 345 678', 'Plaza Central 67, Valencia', 'Consulta para baño completo');

END $$;
