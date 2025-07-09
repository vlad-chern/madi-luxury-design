// Image optimization utility for converting and compressing images to WebP format

export interface ImageOptimizationOptions {
  quality?: number; // 0-100, default 80
  maxWidth?: number; // Max width in pixels
  maxHeight?: number; // Max height in pixels
  format?: 'webp' | 'jpeg' | 'png';
}

export class ImageOptimizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Convert image to WebP format with compression
   */
  async optimizeImage(
    file: File | string, 
    options: ImageOptimizationOptions = {}
  ): Promise<Blob> {
    const {
      quality = 80,
      maxWidth = 1920,
      maxHeight = 1080,
      format = 'webp'
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = this.calculateDimensions(
          img.width, 
          img.height, 
          maxWidth, 
          maxHeight
        );

        // Set canvas size
        this.canvas.width = width;
        this.canvas.height = height;

        // Clear canvas and draw image
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with specified format and quality
        this.canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          `image/${format}`,
          quality / 100
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));

      if (typeof file === 'string') {
        img.src = file;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /**
   * Calculate new dimensions maintaining aspect ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // If image is larger than max dimensions, scale it down
    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height;

      if (width > height) {
        width = maxWidth;
        height = width / aspectRatio;
      } else {
        height = maxHeight;
        width = height * aspectRatio;
      }

      // Ensure we don't exceed max dimensions
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Get file size in KB
   */
  static getFileSizeKB(blob: Blob): number {
    return Math.round(blob.size / 1024);
  }

  /**
   * Check if image needs optimization (>800KB or not WebP)
   */
  static needsOptimization(file: File): boolean {
    const sizeKB = this.getFileSizeKB(file);
    const isWebP = file.type === 'image/webp';
    return sizeKB > 800 || !isWebP;
  }
}

/**
 * Batch optimize images from lovable-uploads folder
 */
export class LovableUploadsOptimizer {
  private optimizer: ImageOptimizer;
  private baseUrl: string;

  constructor() {
    this.optimizer = new ImageOptimizer();
    this.baseUrl = '/lovable-uploads/';
  }

  /**
   * Get all image files from lovable-uploads
   */
  private getImageList(): string[] {
    // List of all images in lovable-uploads folder
    return [
      '02a64ca8-6876-4d58-8c8f-1ea5031f4a9c.png',
      '079503db-bf20-40bb-ae5c-5105bbc7cbb7.png',
      '12d2af38-c23d-4b9c-8feb-7bd0f637ecb5.png',
      '164799a3-84d8-464d-af8e-14c2c4ca44c0.png',
      '2004e972-5649-4436-9f59-2ad565bc3ea1.png',
      '2cdf3057-4b67-4fd6-9a35-22d93960d69c.png',
      '2dc1aa7a-1f43-480e-9254-b4a814d06baf.png',
      '2ff321c4-11f7-489a-860b-fadf6b38b375.png',
      '3473e16d-3e78-4595-83ba-3de762170ac5.png',
      '38b171b9-871d-4140-8816-8b9e700c233b.png',
      '471bc22d-6315-46e0-87b5-210c2eb4466a.png',
      '4bafff0d-9993-460d-ae96-fdbf04a98784.png',
      '506eb196-24c7-48ab-aba0-571500fc0ffe.png',
      '52ae2dc4-ff95-4995-95ee-3920d5a663ac.png',
      '52fb3c8e-ed45-4620-a143-5f46300b53b1.png',
      '533f1ed3-906f-407f-bb25-d911e3123588.png',
      '5a5e6255-c31b-4ad1-9fb7-7ab200ef3add.png',
      '6077d6cb-0b90-4c79-bc56-1688ceb20f0a.png',
      '65ef1dab-4ca5-4dd6-8188-1774fef552af.png',
      '69943934-a89f-4d8b-bff8-aad38a2dba86.png',
      '6ba7f911-4eaf-4fe8-9eea-3244342324ba.png',
      '6e14d5d0-d09a-4e5d-a225-e54a28555895.png',
      '704e9a1d-8893-4965-a3ee-7197dac0910e.png',
      '75fee044-f881-4fda-91c4-f03dbec16e0c.png',
      '7605104b-dc16-4409-937f-d4dbd0035488.png',
      '7d38a2be-0cc8-4fe8-90be-14b44b24647d.png',
      '7db2c192-149e-4f78-80bd-ade35a77b765.png',
      '83f9b699-0e6f-4376-ae1b-c42698cbfa9d.png',
      '914ee2d0-75d6-425d-b8f3-a9f4f22e7698.png',
      'a13b3fbd-254d-4647-876b-e2ce58849448.png',
      'a3c240e5-0ac4-4c59-9bb8-44e3c09400d1.png',
      'b286a941-43ea-4e43-a5fa-532d8bc45c16.png',
      'b32560c8-0021-4e69-a470-11a9cd52c337.png',
      'c0bfff03-02b0-4ff8-8777-ae7ad8a62484.png',
      'c5d63d67-7df7-4063-8bd2-06c80335b476.png',
      'c92ac2f2-9a51-4468-a91f-0d274e5bff8d.png',
      'cde9e21e-3376-46aa-b353-c54f19e162d2.png',
      'd3d35726-01a0-44cd-82db-684a6f1b8130.png',
      'eae42cfb-24a6-4bed-a436-2a39af167c3b.png',
      'f2a9ca0c-e245-41fa-81a7-77852fe8f37a.png',
      'f4fed17d-01a8-4295-b2d1-256971d9b7b7.png'
    ];
  }

