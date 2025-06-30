
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

const IntegrationsManager = () => {
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
        title: "Error",
        description: "No se pudieron cargar las integraciones",
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
        title: "Éxito",
        description: "Integración actualizada correctamente",
      });
      
      fetchIntegrations();
    } catch (error) {
      console.error('Error updating integration:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la integración",
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
    return <div>Cargando integraciones...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Integraciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="telegram" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="telegram">Telegram</TabsTrigger>
              <TabsTrigger value="facebook">Facebook CAPI</TabsTrigger>
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
                  <Label>Activar notificaciones de Telegram</Label>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="telegram-token">Bot Token</Label>
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
                      Token del bot de Telegram (obtenido de @BotFather)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="telegram-chat">Chat ID</Label>
                    <Input
                      id="telegram-chat"
                      placeholder="-1001234567890"
                      value={telegramConfig.chat_id}
                      onChange={(e) => 
                        setTelegramConfig(prev => ({ ...prev, chat_id: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      ID del chat o grupo donde enviar las notificaciones
                    </p>
                  </div>
                </div>

                <Button onClick={handleTelegramSave} className="w-full">
                  Guardar Configuración de Telegram
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
                  <Label>Activar Facebook Conversions API</Label>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="facebook-token">Access Token</Label>
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
                      Token de acceso de Facebook para la API de conversiones
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="facebook-pixel">Pixel ID</Label>
                    <Input
                      id="facebook-pixel"
                      placeholder="1234567890123456"
                      value={facebookConfig.pixel_id}
                      onChange={(e) => 
                        setFacebookConfig(prev => ({ ...prev, pixel_id: e.target.value }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      ID del pixel de Facebook
                    </p>
                  </div>
                </div>

                <Button onClick={handleFacebookSave} className="w-full">
                  Guardar Configuración de Facebook
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
