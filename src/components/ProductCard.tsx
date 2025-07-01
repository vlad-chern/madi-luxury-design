
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SafeLink from "./SafeLink";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { validatePhoneNumber } from '@/utils/phoneValidation';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { toast } = useToast();

  const formatPrice = () => {
    if (price_type === 'fixed' && price_fixed) {
      return `${price_fixed}€`;
    } else if (price_type === 'from' && price_from) {
      return `desde ${price_from}€`;
    }
    return 'Precio bajo consulta';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setPhoneNumber(phone);
    
    if (phone && !validatePhoneNumber(phone)) {
      setPhoneError('Teléfono inválido');
    } else {
      setPhoneError('');
    }
  };

  const handleQuickOrder = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Por favor, introduce tu número de teléfono",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Por favor, introduce un número de teléfono válido');
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          customer_name: 'Cliente (pedido rápido)',
          customer_email: 'quick-order@temp.com',
          customer_phone: phoneNumber,
          product_id: id,
          message: `Pedido rápido para producto: ${name}`
        }]);

      if (error) throw error;

      toast({
        title: "Consulta enviada",
        description: "Nos pondremos en contacto contigo muy pronto",
      });
      setPhoneNumber('');
      setPhoneError('');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la consulta",
        variant: "destructive",
      });
    }
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
          
          <div className="flex flex-col gap-3 pt-2">
            <SafeLink
              to={`/product/${category.slug}/${slug}`}
              className="w-full"
            >
              <Button 
                variant="outline" 
                className="w-full border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)] text-sm"
              >
                Ver Detalles
              </Button>
            </SafeLink>
            
            {/* Форма быстрого заказа */}
            <div className="bg-[rgb(18,18,18)] p-3 rounded-lg border border-gray-700">
              <p className="text-gray-300 text-xs mb-2">Pedido rápido</p>
              <div className="space-y-2">
                <Input 
                  type="tel"
                  placeholder="+34 xxx xxx xxx"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`bg-transparent border-gray-600 text-white placeholder-gray-400 text-sm h-8 ${
                    phoneError ? 'border-red-500' : ''
                  }`}
                />
                {phoneError && (
                  <p className="text-red-400 text-xs">{phoneError}</p>
                )}
                <Button 
                  onClick={handleQuickOrder}
                  disabled={!!phoneError || !phoneNumber.trim()}
                  className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] h-8 text-xs"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Llamar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
