
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Send } from 'lucide-react';

interface ContactFormProps {
  productId?: string;
  productName?: string;
  language?: 'es' | 'en';
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  productId, 
  productName, 
  language = 'es' 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const translations = {
    es: {
      title: productName ? `Consulta sobre ${productName}` : 'Contacta con nosotros',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Tu nombre y apellidos',
      emailLabel: 'Email',
      emailPlaceholder: 'tu@email.com',
      phoneLabel: 'Teléfono (opcional)',
      phonePlaceholder: '+34 xxx xxx xxx',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Cuéntanos más sobre tu proyecto...',
      submitButton: 'Enviar Consulta',
      submittingButton: 'Enviando...',
      successTitle: '¡Consulta enviada!',
      successMessage: 'Hemos recibido tu consulta. Nos pondremos en contacto contigo muy pronto.',
      newConsultation: 'Nueva Consulta',
      errorTitle: 'Error',
      errorMessage: 'No se pudo enviar la consulta. Por favor, inténtalo de nuevo.'
    },
    en: {
      title: productName ? `Inquiry about ${productName}` : 'Contact us',
      nameLabel: 'Full name',
      namePlaceholder: 'Your full name',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'Phone (optional)',
      phonePlaceholder: '+34 xxx xxx xxx',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell us more about your project...',
      submitButton: 'Send Inquiry',
      submittingButton: 'Sending...',
      successTitle: 'Inquiry sent!',
      successMessage: 'We have received your inquiry. We will contact you very soon.',
      newConsultation: 'New Consultation',
      errorTitle: 'Error',
      errorMessage: 'Could not send the inquiry. Please try again.'
    }
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Guardar en la base de datos
      const { data: orderData, error } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone || null,
          product_id: productId || null,
          message: formData.message,
          status: 'new'
        })
        .select()
        .single();

      if (error) throw error;

      // Enviar notificaciones
      const notificationData = {
        ...formData,
        product_name: productName,
        order_id: orderData.id
      };

      try {
        await supabase.functions.invoke('send-notifications', {
          body: { orderData: notificationData }
        });
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
        // No mostramos error al usuario por las notificaciones
      }

      setIsSubmitted(true);
      toast({
        title: t.successTitle,
        description: t.successMessage,
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t.errorTitle,
        description: t.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          {t.successTitle}
        </h3>
        <p className="text-green-700 mb-4">
          {t.successMessage}
        </p>
        <Button onClick={resetForm} variant="outline">
          {t.newConsultation}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6">{t.title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">{t.nameLabel} *</Label>
          <Input
            id="name"
            type="text"
            placeholder={t.namePlaceholder}
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">{t.emailLabel} *</Label>
          <Input
            id="email"
            type="email"
            placeholder={t.emailPlaceholder}
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">{t.phoneLabel}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t.phonePlaceholder}
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="message">{t.messageLabel}</Label>
          <Textarea
            id="message"
            placeholder={t.messagePlaceholder}
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Send className="w-4 h-4 mr-2 animate-spin" />
              {t.submittingButton}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {t.submitButton}
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
