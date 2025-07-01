
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { validatePhoneNumber } from '@/utils/phoneValidation';

interface QuickOrderFormProps {
  productId: string;
  productName: string;
}

const QuickOrderForm = ({ productId, productName }: QuickOrderFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { toast } = useToast();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setPhoneNumber(phone);
    
    if (phone && !validatePhoneNumber(phone)) {
      setPhoneError('Número de teléfono inválido');
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
          product_id: productId,
          message: `Pedido rápido para producto: ${productName}`
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
    <div className="bg-[rgb(22,22,22)] p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Pedido Rápido</h3>
      <p className="text-gray-300 mb-4">Introduce tu número de teléfono para contacto inmediato</p>
      <div className="space-y-3">
        <div>
          <Input 
            type="tel"
            placeholder="+34 xxx xxx xxx"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={`bg-transparent border-gray-600 text-white placeholder-gray-400 ${
              phoneError ? 'border-red-500' : ''
            }`}
          />
          {phoneError && (
            <p className="text-red-400 text-sm mt-1">{phoneError}</p>
          )}
        </div>
        <Button 
          onClick={handleQuickOrder}
          disabled={!!phoneError || !phoneNumber.trim()}
          className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
        >
          <Phone className="w-4 h-4 mr-2" />
          Llamar
        </Button>
      </div>
    </div>
  );
};

export default QuickOrderForm;
