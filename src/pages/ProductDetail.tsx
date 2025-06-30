import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Phone, Star } from 'lucide-react';
import { useState } from 'react';

interface Product {
  name: string;
  images: string[];
  mainImage: string;
  price: string;
  description: string;
  category: string;
}

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');

  // All products data
  const allProducts: Record<string, Product> = {
    // Cocinas
    'geometria-gourmet': {
      name: "GEOMETRÍA GOURMET",
      images: [
        "/lovable-uploads/cde9e21e-3376-46aa-b353-c54f19e162d2.png",
        "/lovable-uploads/65ef1dab-4ca5-4dd6-8188-1774fef552af.png",
        "/lovable-uploads/5a5e6255-c31b-4ad1-9fb7-7ab200ef3add.png",
        "/lovable-uploads/704e9a1d-8893-4965-a3ee-7197dac0910e.png"
      ],
      mainImage: "/lovable-uploads/cde9e21e-3376-46aa-b353-c54f19e162d2.png",
      price: "€32,500",
      description: "Diseño arquitectónico con geometrías perfectas, acabados en madera natural y superficies de mármol. Un espacio donde la funcionalidad se encuentra con la alta estética. Cada línea ha sido pensada para crear armonía visual y funcional.",
      category: "Cocinas"
    },
    'cocina-serena': {
      name: "COCINA SERENA",
      images: [
        "/lovable-uploads/eae42cfb-24a6-4bed-a436-2a39af167c3b.png",
        "/lovable-uploads/079503db-bf20-40bb-ae5c-5105bbc7cbb7.png",
        "/lovable-uploads/c5d63d67-7df7-4063-8bd2-06c80335b476.png",
        "/lovable-uploads/506eb196-24c7-48ab-aba0-571500fc0ffe.png",
        "/lovable-uploads/69943934-a89f-4d8b-bff8-aad38a2dba86.png"
      ],
      mainImage: "/lovable-uploads/079503db-bf20-40bb-ae5c-5105bbc7cbb7.png",
      price: "€28,900",
      description: "Espacio sereno con acabados en tonos neutros, líneas limpias y materiales naturales que crean un ambiente de tranquilidad y sofisticación. Perfecta para quienes buscan paz en su hogar.",
      category: "Cocinas"
    },
    'luz-natural': {
      name: "LUZ NATURAL",
      images: ["/lovable-uploads/b286a941-43ea-4e43-a5fa-532d8bc45c16.png"],
      mainImage: "/lovable-uploads/b286a941-43ea-4e43-a5fa-532d8bc45c16.png",
      price: "€15,500",
      description: "Cocina minimalista que maximiza la entrada de luz natural, con acabados claros y superficies reflectantes que amplían visualmente el espacio. Diseñada para crear sensación de amplitud.",
      category: "Cocinas"
    },
    'sombra-suave': {
      name: "SOMBRA SUAVE",
      images: ["/lovable-uploads/c92ac2f2-9a51-4468-a91f-0d274e5bff8d.png"],
      mainImage: "/lovable-uploads/c92ac2f2-9a51-4468-a91f-0d274e5bff8d.png",
      price: "€18,200",
      description: "Diseño integrado con iluminación suave y cálida, creando espacios de transición perfectos entre cocina y comedor.",
      category: "Cocinas"
    },
    'blanco-esencial': {
      name: "BLANCO ESENCIAL",
      images: ["/lovable-uploads/f4fed17d-01a8-4295-b2d1-256971d9b7b7.png"],
      mainImage: "/lovable-uploads/f4fed17d-01a8-4295-b2d1-256971d9b7b7.png",
      price: "€12,800",
      description: "Pureza en el diseño con acabados blancos esenciales, optimizando cada centímetro para crear un espacio funcional y elegante.",
      category: "Cocinas"
    },
    'esmeralda-urbana': {
      name: "ESMERALDA URBANA",
      images: ["/lovable-uploads/a13b3fbd-254d-4647-876b-e2ce58849448.png"],
      mainImage: "/lovable-uploads/a13b3fbd-254d-4647-876b-e2ce58849448.png",
      price: "€14,300",
      description: "Toque urbano sofisticado con acentos en tonos esmeralda, combinando modernidad y calidez en espacios compactos.",
      category: "Cocinas"
    },
    'aura-violeta': {
      name: "AURA VIOLETA",
      images: ["/lovable-uploads/38b171b9-871d-4140-8816-8b9e700c233b.png"],
      mainImage: "/lovable-uploads/38b171b9-871d-4140-8816-8b9e700c233b.png",
      price: "€22,500",
      description: "Diseño vanguardista con detalles en tonos violeta, isla central y elementos de vidrio que crean un ambiente único y sofisticado.",
      category: "Cocinas"
    },
    'rojo-burdeos': {
      name: "ROJO BURDEOS",
      images: ["/lovable-uploads/6e14d5d0-d09a-4e5d-a225-e54a28555895.png"],
      mainImage: "/lovable-uploads/6e14d5d0-d09a-4e5d-a225-e54a28555895.png",
      price: "€28,900",
      description: "Elegancia mediterránea con acentos en rojo burdeos, isla de madera acanalada que aporta calidez y distinción al espacio.",
      category: "Cocinas"
    },
    'neoclasico-azul-celeste': {
      name: "NEOCLÁSICO EN AZUL CELESTE",
      images: ["/lovable-uploads/7d38a2be-0cc8-4fe8-90be-14b44b24647d.png"],
      mainImage: "/lovable-uploads/7d38a2be-0cc8-4fe8-90be-14b44b24647d.png",
      price: "€35,400",
      description: "Concepto neoclásico con toques en azul celeste, integrando cocina y estar con vistas panorámicas y materiales nobles.",
      category: "Cocinas"
    },
    'verde-oliva-noble': {
      name: "VERDE OLIVA NOBLE",
      images: ["/lovable-uploads/6ba7f911-4eaf-4fe8-9eea-3244342324ba.png"],
      mainImage: "/lovable-uploads/6ba7f911-4eaf-4fe8-9eea-3244342324ba.png",
      price: "€41,200",
      description: "Lujo mediterráneo con acentos en verde oliva, estanterías iluminadas y acabados premium para exhibir piezas especiales.",
      category: "Cocinas"
    },
    'elegancia-calida': {
      name: "ELEGANCIA CÁLIDA",
      images: ["/lovable-uploads/52ae2dc4-ff95-4995-95ee-3920d5a663ac.png"],
      mainImage: "/lovable-uploads/52ae2dc4-ff95-4995-95ee-3920d5a663ac.png",
      price: "€25,600",
      description: "Diseño artístico con tonos cálidos, iluminación escultural y acabados en mármol veteado que crean un ambiente acogedor.",
      category: "Cocinas"
    },
    'sakura-zen': {
      name: "SAKURA ZEN",
      images: ["/lovable-uploads/83f9b699-0e6f-4376-ae1b-c42698cbfa9d.png"],
      mainImage: "/lovable-uploads/83f9b699-0e6f-4376-ae1b-c42698cbfa9d.png",
      price: "€31,800",
      description: "Filosofía zen con inspiración japonesa, superficies que reflejan la luz natural como los pétalos de sakura al amanecer.",
      category: "Cocinas"
    },
    // Vestidores
    'orden-natural': {
      name: "ORDEN NATURAL",
      images: ["/lovable-uploads/914ee2d0-75d6-425d-b8f3-a9f4f22e7698.png"],
      mainImage: "/lovable-uploads/914ee2d0-75d6-425d-b8f3-a9f4f22e7698.png",
      price: "€12,800",
      description: "Vestidor con acabados en madera natural, espejo iluminado y organización intuitiva que respeta el orden natural de las cosas. Un espacio personal de lujo y organización.",
      category: "Vestidores"
    },
    'estructura-abierta': {
      name: "ESTRUCTURA ABIERTA",
      images: ["/lovable-uploads/b32560c8-0021-4e69-a470-11a9cd52c337.png"],
      mainImage: "/lovable-uploads/b32560c8-0021-4e69-a470-11a9cd52c337.png",
      price: "€15,200",
      description: "Diseño de estructura abierta con paneles modulares, zona de tocador integrada y máxima flexibilidad de organización. Elegancia funcional redefinida.",
      category: "Vestidores"
    },
    'aura-sofisticada': {
      name: "AURA SOFISTICADA",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€18,500",
      description: "Vestidor sofisticado con iluminación ambiente, acabados premium y detalles que crean un aura de elegancia absoluta.",
      category: "Vestidores"
    },
    'elegancia-oculta': {
      name: "ELEGANCIA OCULTA",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€16,800",
      description: "Diseño que oculta la complejidad tras líneas simples, revelando su elegancia en cada detalle funcional.",
      category: "Vestidores"
    },
    'seda-madera': {
      name: "SEDA & MADERA",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€21,300",
      description: "Combinación luxuriosa de texturas sedosas y madera noble, creando un vestidor que es puro placer sensorial.",
      category: "Vestidores"
    },
    'vanguardia-industrial': {
      name: "VANGUARDIA INDUSTRIAL",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€19,600",
      description: "Estilo industrial vanguardista con elementos metálicos y madera cruda, perfecto para personalidades urbanas.",
      category: "Vestidores"
    },
    'geometria-calida': {
      name: "GEOMETRÍA CÁLIDA",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€17,900",
      description: "Formas geométricas precisas suavizadas por acabados cálidos, equilibrio perfecto entre rigor y confort.",
      category: "Vestidores"
    },
    'esencia-urbana': {
      name: "ESENCIA URBANA",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€14,700",
      description: "Captura la esencia de la vida urbana moderna con líneas limpias, materiales contemporáneos y funcionalidad absoluta.",
      category: "Vestidores"
    },
    // Armarios y Zonas de Entrada
    'esencia-natural': {
      name: "ESENCIA NATURAL",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€8,500",
      description: "Armario que captura la esencia natural con maderas seleccionadas y acabados que respetan la belleza original del material.",
      category: "Armarios y Vestidores"
    },
    'luz-interior': {
      name: "LUZ INTERIOR",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€6,800",
      description: "Sistema de iluminación interior integrado que revela y realza cada elemento almacenado, creando un efecto luminoso único.",
      category: "Armarios y Vestidores"
    },
    'geometria-perfecta': {
      name: "GEOMETRÍA PERFECTA",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€5,200",
      description: "Precisión geométrica absoluta en cada línea, creando un armario que es una obra de arte funcional y minimalista.",
      category: "Armarios y Vestidores"
    },
    'linea-clara': {
      name: "LÍNEA CLARA",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€9,200",
      description: "Líneas claras y definidas que combinan vidrio templado y madera, permitiendo exhibir piezas especiales con elegancia.",
      category: "Armarios y Vestidores"
    },
    'aura-clasica': {
      name: "AURA CLÁSICA",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€7,600",
      description: "Diseño clásico reinterpretado para entradas modernas, con elementos que crean una primera impresión memorable.",
      category: "Armarios y Vestidores"
    },
    'shibui': {
      name: "SHIBUI",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€11,400",
      description: "Filosofía japonesa Shibui aplicada al diseño: belleza sutil, discreta y profundamente elegante en cada detalle.",
      category: "Armarios y Vestidores"
    },
    'minimal-puro': {
      name: "MINIMAL PURO",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€4,800",
      description: "Minimalismo en su expresión más pura, donde cada elemento tiene su razón de ser y nada sobra.",
      category: "Armarios y Vestidores"
    },
    'tacto-natural': {
      name: "TACTO NATURAL",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€6,200",
      description: "Superficies con texturas naturales que invitan al tacto, creando una conexión sensorial única con el mobiliario.",
      category: "Armarios y Vestidores"
    },
    'claro-compacto': {
      name: "CLARO & COMPACTO",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€5,800",
      description: "Solución compacta con acabados claros que maximiza el almacenamiento sin comprometer la estética del espacio.",
      category: "Armarios y Vestidores"
    },
    'linea-basica': {
      name: "LÍNEA BÁSICA",
      images: ["photo-1586023492125-27b2c045efd7"],
      mainImage: "photo-1586023492125-27b2c045efd7",
      price: "€3,900",
      description: "Diseño básico pero refinado, perfecto para quienes valoran la funcionalidad sin renunciar al buen diseño.",
      category: "Armarios y Vestidores"
    }
  };

  const product = productId ? allProducts[productId] : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Button onClick={() => navigate('/')} className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const handleQuickOrder = () => {
    if (phoneNumber.trim()) {
      alert(`Pedido rápido enviado para ${product.name} al número ${phoneNumber}. Nos contactaremos con usted pronto.`);
      setPhoneNumber('');
    } else {
      alert('Por favor, introduzca su número de teléfono');
    }
  };

  const handleConsultation = () => {
    alert(`Solicitud de consulta para ${product.name} enviada. Nos pondremos en contacto con usted pronto.`);
  };

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[rgb(14,14,14)]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)]/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <div className="text-2xl font-bold text-[rgb(180,165,142)]">MADI</div>
          </div>
          <Button 
            onClick={handleConsultation}
            className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
          >
            Solicitar Consulta
          </Button>
        </div>
      </nav>

      <div className="pt-20">
        {/* Product Header */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="text-sm text-[rgb(180,165,142)] mb-4">{product.category}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{product.name}</h1>
            <div className="text-3xl font-bold text-[rgb(180,165,142)] mb-8">desde {product.price}</div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="space-y-6">
                <div 
                  className="aspect-square bg-cover bg-center rounded-lg"
                  style={{
                    backgroundImage: `url('${product.mainImage}')`
                  }}
                />
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[rgb(180,165,142)] text-[rgb(180,165,142)]" />
                  ))}
                  <span className="text-gray-400 ml-2">(5.0) - Calidad Premium</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-[rgb(180,165,142)]">Descripción</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Incluye</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Diseño personalizado y asesoramiento profesional</li>
                    <li>• Fabricación artesanal con materiales premium</li>
                    <li>• Instalación profesional completa</li>
                    <li>• Garantía de 5 años en estructura</li>
                    <li>• Garantía de 2 años en acabados</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Especificaciones</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Tiempo de entrega: 6-8 semanas</li>
                    <li>• Materiales: Madera noble, mármol natural, herrajes premium</li>
                    <li>• Acabados: Personalizables según preferencias</li>
                    <li>• Dimensiones: Adaptables al espacio disponible</li>
                  </ul>
                </div>

                {/* Quick Order */}
                <div className="bg-[rgb(22,22,22)] p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Pedido Rápido</h3>
                  <p className="text-gray-300 mb-4">Introduzca su número de teléfono para un contacto inmediato</p>
                  <div className="flex gap-3">
                    <Input 
                      type="tel"
                      placeholder="Su número de teléfono"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-transparent border-gray-600 text-white placeholder-gray-400 flex-1"
                    />
                    <Button 
                      onClick={handleQuickOrder}
                      className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-6"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Llamar
                    </Button>
                  </div>
                </div>

                {/* Main CTA */}
                <Button 
                  size="lg"
                  onClick={handleConsultation}
                  className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] py-4 text-lg"
                >
                  Solicitar Consulta Detallada
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose MADI */}
        <section className="py-24 bg-[rgb(18,18,18)]">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">
              ¿Por qué elegir <span className="text-[rgb(180,165,142)]">MADI?</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-[rgb(14,14,14)]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Calidad Excepcional</h3>
                <p className="text-gray-300">Materiales premium y acabados artesanales que perduran en el tiempo.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-[rgb(14,14,14)]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Diseño Personalizado</h3>
                <p className="text-gray-300">Cada pieza se adapta perfectamente a su espacio y estilo de vida.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-[rgb(14,14,14)]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Servicio Integral</h3>
                <p className="text-gray-300">Desde el diseño hasta la instalación, cuidamos cada detalle.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
