
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send } from 'lucide-react';

interface TelegramConfig {
  bot_token: string;
  chat_id: string;
  is_active: boolean;
}

interface TelegramIntegrationProps {
  language: 'es' | 'en' | 'ru';
  onUpdate: () => Promise<void>;
}

const TelegramIntegration = ({ language, onUpdate }: TelegramIntegrationProps) => {
  const [config, setConfig] = useState<TelegramConfig>({
    bot_token: '',
    chat_id: '',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Configuración de Telegram',
      botToken: 'Token del Bot',
      chatId: 'ID del Chat',
      activate: 'Activar Telegram',
      save: 'Guardar',
      botTokenDesc: 'Token obtenido de @BotFather',
      chatIdDesc: 'ID del chat donde enviar notificaciones',
      saved: 'Configuración guardada exitosamente',
      error: 'Error al guardar configuración'
    },
    en: {
      title: 'Telegram Configuration',
      botToken: 'Bot Token',
      chatId: 'Chat ID',
      activate: 'Activate Telegram',
      save: 'Save',
      botTokenDesc: 'Token obtained from @BotFather',
      chatIdDesc: 'Chat ID where to send notifications',
      saved: 'Configuration saved successfully',
      error: 'Error saving configuration'
    },
    ru: {
      title: 'Настройка Telegram',
      botToken: 'Токен Бота',
      chatId: 'ID Чата',
      activate: 'Активировать Telegram',
      save: 'Сохранить',
      botTokenDesc: 'Токен полученный от @BotFather',
      chatIdDesc: 'ID чата для отправки уведомлений',
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
          filters: { name: 'telegram' }
        }
      });

      if (data?.success && data.data?.length > 0) {
        const integration = data.data[0];
        setConfig({
          bot_token: integration.config.bot_token || '',
          chat_id: integration.config.chat_id || '',
          is_active: integration.is_active
        });
      }
    } catch (error) {
      console.error('Error loading Telegram config:', error);
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
            name: 'telegram',
            config: {
              bot_token: config.bot_token,
              chat_id: config.chat_id
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
      console.error('Error saving Telegram config:', error);
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
          <Send className="w-5 h-5" />
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
            <Label htmlFor="telegram-token">{t.botToken}</Label>
            <Input
              id="telegram-token"
              type="password"
              placeholder="1234567890:ABCDEFghijklmnopQRSTUVwxyz123456789"
              value={config.bot_token}
              onChange={(e) => 
                setConfig({ ...config, bot_token: e.target.value })
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
              value={config.chat_id}
              onChange={(e) => 
                setConfig({ ...config, chat_id: e.target.value })
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              {t.chatIdDesc}
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

export default TelegramIntegration;
