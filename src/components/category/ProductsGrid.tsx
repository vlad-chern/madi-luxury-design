
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

interface ProductsGridProps {
  products: Product[];
}

const ProductsGrid = ({ products }: ProductsGridProps) => {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4 text-gray-400">
              No hay productos disponibles en esta categoría
            </h2>
            <Button 
              onClick={() => navigate('/')}
              className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
            >
              Explorar otras categorías
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
