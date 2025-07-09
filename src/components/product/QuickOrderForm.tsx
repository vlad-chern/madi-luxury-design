
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface QuickOrderFormProps {
  productId: string;
  productName: string;
}

const QuickOrderForm = ({ productId, productName }: QuickOrderFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const handleQuickOrder = async () => {
    if (phoneNumber.trim()) {
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

        // Prepare notification data for quick order
        const notificationData = {
          customer_name: 'Cliente (pedido rápido)',
          customer_email: 'quick-order@temp.com',
          customer_phone: phoneNumber,
          product_id: productId,
          product_name: productName,
          message: `Pedido rápido para producto: ${productName}`,
          source_page: 'product_detail',
          timestamp: new Date().toISOString()
        };

        // Send notifications (Telegram, etc.)
        try {
          await supabase.functions.invoke('send-notifications', {
            body: { orderData: notificationData }
          });
        } catch (notificationError) {
          console.error('Failed to send notifications:', notificationError);
          // Don't fail the form submission if notifications fail
        }

        toast({
          title: "Consulta enviada",
          description: "Nos pondremos en contacto contigo muy pronto",
        });
        setPhoneNumber('');
      } catch (error) {
        console.error('Error creating order:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar la consulta",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Por favor, introduce tu número de teléfono",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-[rgb(22,22,22)] p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Pedido Rápido</h3>
      <p className="text-gray-300 mb-4">Introduce tu número de teléfono para contacto inmediato</p>
      <div className="flex gap-3">
        <Input 
          type="tel"
          placeholder="Tu número de teléfono"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="bg-[rgb(32,32,32)] border-0 text-white placeholder:text-gray-400 focus:ring-0 flex-1"
        />
        <Button 
          onClick={handleQuickOrder}
          className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] px-6"
        >
          <Phone className="w-4 h-4 mr-2" />
          Llamar
        </Button>
      </div>
    </div>
  );
};

export default QuickOrderForm;
