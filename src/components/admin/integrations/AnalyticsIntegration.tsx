
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3 } from 'lucide-react';

interface AnalyticsConfig {
  measurement_id?: string;
  container_id?: string;
  is_active: boolean;
}

interface AnalyticsIntegrationProps {
  language: 'es' | 'en' | 'ru';
  onUpdate: () => Promise<void>;
}

const AnalyticsIntegration = ({ language, onUpdate }: AnalyticsIntegrationProps) => {
  const [config, setConfig] = useState<AnalyticsConfig>({
    measurement_id: '',
    container_id: '',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Configuración de Analytics',
      measurementId: 'Measurement ID (GA4)',
      containerId: 'Container ID (GTM)',
      activate: 'Activar Analytics',
      save: 'Guardar',
      measurementIdDesc: 'ID de medición de Google Analytics 4',
      containerIdDesc: 'ID del contenedor de Google Tag Manager',
      saved: 'Configuración guardada exitosamente',
      error: 'Error al guardar configuración'
    },
    en: {
      title: 'Analytics Configuration',
      measurementId: 'Measurement ID (GA4)',
      containerId: 'Container ID (GTM)',
      activate: 'Activate Analytics',
      save: 'Save',
      measurementIdDesc: 'Google Analytics 4 measurement ID',
      containerIdDesc: 'Google Tag Manager container ID',
      saved: 'Configuration saved successfully',
      error: 'Error saving configuration'
    },
    ru: {
      title: 'Настройка Аналитики',
      measurementId: 'Measurement ID (GA4)',
      containerId: 'Container ID (GTM)',
      activate: 'Активировать Аналитику',
      save: 'Сохранить',
      measurementIdDesc: 'ID измерения Google Analytics 4',
      containerIdDesc: 'ID контейнера Google Tag Manager',
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
          filters: { name: 'analytics' }
        }
      });

      if (data?.success && data.data?.length > 0) {
        const integration = data.data[0];
        setConfig({
          measurement_id: integration.config.measurement_id || '',
          container_id: integration.config.container_id || '',
          is_active: integration.is_active
        });
      }
    } catch (error) {
      console.error('Error loading Analytics config:', error);
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
            name: 'analytics',
            config: {
              measurement_id: config.measurement_id,
              container_id: config.container_id
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
      console.error('Error saving Analytics config:', error);
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
          <BarChart3 className="w-5 h-5" />
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
            <Label htmlFor="measurement-id">{t.measurementId}</Label>
            <Input
              id="measurement-id"
              placeholder="G-XXXXXXXXXX"
              value={config.measurement_id || ''}
              onChange={(e) => 
                setConfig({ ...config, measurement_id: e.target.value })
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              {t.measurementIdDesc}
            </p>
          </div>

          <div>
            <Label htmlFor="container-id">{t.containerId}</Label>
            <Input
              id="container-id"
              placeholder="GTM-XXXXXXX"
              value={config.container_id || ''}
              onChange={(e) => 
                setConfig({ ...config, container_id: e.target.value })
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              {t.containerIdDesc}
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

export default AnalyticsIntegration;
