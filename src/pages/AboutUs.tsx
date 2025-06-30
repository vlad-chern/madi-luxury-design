import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, MapPin, Instagram, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOHead from '@/components/SEOHead';

const AboutUs = () => {
  const navigate = useNavigate();

  const handleScrollToContact = () => {
    navigate('/');
    setTimeout(() => {
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleScrollToCollections = () => {
    navigate('/');
    setTimeout(() => {
      const collectionsSection = document.getElementById('colecciones');
      if (collectionsSection) {
        collectionsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      <SEOHead 
        title="Quiénes Somos - MADI | Estudio de Diseño de Mobiliario Exclusivo en Madrid"
        description="Conoce la historia de MADI, estudio líder en diseño de mobiliario exclusivo y a medida en Madrid. Soñadores y creadores comprometidos con la excelencia."
        keywords="sobre MADI, estudio diseño Madrid, mobiliario exclusivo, muebles a medida Madrid, diseñadores interiores"
        url="https://madiluxe.com/about"
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
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:text-[rgb(180,165,142)] flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/75fee044-f881-4fda-91c4-f03dbec16e0c.png?w=1920&q=75')`,
            filter: 'brightness(0.3) grayscale(100%)'
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Quiénes <span className="text-[rgb(180,165,142)]">Somos</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            La historia detrás del mobiliario que transforma espacios
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16">
              <div 
                className="aspect-square bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: `url('/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png?w=800&q=75')`,
                  filter: 'grayscale(100%)'
                }}
              />
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-[rgb(180,165,142)]">
                  Nuestra Pasión
                </h2>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
                  Bienvenido a MADI, un estudio líder en diseño de mobiliario exclusivo con sede en Madrid. 
                  Somos un equipo experimentado de diseñadores, arquitectos, decoradores y especialistas 
                  capaces de dar vida a sus ideas más atrevidas.
                </p>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  Nos especializamos en crear muebles únicos, diseñados y fabricados a medida, 
                  transformando cada espacio en un reflejo auténtico de la personalidad de nuestros clientes.
                </p>
              </div>
            </div>

            <div className="bg-[rgb(18,18,18)] rounded-lg p-6 sm:p-8 lg:p-12 mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
                Más que un <span className="text-[rgb(180,165,142)]">Estudio</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 text-center max-w-3xl mx-auto">
                MADI no es sólo un estudio de diseño, es un equipo de soñadores y creadores que aman su trabajo 
                y se enorgullecen de cada proyecto. Cada uno de nuestros proyectos es un reflejo de la singularidad 
                de nuestros clientes y de nuestro compromiso con la excelencia.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[rgb(14,14,14)] font-bold text-xl">3D</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[rgb(180,165,142)]">Visualización 3D</h3>
                  <p className="text-gray-300 text-sm">Te mostramos cómo quedará tu mueble antes de fabricarlo</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[rgb(14,14,14)] font-bold text-xl">100%</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[rgb(180,165,142)]">A Medida</h3>
                  <p className="text-gray-300 text-sm">Adaptamos cada pieza a tu espacio y necesidades específicas</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[rgb(14,14,14)] font-bold text-xl">✨</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[rgb(180,165,142)]">Exclusivo</h3>
                  <p className="text-gray-300 text-sm">Cada mueble es único, como tú y tu estilo</p>
                </div>
              </div>
            </div>

            {/* Working Hours Section */}
            <div className="bg-[rgb(18,18,18)] rounded-lg p-6 sm:p-8 lg:p-12 mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
                Horario de <span className="text-[rgb(180,165,142)]">Atención</span>
              </h2>
              <div className="max-w-2xl mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-[rgb(180,165,142)]" />
                      <span className="text-lg font-semibold">Lunes</span>
                    </div>
                    <span className="text-gray-300">10:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-[rgb(180,165,142)]" />
                      <span className="text-lg font-semibold">Martes</span>
                    </div>
                    <span className="text-gray-300">10:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-[rgb(180,165,142)]" />
                      <span className="text-lg font-semibold">Miércoles</span>
                    </div>
                    <span className="text-gray-300">10:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-[rgb(180,165,142)]" />
                      <span className="text-lg font-semibold">Jueves</span>
                    </div>
                    <span className="text-gray-300">10:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-[rgb(180,165,142)]" />
                      <span className="text-lg font-semibold">Viernes</span>
                    </div>
                    <span className="text-gray-300">10:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-[rgb(180,165,142)]" />
                      <span className="text-lg font-semibold">Sábado</span>
                    </div>
                    <span className="text-gray-300">10:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-red-400" />
                      <span className="text-lg font-semibold">Domingo</span>
                    </div>
                    <span className="text-red-400 font-semibold">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                Tu Mueble de <span className="text-[rgb(180,165,142)]">Ensueño</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
                ¿Necesitas aprovechar un espacio complicado? ¿Buscas un estilo muy específico? 
                Hacemos realidad los muebles de tus sueños, adaptándonos completamente a tus medidas 
                individuales y necesidades. Estamos aquí para ayudarle a vivir en el espacio que 
                siempre ha soñado crear.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-8 py-4"
                  onClick={handleScrollToContact}
                >
                  Empezar mi proyecto
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)] px-8 py-4"
                  onClick={handleScrollToCollections}
                >
                  Ver nuestro trabajo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default AboutUs;
