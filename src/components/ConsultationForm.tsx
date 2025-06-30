
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ConsultationFormProps {
  productId?: string;
  productName?: string;
}

const ConsultationForm = ({ productId, productName }: ConsultationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendToTelegram = async (orderData: any) => {
    try {
      const { data: integration } = await supabase
        .from('integrations')
        .select('config, is_active')
        .eq('name', 'telegram')
        .single();

      if (integration?.is_active && integration.config?.bot_token && integration.config?.chat_id) {
        const message = `🔔 Nueva consulta MADILUXE
        
👤 Cliente: ${orderData.customer_name}
📧 Email: ${orderData.customer_email}
📱 Teléfono: ${orderData.customer_phone || 'No especificado'}
🛋️ Producto: ${orderData.product_name || 'Consulta general'}
💬 Mensaje: ${orderData.message || 'Sin mensaje adicional'}
📅 Fecha: ${new Date().toLocaleString('es-ES')}`;

        await fetch(`https://api.telegram.org/bot${integration.config.bot_token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: integration.config.chat_id,
            text: message
          })
        });
      }
    } catch (error) {
      console.error('Error sending to Telegram:', error);
    }
  };

  const sendToFacebook = async (orderData: any) => {
    try {
      const { data: integration } = await supabase
        .from('integrations')
        .select('config, is_active')
        .eq('name', 'facebook_capi')
        .single();

      if (integration?.is_active && integration.config?.access_token && integration.config?.pixel_id) {
        const eventData = {
          data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            user_data: {
              em: [orderData.customer_email.toLowerCase()],
              ph: orderData.customer_phone ? [orderData.customer_phone.replace(/\D/g, '')] : undefined
            },
            custom_data: {
              content_name: orderData.product_name || 'Consulta general',
              content_category: 'Furniture Consultation'
            }
          }]
        };

        await fetch(`https://graph.facebook.com/v18.0/${integration.config.pixel_id}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${integration.config.access_token}`
          },
          body: JSON.stringify(eventData)
        });
      }
    } catch (error) {
      console.error('Error sending to Facebook:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create order
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone || null,
        product_id: productId || null,
        message: formData.message,
        status: 'new' as const
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      // Send to integrations
      const enrichedOrderData = {
        ...orderData,
        product_name: productName
      };

      await Promise.all([
        sendToTelegram(enrichedOrderData),
        sendToFacebook(enrichedOrderData)
      ]);

      toast({
        title: "¡Consulta enviada!",
        description: "Nos pondremos en contacto contigo muy pronto.",
      });

      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la consulta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[rgb(22,22,22)] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">
          {productName ? `Consulta sobre ${productName}` : 'Iniciar Consulta'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">Nombre completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-[rgb(14,14,14)] border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-[rgb(14,14,14)] border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-gray-300">Teléfono (opcional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="bg-[rgb(14,14,14)] border-gray-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="message" className="text-gray-300">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="bg-[rgb(14,14,14)] border-gray-700 text-white"
              placeholder="Cuéntanos sobre tu proyecto..."
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
          >
            {isLoading ? 'Enviando...' : 'Enviar Consulta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConsultationForm;
