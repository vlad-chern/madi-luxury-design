
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  language?: 'ES' | 'EN';
}

const Footer = ({ language = 'ES' }: FooterProps) => {
  const translations = {
    ES: {
      navigation: 'Navegación',
      collections: 'Colecciones',
      projects: 'Proyectos',
      process: 'Nuestro Proceso',
      contact: 'Contacto',
      services: 'Servicios',
      customKitchens: 'Cocinas a medida',
      dressings: 'Vestidores',
      wardrobes: 'Armarios',
      integralFurniture: 'Mobiliario integral',
      contactTitle: 'Contacto',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      configureCookies: 'Configurar Cookies',
      rightsReserved: 'Todos los derechos reservados.',
      charityText: 'MADI Muebles apoya a la organización benéfica ucraniana',
      charityText2: ', que fomenta el desarrollo y la iniciativa en niños y jóvenes. Creemos en un futuro mejor para las nuevas generaciones.'
    },
    EN: {
      navigation: 'Navigation',
      collections: 'Collections',
      projects: 'Projects',
      process: 'Our Process',
      contact: 'Contact',
      services: 'Services',
      customKitchens: 'Custom kitchens',
      dressings: 'Dressing rooms',
      wardrobes: 'Wardrobes',
      integralFurniture: 'Integral furniture',
      contactTitle: 'Contact',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      configureCookies: 'Configure Cookies',
      rightsReserved: 'All rights reserved.',
      charityText: 'MADI Furniture supports the Ukrainian charitable organization',
      charityText2: ', which promotes development and initiative in children and youth. We believe in a better future for new generations.'
    }
  };

  const t = translations[language];

  return (
    <footer className="py-16 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src="/lovable-uploads/2ff321c4-11f7-489a-860b-fadf6b38b375.png" 
                alt="MADI Logo" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-400 leading-relaxed">
              {language === 'ES' 
                ? 'Meubles à medida diseñado para contar su historia. Artesanía española con visión contemporánea.'
                : 'Author furniture designed to tell your story. Spanish craftsmanship with contemporary vision.'
              }
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[rgb(180,165,142)]">{t.navigation}</h4>
            <div className="space-y-2">
              <a href="/#colecciones" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">{t.collections}</a>
              <a href="/#proyectos" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">{t.projects}</a>
              <a href="/#proceso" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">{t.process}</a>
              <a href="/#contacto" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">{t.contact}</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[rgb(180,165,142)]">{t.services}</h4>
            <div className="space-y-2">
              <Link to="/category/cocinas" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">{t.customKitchens}</Link>
              <Link to="/category/vestidores" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">{t.dressings}</Link>
              <Link to="/category/armarios" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">{t.wardrobes}</Link>
              <a href="/#contacto" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">{t.integralFurniture}</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[rgb(180,165,142)]">{t.contactTitle}</h4>
            <div className="space-y-2 text-gray-400">
              <a 
                href="https://maps.app.goo.gl/6beX8T3kfirNZwky5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-[rgb(180,165,142)] transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[rgb(180,165,142)]" />
                <span className="text-sm">C. Bruselas, 17, 28232 Las Rozas de Madrid, Madrid, España</span>
              </a>
              <a 
                href="tel:+34643550964"
                className="flex items-center space-x-2 hover:text-[rgb(180,165,142)] transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[rgb(180,165,142)]" />
                <span>+34 643 550 964</span>
              </a>
              <a 
                href="mailto:info@madiluxe.com"
                className="flex items-center space-x-2 hover:text-[rgb(180,165,142)] transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[rgb(180,165,142)]" />
                <span>info@madiluxe.com</span>
              </a>
              <a 
                href="https://instagram.com/madi.luxury.design"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-[rgb(180,165,142)] transition-colors cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-[rgb(180,165,142)]" />
                <span>@madi.luxury.design</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-900">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            {t.charityText}{' '}
            <a 
              href="https://florexa.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-300 transition-colors underline decoration-dotted"
            >
              «Liga de Niños Activos» (ГО «Ліга активних дітей»)
            </a>
            {t.charityText2}
          </p>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p>&copy; 2024 MADI Muebles. {t.rightsReserved}</p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="hover:text-[rgb(180,165,142)] transition-colors">
                {t.privacyPolicy}
              </Link>
              <Link to="/terms-of-service" className="hover:text-[rgb(180,165,142)] transition-colors">
                {t.termsOfService}
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('cookie_consent');
                  window.location.reload();
                }}
                className="hover:text-[rgb(180,165,142)] transition-colors"
              >
                {t.configureCookies}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
