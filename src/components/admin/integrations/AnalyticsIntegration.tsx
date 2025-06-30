
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AnalyticsConfig {
  container_id?: string;
  measurement_id?: string;
  is_active: boolean;
}

interface AnalyticsIntegrationProps {
  type: 'gtm' | 'ga';
  config: AnalyticsConfig;
  onConfigChange: (config: AnalyticsConfig) => void;
  onSave: () => void;
  translations: Record<string, string>;
}

const AnalyticsIntegration: React.FC<AnalyticsIntegrationProps> = ({
  type,
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
        <Label>
          {type === 'gtm' ? t.activateGtm : t.activateGa}
        </Label>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor={`${type}-id`}>
            {type === 'gtm' ? t.containerId : t.measurementId}
          </Label>
          <Input
            id={`${type}-id`}
            placeholder={type === 'gtm' ? "GTM-XXXXXXX" : "G-XXXXXXXXXX"}
            value={type === 'gtm' ? config.container_id || '' : config.measurement_id || ''}
            onChange={(e) => 
              onConfigChange({ 
                ...config, 
                [type === 'gtm' ? 'container_id' : 'measurement_id']: e.target.value 
              })
            }
          />
          <p className="text-sm text-gray-500 mt-1">
            {type === 'gtm' ? t.containerIdDesc : t.measurementIdDesc}
          </p>
        </div>
      </div>

      <Button onClick={onSave} className="w-full">
        {type === 'gtm' ? t.saveGtm : t.saveGa}
      </Button>
    </div>
  );
};

export default AnalyticsIntegration;
