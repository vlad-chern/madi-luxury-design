
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Facebook, 
  BarChart3, 
  Rss,
  Settings,
  Check,
  X
} from 'lucide-react';
import TelegramIntegration from './integrations/TelegramIntegration';
import FacebookIntegration from './integrations/FacebookIntegration';
import AnalyticsIntegration from './integrations/AnalyticsIntegration';
import ProductFeedIntegration from './integrations/ProductFeedIntegration';

interface Integration {
  id: string;
  name: string;
  config: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ImprovedIntegrationsManagerProps {
  language: 'es' | 'en' | 'ru';
}

const ImprovedIntegrationsManager = ({ language }: ImprovedIntegrationsManagerProps) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Integraciones',
      telegram: 'Telegram',
      telegramDesc: 'Notificaciones por Telegram',
      facebook: 'Facebook CAPI',
      facebookDesc: 'Conversions API de Facebook',
      analytics: 'Analytics',
      analyticsDesc: 'Google Analytics & Pixel',
      productFeed: 'Feed de Productos',
      productFeedDesc: 'Feed XML para tiendas',
      active: 'Activo',
      inactive: 'Inactivo',
      configure: 'Configurar',
      loading: 'Cargando...',
      error: 'Error'
    },
    en: {
      title: 'Integrations',
      telegram: 'Telegram',
      telegramDesc: 'Telegram notifications',
      facebook: 'Facebook CAPI',
      facebookDesc: 'Facebook Conversions API',
      analytics: 'Analytics',
      analyticsDesc: 'Google Analytics & Pixel',
      productFeed: 'Product Feed',
      productFeedDesc: 'XML feed for stores',
      active: 'Active',
      inactive: 'Inactive',
      configure: 'Configure',
      loading: 'Loading...',
      error: 'Error'
    },
    ru: {
      title: 'Интеграции',
      telegram: 'Telegram',
      telegramDesc: 'Уведомления в Telegram',
      facebook: 'Facebook CAPI',
      facebookDesc: 'Facebook Conversions API',
      analytics: 'Аналитика',
      analyticsDesc: 'Google Analytics & Pixel',
      productFeed: 'Лента товаров',
      productFeedDesc: 'XML лента для магазинов',
      active: 'Активно',
      inactive: 'Неактивно',
      configure: 'Настроить',
      loading: 'Загрузка...',
      error: 'Ошибка'
    }
  };

  const t = translations[language];

  const integrationConfigs = [
    {
      name: 'telegram',
      title: t.telegram,
      description: t.telegramDesc,
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'facebook_capi',
      title: t.facebook,
      description: t.facebookDesc,
      icon: Facebook,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'analytics',
      title: t.analytics,
      description: t.analyticsDesc,
      icon: BarChart3,
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'product_feed',
      title: t.productFeed,
      description: t.productFeedDesc,
      icon: Rss,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      const { data, error } = await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'integrations',
          action: 'select'
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to load integrations');
      }

      setIntegrations(data.data || []);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getIntegrationByName = (name: string) => {
    return integrations.find(integration => integration.name === name);
  };

  const renderIntegrationDetails = () => {
    switch (selectedIntegration) {
      case 'telegram':
        return <TelegramIntegration language={language} onUpdate={loadIntegrations} />;
      case 'facebook_capi':
        return <FacebookIntegration language={language} onUpdate={loadIntegrations} />;
      case 'analytics':
        return <AnalyticsIntegration language={language} onUpdate={loadIntegrations} />;
      case 'product_feed':
        return <ProductFeedIntegration language={language} onUpdate={loadIntegrations} />;
      default:
        return null;
    }
  };

  if (selectedIntegration) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
          ← Назад к интеграциям
        </Button>
        {renderIntegrationDetails()}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">{t.loading}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationConfigs.map((config) => {
              const integration = getIntegrationByName(config.name);
              const IconComponent = config.icon;
              
              return (
                <Card key={config.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${config.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        {integration?.is_active ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            {t.active}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <X className="w-3 h-3 mr-1" />
                            {t.inactive}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-1">{config.title}</h3>
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setSelectedIntegration(config.name)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {t.configure}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovedIntegrationsManager;
