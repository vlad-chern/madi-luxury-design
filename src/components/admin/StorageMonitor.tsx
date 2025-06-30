
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
      title: 'Monitor de Almacenamiento',
      active: 'Activo',
      inactive: 'Inactivo',
      noEvents: 'No hay eventos de almacenamiento para mostrar',
      eventsWillAppear: 'Los eventos aparecerán al subir o eliminar archivos',
      uploaded: 'Subido',
      deleted: 'Eliminado',
      fileUploaded: 'Archivo subido'
    },
    en: {
      title: 'Storage Monitor',
      active: 'Active',
      inactive: 'Inactive',
      noEvents: 'No storage events to display',
      eventsWillAppear: 'Events will appear when uploading or deleting files',
      uploaded: 'Uploaded',
      deleted: 'Deleted',
      fileUploaded: 'File uploaded'
    },
    ru: {
      title: 'Мониторинг Storage',
      active: 'Активен',
      inactive: 'Неактивен',
      noEvents: 'Нет событий Storage для отображения',
      eventsWillAppear: 'События появятся при загрузке или удалении файлов',
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
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {t.title}
          </CardTitle>
          <Badge variant={isMonitoring ? "default" : "secondary"}>
            {isMonitoring ? t.active : t.inactive}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {storageEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t.noEvents}</p>
              <p className="text-sm">{t.eventsWillAppear}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {storageEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(event.file_type)}
                    <div>
                      <p className="font-medium">{event.file_name}</p>
                      <p className="text-sm text-gray-500">
                        {event.bucket_name} • {formatFileSize(event.file_size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={event.event_type === 'upload' ? 'default' : 'destructive'}>
                      {event.event_type === 'upload' ? t.uploaded : t.deleted}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleTimeString()}
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
