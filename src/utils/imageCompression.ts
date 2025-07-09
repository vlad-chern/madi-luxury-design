
export const compressImage = (file: File, maxWidth: number = 1200, maxHeight: number = 900, quality: number = 0.85): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions with more aggressive scaling
      let { width, height } = img;
      
      // If image is very large, scale it down more aggressively
      const maxDimension = Math.max(maxWidth, maxHeight);
      const currentMaxDimension = Math.max(width, height);
      
      if (currentMaxDimension > maxDimension) {
        const scaleFactor = maxDimension / currentMaxDimension;
        width = Math.floor(width * scaleFactor);
        height = Math.floor(height * scaleFactor);
      }
      
      // Further optimize if still large
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          if (width > maxWidth) {
            height = Math.floor((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.floor((width * maxHeight) / height);
            height = maxHeight;
          }
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress with better quality settings
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            console.log(`Image compressed: ${file.name} from ${(file.size / 1024).toFixed(1)}KB to ${(compressedFile.size / 1024).toFixed(1)}KB`);
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Новая функция для сжатия изображений по URL
export const compressImageFromUrl = (imageUrl: string, maxWidth: number = 1200, maxHeight: number = 900, quality: number = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions with aggressive scaling
      const maxDimension = Math.max(maxWidth, maxHeight);
      const currentMaxDimension = Math.max(width, height);
      
      if (currentMaxDimension > maxDimension) {
        const scaleFactor = maxDimension / currentMaxDimension;
        width = Math.floor(width * scaleFactor);
        height = Math.floor(height * scaleFactor);
      }
      
      // Further optimize dimensions
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          if (width > maxWidth) {
            height = Math.floor((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.floor((width * maxHeight) / height);
            height = maxHeight;
          }
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => {
      console.warn(`Failed to compress image: ${imageUrl}`);
      resolve(imageUrl); // Return original URL if compression fails
    };
    
    img.src = imageUrl;
  });
};

export const uploadImageToSupabase = async (file: File, folder: string = 'products'): Promise<string> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  console.log('Starting image upload to Supabase...', file.name);
  
  // Compress the image more aggressively before uploading
  const compressedFile = await compressImage(file, 1200, 900, 0.85);
  
  // Generate a unique filename
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;
  
  console.log('Uploading file to path:', filePath);
  
  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    console.log('File uploaded successfully:', data);
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    console.log('Public URL generated:', urlData.publicUrl);
    
    // Return the file path (not the full URL) to store in database
    return filePath;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
};
