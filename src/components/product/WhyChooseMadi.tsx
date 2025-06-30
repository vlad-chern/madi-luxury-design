
import { Star } from 'lucide-react';

const WhyChooseMadi = () => {
  return (
    <section className="py-24 bg-[rgb(18,18,18)]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">
          ¿Por qué elegir <span className="text-[rgb(180,165,142)]">MADI?</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-[rgb(14,14,14)]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Calidad Excepcional</h3>
            <p className="text-gray-300">Materiales premium y acabados artesanales que perduran en el tiempo.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-[rgb(14,14,14)]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Diseño Personalizado</h3>
            <p className="text-gray-300">Cada pieza se adapta perfectamente a tu espacio y estilo de vida.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-[rgb(14,14,14)]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Servicio Integral</h3>
            <p className="text-gray-300">Desde el diseño hasta la instalación, cuidamos cada detalle.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMadi;
