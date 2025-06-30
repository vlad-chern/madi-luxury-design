import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase, Product } from '@/lib/supabase';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOHead from '@/components/SEOHead';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ContactForm from '@/components/ContactForm';
import ProductHeader from '@/components/product/ProductHeader';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import QuickOrderForm from '@/components/product/QuickOrderForm';
import WhyChooseMadi from '@/components/product/WhyChooseMadi';
import ProductNavigation from '@/components/product/ProductNavigation';

const ProductDetail = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    console.log('ProductDetail mounted, productSlug:', productSlug);
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
          if (payload.new.slug === productSlug) {
            fetchProduct();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productSlug]);

  const fetchProduct = async () => {
    if (!productSlug) {
      setError('Product slug not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching product with slug:', productSlug);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('slug', productSlug)
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched product:', data);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
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

  if (error) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al cargar el producto</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            Volver a inicio
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-gray-400 mb-4">El producto con slug "{productSlug}" no existe o no está activo.</p>
          <Button onClick={() => navigate('/')} className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            Volver a inicio
          </Button>
        </div>
      </div>
    );
  }

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
      
      <ProductNavigation 
        onBack={() => navigate('/')}
        productId={product.id}
        productName={product.name}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <div className="pt-20">
        <ProductHeader 
          categoryName={product.categories?.name}
          productName={product.name}
          price={formatPrice()}
        />

        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              <ProductImageGallery 
                mainImage={mainImage} 
                images={product.images?.slice(1) || []} 
              />

              <div className="space-y-8">
                <ProductInfo product={product} />

                <QuickOrderForm 
                  productId={product.id}
                  productName={product.name}
                />

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

        <WhyChooseMadi />
      </div>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ProductDetail;
