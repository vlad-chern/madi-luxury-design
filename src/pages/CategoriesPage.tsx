
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Phone, Mail, MapPin, Menu, X, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOHead from '@/components/SEOHead';
import DynamicCollections from '@/components/DynamicCollections';
import ContactForm from '@/components/ContactForm';
import { useIsMobile } from '@/hooks/use-mobile';

const CategoriesPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const translations = {
    ES: {
      nav: {
        home: 'Inicio',
        collections: 'Colecciones',
        projects: 'Proyectos',
        process: 'Nuestro Proceso',
        contact: 'Contacto',
        startConsultation: 'Iniciar Consulta'
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
      },
      contact: {
        title: 'Hagamos Realidad',
        subtitle: 'su Visión',
        description: 'Cada proyecto comienza con una conversación. Cuéntenos sobre su espacio, sus sueños y su estilo de vida. Nuestro equipo de diseñadores estará encantado de transformar sus ideas en realidad.'
      }
    },
    EN: {
      nav: {
        home: 'Home',
        collections: 'Collections',
        projects: 'Projects',
        process: 'Our Process',
        contact: 'Contact',
        startConsultation: 'Start Consultation'
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
      },
      contact: {
        title: 'Let\'s Make Your',
        subtitle: 'Vision Reality',
        description: 'Every project begins with a conversation. Tell us about your space, your dreams, and your lifestyle. Our design team will be delighted to transform your ideas into reality.'
      }
    }
  };

  const t = translations[language];

  // Function to handle navigation to main page sections
  const handleSectionNavigation = (sectionId: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Testimonials data
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

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ES' ? 'EN' : 'ES');
  };

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white overflow-x-hidden">
      <SEOHead 
        title="MADI - Colecciones de Meubles à Medida | Cocinas, Vestidores y Armarios de Lujo"
        description="Explore las colecciones exclusivas de MADI. Meubles à medida personalizado: cocinas de lujo, vestidores únicos y armarios de diseño en Madrid."
        keywords="colecciones muebles lujo, cocinas personalizadas Madrid, vestidores exclusivos, armarios diseño, meubles à medida"
        url="https://madiluxe.com/colecciones"
        type="website"
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[rgb(14,14,14)]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/2ff321c4-11f7-489a-860b-fadf6b38b375.png" 
              alt="MADI Logo" 
              className="h-6 sm:h-8 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base"
            >
              {t.nav.home}
            </button>
            <span className="text-[rgb(180,165,142)] text-sm xl:text-base font-medium">
              {t.nav.collections}
            </span>
            <button 
              onClick={() => handleSectionNavigation('proyectos')}
              className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base"
            >
              {t.nav.projects}
            </button>
            <button 
              onClick={() => handleSectionNavigation('proceso')}
              className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base"
            >
              {t.nav.process}
            </button>
            <button 
              onClick={() => handleSectionNavigation('contacto')}
              className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base"
            >
              {t.nav.contact}
            </button>
            <button 
              onClick={toggleLanguage}
              className="text-sm hover:text-[rgb(180,165,142)] transition-colors px-2 py-1 rounded border border-gray-600"
            >
              {language} / {language === 'ES' ? 'EN' : 'ES'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button 
              onClick={toggleLanguage}
              className="text-xs hover:text-[rgb(180,165,142)] transition-colors px-2 py-1 rounded border border-gray-600 min-w-[40px]"
            >
              {language}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-[rgb(180,165,142)] p-2"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Desktop CTA */}
          <Button className="hidden lg:block bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] border border-[rgb(180,165,142)] text-sm xl:text-base px-4 xl:px-6 py-2">
            {t.nav.startConsultation}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[rgb(14,14,14)] border-t border-gray-800">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <button 
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-sm hover:text-[rgb(180,165,142)] transition-colors w-full text-left"
              >
                {t.nav.home}
              </button>
              <span className="block py-2 text-sm text-[rgb(180,165,142)] font-medium">
                {t.nav.collections}
              </span>
              <button 
                onClick={() => {
                  handleSectionNavigation('proyectos');
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-sm hover:text-[rgb(180,165,142)] transition-colors w-full text-left"
              >
                {t.nav.projects}
              </button>
              <button 
                onClick={() => {
                  handleSectionNavigation('proceso');
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-sm hover:text-[rgb(180,165,142)] transition-colors w-full text-left"
              >
                {t.nav.process}
              </button>
              <button 
                onClick={() => {
                  handleSectionNavigation('contacto');
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-sm hover:text-[rgb(180,165,142)] transition-colors w-full text-left"
              >
                {t.nav.contact}
              </button>
              <Button 
                className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.startConsultation}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Collections Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[rgb(18,18,18)] mt-16">
        <DynamicCollections />
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 px-2">
            {t.process.title} <span className="text-[rgb(180,165,142)]">{t.process.subtitle}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {t.process.steps.map((item, index) => (
              <div key={index} className="text-center px-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center text-[rgb(14,14,14)] font-bold text-lg sm:text-xl mx-auto mb-4 sm:mb-6">
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[rgb(180,165,142)]">{item.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 px-2">
            {t.testimonials.title} <span className="text-[rgb(180,165,142)]">{t.testimonials.subtitle}</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-[rgb(22,22,22)] rounded-lg p-6 sm:p-8 lg:p-12 text-center">
              <div className="flex justify-center mb-4 sm:mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 sm:w-6 sm:h-6 fill-[rgb(180,165,142)] text-[rgb(180,165,142)]" />
                ))}
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed italic px-2">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="text-[rgb(180,165,142)] font-bold text-base sm:text-lg">
                {testimonials[currentTestimonial].author}
              </div>
              <div className="text-gray-400 text-sm sm:text-base">
                {testimonials[currentTestimonial].project}
              </div>
            </div>
            <div className="flex justify-center items-center mt-6 sm:mt-8 space-x-4">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      index === currentTestimonial ? 'bg-[rgb(180,165,142)]' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <div className="px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8">
                {t.contact.title}<br />
                <span className="text-[rgb(180,165,142)]">{t.contact.subtitle}</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-12 leading-relaxed">
                {t.contact.description}
              </p>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <a 
                  href="tel:+34643550964"
                  className="flex items-center space-x-3 sm:space-x-4 hover:text-[rgb(180,165,142)] transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[rgb(180,165,142)] flex-shrink-0" />
                  <span className="text-gray-300 text-sm sm:text-base">+34 643 550 964</span>
                </a>
                <a 
                  href="mailto:info@madiluxe.com"
                  className="flex items-center space-x-3 sm:space-x-4 hover:text-[rgb(180,165,142)] transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[rgb(180,165,142)] flex-shrink-0" />
                  <span className="text-gray-300 text-sm sm:text-base">info@madiluxe.com</span>
                </a>
                <a 
                  href="https://maps.app.goo.gl/6beX8T3kfirNZwky5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 sm:space-x-4 hover:text-[rgb(180,165,142)] transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[rgb(180,165,142)] flex-shrink-0 mt-1" />
                  <span className="text-gray-300 text-sm sm:text-base">C. Bruselas, 17, 28232 Las Rozas de Madrid, Madrid, España</span>
                </a>
                <a 
                  href="https://instagram.com/madi.luxury.design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 sm:space-x-4 hover:text-[rgb(180,165,142)] transition-colors cursor-pointer"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[rgb(180,165,142)] flex-shrink-0" />
                  <span className="text-gray-300 text-sm sm:text-base">@madi.luxury.design</span>
                </a>
              </div>
            </div>
            <div className="px-2">
              <ContactForm language={language === 'ES' ? 'es' : 'en'} source="categories" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default CategoriesPage;
