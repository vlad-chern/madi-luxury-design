
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Product } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatPrice = () => {
    if (product.price_type === 'fixed' && product.price_fixed) {
      return `${product.price_fixed}€`;
    } else if (product.price_type === 'from' && product.price_from) {
      return `desde ${product.price_from}€`;
    }
    return 'Precio bajo consulta';
  };

  const handleQuickOrder = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Por favor, introduzca su número de teléfono",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          customer_name: 'Cliente (pedido rápido)',
          customer_email: 'quick-order@temp.com',
          customer_phone: phoneNumber,
          product_id: product.id,
          message: `Pedido rápido para: ${product.name}`
        }]);

      if (error) throw error;

      toast({
        title: "¡Solicitud enviada!",
        description: "Nos pondremos en contacto con usted pronto",
      });
      setPhoneNumber('');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png';

  return (
    <Card className="bg-[rgb(22,22,22)] border-gray-800 overflow-hidden hover:bg-[rgb(26,26,26)] transition-all duration-300">
      <div 
        className="aspect-video bg-cover bg-center cursor-pointer relative group"
        style={{
          backgroundImage: `url('${mainImage}')`
        }}
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 
            className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-[rgb(180,165,142)] transition-colors"
            onClick={() => navigate(`/product/${product.slug}`)}
          >
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold text-[rgb(180,165,142)]">
            {formatPrice()}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input 
              type="tel"
              placeholder="Su teléfono"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-transparent border-gray-600 text-white placeholder-gray-400 flex-1"
            />
            <Button 
              onClick={handleQuickOrder}
              disabled={isSubmitting}
              className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-4"
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline"
            onClick={() => navigate(`/product/${product.slug}`)}
            className="w-full border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)]"
          >
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
