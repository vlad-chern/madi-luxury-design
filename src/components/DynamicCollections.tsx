
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '@/utils/imageCompression';

const DynamicCollections = () => {
  const { categories, isLoading, error } = useCategories();
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

  // Если ошибка загрузки, показываем fallback без показа toast
  if (error || !categories.length) {
    return (
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Nuestras <span className="text-[rgb(180,165,142)]">Colecciones</span>
          </h2>
          <p className="text-gray-400 text-lg">
            {error ? 'Error al cargar las colecciones. Intente recargar la página.' : 'Las colecciones se están preparando. Vuelva pronto para ver nuestras creaciones exclusivas.'}
          </p>
        </div>
      </div>
    );
  }

  const getCategoryImage = (category: any) => {
    if (category.image_url) return category.image_url;
    
    // Fallback images из новой структуры папок
    const fallbackImages: { [key: string]: string } = {
      'cocinas': '3473e16d-3e78-4595-83ba-3de762170ac5.png',
      'vestidores': '6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png',
      'armarios': 'c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png'
    };
    
    const fallbackFile = fallbackImages[category.slug] || '52fb3c8e-ed45-4620-a143-5f46300b53b1.png';
    return getImageUrl(fallbackFile, 'categories');
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div key={category.id} className="group">
            <div className="relative overflow-hidden rounded-xl">
              <div 
                className="aspect-video bg-cover bg-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${getCategoryImage(category)}')`
                }}
                onClick={() => handleCategoryClick(category.slug)}
              >
                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                
                {/* Content container - left aligned */}
                <div className="absolute inset-0 flex flex-col justify-center items-start text-left p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[rgb(180,165,142)] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-[rgb(14,14,14)] font-bold text-lg">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-100 mb-6 text-sm md:text-base max-w-xs drop-shadow-md">
                    {category.description || 'Diseño exclusivo y funcional para su hogar'}
                  </p>
                  
                  <Button 
                    className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] group-hover:scale-105 transition-all duration-300 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.slug);
                    }}
                  >
                    Ver Más
                  </Button>
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
