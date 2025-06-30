
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-[rgb(180,165,142)] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-[rgb(180,165,142)]">
          Términos de Servicio
        </h1>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
          <p className="mb-6 text-gray-300">
            Al acceder y utilizar este sitio web, usted acepta cumplir con estos 
            términos de servicio y todas las leyes y regulaciones aplicables.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Servicios</h2>
          <p className="mb-6 text-gray-300">
            MADI ofrece servicios de diseño y fabricación de mobiliario a medida, 
            incluyendo cocinas, vestidores y armarios personalizados.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. Propiedad Intelectual</h2>
          <p className="mb-6 text-gray-300">
            Todos los diseños, materiales y contenidos de este sitio web son 
            propiedad de MADI y están protegidos por las leyes de propiedad intelectual.
          </p>

          <h2 className="text-2xl font-bold mb-4">4. Limitación de Responsabilidad</h2>
          <p className="mb-6 text-gray-300">
            MADI no será responsable de daños indirectos, incidentales o 
            consecuentes que puedan surgir del uso de nuestros servicios.
          </p>

          <h2 className="text-2xl font-bold mb-4">5. Contacto</h2>
          <p className="text-gray-300">
            Para consultas sobre estos términos, contacte con nosotros en:
            info@madiluxe.com
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
