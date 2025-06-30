
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';
import { supabase, Product } from '@/lib/supabase';
import ConsultationForm from '@/components/ConsultationForm';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('slug', productId)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div>Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div>Producto no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[rgb(14,14,14)]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)]/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <div className="text-2xl font-bold text-[rgb(180,165,142)]">MADI</div>
          </div>
          <Button className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            Consultar Precio
          </Button>
        </div>
      </nav>

      {/* Product Header */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={product.images[0] || "/lovable-uploads/12d2af38-c23d-4b9c-8feb-7bd0f637ecb5.png"}
                alt={product.name}
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {product.name}
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {product.description}
              </p>
              <div className="text-3xl font-bold text-[rgb(180,165,142)] mb-8">
                {product.price_type === 'from' && product.price_from
                  ? `Desde ${product.price_from}€`
                  : product.price_fixed
                  ? `${product.price_fixed}€`
                  : 'Precio a consultar'}
              </div>
              <Button 
                size="lg"
                className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] text-lg px-8 py-4"
              >
                Solicitar Consulta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-24 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Includes */}
            <Card className="bg-[rgb(22,22,22)] border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[rgb(180,165,142)]">
                  Incluye
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {product.includes.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-[rgb(180,165,142)] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="bg-[rgb(22,22,22)] border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[rgb(180,165,142)]">
                  Especificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-[rgb(180,165,142)] font-semibold mb-1">
                        {key}
                      </dt>
                      <dd className="text-gray-300">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">¿Te interesa este producto?</h2>
            <p className="text-xl text-gray-400">
              Solicita una consulta personalizada y te ayudaremos a adaptarlo a tu espacio
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ConsultationForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-400">
            &copy; 2024 MADI Muebles. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
