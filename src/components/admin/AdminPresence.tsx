
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, Circle, Plus, Edit2, Trash2, Shield, UserCheck, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'content_manager' | 'sales';
  is_active: boolean;
  online_at: string;
  status: 'online' | 'away' | 'offline';
}

interface AdminPresenceProps {
  language: 'es' | 'en' | 'ru';
}

const AdminPresence: React.FC<AdminPresenceProps> = ({ language }) => {
  const [activeAdmins, setActiveAdmins] = useState<AdminUser[]>([]);
  const [allAdmins, setAllAdmins] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'content_manager' as 'admin' | 'content_manager' | 'sales',
    password: ''
  });
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Administradores Activos',
      noActiveAdmins: 'No hay administradores activos',
      online: 'En línea',
      away: 'Ausente',
      offline: 'Desconectado',
      unknown: 'Desconocido',
      nowOnline: 'En línea ahora',
      lastSeen: 'Visto por última vez',
      administrator: 'Administrador',
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
      adminCreated: 'Administrador creado exitosamente',
      adminUpdated: 'Administrador actualizado exitosamente',
      adminDeleted: 'Administrador eliminado exitosamente',
      error: 'Error',
      passwordHint: 'Dejar vacío para mantener la contraseña actual',
      manageAdmins: 'Gestionar Administradores'
    },
    en: {
      title: 'Active Administrators',
      noActiveAdmins: 'No active administrators',
      online: 'Online',
      away: 'Away',
      offline: 'Offline',
      unknown: 'Unknown',
      nowOnline: 'Online now',
      lastSeen: 'Last seen',
      administrator: 'Administrator',
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
      adminCreated: 'Administrator created successfully',
      adminUpdated: 'Administrator updated successfully',
      adminDeleted: 'Administrator deleted successfully',
      error: 'Error',
      passwordHint: 'Leave empty to keep current password',
      manageAdmins: 'Manage Administrators'
    },
    ru: {
      title: 'Активные администраторы',
      noActiveAdmins: 'Нет активных администраторов',
      online: 'В сети',
      away: 'Отошел',
      offline: 'Не в сети',
      unknown: 'Неизвестно',
      nowOnline: 'Сейчас в сети',
      lastSeen: 'Был в сети',
      administrator: 'Администратор',
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
      adminCreated: 'Администратор успешно создан',
      adminUpdated: 'Администратор успешно обновлен',
      adminDeleted: 'Администратор успешно удален',
      error: 'Ошибка',
      passwordHint: 'Оставьте пустым для сохранения текущего пароля',
      manageAdmins: 'Управление Администраторами'
    }
  };

  const t = translations[language];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      case 'content_manager':
        return <UserCheck className="w-3 h-3" />;
      case 'sales':
        return <DollarSign className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return t.admin;
      case 'content_manager':
        return t.contentManager;
      case 'sales':
        return t.sales;
      default:
        return role;
    }
  };

  useEffect(() => {
    loadAllAdmins();
    setupPresence();
  }, [language]);

  const loadAllAdmins = async () => {
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

      const admins = (data.data || []).map((admin: any) => ({
        ...admin,
        status: 'offline' as const,
        online_at: new Date().toISOString()
      }));

      setAllAdmins(admins);
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const setupPresence = () => {
    const adminData = {
      id: 'admin-1',
      name: t.administrator,
      email: 'admin@madiluxe.com',
      role: 'admin' as const,
      is_active: true,
      online_at: new Date().toISOString(),
      status: 'online' as const
    };

    setCurrentUser(adminData);

    const adminPresenceChannel = supabase
      .channel('admin_presence')
      .on('presence', { event: 'sync' }, () => {
        const newState = adminPresenceChannel.presenceState();
        console.log('Admin presence sync:', newState);
        
        const admins: AdminUser[] = [];
        Object.keys(newState).forEach(key => {
          const presences = newState[key] as any[];
          presences.forEach(presence => {
            admins.push(presence);
          });
        });
        
        setActiveAdmins(admins);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Admin joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Admin left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await adminPresenceChannel.track(adminData);
        }
      });

    const heartbeat = setInterval(async () => {
      if (adminPresenceChannel) {
        await adminPresenceChannel.track({
          ...adminData,
          online_at: new Date().toISOString()
        });
      }
    }, 30000);

    return () => {
      clearInterval(heartbeat);
      supabase.removeChannel(adminPresenceChannel);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      
      if (editingAdmin) {
        const updateData: any = {
          email: formData.email,
          name: formData.name,
          role: formData.role
        };
        
        if (formData.password) {
          updateData.password_hash = formData.password;
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
        const { data, error } = await supabase.functions.invoke('admin-query', {
          body: {
            session_token: sessionToken,
            query: 'admins',
            action: 'insert',
            data: {
              email: formData.email,
              name: formData.name,
              role: formData.role,
              password_hash: formData.password,
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
      loadAllAdmins();
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

  const handleEdit = (admin: AdminUser) => {
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
      loadAllAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return t.online;
      case 'away': return t.away;
      case 'offline': return t.offline;
      default: return t.unknown;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isRecentlyActive = (onlineAt: string) => {
    const lastSeen = new Date(onlineAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    return diffMinutes < 5;
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="truncate">{t.title}</span>
            <Badge variant="secondary">{allAdmins.length}</Badge>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => {
                setEditingAdmin(null);
                setFormData({ email: '', name: '', role: 'content_manager', password: '' });
              }}>
                <Plus className="w-3 h-3" />
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
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {allAdmins.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">{t.noActiveAdmins}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allAdmins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{getInitials(admin.name || admin.email)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(admin.status)}`}>
                        <Circle className="w-full h-full" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-xs truncate">{admin.name || admin.email}</p>
                        <Badge className={`${getRoleColor(admin.role)} text-xs`}>
                          {getRoleIcon(admin.role)}
                          <span className="ml-1">{getRoleLabel(admin.role)}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(admin)}>
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(admin.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPresence;
