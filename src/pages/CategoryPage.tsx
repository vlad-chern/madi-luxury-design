
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('name-asc');

  // All product data organized by category
  const categoryData = {
    cocinas: {
      title: "Cocinas",
      description: "Diseños funcionales y elegantes que transforman el corazón del hogar.",
      products: [
        {
          id: "geometria-gourmet",
          name: "GEOMETRÍA GOURMET",
          images: [
            "/lovable-uploads/cde9e21e-3376-46aa-b353-c54f19e162d2.png",
            "/lovable-uploads/65ef1dab-4ca5-4dd6-8188-1774fef552af.png",
            "/lovable-uploads/5a5e6255-c31b-4ad1-9fb7-7ab200ef3add.png",
            "/lovable-uploads/704e9a1d-8893-4965-a3ee-7197dac0910e.png"
          ],
          mainImage: "/lovable-uploads/cde9e21e-3376-46aa-b353-c54f19e162d2.png",
          price: "desde €32,500",
          priceValue: 32500,
          description: "Diseño arquitectónico con geometrías perfectas, acabados en madera natural y superficies de mármol. Un espacio donde la funcionalidad se encuentra con la alta estética."
        },
        {
          id: "cocina-serena",
          name: "COCINA SERENA",
          images: [
            "/lovable-uploads/eae42cfb-24a6-4bed-a436-2a39af167c3b.png",
            "/lovable-uploads/079503db-bf20-40bb-ae5c-5105bbc7cbb7.png",
            "/lovable-uploads/c5d63d67-7df7-4063-8bd2-06c80335b476.png",
            "/lovable-uploads/506eb196-24c7-48ab-aba0-571500fc0ffe.png",
            "/lovable-uploads/69943934-a89f-4d8b-bff8-aad38a2dba86.png"
          ],
          mainImage: "/lovable-uploads/079503db-bf20-40bb-ae5c-5105bbc7cbb7.png",
          price: "desde €28,900",
          priceValue: 28900,
          description: "Espacio sereno con acabados en tonos neutros, líneas limpias y materiales naturales que crean un ambiente de tranquilidad y sofisticación."
        },
        {
          id: "luz-natural",
          name: "LUZ NATURAL",
          images: ["/lovable-uploads/b286a941-43ea-4e43-a5fa-532d8bc45c16.png"],
          mainImage: "/lovable-uploads/b286a941-43ea-4e43-a5fa-532d8bc45c16.png",
          price: "desde €15,500",
          priceValue: 15500,
          description: "Cocina minimalista que maximiza la entrada de luz natural, con acabados claros y superficies reflectantes que amplían visualmente el espacio."
        },
        {
          id: "sombra-suave",
          name: "SOMBRA SUAVE",
          images: ["/lovable-uploads/c92ac2f2-9a51-4468-a91f-0d274e5bff8d.png"],
          mainImage: "/lovable-uploads/c92ac2f2-9a51-4468-a91f-0d274e5bff8d.png",
          price: "desde €18,200",
          priceValue: 18200,
          description: "Diseño integrado con iluminación suave y cálida, creando espacios de transición perfectos entre cocina y comedor."
        },
        {
          id: "blanco-esencial",
          name: "BLANCO ESENCIAL",
          images: ["/lovable-uploads/f4fed17d-01a8-4295-b2d1-256971d9b7b7.png"],
          mainImage: "/lovable-uploads/f4fed17d-01a8-4295-b2d1-256971d9b7b7.png",
          price: "desde €12,800",
          priceValue: 12800,
          description: "Pureza en el diseño con acabados blancos esenciales, optimizando cada centímetro para crear un espacio funcional y elegante."
        },
        {
          id: "esmeralda-urbana",
          name: "ESMERALDA URBANA",
          images: ["/lovable-uploads/a13b3fbd-254d-4647-876b-e2ce58849448.png"],
          mainImage: "/lovable-uploads/a13b3fbd-254d-4647-876b-e2ce58849448.png",
          price: "desde €14,300",
          priceValue: 14300,
          description: "Toque urbano sofisticado con acentos en tonos esmeralda, combinando modernidad y calidez en espacios compactos."
        },
        {
          id: "aura-violeta",
          name: "AURA VIOLETA",
          images: ["/lovable-uploads/38b171b9-871d-4140-8816-8b9e700c233b.png"],
          mainImage: "/lovable-uploads/38b171b9-871d-4140-8816-8b9e700c233b.png",
          price: "desde €22,500",
          priceValue: 22500,
          description: "Diseño vanguardista con detalles en tonos violeta, isla central y elementos de vidrio que crean un ambiente único y sofisticado."
        },
        {
          id: "rojo-burdeos",
          name: "ROJO BURDEOS",
          images: ["/lovable-uploads/6e14d5d0-d09a-4e5d-a225-e54a28555895.png"],
          mainImage: "/lovable-uploads/6e14d5d0-d09a-4e5d-a225-e54a28555895.png",
          price: "desde €28,900",
          priceValue: 28900,
          description: "Elegancia mediterránea con acentos en rojo burdeos, isla de madera acanalada que aporta calidez y distinción al espacio."
        },
        {
          id: "neoclasico-azul-celeste",
          name: "NEOCLÁSICO EN AZUL CELESTE",
          images: ["/lovable-uploads/7d38a2be-0cc8-4fe8-90be-14b44b24647d.png"],
          mainImage: "/lovable-uploads/7d38a2be-0cc8-4fe8-90be-14b44b24647d.png",
          price: "desde €35,400",
          priceValue: 35400,
          description: "Concepto neoclásico con toques en azul celeste, integrando cocina y estar con vistas panorámicas y materiales nobles."
        },
        {
          id: "verde-oliva-noble",
          name: "VERDE OLIVA NOBLE",
          images: ["/lovable-uploads/6ba7f911-4eaf-4fe8-9eea-3244342324ba.png"],
          mainImage: "/lovable-uploads/6ba7f911-4eaf-4fe8-9eea-3244342324ba.png",
          price: "desde €41,200",
          priceValue: 41200,
          description: "Lujo mediterráneo con acentos en verde oliva, estanterías iluminadas y acabados premium para exhibir piezas especiales."
        },
        {
          id: "elegancia-calida",
          name: "ELEGANCIA CÁLIDA",
          images: ["/lovable-uploads/52ae2dc4-ff95-4995-95ee-3920d5a663ac.png"],
          mainImage: "/lovable-uploads/52ae2dc4-ff95-4995-95ee-3920d5a663ac.png",
          price: "desde €25,600",
          priceValue: 25600,
          description: "Diseño artístico con tonos cálidos, iluminación escultural y acabados en mármol veteado que crean un ambiente acogedor."
        },
        {
          id: "sakura-zen",
          name: "SAKURA ZEN",
          images: ["/lovable-uploads/83f9b699-0e6f-4376-ae1b-c42698cbfa9d.png"],
          mainImage: "/lovable-uploads/83f9b699-0e6f-4376-ae1b-c42698cbfa9d.png",
          price: "desde €31,800",
          priceValue: 31800,
          description: "Filosofía zen con inspiración japonesa, superficies que reflejan la luz natural como los pétalos de sakura al amanecer."
        }
      ]
    },
    vestidores: {
      title: "Vestidores",
      description: "Organización con estilo: espacios hechos a medida para tu día a día.",
      products: [
        {
          id: "orden-natural",
          name: "ORDEN NATURAL",
          images: ["/lovable-uploads/914ee2d0-75d6-425d-b8f3-a9f4f22e7698.png"],
          mainImage: "/lovable-uploads/914ee2d0-75d6-425d-b8f3-a9f4f22e7698.png",
          price: "desde €12,800",
          priceValue: 12800,
          description: "Vestidor con acabados en madera natural, espejo iluminado y organización intuitiva que respeta el orden natural de las cosas."
        },
        {
          id: "estructura-abierta",
          name: "ESTRUCTURA ABIERTA",
          images: ["/lovable-uploads/b32560c8-0021-4e69-a470-11a9cd52c337.png"],
          mainImage: "/lovable-uploads/b32560c8-0021-4e69-a470-11a9cd52c337.png",
          price: "desde €15,200",
          priceValue: 15200,
          description: "Diseño de estructura abierta con paneles modulares, zona de tocador integrada y máxima flexibilidad de organización."
        },
        {
          id: "aura-sofisticada",
          name: "AURA SOFISTICADA",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €18,500",
          priceValue: 18500,
          description: "Vestidor sofisticado con iluminación ambiente, acabados premium y detalles que crean un aura de elegancia absoluta."
        },
        {
          id: "elegancia-oculta",
          name: "ELEGANCIA OCULTA",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €16,800",
          priceValue: 16800,
          description: "Diseño que oculta la complejidad tras líneas simples, revelando su elegancia en cada detalle funcional."
        },
        {
          id: "seda-madera",
          name: "SEDA & MADERA",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €21,300",
          priceValue: 21300,
          description: "Combinación luxuriosa de texturas sedosas y madera noble, creando un vestidor que es puro placer sensorial."
        },
        {
          id: "vanguardia-industrial",
          name: "VANGUARDIA INDUSTRIAL",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €19,600",
          priceValue: 19600,
          description: "Estilo industrial vanguardista con elementos metálicos y madera cruda, perfecto para personalidades urbanas."
        },
        {
          id: "geometria-calida",
          name: "GEOMETRÍA CÁLIDA",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €17,900",
          priceValue: 17900,
          description: "Formas geométricas precisas suavizadas por acabados cálidos, equilibrio perfecto entre rigor y confort."
        },
        {
          id: "esencia-urbana",
          name: "ESENCIA URBANA",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €14,700",
          priceValue: 14700,
          description: "Captura la esencia de la vida urbana moderna con líneas limpias, materiales contemporáneos y funcionalidad absoluta."
        }
      ]
    },
    armarios: {
      title: "Armarios y Zonas de Entrada",
      description: "Soluciones que combinan funcionalidad y diseño.",
      products: [
        {
          id: "esencia-natural",
          name: "ESENCIA NATURAL",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €8,500",
          priceValue: 8500,
          description: "Armario que captura la esencia natural con maderas seleccionadas y acabados que respetan la belleza original del material."
        },
        {
          id: "luz-interior",
          name: "LUZ INTERIOR",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €6,800",
          priceValue: 6800,
          description: "Sistema de iluminación interior integrado que revela y realza cada elemento almacenado, creando un efecto luminoso único."
        },
        {
          id: "geometria-perfecta",
          name: "GEOMETRÍA PERFECTA",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €5,200",
          priceValue: 5200,
          description: "Precisión geométrica absoluta en cada línea, creando un armario que es una obra de arte funcional y minimalista."
        },
        {
          id: "linea-clara",
          name: "LÍNEA CLARA",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €9,200",
          priceValue: 9200,
          description: "Líneas claras y definidas que combinan vidrio templado y madera, permitiendo exhibir piezas especiales con elegancia."
        },
        {
          id: "aura-clasica",
          name: "AURA CLÁSICA",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €7,600",
          priceValue: 7600,
          description: "Diseño clásico reinterpretado para entradas modernas, con elementos que crean una primera impresión memorable."
        },
        {
          id: "shibui",
          name: "SHIBUI",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €11,400",
          priceValue: 11400,
          description: "Filosofía japonesa Shibui aplicada al diseño: belleza sutil, discreta y profundamente elegante en cada detalle."
        },
        {
          id: "minimal-puro",
          name: "MINIMAL PURO",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €4,800",
          priceValue: 4800,
          description: "Minimalismo en su expresión más pura, donde cada elemento tiene su razón de ser y nada sobra."
        },
        {
          id: "tacto-natural",
          name: "TACTO NATURAL",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €6,200",
          priceValue: 6200,
          description: "Superficies con texturas naturales que invitan al tacto, creando una conexión sensorial única con el mobiliario."
        },
        {
          id: "claro-compacto",
          name: "CLARO & COMPACTO",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €5,800",
          priceValue: 5800,
          description: "Solución compacta con acabados claros que maximiza el almacenamiento sin comprometer la estética del espacio."
        },
        {
          id: "linea-basica",
          name: "LÍNEA BÁSICA",
          images: ["photo-1586023492125-27b2c045efd7"],
          mainImage: "photo-1586023492125-27b2c045efd7",
          price: "desde €3,900",
          priceValue: 3900,
          description: "Diseño básico pero refinado, perfecto para quienes valoran la funcionalidad sin renunciar al buen diseño."
        }
      ]
    }
  };

  const currentCategory = categoryData[category as keyof typeof categoryData];

  const sortedProducts = useMemo(() => {
    if (!currentCategory) return [];
    
    const products = [...currentCategory.products];
    
    switch (sortBy) {
      case 'name-asc':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return products.sort((a, b) => a.priceValue - b.priceValue);
      case 'price-desc':
        return products.sort((a, b) => b.priceValue - a.priceValue);
      default:
        return products;
    }
  }, [currentCategory, sortBy]);

  if (!currentCategory) {
    return <div>Categoría no encontrada</div>;
  }

  const handleOrderClick = (itemName: string, price: string) => {
    alert(`Solicitud de consulta para ${itemName} - ${price}. Nos pondremos en contacto con usted pronto.`);
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const ProductCard = ({ product }: { product: any }) => (
    <div className="bg-[rgb(22,22,22)] rounded-lg overflow-hidden">
      <div 
        className="h-64 bg-cover bg-center"
        style={{
          backgroundImage: `url('${product.mainImage.includes('/lovable-uploads/') ? product.mainImage : `https://images.unsplash.com/${product.mainImage}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}')`
        }}
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-xl font-bold text-[rgb(180,165,142)]">{product.name}</h4>
          <span className="text-2xl font-bold text-[rgb(180,165,142)]">{product.price}</span>
        </div>
        <p className="text-gray-300 mb-4 line-clamp-3">{product.description}</p>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)]"
            onClick={() => handleViewDetails(product.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Button>
          <Button 
            className="flex-1 bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
            onClick={() => handleOrderClick(product.name, product.price)}
          >
            Solicitar Consulta
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[rgb(14,14,14)]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-[rgb(180,165,142)]">MADI</div>
          <Button 
            variant="outline"
            className="border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)]"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </nav>

      {/* Category Header */}
      <section className="pt-32 pb-16 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            <span className="text-[rgb(180,165,142)]">{currentCategory.title}</span>
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
            {currentCategory.description}
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-[rgb(18,18,18)] border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[rgb(180,165,142)]" />
              <span className="text-[rgb(180,165,142)] font-semibold">Filtros:</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">Ordenar por:</span>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] bg-[rgb(22,22,22)] border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[rgb(22,22,22)] border-gray-600">
                  <SelectItem value="name-asc" className="text-white hover:bg-[rgb(32,32,32)]">
                    <div className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4" />
                      Nombre A-Z
                    </div>
                  </SelectItem>
                  <SelectItem value="name-desc" className="text-white hover:bg-[rgb(32,32,32)]">
                    <div className="flex items-center gap-2">
                      <SortDesc className="w-4 h-4" />
                      Nombre Z-A
                    </div>
                  </SelectItem>
                  <SelectItem value="price-asc" className="text-white hover:bg-[rgb(32,32,32)]">
                    <div className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4" />
                      Precio: Menor a Mayor
                    </div>
                  </SelectItem>
                  <SelectItem value="price-desc" className="text-white hover:bg-[rgb(32,32,32)]">
                    <div className="flex items-center gap-2">
                      <SortDesc className="w-4 h-4" />
                      Precio: Mayor a Menor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-400">
              {sortedProducts.length} productos encontrados
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-[rgb(180,165,142)] mb-4">MADI</div>
              <p className="text-gray-400 leading-relaxed">
                Mobiliario de autor diseñado para contar su historia. 
                Artesanía española con visión contemporánea.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[rgb(180,165,142)]">Navegación</h4>
              <div className="space-y-2">
                <button onClick={() => navigate('/')} className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Inicio</button>
                <button onClick={() => navigate('/category/cocinas')} className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Cocinas</button>
                <button onClick={() => navigate('/category/vestidores')} className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Vestidores</button>
                <button onClick={() => navigate('/category/armarios')} className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Armarios</button>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[rgb(180,165,142)]">Servicios</h4>
              <div className="space-y-2">
                <div className="text-gray-400">Cocinas a medida</div>
                <div className="text-gray-400">Vestidores</div>
                <div className="text-gray-400">Armarios</div>
                <div className="text-gray-400">Mobiliario integral</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[rgb(180,165,142)]">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <div>Madrid, España</div>
                <div>+34 91 123 45 67</div>
                <div>info@madimuebles.com</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MADI Muebles. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoryPage;
