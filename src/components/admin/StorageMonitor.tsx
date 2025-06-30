
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, Video, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StorageEvent {
  id: string;
  event_type: 'upload' | 'delete';
  file_name: string;
  file_type: string;
  file_size: number;
  bucket_name: string;
  created_at: string;
}

interface StorageMonitorProps {
  language: 'es' | 'en' | 'ru';
}

const StorageMonitor: React.FC<StorageMonitorProps> = ({ language }) => {
  const [storageEvents, setStorageEvents] = useState<StorageEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Monitor Storage',
      active: 'Activo',
      inactive: 'Inactivo',
      noEvents: 'No hay eventos',
      eventsWillAppear: 'Los eventos aparecerán al subir archivos',
      uploaded: 'Subido',
      deleted: 'Eliminado',
      fileUploaded: 'Archivo subido'
    },
    en: {
      title: 'Storage Monitor',
      active: 'Active',
      inactive: 'Inactive',
      noEvents: 'No events',
      eventsWillAppear: 'Events will appear when uploading files',
      uploaded: 'Uploaded',
      deleted: 'Deleted',
      fileUploaded: 'File uploaded'
    },
    ru: {
      title: 'Мониторинг Storage',
      active: 'Активен',
      inactive: 'Неактивен',
      noEvents: 'Нет событий',
      eventsWillAppear: 'События появятся при загрузке файлов',
      uploaded: 'Загружен',
      deleted: 'Удален',
      fileUploaded: 'Файл загружен'
    }
  };

  const t = translations[language];

  useEffect(() => {
    startStorageMonitoring();
    return () => stopStorageMonitoring();
  }, []);

  const startStorageMonitoring = () => {
    setIsMonitoring(true);
    
    const interval = setInterval(async () => {
      try {
        console.log('Monitoring storage events...');
      } catch (error) {
        console.error('Storage monitoring error:', error);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  };

  const stopStorageMonitoring = () => {
    setIsMonitoring(false);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-3 h-3 md:w-4 md:h-4" />;
    if (fileType.startsWith('video/')) return <Video className="w-3 h-3 md:w-4 md:h-4" />;
    return <FileText className="w-3 h-3 md:w-4 md:h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = (fileName: string, fileType: string, fileSize: number) => {
    const newEvent: StorageEvent = {
      id: Date.now().toString(),
      event_type: 'upload',
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      bucket_name: 'madiluxe',
      created_at: new Date().toISOString()
    };

    setStorageEvents(prev => [newEvent, ...prev.slice(0, 49)]);
    
    toast({
      title: t.fileUploaded,
      description: `${fileName} (${formatFileSize(fileSize)})`,
    });
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Upload className="w-4 h-4" />
            <span className="truncate">{t.title}</span>
          </CardTitle>
          <Badge variant={isMonitoring ? "default" : "secondary"} className="text-xs">
            {isMonitoring ? t.active : t.inactive}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <div className="space-y-3">
          {storageEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs md:text-sm">{t.noEvents}</p>
              <p className="text-xs">{t.eventsWillAppear}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto">
              {storageEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {getFileIcon(event.file_type)}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs truncate">{event.file_name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {event.bucket_name} • {formatFileSize(event.file_size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={event.event_type === 'upload' ? 'default' : 'destructive'} className="text-xs">
                      {event.event_type === 'upload' ? t.uploaded : t.deleted}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageMonitor;
