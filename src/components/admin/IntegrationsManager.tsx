
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
              <TelegramIntegration language={language} onUpdate={fetchIntegrations} />
            </TabsContent>

            <TabsContent value="facebook">
              <FacebookIntegration language={language} onUpdate={fetchIntegrations} />
            </TabsContent>

            <TabsContent value="facebook-catalog">
              <ProductFeedIntegration language={language} onUpdate={fetchIntegrations} />
            </TabsContent>

            <TabsContent value="google-merchant">
              <ProductFeedIntegration language={language} onUpdate={fetchIntegrations} />
            </TabsContent>

            <TabsContent value="gtm">
              <AnalyticsIntegration language={language} onUpdate={fetchIntegrations} />
            </TabsContent>

            <TabsContent value="ga">
              <AnalyticsIntegration language={language} onUpdate={fetchIntegrations} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsManager;
