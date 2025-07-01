
import { useState, useEffect } from 'react';
import { supabase, Category } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();

    // Убираем real-time подписку чтобы уменьшить нагрузку на базу
    // Подписка будет добавлена только в админке где это действительно нужно
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Добавляем таймаут для запроса
      const categoriesPromise = supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      const categoriesResult = await Promise.race([
        categoriesPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Tiempo de espera agotado')), 8000)
        )
      ]) as any;
      
      if (categoriesResult.error) {
        console.error('Error fetching categories:', categoriesResult.error);
        throw categoriesResult.error;
      }
      
      console.log('Categories loaded:', categoriesResult.data?.length || 0);
      setCategories(categoriesResult.data || []);
      
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      const errorMessage = error.message || 'Error al cargar las categorías';
      setError(errorMessage);
      
      // Не показываем toast на главной странице чтобы не мешать пользователю
      console.warn('Categories loading failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories
  };
};
