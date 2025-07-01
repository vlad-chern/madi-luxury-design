
import { useState, useEffect } from 'react';
import { supabase, Product } from '@/lib/supabase';

export const useProductDetail = (productSlug: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useProductDetail - productSlug:', productSlug);
    fetchProduct();
  }, [productSlug]);

  const fetchProduct = async () => {
    if (!productSlug) {
      setError('Product slug not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching product with slug:', productSlug);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('slug', productSlug)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched product:', data);
      console.log('Product images:', data?.images);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct
  };
};
