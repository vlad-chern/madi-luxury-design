
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
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
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cookie className="w-6 h-6 text-[rgb(180,165,142)]" />
              <h3 className="text-lg font-bold">Configuración de Cookies</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowConsent(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Utilizamos cookies para mejorar su experiencia en nuestro sitio web. 
            Puede configurar sus preferencias a continuación.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Cookies Necesarias</div>
                <div className="text-sm text-gray-500">
                  Estas cookies son esenciales para el funcionamiento del sitio.
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.necessary} 
                disabled 
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Cookies de Análisis</div>
                <div className="text-sm text-gray-500">
                  Nos ayudan a entender cómo los visitantes interactúan con el sitio.
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.analytics}
                onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Cookies de Marketing</div>
                <div className="text-sm text-gray-500">
                  Se utilizan para mostrar anuncios relevantes.
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.marketing}
                onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Cookies Funcionales</div>
                <div className="text-sm text-gray-500">
                  Permiten funcionalidades mejoradas y personalización.
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.functional}
                onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                className="w-4 h-4"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleAcceptAll}
              className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
            >
              Aceptar Todas
            </Button>
            <Button 
              onClick={handleSavePreferences}
              variant="outline"
            >
              Guardar Preferencias
            </Button>
            <Button 
              onClick={handleRejectAll}
              variant="ghost"
            >
              Rechazar Todas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
