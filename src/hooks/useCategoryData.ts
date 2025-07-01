
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
      
      // Получаем категорию
      const { data: categoryResult, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .maybeSingle();
      
      if (categoryError) {
        console.error('Category fetch error:', categoryError);
        throw new Error(`Error al cargar la categoría: ${categoryError.message}`);
      }
      
      if (!categoryResult) {
        console.error('Category not found for slug:', categorySlug);
        throw new Error('Categoría no encontrada');
      }
      
      console.log('Category data loaded:', categoryResult);
      setCategoryData(categoryResult);

      // Получаем продукты для этой категории
      const { data: productsResult, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('category_id', categoryResult.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (productsError) {
        console.error('Products fetch error:', productsError);
        throw new Error(`Error al cargar los productos: ${productsError.message}`);
      }
      
      console.log('Products loaded:', productsResult?.length || 0);
      setProducts(productsResult || []);
      
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
