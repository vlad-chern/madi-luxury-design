import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Upload, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { compressImage, uploadImageToSupabase } from '@/utils/imageCompression';

// Define types locally to avoid conflicts
interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_from: number | null;
  price_fixed: number | null;
  price_type: 'from' | 'fixed';
  category_id: string;
  images: string[];
  videos: string[];
  includes: string[];
  specifications: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

interface ProductManagerProps {
  language: 'es' | 'en' | 'ru';
}

const ProductManager: React.FC<ProductManagerProps> = ({ language }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price_from: '',
    price_fixed: '',
    price_type: 'from' as 'from' | 'fixed',
    category_id: '',
    images: [] as string[],
    videos: [] as string[],
    includes: [] as string[],
    specifications: {} as Record<string, any>,
    is_active: true
  });
  const [includesList, setIncludesList] = useState('');
  const [specificationsList, setSpecificationsList] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [slugError, setSlugError] = useState('');
  const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Gestión de Productos',
      addProduct: 'Añadir Producto',
      editProduct: 'Editar Producto',
      name: 'Nombre',
      slug: 'Slug (URL)',
      description: 'Descripción',
      priceType: 'Tipo de Precio',
      priceFrom: 'Precio "desde" (EUR)',
      priceFixed: 'Precio Fijo (EUR)',
      category: 'Categoría',
      includes: 'Qué incluye',
      specifications: 'Especificaciones',
      images: 'Imágenes',
      addImage: 'Añadir Imagen',
      imageUrl: 'URL de Imagen',
      active: 'Producto Activo',
      update: 'Actualizar',
      add: 'Añadir',
      actions: 'Acciones',
      price: 'Precio',
      status: 'Estado',
      activeStatus: 'Activo',
      inactiveStatus: 'Inactivo',
      noPriceSet: 'No establecido',
      selectCategory: 'Seleccionar categoría',
      includesPlaceholder: 'Diseño personalizado y asesoramiento profesional\nFabricación artesanal con materiales premium',
      specificationsPlaceholder: 'Tiempo de entrega: 6-8 semanas\nMateriales: Madera noble, mármol natural',
      priceFromType: 'Desde (precio)',
      fixedPriceType: 'Fijo',
      productAdded: 'Producto Añadido',
      productUpdated: 'Producto Actualizado',
      productDeleted: 'Producto Eliminado',
      productAddedDesc: 'Producto añadido exitosamente',
      productUpdatedDesc: 'Producto actualizado exitosamente',
      productDeletedDesc: 'Producto eliminado exitosamente',
      error: 'Error',
      saveError: 'No se pudo guardar el producto',
      deleteError: 'No se pudo eliminar el producto',
      uploadImage: 'Subir Imagen',
      uploadingImage: 'Subiendo imagen...',
      imageUploadError: 'Error al subir imagen',
      selectImage: 'Seleccionar imagen',
      dragDropImage: 'Arrastra una imagen aquí o haz clic para seleccionar',
      loading: 'Cargando productos...',
      loadError: 'Error al cargar productos'
    },
    en: {
      title: 'Product Management',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      name: 'Name',
      slug: 'Slug (URL)',
      description: 'Description',
      priceType: 'Price Type',
      priceFrom: 'Price "from" (EUR)',
      priceFixed: 'Fixed Price (EUR)',
      category: 'Category',
      includes: 'What\'s included',
      specifications: 'Specifications',
      images: 'Images',
      addImage: 'Add Image',
      imageUrl: 'Image URL',
      active: 'Active Product',
      update: 'Update',
      add: 'Add',
      actions: 'Actions',
      price: 'Price',
      status: 'Status',
      activeStatus: 'Active',
      inactiveStatus: 'Inactive',
      noPriceSet: 'Not set',
      selectCategory: 'Select category',
      includesPlaceholder: 'Personalized design and professional advice\nHandcrafted with premium materials',
      specificationsPlaceholder: 'Delivery time: 6-8 weeks\nMaterials: Noble wood, natural marble',
      priceFromType: 'From (price)',
      fixedPriceType: 'Fixed',
      productAdded: 'Product Added',
      productUpdated: 'Product Updated',
      productDeleted: 'Product Deleted',
      productAddedDesc: 'Product successfully added',
      productUpdatedDesc: 'Product successfully updated',
      productDeletedDesc: 'Product successfully deleted',
      error: 'Error',
      saveError: 'Could not save product',
      deleteError: 'Could not delete product',
      uploadImage: 'Upload Image',
      uploadingImage: 'Uploading image...',
      imageUploadError: 'Error uploading image',
      selectImage: 'Select image',
      dragDropImage: 'Drag an image here or click to select',
      loading: 'Loading products...',
      loadError: 'Error loading products'
    },
    ru: {
      title: 'Управление товарами',
      addProduct: 'Добавить товар',
      editProduct: 'Редактировать товар',
      name: 'Название',
      slug: 'Слаг (URL)',
      description: 'Описание',
      priceType: 'Тип цены',
      priceFrom: 'Цена "от" (EUR)',
      priceFixed: 'Фиксированная цена (EUR)',
      category: 'Категория',
      includes: 'Что включено',
      specifications: 'Характеристики',
      images: 'Изображения',
      addImage: 'Добавить изображение',
      imageUrl: 'URL изображения',
      active: 'Активный товар',
      update: 'Обновить',
      add: 'Добавить',
      actions: 'Действия',
      price: 'Цена',
      status: 'Статус',
      activeStatus: 'Активен',
      inactiveStatus: 'Неактивен',
      noPriceSet: 'Не указана',
      selectCategory: 'Выберите категорию',
      includesPlaceholder: 'Персонализированный дизайн и профессиональная консультация\nРучная работа с премиальными материалами',
      specificationsPlaceholder: 'Время доставки: 6-8 недель\nМатериалы: Благородное дерево, натуральный мрамор',
      priceFromType: 'От (цены)',
      fixedPriceType: 'Фиксированная',
      productAdded: 'Товар добавлен',
      productUpdated: 'Товар обновлен',
      productDeleted: 'Товар удален',
      productAddedDesc: 'Товар успешно добавлен',
      productUpdatedDesc: 'Товар успешно обновлен',
      productDeletedDesc: 'Товар успешно удален',
      error: 'Ошибка',
      saveError: 'Не удалось сохранить товар',
      deleteError: 'Не удалось удалить товар',
      uploadImage: 'Загрузить изображение',
      uploadingImage: 'Загрузка изображения...',
      imageUploadError: 'Ошибка загрузки изображения',
      selectImage: 'Выбрать изображение',
      dragDropImage: 'Перетащите изображение сюда или нажмите для выбора',
      loading: 'Загрузка товаров...',
      loadError: 'Ошибка загрузки товаров'
    }
  };

  const t = translations[language];

  // Helper function to get image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png';
    
    if (imagePath.startsWith('http')) {
      return imagePath; // Already a full URL
    }
    if (imagePath.startsWith('blob:')) {
      return imagePath; // Blob URL
    }
    if (imagePath.startsWith('/')) {
      return imagePath; // Relative URL
    }
    
    // Storage path - get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    return urlData.publicUrl;
  };

  // Helper function to remove image
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Helper function to add image from URL
  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching products...');
      
      // First fetch products without categories to avoid timeout
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products fetch error:', productsError);
        throw productsError;
      }

      // Then fetch categories separately
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        console.error('Categories fetch error:', categoriesError);
        throw categoriesError;
      }

      // Combine the data manually and process images
      const productsWithCategories = (productsData || []).map(product => {
        const category = categoriesData?.find(cat => cat.id === product.category_id);
        
        // Process image URLs - if they're storage paths, get public URLs
        const imageUrls = (product.images || []).map((path: string) => {
          if (path.startsWith('http')) {
            return path; // Already a full URL
          }
          if (path.startsWith('blob:')) {
            return path; // Blob URL
          }
          if (path.startsWith('/')) {
            return path; // Relative URL
          }
          // Storage path - get public URL
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(path);
          return urlData.publicUrl;
        }).filter(Boolean);
        
        return {
          ...product,
          price_type: (product.price_type as 'from' | 'fixed') || 'from',
          description: product.description || '',
          category_id: product.category_id || '',
          images: imageUrls,
          videos: product.videos || [],
          includes: product.includes || [],
          specifications: (product.specifications as Record<string, any>) || {},
          created_at: product.created_at || '',
          updated_at: product.updated_at || '',
          categories: category ? {
            ...category,
            description: category.description || '',
            image_url: category.image_url || null,
            created_at: category.created_at || '',
            updated_at: category.updated_at || ''
          } : undefined
        };
      });

      console.log('Fetched products with images:', productsWithCategories.length);
      setProducts(productsWithCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: t.error,
        description: t.loadError,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (name: string) => {
    if (!name.trim()) return '';
    
    return name
      .toLowerCase()
      .trim()
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove special characters but keep letters, numbers, hyphens
      .replace(/[^a-z0-9\u00C0-\u017F\u0400-\u04FF-]/gi, '')
      // Replace multiple hyphens with single hyphen
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');
  };

  const validateSlug = (slug: string) => {
    setSlugError('');
    setSlugSuggestions([]);

    if (!slug.trim()) {
      setSlugError('El slug es requerido');
      return false;
    }

    // Check for invalid characters
    const invalidChars = slug.match(/[^a-z0-9-]/g);
    if (invalidChars) {
      const uniqueInvalidChars = [...new Set(invalidChars)];
      setSlugError(`Caracteres no válidos encontrados: ${uniqueInvalidChars.join(', ')}`);
      
      // Generate suggestions
      const cleanSlug = generateSlug(slug);
      const suggestions = [
        cleanSlug,
        cleanSlug.replace(/-/g, ''),
        cleanSlug.replace(/-/g, '_').toLowerCase()
      ].filter(s => s && s !== slug);
      
      setSlugSuggestions([...new Set(suggestions)]);
      return false;
    }

    // Check for consecutive hyphens
    if (slug.includes('--')) {
      setSlugError('No se permiten guiones consecutivos');
      setSlugSuggestions([slug.replace(/-+/g, '-')]);
      return false;
    }

    // Check for leading/trailing hyphens
    if (slug.startsWith('-') || slug.endsWith('-')) {
      setSlugError('El slug no puede empezar o terminar con guión');
      setSlugSuggestions([slug.replace(/^-+|-+$/g, '')]);
      return false;
    }

    return true;
  };

  const handleNameChange = (name: string) => {
    const newSlug = generateSlug(name);
    setFormData(prev => ({
      ...prev,
      name,
      slug: newSlug
    }));
    
    // Clear any previous errors when auto-generating
    setSlugError('');
    setSlugSuggestions([]);
  };

  const handleSlugChange = (slug: string) => {
    setFormData(prev => ({ ...prev, slug }));
    validateSlug(slug);
  };

  const applySuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, slug: suggestion }));
    setSlugError('');
    setSlugSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate slug before submitting
    if (!validateSlug(formData.slug)) {
      toast({
        title: t.error,
        description: 'Por favor corrige el slug antes de continuar',
        variant: "destructive",
      });
      return;
    }
    
    try {
      const includes = includesList.split('\n').filter(item => item.trim() !== '');
      const specifications = specificationsList.split('\n').reduce((acc, line) => {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Правильно обрабатываем цены
      let price_from = null;
      let price_fixed = null;

      if (formData.price_type === 'from' && formData.price_from) {
        price_from = parseFloat(formData.price_from);
      }
      if (formData.price_type === 'fixed' && formData.price_fixed) {
        price_fixed = parseFloat(formData.price_fixed);
      }

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price_from,
        price_fixed,
        price_type: formData.price_type,
        category_id: formData.category_id,
        images: formData.images,
        videos: formData.videos,
        includes,
        specifications,
        is_active: formData.is_active
      };

      console.log('Saving product data:', productData);

      let result;
      if (editingProduct) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select();

        if (result.error) {
          console.error('Update error:', result.error);
          throw result.error;
        }
        
        console.log('Product updated:', result.data);

        toast({
          title: t.productUpdated,
          description: t.productUpdatedDesc,
        });
      } else {
        result = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (result.error) {
          console.error('Insert error:', result.error);
          throw result.error;
        }
        
        console.log('Product created:', result.data);

        toast({
          title: t.productAdded,
          description: t.productAddedDesc,
        });
      }

      // Принудительно обновляем список товаров
      await fetchProducts();
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: t.error,
        description: `${t.saveError}: ${error.message || 'No se pudo guardar el producto'}`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price_from: '',
      price_fixed: '',
      price_type: 'from',
      category_id: '',
      images: [],
      videos: [],
      includes: [],
      specifications: {},
      is_active: true
    });
    setIncludesList('');
    setSpecificationsList('');
    setNewImageUrl('');
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price_from: product.price_from?.toString() || '',
      price_fixed: product.price_fixed?.toString() || '',
      price_type: product.price_type,
      category_id: product.category_id,
      images: product.images,
      videos: product.videos,
      includes: product.includes,
      specifications: product.specifications,
      is_active: product.is_active
    });
    setIncludesList(product.includes.join('\n'));
    setSpecificationsList(Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`).join('\n'));
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t.productDeleted,
        description: t.productDeletedDesc,
      });
      
      // Принудительно обновляем список товаров
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: t.error,
        description: t.deleteError,
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Проверяем, что все файлы - изображения
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toast({
        title: t.error,
        description: 'Некоторые файлы не являются изображениями и были пропущены',
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress({});
    
    try {
      const uploadedPaths: string[] = [];
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const progressKey = `upload-${i}`;
        
        setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));
        
        try {
          console.log(`Uploading file ${i + 1}/${validFiles.length}:`, file.name);
          
          // Upload to Supabase Storage
          const filePath = await uploadImageToSupabase(file, 'products');
          uploadedPaths.push(filePath);
          
          setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));
          
          console.log(`File ${i + 1} uploaded successfully:`, filePath);
        } catch (error) {
          console.error(`Error uploading file ${i + 1}:`, error);
          setUploadProgress(prev => ({ ...prev, [progressKey]: -1 })); // Error state
          
          toast({
            title: t.error,
            description: `Ошибка загрузки ${file.name}: ${error.message}`,
            variant: "destructive",
          });
        }
      }
      
      if (uploadedPaths.length > 0) {
        // Add uploaded images to form (store paths, not URLs)
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedPaths]
        }));

        toast({
          title: 'Изображения загружены',
          description: `${uploadedPaths.length} изображений успешно загружено`,
        });
      }
    } catch (error) {
      console.error('Error in upload process:', error);
      toast({
        title: t.error,
        description: t.imageUploadError,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toast({
        title: t.error,
        description: 'Некоторые файлы не являются изображениями и были пропущены',
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress({});
    
    try {
      const uploadedPaths: string[] = [];
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const progressKey = `drop-${i}`;
        
        setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));
        
        try {
          const filePath = await uploadImageToSupabase(file, 'products');
          uploadedPaths.push(filePath);
          
          setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));
        } catch (error) {
          console.error(`Error uploading dropped file ${i + 1}:`, error);
          setUploadProgress(prev => ({ ...prev, [progressKey]: -1 }));
          
          toast({
            title: t.error,
            description: `Ошибка загрузки ${file.name}: ${error.message}`,
            variant: "destructive",
          });
        }
      }
      
      if (uploadedPaths.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedPaths]
        }));

        toast({
          title: 'Изображения загружены',
          description: `${uploadedPaths.length} изображений успешно загружено`,
        });
      }
    } catch (error) {
      console.error('Error in drop upload:', error);
      toast({
        title: t.error,
        description: t.imageUploadError,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const renderImageSlots = (images: string[]) => {
    const slots = [];
    const maxSlots = 10;
    
    // Render existing images
    for (let i = 0; i < Math.min(images.length, maxSlots); i++) {
      slots.push(
        <div key={`image-${i}`} className="relative group">
          <img 
            src={getImageUrl(images[i])} 
            alt={`Product ${i + 1}`}
            className="w-16 h-16 object-cover rounded border"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png';
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-1 -right-1 w-4 h-4 p-0 rounded-full opacity-80 hover:opacity-100"
            onClick={() => removeImage(i)}
          >
            <X className="w-2 h-2" />
          </Button>
        </div>
      );
    }
    
    // Render empty slots with plus icons
    for (let i = images.length; i < maxSlots; i++) {
      slots.push(
        <div key={`empty-${i}`} className="w-16 h-16 bg-gray-200 rounded border border-dashed border-gray-400 flex items-center justify-center">
          <Plus className="w-6 h-6 text-gray-400" />
        </div>
      );
    }
    
    return slots;
  };

  const renderUploadArea = () => (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">{t.dragDropImage}</p>
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-4">
            <div className="text-sm text-blue-600 mb-2">Загрузка изображений...</div>
            {Object.entries(uploadProgress).map(([key, progress]) => (
              <div key={key} className="mb-1">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress === -1 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.max(0, progress)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={isUploading}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button 
            type="button" 
            variant="outline" 
            disabled={isUploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              {isUploading ? 'Загрузка...' : 'Выбрать изображения'}
            </span>
          </Button>
        </label>
      </div>

      {/* Manual URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder={t.imageUrl}
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          disabled={isUploading}
        />
        <Button type="button" onClick={addImage} disabled={isUploading}>
          {t.addImage}
        </Button>
      </div>

      {/* Image Slots Grid */}
      <div className="grid grid-cols-5 gap-3">
        {renderImageSlots(formData.images)}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">{t.loading}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t.title}</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                {t.addProduct}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? t.editProduct : t.addProduct}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t.name}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                      className="bg-white text-black border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">{t.slug}</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      required
                      className={`bg-white text-black border-gray-300 ${
                        slugError ? 'border-red-500' : ''
                      }`}
                    />
                    {slugError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <div className="flex items-center gap-2 text-red-700 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {slugError}
                        </div>
                        {slugSuggestions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-red-600 mb-1">Sugerencias:</p>
                            <div className="flex flex-wrap gap-2">
                              {slugSuggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => applySuggestion(suggestion)}
                                  className="text-xs"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_type">{t.priceType}</Label>
                    <Select value={formData.price_type} onValueChange={(value: 'from' | 'fixed') => setFormData(prev => ({ ...prev, price_type: value }))}>
                      <SelectTrigger className="bg-white text-black border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="from">{t.priceFromType}</SelectItem>
                        <SelectItem value="fixed">{t.fixedPriceType}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price_from">{t.priceFrom}</Label>
                    <Input
                      id="price_from"
                      type="number"
                      step="0.01"
                      value={formData.price_from}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_from: e.target.value }))}
                      disabled={formData.price_type !== 'from'}
                      className="bg-white text-black border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_fixed">{t.priceFixed}</Label>
                    <Input
                      id="price_fixed"
                      type="number"
                      step="0.01"
                      value={formData.price_fixed}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_fixed: e.target.value }))}
                      disabled={formData.price_type !== 'fixed'}
                      className="bg-white text-black border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">{t.category}</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger className="bg-white text-black border-gray-300">
                      <SelectValue placeholder={t.selectCategory} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t.images}</Label>
                  {renderUploadArea()}
                </div>

                <div>
                  <Label htmlFor="includes">{t.includes} (cada línea con un nuevo elemento)</Label>
                  <Textarea
                    id="includes"
                    value={includesList}
                    onChange={(e) => setIncludesList(e.target.value)}
                    placeholder={t.includesPlaceholder}
                    rows={5}
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="specifications">{t.specifications} (formato: Clave: Valor)</Label>
                  <Textarea
                    id="specifications"
                    value={specificationsList}
                    onChange={(e) => setSpecificationsList(e.target.value)}
                    placeholder={t.specificationsPlaceholder}
                    rows={5}
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">{t.active}</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={!!slugError}>
                  {editingProduct ? t.update : t.add}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'es' ? 'Imagen' : language === 'en' ? 'Image' : 'Изображение'}</TableHead>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.category}</TableHead>
              <TableHead>{t.price}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={getImageUrl(product.images[0])} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">No img</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.categories?.name}</TableCell>
                <TableCell>
                  {product.price_type === 'from' && product.price_from
                    ? `${language === 'es' ? 'desde' : language === 'en' ? 'from' : 'от'} ${product.price_from}€`
                    : product.price_fixed
                    ? `${product.price_fixed}€`
                    : t.noPriceSet}
                </TableCell>
                <TableCell>{product.is_active ? t.activeStatus : t.inactiveStatus}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductManager;
