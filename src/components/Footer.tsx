
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
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
              Mobiliario de autor diseñado para contar su historia. 
              Artesanía española con visión contemporánea.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[rgb(180,165,142)]">Navegación</h4>
            <div className="space-y-2">
              <a href="/#colecciones" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Colecciones</a>
              <a href="/#proyectos" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Proyectos</a>
              <a href="/#proceso" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Nuestro Proceso</a>
              <a href="/#contacto" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Contacto</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[rgb(180,165,142)]">Servicios</h4>
            <div className="space-y-2">
              <Link to="/category/cocinas" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Cocinas a medida</Link>
              <Link to="/category/vestidores" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Vestidores</Link>
              <Link to="/category/armarios" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Armarios</Link>
              <a href="/#contacto" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Mobiliario integral</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[rgb(180,165,142)]">Contacto</h4>
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
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p>&copy; 2024 MADI Muebles. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="hover:text-[rgb(180,165,142)] transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terms-of-service" className="hover:text-[rgb(180,165,142)] transition-colors">
                Términos de Servicio
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('cookie_consent');
                  window.location.reload();
                }}
                className="hover:text-[rgb(180,165,142)] transition-colors"
              >
                Configurar Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
