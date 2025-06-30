
import { Star } from 'lucide-react';

interface ProductImageGalleryProps {
  mainImage: string;
}

const ProductImageGallery = ({ mainImage }: ProductImageGalleryProps) => {
  return (
    <div className="space-y-6">
      <div 
        className="aspect-square bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url('${mainImage}')`
        }}
      />
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