  /**
   * Download and optimize single image
   */
  private async optimizeImage(filename: string): Promise<{
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    blob: Blob;
  }> {
    const imageUrl = this.baseUrl + filename;
    
    try {
      // Fetch original image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
      }
      
      const originalBlob = await response.blob();
      const originalSize = ImageOptimizer.getFileSizeKB(originalBlob);

      // Skip if already WebP and under 800KB
      if (originalBlob.type === 'image/webp' && originalSize <= 800) {
        return {
          originalSize,
          optimizedSize: originalSize,
          compressionRatio: 1,
          blob: originalBlob
        };
      }

      // Optimize image
      const optimizedBlob = await this.optimizer.optimizeImage(imageUrl, {
        quality: originalSize > 800 ? 70 : 80, // Lower quality for larger files
        maxWidth: 1920,
        maxHeight: 1080,
        format: 'webp'
      });

      const optimizedSize = ImageOptimizer.getFileSizeKB(optimizedBlob);
      const compressionRatio = originalSize / optimizedSize;

      return {
        originalSize,
        optimizedSize,
        compressionRatio,
        blob: optimizedBlob
      };
    } catch (error) {
      console.error(`Error optimizing ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Optimize all images and return download links
   */
  async optimizeAllImages(): Promise<{
    results: Array<{
      filename: string;
      originalSize: number;
      optimizedSize: number;
      compressionRatio: number;
      downloadUrl: string;
    }>;
    totalOriginalSize: number;
    totalOptimizedSize: number;
    totalSavings: number;
  }> {
    const imageList = this.getImageList();
    const results = [];
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    console.log(`Starting optimization of ${imageList.length} images...`);

    for (const filename of imageList) {
      try {
        console.log(`Optimizing ${filename}...`);
        
        const result = await this.optimizeImage(filename);
        
        // Create download URL for optimized image
        const downloadUrl = URL.createObjectURL(result.blob);
        
        // Generate WebP filename
        const webpFilename = filename.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp');
        
        results.push({
          filename: webpFilename,
          originalSize: result.originalSize,
          optimizedSize: result.optimizedSize,
          compressionRatio: result.compressionRatio,
          downloadUrl
        });

        totalOriginalSize += result.originalSize;
        totalOptimizedSize += result.optimizedSize;

        console.log(`✅ ${filename} -> ${webpFilename}: ${result.originalSize}KB -> ${result.optimizedSize}KB (${result.compressionRatio.toFixed(1)}x compression)`);
        
      } catch (error) {
        console.error(`❌ Failed to optimize ${filename}:`, error);
      }
    }

    const totalSavings = totalOriginalSize - totalOptimizedSize;

    return {
      results,
      totalOriginalSize,
      totalOptimizedSize,
      totalSavings
    };
  }
}

// Export for use in components
export default ImageOptimizer;