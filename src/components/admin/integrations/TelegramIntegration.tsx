
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Send } from 'lucide-react';

interface TelegramConfig {
  bot_token: string;
  chat_id: string;
  is_active: boolean;
}

interface TelegramIntegrationProps {
  config: TelegramConfig;
  onConfigChange: (config: TelegramConfig) => void;
  onSave: () => void;
  translations: Record<string, string>;
}

const TelegramIntegration: React.FC<TelegramIntegrationProps> = ({
  config,
  onConfigChange,
  onSave,
  translations: t
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={config.is_active}
          onCheckedChange={(checked) => 
            onConfigChange({ ...config, is_active: checked })
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
            value={config.bot_token}
            onChange={(e) => 
              onConfigChange({ ...config, bot_token: e.target.value })
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
              onConfigChange({ ...config, chat_id: e.target.value })
            }
          />
          <p className="text-sm text-gray-500 mt-1">
            {t.chatIdDesc}
          </p>
        </div>
      </div>

      <Button onClick={onSave} className="w-full">
        {t.saveTelegram}
      </Button>
    </div>
  );
};

export default TelegramIntegration;
