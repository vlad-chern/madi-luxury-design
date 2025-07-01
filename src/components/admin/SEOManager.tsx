
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Globe, 
  FileText, 
  Download,
  Save,
  RefreshCw,
  Check,
  X
} from 'lucide-react';

interface SEOManagerProps {
  language: 'es' | 'en' | 'ru';
}

interface SEOSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SEOManager = ({ language }: SEOManagerProps) => {
  const [robotsTxt, setRobotsTxt] = useState('');
  const [sitemapAutoUpdate, setSitemapAutoUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSitemap, setIsGeneratingSitemap] = useState(false);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Configuración SEO',
      robotsTitle: 'Robots.txt',
      robotsDesc: 'Controla cómo los motores de búsqueda rastrean tu sitio',
      sitemapTitle: 'Mapa del Sitio',
      sitemapDesc: 'Gestiona la generación del sitemap.xml',
      autoUpdate: 'Actualización Automática',
      generateSitemap: 'Generar Sitemap',
      downloadSitemap: 'Descargar Sitemap',
      save: 'Guardar',
      saving: 'Guardando...',
      generating: 'Generando...',
      loading: 'Cargando...',
      success: 'Configuración guardada correctamente',
      sitemapGenerated: 'Sitemap generado correctamente',
      error: 'Error',
      active: 'Activo',
      inactive: 'Inactivo'
    },
    en: {
      title: 'SEO Settings',
      robotsTitle: 'Robots.txt',
      robotsDesc: 'Control how search engines crawl your site',
      sitemapTitle: 'Sitemap',
      sitemapDesc: 'Manage sitemap.xml generation',
      autoUpdate: 'Auto Update',
      generateSitemap: 'Generate Sitemap',
      downloadSitemap: 'Download Sitemap',
      save: 'Save',
      saving: 'Saving...',
      generating: 'Generating...',
      loading: 'Loading...',
      success: 'Settings saved successfully',
      sitemapGenerated: 'Sitemap generated successfully',
      error: 'Error',
      active: 'Active',
      inactive: 'Inactive'
    },
    ru: {
      title: 'Настройки SEO',
      robotsTitle: 'Robots.txt',
      robotsDesc: 'Управляйте тем, как поисковые системы сканируют ваш сайт',
      sitemapTitle: 'Карта сайта',
      sitemapDesc: 'Управление генерацией sitemap.xml',
      autoUpdate: 'Автообновление',
      generateSitemap: 'Генерировать карту сайта',
      downloadSitemap: 'Скачать карту сайта',
      save: 'Сохранить',
      saving: 'Сохранение...',
      generating: 'Генерация...',
      loading: 'Загрузка...',
      success: 'Настройки сохранены успешно',
      sitemapGenerated: 'Карта сайта сгенерирована успешно',
      error: 'Ошибка',
      active: 'Активно',
      inactive: 'Неактивно'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    setIsLoading(true);
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      const { data, error } = await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'seo_settings',
          action: 'select'
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to load SEO settings');
      }

      const settings = data.data || [];
      const robotsSetting = settings.find((s: SEOSetting) => s.setting_key === 'robots_txt');
      const sitemapSetting = settings.find((s: SEOSetting) => s.setting_key === 'sitemap_auto_update');

      if (robotsSetting) {
        setRobotsTxt(robotsSetting.setting_value || '');
      }
      if (sitemapSetting) {
        setSitemapAutoUpdate(sitemapSetting.setting_value === 'true' && sitemapSetting.is_active);
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSEOSettings = async () => {
    setIsSaving(true);
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      
      // Сохраняем robots.txt
      await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'seo_settings',
          action: 'upsert',
          data: {
            setting_key: 'robots_txt',
            setting_value: robotsTxt,
            is_active: true
          }
        }
      });

      // Сохраняем настройку автообновления карты сайта
      await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'seo_settings',
          action: 'upsert',
          data: {
            setting_key: 'sitemap_auto_update',
            setting_value: sitemapAutoUpdate.toString(),
            is_active: sitemapAutoUpdate
          }
        }
      });

      toast({
        title: t.success,
        description: 'SEO settings updated successfully',
      });
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateSitemap = async () => {
    setIsGeneratingSitemap(true);
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      const { data, error } = await supabase.functions.invoke('generate-sitemap', {
        body: {
          session_token: sessionToken
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to generate sitemap');
      }

      toast({
        title: t.sitemapGenerated,
        description: 'Sitemap.xml has been generated successfully',
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingSitemap(false);
    }
  };

  const downloadSitemap = () => {
    window.open('/sitemap.xml', '_blank');
  };

  if (isLoading) {
    return <div className="text-center py-8">{t.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Robots.txt Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t.robotsTitle}
                </h3>
                <p className="text-sm text-gray-600">{t.robotsDesc}</p>
              </div>
            </div>
            
            <Textarea
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              placeholder="User-agent: *&#10;Disallow: /admin&#10;Allow: /&#10;&#10;Sitemap: https://madiluxe.com/sitemap.xml"
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Sitemap Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t.sitemapTitle}
                </h3>
                <p className="text-sm text-gray-600">{t.sitemapDesc}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={sitemapAutoUpdate ? "default" : "secondary"}>
                  {sitemapAutoUpdate ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <X className="w-3 h-3 mr-1" />
                  )}
                  {sitemapAutoUpdate ? t.active : t.inactive}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={sitemapAutoUpdate}
                  onCheckedChange={setSitemapAutoUpdate}
                />
                <span className="text-sm font-medium">{t.autoUpdate}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={generateSitemap}
                disabled={isGeneratingSitemap}
                variant="outline"
              >
                {isGeneratingSitemap ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isGeneratingSitemap ? t.generating : t.generateSitemap}
              </Button>

              <Button
                onClick={downloadSitemap}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.downloadSitemap}
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={saveSEOSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? t.saving : t.save}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOManager;
