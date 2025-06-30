
-- Очищаем существующие данные
DELETE FROM orders;
DELETE FROM products;
DELETE FROM customers;
DELETE FROM categories;

-- Добавляем правильные категории
INSERT INTO categories (name, slug, description) VALUES
('Cocinas', 'cocinas', 'Diseños funcionales y elegantes que transforman el corazón del hogar'),
('Vestidores', 'vestidores', 'Organización con estilo: espacios hechos a medida para tu día a día'),
('Armarios y Zonas de Entrada', 'armarios', 'Soluciones que combinan funcionalidad y diseño');

-- Добавляем товары группы Cocinas
INSERT INTO products (name, slug, description, price_type, price_from, category_id, images, includes, specifications, is_active) VALUES
('Geometría Gourmet', 'geometria-gourmet', 'Cocina de diseño geométrico con líneas puras y materiales premium que crean un espacio gourmet excepcional', 'from', 15000, 
(SELECT id FROM categories WHERE slug = 'cocinas'), 
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'], 
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Madera noble, mármol natural", "estilo": "Geométrico moderno", "incluye": "Electrodomésticos integrados"}', true),

('Cocina Serena', 'cocina-serena', 'Ambiente sereno y acogedor con tonos neutros y acabados naturales que transmiten calma y sofisticación', 'from', 12000,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Madera clara, piedra natural", "estilo": "Sereno minimalista", "incluye": "Iluminación integrada"}', true),

('Luz Natural', 'luz-natural', 'Maximiza la entrada de luz natural creando espacios luminosos y abiertos que conectan con el exterior', 'from', 14000,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Cristal, madera clara", "estilo": "Luminoso contemporáneo", "incluye": "Ventanas panorámicas"}', true),

('Sombra Suave', 'sombra-suave', 'Juego sutil de luces y sombras que crea ambientes íntimos y elegantes con calidez envolvente', 'from', 13000,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Madera oscura, acabados mate", "estilo": "Íntimo sofisticado", "incluye": "Iluminación ambiental"}', true),

('Blanco Esencial', 'blanco-esencial', 'Pureza del blanco en su máxima expresión, creando espacios luminosos y atemporales de elegancia absoluta', 'from', 11000,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Lacado blanco, cuarzo", "estilo": "Minimalista puro", "incluye": "Acabados sin tiradores"}', true),

('Esmeralda Urbana', 'esmeralda-urbana', 'Sofisticación urbana con toques de color esmeralda que aportan personalidad y distinción al espacio', 'from', 16000,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Lacado esmeralda, acero inoxidable", "estilo": "Urbano sofisticado", "incluye": "Electrodomésticos de gama alta"}', true),

('Aura Violeta', 'aura-violeta', 'Ambiente místico y elegante con sutiles toques violeta que crean una atmósfera única y sofisticada', 'from', 15500,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Lacado violeta, mármol", "estilo": "Místico elegante", "incluye": "Iluminación de acento"}', true),

('Rojo Burdeos', 'rojo-burdeos', 'Pasión y elegancia en tonos burdeos profundos que aportan carácter y sofisticación al hogar', 'from', 17000,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Lacado burdeos, madera noble", "estilo": "Clásico refinado", "incluye": "Detalles en oro"}', true),

('Neoclásico en Azul Celeste', 'neoclasico-azul-celeste', 'Elegancia neoclásica reinventada con toques de azul celeste que aportan frescura y distinción', 'from', 18000,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Lacado azul celeste, mármol Carrara", "estilo": "Neoclásico renovado", "incluye": "Molduras decorativas"}', true),

('Verde Oliva Noble', 'verde-oliva-noble', 'Nobleza natural con tonos verde oliva que conectan con la naturaleza y aportan serenidad al espacio', 'from', 16500,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Lacado verde oliva, madera reciclada", "estilo": "Natural noble", "incluye": "Elementos sostenibles"}', true),

('Elegancia Cálida', 'elegancia-calida', 'Calidez envolvente con materiales nobles que crean un ambiente acogedor y elegante para la familia', 'from', 14500,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Madera cálida, piedra natural", "estilo": "Cálido elegante", "incluye": "Chimenea integrada"}', true),

('Sakura Zen', 'sakura-zen', 'Inspiración japonesa con la delicadeza del sakura, creando espacios de paz y armonía perfecta', 'from', 19000,
(SELECT id FROM categories WHERE slug = 'cocinas'),
ARRAY['/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "6-8 semanas", "materiales": "Bambú, piedra zen", "estilo": "Zen japonés", "incluye": "Jardín interior"}', true);

-- Добавляем товары группы Vestidores
INSERT INTO products (name, slug, description, price_type, price_from, category_id, images, includes, specifications, is_active) VALUES
('Orden Natural', 'orden-natural', 'Vestidor que respeta la naturaleza de los materiales, creando orden y armonía en perfecto equilibrio', 'from', 8000,
(SELECT id FROM categories WHERE slug = 'vestidores'),
ARRAY['/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "4-6 semanas", "materiales": "Madera natural, mimbre", "estilo": "Natural orgánico", "incluye": "Cestas organizadoras"}', true),

('Estructura Abierta', 'estructura-abierta', 'Concepto abierto que maximiza el espacio y la funcionalidad con estructuras ligeras y elegantes', 'from', 7000,
(SELECT id FROM categories WHERE slug = 'vestidores'),
ARRAY['/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "4-6 semanas", "materiales": "Metal, vidrio templado", "estilo": "Moderno abierto", "incluye": "Iluminación LED"}', true),

('Aura Sofisticada', 'aura-sofisticada', 'Sofisticación absoluta con materiales nobles que crean un ambiente de lujo y distinción personal', 'from', 12000,
(SELECT id FROM categories WHERE slug = 'vestidores'),
ARRAY['/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "4-6 semanas", "materiales": "Nogal, cuero premium", "estilo": "Lujo sofisticado", "incluye": "Espejo panorámico"}', true),

('Elegancia Oculta', 'elegancia-oculta', 'Elegancia que se revela en los detalles ocultos, con soluciones inteligentes y acabados exquisitos', 'from', 10000,
(SELECT id FROM categories WHERE slug = 'vestidores'),
ARRAY['/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "4-6 semanas", "materiales": "Lacado mate, herrajes ocultos", "estilo": "Elegante discreto", "incluye": "Cajones con cierre suave"}', true),

('Seda & Madera', 'seda-madera', 'Combinación perfecta entre la suavidad de la seda y la nobleza de la madera en armonía absoluta', 'from', 11000,
(SELECT id FROM categories WHERE slug = 'vestidores'),
ARRAY['/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "4-6 semanas", "materiales": "Madera noble, acabados sedosos", "estilo": "Textural refinado", "incluye": "Forros de seda"}', true),

('Vanguardia Industrial', 'vanguardia-industrial', 'Estética industrial vanguardista con materiales crudos refinados que expresan personalidad urbana', 'from', 9000,
(SELECT id FROM categories WHERE slug = 'vestidores'),
ARRAY['/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "4-6 semanas", "materiales": "Acero, hormigón pulido", "estilo": "Industrial vanguardista", "incluye": "Tuberías vistas decorativas"}', true),

('Geometría Cálida', 'geometria-calida', 'Formas geométricas suavizadas con materiales cálidos que crean espacios acogedores y modernos', 'from', 8500,
(SELECT id FROM categories WHERE slug = 'vestidores'),
ARRAY['/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "4-6 semanas", "materiales": "Madera cálida, formas redondeadas", "estilo": "Geométrico acogedor", "incluye": "Módulos curvos"}', true),

('Esencia Urbana', 'esencia-urbana', 'Captura la esencia de la vida urbana contemporánea con diseños dinámicos y funcionales', 'from', 7500,
(SELECT id FROM categories WHERE slug = 'vestidores'),
ARRAY['/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "4-6 semanas", "materiales": "Laminados urbanos, metal", "estilo": "Urbano contemporáneo", "incluye": "Soluciones móviles"}', true);

-- Добавляем товары группы Armarios y Zonas de Entrada
INSERT INTO products (name, slug, description, price_type, price_from, category_id, images, includes, specifications, is_active) VALUES
('Esencia Natural', 'esencia-natural', 'Armario que captura la esencia más pura de la naturaleza con materiales orgánicos y diseño sostenible', 'from', 5000,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Madera certificada, acabados naturales", "estilo": "Natural sostenible", "incluye": "Tratamiento ecológico"}', true),

('Luz Interior', 'luz-interior', 'Iluminación interior inteligente que transforma el armario en un espacio luminoso y funcional', 'from', 6000,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Lacado blanco, LED integrado", "estilo": "Luminoso funcional", "incluye": "Sistema de iluminación automática"}', true),

('Geometría Perfecta', 'geometria-perfecta', 'Precisión geométrica absoluta con líneas perfectas que crean armonía visual y funcional', 'from', 7000,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Lacado geométrico, herrajes precisos", "estilo": "Geométrico perfecto", "incluye": "Medidas milimétricas"}', true),

('Línea Clara', 'linea-clara', 'Diseño de líneas claras y definidas que aportan orden y claridad visual al espacio', 'from', 4500,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Lacado lineal, perfiles definidos", "estilo": "Lineal claro", "incluye": "Acabados sin interrupciones"}', true),

('Aura Clásica', 'aura-clasica', 'Elegancia clásica atemporal que nunca pasa de moda, con detalles refinados y materiales nobles', 'from', 8000,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Madera noble, herrajes clásicos", "estilo": "Clásico atemporal", "incluye": "Molduras decorativas"}', true),

('Shibui', 'shibui', 'Filosofía japonesa del shibui: belleza sutil y discreta que revela su elegancia con el tiempo', 'from', 9000,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Bambú, acabados mate", "estilo": "Japonés shibui", "incluye": "Detalles ocultos"}', true),

('Minimal Puro', 'minimal-puro', 'Minimalismo en su expresión más pura: funcionalidad máxima con estética limpia y esencial', 'from', 4000,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Lacado mate, sin tiradores", "estilo": "Minimal esencial", "incluye": "Apertura por presión"}', true),

('Tacto Natural', 'tacto-natural', 'Texturas naturales que invitan al tacto, conectando con los sentidos y la naturaleza', 'from', 5500,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Madera texturizada, piedra", "estilo": "Textural natural", "incluye": "Acabados rugosos"}', true),

('Claro & Compacto', 'claro-compacto', 'Solución clara y compacta que maximiza el espacio con inteligencia y funcionalidad optimizada', 'from', 3500,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Laminados claros, herrajes compactos", "estilo": "Compacto eficiente", "incluye": "Organización inteligente"}', true),

('Línea Básica', 'linea-basica', 'Diseño básico pero elegante que cubre todas las necesidades esenciales con calidad garantizada', 'from', 3000,
(SELECT id FROM categories WHERE slug = 'armarios'),
ARRAY['/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'],
ARRAY['Diseño personalizado y asesoramiento profesional', 'Fabricación artesanal con materiales premium', 'Instalación completa por especialistas', 'Garantía integral de 5 años'],
'{"tiempo_entrega": "3-4 semanas", "materiales": "Melamina, herrajes básicos", "estilo": "Básico funcional", "incluye": "Configuración estándar"}', true);

-- Добавляем несколько примеров клиентов
INSERT INTO customers (name, email, phone, address, notes) VALUES
('María García López', 'maria@email.com', '+34 612 345 678', 'Calle Mayor 15, Madrid', 'Cliente interesada en cocinas modernas'),
('Carlos Fernández', 'carlos@empresa.com', '+34 678 456 789', 'Avenida de la Constitución 42, Barcelona', 'Necesita vestidor para vivienda nueva'),
('Ana Rodríguez', 'ana@email.com', '+34 645 789 123', 'Plaza del Sol 8, Valencia', 'Consulta sobre armarios compactos'),
('José Martínez', 'jose.martinez@gmail.com', '+34 695 123 456', 'Calle de la Paz 33, Sevilla', 'Interesado en diseño Sakura Zen');

-- Добавляем несколько примеров заказов
INSERT INTO orders (customer_name, customer_email, customer_phone, product_id, message, status) VALUES
('Lucía Santos', 'lucia.santos@hotmail.com', '+34 632 147 258',
(SELECT id FROM products WHERE slug = 'geometria-gourmet'),
'Me interesa esta cocina para mi nueva casa. ¿Podrían enviarme más información?', 'new'),
('Roberto Díaz', 'roberto@gmail.com', '+34 654 321 987',
(SELECT id FROM products WHERE slug = 'orden-natural'),
'Necesito un vestidor que maximice el espacio en mi dormitorio principal', 'processing'),
('Carmen López', 'carmen.lopez@email.com', '+34 698 765 432',
(SELECT id FROM products WHERE slug = 'minimal-puro'),
'¿Incluye la instalación? Mi dirección es Calle Real 25, Madrid', 'new');
