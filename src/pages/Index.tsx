
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCategories } from '@/hooks/useCategories';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import SEOHead from '@/components/SEOHead';
import ProductCard from '@/components/ProductCard';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import DynamicCollections from '@/components/DynamicCollections';
import { SafeLink } from '@/components/SafeLink';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  useScrollToTop();

  console.log('Index component rendered');

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const { data: products, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(name, slug)
          `)
          .eq('is_active', true)
          .limit(6);

        if (error) {
          console.error('Error loading featured products:', error);
          return;
        }

        setFeaturedProducts(products || []);
      } catch (error) {
        console.error('Error in loadFeaturedProducts:', error);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleCategoryClick = (slug: string) => {
    setMobileMenuOpen(false);
    navigate(`/categoria/${slug}`);
  };

  return (
    <>
      <SEOHead 
        title="Madi Luxury Design - Diseño Interior de Lujo en Madrid"
        description="Transformamos espacios en experiencias únicas. Diseño interior de lujo, mobiliario exclusivo y decoración personalizada en Madrid."
        canonical="https://madiluxe.com"
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <SafeLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">M</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-black">MADI</h1>
                  <p className="text-xs text-gray-600 hidden sm:block">LUXURY DESIGN</p>
                </div>
              </SafeLink>

              {/* Desktop Navigation */}
              {!isMobile && (
                <nav className="hidden md:flex items-center space-x-8">
                  {categories?.map((category) => (
                    <SafeLink
                      key={category.id}
                      to={`/categoria/${category.slug}`}
                      className="text-gray-700 hover:text-black transition-colors font-medium"
                    >
                      {category.name}
                    </SafeLink>
                  ))}
                </nav>
              )}

              {/* Contact Info */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+34 91 234 56 78</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>info@madiluxe.com</span>
                </div>
              </div>

              {/* Mobile Menu Button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            {isMobile && mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t">
                <nav className="flex flex-col space-y-3 mt-4">
                  {categories?.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="text-left text-gray-700 hover:text-black transition-colors font-medium py-2"
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>+34 91 234 56 78</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>info@madiluxe.com</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-900 to-black text-white">
          <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Diseño Interior
                <br className="hidden sm:block" />
                <span className="text-gray-300"> de Lujo</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl">
                Transformamos espacios en experiencias únicas. Mobiliario exclusivo, 
                decoración personalizada y atención al detalle que marca la diferencia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  Ver Catálogo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Contactar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
                Nuestras Categorías
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                Descubre nuestra selección de mobiliario y decoración de lujo
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {categories?.map((category) => (
                <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl font-bold text-gray-400">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm sm:text-base mb-4">
                          {category.description}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => handleCategoryClick(category.slug)}
                        className="w-full"
                      >
                        Ver Productos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
                  Productos Destacados
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                  Una selección de nuestros mejores productos de diseño
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Collections */}
        <DynamicCollections />

        <Footer />
        <WhatsAppWidget />
        <CookieConsent />
      </div>
    </>
  );
};

export default Index;
