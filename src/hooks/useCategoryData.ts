
import { useState, useEffect } from 'react';
import { supabase, Product, Category } from '@/lib/supabase';

export const useCategoryData = (categorySlug: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryAndProducts();
    }
  }, [categorySlug]);

  const fetchCategoryAndProducts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch category data
      const { data: categoryResult, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .single();
      
      if (categoryError) throw categoryError;
      setCategoryData(categoryResult);

      // Fetch products for this category
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
        .eq('is_active', true);
      
      if (productsError) throw productsError;
      setProducts(productsResult || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    categoryData,
    isLoading
  };
};
