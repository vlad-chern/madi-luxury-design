
import { useState, useEffect } from 'react';
import { supabase, Product } from '@/lib/supabase';

export const useProductDetail = (productSlug: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useProductDetail - productSlug:', productSlug);
    fetchProduct();

    // Подписка на изменения в таблице products
    const channel = supabase
      .channel('product-detail-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Product updated:', payload);
          // Обновляем только если это тот же товар
          if (payload.new.slug === productSlug) {
            fetchProduct();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productSlug]);

  const processProductImages = (product: Product) => {
    if (!product.images || product.images.length === 0) {
      console.log('No images found for product:', product.name);
      return {
        ...product,
        images: ['/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png'] // fallback image
      };
    }

    // Обрабатываем каждое изображение
    const processedImages = product.images.map((imagePath: string) => {
      console.log('Processing image path:', imagePath);
      
      // Если это уже полный URL, возвращаем как есть
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      
      // Если это путь к lovable-uploads, возвращаем как есть
      if (imagePath.startsWith('/lovable-uploads/') || imagePath.startsWith('lovable-uploads/')) {
        return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      }
      
      // Если это путь в Supabase Storage, получаем публичный URL
      if (imagePath && !imagePath.startsWith('blob:')) {
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(imagePath);
        
        console.log('Generated public URL for', imagePath, ':', urlData.publicUrl);
        return urlData.publicUrl;
      }
      
      return imagePath;
    }).filter(Boolean); // Убираем пустые значения

    console.log('Processed images for product:', product.name, processedImages);
    
    return {
      ...product,
      images: processedImages.length > 0 ? processedImages : ['/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png']
    };
  };

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
            name,
            slug
          )
        `)
        .eq('slug', productSlug)
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched product raw data:', data);

      if (data) {
        const processedProduct = processProductImages(data);
        console.log('Final processed product:', processedProduct);
        setProduct(processedProduct);
      }
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
