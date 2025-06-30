
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, Category, Product } from '@/lib/supabase';
import ConsultationForm from '@/components/ConsultationForm';

const Index = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
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

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const categoryImages = {
    cocinas: "/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png",
    vestidores: "/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png",
    armarios: "/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png"
  };

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[rgb(14,14,14)]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-[rgb(180,165,142)]">MADI</div>
          <div className="hidden md:flex space-x-8">
            <a href="#categories" className="text-gray-300 hover:text-[rgb(180,165,142)] transition-colors">Categorías</a>
            <a href="#products" className="text-gray-300 hover:text-[rgb(180,165,142)] transition-colors">Productos</a>
            <a href="#contact" className="text-gray-300 hover:text-[rgb(180,165,142)] transition-colors">Contacto</a>
          </div>
          <Button className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
            Iniciar Consulta
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/12d2af38-c23d-4b9c-8feb-7bd0f637ecb5.png')",
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Muebles de Lujo
            <span className="block text-[rgb(180,165,142)]">Hechos a Medida</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transformamos espacios con diseños únicos que reflejan tu personalidad y estilo de vida
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] text-lg px-8 py-4"
            >
              Explorar Catálogo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)] text-lg px-8 py-4"
            >
              Consulta Gratuita
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Nuestras Especialidades</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Cada pieza es una obra de arte funcional, diseñada para durar generaciones
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="bg-[rgb(22,22,22)] border-gray-800 overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/category/${category.slug}`)}
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img 
                    src={categoryImages[category.slug as keyof typeof categoryImages] || categoryImages.cocinas}
                    alt={category.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-[rgb(180,165,142)]">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">{category.description}</p>
                  <Button 
                    variant="outline" 
                    className="border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)]"
                  >
                    Ver Más
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section id="products" className="py-24 bg-[rgb(18,18,18)]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Productos Destacados</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Diseños exclusivos que combinan elegancia y funcionalidad
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
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
      )}

      {/* Consultation Form Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Comienza Tu Proyecto</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Cuéntanos sobre tu visión y crearemos algo extraordinario juntos
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ConsultationForm />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[rgb(18,18,18)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Contacto</h2>
            <p className="text-xl text-gray-400">Estamos aquí para hacer realidad tus ideas</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-[rgb(22,22,22)] border-gray-800 text-center">
              <CardContent className="pt-8">
                <Phone className="w-12 h-12 mx-auto mb-4 text-[rgb(180,165,142)]" />
                <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
                <p className="text-gray-400">+34 XXX XXX XXX</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[rgb(22,22,22)] border-gray-800 text-center">
              <CardContent className="pt-8">
                <Mail className="w-12 h-12 mx-auto mb-4 text-[rgb(180,165,142)]" />
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-400">info@madiluxe.com</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[rgb(22,22,22)] border-gray-800 text-center">
              <CardContent className="pt-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-[rgb(180,165,142)]" />
                <h3 className="text-xl font-semibold mb-2">Ubicación</h3>
                <p className="text-gray-400">España</p>
              </CardContent>
            </Card>
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

export default Index;
