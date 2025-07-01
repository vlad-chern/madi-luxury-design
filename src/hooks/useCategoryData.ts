
import { useState, useEffect } from 'react';
import { supabase, Product, Category } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useCategoryData = (categorySlug: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('useCategoryData hook categorySlug:', categorySlug);
    if (categorySlug) {
      fetchCategoryAndProducts();
    } else {
      setIsLoading(false);
      setError('Slug de categoría no encontrado');
    }
  }, [categorySlug]);

  const fetchCategoryAndProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching category data for slug:', categorySlug);
      
      // Уменьжаем таймаут для более быстрого отклика
      const categoryPromise = supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .maybeSingle();

      const categoryResult = await Promise.race([
        categoryPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Tiempo de espera agotado para la categoría')), 5000)
        )
      ]) as any;
      
      if (categoryResult.error) {
        console.error('Category fetch error:', categoryResult.error);
        throw new Error(`Error al cargar la categoría: ${categoryResult.error.message}`);
      }
      
      if (!categoryResult.data) {
        console.error('Category not found for slug:', categorySlug);
        throw new Error('Categoría no encontrada');
      }
      
      console.log('Category data loaded:', categoryResult.data);
      setCategoryData(categoryResult.data);

      // Fetch products только если категория найдена
      const productsPromise = supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('category_id', categoryResult.data.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const productsResult = await Promise.race([
        productsPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Tiempo de espera agotado para los productos')), 5000)
        )
      ]) as any;
      
      if (productsResult.error) {
        console.error('Products fetch error:', productsResult.error);
        throw new Error(`Error al cargar los productos: ${productsResult.error.message}`);
      }
      
      console.log('Products loaded:', productsResult.data?.length || 0);
      setProducts(productsResult.data || []);
      
    } catch (error: any) {
      console.error('Error fetching category data:', error);
      const errorMessage = error.message || 'Error desconocido al cargar los datos';
      setError(errorMessage);
      
      toast({
        title: "Error de carga",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    categoryData,
    isLoading,
    error,
    refetch: fetchCategoryAndProducts
  };
};
