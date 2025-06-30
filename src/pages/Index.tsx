import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOHead from '@/components/SEOHead';
import CookieConsent from '@/components/CookieConsent';
import ContactForm from '@/components/ContactForm';
import DynamicCollections from '@/components/DynamicCollections';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Переводы для разных языков
  const translations = {
    ES: {
      nav: {
        collections: 'Colecciones',
        projects: 'Proyectos',
        process: 'Nuestro Proceso',
        contact: 'Contacto',
        startConsultation: 'Iniciar Consulta'
      },
      hero: {
        title: 'Mobiliario de Autor.',
        subtitle: 'Diseñado para su historia.',
        description: 'Creamos piezas exclusivas y a medida que transforman espacios. Hecho a mano con pasión en nuestro taller de Madrid.',
        cta: 'Descubra las Posibilidades'
      },
      philosophy: {
        title: 'El Arte de Crear Espacios,',
        subtitle: 'No Solo Muebles.',
        description: 'En MADI, cada pieza nace de una conversación profunda sobre cómo vive, siente y sueña nuestro cliente. No fabricamos muebles; creamos extensiones de personalidades, espacios que cuentan historias y ambientes que inspiran cada día.',
        cta: 'Conozca nuestra historia →'
      },
      contact: {
        title: 'Hagamos Realidad',
        subtitle: 'su Visión',
        description: 'Cada proyecto comienza con una conversación. Cuéntenos sobre su espacio, sus sueños y su estilo de vida. Nuestro equipo de diseñadores estará encantado de transformar sus ideas en realidad.'
      },
      social: {
        collaborate: 'Colaboramos con los mejores arquitectos y diseñadores de interiores'
      },
      portfolio: {
        title: 'Inspiración para su',
        subtitle: 'Espacio'
      },
      collections: {
        title: 'Nuestras',
        subtitle: 'Colecciones'
      },
      process: {
        title: 'El Viaje',
        subtitle: 'MADI',
        steps: [
          { step: "01", title: "Consulta y Visión", desc: "Escuchamos sus sueños y analizamos el espacio" },
          { step: "02", title: "Diseño y Visualización 3D", desc: "Creamos renders fotorrealistas de su proyecto" },
          { step: "03", title: "Artesanía y Fabricación", desc: "Nuestros maestros artesanos dan vida al diseño" },
          { step: "04", title: "Entrega e Instalación", desc: "Instalación perfecta en su hogar" }
        ]
      },
      testimonials: {
        title: 'Lo que Dicen Nuestros',
        subtitle: 'Clientes'
      }
    },
    EN: {
      nav: {
        collections: 'Collections',
        projects: 'Projects',
        process: 'Our Process',
        contact: 'Contact',
        startConsultation: 'Start Consultation'
      },
      hero: {
        title: 'Author Furniture.',
        subtitle: 'Designed for your story.',
        description: 'We create exclusive, custom-made pieces that transform spaces. Handcrafted with passion in our Madrid workshop.',
        cta: 'Discover the Possibilities'
      },
      philosophy: {
        title: 'The Art of Creating Spaces,',
        subtitle: 'Not Just Furniture.',
        description: 'At MADI, each piece is born from a deep conversation about how our client lives, feels, and dreams. We don\'t manufacture furniture; we create extensions of personalities, spaces that tell stories, and environments that inspire every day.',
        cta: 'Learn our story →'
      },
      contact: {
        title: 'Let\'s Make Your',
        subtitle: 'Vision Reality',
        description: 'Every project begins with a conversation. Tell us about your space, your dreams, and your lifestyle. Our design team will be delighted to transform your ideas into reality.'
      },
      social: {
        collaborate: 'We collaborate with the best architects and interior designers'
      },
      portfolio: {
        title: 'Inspiration for your',
        subtitle: 'Space'
      },
      collections: {
        title: 'Our',
        subtitle: 'Collections'
      },
      process: {
        title: 'The MADI',
        subtitle: 'Journey',
        steps: [
          { step: "01", title: "Consultation & Vision", desc: "We listen to your dreams and analyze the space" },
          { step: "02", title: "Design & 3D Visualization", desc: "We create photorealistic renders of your project" },
          { step: "03", title: "Craftsmanship & Manufacturing", desc: "Our master craftsmen bring the design to life" },
          { step: "04", title: "Delivery & Installation", desc: "Perfect installation in your home" }
        ]
      },
      testimonials: {
        title: 'What Our',
        subtitle: 'Clients Say'
      }
    }
  };

  const t = translations[language];

  const testimonials = [
    {
      text: language === 'ES' 
        ? "MADI transformó completamente nuestro hogar. Cada pieza es una obra de arte funcional que refleja perfectamente nuestro estilo de vida."
        : "MADI completely transformed our home. Each piece is a functional work of art that perfectly reflects our lifestyle.",
      author: "Elena Rodríguez",
      project: language === 'ES' ? "Reforma integral - Madrid" : "Complete renovation - Madrid"
    },
    {
      text: language === 'ES'
        ? "La atención al detalle y la calidad artesanal de MADI es incomparable. Nuestro vestidor es exactamente como lo soñamos."
        : "MADI's attention to detail and craftsmanship quality is incomparable. Our dressing room is exactly as we dreamed.",
      author: "Carlos Mendoza",
      project: language === 'ES' ? "Vestidor principal - Barcelona" : "Master dressing room - Barcelona"
    },
    {
      text: language === 'ES'
        ? "Trabajar con MADI fue una experiencia extraordinaria. Su proceso de diseño colaborativo hizo realidad nuestra visión."
        : "Working with MADI was an extraordinary experience. Their collaborative design process made our vision a reality.",
      author: "María García",
      project: language === 'ES' ? "Cocina de diseño - Valencia" : "Design kitchen - Valencia"
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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ES' ? 'EN' : 'ES');
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
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-[rgb(180,165,142)]">MADI</div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#colecciones" className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base">
              {t.nav.collections}
            </a>
            <a href="#proyectos" className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base">
              {t.nav.projects}
            </a>
            <a href="#proceso" className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base">
              {t.nav.process}
            </a>
            <a href="#contacto" className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base">
              {t.nav.contact}
            </a>
            <button 
              onClick={toggleLanguage}
              className="text-sm hover:text-[rgb(180,165,142)] transition-colors"
            >
              {language} / {language === 'ES' ? 'EN' : 'ES'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button 
              onClick={toggleLanguage}
              className="text-sm hover:text-[rgb(180,165,142)] transition-colors px-2"
            >
              {language}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-[rgb(180,165,142)]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Desktop CTA */}
          <Button className="hidden lg:block bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] border border-[rgb(180,165,142)] text-sm xl:text-base px-4 xl:px-6">
            {t.nav.startConsultation}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[rgb(14,14,14)] border-t border-gray-800">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a 
                href="#colecciones" 
                className="block py-2 hover:text-[rgb(180,165,142)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.collections}
              </a>
              <a 
                href="#proyectos" 
                className="block py-2 hover:text-[rgb(180,165,142)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.projects}
              </a>
              <a 
                href="#proceso" 
                className="block py-2 hover:text-[rgb(180,165,142)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.process}
              </a>
              <a 
                href="#contacto" 
                className="block py-2 hover:text-[rgb(180,165,142)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.contact}
              </a>
              <Button 
                className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.startConsultation}
              </Button>
            </div>
          </div>
        )}
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
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t.hero.title}<br />
            <span className="text-[rgb(180,165,142)]">{t.hero.subtitle}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            {t.hero.description}
          </p>
          <Button 
            size={isMobile ? "default" : "lg"} 
            className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg"
            onClick={scrollToCollections}
          >
            {t.hero.cta}
          </Button>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-gray-400 text-base sm:text-lg mb-8">
              {t.social.collaborate}
            </p>
            <div className="flex justify-center items-center space-x-8 sm:space-x-12 opacity-60">
              <div className="text-lg sm:text-2xl font-bold">ARQUITECTOS+</div>
              <div className="text-lg sm:text-2xl font-bold">DESIGN STUDIO</div>
              <div className="text-lg sm:text-2xl font-bold">LUXURY HOMES</div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div 
              className="aspect-square bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url('/lovable-uploads/75fee044-f881-4fda-91c4-f03dbec16e0c.png')`,
                filter: 'grayscale(100%)'
              }}
            />
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 leading-tight">
                {t.philosophy.title}<br />
                <span className="text-[rgb(180,165,142)]">{t.philosophy.subtitle}</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                {t.philosophy.description}
              </p>
              <button className="text-[rgb(180,165,142)] text-base sm:text-lg hover:underline">
                {t.philosophy.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="proyectos" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16">
            {t.portfolio.title} <span className="text-[rgb(180,165,142)]">{t.portfolio.subtitle}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
      <section id="colecciones" className="py-16 sm:py-24 bg-[rgb(18,18,18)]">
        <DynamicCollections />
      </section>

      {/* Process Section */}
      <section id="proceso" className="py-16 sm:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            {t.process.title} <span className="text-[rgb(180,165,142)]">{t.process.subtitle}</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {t.process.steps.map((item, index) => (
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
      <section className="py-16 sm:py-24 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            {t.testimonials.title} <span className="text-[rgb(180,165,142)]">{t.testimonials.subtitle}</span>
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
      <section id="contacto" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
                {t.contact.title}<br />
                <span className="text-[rgb(180,165,142)]">{t.contact.subtitle}</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed">
                {t.contact.description}
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(180,165,142)]" />
                  <span className="text-gray-300">+34 643 550 964</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(180,165,142)]" />
                  <span className="text-gray-300">info@madiluxe.com</span>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(180,165,142)] mt-1" />
                  <span className="text-gray-300">C. Bruselas, 17, 28232 Las Rozas de Madrid, Madrid, España</span>
                </div>
              </div>
            </div>
            <div>
              <ContactForm language={language === 'ES' ? 'es' : 'en'} />
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
