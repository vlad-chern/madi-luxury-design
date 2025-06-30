
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
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
          Política de Privacidad
        </h1>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">1. Información que Recopilamos</h2>
          <p className="mb-6 text-gray-300">
            En MADI recopilamos información que usted nos proporciona directamente, 
            como cuando se pone en contacto con nosotros para solicitar información 
            sobre nuestros productos y servicios.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Uso de la Información</h2>
          <p className="mb-6 text-gray-300">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-300">
            <li>Responder a sus consultas y solicitudes</li>
            <li>Proporcionarle información sobre nuestros productos</li>
            <li>Mejorar nuestros servicios</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">3. Cookies</h2>
          <p className="mb-6 text-gray-300">
            Utilizamos cookies para mejorar su experiencia en nuestro sitio web. 
            Puede configurar sus preferencias de cookies en cualquier momento.
          </p>

          <h2 className="text-2xl font-bold mb-4">4. Contacto</h2>
          <p className="mb-6 text-gray-300">
            Si tiene preguntas sobre esta política de privacidad, puede contactarnos en:
          </p>
          <p className="text-gray-300">
            Email: info@madiluxe.com<br />
            Teléfono: +34 643 550 964
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
