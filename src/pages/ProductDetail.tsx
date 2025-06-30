
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import ProductNavigation from '@/components/product/ProductNavigation';
import ProductSEO from '@/components/product/ProductSEO';
import ProductContent from '@/components/product/ProductContent';
import { ProductLoading, ProductError, ProductNotFound } from '@/components/product/ProductStates';
import { useProductDetail } from '@/hooks/useProductDetail';

const ProductDetail = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { product, isLoading, error } = useProductDetail(productSlug);

  const formatPrice = () => {
    if (!product) return 'Precio bajo consulta';
    
    if (product.price_type === 'fixed' && product.price_fixed) {
      return `${product.price_fixed}€`;
    } else if (product.price_type === 'from' && product.price_from) {
      return `desde ${product.price_from}€`;
    }
    return 'Precio bajo consulta';
  };

  const handleBack = () => navigate('/');

  if (isLoading) {
    return <ProductLoading />;
  }

  if (error) {
    return <ProductError error={error} onBack={handleBack} />;
  }

  if (!product) {
    return <ProductNotFound productSlug={productSlug} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      <ProductSEO product={product} formatPrice={formatPrice} />
      
      <ProductNavigation 
        onBack={handleBack}
        productId={product.id}
        productName={product.name}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <ProductContent product={product} formatPrice={formatPrice} />

      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ProductDetail;
