
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
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-2">
      <Card className={`w-full ${isMobile ? 'max-w-[90vw]' : 'max-w-2xl'}`}>
        <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Cookie className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-[rgb(180,165,142)]`} />
              <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold`}>Cookies</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowConsent(false)}
              className="h-auto p-1"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <p className={`text-gray-600 mb-3 ${isMobile ? 'text-xs leading-tight' : 'text-sm'}`}>
            Utilizamos cookies para mejorar su experiencia.
          </p>

          {isMobile ? (
            // Компактная версия для мобильных
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleAcceptAll}
                className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] text-xs py-2 h-auto"
              >
                Aceptar Todo
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowDetails(!showDetails)}
                  variant="outline"
                  className="flex-1 text-xs py-2 h-auto"
                >
                  {showDetails ? 'Ocultar' : 'Detalles'}
                </Button>
                <Button 
                  onClick={handleRejectAll}
                  variant="ghost"
                  className="flex-1 text-xs py-2 h-auto"
                >
                  Solo Necesarias
                </Button>
              </div>
            </div>
          ) : (
            // Версия для десктопа
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="mb-4 text-sm"
              >
                {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
              </Button>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAcceptAll}
                  className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)] flex-1"
                >
                  Aceptar Todo
                </Button>
                {showDetails && (
                  <Button 
                    onClick={handleSavePreferences}
                    variant="outline"
                    className="flex-1"
                  >
                    Guardar
                  </Button>
                )}
                <Button 
                  onClick={handleRejectAll}
                  variant="ghost"
                  size="sm"
                >
                  Solo Necesarias
                </Button>
              </div>
            </>
          )}

          {showDetails && (
            <div className={`space-y-2 mt-3 ${isMobile ? 'text-xs' : ''}`}>
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
                  className="w-3 h-3"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium">Análisis</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="w-3 h-3 accent-[rgb(180,165,142)]"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium">Marketing</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                  className="w-3 h-3 accent-[rgb(180,165,142)]"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                <div>
                  <div className="font-medium">Funcionales</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.functional}
                  onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                  className="w-3 h-3 accent-[rgb(180,165,142)]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
