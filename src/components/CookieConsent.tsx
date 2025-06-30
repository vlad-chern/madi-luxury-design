
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const isMobile = useIsMobile();
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: true,
    functional: true
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowConsent(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    localStorage.setItem('cookie_consent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowConsent(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    localStorage.setItem('cookie_consent', JSON.stringify(onlyNecessary));
    setPreferences(onlyNecessary);
    setShowConsent(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-2 md:p-4">
      <Card className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-2xl'}`}>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cookie className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-[rgb(180,165,142)]`} />
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold`}>Cookies</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowConsent(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className={`text-gray-600 mb-4 ${isMobile ? 'text-sm' : ''}`}>
            Utilizamos cookies para mejorar su experiencia. 
            {!isMobile && ' Por defecto, todas las cookies están activadas para brindarle la mejor experiencia posible.'}
          </p>

          {!isMobile && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="mb-4 text-sm"
            >
              {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
            </Button>
          )}

          {(showDetails || !isMobile) && (
            <div className={`space-y-3 mb-4 ${isMobile ? 'text-sm' : ''}`}>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-700">✓ Necesarias</div>
                  {!isMobile && (
                    <div className="text-xs text-gray-500">
                      Esenciales para el funcionamiento.
                    </div>
                  )}
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.necessary} 
                  disabled 
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium">Análisis</div>
                  {!isMobile && (
                    <div className="text-xs text-gray-500">
                      Para entender las interacciones.
                    </div>
                  )}
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="w-4 h-4 accent-[rgb(180,165,142)]"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium">Marketing</div>
                  {!isMobile && (
                    <div className="text-xs text-gray-500">
                      Para anuncios relevantes.
                    </div>
                  )}
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                  className="w-4 h-4 accent-[rgb(180,165,142)]"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                <div>
                  <div className="font-medium">Funcionales</div>
                  {!isMobile && (
                    <div className="text-xs text-gray-500">
                      Funcionalidades mejoradas.
                    </div>
                  )}
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.functional}
                  onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                  className="w-4 h-4 accent-[rgb(180,165,142)]"
                />
              </div>
            </div>
          )}

          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-col sm:flex-row gap-3'}`}>
            <Button 
              onClick={handleAcceptAll}
              className={`bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] ${isMobile ? 'w-full text-sm' : 'flex-1'}`}
            >
              Aceptar Todo
            </Button>
            {showDetails && (
              <Button 
                onClick={handleSavePreferences}
                variant="outline"
                className={`${isMobile ? 'w-full text-sm' : 'flex-1'}`}
              >
                Guardar
              </Button>
            )}
            <Button 
              onClick={handleRejectAll}
              variant="ghost"
              size="sm"
              className={`${isMobile ? 'text-sm' : ''}`}
            >
              Solo Necesarias
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
