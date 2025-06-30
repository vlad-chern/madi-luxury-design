
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  // All product data organized by category
  const categoryData = {
    cocinas: {
      title: "Cocinas",
      description: "Diseños funcionales y elegantes que transforman el corazón del hogar.",
      products: [
        {
          id: "cocina-minimalista-utility",
          name: "COCINA MINIMALISTA UTILITY",
          image: "/lovable-uploads/b286a941-43ea-4e43-a5fa-532d8bc45c16.png",
          price: "desde €15,500",
          description: "Una cocina utilitaria minimalista con acabados en madera natural y encimeras de mármol. Perfecta combinación de funcionalidad y estética sofisticada."
        },
        {
          id: "cocina-minimalista-dining",
          name: "COCINA MINIMALISTA DINING",
          image: "/lovable-uploads/c92ac2f2-9a51-4468-a91f-0d274e5bff8d.png",
          price: "desde €18,200",
          description: "Espacio integrado de cocina y comedor con líneas limpias, iluminación colgante moderna y acabados en madera que aportan calidez al ambiente."
        },
        {
          id: "cocina-minimalista-galley",
          name: "COCINA MINIMALISTA GALLEY",
          image: "/lovable-uploads/f4fed17d-01a8-4295-b2d1-256971d9b7b7.png",
          price: "desde €12,800",
          description: "Diseño de galería estrecha optimizada para espacios reducidos, manteniendo la elegancia minimalista con almacenamiento inteligente."
        },
        {
          id: "cocina-minimalista-compact",
          name: "COCINA MINIMALISTA COMPACT",
          image: "/lovable-uploads/a13b3fbd-254d-4647-876b-e2ce58849448.png",
          price: "desde €14,300",
          description: "Solución compacta para comedores modernos, integrando almacenamiento y funcionalidad en un diseño elegante y minimalista."
        },
        {
          id: "cocina-minimalista-island",
          name: "COCINA MINIMALISTA ISLAND",
          image: "/lovable-uploads/38b171b9-871d-4140-8816-8b9e700c233b.png",
          price: "desde €22,500",
          description: "Cocina con isla central y partición de vidrio, creando un espacio abierto y luminoso con máxima funcionalidad."
        },
        {
          id: "cocina-mediterranea-island",
          name: "COCINA MEDITERRÁNEA ISLAND",
          image: "/lovable-uploads/6e14d5d0-d09a-4e5d-a225-e54a28555895.png",
          price: "desde €28,900",
          description: "Isla de cocina con base acanalada y acabados en madera natural, combinando tradición mediterránea con diseño contemporáneo."
        },
        {
          id: "cocina-mediterranea-living",
          name: "COCINA MEDITERRÁNEA LIVING",
          image: "/lovable-uploads/7d38a2be-0cc8-4fe8-90be-14b44b24647d.png",
          price: "desde €35,400",
          description: "Concepto abierto que integra cocina y sala de estar, con vistas panorámicas y materiales naturales que evocan el Mediterráneo."
        },
        {
          id: "cocina-mediterranea-luxury",
          name: "COCINA MEDITERRÁNEA LUXURY",
          image: "/lovable-uploads/6ba7f911-4eaf-4fe8-9eea-3244342324ba.png",
          price: "desde €41,200",
          description: "Cocina de lujo con estanterías de mármol iluminadas y acabados en madera, perfecta para exhibir vajillas y objetos decorativos."
        },
        {
          id: "cocina-mediterranea-artistic",
          name: "COCINA MEDITERRÁNEA ARTISTIC",
          image: "/lovable-uploads/52ae2dc4-ff95-4995-95ee-3920d5a663ac.png",
          price: "desde €25,600",
          description: "Diseño artístico con iluminación escultural y acabados en mármol veteado, creando un ambiente único y sofisticado."
        },
        {
          id: "cocina-mediterranea-modern",
          name: "COCINA MEDITERRÁNEA MODERN",
          image: "/lovable-uploads/83f9b699-0e6f-4376-ae1b-c42698cbfa9d.png",
          price: "desde €31,800",
          description: "Interpretación moderna del estilo mediterráneo con iluminación artística y superficies de mármol que reflejan la luz natural."
        },
        {
          id: "cocina-moderna-island-premium",
          name: "COCINA MODERNA ISLAND PREMIUM",
          image: "/lovable-uploads/02a64ca8-6876-4d58-8c8f-1ea5031f4a9c.png",
          price: "desde €32,500",
          description: "Diseño de isla moderna con iluminación LED arquitectónica, acabados en madera con textura acanalada y encimeras de mármol. Perfecta integración de tecnología y elegancia."
        },
        {
          id: "cocina-moderna-galley-luxury",
          name: "COCINA MODERNA GALLEY LUXURY",
          image: "/lovable-uploads/4bafff0d-9993-460d-ae96-fdbf04a98784.png",
          price: "desde €28,900",
          description: "Galería moderna con acabado acanalado en madera, iluminación integrada bajo estantes y salpicadero de mármol natural que aporta sofisticación."
        },
        {
          id: "cocina-moderna-display-premium",
          name: "COCINA MODERNA DISPLAY PREMIUM",
          image: "/lovable-uploads/2004e972-5649-4436-9f59-2ad565bc3ea1.png",
          price: "desde €45,800",
          description: "Sistema de vitrinas iluminadas con estanterías de madera y cristal, perfecta para exhibir vajillas y cristalería. Incluye bodega integrada."
        },
        {
          id: "cocina-moderna-minimal-elegance",
          name: "COCINA MODERNA MINIMAL ELEGANCE",
          image: "/lovable-uploads/164799a3-84d8-464d-af8e-14c2c4ca44c0.png",
          price: "desde €26,400",
          description: "Diseño minimalista con acabados mate, electrodomésticos integrados y salpicadero de mármol veteado. Funcionalidad sin comprometer la estética."
        },
        {
          id: "cocina-moderna-urban-chic",
          name: "COCINA MODERNA URBAN CHIC",
          image: "/lovable-uploads/533f1ed3-906f-407f-bb25-d911e3123588.png",
          price: "desde €38,200",
          description: "Concepto urbano moderno con isla central de mármol, iluminación colgante escultural y acabados en tonos neutros sofisticados."
        },
        {
          id: "cocina-moderna-penthouse",
          name: "COCINA MODERNA PENTHOUSE",
          image: "/lovable-uploads/471bc22d-6315-46e0-87b5-210c2eb4466a.png",
          price: "desde €52,600",
          description: "Diseño de lujo para espacios amplios con isla de mármol masiva, iluminación arquitectónica y vistas panorámicas integradas al diseño."
        },
        {
          id: "cocina-moderna-compact-luxury",
          name: "COCINA MODERNA COMPACT LUXURY",
          image: "/lovable-uploads/7db2c192-149e-4f78-80bd-ade35a77b765.png",
          price: "desde €24,800",
          description: "Solución compacta de lujo con mesa integrada, acabados premium y aprovechamiento máximo del espacio sin renunciar al diseño."
        }
      ]
    },
    vestidores: {
      title: "Vestidores",
      description: "Organización con estilo: espacios hechos a medida para tu día a día.",
      products: [
        {
          id: "vestidor-moderna-lumina",
          name: "VESTIDOR MODERNA LUMINA",
          image: "/lovable-uploads/914ee2d0-75d6-425d-b8f3-a9f4f22e7698.png",
          price: "desde €12,800",
          description: "Vestidor moderno con acabado en madera natural, espejo con iluminación LED perimetral y asientos tapizados. Diseño funcional que maximiza el almacenamiento."
        }
      ]
    },
    armarios: {
      title: "Armarios y Zonas de Entrada",
      description: "Soluciones que combinan funcionalidad y diseño.",
      products: [
        {
          id: "vitrina-contempo",
          name: "VITRINA CONTEMPO",
          image: "photo-1586023492125-27b2c045efd7",
          price: "desde €8,500",
          description: "Una solución de almacenaje elegante y funcional que destaca por su diseño equilibrado entre lo moderno y lo clásico. Los frentes lisos en tono pastel suave aportan serenidad, mientras que los tiradores integrados con acentos dorados añaden sofisticación."
        },
        {
          id: "vestibulo-luminia",
          name: "VESTÍBULO LUMINIA",
          image: "photo-1586023492125-27b2c045efd7",
          price: "desde €6,800",
          description: "El armario Luminia es una pieza ideal para entradas modernas que combina funcionalidad, estilo y calidez. El acabado en madera natural aporta una sensación acogedora, mientras que los detalles en mármol con vetas oscuras añaden un toque sofisticado."
        },
        {
          id: "armario-terra",
          name: "ARMARIO TERRA",
          image: "photo-1586023492125-27b2c045efd7",
          price: "desde €5,200",
          description: "El armario Terra destaca por su diseño minimalista y cálido, ideal para interiores modernos y naturales. Fabricado con acabado en madera clara, se integra perfectamente en cualquier entorno, aportando serenidad y armonía."
        },
        {
          id: "madera-vidrio",
          name: "MADERA & VIDRIO",
          image: "photo-1586023492125-27b2c045efd7",
          price: "desde €9,200",
          description: "Una combinación perfecta de calidez natural y transparencia moderna, con paneles de vidrio templado que permiten exhibir las piezas más especiales."
        },
        {
          id: "entrada-natural",
          name: "ENTRADA NATURAL",
          image: "photo-1586023492125-27b2c045efd7",
          price: "desde €7,600",
          description: "Diseñado para recibir con estilo, combina espacios de almacenamiento oculto con elementos decorativos que crean una primera impresión memorable."
        },
        {
          id: "estanteria-aurea",
          name: "ESTANTERÍA ÁUREA",
          image: "photo-1586023492125-27b2c045efd7",
          price: "desde €11,400",
          description: "Inspirada en la proporción áurea, esta estantería combina funcionalidad y arte, creando un punto focal que organiza y embellece el espacio."
        },
        {
          id: "armario-moderna-elegance",
          name: "ARMARIO MODERNA ELEGANCE",
          image: "/lovable-uploads/b32560c8-0021-4e69-a470-11a9cd52c337.png",
          price: "desde €15,200",
          description: "Armario de diseño contemporáneo con paneles de madera, zona de tocador integrada con espejo iluminado y almacenamiento optimizado para espacios modernos."
        }
      ]
    }
  };

  const currentCategory = categoryData[category as keyof typeof categoryData];

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
          backgroundImage: `url('${product.image.includes('/lovable-uploads/') ? product.image : `https://images.unsplash.com/${product.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}')`
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

      {/* Products Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCategory.products.map((product, index) => (
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
