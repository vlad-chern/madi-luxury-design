
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Phone, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase, Product, Category } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch products with categories
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[rgb(14,14,14)]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-[rgb(180,165,142)]">MADI</div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#productos" className="hover:text-[rgb(180,165,142)] transition-colors">Productos</a>
            <a href="#categorias" className="hover:text-[rgb(180,165,142)] transition-colors">Categorías</a>
            <a href="#contacto" className="hover:text-[rgb(180,165,142)] transition-colors">Contacto</a>
          </div>
          <Button className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            <Phone className="w-4 h-4 mr-2" />
            Consulta
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop')"
          }}
        />
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Muebles de <span className="text-[rgb(180,165,142)]">Lujo</span><br />
            Hechos a Medida
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Transformamos espacios en experiencias únicas con diseños exclusivos 
            y acabados artesanales de la más alta calidad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-8 py-4 text-lg"
            >
              Ver Catálogo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)] px-8 py-4 text-lg"
            >
              Solicitar Consulta
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[rgb(180,165,142)]" />
        </div>
      </section>

      {/* Featured Products */}
      <section id="productos" className="py-24 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestros <span className="text-[rgb(180,165,142)]">Productos</span></h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Cada pieza es única, diseñada específicamente para ti y tu espacio
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
                  <p className="text-gray-400 text-sm mb-2">{product.categories?.name}</p>
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
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
            >
              Ver Todos los Productos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestras <span className="text-[rgb(180,165,142)]">Especialidades</span></h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Expertos en cada ambiente de tu hogar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="group relative h-64 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/category/${category.slug}`)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop')"
                  }}
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[rgb(180,165,142)] mb-2">{category.name}</h3>
                    <p className="text-gray-200">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            ¿Por qué elegir <span className="text-[rgb(180,165,142)]">MADI?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-[rgb(14,14,14)]" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Calidad Excepcional</h3>
              <p className="text-gray-300">Materiales premium y acabados artesanales que perduran en el tiempo.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-[rgb(14,14,14)]" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Diseño Personalizado</h3>
              <p className="text-gray-300">Cada pieza se adapta perfectamente a su espacio y estilo de vida.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-[rgb(14,14,14)]" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Servicio Integral</h3>
              <p className="text-gray-300">Desde el diseño hasta la instalación, cuidamos cada detalle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contacto" className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para transformar tu <span className="text-[rgb(180,165,142)]">espacio?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contacta con nuestros expertos para una consulta personalizada gratuita
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-8 py-4 text-lg"
            >
              <Phone className="mr-2 w-5 h-5" />
              Llamar Ahora
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)] px-8 py-4 text-lg"
            >
              Solicitar Catálogo
            </Button>
          </div>
          <div className="mt-8 text-gray-400">
            <p>📧 info@madiluxe.com | 📞 +34 XXX XXX XXX</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
