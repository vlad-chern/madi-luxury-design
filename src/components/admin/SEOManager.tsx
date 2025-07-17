
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
      sitemapDesc: 'Gestiona la generación del sitemap.xml para descargar',
      autoUpdate: 'Actualización Automática',
      generateSitemap: 'Generar y Descargar Sitemap',
      downloadSitemap: 'Descargar Sitemap Actual',
      save: 'Guardar',
      saving: 'Guardando...',
      generating: 'Generando...',
      loading: 'Cargando...',
      success: 'Configuración guardada correctamente',
      sitemapGenerated: 'Sitemap generado y descargado',
      error: 'Error',
      active: 'Activo',
      inactive: 'Inactivo',
      sitemapInstruction: 'Después de generar, sube el archivo sitemap.xml a la carpeta raíz de tu sitio web',
      downloadRobots: 'Descargar robots.txt'
    },
    en: {
      title: 'SEO Settings',
      robotsTitle: 'Robots.txt',
      robotsDesc: 'Control how search engines crawl your site',
      sitemapTitle: 'Sitemap',
      sitemapDesc: 'Manage sitemap.xml generation for download',
      autoUpdate: 'Auto Update',
      generateSitemap: 'Generate and Download Sitemap',
      downloadSitemap: 'Download Current Sitemap',
      save: 'Save',
      saving: 'Saving...',
      generating: 'Generating...',
      loading: 'Loading...',
      success: 'Settings saved successfully',
      sitemapGenerated: 'Sitemap generated and downloaded',
      error: 'Error',
      active: 'Active',
      inactive: 'Inactive',
      sitemapInstruction: 'After generating, upload the sitemap.xml file to the root folder of your website',
      downloadRobots: 'Download robots.txt'
    },
    ru: {
      title: 'Настройки SEO',
      robotsTitle: 'Robots.txt',
      robotsDesc: 'Управляйте тем, как поисковые системы сканируют ваш сайт',
      sitemapTitle: 'Карта сайта',
      sitemapDesc: 'Управление генерацией sitemap.xml для скачивания',
      autoUpdate: 'Автообновление',
      generateSitemap: 'Генерировать и скачать карту сайта',
      downloadSitemap: 'Скачать текущую карту сайта',
      save: 'Сохранить',
      saving: 'Сохранение...',
      generating: 'Генерация...',
      loading: 'Загрузка...',
      success: 'Настройки сохранены успешно',
      sitemapGenerated: 'Карта сайта сгенерирована и скачана',
      error: 'Ошибка',
      active: 'Активно',
      inactive: 'Неактивно',
      sitemapInstruction: 'После генерации загрузите файл sitemap.xml в корневую папку вашего сайта',
      downloadRobots: 'Скачать robots.txt'
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

      // Создаем и скачиваем sitemap.xml файл
      const sitemapContent = data.sitemap_xml;
      const blob = new Blob([sitemapContent], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: t.sitemapGenerated,
        description: 'Sitemap.xml скачан. Загрузите его в корневую папку сайта на хостинге.',
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
    const link = document.createElement('a');
    link.href = '/sitemap.xml';
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadRobots = () => {
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
              placeholder="User-agent: *&#10;Disallow: /admin&#10;Allow: /&#10;&#10;Sitemap: https://madi.florexa.site/sitemap.xml"
              className="min-h-[200px] font-mono text-sm"
            />
            
            <div className="flex gap-3">
              <Button
                onClick={downloadRobots}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.downloadRobots}
              </Button>
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Важно:</strong> После генерации и загрузки sitemap.xml на хостинг, также загрузите обновленный robots.txt в корневую папку сайта.
              </p>
            </div>
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

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Инструкция:</strong> {t.sitemapInstruction}
              </p>
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
