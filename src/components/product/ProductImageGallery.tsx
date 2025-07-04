
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ProductImageGalleryProps {
  mainImage: string;
  images?: string[];
}

const ProductImageGallery = ({ mainImage, images = [] }: ProductImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  console.log('ProductImageGallery - mainImage:', mainImage);
  console.log('ProductImageGallery - images array:', images);
  
  // Создаем массив всех изображений, убираем дубликаты
  const allImages = [mainImage, ...images].filter((image, index, arr) => 
    image && arr.indexOf(image) === index
  );
  
  console.log('ProductImageGallery - allImages after processing:', allImages);
  
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      return '/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png';
    }
    
    // Если это уже полный URL, возвращаем как есть
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Если это путь к lovable-uploads, возвращаем как есть
    if (imagePath.startsWith('/lovable-uploads/') || imagePath.startsWith('lovable-uploads/')) {
      return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    }
    
    return imagePath;
  };
  
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const currentImageUrl = getImageUrl(allImages[selectedImageIndex]);
  console.log('ProductImageGallery - current image URL:', currentImageUrl);

  return (
    <div className="space-y-6">
      {/* Главное изображение */}
      <div className="relative group">
        <div 
          className="aspect-square bg-cover bg-center rounded-lg relative overflow-hidden bg-gray-800"
          style={{
            backgroundImage: `url('${currentImageUrl}')`
          }}
        >
          {/* Навигационные стрелки - показываются при наведении если больше одного изображения */}
          {allImages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 border-white/20 text-white hover:bg-black/90"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 border-white/20 text-white hover:bg-black/90"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Галерея thumbnail изображений - показываем всегда если есть изображения */}
      {allImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400">
            Galería {allImages.length > 1 && `(${allImages.length} fotos)`}
          </h4>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2">
              {allImages.map((image, index) => (
                <CarouselItem key={index} className="pl-2 basis-1/4">
                  <div
                    className={`aspect-square bg-cover bg-center rounded-lg cursor-pointer transition-all duration-200 border-2 bg-gray-800 ${
                      selectedImageIndex === index 
                        ? 'border-[rgb(180,165,142)] shadow-lg' 
                        : 'border-transparent hover:border-gray-600'
                    }`}
                    style={{
                      backgroundImage: `url('${getImageUrl(image)}')`
                    }}
                    onClick={() => handleThumbnailClick(index)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {allImages.length > 4 && (
              <>
                <CarouselPrevious className="text-white border-white/20 hover:bg-white/10 bg-black/50" />
                <CarouselNext className="text-white border-white/20 hover:bg-white/10 bg-black/50" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Рейтинг */}
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-5 h-5 fill-[rgb(180,165,142)] text-[rgb(180,165,142)]" />
        ))}
        <span className="text-gray-400 ml-2">(5.0) - Calidad Premium</span>
      </div>
    </div>
  );
};

export default ProductImageGallery;
