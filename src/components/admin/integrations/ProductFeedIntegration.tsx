
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Rss } from 'lucide-react';

interface ProductFeedConfig {
  feed_url?: string;
  catalog_id?: string;
  access_token?: string;
  is_active: boolean;
}

interface ProductFeedIntegrationProps {
  language: 'es' | 'en' | 'ru';
  onUpdate: () => Promise<void>;
}

const ProductFeedIntegration = ({ language, onUpdate }: ProductFeedIntegrationProps) => {
  const [config, setConfig] = useState<ProductFeedConfig>({
    feed_url: '',
    catalog_id: '',
    access_token: '',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Configuración de Feed de Productos',
      feedUrl: 'URL del Feed',
      catalogId: 'ID del Catálogo',
      accessToken: 'Token de Acceso',
      activate: 'Activar Feed de Productos',
      save: 'Guardar',
      generate: 'Generar Feed',
      feedUrlDesc: 'URL del feed XML de productos',
      catalogIdDesc: 'ID del catálogo de Facebook',
      accessTokenDesc: 'Token de acceso para Facebook Catalog',
      saved: 'Configuración guardada exitosamente',
      error: 'Error al guardar configuración',
      feedGenerated: 'Feed generado exitosamente'
    },
    en: {
      title: 'Product Feed Configuration',
      feedUrl: 'Feed URL',
      catalogId: 'Catalog ID',
      accessToken: 'Access Token',
      activate: 'Activate Product Feed',
      save: 'Save',
      generate: 'Generate Feed',
      feedUrlDesc: 'XML product feed URL',
      catalogIdDesc: 'Facebook catalog ID',
      accessTokenDesc: 'Access token for Facebook Catalog',
      saved: 'Configuration saved successfully',
      error: 'Error saving configuration',
      feedGenerated: 'Feed generated successfully'
    },
    ru: {
      title: 'Настройка Ленты Товаров',
      feedUrl: 'URL Ленты',
      catalogId: 'ID Каталога',
      accessToken: 'Токен Доступа',
      activate: 'Активировать Ленту Товаров',
      save: 'Сохранить',
      generate: 'Сгенерировать Ленту',
      feedUrlDesc: 'URL XML ленты товаров',
      catalogIdDesc: 'ID каталога Facebook',
      accessTokenDesc: 'Токен доступа для Facebook Catalog',
      saved: 'Конфигурация успешно сохранена',
      error: 'Ошибка сохранения конфигурации',
      feedGenerated: 'Лента успешно сгенерирована'
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
          filters: { name: 'product_feed' }
        }
      });

      if (data?.success && data.data?.length > 0) {
        const integration = data.data[0];
        setConfig({
          feed_url: integration.config.feed_url || '',
          catalog_id: integration.config.catalog_id || '',
          access_token: integration.config.access_token || '',
          is_active: integration.is_active
        });
      }
    } catch (error) {
      console.error('Error loading Product Feed config:', error);
    }
  };

  const generateFeed = async () => {
    try {
      const { data: response, error } = await supabase.functions.invoke('product-feed-xml');
      
      if (error) throw error;
      
      toast({
        title: t.feedGenerated,
      });
      
      // Обновляем URL на правильный для XML фида
      setConfig({
        ...config,
        feed_url: 'https://goshfdcvsbslvmfvgixb.supabase.co/functions/v1/product-feed-xml'
      });
      
    } catch (error) {
      console.error('Error generating feed:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
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
            name: 'product_feed',
            config: {
              feed_url: config.feed_url,
              catalog_id: config.catalog_id,
              access_token: config.access_token
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
      console.error('Error saving Product Feed config:', error);
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
          <Rss className="w-5 h-5" />
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
            <Label htmlFor="feed-url">{t.feedUrl}</Label>
            <div className="flex gap-2">
              <Input
                id="feed-url"
                placeholder="https://madi.florexa.site/feeds/products.xml"
                value={config.feed_url || ''}
                onChange={(e) => 
                  setConfig({ ...config, feed_url: e.target.value })
                }
                className="flex-1"
              />
              <Button onClick={generateFeed} variant="outline">
                {t.generate}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t.feedUrlDesc}
            </p>
          </div>

          <div>
            <Label htmlFor="catalog-id">{t.catalogId}</Label>
            <Input
              id="catalog-id"
              placeholder="1234567890123456"
              value={config.catalog_id || ''}
              onChange={(e) => 
                setConfig({ ...config, catalog_id: e.target.value })
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              {t.catalogIdDesc}
            </p>
          </div>

          <div>
            <Label htmlFor="access-token">{t.accessToken}</Label>
            <Input
              id="access-token"
              type="password"
              placeholder="EAABwzLixnjY..."
              value={config.access_token || ''}
              onChange={(e) => 
                setConfig({ ...config, access_token: e.target.value })
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              {t.accessTokenDesc}
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

export default ProductFeedIntegration;
