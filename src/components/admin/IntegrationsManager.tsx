
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  const translations = {
    es: {
      title: 'Gestión de Integraciones',
      telegram: 'Telegram',
      facebook: 'Facebook CAPI',
      loading: 'Cargando integraciones...',
      activateTelegram: 'Activar notificaciones de Telegram',
      botToken: 'Bot Token',
      chatId: 'Chat ID',
      saveTelegram: 'Guardar Configuración de Telegram',
      activateFacebook: 'Activar Facebook Conversions API',
      accessToken: 'Access Token',
      pixelId: 'Pixel ID',
      saveFacebook: 'Guardar Configuración de Facebook',
      success: 'Éxito',
      integrationUpdated: 'Integración actualizada correctamente',
      error: 'Error',
      updateError: 'No se pudo actualizar la integración',
      loadError: 'No se pudieron cargar las integraciones',
      botTokenDesc: 'Token del bot de Telegram (obtenido de @BotFather)',
      chatIdDesc: 'ID del chat o grupo donde enviar las notificaciones',
      accessTokenDesc: 'Token de acceso de Facebook para la API de conversiones',
      pixelIdDesc: 'ID del pixel de Facebook'
    },
    en: {
      title: 'Integrations Management',
      telegram: 'Telegram',
      facebook: 'Facebook CAPI',
      loading: 'Loading integrations...',
      activateTelegram: 'Activate Telegram notifications',
      botToken: 'Bot Token',
      chatId: 'Chat ID',
      saveTelegram: 'Save Telegram Configuration',
      activateFacebook: 'Activate Facebook Conversions API',
      accessToken: 'Access Token',
      pixelId: 'Pixel ID',
      saveFacebook: 'Save Facebook Configuration',
      success: 'Success',
      integrationUpdated: 'Integration updated successfully',
      error: 'Error',
      updateError: 'Could not update integration',
      loadError: 'Could not load integrations',
      botTokenDesc: 'Telegram bot token (obtained from @BotFather)',
      chatIdDesc: 'Chat or group ID to send notifications to',
      accessTokenDesc: 'Facebook access token for conversions API',
      pixelIdDesc: 'Facebook pixel ID'
    },
    ru: {
      title: 'Управление интеграциями',
      telegram: 'Telegram',
      facebook: 'Facebook CAPI',
      loading: 'Загрузка интеграций...',
      activateTelegram: 'Активировать уведомления Telegram',
      botToken: 'Токен бота',
      chatId: 'ID чата',
      saveTelegram: 'Сохранить настройки Telegram',
      activateFacebook: 'Активировать Facebook Conversions API',
      accessToken: 'Токен доступа',
      pixelId: 'ID пикселя',
      saveFacebook: 'Сохранить настройки Facebook',
      success: 'Успех',
      integrationUpdated: 'Интеграция успешно обновлена',
      error: 'Ошибка',
      updateError: 'Не удалось обновить интеграцию',
      loadError: 'Не удалось загрузить интеграции',
      botTokenDesc: 'Токен бота Telegram (получен от @BotFather)',
      chatIdDesc: 'ID чата или группы для отправки уведомлений',
      accessTokenDesc: 'Токен доступа Facebook для API конверсий',
      pixelIdDesc: 'ID пикселя Facebook'
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
        .update({
          config,
          is_active,
        })
        .eq('name', name);

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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="telegram">{t.telegram}</TabsTrigger>
              <TabsTrigger value="facebook">{t.facebook}</TabsTrigger>
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsManager;
