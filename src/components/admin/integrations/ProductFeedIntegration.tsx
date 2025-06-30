
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ProductFeedConfig {
  catalog_id?: string;
  access_token?: string;
  merchant_id?: string;
  feed_url?: string;
  is_active: boolean;
}

interface ProductFeedIntegrationProps {
  type: 'facebook' | 'google';
  config: ProductFeedConfig;
  onConfigChange: (config: ProductFeedConfig) => void;
  onSave: () => void;
  translations: Record<string, string>;
}

const ProductFeedIntegration: React.FC<ProductFeedIntegrationProps> = ({
  type,
  config,
  onConfigChange,
  onSave,
  translations: t
}) => {
  const { toast } = useToast();

  const generateProductFeed = async () => {
    try {
      const { data: response, error } = await supabase.functions.invoke('generate-product-feed');
      
      if (error) throw error;
      
      toast({
        title: t.success,
        description: t.feedGenerated,
      });
      
      if (type === 'google') {
        onConfigChange({
          ...config,
          feed_url: response?.feed_url || config.feed_url
        });
      }
      
    } catch (error) {
      console.error('Error generating feed:', error);
      toast({
        title: t.error,
        description: t.feedError,
        variant: "destructive",
      });
    }
  };

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
          {type === 'facebook' ? t.activateFacebookCatalog : t.activateGoogleMerchant}
        </Label>
      </div>

      <div className="grid gap-4">
        {type === 'facebook' && (
          <>
            <div>
              <Label htmlFor="catalog-token">{t.accessToken}</Label>
              <Input
                id="catalog-token"
                type="password"
                placeholder="EAABwzLixnjY..."
                value={config.access_token || ''}
                onChange={(e) => 
                  onConfigChange({ ...config, access_token: e.target.value })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                {t.accessTokenDesc}
              </p>
            </div>

            <div>
              <Label htmlFor="catalog-id">{t.catalogId}</Label>
              <Input
                id="catalog-id"
                placeholder="1234567890123456"
                value={config.catalog_id || ''}
                onChange={(e) => 
                  onConfigChange({ ...config, catalog_id: e.target.value })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                {t.catalogIdDesc}
              </p>
            </div>
          </>
        )}

        {type === 'google' && (
          <>
            <div>
              <Label htmlFor="merchant-id">{t.merchantId}</Label>
              <Input
                id="merchant-id"
                placeholder="1234567890"
                value={config.merchant_id || ''}
                onChange={(e) => 
                  onConfigChange({ ...config, merchant_id: e.target.value })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                {t.merchantIdDesc}
              </p>
            </div>

            <div>
              <Label htmlFor="feed-url">{t.feedUrl}</Label>
              <div className="flex gap-2">
                <Input
                  id="feed-url"
                  placeholder="https://madiluxe.com/feeds/products.xml"
                  value={config.feed_url || ''}
                  onChange={(e) => 
                    onConfigChange({ ...config, feed_url: e.target.value })
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
          </>
        )}
      </div>

      <Button onClick={onSave} className="w-full">
        {type === 'facebook' ? t.saveFacebookCatalog : t.saveGoogleMerchant}
      </Button>
    </div>
  );
};

export default ProductFeedIntegration;
