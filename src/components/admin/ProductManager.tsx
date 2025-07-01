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
import { Plus, Edit, Trash2, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { compressImage, getImageUrl, convertBlobToPath, uploadImageToSupabase } from '@/utils/imageCompression';

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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;
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
      loading: 'Cargando...',
      loadError: 'Error al cargar datos',
      previousPage: 'Página anterior',
      nextPage: 'Página siguiente',
      showingResults: 'Mostrando {start}-{end} de {total} productos'
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
      loading: 'Loading...',
      loadError: 'Error loading data',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      showingResults: 'Showing {start}-{end} of {total} products'
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
      loading: 'Загрузка...',
      loadError: 'Ошибка загрузки данных',
      previousPage: 'Предыдущая страница',
      nextPage: 'Следующая страница',
      showingResults: 'Показано {start}-{end} из {total} товаров'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    // Подписка на изменения в таблице products
    const channel = supabase
      .channel('product-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // Сначала получаем общее количество продуктов
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (count !== null) {
        setTotalProducts(count);
        setHasMore((currentPage + 1) * ITEMS_PER_PAGE < count);
      }

      // Получаем продукты с пагинацией, но без связанных категорий
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          price_from,
          price_fixed,
          price_type,
          category_id,
          images,
          videos,
          includes,
          specifications,
          is_active,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })
        .range(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE - 1);

      if (productsError) {
        throw productsError;
      }

      // Получаем категории отдельно для найденных продуктов
      if (productsData && productsData.length > 0) {
        const categoryIds = [...new Set(productsData.map(p => p.category_id).filter(Boolean))];
        
        if (categoryIds.length > 0) {
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select('id, name, slug, description, image_url, created_at, updated_at')
            .in('id', categoryIds);

          if (!categoriesError && categoriesData) {
            // Добавляем категории к продуктам и приводим типы
            const productsWithCategories: Product[] = productsData.map(product => ({
              ...product,
              price_type: (product.price_type as 'from' | 'fixed') || 'from',
              specifications: (product.specifications as Record<string, any>) || {},
              includes: Array.isArray(product.includes) ? product.includes : [],
              images: Array.isArray(product.images) ? product.images : [],
              videos: Array.isArray(product.videos) ? product.videos : [],
              categories: categoriesData.find(cat => cat.id === product.category_id)
            }));
            
            setProducts(productsWithCategories);
          } else {
            // Приводим типы для продуктов без категорий
            const typedProducts: Product[] = productsData.map(product => ({
              ...product,
              price_type: (product.price_type as 'from' | 'fixed') || 'from',
              specifications: (product.specifications as Record<string, any>) || {},
              includes: Array.isArray(product.includes) ? product.includes : [],
              images: Array.isArray(product.images) ? product.images : [],
              videos: Array.isArray(product.videos) ? product.videos : []
            }));
            setProducts(typedProducts);
          }
        } else {
          // Приводим типы для продуктов без ссылок на категории
          const typedProducts: Product[] = productsData.map(product => ({
            ...product,
            price_type: (product.price_type as 'from' | 'fixed') || 'from',
            specifications: (product.specifications as Record<string, any>) || {},
            includes: Array.isArray(product.includes) ? product.includes : [],
            images: Array.isArray(product.images) ? product.images : [],
            videos: Array.isArray(product.videos) ? product.videos : []
          }));
          setProducts(typedProducts);
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: t.error,
        description: t.loadError,
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, image_url, created_at, updated_at')
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: t.error,
        description: 'No se pudieron cargar las categorías',
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (!sessionToken) {
        toast({
          title: t.error,
          description: 'Sesión expirada',
          variant: "destructive",
        });
        return;
      }

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

      // Конвертируем blob URL-ы в нормальные пути
      const processedImages = await Promise.all(
        formData.images.map(async (imageUrl) => {
          if (imageUrl.startsWith('blob:')) {
            return await convertBlobToPath(imageUrl, 'products');
          }
          return imageUrl;
        })
      );

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price_from,
        price_fixed,
        price_type: formData.price_type,
        category_id: formData.category_id,
        images: processedImages,
        videos: formData.videos,
        includes,
        specifications,
        is_active: formData.is_active
      };

      let result;
      if (editingProduct) {
        result = await supabase.functions.invoke('admin-query', {
          body: {
            session_token: sessionToken,
            query: 'products',
            action: 'update',
            data: productData,
            id: editingProduct.id
          }
        });

        if (result.error || !result.data?.success) {
          throw new Error(result.data?.error || 'Failed to update product');
        }

        toast({
          title: t.productUpdated,
          description: t.productUpdatedDesc,
        });
      } else {
        result = await supabase.functions.invoke('admin-query', {
          body: {
            session_token: sessionToken,
            query: 'products',
            action: 'insert',
            data: productData
          }
        });

        if (result.error || !result.data?.success) {
          throw new Error(result.data?.error || 'Failed to create product');
        }

        toast({
          title: t.productAdded,
          description: t.productAddedDesc,
        });
      }

      // Принудительно обновляем список товаров
      await fetchProducts();
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
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
      const sessionToken = localStorage.getItem('admin_session_token');
      if (!sessionToken) {
        toast({
          title: t.error,
          description: 'Sesión expirada',
          variant: "destructive",
        });
        return;
      }

      const result = await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'products',
          action: 'delete',
          id: id
        }
      });

      if (result.error || !result.data?.success) {
        throw new Error(result.data?.error || 'Failed to delete product');
      }

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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
    
    try {
      const imageUrls: string[] = [];
      
      for (const file of validFiles) {
        console.log('Processing file:', file.name);
        // Создаем blob URL для немедленного отображения
        const blobUrl = await uploadImageToSupabase(file, 'products');
        console.log('Generated blob URL:', blobUrl);
        imageUrls.push(blobUrl);
      }
      
      console.log('Adding images to form:', imageUrls);
      // Добавляем все изображения к форме
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));

      toast({
        title: 'Изображения добавлены',
        description: `${validFiles.length} изображений успешно добавлено`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: t.error,
        description: t.imageUploadError,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
    
    try {
      const imageUrls: string[] = [];
      
      for (const file of validFiles) {
        console.log('Processing dropped file:', file.name);
        // Создаем blob URL для немедленного отображения
        const blobUrl = await uploadImageToSupabase(file, 'products');
        console.log('Generated blob URL for dropped file:', blobUrl);
        imageUrls.push(blobUrl);
      }
      
      console.log('Adding dropped images to form:', imageUrls);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));

      toast({
        title: 'Изображения добавлены',
        description: `${validFiles.length} изображений успешно добавлено`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: t.error,
        description: t.imageUploadError,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderImageSlots = (images: string[]) => {
    const slots = [];
    const maxSlots = 10;
    
    // Render existing images
    for (let i = 0; i < Math.min(images.length, maxSlots); i++) {
      const imageUrl = getImageUrl(images[i], 'products');
      console.log('Rendering image slot:', i, 'with URL:', imageUrl);
      
      slots.push(
        <div key={`image-${i}`} className="relative group">
          <img 
            src={imageUrl} 
            alt={`Product ${i + 1}`}
            className="w-16 h-16 object-cover rounded border"
            onError={(e) => {
              console.log('Image failed to load, using placeholder:', imageUrl);
              const target = e.target as HTMLImageElement;
              target.src = '/content/placeholders/default.png';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', imageUrl);
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

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatResultsText = (text: string) => {
    const start = currentPage * ITEMS_PER_PAGE + 1;
    const end = Math.min((currentPage + 1) * ITEMS_PER_PAGE, totalProducts);
    return text
      .replace('{start}', start.toString())
      .replace('{end}', end.toString())
      .replace('{total}', totalProducts.toString());
  };

  if (isLoading && products.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>{t.loading}</p>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">{t.slug}</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_type">{t.priceType}</Label>
                    <Select value={formData.price_type} onValueChange={(value: 'from' | 'fixed') => setFormData(prev => ({ ...prev, price_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">{t.category}</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectCategory} />
                    </SelectTrigger>
                    <SelectContent>
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
                  <div className="space-y-4">
                    {/* File Upload Area */}
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">{t.dragDropImage}</p>
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
                            {isUploading ? t.uploadingImage : 'Выбрать изображения'}
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
                      />
                      <Button type="button" onClick={addImage}>
                        {t.addImage}
                      </Button>
                    </div>

                    {/* Image Slots Grid */}
                    <div className="grid grid-cols-5 gap-3">
                      {renderImageSlots(formData.images)}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="includes">{t.includes} (cada línea con un nuevo elemento)</Label>
                  <Textarea
                    id="includes"
                    value={includesList}
                    onChange={(e) => setIncludesList(e.target.value)}
                    placeholder={t.includesPlaceholder}
                    rows={5}
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

                <Button type="submit" className="w-full">
                  {editingProduct ? t.update : t.add}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Pagination info */}
        {totalProducts > 0 && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {formatResultsText(t.showingResults)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 0 || isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
                {t.previousPage}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!hasMore || isLoading}
              >
                {t.nextPage}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

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
                      src={getImageUrl(product.images[0], 'products')} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/content/placeholders/default.png';
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

        {products.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Нет продуктов для отображения</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductManager;
