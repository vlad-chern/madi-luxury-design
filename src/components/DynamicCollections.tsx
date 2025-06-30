
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import { useNavigate } from 'react-router-dom';

const DynamicCollections = () => {
  const { categories, isLoading } = useCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-96 mx-auto mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Nuestras <span className="text-[rgb(180,165,142)]">Colecciones</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Las colecciones se están preparando. Vuelva pronto para ver nuestras creaciones exclusivas.
          </p>
        </div>
      </div>
    );
  }

  const getImageUrl = (category: any) => {
    if (category.image_url) return category.image_url;
    
    // Fallback images basadas en el slug
    const fallbackImages: { [key: string]: string } = {
      'cocinas': '/lovable-uploads/3473e16d-3e78-4595-83ba-3de762170ac5.png',
      'vestidores': '/lovable-uploads/6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png',
      'armarios': '/lovable-uploads/c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'
    };
    
    return fallbackImages[category.slug] || '/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png';
  };

  // Для 1-3 категорий используем специальную сетку
  if (categories.length <= 3) {
    return (
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Nuestras <span className="text-[rgb(180,165,142)]">Colecciones</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Cada colección refleja nuestra pasión por la excelencia y el diseño personalizado
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const colSpan = categories.length === 1 ? 'lg:col-span-3' :
                          categories.length === 2 ? (index === 0 ? 'lg:col-span-2' : 'lg:col-span-1') :
                          (index === 0 ? 'lg:col-span-2' : 'lg:col-span-1');
            
            const aspect = categories.length === 1 ? 'aspect-[21/9]' :
                          categories.length === 2 ? (index === 0 ? 'aspect-[16/10]' : 'aspect-square lg:aspect-auto lg:h-full') :
                          (index === 0 ? 'aspect-[16/10]' : 'aspect-square lg:aspect-auto lg:h-full');

            return (
              <div key={category.id} className={`group ${colSpan}`}>
                <div className="relative overflow-hidden rounded-xl">
                  <div 
                    className={`${aspect} bg-cover bg-center cursor-pointer transition-transform duration-500 group-hover:scale-105`}
                    style={{
                      backgroundImage: `url('${getImageUrl(category)}')`
                    }}
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className={`absolute bottom-0 left-0 right-0 ${index === 0 && categories.length >= 2 ? 'p-8' : 'p-6'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`${index === 0 && categories.length >= 2 ? 'w-12 h-12' : 'w-10 h-10'} bg-[rgb(180,165,142)] rounded-full flex items-center justify-center`}>
                          <span className={`text-[rgb(14,14,14)] font-bold ${index === 0 && categories.length >= 2 ? 'text-lg' : ''}`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className={`${index === 0 && categories.length >= 2 ? 'text-3xl' : 'text-2xl'} font-bold text-white`}>
                          {category.name}
                        </h3>
                      </div>
                      <p className={`text-gray-200 mb-6 ${index === 0 && categories.length >= 2 ? 'text-lg max-w-lg' : ''}`}>
                        {category.description || 'Diseño exclusivo y funcional para su hogar'}
                      </p>
                      <Button 
                        className={`${index === 0 && categories.length >= 2 
                          ? 'bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]' 
                          : index === 2 && categories.length >= 3
                          ? 'bg-transparent border-2 border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)]'
                          : 'bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]'
                        } group-hover:scale-105 transition-all duration-300`}
                        onClick={() => handleCategoryClick(category.slug)}
                      >
                        {index === 0 && categories.length >= 2 ? `Explorar ${category.name} →` : 'Ver Más'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg mb-6">
            ¿No encuentra lo que busca? Creamos soluciones completamente personalizadas.
          </p>
          <Button 
            size="lg"
            className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-8 py-4"
          >
            Solicitar Diseño Personalizado
          </Button>
        </div>
      </div>
    );
  }

  // Для 4+ категорий: первые 3 в сетке, остальные в широком формате
  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Nuestras <span className="text-[rgb(180,165,142)]">Colecciones</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Cada colección refleja nuestra pasión por la excelencia y el diseño personalizado
        </p>
      </div>

      <div className="space-y-8">
        {/* Первые 3 категории в специальной сетке */}
        <div className="grid lg:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((category, index) => {
            const colSpan = index === 0 ? 'lg:col-span-2' : 'lg:col-span-1';
            const aspect = index === 0 ? 'aspect-[16/10]' : 'aspect-square lg:aspect-auto lg:h-full';

            return (
              <div key={category.id} className={`group ${colSpan}`}>
                <div className="relative overflow-hidden rounded-xl">
                  <div 
                    className={`${aspect} bg-cover bg-center cursor-pointer transition-transform duration-500 group-hover:scale-105`}
                    style={{
                      backgroundImage: `url('${getImageUrl(category)}')`
                    }}
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className={`absolute bottom-0 left-0 right-0 ${index === 0 ? 'p-8' : 'p-6'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`${index === 0 ? 'w-12 h-12' : 'w-10 h-10'} bg-[rgb(180,165,142)] rounded-full flex items-center justify-center`}>
                          <span className={`text-[rgb(14,14,14)] font-bold ${index === 0 ? 'text-lg' : ''}`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className={`${index === 0 ? 'text-3xl' : 'text-2xl'} font-bold text-white`}>
                          {category.name}
                        </h3>
                      </div>
                      <p className={`text-gray-200 mb-6 ${index === 0 ? 'text-lg max-w-lg' : ''}`}>
                        {category.description || 'Diseño exclusivo y funcional para su hogar'}
                      </p>
                      <Button 
                        className={`${index === 0 
                          ? 'bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]' 
                          : index === 2
                          ? 'bg-transparent border-2 border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)]'
                          : 'bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]'
                        } group-hover:scale-105 transition-all duration-300`}
                        onClick={() => handleCategoryClick(category.slug)}
                      >
                        {index === 0 ? `Explorar ${category.name} →` : 'Ver Más'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Остальные категории в широком формате */}
        {categories.slice(3).map((category, index) => (
          <div key={category.id} className="group">
            <div className="relative overflow-hidden rounded-xl">
              <div 
                className="aspect-[21/9] bg-cover bg-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${getImageUrl(category)}')`
                }}
                onClick={() => handleCategoryClick(category.slug)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
                <div className="absolute left-0 top-0 bottom-0 flex items-center">
                  <div className="p-8 max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center">
                        <span className="text-[rgb(14,14,14)] font-bold text-lg">
                          {String(index + 4).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-white">{category.name}</h3>
                    </div>
                    <p className="text-gray-200 text-lg mb-6">
                      {category.description || 'Soluciones personalizadas que combinan funcionalidad y diseño impecable.'}
                    </p>
                    <Button 
                      className="bg-transparent border-2 border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)] group-hover:scale-105 transition-all duration-300"
                      onClick={() => handleCategoryClick(category.slug)}
                    >
                      Descubrir {category.name} →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <p className="text-gray-400 text-lg mb-6">
          ¿No encuentra lo que busca? Creamos soluciones completamente personalizadas.
        </p>
        <Button 
          size="lg"
          className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-8 py-4"
        >
          Solicitar Diseño Personalizado
        </Button>
      </div>
    </div>
  );
};

export default DynamicCollections;
