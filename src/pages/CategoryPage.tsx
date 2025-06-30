
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase, Product, Category } from '@/lib/supabase';
import ConsultationForm from '@/components/ConsultationForm';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [isLoading, setIsLoading] = useState(true);

  const categoryImages = {
    cocinas: "/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png",
    vestidores: "/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png",
    armarios: "/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png"
  };

  useEffect(() => {
    if (category) {
      fetchCategoryData();
      fetchProducts();
    }
  }, [category]);

  const fetchCategoryData = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', category)
        .single();

      if (error) throw error;
      setCategoryData(data);
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            slug
          )
        `)
        .eq('categories.slug', category)
        .eq('is_active', true);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      const priceA = a.price_fixed || a.price_from || 0;
      const priceB = b.price_fixed || b.price_from || 0;
      return priceA - priceB;
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div>Cargando productos...</div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
        <div>Categoría no encontrada</div>
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
          <Button className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            Iniciar Consulta
          </Button>
        </div>
      </nav>

      {/* Category Header */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${categoryImages[category as keyof typeof categoryImages] || categoryImages.cocinas}')`,
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {categoryData.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {categoryData.description}
          </p>
        </div>
      </section>

      {/* Product Listing */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Nuestros Productos</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
              className="bg-[rgb(22,22,22)] text-white rounded-md py-2 px-4 border border-gray-700"
            >
              <option value="name">Ordenar por Nombre</option>
              <option value="price">Ordenar por Precio</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => (
              <Card key={product.id} className="bg-[rgb(22,22,22)] border-gray-800 overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <div className="aspect-w-16 aspect-h-12">
                  <img 
                    src={product.images[0] || "/lovable-uploads/12d2af38-c23d-4b9c-8feb-7bd0f637ecb5.png"}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[rgb(180,165,142)]">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400">{product.description.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[rgb(180,165,142)]">
                      {product.price_type === 'from' && product.price_from
                        ? `Desde ${product.price_from}€`
                        : product.price_fixed
                        ? `${product.price_fixed}€`
                        : 'Precio a consultar'}
                    </span>
                    <Button 
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="py-24 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">¿Interesado en {categoryData.name}?</h2>
            <p className="text-xl text-gray-400">
              Solicita una consulta personalizada y te ayudaremos a crear el espacio perfecto
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ConsultationForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-400">
            &copy; 2024 MADI Muebles. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CategoryPage;
