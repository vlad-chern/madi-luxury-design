
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
          Términos y Condiciones de Servicio
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="mb-6 text-gray-300">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>

          <h2 className="text-2xl font-bold mb-4">1. Información de la Empresa</h2>
          <p className="mb-6 text-gray-300">
            MADI Muebles, con domicilio social en C. Bruselas, 17, 28232 Las Rozas de Madrid, Madrid, España.
            Estos términos se rigen por la legislación española, especialmente por el Código Civil,
            la Ley General para la Defensa de los Consumidores y Usuarios (Real Decreto Legislativo 1/2007)
            y la Ley de Servicios de la Sociedad de la Información (Ley 34/2002).
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Aceptación de los Términos</h2>
          <p className="mb-6 text-gray-300">
            Al acceder y utilizar este sitio web y nuestros servicios, usted acepta expresamente
            cumplir con estos términos de servicio, todas las leyes y regulaciones aplicables en España
            y la Unión Europea. Si no está de acuerdo con alguno de estos términos, no debe utilizar
            nuestros servicios.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. Servicios Ofrecidos</h2>
          <p className="mb-6 text-gray-300">
            MADI ofrece servicios de diseño, fabricación e instalación de mobiliario a medida,
            incluyendo cocinas, vestidores, armarios y mobiliario integral personalizado.
            Todos nuestros servicios se prestan conforme a los estándares de calidad españoles
            y europeos aplicables.
          </p>

          <h2 className="text-2xl font-bold mb-4">4. Condiciones Comerciales</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-300">
            <li>Los precios incluyen IVA según la legislación fiscal española vigente</li>
            <li>Los presupuestos tienen validez de 30 días naturales</li>
            <li>Se requiere señal del 50% para iniciar la fabricación</li>
            <li>Los plazos de entrega son orientativos y sujetos a confirmación</li>
            <li>La instalación se realiza por personal especializado</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">5. Derechos del Consumidor</h2>
          <p className="mb-6 text-gray-300">
            Conforme a la normativa española de protección al consumidor, usted dispone de
            un plazo de 14 días naturales para desistir del contrato sin necesidad de justificación,
            excepto en productos personalizados a medida. La garantía de nuestros productos
            es de 2 años conforme a la legislación europea.
          </p>

          <h2 className="text-2xl font-bold mb-4">6. Propiedad Intelectual</h2>
          <p className="mb-6 text-gray-300">
            Todos los diseños, contenidos, marcas y materiales de este sitio web están protegidos
            por las leyes españolas y europeas de propiedad intelectual e industrial.
            Queda prohibida su reproducción total o parcial sin autorización expresa.
          </p>

          <h2 className="text-2xl font-bold mb-4">7. Limitación de Responsabilidad</h2>
          <p className="mb-6 text-gray-300">
            La responsabilidad de MADI se limita al valor del contrato. No seremos responsables
            de daños indirectos, lucro cesante o perjuicios derivados, salvo en casos de dolo
            o negligencia grave, conforme al artículo 1107 del Código Civil español.
          </p>

          <h2 className="text-2xl font-bold mb-4">8. Resolución de Conflictos</h2>
          <p className="mb-6 text-gray-300">
            Para la resolución de controversias, las partes se someten a los Juzgados y Tribunales
            de Madrid, España. Los consumidores pueden acudir a las Juntas Arbitrales de Consumo
            o a la plataforma europea de resolución de litigios en línea.
          </p>

          <h2 className="text-2xl font-bold mb-4">9. Modificaciones</h2>
          <p className="mb-6 text-gray-300">
            MADI se reserva el derecho a modificar estos términos en cualquier momento.
            Los cambios serán notificados a través de nuestro sitio web y entrarán en vigor
            tras su publicación.
          </p>

          <h2 className="text-2xl font-bold mb-4">10. Contacto</h2>
          <p className="text-gray-300">
            Para consultas sobre estos términos o cualquier aspecto legal:
          </p>
          <div className="mt-4 text-gray-300">
            <p>Email: legal@madiluxe.com</p>
            <p>Dirección: C. Bruselas, 17, 28232 Las Rozas de Madrid, Madrid, España</p>
            <p>Teléfono: +34 643 550 964</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
