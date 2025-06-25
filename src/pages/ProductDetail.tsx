
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Phone, Star } from 'lucide-react';
import { useState } from 'react';

interface Product {
  name: string;
  image: string;
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
    'cocina-minimalista-utility': {
      name: "COCINA MINIMALISTA UTILITY",
      image: "/lovable-uploads/b286a941-43ea-4e43-a5fa-532d8bc45c16.png",
      price: "€15,500",
      description: "Una cocina utilitaria minimalista con acabados en madera natural y encimeras de mármol. Perfecta combinación de funcionalidad y estética sofisticada. Diseñada para maximizar el espacio y crear un ambiente sereno y ordenado.",
      category: "Cocinas Minimalistas"
    },
    'cocina-minimalista-dining': {
      name: "COCINA MINIMALISTA DINING",
      image: "/lovable-uploads/c92ac2f2-9a51-4468-a91f-0d274e5bff8d.png",
      price: "€18,200",
      description: "Espacio integrado de cocina y comedor con líneas limpias, iluminación colgante moderna y acabados en madera que aportan calidez al ambiente. Perfecta para crear momentos familiares inolvidables.",
      category: "Cocinas Minimalistas"
    },
    'cocina-minimalista-galley': {
      name: "COCINA MINIMALISTA GALLEY",
      image: "/lovable-uploads/f4fed17d-01a8-4295-b2d1-256971d9b7b7.png",
      price: "€12,800",
      description: "Diseño de galería estrecha optimizada para espacios reducidos, manteniendo la elegancia minimalista con almacenamiento inteligente. Cada centímetro está pensado para maximizar la funcionalidad.",
      category: "Cocinas Minimalistas"
    },
    'cocina-minimalista-compact': {
      name: "COCINA MINIMALISTA COMPACT",
      image: "/lovable-uploads/a13b3fbd-254d-4647-876b-e2ce58849448.png",
      price: "€14,300",
      description: "Solución compacta para comedores modernos, integrando almacenamiento y funcionalidad en un diseño elegante y minimalista. Ideal para apartamentos urbanos modernos.",
      category: "Cocinas Minimalistas"
    },
    'cocina-minimalista-island': {
      name: "COCINA MINIMALISTA ISLAND",
      image: "/lovable-uploads/38b171b9-871d-4140-8816-8b9e700c233b.png",
      price: "€22,500",
      description: "Cocina con isla central y partición de vidrio, creando un espacio abierto y luminoso con máxima funcionalidad. La isla se convierte en el corazón social del hogar.",
      category: "Cocinas Minimalistas"
    },
    'cocina-mediterranea-island': {
      name: "COCINA MEDITERRÁNEA ISLAND",
      image: "/lovable-uploads/6e14d5d0-d09a-4e5d-a225-e54a28555895.png",
      price: "€28,900",
      description: "Isla de cocina con base acanalada y acabados en madera natural, combinando tradición mediterránea con diseño contemporáneo. Evoca la calidez y hospitalidad del Mediterráneo.",
      category: "Cocinas Mediterráneas"
    },
    'cocina-mediterranea-living': {
      name: "COCINA MEDITERRÁNEA LIVING",
      image: "/lovable-uploads/7d38a2be-0cc8-4fe8-90be-14b44b24647d.png",
      price: "€35,400",
      description: "Concepto abierto que integra cocina y sala de estar, con vistas panorámicas y materiales naturales que evocan el Mediterráneo. Perfecta para el estilo de vida mediterráneo.",
      category: "Cocinas Mediterráneas"
    },
    'cocina-mediterranea-luxury': {
      name: "COCINA MEDITERRÁNEA LUXURY",
      image: "/lovable-uploads/6ba7f911-4eaf-4fe8-9eea-3244342324ba.png",
      price: "€41,200",
      description: "Cocina de lujo con estanterías de mármol iluminadas y acabados en madera, perfecta para exhibir vajillas y objetos decorativos. Un verdadero santuario culinario.",
      category: "Cocinas Mediterráneas"
    },
    'cocina-mediterranea-artistic': {
      name: "COCINA MEDITERRÁNEA ARTISTIC",
      image: "/lovable-uploads/52ae2dc4-ff95-4995-95ee-3920d5a663ac.png",
      price: "€25,600",
      description: "Diseño artístico con iluminación escultural y acabados en mármol veteado, creando un ambiente único y sofisticado. Arte y funcionalidad en perfecta armonía.",
      category: "Cocinas Mediterráneas"
    },
    'cocina-mediterranea-modern': {
      name: "COCINA MEDITERRÁNEA MODERN",
      image: "/lovable-uploads/83f9b699-0e6f-4376-ae1b-c42698cbfa9d.png",
      price: "€31,800",
      description: "Interpretación moderna del estilo mediterráneo con iluminación artística y superficies de mármol que reflejan la luz natural. Tradición reinventada para el siglo XXI.",
      category: "Cocinas Mediterráneas"
    },
    'cocina-moderna-island-premium': {
      name: "COCINA MODERNA ISLAND PREMIUM",
      image: "/lovable-uploads/02a64ca8-6876-4d58-8c8f-1ea5031f4a9c.png",
      price: "€32,500",
      description: "Diseño de isla moderna con iluminación LED arquitectónica, acabados en madera con textura acanalada y encimeras de mármol. Perfecta integración de tecnología y elegancia. Un espacio que redefine la experiencia culinaria moderna.",
      category: "Cocinas Moderna Oscura"
    },
    'cocina-moderna-galley-luxury': {
      name: "COCINA MODERNA GALLEY LUXURY",
      image: "/lovable-uploads/4bafff0d-9993-460d-ae96-fdbf04a98784.png",
      price: "€28,900",
      description: "Galería moderna con acabado acanalado en madera, iluminación integrada bajo estantes y salpicadero de mármol natural que aporta sofisticación. Elegancia lineal en cada detalle.",
      category: "Cocinas Moderna Oscura"
    },
    'cocina-moderna-display-premium': {
      name: "COCINA MODERNA DISPLAY PREMIUM",
      image: "/lovable-uploads/2004e972-5649-4436-9f59-2ad565bc3ea1.png",
      price: "€45,800",
      description: "Sistema de vitrinas iluminadas con estanterías de madera y cristal, perfecta para exhibir vajillas y cristalería. Incluye bodega integrada. Un museo culinario personal.",
      category: "Cocinas Moderna Oscura"
    },
    'cocina-moderna-minimal-elegance': {
      name: "COCINA MODERNA MINIMAL ELEGANCE",
      image: "/lovable-uploads/164799a3-84d8-464d-af8e-14c2c4ca44c0.png",
      price: "€26,400",
      description: "Diseño minimalista con acabados mate, electrodomésticos integrados y salpicadero de mármol veteado. Funcionalidad sin comprometer la estética. La esencia del diseño contemporáneo.",
      category: "Cocinas Moderna Oscura"
    },
    'cocina-moderna-urban-chic': {
      name: "COCINA MODERNA URBAN CHIC",
      image: "/lovable-uploads/533f1ed3-906f-407f-bb25-d911e3123588.png",
      price: "€38,200",
      description: "Concepto urbano moderno con isla central de mármol, iluminación colgante escultural y acabados en tonos neutros sofisticados. Diseñado para la vida urbana contemporánea.",
      category: "Cocinas Moderna Oscura"
    },
    'cocina-moderna-penthouse': {
      name: "COCINA MODERNA PENTHOUSE",
      image: "/lovable-uploads/471bc22d-6315-46e0-87b5-210c2eb4466a.png",
      price: "€52,600",
      description: "Diseño de lujo para espacios amplios con isla de mármol masiva, iluminación arquitectónica y vistas panorámicas integradas al diseño. El epítome del lujo residencial moderno.",
      category: "Cocinas Moderna Oscura"
    },
    'cocina-moderna-compact-luxury': {
      name: "COCINA MODERNA COMPACT LUXURY",
      image: "/lovable-uploads/7db2c192-149e-4f78-80bd-ade35a77b765.png",
      price: "€24,800",
      description: "Solución compacta de lujo con mesa integrada, acabados premium y aprovechamiento máximo del espacio sin renunciar al diseño. Lujo sin límites de espacio.",
      category: "Cocinas Moderna Oscura"
    },
    'vestidor-moderna-lumina': {
      name: "VESTIDOR MODERNA LUMINA",
      image: "/lovable-uploads/914ee2d0-75d6-425d-b8f3-a9f4f22e7698.png",
      price: "€12,800",
      description: "Vestidor moderno con acabado en madera natural, espejo con iluminación LED perimetral y asientos tapizados. Diseño funcional que maximiza el almacenamiento. Un espacio personal de lujo y organización.",
      category: "Armarios y Vestidores"
    },
    'armario-moderna-elegance': {
      name: "ARMARIO MODERNA ELEGANCE",
      image: "/lovable-uploads/b32560c8-0021-4e69-a470-11a9cd52c337.png",
      price: "€15,200",
      description: "Armario de diseño contemporáneo con paneles de madera, zona de tocador integrada con espejo iluminado y almacenamiento optimizado para espacios modernos. Elegancia funcional redefinida.",
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
                    backgroundImage: `url('${product.image}')`
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
