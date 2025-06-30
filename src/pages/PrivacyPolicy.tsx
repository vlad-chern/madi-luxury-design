
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
          Política de Privacidad y Protección de Datos
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="mb-6 text-gray-300">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>

          <h2 className="text-2xl font-bold mb-4">1. Responsable del Tratamiento</h2>
          <p className="mb-6 text-gray-300">
            MADI Muebles, con domicilio en C. Bruselas, 17, 28232 Las Rozas de Madrid, Madrid, España,
            es el responsable del tratamiento de sus datos personales de acuerdo con el Reglamento General
            de Protección de Datos (RGPD) de la UE 2016/679 y la Ley Orgánica 3/2018 de Protección de 
            Datos Personales y garantía de los derechos digitales (LOPDGDD).
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Información que Recopilamos</h2>
          <p className="mb-4 text-gray-300">
            En MADI recopilamos información que usted nos proporciona directamente:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-300">
            <li>Datos de contacto (nombre, email, teléfono)</li>
            <li>Información sobre sus consultas y proyectos</li>
            <li>Datos de navegación y cookies técnicas</li>
            <li>Comunicaciones que mantiene con nosotros</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">3. Base Legal y Finalidades del Tratamiento</h2>
          <p className="mb-4 text-gray-300">
            Tratamos sus datos personales con las siguientes bases legales:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-300">
            <li><strong>Consentimiento:</strong> Para el envío de comunicaciones comerciales</li>
            <li><strong>Ejecución contractual:</strong> Para la prestación de nuestros servicios</li>
            <li><strong>Interés legítimo:</strong> Para mejorar nuestros productos y servicios</li>
            <li><strong>Cumplimiento legal:</strong> Para cumplir con obligaciones fiscales y contables</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">4. Sus Derechos según el RGPD</h2>
          <p className="mb-4 text-gray-300">
            Conforme al RGPD y la LOPDGDD, usted tiene derecho a:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-300">
            <li>Acceso a sus datos personales</li>
            <li>Rectificación de datos inexactos</li>
            <li>Supresión de sus datos ("derecho al olvido")</li>
            <li>Limitación del tratamiento</li>
            <li>Portabilidad de los datos</li>
            <li>Oposición al tratamiento</li>
            <li>Revocación del consentimiento</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">5. Conservación de Datos</h2>
          <p className="mb-6 text-gray-300">
            Conservaremos sus datos personales durante el tiempo necesario para cumplir con las
            finalidades para las que fueron recogidos y, en todo caso, durante los plazos establecidos
            por la legislación española aplicable.
          </p>

          <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
          <p className="mb-6 text-gray-300">
            Utilizamos cookies propias y de terceros para mejorar su experiencia de navegación,
            realizar análisis estadísticos y mostrar publicidad personalizada. Puede configurar
            sus preferencias de cookies en cualquier momento a través de nuestro panel de configuración.
          </p>

          <h2 className="text-2xl font-bold mb-4">7. Transferencias Internacionales</h2>
          <p className="mb-6 text-gray-300">
            En caso de realizar transferencias internacionales de datos, estas se realizarán
            conforme a las garantías establecidas en el RGPD, mediante decisiones de adecuación
            o garantías adecuadas.
          </p>

          <h2 className="text-2xl font-bold mb-4">8. Autoridad de Control</h2>
          <p className="mb-6 text-gray-300">
            Tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD)
            si considera que el tratamiento de sus datos personales no se ajusta a la normativa vigente.
          </p>

          <h2 className="text-2xl font-bold mb-4">9. Contacto del Delegado de Protección de Datos</h2>
          <p className="mb-6 text-gray-300">
            Para ejercer sus derechos o resolver cualquier duda sobre el tratamiento de sus datos,
            puede contactarnos en:
          </p>
          <div className="text-gray-300">
            <p>Email: privacy@madiluxe.com</p>
            <p>Dirección: C. Bruselas, 17, 28232 Las Rozas de Madrid, Madrid, España</p>
            <p>Teléfono: +34 643 550 964</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
