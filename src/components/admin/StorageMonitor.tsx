
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { HardDrive, Upload, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StorageUsage {
  total: number;
  used: number;
  available: number;
  percentage: number;
}

interface StorageMonitorProps {
  language: 'es' | 'en' | 'ru';
}

const StorageMonitor: React.FC<StorageMonitorProps> = ({ language }) => {
  const isMobile = useIsMobile();
  const [storageUsage, setStorageUsage] = useState<StorageUsage>({
    total: 1000,
    used: 45,
    available: 955,
    percentage: 4.5
  });
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Monitor de Almacenamiento',
      active: 'Activo',
      total: 'Total',
      used: 'Usado',
      available: 'Disponible',
      noEvents: 'No hay eventos de almacenamiento para mostrar',
      eventsInfo: 'Los eventos aparecerán al subir o eliminar archivos',
      mb: 'MB',
      gb: 'GB',
      storageTitle: 'Storage'
    },
    en: {
      title: 'Storage Monitor',
      active: 'Active',
      total: 'Total',
      used: 'Used',
      available: 'Available',
      noEvents: 'No storage events to show',
      eventsInfo: 'Events will appear when uploading or deleting files',
      mb: 'MB',
      gb: 'GB',
      storageTitle: 'Storage'
    },
    ru: {
      title: 'Монитор хранилища',
      active: 'Активен',
      total: 'Всего',
      used: 'Использовано',
      available: 'Доступно',
      noEvents: 'Нет событий хранилища для отображения',
      eventsInfo: 'События появятся при загрузке или удалении файлов',
      mb: 'МБ',
      gb: 'ГБ',
      storageTitle: 'Хранилище'
    }
  };

  const t = translations[language];

  const formatSize = (sizeInMB: number) => {
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(1)} ${t.gb}`;
    }
    return `${sizeInMB} ${t.mb}`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-100 text-red-800';
    if (percentage >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Card className="h-fit w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            <span className="text-xs sm:text-sm">{isMobile ? t.storageTitle : t.title}</span>
          </div>
          <Badge className={getStatusColor(storageUsage.percentage)}>
            {t.active}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">{t.used}</span>
              <span className="text-xs sm:text-sm font-medium">
                {formatSize(storageUsage.used)} / {formatSize(storageUsage.total)}
              </span>
            </div>
            <Progress 
              value={storageUsage.percentage} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{storageUsage.percentage.toFixed(1)}%</span>
              <span>{formatSize(storageUsage.available)} {t.available}</span>
            </div>
          </div>

          {storageUsage.percentage >= 75 && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <span className="text-xs text-yellow-700">
                {storageUsage.percentage >= 90 ? 'Storage almost full' : 'Storage getting full'}
              </span>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="text-center text-gray-500 py-4">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs sm:text-sm mb-1">{t.noEvents}</p>
              <p className="text-xs text-gray-400">{t.eventsInfo}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageMonitor;
