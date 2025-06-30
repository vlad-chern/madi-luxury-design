
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SafeLink from "./SafeLink";
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price_type: 'fixed' | 'from' | 'consultation';
  price_fixed?: number;
  price_from?: number;
  main_image: string;
  slug: string;
  category: {
    name: string;
    slug: string;
  };
}

const ProductCard = ({ 
  id, 
  name, 
  description, 
  price_type, 
  price_fixed, 
  price_from, 
  main_image, 
  slug, 
  category 
}: ProductCardProps) => {
  const navigate = useNavigate();

  const formatPrice = () => {
    if (price_type === 'fixed' && price_fixed) {
      return `${price_fixed}€`;
    } else if (price_type === 'from' && price_from) {
      return `desde ${price_from}€`;
    }
    return 'Precio bajo consulta';
  };

  const handleContactClick = () => {
    navigate('/');
    setTimeout(() => {
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <Card className="bg-[rgb(22,22,22)] border-gray-800 overflow-hidden group hover:border-[rgb(180,165,142)] transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={main_image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-white mb-2 line-clamp-2">{name}</h3>
            <p className="text-gray-400 text-sm line-clamp-3 mb-3">{description}</p>
            <div className="text-[rgb(180,165,142)] font-semibold text-lg">{formatPrice()}</div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <SafeLink
              to={`/product/${category.slug}/${slug}`}
              className="flex-1"
            >
              <Button 
                variant="outline" 
                className="w-full border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)] text-sm"
              >
                Ver Detalles
              </Button>
            </SafeLink>
            <Button 
              className="flex-1 bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] text-sm"
              onClick={handleContactClick}
            >
              Solicitar Diseño Personalizado
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
