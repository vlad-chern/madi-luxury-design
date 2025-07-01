
import { useState, useEffect } from 'react';
import { supabase, Category } from '@/lib/supabase';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching categories...');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      console.log('Categories loaded:', data?.length || 0);
      setCategories(data || []);
      
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      const errorMessage = error.message || 'Error al cargar las categorías';
      setError(errorMessage);
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
