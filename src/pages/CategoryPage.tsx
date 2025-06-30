
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

const CategoryPage = () => {
  const { category } = useParams();
  const { products, categoryData, isLoading } = useCategoryData(category);

  if (isLoading) {
    return <CategoryLoading />;
  }

  if (!categoryData) {
    return <CategoryNotFound />;
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
