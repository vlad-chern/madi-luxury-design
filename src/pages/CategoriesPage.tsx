
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOHead from '@/components/SEOHead';
import DynamicCollections from '@/components/DynamicCollections';
import { useIsMobile } from '@/hooks/use-mobile';

const CategoriesPage = () => {
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
      hero: {
        title: 'Nuestras',
        subtitle: 'Colecciones',
        description: 'Descubra nuestra selección de mobiliario de autor, cada pieza cuidadosamente diseñada para transformar su espacio en algo único y especial.'
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
      hero: {
        title: 'Our',
        subtitle: 'Collections',
        description: 'Discover our selection of author furniture, each piece carefully designed to transform your space into something unique and special.'
      }
    }
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ES' ? 'EN' : 'ES');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white overflow-x-hidden">
      <SEOHead 
        title="MADI - Colecciones de Mobiliario de Autor | Cocinas, Vestidores y Armarios de Lujo"
        description="Explore las colecciones exclusivas de MADI. Mobiliario de autor personalizado: cocinas de lujo, vestidores únicos y armarios de diseño en Madrid."
        keywords="colecciones muebles lujo, cocinas personalizadas Madrid, vestidores exclusivos, armarios diseño, mobiliario autor"
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
            <a href="/#proyectos" className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base">
              {t.nav.projects}
            </a>
            <a href="/#proceso" className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base">
              {t.nav.process}
            </a>
            <a href="/#contacto" className="hover:text-[rgb(180,165,142)] transition-colors text-sm xl:text-base">
              {t.nav.contact}
            </a>
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
              <a 
                href="/#proyectos" 
                className="block py-2 text-sm hover:text-[rgb(180,165,142)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.projects}
              </a>
              <a 
                href="/#proceso" 
                className="block py-2 text-sm hover:text-[rgb(180,165,142)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.process}
              </a>
              <a 
                href="/#contacto" 
                className="block py-2 text-sm hover:text-[rgb(180,165,142)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.contact}
              </a>
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

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png?w=1920&q=75')`,
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-20">
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            {t.hero.title}<br />
            <span className="text-[rgb(180,165,142)]">{t.hero.subtitle}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            {t.hero.description}
          </p>
          <Button 
            size={isMobile ? "default" : "lg"} 
            className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-6 sm:px-8 md:px-12 py-3 sm:py-4 text-sm sm:text-base md:text-lg"
            onClick={scrollToTop}
          >
            {language === 'ES' ? 'Explorar Colecciones' : 'Explore Collections'}
          </Button>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[rgb(18,18,18)]">
        <DynamicCollections />
      </section>

      {/* Footer */}
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default CategoriesPage;
