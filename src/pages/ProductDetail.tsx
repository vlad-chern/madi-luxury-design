
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Phone, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, Product } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOHead from '@/components/SEOHead';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ContactForm from '@/components/ContactForm';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProduct();

    // Подписка на изменения в таблице products
    const channel = supabase
      .channel('product-detail-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Product updated:', payload);
          // Обновляем только если это тот же товар
          if (payload.new.slug === productId) {
            fetchProduct();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('slug', productId)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      
      console.log('Fetched product:', data);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductSEOData = () => {
    if (!product) return {};
    
    const price = formatPrice().replace('desde ', '').replace('€', '');
    const mainImage = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png';
    
    return {
      title: `${product.name} - ${product.categories?.name} de Lujo | MADI`,
      description: `${product.description} Mobiliario exclusivo de MADI. ${formatPrice()}. Diseño personalizado y calidad artesanal premium en Madrid.`,
      keywords: `${product.name}, ${product.categories?.name}, mobiliario de lujo, muebles a medida Madrid, ${product.categories?.name} personalizados, MADI luxury`,
      image: mainImage,
      url: `https://madiluxe.com/product/${product.slug}`,
      type: 'product' as const,
      price: formatPrice(),
      availability: 'in stock' as const,
      category: product.categories?.name || 'Mobiliario'
    };
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
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Button onClick={() => navigate('/')} className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            Volver a inicio
          </Button>
        </div>
      </div>
    );
  }

  const handleQuickOrder = async () => {
    if (phoneNumber.trim()) {
      try {
        const { error } = await supabase
          .from('orders')
          .insert([{
            customer_name: 'Cliente (pedido rápido)',
            customer_email: 'quick-order@temp.com',
            customer_phone: phoneNumber,
            product_id: product.id,
            message: `Pedido rápido para producto: ${product.name}`
          }]);

        if (error) throw error;

        toast({
          title: "Consulta enviada",
          description: "Nos pondremos en contacto contigo muy pronto",
        });
        setPhoneNumber('');
      } catch (error) {
        console.error('Error creating order:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar la consulta",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Por favor, introduce tu número de teléfono",
        variant: "destructive",
      });
    }
  };

  const formatPrice = () => {
    if (product.price_type === 'fixed' && product.price_fixed) {
      return `${product.price_fixed}€`;
    } else if (product.price_type === 'from' && product.price_from) {
      return `desde ${product.price_from}€`;
    }
    return 'Precio bajo consulta';
  };

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'photo-1586023492125-27b2c045efd7';

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      <SEOHead {...getProductSEOData()} />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[rgb(14,14,14)]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)]/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <div className="text-2xl font-bold text-[rgb(180,165,142)]">MADI</div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
                Solicitar Consulta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Consulta sobre {product.name}</DialogTitle>
              </DialogHeader>
              <ContactForm 
                productId={product.id}
                productName={product.name}
                language="es"
              />
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      <div className="pt-20">
        {/* Product Header */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="text-sm text-[rgb(180,165,142)] mb-4">{product.categories?.name}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{product.name}</h1>
            <div className="text-3xl font-bold text-[rgb(180,165,142)] mb-8">{formatPrice()}</div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="space-y-6">
                <div 
                  className="aspect-square bg-cover bg-center rounded-lg"
                  style={{
                    backgroundImage: `url('${mainImage}')`
                  }}
                />
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[rgb(180,165,142)] text-[rgb(180,165,142)]" />
                  ))}
                  <span className="text-gray-400 ml-2">(5.0) - Calidad Premium</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-[rgb(180,165,142)]">Descripción</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
                </div>

                {product.includes && product.includes.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Incluye</h3>
                    <ul className="space-y-2 text-gray-300">
                      {product.includes.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Especificaciones</h3>
                    <ul className="space-y-2 text-gray-300">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key}>• {key}: {value}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Order */}
                <div className="bg-[rgb(22,22,22)] p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Pedido Rápido</h3>
                  <p className="text-gray-300 mb-4">Introduce tu número de teléfono para contacto inmediato</p>
                  <div className="flex gap-3">
                    <Input 
                      type="tel"
                      placeholder="Tu número de teléfono"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-transparent border-gray-600 text-white placeholder-gray-400 flex-1"
                    />
                    <Button 
                      onClick={handleQuickOrder}
                      className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-6"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Llamar
                    </Button>
                  </div>
                </div>

                {/* Main CTA */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] py-4 text-lg"
                    >
                      Solicitar Consulta Detallada
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Consulta sobre {product.name}</DialogTitle>
                    </DialogHeader>
                    <ContactForm 
                      productId={product.id}
                      productName={product.name}
                      language="es"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose MADI */}
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
      </div>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ProductDetail;
