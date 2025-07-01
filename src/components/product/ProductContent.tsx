import { useState } from 'react';
import { Product } from '@/lib/supabase';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/ContactForm';
import ProductHeader from '@/components/product/ProductHeader';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import QuickOrderForm from '@/components/product/QuickOrderForm';
import WhyChooseMadi from '@/components/product/WhyChooseMadi';
import { getImageUrl } from '@/utils/imageCompression';

interface ProductContentProps {
  product: Product;
  formatPrice: () => string;
}

const ProductContent = ({ product, formatPrice }: ProductContentProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mainImage = product.images && product.images.length > 0 
    ? getImageUrl(product.images[0], 'products')
    : getImageUrl('', 'placeholders');

  console.log('ProductContent - product.images:', product.images);
  console.log('ProductContent - mainImage with proper path:', mainImage);

  return (
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
              images={product.images || []} 
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
  );
};

export default ProductContent;
