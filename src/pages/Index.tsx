import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Star, Award, Users, Phone, Mail, MapPin, Eye } from 'lucide-react';

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [language, setLanguage] = useState('ES');

  const testimonials = [
    {
      text: "MADI transformó completamente nuestro hogar. Cada pieza es una obra de arte funcional que refleja perfectamente nuestro estilo de vida.",
      author: "Elena Rodríguez",
      project: "Reforma integral - Madrid"
    },
    {
      text: "La atención al detalle y la calidad artesanal de MADI es incomparable. Nuestro vestidor es exactamente como lo soñamos.",
      author: "Carlos Mendoza",
      project: "Vestidor principal - Barcelona"
    },
    {
      text: "Trabajar con MADI fue una experiencia extraordinaria. Su proceso de diseño colaborativo hizo realidad nuestra visión.",
      author: "María García",
      project: "Cocina de diseño - Valencia"
    }
  ];

  const kitchenModelsMinimalista = [
    {
      name: "COCINA MINIMALISTA UTILITY",
      image: "/lovable-uploads/b286a941-43ea-4e43-a5fa-532d8bc45c16.png",
      price: "€15,500",
      description: "Una cocina utilitaria minimalista con acabados en madera natural y encimeras de mármol. Perfecta combinación de funcionalidad y estética sofisticada."
    },
    {
      name: "COCINA MINIMALISTA DINING",
      image: "/lovable-uploads/c92ac2f2-9a51-4468-a91f-0d274e5bff8d.png",
      price: "€18,200",
      description: "Espacio integrado de cocina y comedor con líneas limpias, iluminación colgante moderna y acabados en madera que aportan calidez al ambiente."
    },
    {
      name: "COCINA MINIMALISTA GALLEY",
      image: "/lovable-uploads/f4fed17d-01a8-4295-b2d1-256971d9b7b7.png",
      price: "€12,800",
      description: "Diseño de galería estrecha optimizada para espacios reducidos, manteniendo la elegancia minimalista con almacenamiento inteligente."
    },
    {
      name: "COCINA MINIMALISTA COMPACT",
      image: "/lovable-uploads/a13b3fbd-254d-4647-876b-e2ce58849448.png",
      price: "€14,300",
      description: "Solución compacta para comedores modernos, integrando almacenamiento y funcionalidad en un diseño elegante y minimalista."
    },
    {
      name: "COCINA MINIMALISTA ISLAND",
      image: "/lovable-uploads/38b171b9-871d-4140-8816-8b9e700c233b.png",
      price: "€22,500",
      description: "Cocina con isla central y partición de vidrio, creando un espacio abierto y luminoso con máxima funcionalidad."
    }
  ];

  const kitchenModelsMediterranea = [
    {
      name: "COCINA MEDITERRÁNEA ISLAND",
      image: "/lovable-uploads/6e14d5d0-d09a-4e5d-a225-e54a28555895.png",
      price: "€28,900",
      description: "Isla de cocina con base acanalada y acabados en madera natural, combinando tradición mediterránea con diseño contemporáneo."
    },
    {
      name: "COCINA MEDITERRÁNEA LIVING",
      image: "/lovable-uploads/7d38a2be-0cc8-4fe8-90be-14b44b24647d.png",
      price: "€35,400",
      description: "Concepto abierto que integra cocina y sala de estar, con vistas panorámicas y materiales naturales que evocan el Mediterráneo."
    },
    {
      name: "COCINA MEDITERRÁNEA LUXURY",
      image: "/lovable-uploads/6ba7f911-4eaf-4fe8-9eea-3244342324ba.png",
      price: "€41,200",
      description: "Cocina de lujo con estanterías de mármol iluminadas y acabados en madera, perfecta para exhibir vajillas y objetos decorativos."
    },
    {
      name: "COCINA MEDITERRÁNEA ARTISTIC",
      image: "/lovable-uploads/52ae2dc4-ff95-4995-95ee-3920d5a663ac.png",
      price: "€25,600",
      description: "Diseño artístico con iluminación escultural y acabados en mármol veteado, creando un ambiente único y sofisticado."
    },
    {
      name: "COCINA MEDITERRÁNEA MODERN",
      image: "/lovable-uploads/83f9b699-0e6f-4376-ae1b-c42698cbfa9d.png",
      price: "€31,800",
      description: "Interpretación moderna del estilo mediterráneo con iluminación artística y superficies de mármol que reflejan la luz natural."
    }
  ];

  const kitchenModelsModernaOscura = [
    {
      name: "COCINA MODERNA ISLAND PREMIUM",
      image: "/lovable-uploads/02a64ca8-6876-4d58-8c8f-1ea5031f4a9c.png",
      price: "desde €32,500",
      description: "Diseño de isla moderna con iluminación LED arquitectónica, acabados en madera con textura acanalada y encimeras de mármol. Perfecta integración de tecnología y elegancia."
    },
    {
      name: "COCINA MODERNA GALLEY LUXURY",
      image: "/lovable-uploads/4bafff0d-9993-460d-ae96-fdbf04a98784.png",
      price: "desde €28,900",
      description: "Galería moderna con acabado acanalado en madera, iluminación integrada bajo estantes y salpicadero de mármol natural que aporta sofisticación."
    },
    {
      name: "COCINA MODERNA DISPLAY PREMIUM",
      image: "/lovable-uploads/2004e972-5649-4436-9f59-2ad565bc3ea1.png",
      price: "desde €45,800",
      description: "Sistema de vitrinas iluminadas con estanterías de madera y cristal, perfecta para exhibir vajillas y cristalería. Incluye bodega integrada."
    },
    {
      name: "COCINA MODERNA MINIMAL ELEGANCE",
      image: "/lovable-uploads/164799a3-84d8-464d-af8e-14c2c4ca44c0.png",
      price: "desde €26,400",
      description: "Diseño minimalista con acabados mate, electrodomésticos integrados y salpicadero de mármol veteado. Funcionalidad sin comprometer la estética."
    },
    {
      name: "COCINA MODERNA URBAN CHIC",
      image: "/lovable-uploads/533f1ed3-906f-407f-bb25-d911e3123588.png",
      price: "desde €38,200",
      description: "Concepto urbano moderno con isla central de mármol, iluminación colgante escultural y acabados en tonos neutros sofisticados."
    },
    {
      name: "COCINA MODERNA PENTHOUSE",
      image: "/lovable-uploads/471bc22d-6315-46e0-87b5-210c2eb4466a.png",
      price: "desde €52,600",
      description: "Diseño de lujo para espacios amplios con isla de mármol masiva, iluminación arquitectónica y vistas panorámicas integradas al diseño."
    },
    {
      name: "COCINA MODERNA COMPACT LUXURY",
      image: "/lovable-uploads/7db2c192-149e-4f78-80bd-ade35a77b765.png",
      price: "desde €24,800",
      description: "Solución compacta de lujo con mesa integrada, acabados premium y aprovechamiento máximo del espacio sin renunciar al diseño."
    }
  ];

  const wardrobeModels = [
    {
      name: "VITRINA CONTEMPO",
      image: "photo-1586023492125-27b2c045efd7",
      price: "€8,500",
      description: "Una solución de almacenaje elegante y funcional que destaca por su diseño equilibrado entre lo moderno y lo clásico. Los frentes lisos en tono pastel suave aportan serenidad, mientras que los tiradores integrados con acentos dorados añaden sofisticación."
    },
    {
      name: "VESTÍBULO LUMINIA",
      image: "photo-1586023492125-27b2c045efd7",
      price: "€6,800",
      description: "El armario Luminia es una pieza ideal para entradas modernas que combina funcionalidad, estilo y calidez. El acabado en madera natural aporta una sensación acogedora, mientras que los detalles en mármol con vetas oscuras añaden un toque sofisticado."
    },
    {
      name: "ARMARIO TERRA",
      image: "photo-1586023492125-27b2c045efd7",
      price: "€5,200",
      description: "El armario Terra destaca por su diseño minimalista y cálido, ideal para interiores modernos y naturales. Fabricado con acabado en madera clara, se integra perfectamente en cualquier entorno, aportando serenidad y armonía."
    },
    {
      name: "MADERA & VIDRIO",
      image: "photo-1586023492125-27b2c045efd7",
      price: "€9,200",
      description: "Una combinación perfecta de calidez natural y transparencia moderna, con paneles de vidrio templado que permiten exhibir las piezas más especiales."
    },
    {
      name: "ENTRADA NATURAL",
      image: "photo-1586023492125-27b2c045efd7",
      price: "€7,600",
      description: "Diseñado para recibir con estilo, combina espacios de almacenamiento oculto con elementos decorativos que crean una primera impresión memorable."
    },
    {
      name: "ESTANTERÍA ÁUREA",
      image: "photo-1586023492125-27b2c045efd7",
      price: "€11,400",
      description: "Inspirada en la proporción áurea, esta estantería combina funcionalidad y arte, creando un punto focal que organiza y embellece el espacio."
    },
    {
      name: "VESTIDOR MODERNA LUMINA",
      image: "/lovable-uploads/914ee2d0-75d6-425d-b8f3-a9f4f22e7698.png",
      price: "desde €12,800",
      description: "Vestidor moderno con acabado en madera natural, espejo con iluminación LED perimetral y asientos tapizados. Diseño funcional que maximiza el almacenamiento."
    },
    {
      name: "ARMARIO MODERNA ELEGANCE",
      image: "/lovable-uploads/b32560c8-0021-4e69-a470-11a9cd52c337.png",
      price: "desde €15,200",
      description: "Armario de diseño contemporáneo con paneles de madera, zona de tocador integrada con espejo iluminado y almacenamiento optimizado para espacios modernos."
    }
  ];

  const portfolioImages = [
    "/lovable-uploads/2cdf3057-4b67-4fd6-9a35-22d93960d69c.png",
    "/lovable-uploads/12d2af38-c23d-4b9c-8feb-7bd0f637ecb5.png",
    "/lovable-uploads/2dc1aa7a-1f43-480e-9254-b4a814d06baf.png",
    "/lovable-uploads/a3c240e5-0ac4-4c59-9bb8-44e3c09400d1.png",
    "/lovable-uploads/f2a9ca0c-e245-41fa-81a7-77852fe8f37a.png",
    "/lovable-uploads/7605104b-dc16-4409-937f-d4dbd0035488.png"
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleOrderClick = (itemName: string, price: string) => {
    alert(`Solicitud de consulta para ${itemName} - ${price}. Nos pondremos en contacto con usted pronto.`);
  };

  const ProductCard = ({ product, type }: { product: any, type: string }) => (
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)]">
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalles
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[rgb(22,22,22)] border-[rgb(180,165,142)] text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-[rgb(180,165,142)] text-2xl">{product.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  className="aspect-square bg-cover bg-center rounded-lg"
                  style={{
                    backgroundImage: `url('${product.image.includes('/lovable-uploads/') ? product.image : `https://images.unsplash.com/${product.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}')`
                  }}
                />
                <div>
                  <div className="text-3xl font-bold text-[rgb(180,165,142)] mb-4">{product.price}</div>
                  <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-400">
                      <strong>Incluye:</strong> Diseño personalizado, fabricación artesanal, instalación profesional
                    </div>
                    <div className="text-sm text-gray-400">
                      <strong>Tiempo de entrega:</strong> 6-8 semanas
                    </div>
                    <div className="text-sm text-gray-400">
                      <strong>Garantía:</strong> 5 años en estructura, 2 años en acabados
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-6 bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
                    onClick={() => handleOrderClick(product.name, product.price)}
                  >
                    Solicitar Consulta
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
          <div className="hidden md:flex items-center space-x-8">
            <a href="#colecciones" className="hover:text-[rgb(180,165,142)] transition-colors">Colecciones</a>
            <a href="#proyectos" className="hover:text-[rgb(180,165,142)] transition-colors">Proyectos</a>
            <a href="#proceso" className="hover:text-[rgb(180,165,142)] transition-colors">Nuestro Proceso</a>
            <a href="#contacto" className="hover:text-[rgb(180,165,142)] transition-colors">Contacto</a>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setLanguage(language === 'ES' ? 'EN' : 'ES')}
                className="text-sm hover:text-[rgb(180,165,142)] transition-colors"
              >
                {language} / {language === 'ES' ? 'EN' : 'ES'}
              </button>
            </div>
          </div>
          <Button className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] border border-[rgb(180,165,142)]">
            Iniciar Consulta
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Mobiliario de Autor.<br />
            <span className="text-[rgb(180,165,142)]">Diseñado para su historia.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Creamos piezas exclusivas y a medida que transforman espacios. 
            Hecho a mano con pasión en nuestro taller de Madrid.
          </p>
          <Button size="lg" className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-12 py-4 text-lg">
            Descubra las Posibilidades
          </Button>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-400 text-lg mb-8">
              Colaboramos con los mejores arquitectos y diseñadores de interiores
            </p>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              <div className="text-2xl font-bold">ARQUITECTOS+</div>
              <div className="text-2xl font-bold">DESIGN STUDIO</div>
              <div className="text-2xl font-bold">LUXURY HOMES</div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div 
              className="aspect-square bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                filter: 'grayscale(100%)'
              }}
            />
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                El Arte de Crear Espacios,<br />
                <span className="text-[rgb(180,165,142)]">No Solo Muebles.</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                En MADI, cada pieza nace de una conversación profunda sobre cómo vive, 
                siente y sueña nuestro cliente. No fabricamos muebles; creamos extensiones 
                de personalidades, espacios que cuentan historias y ambientes que inspiran 
                cada día.
              </p>
              <button className="text-[rgb(180,165,142)] text-lg hover:underline">
                Conozca nuestra historia →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="proyectos" className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Inspiración para su <span className="text-[rgb(180,165,142)]">Espacio</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioImages.map((image, index) => (
              <div 
                key={index}
                className="aspect-square bg-cover bg-center rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                style={{
                  backgroundImage: `url('${image}')`
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="colecciones" className="py-24 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Nuestras <span className="text-[rgb(180,165,142)]">Colecciones</span>
          </h2>

          {/* Cocinas Minimalistas */}
          <div className="mb-24">
            <h3 className="text-3xl font-bold mb-8 text-[rgb(180,165,142)]">COCINAS MINIMALISTAS</h3>
            <p className="text-gray-300 text-lg mb-12 max-w-4xl">
              El epitome de la elegancia moderna, con superficies continuas, almacenamiento integrado 
              y una paleta de colores neutros sofisticados. Cada diseño busca la perfección en la simplicidad.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kitchenModelsMinimalista.map((model, index) => (
                <ProductCard key={index} product={model} type="kitchen" />
              ))}
            </div>
          </div>

          {/* Cocinas Mediterráneas */}
          <div className="mb-24">
            <h3 className="text-3xl font-bold mb-8 text-[rgb(180,165,142)]">COCINAS MEDITERRÁNEAS</h3>
            <p className="text-gray-300 text-lg mb-12 max-w-4xl">
              Inspiradas en la tradición mediterránea, combinan piedra natural, madera envejecida 
              y herrajes artesanales para crear ambientes acogedores llenos de carácter y sofisticación.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kitchenModelsMediterranea.map((model, index) => (
                <ProductCard key={index} product={model} type="kitchen" />
              ))}
            </div>
          </div>

          {/* Cocinas Moderna Oscura */}
          <div className="mb-24">
            <h3 className="text-3xl font-bold mb-8 text-[rgb(180,165,142)]">COCINAS MODERNA OSCURA</h3>
            <p className="text-gray-300 text-lg mb-12 max-w-4xl">
              Diseños contemporáneos que juegan con contrastes dramáticos, iluminación arquitectónica 
              y materiales nobles. Perfecta fusión entre tecnología avanzada y elegancia atemporal.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kitchenModelsModernaOscura.map((model, index) => (
                <ProductCard key={index} product={model} type="kitchen" />
              ))}
            </div>
          </div>

          {/* Vestidores y Armarios */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-[rgb(180,165,142)]">ARMARIOS QUE INSPIRAN</h3>
            <p className="text-gray-300 text-lg mb-12 max-w-4xl">
              En MADI, creemos que cada espacio debe reflejar la personalidad y estilo de vida 
              de quien lo habita. Por eso creamos diseños únicos de armarios y mobiliario a medida, 
              pensados hasta el último detalle. Si buscas una transformación auténtica, 
              personalizada y con alma, MADI es tu mejor elección.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wardrobeModels.map((model, index) => (
                <ProductCard key={index} product={model} type="wardrobe" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="proceso" className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            El Viaje <span className="text-[rgb(180,165,142)]">MADI</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consulta y Visión", desc: "Escuchamos sus sueños y analizamos el espacio" },
              { step: "02", title: "Diseño y Visualización 3D", desc: "Creamos renders fotorrealistas de su proyecto" },
              { step: "03", title: "Artesanía y Fabricación", desc: "Nuestros maestros artesanos dan vida al diseño" },
              { step: "04", title: "Entrega e Instalación", desc: "Instalación perfecta en su hogar" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center text-[rgb(14,14,14)] font-bold text-xl mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Lo que Dicen Nuestros <span className="text-[rgb(180,165,142)]">Clientes</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-[rgb(22,22,22)] rounded-lg p-12 text-center">
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-[rgb(180,165,142)] text-[rgb(180,165,142)]" />
                ))}
              </div>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="text-[rgb(180,165,142)] font-bold text-lg">
                {testimonials[currentTestimonial].author}
              </div>
              <div className="text-gray-400">
                {testimonials[currentTestimonial].project}
              </div>
            </div>
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentTestimonial ? 'bg-[rgb(180,165,142)]' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Hagamos Realidad<br />
                <span className="text-[rgb(180,165,142)]">su Visión</span>
              </h2>
              <p className="text-gray-300 text-lg mb-12 leading-relaxed">
                Cada proyecto comienza con una conversación. Cuéntenos sobre su espacio, 
                sus sueños y su estilo de vida. Nuestro equipo de diseñadores estará 
                encantado de transformar sus ideas en realidad.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-[rgb(180,165,142)]" />
                  <span className="text-gray-300">+34 91 123 45 67</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-[rgb(180,165,142)]" />
                  <span className="text-gray-300">info@madimuebles.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-[rgb(180,165,142)]" />
                  <span className="text-gray-300">Taller MADI - Madrid, España</span>
                </div>
              </div>
            </div>
            <div className="bg-[rgb(22,22,22)] p-8 rounded-lg">
              <form className="space-y-6">
                <div>
                  <Input 
                    placeholder="Su nombre"
                    className="bg-transparent border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Input 
                    type="email"
                    placeholder="Su email"
                    className="bg-transparent border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Teléfono"
                    className="bg-transparent border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Textarea 
                    placeholder="Cuéntenos sobre su proyecto..."
                    className="bg-transparent border-gray-600 text-white placeholder-gray-400 min-h-32"
                  />
                </div>
                <Button className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] py-3">
                  Enviar Solicitud de Consulta
                </Button>
              </form>
            </div>
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
                <a href="#colecciones" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Colecciones</a>
                <a href="#proyectos" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Proyectos</a>
                <a href="#proceso" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Nuestro Proceso</a>
                <a href="#contacto" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Contacto</a>
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

export default Index;
