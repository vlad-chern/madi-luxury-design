
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Facebook, BarChart3, Tag, ShoppingCart, Package } from 'lucide-react';

import TelegramIntegration from './integrations/TelegramIntegration';
import FacebookIntegration from './integrations/FacebookIntegration';
import ProductFeedIntegration from './integrations/ProductFeedIntegration';
import AnalyticsIntegration from './integrations/AnalyticsIntegration';
import { translations } from './integrations/translations';

interface Integration {
  id: string;
  name: string;
  config: Record<string, any>;
  is_active: boolean;
}

interface IntegrationsManagerProps {
  language: 'es' | 'en' | 'ru';
}

const IntegrationsManager: React.FC<IntegrationsManagerProps> = ({ language }) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [telegramConfig, setTelegramConfig] = useState({
    bot_token: '',
    chat_id: '',
    is_active: false
  });

  const [facebookConfig, setFacebookConfig] = useState({
    access_token: '',
    pixel_id: '',
    is_active: false
  });

  const [gtmConfig, setGtmConfig] = useState({
    container_id: '',
    is_active: false
  });

  const [gaConfig, setGaConfig] = useState({
    measurement_id: '',
    is_active: false
  });

  const [facebookCatalogConfig, setFacebookCatalogConfig] = useState({
    catalog_id: '',
    access_token: '',
    is_active: false
  });

  const [googleMerchantConfig, setGoogleMerchantConfig] = useState({
    merchant_id: '',
    feed_url: '',
    is_active: false
  });

  const t = translations[language];

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*');

      if (error) throw error;

      setIntegrations(data || []);
      
      // Установка конфигураций
      const telegram = data?.find(i => i.name === 'telegram');
      const facebook = data?.find(i => i.name === 'facebook_capi');
      const gtm = data?.find(i => i.name === 'google_tag_manager');
      const ga = data?.find(i => i.name === 'google_analytics');
      const facebookCatalog = data?.find(i => i.name === 'facebook_catalog');
      const googleMerchant = data?.find(i => i.name === 'google_merchant');

      if (telegram) {
        setTelegramConfig({
          bot_token: telegram.config.bot_token || '',
          chat_id: telegram.config.chat_id || '',
          is_active: telegram.is_active
        });
      }

      if (facebook) {
        setFacebookConfig({
          access_token: facebook.config.access_token || '',
          pixel_id: facebook.config.pixel_id || '',
          is_active: facebook.is_active
        });
      }

      if (gtm) {
        setGtmConfig({
          container_id: gtm.config.container_id || '',
          is_active: gtm.is_active
        });
      }

      if (ga) {
        setGaConfig({
          measurement_id: ga.config.measurement_id || '',
          is_active: ga.is_active
        });
      }

      if (facebookCatalog) {
        setFacebookCatalogConfig({
          catalog_id: facebookCatalog.config.catalog_id || '',
          access_token: facebookCatalog.config.access_token || '',
          is_active: facebookCatalog.is_active
        });
      }

      if (googleMerchant) {
        setGoogleMerchantConfig({
          merchant_id: googleMerchant.config.merchant_id || '',
          feed_url: googleMerchant.config.feed_url || '',
          is_active: googleMerchant.is_active
        });
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: t.error,
        description: t.loadError,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateIntegration = async (name: string, config: Record<string, any>, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .upsert({
          name,
          config,
          is_active,
        }, {
          onConflict: 'name'
        });

      if (error) throw error;

      toast({
        title: t.success,
        description: t.integrationUpdated,
      });
      
      fetchIntegrations();
    } catch (error) {
      console.error('Error updating integration:', error);
      toast({
        title: t.error,
        description: t.updateError,
        variant: "destructive",
      });
    }
  };

  const handleTelegramSave = () => {
    updateIntegration('telegram', {
      bot_token: telegramConfig.bot_token,
      chat_id: telegramConfig.chat_id
    }, telegramConfig.is_active);
  };

  const handleFacebookSave = () => {
    updateIntegration('facebook_capi', {
      access_token: facebookConfig.access_token,
      pixel_id: facebookConfig.pixel_id
    }, facebookConfig.is_active);
  };

  const handleGtmSave = () => {
    updateIntegration('google_tag_manager', {
      container_id: gtmConfig.container_id
    }, gtmConfig.is_active);
  };

  const handleGaSave = () => {
    updateIntegration('google_analytics', {
      measurement_id: gaConfig.measurement_id
    }, gaConfig.is_active);
  };

  const handleFacebookCatalogSave = () => {
    updateIntegration('facebook_catalog', {
      catalog_id: facebookCatalogConfig.catalog_id,
      access_token: facebookCatalogConfig.access_token
    }, facebookCatalogConfig.is_active);
  };

  const handleGoogleMerchantSave = () => {
    updateIntegration('google_merchant', {
      merchant_id: googleMerchantConfig.merchant_id,
      feed_url: googleMerchantConfig.feed_url
    }, googleMerchantConfig.is_active);
  };

  if (loading) {
    return <div>{t.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="telegram" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="telegram" className="flex items-center space-x-1">
                <Send className="w-4 h-4" />
                <span>{t.telegram}</span>
              </TabsTrigger>
              <TabsTrigger value="facebook" className="flex items-center space-x-1">
                <Facebook className="w-4 h-4" />
                <span>{t.facebook}</span>
              </TabsTrigger>
              <TabsTrigger value="facebook-catalog" className="flex items-center space-x-1">
                <ShoppingCart className="w-4 h-4" />
                <span>{t.facebookCatalog}</span>
              </TabsTrigger>
              <TabsTrigger value="google-merchant" className="flex items-center space-x-1">
                <Package className="w-4 h-4" />
                <span>{t.googleMerchant}</span>
              </TabsTrigger>
              <TabsTrigger value="gtm" className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>{t.gtm}</span>
              </TabsTrigger>
              <TabsTrigger value="ga" className="flex items-center space-x-1">
                <BarChart3 className="w-4 h-4" />
                <span>{t.ga}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="telegram">
              <TelegramIntegration
                config={telegramConfig}
                onConfigChange={setTelegramConfig}
                onSave={handleTelegramSave}
                translations={t}
              />
            </TabsContent>

            <TabsContent value="facebook">
              <FacebookIntegration
                config={facebookConfig}
                onConfigChange={setFacebookConfig}
                onSave={handleFacebookSave}
                translations={t}
              />
            </TabsContent>

            <TabsContent value="facebook-catalog">
              <ProductFeedIntegration
                type="facebook"
                config={facebookCatalogConfig}
                onConfigChange={setFacebookCatalogConfig}
                onSave={handleFacebookCatalogSave}
                translations={t}
              />
            </TabsContent>

            <TabsContent value="google-merchant">
              <ProductFeedIntegration
                type="google"
                config={googleMerchantConfig}
                onConfigChange={setGoogleMerchantConfig}
                onSave={handleGoogleMerchantSave}
                translations={t}
              />
            </TabsContent>

            <TabsContent value="gtm">
              <AnalyticsIntegration
                type="gtm"
                config={gtmConfig}
                onConfigChange={setGtmConfig}
                onSave={handleGtmSave}
                translations={t}
              />
            </TabsContent>

            <TabsContent value="ga">
              <AnalyticsIntegration
                type="ga"
                config={gaConfig}
                onConfigChange={setGaConfig}
                onSave={handleGaSave}
                translations={t}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsManager;
