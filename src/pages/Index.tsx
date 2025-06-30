import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOHead from '@/components/SEOHead';
import CookieConsent from '@/components/CookieConsent';
import ContactForm from '@/components/ContactForm';

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [language, setLanguage] = useState('ES');
  const navigate = useNavigate();

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

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category}`);
  };

  const scrollToCollections = () => {
    const collectionsSection = document.getElementById('colecciones');
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      <SEOHead 
        title="MADI - Mobiliario de Autor Exclusivo | Cocinas, Vestidores y Armarios de Lujo en Madrid"
        description="MADI crea mobiliario de autor exclusivo y a medida en Madrid. Especialistas en cocinas de lujo, vestidores personalizados y armarios de diseño. Calidad artesanal premium."
        keywords="mobiliario de lujo Madrid, cocinas a medida, vestidores personalizados, armarios de diseño, muebles exclusivos, carpintería artesanal, diseño interior luxury"
        url="https://madiluxe.com"
        type="website"
      />
      
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
            backgroundImage: `url('/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png')`,
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
          <Button 
            size="lg" 
            className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-12 py-4 text-lg"
            onClick={scrollToCollections}
          >
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
                backgroundImage: `url('/lovable-uploads/75fee044-f881-4fda-91c4-f03dbec16e0c.png')`,
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
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Nuestras <span className="text-[rgb(180,165,142)]">Colecciones</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Cada colección refleja nuestra pasión por la excelencia y el diseño personalizado
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Cocinas - Featured */}
            <div className="lg:col-span-2 group">
              <div className="relative overflow-hidden rounded-xl">
                <div 
                  className="aspect-[16/10] bg-cover bg-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png')`
                  }}
                  onClick={() => handleCategoryClick('cocinas')}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center">
                        <span className="text-[rgb(14,14,14)] font-bold text-lg">01</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white">Cocinas</h3>
                    </div>
                    <p className="text-gray-200 text-lg mb-6 max-w-lg">
                      El corazón del hogar merece un diseño excepcional. Funcionalidad y elegancia en perfecta armonía.
                    </p>
                    <Button 
                      className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] group-hover:scale-105 transition-all duration-300"
                      onClick={() => handleCategoryClick('cocinas')}
                    >
                      Explorar Cocinas →
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vestidores */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl h-full">
                <div 
                  className="aspect-square lg:aspect-auto lg:h-full bg-cover bg-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png')`
                  }}
                  onClick={() => handleCategoryClick('vestidores')}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center">
                        <span className="text-[rgb(14,14,14)] font-bold">02</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">Vestidores</h3>
                    </div>
                    <p className="text-gray-200 mb-4">
                      Organización con estilo para tu día a día
                    </p>
                    <Button 
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-[rgb(14,14,14)] group-hover:scale-105 transition-all duration-300"
                      onClick={() => handleCategoryClick('vestidores')}
                    >
                      Ver Más
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Armarios y Zonas de Entrada */}
          <div className="group">
            <div className="relative overflow-hidden rounded-xl">
              <div 
                className="aspect-[21/9] bg-cover bg-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url('/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png')`
                }}
                onClick={() => handleCategoryClick('armarios')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
                <div className="absolute left-0 top-0 bottom-0 flex items-center">
                  <div className="p-8 max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center">
                        <span className="text-[rgb(14,14,14)] font-bold text-lg">03</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white">Armarios y Zonas de Entrada</h3>
                    </div>
                    <p className="text-gray-200 text-lg mb-6">
                      La primera impresión cuenta. Espacios de recibimiento que combinan funcionalidad y diseño impecable.
                    </p>
                    <Button 
                      className="bg-transparent border-2 border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)] group-hover:scale-105 transition-all duration-300"
                      onClick={() => handleCategoryClick('armarios')}
                    >
                      Descubrir Armarios →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-gray-400 text-lg mb-6">
              ¿No encuentra lo que busca? Creamos soluciones completamente personalizadas.
            </p>
            <Button 
              size="lg"
              className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-8 py-4"
            >
              Solicitar Diseño Personalizado
            </Button>
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
                  <span className="text-gray-300">+34 643 550 964</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-[rgb(180,165,142)]" />
                  <span className="text-gray-300">info@madiluxe.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-[rgb(180,165,142)]" />
                  <span className="text-gray-300">C. Bruselas, 17, 28232 Las Rozas de Madrid, Madrid, España</span>
                </div>
              </div>
            </div>
            <div>
              <ContactForm language="es" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <WhatsAppWidget />
      <CookieConsent />
    </div>
  );
};

export default Index;
