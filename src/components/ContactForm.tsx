
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Send } from 'lucide-react';
import { validatePhoneNumber } from '@/utils/phoneValidation';

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
  const [phoneError, setPhoneError] = useState('');
  const { toast } = useToast();

  const translations = {
    es: {
      title: productName ? `Consulta sobre ${productName}` : 'Contacta con nosotros',
      nameLabel: 'Su nombre',
      namePlaceholder: 'Su nombre',
      emailLabel: 'Su email',
      emailPlaceholder: 'Su email',
      phoneLabel: 'Teléfono',
      phonePlaceholder: '+34 xxx xxx xxx',
      messageLabel: 'Cuéntenos sobre su proyecto...',
      messagePlaceholder: 'Cuéntenos sobre su proyecto...',
      submitButton: 'Enviar Solicitud de Consulta',
      submittingButton: 'Enviando...',
      successTitle: '¡Consulta enviada!',
      successMessage: 'Hemos recibido tu consulta. Nos pondremos en contacto contigo muy pronto.',
      newConsultation: 'Nueva Consulta',
      errorTitle: 'Error',
      errorMessage: 'No se pudo enviar la consulta. Por favor, inténtalo de nuevo.',
      phoneError: 'Por favor, introduce un número de teléfono válido'
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
      errorMessage: 'Could not send the inquiry. Please try again.',
      phoneError: 'Please enter a valid phone number'
    }
  };

  const t = translations[language];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setFormData(prev => ({ ...prev, phone }));
    
    // Валидация телефона при вводе
    if (phone && !validatePhoneNumber(phone)) {
      setPhoneError(t.phoneError);
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем телефон перед отправкой
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      setPhoneError(t.phoneError);
      return;
    }
    
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
    setPhoneError('');
  };

  if (isSubmitted) {
    return (
      <div className="bg-[rgb(22,22,22)] p-8 rounded-lg border border-green-500/20">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-400 mb-2 text-center">
          {t.successTitle}
        </h3>
        <p className="text-gray-300 mb-4 text-center">
          {t.successMessage}
        </p>
        <Button 
          onClick={resetForm} 
          className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
        >
          {t.newConsultation}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[rgb(22,22,22)] p-8 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder={t.namePlaceholder}
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="bg-transparent border-gray-600 text-white placeholder-gray-400"
            required
          />
        </div>

        <div>
          <Input
            type="email"
            placeholder={t.emailPlaceholder}
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="bg-transparent border-gray-600 text-white placeholder-gray-400"
            required
          />
        </div>

        <div>
          <Input
            type="tel"
            placeholder={t.phonePlaceholder}
            value={formData.phone}
            onChange={handlePhoneChange}
            className={`bg-transparent border-gray-600 text-white placeholder-gray-400 ${
              phoneError ? 'border-red-500' : ''
            }`}
          />
          {phoneError && (
            <p className="text-red-400 text-sm mt-1">{phoneError}</p>
          )}
        </div>

        <div>
          <Textarea
            placeholder={t.messagePlaceholder}
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className="bg-transparent border-gray-600 text-white placeholder-gray-400 min-h-32"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] py-3" 
          disabled={isSubmitting || !!phoneError}
        >
          {isSubmitting ? (
            <>
              <Send className="w-4 h-4 mr-2 animate-spin" />
              {t.submittingButton}
            </>
          ) : (
            t.submitButton
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
