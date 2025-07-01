
export const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
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

export const uploadImageToSupabase = async (file: File, folder: string = 'products'): Promise<string> => {
  // Compress the image before uploading
  const compressedFile = await compressImage(file);
  
  // Generate a unique filename with organized folder structure
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
  const fullPath = `content/${folder}/${fileName}`;
  
  // For now, we'll return a placeholder URL since Supabase storage isn't set up
  // When Supabase storage is configured, this would upload to the bucket
  // const { data, error } = await supabase.storage
  //   .from('madiluxe')
  //   .upload(fullPath, compressedFile);
  
  // Return the new organized structure URL
  return `/content/${folder}/${fileName}`;
};

// Helper function to get the correct image URL based on different path formats
export const getImageUrl = (imagePath: string, fallbackFolder: string = 'general') => {
  if (!imagePath) {
    return '/content/placeholders/default.png';
  }
  
  // Already a full URL (external)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Already in new content structure
  if (imagePath.startsWith('/content/')) {
    return imagePath;
  }
  
  // Legacy lovable-uploads structure - convert to new structure
  if (imagePath.startsWith('/lovable-uploads/')) {
    const filename = imagePath.replace('/lovable-uploads/', '');
    return `/content/${fallbackFolder}/${filename}`;
  }
  
  if (imagePath.startsWith('lovable-uploads/')) {
    const filename = imagePath.replace('lovable-uploads/', '');
    return `/content/${fallbackFolder}/${filename}`;
  }
  
  // Blob URLs (temporary)
  if (imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // Unsplash or other external image services
  if (imagePath.includes('unsplash.com')) {
    return `https://images.unsplash.com/${imagePath}`;
  }
  
  // Default case - assume it's a filename and put it in the specified folder
  return `/content/${fallbackFolder}/${imagePath}`;
};
