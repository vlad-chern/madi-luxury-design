import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { LovableUploadsOptimizer } from '@/utils/imageOptimizer';
import { Download, ImageIcon, Zap } from 'lucide-react';

interface OptimizationResult {
  filename: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  downloadUrl: string;
}

interface ImageOptimizerProps {
  language: 'es' | 'en' | 'ru';
}

const ImageOptimizer = ({ language }: ImageOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [summary, setSummary] = useState<{
    totalOriginalSize: number;
    totalOptimizedSize: number;
    totalSavings: number;
  } | null>(null);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Optimizador de Imágenes',
      description: 'Convierte y comprime imágenes de lovable-uploads a formato WebP',
      startOptimization: 'Iniciar Optimización',
      optimizing: 'Optimizando...',
      completed: 'Completado',
      downloadAll: 'Descargar Todas',
      results: 'Resultados',
      filename: 'Archivo',
      originalSize: 'Tamaño Original',
      optimizedSize: 'Tamaño Optimizado',
      compression: 'Compresión',
      download: 'Descargar',
      summary: 'Resumen',
      totalSavings: 'Ahorro Total',
      imagesProcessed: 'Imágenes Procesadas',
      averageCompression: 'Compresión Promedio'
    },
    en: {
      title: 'Image Optimizer',
      description: 'Convert and compress lovable-uploads images to WebP format',
      startOptimization: 'Start Optimization',
      optimizing: 'Optimizing...',
      completed: 'Completed',
      downloadAll: 'Download All',
      results: 'Results',
      filename: 'Filename',
      originalSize: 'Original Size',
      optimizedSize: 'Optimized Size',
      compression: 'Compression',
      download: 'Download',
      summary: 'Summary',
      totalSavings: 'Total Savings',
      imagesProcessed: 'Images Processed',
      averageCompression: 'Average Compression'
    },
    ru: {
      title: 'Оптимизатор Изображений',
      description: 'Конвертация и сжатие изображений из lovable-uploads в формат WebP',
      startOptimization: 'Начать Оптимизацию',
      optimizing: 'Оптимизация...',
      completed: 'Завершено',
      downloadAll: 'Скачать Все',
      results: 'Результаты',
      filename: 'Имя файла',
      originalSize: 'Исходный размер',
      optimizedSize: 'Оптимизированный размер',
      compression: 'Сжатие',
      download: 'Скачать',
      summary: 'Сводка',
      totalSavings: 'Общая экономия',
      imagesProcessed: 'Обработано изображений',
      averageCompression: 'Среднее сжатие'
    }
  };

  const t = translations[language];

  const handleOptimization = async () => {
    setIsOptimizing(true);
    setProgress(0);
    setResults([]);
    setSummary(null);

    try {
      const optimizer = new LovableUploadsOptimizer();
      
      // Mock progress update (since we can't track real progress easily)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + 2;
          return prev;
        });
      }, 500);

      const optimizationResults = await optimizer.optimizeAllImages();
      
      clearInterval(progressInterval);
      setProgress(100);

      setResults(optimizationResults.results);
      setSummary({
        totalOriginalSize: optimizationResults.totalOriginalSize,
        totalOptimizedSize: optimizationResults.totalOptimizedSize,
        totalSavings: optimizationResults.totalSavings
      });

      toast({
        title: '✅ ' + t.completed,
        description: `${optimizationResults.results.length} imágenes optimizadas. Ahorro: ${optimizationResults.totalSavings}KB`,
      });

    } catch (error) {
      console.error('Error during optimization:', error);
      toast({
        title: 'Error',
        description: 'Error durante la optimización',
        variant: 'destructive',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const downloadAllImages = () => {
    results.forEach((result, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200); // Stagger downloads
    });
  };

  const formatSize = (sizeKB: number) => {
    if (sizeKB < 1024) {
      return `${sizeKB}KB`;
    }
    return `${(sizeKB / 1024).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {t.title}
          </CardTitle>
          <p className="text-sm text-gray-600">{t.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleOptimization}
            disabled={isOptimizing}
            className="w-full"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isOptimizing ? t.optimizing : t.startOptimization}
          </Button>

          {isOptimizing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-gray-600">
                {progress}% {t.completed.toLowerCase()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>{t.summary}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {results.length}
                </div>
                <div className="text-sm text-gray-600">{t.imagesProcessed}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatSize(summary.totalSavings)}
                </div>
                <div className="text-sm text-gray-600">{t.totalSavings}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {results.length > 0 
                    ? `${(results.reduce((acc, r) => acc + r.compressionRatio, 0) / results.length).toFixed(1)}x`
                    : '0x'
                  }
                </div>
                <div className="text-sm text-gray-600">{t.averageCompression}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.results}</CardTitle>
            <Button onClick={downloadAllImages} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {t.downloadAll}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t.filename}</th>
                    <th className="text-left p-2">{t.originalSize}</th>
                    <th className="text-left p-2">{t.optimizedSize}</th>
                    <th className="text-left p-2">{t.compression}</th>
                    <th className="text-left p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-sm">{result.filename}</td>
                      <td className="p-2">{formatSize(result.originalSize)}</td>
                      <td className="p-2 text-green-600">
                        {formatSize(result.optimizedSize)}
                      </td>
                      <td className="p-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {result.compressionRatio.toFixed(1)}x
                        </span>
                      </td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = result.downloadUrl;
                            link.download = result.filename;
                            link.click();
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageOptimizer;