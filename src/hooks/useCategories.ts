
import { useState, useEffect } from 'react';
import { supabase, Category } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Используем более быстрый запрос с ограничением полей
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, description, image_url, created_at')
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('Error fetching categories:', error);
          throw error;
        }
        
        if (isMounted) {
          console.log('Categories loaded:', data?.length || 0);
          setCategories(data || []);
        }
        
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        const errorMessage = error.message || 'Error al cargar las categorías';
        
        if (isMounted) {
          setError(errorMessage);
          
          // Показываем toast только если это критическая ошибка
          if (error.message?.includes('connection') || error.message?.includes('network')) {
            toast({
              title: "Error de conexión",
              description: "No se pudo conectar con el servidor. Reintentando...",
              variant: "destructive",
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    // Подписка на изменения в таблице categories с debounce
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          console.log('Categories updated, refetching...');
          // Небольшая задержка чтобы избежать множественных обновлений
          setTimeout(() => {
            if (isMounted) {
              fetchCategories();
            }
          }, 500);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, image_url, created_at')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cargar las categorías';
      setError(errorMessage);
      console.error('Error refetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    error,
    refetch
  };
};
