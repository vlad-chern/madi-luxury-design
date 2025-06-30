
import { useParams } from 'react-router-dom';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOHead from '@/components/SEOHead';
import CategoryNavigation from '@/components/category/CategoryNavigation';
import CategoryHeader from '@/components/category/CategoryHeader';
import ProductsGrid from '@/components/category/ProductsGrid';
import CategoryNotFound from '@/components/category/CategoryNotFound';
import CategoryLoading from '@/components/category/CategoryLoading';
import { useCategoryData } from '@/hooks/useCategoryData';
import { getCategorySEOData } from '@/utils/categorySEO';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const { products, categoryData, isLoading, error, refetch } = useCategoryData(categorySlug);

  console.log('CategoryPage categorySlug:', categorySlug);

  if (isLoading) {
    return <CategoryLoading />;
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
        <CategoryNavigation />
        
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-400">
              {error || 'Categoría no encontrada'}
            </h1>
            <p className="text-gray-400 mb-6">
              Posiblemente hay un problema con la conexión al servidor o la categoría fue eliminada
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={refetch}
                className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)]"
              >
                Ir a inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const seoData = getCategorySEOData(categoryData);

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      <SEOHead {...seoData} />
      
      <CategoryNavigation />

      <div className="pt-20">
        <CategoryHeader 
          categoryName={categoryData.name}
          categoryDescription={categoryData.description}
        />

        <ProductsGrid products={products} />
      </div>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default CategoryPage;
