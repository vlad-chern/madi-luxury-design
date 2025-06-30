import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Plus, Edit2, Trash2, Shield, UserCheck, DollarSign } from 'lucide-react';

interface Admin {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'content_manager' | 'sales';
  is_active: boolean;
  created_at: string;
}

interface AdminManagerProps {
  language: 'es' | 'en' | 'ru';
}

const AdminManager = ({ language }: AdminManagerProps) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'content_manager' as 'admin' | 'content_manager' | 'sales',
    password: ''
  });
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Gestión de Administradores',
      addAdmin: 'Agregar Administrador',
      editAdmin: 'Editar Administrador',
      email: 'Email',
      name: 'Nombre',
      role: 'Rol',
      password: 'Contraseña',
      admin: 'Administrador',
      contentManager: 'Gestor de Contenido',
      sales: 'Ventas',
      active: 'Activo',
      inactive: 'Inactivo',
      save: 'Guardar',
      cancel: 'Cancelar',
      actions: 'Acciones',
      loading: 'Cargando...',
      created: 'Creado',
      adminCreated: 'Administrador creado exitosamente',
      adminUpdated: 'Administrador actualizado exitosamente',
      adminDeleted: 'Administrador eliminado exitosamente',
      error: 'Error',
      passwordHint: 'Dejar vacío para mantener la contraseña actual'
    },
    en: {
      title: 'Admin Management',
      addAdmin: 'Add Administrator',
      editAdmin: 'Edit Administrator',
      email: 'Email',
      name: 'Name',
      role: 'Role',
      password: 'Password',
      admin: 'Administrator',
      contentManager: 'Content Manager',
      sales: 'Sales',
      active: 'Active',
      inactive: 'Inactive',
      save: 'Save',
      cancel: 'Cancel',
      actions: 'Actions',
      loading: 'Loading...',
      created: 'Created',
      adminCreated: 'Administrator created successfully',
      adminUpdated: 'Administrator updated successfully',
      adminDeleted: 'Administrator deleted successfully',
      error: 'Error',
      passwordHint: 'Leave empty to keep current password'
    },
    ru: {
      title: 'Управление Администраторами',
      addAdmin: 'Добавить Администратора',
      editAdmin: 'Редактировать Администратора',
      email: 'Email',
      name: 'Имя',
      role: 'Роль',
      password: 'Пароль',
      admin: 'Администратор',
      contentManager: 'Контент-менеджер',
      sales: 'Продажи',
      active: 'Активен',
      inactive: 'Неактивен',
      save: 'Сохранить',
      cancel: 'Отмена',
      actions: 'Действия',
      loading: 'Загрузка...',
      created: 'Создан',
      adminCreated: 'Администратор успешно создан',
      adminUpdated: 'Администратор успешно обновлен',
      adminDeleted: 'Администратор успешно удален',
      error: 'Ошибка',
      passwordHint: 'Оставьте пустым для сохранения текущего пароля'
    }
  };

  const t = translations[language];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'content_manager':
        return <UserCheck className="w-4 h-4" />;
      case 'sales':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'content_manager':
        return 'bg-blue-100 text-blue-800';
      case 'sales':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      const { data, error } = await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'admins',
          action: 'select'
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to load admins');
      }

      setAdmins(data.data || []);
    } catch (error) {
      console.error('Error loading admins:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      
      if (editingAdmin) {
        // Update existing admin
        const updateData: any = {
          email: formData.email,
          name: formData.name,
          role: formData.role
        };
        
        if (formData.password) {
          updateData.password_hash = formData.password; // In production, hash this
        }

        const { data, error } = await supabase.functions.invoke('admin-query', {
          body: {
            session_token: sessionToken,
            query: 'admins',
            action: 'update',
            id: editingAdmin.id,
            data: updateData
          }
        });

        if (error || !data?.success) {
          throw new Error(data?.error || 'Failed to update admin');
        }

        toast({
          title: t.adminUpdated,
        });
      } else {
        // Create new admin
        const { data, error } = await supabase.functions.invoke('admin-query', {
          body: {
            session_token: sessionToken,
            query: 'admins',
            action: 'insert',
            data: {
              email: formData.email,
              name: formData.name,
              role: formData.role,
              password_hash: formData.password, // In production, hash this
              is_active: true
            }
          }
        });

        if (error || !data?.success) {
          throw new Error(data?.error || 'Failed to create admin');
        }

        toast({
          title: t.adminCreated,
        });
      }

      setIsDialogOpen(false);
      setEditingAdmin(null);
      setFormData({ email: '', name: '', role: 'content_manager', password: '' });
      loadAdmins();
    } catch (error) {
      console.error('Error saving admin:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      email: admin.email,
      name: admin.name || '',
      role: admin.role,
      password: ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this administrator?')) {
      return;
    }

    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      const { data, error } = await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'admins',
          action: 'delete',
          id: adminId
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to delete admin');
      }

      toast({
        title: t.adminDeleted,
      });
      loadAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t.title}
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingAdmin(null);
              setFormData({ email: '', name: '', role: 'content_manager', password: '' });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {t.addAdmin}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAdmin ? t.editAdmin : t.addAdmin}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">{t.name}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">{t.role}</Label>
                <Select value={formData.role} onValueChange={(value: 'admin' | 'content_manager' | 'sales') => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t.admin}</SelectItem>
                    <SelectItem value="content_manager">{t.contentManager}</SelectItem>
                    <SelectItem value="sales">{t.sales}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingAdmin ? t.passwordHint : ''}
                  required={!editingAdmin}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {t.save}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">{t.loading}</div>
        ) : (
          <div className="space-y-4">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(admin.role)}
                    <div>
                      <div className="font-medium">{admin.name || admin.email}</div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                  </div>
                  <Badge className={getRoleColor(admin.role)}>
                    {admin.role === 'admin' && t.admin}
                    {admin.role === 'content_manager' && t.contentManager}
                    {admin.role === 'sales' && t.sales}
                  </Badge>
                  <Badge variant={admin.is_active ? 'default' : 'secondary'}>
                    {admin.is_active ? t.active : t.inactive}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(admin)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(admin.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminManager;
