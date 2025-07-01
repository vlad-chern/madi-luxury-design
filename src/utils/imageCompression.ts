
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
  console.log('Uploading image to Supabase:', file.name);
  
  // Compress the image before uploading
  const compressedFile = await compressImage(file);
  
  // Generate a unique filename with organized folder structure
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
  const fullPath = `content/${folder}/${fileName}`;
  
  // Create blob URL for immediate preview
  const blobUrl = URL.createObjectURL(compressedFile);
  console.log('Created blob URL for preview:', blobUrl);
  
  // Return the blob URL for immediate use
  return blobUrl;
};

// Helper function to get the correct image URL based on different path formats
export const getImageUrl = (imagePath: string, fallbackFolder: string = 'general') => {
  console.log('getImageUrl called with:', imagePath);
  
  if (!imagePath) {
    console.log('No image path provided, using default placeholder');
    return '/content/placeholders/default.png';
  }
  
  // Already a full URL (external)
  if (imagePath.startsWith('http')) {
    console.log('External URL detected:', imagePath);
    return imagePath;
  }
  
  // Already in new content structure
  if (imagePath.startsWith('/content/')) {
    console.log('Content path detected:', imagePath);
    return imagePath;
  }
  
  // Legacy lovable-uploads structure - convert to new structure
  if (imagePath.startsWith('/lovable-uploads/')) {
    console.log('Legacy lovable-uploads path detected, converting:', imagePath);
    const filename = imagePath.replace('/lovable-uploads/', '');
    return `/content/${fallbackFolder}/${filename}`;
  }
  
  if (imagePath.startsWith('lovable-uploads/')) {
    console.log('Legacy lovable-uploads path without slash detected, converting:', imagePath);
    const filename = imagePath.replace('lovable-uploads/', '');
    return `/content/${fallbackFolder}/${filename}`;
  }
  
  // Blob URLs (temporary) - return as is for immediate display
  if (imagePath.startsWith('blob:')) {
    console.log('Blob URL detected, returning as is:', imagePath);
    return imagePath;
  }
  
  // Unsplash or other external image services
  if (imagePath.includes('unsplash.com')) {
    console.log('Unsplash URL detected:', imagePath);
    return `https://images.unsplash.com/${imagePath}`;
  }
  
  // Check if it's just a filename from the old structure
  if (imagePath.includes('.png') || imagePath.includes('.jpg') || imagePath.includes('.jpeg')) {
    console.log('File extension detected, creating content path:', imagePath);
    // Extract just the filename
    const filename = imagePath.split('/').pop() || imagePath;
    return `/content/${fallbackFolder}/${filename}`;
  }
  
  // Default case - assume it's a filename and put it in the specified folder
  console.log('Default case, creating content path:', imagePath);
  return `/content/${fallbackFolder}/${imagePath}`;
};

// Helper function to convert blob URLs to proper paths for storage
export const convertBlobToPath = async (blobUrl: string, folder: string = 'products'): Promise<string> => {
  if (!blobUrl.startsWith('blob:')) {
    return blobUrl; // Not a blob URL, return as is
  }
  
  try {
    console.log('Converting blob URL to path:', blobUrl);
    // Generate a proper path for storage
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
    const imagePath = `/content/${folder}/${fileName}`;
    console.log('Generated path for blob:', imagePath);
    return imagePath;
  } catch (error) {
    console.error('Error converting blob URL:', error);
    return '/content/placeholders/default.png';
  }
};
