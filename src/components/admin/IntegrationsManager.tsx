import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Facebook, BarChart3, Tag, ShoppingCart, Package } from 'lucide-react';

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

  const translations = {
    es: {
      title: 'Gestión de Integraciones',
      telegram: 'Telegram',
      facebook: 'Facebook CAPI',
      gtm: 'Google Tag Manager',
      ga: 'Google Analytics',
      loading: 'Cargando integraciones...',
      activateTelegram: 'Activar notificaciones de Telegram',
      botToken: 'Bot Token',
      chatId: 'Chat ID',
      saveTelegram: 'Guardar Configuración de Telegram',
      activateFacebook: 'Activar Facebook Conversions API',
      accessToken: 'Access Token',
      pixelId: 'Pixel ID',
      saveFacebook: 'Guardar Configuración de Facebook',
      activateGtm: 'Activar Google Tag Manager',
      containerId: 'Container ID',
      saveGtm: 'Guardar Configuración de GTM',
      activateGa: 'Activar Google Analytics',
      measurementId: 'Measurement ID',
      saveGa: 'Guardar Configuración de GA',
      success: 'Éxito',
      integrationUpdated: 'Integración actualizada correctamente',
      error: 'Error',
      updateError: 'No se pudo actualizar la integración',
      loadError: 'No se pudieron cargar las integraciones',
      botTokenDesc: 'Token del bot de Telegram (obtenido de @BotFather)',
      chatIdDesc: 'ID del chat o grupo donde enviar las notificaciones',
      accessTokenDesc: 'Token de acceso de Facebook para la API de conversiones',
      pixelIdDesc: 'ID del pixel de Facebook',
      containerIdDesc: 'ID del contenedor de Google Tag Manager (GTM-XXXXXXX)',
      measurementIdDesc: 'ID de medición de Google Analytics (G-XXXXXXXXXX)',
      facebookCatalog: 'Facebook Catalog',
      googleMerchant: 'Google Merchant',
      activateFacebookCatalog: 'Activar Facebook Catalog',
      catalogId: 'Catalog ID',
      activateGoogleMerchant: 'Activar Google Merchant Center',
      merchantId: 'Merchant ID',
      feedUrl: 'Feed URL',
      saveFacebookCatalog: 'Guardar Configuración de Catalog',
      saveGoogleMerchant: 'Guardar Configuración de Merchant',
      catalogIdDesc: 'ID del catálogo de Facebook',
      merchantIdDesc: 'ID de Google Merchant Center',
      feedUrlDesc: 'URL del feed de productos (se generará automáticamente)',
      generateProductFeed: 'Generar Feed de Productos',
      feedGenerated: 'Feed generado exitosamente',
      feedError: 'Error al generar el feed'
    },
    en: {
      title: 'Integrations Management',
      telegram: 'Telegram',
      facebook: 'Facebook CAPI',
      gtm: 'Google Tag Manager',
      ga: 'Google Analytics',
      loading: 'Loading integrations...',
      activateTelegram: 'Activate Telegram notifications',
      botToken: 'Bot Token',
      chatId: 'Chat ID',
      saveTelegram: 'Save Telegram Configuration',
      activateFacebook: 'Activate Facebook Conversions API',
      accessToken: 'Access Token',
      pixelId: 'Pixel ID',
      saveFacebook: 'Save Facebook Configuration',
      activateGtm: 'Activate Google Tag Manager',
      containerId: 'Container ID',
      saveGtm: 'Save GTM Configuration',
      activateGa: 'Activate Google Analytics',
      measurementId: 'Measurement ID',
      saveGa: 'Save GA Configuration',
      success: 'Success',
      integrationUpdated: 'Integration updated successfully',
      error: 'Error',
      updateError: 'Could not update integration',
      loadError: 'Could not load integrations',
      botTokenDesc: 'Telegram bot token (obtained from @BotFather)',
      chatIdDesc: 'Chat or group ID to send notifications to',
      accessTokenDesc: 'Facebook access token for conversions API',
      pixelIdDesc: 'Facebook pixel ID',
      containerIdDesc: 'Google Tag Manager container ID (GTM-XXXXXXX)',
      measurementIdDesc: 'Google Analytics measurement ID (G-XXXXXXXXXX)',
      facebookCatalog: 'Facebook Catalog',
      googleMerchant: 'Google Merchant',
      activateFacebookCatalog: 'Activate Facebook Catalog',
      catalogId: 'Catalog ID',
      activateGoogleMerchant: 'Activate Google Merchant Center',
      merchantId: 'Merchant ID',
      feedUrl: 'Feed URL',
      saveFacebookCatalog: 'Save Catalog Configuration',
      saveGoogleMerchant: 'Save Merchant Configuration',
      catalogIdDesc: 'Facebook catalog ID',
      merchantIdDesc: 'Google Merchant Center ID',
      feedUrlDesc: 'Product feed URL (will be generated automatically)',
      generateProductFeed: 'Generate Product Feed',
      feedGenerated: 'Feed generated successfully',
      feedError: 'Error generating feed'
    },
    ru: {
      title: 'Управление интеграциями',
      telegram: 'Telegram',
      facebook: 'Facebook CAPI',
      gtm: 'Google Tag Manager',
      ga: 'Google Analytics',
      loading: 'Загрузка интеграций...',
      activateTelegram: 'Активировать уведомления Telegram',
      botToken: 'Токен бота',
      chatId: 'ID чата',
      saveTelegram: 'Сохранить настройки Telegram',
      activateFacebook: 'Активировать Facebook Conversions API',
      accessToken: 'Токен доступа',
      pixelId: 'ID пикселя',
      saveFacebook: 'Сохранить настройки Facebook',
      activateGtm: 'Активировать Google Tag Manager',
      containerId: 'ID контейнера',
      saveGtm: 'Сохранить настройки GTM',
      activateGa: 'Активировать Google Analytics',
      measurementId: 'ID измерения',
      saveGa: 'Сохранить настройки GA',
      success: 'Успех',
      integrationUpdated: 'Интеграция успешно обновлена',
      error: 'Ошибка',
      updateError: 'Не удалось обновить интеграцию',
      loadError: 'Не удалось загрузить интеграции',
      botTokenDesc: 'Токен бота Telegram (получен от @BotFather)',
      chatIdDesc: 'ID чата или группы для отправки уведомлений',
      accessTokenDesc: 'Токен доступа Facebook для API конверсий',
      pixelIdDesc: 'ID пикселя Facebook',
      containerIdDesc: 'Google Tag Manager контейнер ID (GTM-XXXXXXX)',
      measurementIdDesc: 'ID измерения Google Analytics (G-XXXXXXXXXX)',
      facebookCatalog: 'Facebook Catalog',
      googleMerchant: 'Google Merchant',
      activateFacebookCatalog: 'Активировать Facebook Catalog',
      catalogId: 'ID каталога',
      activateGoogleMerchant: 'Активировать Google Merchant Center',
      merchantId: 'ID магазина',
      feedUrl: 'URL фида',
      saveFacebookCatalog: 'Сохранить настройки каталога',
      saveGoogleMerchant: 'Сохранить настройки магазина',
      catalogIdDesc: 'ID каталога Facebook',
      merchantIdDesc: 'ID Google Merchant Center',
      feedUrlDesc: 'URL фида товаров (будет сгенерирован автоматически)',
      generateProductFeed: 'Генерировать фид товаров',
      feedGenerated: 'Фид успешно сгенерирован',
      feedError: 'Ошибка генерации фида'
    }
  };

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

  const generateProductFeed = async () => {
    try {
      const { data: response, error } = await supabase.functions.invoke('generate-product-feed');
      
      if (error) throw error;
      
      toast({
        title: t.success,
        description: t.feedGenerated,
      });
      
      // Update feed URL in Google Merchant config
      setGoogleMerchantConfig(prev => ({
        ...prev,
        feed_url: response?.feed_url || prev.feed_url
      }));
      
    } catch (error) {
      console.error('Error generating feed:', error);
      toast({
        title: t.error,
        description: t.feedError,
        variant: "destructive",
      });
    }
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

            <TabsContent value="telegram" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={telegramConfig.is_active}
                    onCheckedChange={(checked) => 
                      setTelegramConfig(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label>{t.activateTelegram}</Label>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="telegram-token">{t.botToken}</Label>
                    <Input
                      id="telegram-token"
                      type="password"
                      placeholder="1234567890:ABCDEFghijklmnopQRSTUVwxyz123456789"
                      value={telegramConfig.bot_token}
                      onChange={(e) => 
                        setTelegramConfig(prev => ({ ...prev, bot_token: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.botTokenDesc}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="telegram-chat">{t.chatId}</Label>
                    <Input
                      id="telegram-chat"
                      placeholder="-1001234567890"
                      value={telegramConfig.chat_id}
                      onChange={(e) => 
                        setTelegramConfig(prev => ({ ...prev, chat_id: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.chatIdDesc}
                    </p>
                  </div>
                </div>

                <Button onClick={handleTelegramSave} className="w-full">
                  {t.saveTelegram}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="facebook" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={facebookConfig.is_active}
                    onCheckedChange={(checked) => 
                      setFacebookConfig(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label>{t.activateFacebook}</Label>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="facebook-token">{t.accessToken}</Label>
                    <Input
                      id="facebook-token"
                      type="password"
                      placeholder="EAABwzLixnjY..."
                      value={facebookConfig.access_token}
                      onChange={(e) => 
                        setFacebookConfig(prev => ({ ...prev, access_token: e.target.value }))
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
                      value={facebookConfig.pixel_id}
                      onChange={(e) => 
                        setFacebookConfig(prev => ({ ...prev, pixel_id: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.pixelIdDesc}
                    </p>
                  </div>
                </div>

                <Button onClick={handleFacebookSave} className="w-full">
                  {t.saveFacebook}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="facebook-catalog" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={facebookCatalogConfig.is_active}
                    onCheckedChange={(checked) => 
                      setFacebookCatalogConfig(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label>{t.activateFacebookCatalog}</Label>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="facebook-catalog-token">{t.accessToken}</Label>
                    <Input
                      id="facebook-catalog-token"
                      type="password"
                      placeholder="EAABwzLixnjY..."
                      value={facebookCatalogConfig.access_token}
                      onChange={(e) => 
                        setFacebookCatalogConfig(prev => ({ ...prev, access_token: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.accessTokenDesc}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="facebook-catalog-id">{t.catalogId}</Label>
                    <Input
                      id="facebook-catalog-id"
                      placeholder="1234567890123456"
                      value={facebookCatalogConfig.catalog_id}
                      onChange={(e) => 
                        setFacebookCatalogConfig(prev => ({ ...prev, catalog_id: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.catalogIdDesc}
                    </p>
                  </div>
                </div>

                <Button onClick={handleFacebookCatalogSave} className="w-full">
                  {t.saveFacebookCatalog}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="google-merchant" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={googleMerchantConfig.is_active}
                    onCheckedChange={(checked) => 
                      setGoogleMerchantConfig(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label>{t.activateGoogleMerchant}</Label>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="google-merchant-id">{t.merchantId}</Label>
                    <Input
                      id="google-merchant-id"
                      placeholder="1234567890"
                      value={googleMerchantConfig.merchant_id}
                      onChange={(e) => 
                        setGoogleMerchantConfig(prev => ({ ...prev, merchant_id: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.merchantIdDesc}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="google-feed-url">{t.feedUrl}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="google-feed-url"
                        placeholder="https://madiluxe.com/feeds/products.xml"
                        value={googleMerchantConfig.feed_url}
                        onChange={(e) => 
                          setGoogleMerchantConfig(prev => ({ ...prev, feed_url: e.target.value }))
                        }
                        className="flex-1"
                      />
                      <Button onClick={generateProductFeed} variant="outline">
                        {t.generateProductFeed}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t.feedUrlDesc}
                    </p>
                  </div>
                </div>

                <Button onClick={handleGoogleMerchantSave} className="w-full">
                  {t.saveGoogleMerchant}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="gtm" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={gtmConfig.is_active}
                    onCheckedChange={(checked) => 
                      setGtmConfig(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label>{t.activateGtm}</Label>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="gtm-container">{t.containerId}</Label>
                    <Input
                      id="gtm-container"
                      placeholder="GTM-XXXXXXX"
                      value={gtmConfig.container_id}
                      onChange={(e) => 
                        setGtmConfig(prev => ({ ...prev, container_id: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.containerIdDesc}
                    </p>
                  </div>
                </div>

                <Button onClick={handleGtmSave} className="w-full">
                  {t.saveGtm}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ga" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={gaConfig.is_active}
                    onCheckedChange={(checked) => 
                      setGaConfig(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label>{t.activateGa}</Label>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="ga-measurement">{t.measurementId}</Label>
                    <Input
                      id="ga-measurement"
                      placeholder="G-XXXXXXXXXX"
                      value={gaConfig.measurement_id}
                      onChange={(e) => 
                        setGaConfig(prev => ({ ...prev, measurement_id: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.measurementIdDesc}
                    </p>
                  </div>
                </div>

                <Button onClick={handleGaSave} className="w-full">
                  {t.saveGa}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsManager;
