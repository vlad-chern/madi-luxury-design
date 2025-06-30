
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface ProductsGridProps {
  products: Product[];
}

const ProductsGrid = ({ products }: ProductsGridProps) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = a.price_fixed || a.price_from || 0;
          const priceB = b.price_fixed || b.price_from || 0;
          return priceA - priceB;
        });
      
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = a.price_fixed || a.price_from || 0;
          const priceB = b.price_fixed || b.price_from || 0;
          return priceB - priceA;
        });
      
      default:
        return sorted;
    }
  }, [products, sortBy]);

  if (products.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center py-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-400">
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
      <div className="container mx-auto px-4 sm:px-6">
        {/* Sorting Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="text-gray-400 text-sm sm:text-base">
            {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Select value={sortBy} onValueChange={(value: 'name' | 'price-asc' | 'price-desc') => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[rgb(22,22,22)] border-gray-600 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[rgb(22,22,22)] border-gray-600 z-50">
                <SelectItem value="name" className="text-white hover:bg-gray-700">
                  Alfabético
                </SelectItem>
                <SelectItem value="price-asc" className="text-white hover:bg-gray-700">
                  Precio: Menor a Mayor
                </SelectItem>
                <SelectItem value="price-desc" className="text-white hover:bg-gray-700">
                  Precio: Mayor a Menor
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description || ''}
              price_type={product.price_type as 'fixed' | 'from' | 'consultation'}
              price_fixed={product.price_fixed ? Number(product.price_fixed) : undefined}
              price_from={product.price_from ? Number(product.price_from) : undefined}
              main_image={product.images?.[0] || '/placeholder.svg'}
              slug={product.slug}
              category={{
                name: product.categories?.name || '',
                slug: product.categories?.slug || ''
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
