
import { useState, useEffect } from 'react';
import { compressImageFromUrl } from '@/utils/imageCompression';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  forceSquare?: boolean; // Add option to force square aspect ratio
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {},
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.9,
  forceSquare = false
}: OptimizedImageProps) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const optimizeImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Only compress if it's a local image (lovable-uploads)
        if (src.includes('lovable-uploads')) {
          const compressed = await compressImageFromUrl(src, maxWidth, maxHeight, quality);
          setOptimizedSrc(compressed);
        } else {
          setOptimizedSrc(src);
        }
      } catch (error) {
        console.warn('Failed to optimize image:', src, error);
        setOptimizedSrc(src);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    optimizeImage();
  }, [src, maxWidth, maxHeight, quality]);

  const containerClasses = forceSquare 
    ? `relative flex items-center justify-center aspect-square ${className}`
    : `relative flex items-center justify-center ${className}`;

  return (
    <div className={containerClasses} style={style}>
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-800 animate-pulse ${forceSquare ? 'rounded-lg' : ''}`} />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${forceSquare ? 'w-full h-full object-cover' : 'w-auto h-auto max-w-full max-h-full object-contain'} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {hasError && (
        <div className={`absolute inset-0 bg-gray-700 flex items-center justify-center ${forceSquare ? 'rounded-lg' : ''}`}>
          <span className="text-gray-400 text-sm">Изображение недоступно</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
