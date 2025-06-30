
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FacebookConfig {
  access_token: string;
  pixel_id: string;
  is_active: boolean;
}

interface FacebookIntegrationProps {
  config: FacebookConfig;
  onConfigChange: (config: FacebookConfig) => void;
  onSave: () => void;
  translations: Record<string, string>;
}

const FacebookIntegration: React.FC<FacebookIntegrationProps> = ({
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
        <Label>{t.activateFacebook}</Label>
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
              onConfigChange({ ...config, access_token: e.target.value })
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
              onConfigChange({ ...config, pixel_id: e.target.value })
            }
          />
          <p className="text-sm text-gray-500 mt-1">
            {t.pixelIdDesc}
          </p>
        </div>
      </div>

      <Button onClick={onSave} className="w-full">
        {t.saveFacebook}
      </Button>
    </div>
  );
};

export default FacebookIntegration;
