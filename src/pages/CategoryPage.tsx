import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase, Product } from '@/lib/supabase';

interface CategoryConfig {
  name: string;
  image: string;
  description: string;
}

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [isLoading, setIsLoading] = useState(true);

  const categoryConfigurations: { [key: string]: CategoryConfig } = {
    cocinas: {
      name: "Cocinas",
      image: "/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png",
      description: "Diseños funcionales y elegantes que transforman el corazón del hogar."
    },
    vestidores: {
      name: "Vestidores",
      image: "/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png",
      description: "Organización con estilo: espacios hechos a medida para tu día a día."
    },
    armarios: {
      name: "Armarios y Zonas de Entrada",
      image: "/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png",
      description: "Soluciones que combinan funcionalidad y diseño."
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

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
      // Fallback to static data if needed
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCategory = categoryConfigurations[category as keyof typeof categoryConfigurations] || {
    name: "Categoría no encontrada",
    image: "",
    description: "Descripción no disponible."
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
        <div>Загрузка товаров...</div>
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
            backgroundImage: `url('${currentCategory.image}')`,
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {currentCategory.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {currentCategory.description}
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
              className="bg-[rgb(22,22,22)] text-white rounded-md py-2 px-4"
            >
              <option value="name">Ordenar por Nombre</option>
              <option value="price">Ordenar por Precio</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => (
              <Card key={product.id} className="bg-[rgb(22,22,22)]">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={product.images[0] || "photo-1586023492125-27b2c045efd7"}
                      alt={product.name}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <p className="text-gray-400">{product.description.substring(0, 100)}...</p>
                  <Button 
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
                  >
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
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
