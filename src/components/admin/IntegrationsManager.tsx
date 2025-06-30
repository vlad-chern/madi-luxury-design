
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Integration {
  id: string;
  name: string;
  config: Record<string, any>;
  is_active: boolean;
}

const IntegrationsManager = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [telegramConfig, setTelegramConfig] = useState({ bot_token: '', chat_id: '' });
  const [facebookConfig, setFacebookConfig] = useState({ access_token: '', pixel_id: '' });
  const { toast } = useToast();

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
      
      // Set current configs
      const telegram = data?.find(i => i.name === 'telegram');
      const facebook = data?.find(i => i.name === 'facebook_capi');
      
      if (telegram) {
        setTelegramConfig(telegram.config);
      }
      if (facebook) {
        setFacebookConfig(facebook.config);
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
    }
  };

  const updateIntegration = async (name: string, config: any, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ config, is_active: isActive })
        .eq('name', name);

      if (error) throw error;

      toast({
        title: "Интеграция обновлена",
        description: `Настройки ${name} успешно сохранены`,
      });
      
      fetchIntegrations();
    } catch (error) {
      console.error('Error updating integration:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить интеграцию",
        variant: "destructive",
      });
    }
  };

  const handleTelegramSave = () => {
    const telegram = integrations.find(i => i.name === 'telegram');
    updateIntegration('telegram', telegramConfig, telegram?.is_active || false);
  };

  const handleFacebookSave = () => {
    const facebook = integrations.find(i => i.name === 'facebook_capi');
    updateIntegration('facebook_capi', facebookConfig, facebook?.is_active || false);
  };

  const toggleIntegration = (name: string, isActive: boolean) => {
    const integration = integrations.find(i => i.name === name);
    if (integration) {
      updateIntegration(name, integration.config, isActive);
    }
  };

  const telegramIntegration = integrations.find(i => i.name === 'telegram');
  const facebookIntegration = integrations.find(i => i.name === 'facebook_capi');

  return (
    <div className="space-y-6">
      {/* Telegram Integration */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Telegram Integration</CardTitle>
            <Switch
              checked={telegramIntegration?.is_active || false}
              onCheckedChange={(checked) => toggleIntegration('telegram', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="telegram_token">Bot Token</Label>
            <Input
              id="telegram_token"
              type="password"
              value={telegramConfig.bot_token}
              onChange={(e) => setTelegramConfig(prev => ({ ...prev, bot_token: e.target.value }))}
              placeholder="Введите токен Telegram бота"
            />
          </div>
          <div>
            <Label htmlFor="telegram_chat">Chat ID / Group ID</Label>
            <Input
              id="telegram_chat"
              value={telegramConfig.chat_id}
              onChange={(e) => setTelegramConfig(prev => ({ ...prev, chat_id: e.target.value }))}
              placeholder="Введите ID чата или группы"
            />
          </div>
          <Button onClick={handleTelegramSave}>Сохранить настройки Telegram</Button>
        </CardContent>
      </Card>

      {/* Facebook CAPI Integration */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Facebook Conversions API</CardTitle>
            <Switch
              checked={facebookIntegration?.is_active || false}
              onCheckedChange={(checked) => toggleIntegration('facebook_capi', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebook_token">Access Token</Label>
            <Input
              id="facebook_token"
              type="password"
              value={facebookConfig.access_token}
              onChange={(e) => setFacebookConfig(prev => ({ ...prev, access_token: e.target.value }))}
              placeholder="Введите Facebook Access Token"
            />
          </div>
          <div>
            <Label htmlFor="facebook_pixel">Pixel ID</Label>
            <Input
              id="facebook_pixel"
              value={facebookConfig.pixel_id}
              onChange={(e) => setFacebookConfig(prev => ({ ...prev, pixel_id: e.target.value }))}
              placeholder="Введите Facebook Pixel ID"
            />
          </div>
          <Button onClick={handleFacebookSave}>Сохранить настройки Facebook</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsManager;
