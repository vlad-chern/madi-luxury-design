import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, Product, Category } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOHead from '@/components/SEOHead';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [category]);

  const fetchCategoryAndProducts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch category data
      const { data: categoryResult, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', category)
        .single();
      
      if (categoryError) throw categoryError;
      setCategoryData(categoryResult);

      // Fetch products for this category
      const { data: productsResult, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('category_id', categoryResult.id)
        .eq('is_active', true);
      
      if (productsError) throw productsError;
      setProducts(productsResult || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategorySEOData = () => {
    if (!categoryData) return {};
    
    return {
      title: `${categoryData.name} de Lujo a Medida | MADI - Mobiliario Exclusivo Madrid`,
      description: `Descubre nuestra colección de ${categoryData.name.toLowerCase()} de lujo personalizados. ${categoryData.description || ''} Diseño exclusivo y calidad artesanal premium en Madrid.`,
      keywords: `${categoryData.name} de lujo, ${categoryData.name} a medida Madrid, ${categoryData.name} personalizados, mobiliario exclusivo, MADI luxury design`,
      url: `https://madiluxe.com/category/${categoryData.slug}`,
      type: 'website' as const
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div>Cargando categoría...</div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
          <Button onClick={() => navigate('/')} className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            Volver a inicio
          </Button>
        </div>
      </div>
    );
  }

  const seoData = getCategorySEOData();

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      <SEOHead {...seoData} />
      
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
        </div>
      </nav>

      <div className="pt-20">
        {/* Category Header */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 capitalize">{categoryData.name}</h1>
            {categoryData.description && (
              <p className="text-xl text-gray-300 max-w-3xl">{categoryData.description}</p>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            {products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </section>
      </div>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default CategoryPage;
