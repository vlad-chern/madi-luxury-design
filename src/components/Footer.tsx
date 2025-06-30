
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
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
              <a href="/#colecciones" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Colecciones</a>
              <a href="/#proyectos" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Proyectos</a>
              <a href="/#proceso" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Nuestro Proceso</a>
              <a href="/#contacto" className="block text-gray-400 hover:text-[rgb(180,165,142)] transition-colors">Contacto</a>
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
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[rgb(180,165,142)]" />
                <span className="text-sm">C. Bruselas, 17, 28232 Las Rozas de Madrid, Madrid, España</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[rgb(180,165,142)]" />
                <span>+34 643 550 964</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[rgb(180,165,142)]" />
                <span>info@madiluxe.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 MADI Muebles. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
