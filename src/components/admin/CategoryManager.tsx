import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase, Category } from '@/lib/supabase';

interface CategoryManagerProps {
  language?: 'es' | 'en' | 'ru';
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ language = 'es' }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Gestión de Categorías',
      addCategory: 'Agregar Categoría',
      editCategory: 'Editar Categoría',
      name: 'Nombre',
      description: 'Descripción',
      slug: 'Slug (URL)',
      image: 'Imagen de la categoría',
      actions: 'Acciones',
      update: 'Actualizar',
      add: 'Agregar',
      uploading: 'Subiendo...',
      noPhoto: 'Sin foto',
      categoryUpdated: 'Categoría actualizada',
      categoryUpdateSuccess: 'La categoría se actualizó exitosamente',
      categoryAdded: 'Categoría agregada',
      categoryAddSuccess: 'La categoría se agregó exitosamente',
      categoryDeleted: 'Categoría eliminada',
      categoryDeleteSuccess: 'La categoría se eliminó exitosamente',
      error: 'Error',
      loadError: 'No se pudieron cargar las categorías',
      saveError: 'No se pudo guardar la categoría',
      deleteError: 'No se pudo eliminar la categoría',
      uploadError: 'No se pudo subir la imagen'
    },
    en: {
      title: 'Category Management',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      name: 'Name',
      description: 'Description',
      slug: 'Slug (URL)',
      image: 'Category image',
      actions: 'Actions',
      update: 'Update',
      add: 'Add',
      uploading: 'Uploading...',
      noPhoto: 'No photo',
      categoryUpdated: 'Category updated',
      categoryUpdateSuccess: 'Category updated successfully',
      categoryAdded: 'Category added',
      categoryAddSuccess: 'Category added successfully',
      categoryDeleted: 'Category deleted',
      categoryDeleteSuccess: 'Category deleted successfully',
      error: 'Error',
      loadError: 'Could not load categories',
      saveError: 'Could not save category',
      deleteError: 'Could not delete category',
      uploadError: 'Could not upload image'
    },
    ru: {
      title: 'Управление категориями',
      addCategory: 'Добавить категорию',
      editCategory: 'Редактировать категорию',
      name: 'Название',
      description: 'Описание',
      slug: 'Слаг (URL)',
      image: 'Изображение категории',
      actions: 'Действия',
      update: 'Обновить',
      add: 'Добавить',
      uploading: 'Загрузка...',
      noPhoto: 'Нет фото',
      categoryUpdated: 'Категория обновлена',
      categoryUpdateSuccess: 'Категория успешно обновлена',
      categoryAdded: 'Категория добавлена',
      categoryAddSuccess: 'Категория успешно добавлена',
      categoryDeleted: 'Категория удалена',
      categoryDeleteSuccess: 'Категория успешно удалена',
      error: 'Ошибка',
      loadError: 'Не удалось загрузить категории',
      saveError: 'Не удалось сохранить категорию',
      deleteError: 'Не удалось удалить категорию',
      uploadError: 'Не удалось загрузить изображение'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchCategories();

    const channel = supabase
      .channel('category-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        (payload) => {
          console.log('Category change detected:', payload);
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: t.error,
        description: t.loadError,
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('madiluxe')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('madiluxe')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: t.error,
        description: t.uploadError,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image_url: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const categoryData = {
        ...formData,
        image_url: imageUrl
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: t.categoryUpdated,
          description: t.categoryUpdateSuccess,
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;

        toast({
          title: t.categoryAdded,
          description: t.categoryAddSuccess,
        });
      }

      setFormData({ name: '', description: '', slug: '', image_url: '' });
      setImageFile(null);
      setEditingCategory(null);
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: t.error,
        description: t.saveError,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      image_url: category.image_url || ''
    });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t.categoryDeleted,
        description: t.categoryDeleteSuccess,
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: t.error,
        description: t.deleteError,
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', slug: '', image_url: '' });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImageFile(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t.title}</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                {t.addCategory}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? t.editCategory : t.addCategory}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">{t.description}</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                <div>
                  <Label htmlFor="image">{t.image}</Label>
                  <div className="space-y-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formData.image_url && (
                      <div className="relative inline-block">
                        <img 
                          src={formData.image_url} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={removeImage}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      {t.uploading}
                    </>
                  ) : (
                    editingCategory ? t.update : t.add
                  )}
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
              <TableHead>{t.image}</TableHead>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.description}</TableHead>
              <TableHead>{t.slug}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.image_url ? (
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">{t.noPhoto}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(category.id)}>
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

export default CategoryManager;
