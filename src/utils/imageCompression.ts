
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
  
  // For development, we'll create a proper static URL instead of blob
  // This simulates what would happen with real file upload
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
  
  // Blob URLs (temporary) - return placeholder since they expire
  if (imagePath.startsWith('blob:')) {
    return '/content/placeholders/default.png';
  }
  
  // Unsplash or other external image services
  if (imagePath.includes('unsplash.com')) {
    return `https://images.unsplash.com/${imagePath}`;
  }
  
  // Check if it's just a filename from the old structure
  if (imagePath.includes('.png') || imagePath.includes('.jpg') || imagePath.includes('.jpeg')) {
    // Extract just the filename
    const filename = imagePath.split('/').pop() || imagePath;
    return `/content/${fallbackFolder}/${filename}`;
  }
  
  // Default case - assume it's a filename and put it in the specified folder
  return `/content/${fallbackFolder}/${imagePath}`;
};

// Helper function to convert blob URLs to proper paths for storage
export const convertBlobToPath = async (blobUrl: string, folder: string = 'products'): Promise<string> => {
  if (!blobUrl.startsWith('blob:')) {
    return blobUrl; // Not a blob URL, return as is
  }
  
  try {
    // Fetch the blob data
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    // Create a file from the blob
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    
    // Generate a proper path for storage
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
    return `/content/${folder}/${fileName}`;
  } catch (error) {
    console.error('Error converting blob URL:', error);
    return '/content/placeholders/default.png';
  }
};
