import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

interface ContactFormProps {
  language: 'es' | 'en';
  productId?: string;
  productName?: string;
}

const ContactForm = ({ language, productId, productName }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: productName ? `Consulta sobre: ${productName}` : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { trackEvent } = useFacebookPixel();

  const translations = {
    es: {
      name: 'Nombre completo',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      message: 'Cuéntenos sobre su proyecto',
      submit: 'Enviar Consulta',
      sending: 'Enviando...',
      success: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.',
      error: 'Error al enviar el mensaje. Inténtelo de nuevo.',
      required: 'Este campo es obligatorio',
      invalidEmail: 'Correo electrónico no válido',
      invalidPhone: 'Número de teléfono no válido (formato: +34XXXXXXXXX o 6XXXXXXXX)'
    },
    en: {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone',
      message: 'Tell us about your project',
      submit: 'Send Inquiry',
      sending: 'Sending...',
      success: 'Message sent successfully. We will contact you soon.',
      error: 'Error sending message. Please try again.',
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      invalidPhone: 'Invalid phone number (format: +34XXXXXXXXX or 6XXXXXXXX)'
    }
  };

  const t = translations[language];

  const validatePhone = (phone: string) => {
    // Spanish phone number validation (supports +34, 34, 6/7/8/9 prefix)
    const phoneRegex = /^(\+34|34)?[6-9]\d{8}$/;
    const cleanPhone = phone.replace(/\s|-/g, '');
    return phoneRegex.test(cleanPhone);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhone = (phone: string) => {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // If starts with +34, keep it
    if (cleaned.startsWith('+34')) {
      return cleaned;
    }
    
    // If starts with 34, add +
    if (cleaned.startsWith('34')) {
      return '+' + cleaned;
    }
    
    // If starts with 6,7,8,9 add +34
    if (/^[6-9]/.test(cleaned)) {
      return '+34' + cleaned;
    }
    
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'phone') {
      processedValue = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.required;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = t.invalidPhone;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            product_id: productId || null,
            message: formData.message,
            status: 'new'
          }
        ]);

      if (error) throw error;

      // Track Facebook event
      const eventName = productName 
        ? (formData.phone ? 'Purchase' : 'Contact')
        : 'Lead';
      
      trackEvent(eventName, {
        user_data: {
          em: [formData.email],
          ph: formData.phone ? [formData.phone.replace(/\D/g, '')] : undefined
        },
        custom_data: {
          content_name: productName || 'General Consultation',
          content_category: eventName === 'Purchase' ? 'Purchase' : 'Lead Generation',
          value: eventName === 'Purchase' ? 10.00 : 1.00,
          currency: 'EUR'
        }
      });

      toast({
        title: "¡Éxito!",
        description: t.success,
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: productName ? `Consulta sobre: ${productName}` : ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: t.error,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <Input
          type="text"
          name="name"
          placeholder={t.name}
          value={formData.name}
          onChange={handleInputChange}
          className={errors.name ? 'ring-2 ring-red-500' : ''}
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <Input
          type="email"
          name="email"
          placeholder={t.email}
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? 'ring-2 ring-red-500' : ''}
        />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
      </div>
      
      <div>
        <Input
          type="tel"
          name="phone"
          placeholder={t.phone}
          value={formData.phone}
          onChange={handleInputChange}
          className={errors.phone ? 'ring-2 ring-red-500' : ''}
        />
        {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
      </div>
      
      <div>
        <textarea
          name="message"
          placeholder={t.message}
          rows={4}
          value={formData.message}
          onChange={handleInputChange}
          className={`w-full bg-[rgb(32,32,32)] border-0 rounded-md px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 resize-none ${
            errors.message ? 'ring-2 ring-red-500' : ''
          }`}
        />
        {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] py-3 text-base font-medium"
      >
        {isSubmitting ? t.sending : t.submit}
      </Button>
    </form>
  );
};

export default ContactForm;
