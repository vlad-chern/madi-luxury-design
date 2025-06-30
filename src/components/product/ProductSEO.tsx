
import SEOHead from '@/components/SEOHead';
import { Product } from '@/lib/supabase';

interface ProductSEOProps {
  product: Product;
  formatPrice: () => string;
}

const ProductSEO = ({ product, formatPrice }: ProductSEOProps) => {
  const getProductSEOData = () => {
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

  return <SEOHead {...getProductSEOData()} />;
};

export default ProductSEO;
