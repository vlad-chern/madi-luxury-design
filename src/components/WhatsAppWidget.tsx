
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

const WhatsAppWidget = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleWhatsAppClick = () => {
    const phoneNumber = '34643550964';
    const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus productos MADI.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-[pulse_4s_ease-in-out_infinite]"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default WhatsAppWidget;
