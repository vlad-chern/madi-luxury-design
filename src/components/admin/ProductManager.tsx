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
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
  const { toast } = useToast();

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
          console.log('Product change detected:', payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            description,
            image_url,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched products:', data);
      // Properly cast and transform the data to match our interface
      const typedProducts: Product[] = data?.map(product => ({
        ...product,
        price_type: (product.price_type as 'from' | 'fixed') || 'from',
        description: product.description || '',
        category_id: product.category_id || '',
        images: product.images || [],
        videos: product.videos || [],
        includes: product.includes || [],
        specifications: (product.specifications as Record<string, any>) || {},
        created_at: product.created_at || '',
        updated_at: product.updated_at || '',
        categories: product.categories ? {
          ...product.categories,
          description: product.categories.description || '',
          image_url: product.categories.image_url || null,
          created_at: product.categories.created_at || '',
          updated_at: product.categories.updated_at || ''
        } : undefined
      })) || [];
      setProducts(typedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
        variant: "destructive",
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          title: "Товар обновлен",
          description: `Товар "${formData.name}" успешно обновлен`,
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
          title: "Товар добавлен",
          description: `Товар "${formData.name}" успешно добавлен`,
        });
      }

      // Принудительно обновляем список товаров
      await fetchProducts();
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Ошибка",
        description: `Не удалось сохранить товар: ${error.message || 'Неизвестная ошибка'}`,
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
        title: "Товар удален",
        description: "Товар успешно удален",
      });
      
      // Принудительно обновляем список товаров
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Управление товарами</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить товар
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Название</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Слаг (URL)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_type">Тип цены</Label>
                    <Select value={formData.price_type} onValueChange={(value: 'from' | 'fixed') => setFormData(prev => ({ ...prev, price_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="from">От (цены)</SelectItem>
                        <SelectItem value="fixed">Фиксированная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price_from">Цена "от" (EUR)</Label>
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
                    <Label htmlFor="price_fixed">Фиксированная цена (EUR)</Label>
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
                  <Label htmlFor="category">Категория</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
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
                  <Label htmlFor="includes">Что включено (каждый пункт с новой строки)</Label>
                  <Textarea
                    id="includes"
                    value={includesList}
                    onChange={(e) => setIncludesList(e.target.value)}
                    placeholder="Дизайн персонализированный и asesoramiento profesional&#10;Fabricación artesanal con materiales premium"
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="specifications">Характеристики (формат: Ключ: Значение)</Label>
                  <Textarea
                    id="specifications"
                    value={specificationsList}
                    onChange={(e) => setSpecificationsList(e.target.value)}
                    placeholder="Tiempo de entrega: 6-8 semanas&#10;Materiales: Madera noble, mármol natural"
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
                    <Label htmlFor="is_active">Активный товар</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editingProduct ? 'Обновить' : 'Добавить'}
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
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.categories?.name}</TableCell>
                <TableCell>
                  {product.price_type === 'from' && product.price_from
                    ? `от ${product.price_from}€`
                    : product.price_fixed
                    ? `${product.price_fixed}€`
                    : 'Не указана'}
                </TableCell>
                <TableCell>{product.is_active ? 'Активен' : 'Неактивен'}</TableCell>
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
