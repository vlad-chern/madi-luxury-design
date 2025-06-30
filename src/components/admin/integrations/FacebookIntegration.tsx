
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Facebook } from 'lucide-react';

interface FacebookConfig {
  access_token: string;
  pixel_id: string;
  is_active: boolean;
}

interface FacebookIntegrationProps {
  language: 'es' | 'en' | 'ru';
  onUpdate: () => Promise<void>;
}

const FacebookIntegration = ({ language, onUpdate }: FacebookIntegrationProps) => {
  const [config, setConfig] = useState<FacebookConfig>({
    access_token: '',
    pixel_id: '',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Configuración de Facebook CAPI',
      accessToken: 'Token de Acceso',
      pixelId: 'ID del Pixel',
      activate: 'Activar Facebook CAPI',
      save: 'Guardar',
      accessTokenDesc: 'Token de acceso de Facebook para Conversions API',
      pixelIdDesc: 'ID del pixel de Facebook',
      saved: 'Configuración guardada exitosamente',
      error: 'Error al guardar configuración'
    },
    en: {
      title: 'Facebook CAPI Configuration',
      accessToken: 'Access Token',
      pixelId: 'Pixel ID',
      activate: 'Activate Facebook CAPI',
      save: 'Save',
      accessTokenDesc: 'Facebook access token for Conversions API',
      pixelIdDesc: 'Facebook pixel ID',
      saved: 'Configuration saved successfully',
      error: 'Error saving configuration'
    },
    ru: {
      title: 'Настройка Facebook CAPI',
      accessToken: 'Токен Доступа',
      pixelId: 'ID Пикселя',
      activate: 'Активировать Facebook CAPI',
      save: 'Сохранить',
      accessTokenDesc: 'Токен доступа Facebook для Conversions API',
      pixelIdDesc: 'ID пикселя Facebook',
      saved: 'Конфигурация успешно сохранена',
      error: 'Ошибка сохранения конфигурации'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      const { data, error } = await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'integrations',
          action: 'select',
          filters: { name: 'facebook_capi' }
        }
      });

      if (data?.success && data.data?.length > 0) {
        const integration = data.data[0];
        setConfig({
          access_token: integration.config.access_token || '',
          pixel_id: integration.config.pixel_id || '',
          is_active: integration.is_active
        });
      }
    } catch (error) {
      console.error('Error loading Facebook config:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      const { data, error } = await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'integrations',
          action: 'upsert',
          data: {
            name: 'facebook_capi',
            config: {
              access_token: config.access_token,
              pixel_id: config.pixel_id
            },
            is_active: config.is_active
          }
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to save configuration');
      }

      toast({
        title: t.saved,
      });
      
      await onUpdate();
    } catch (error) {
      console.error('Error saving Facebook config:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Facebook className="w-5 h-5" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={config.is_active}
            onCheckedChange={(checked) => 
              setConfig({ ...config, is_active: checked })
            }
          />
          <Label>{t.activate}</Label>
        </div>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="facebook-token">{t.accessToken}</Label>
            <Input
              id="facebook-token"
              type="password"
              placeholder="EAABwzLixnjY..."
              value={config.access_token}
              onChange={(e) => 
                setConfig({ ...config, access_token: e.target.value })
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              {t.accessTokenDesc}
            </p>
          </div>

          <div>
            <Label htmlFor="facebook-pixel">{t.pixelId}</Label>
            <Input
              id="facebook-pixel"
              placeholder="1234567890123456"
              value={config.pixel_id}
              onChange={(e) => 
                setConfig({ ...config, pixel_id: e.target.value })
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              {t.pixelIdDesc}
            </p>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={isLoading}>
          {t.save}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FacebookIntegration;
