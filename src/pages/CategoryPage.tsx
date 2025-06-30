
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, Product, Category } from '@/lib/supabase';

const CategoryPage = () => {
  const { category: categorySlug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [categorySlug]);

  const fetchCategoryAndProducts = async () => {
    if (!categorySlug) return;

    try {
      setIsLoading(true);
      
      // Fetch category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Fetch products in this category
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching category and products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (product: Product) => {
    if (product.price_type === 'fixed' && product.price_fixed) {
      return `${product.price_fixed}€`;
    } else if (product.price_type === 'from' && product.price_from) {
      return `desde ${product.price_from}€`;
    }
    return 'Precio a consultar';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div>Cargando productos...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
          <Button onClick={() => navigate('/')} className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
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
        <section className="py-16 bg-[rgb(18,18,18)]">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{category.description}</p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">No hay productos disponibles</h2>
                <p className="text-gray-400 mb-8">Pronto añadiremos productos en esta categoría</p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
                >
                  Ver todos los productos
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">
                    Productos en <span className="text-[rgb(180,165,142)]">{category.name}</span>
                  </h2>
                  <p className="text-gray-300">
                    {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <div 
                      key={product.id}
                      className="group bg-[rgb(22,22,22)] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      <div 
                        className="h-64 bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'}')`
                        }}
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-[rgb(180,165,142)]">{product.name}</h3>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-[rgb(180,165,142)] text-[rgb(180,165,142)]" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-[rgb(180,165,142)]">
                            {formatPrice(product)}
                          </span>
                          <Button 
                            size="sm"
                            className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
                          >
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
