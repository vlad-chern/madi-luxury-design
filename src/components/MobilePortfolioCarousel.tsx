
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import OptimizedImage from './OptimizedImage';

interface MobilePortfolioCarouselProps {
  images: string[];
  title: string;
  subtitle: string;
}

const MobilePortfolioCarousel = ({ images, title, subtitle }: MobilePortfolioCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;

    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
          
          if (isAtEnd) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
          }
        }
      }, 3000);
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    startAutoScroll();

    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener('touchstart', stopAutoScroll);
    scrollElement?.addEventListener('touchend', () => {
      setTimeout(startAutoScroll, 5000);
    });

    return () => {
      stopAutoScroll();
      scrollElement?.removeEventListener('touchstart', stopAutoScroll);
    };
  }, [isMobile]);

  if (!isMobile) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {images.map((image, index) => (
          <OptimizedImage
            key={index}
            src={image}
            alt={`Portfolio image ${index + 1}`}
            className="aspect-square bg-cover bg-center rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
            maxWidth={400}
            maxHeight={400}
            quality={0.7}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center px-2">
        {title} <span className="text-[rgb(180,165,142)]">{subtitle}</span>
      </h2>
      
      <div 
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((image, index) => (
          <OptimizedImage
            key={index}
            src={image}
            alt={`Portfolio image ${index + 1}`}
            className="flex-shrink-0 w-64 h-64 bg-cover bg-center rounded-lg"
            maxWidth={300}
            maxHeight={300}
            quality={0.6}
          />
        ))}
      </div>
    </div>
  );
};

export default MobilePortfolioCarousel;
