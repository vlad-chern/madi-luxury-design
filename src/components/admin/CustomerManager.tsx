
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CustomerManagerProps {
  language?: 'es' | 'en' | 'ru';
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ language = 'es' }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Gestión de Clientes',
      addCustomer: 'Agregar Cliente',
      editCustomer: 'Editar Cliente',
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      address: 'Dirección',
      notes: 'Notas',
      actions: 'Acciones',
      registrationDate: 'Fecha de Registro',
      notSpecified: 'No especificado',
      customerAdded: 'Cliente agregado',
      customerUpdated: 'Cliente actualizado',
      customerDeleted: 'Cliente eliminado',
      customerAddedSuccess: 'Cliente agregado exitosamente',
      customerUpdatedSuccess: 'Cliente actualizado exitosamente',
      customerDeletedSuccess: 'Cliente eliminado exitosamente',
      error: 'Error',
      loadError: 'No se pudieron cargar los clientes',
      saveError: 'No se pudo guardar el cliente',
      deleteError: 'No se pudo eliminar el cliente',
      add: 'Agregar',
      update: 'Actualizar',
      newCustomer: 'Nuevo cliente registrado'
    },
    en: {
      title: 'Customer Management',
      addCustomer: 'Add Customer',
      editCustomer: 'Edit Customer',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      notes: 'Notes',
      actions: 'Actions',
      registrationDate: 'Registration Date',
      notSpecified: 'Not specified',
      customerAdded: 'Customer added',
      customerUpdated: 'Customer updated',
      customerDeleted: 'Customer deleted',
      customerAddedSuccess: 'Customer added successfully',
      customerUpdatedSuccess: 'Customer updated successfully',
      customerDeletedSuccess: 'Customer deleted successfully',
      error: 'Error',
      loadError: 'Could not load customers',
      saveError: 'Could not save customer',
      deleteError: 'Could not delete customer',
      add: 'Add',
      update: 'Update',
      newCustomer: 'New customer registered'
    },
    ru: {
      title: 'Управление клиентами',
      addCustomer: 'Добавить клиента',
      editCustomer: 'Редактировать клиента',
      name: 'Имя',
      email: 'Email',
      phone: 'Телефон',
      address: 'Адрес',
      notes: 'Заметки',
      actions: 'Действия',
      registrationDate: 'Дата регистрации',
      notSpecified: 'Не указан',
      customerAdded: 'Клиент добавлен',
      customerUpdated: 'Клиент обновлен',
      customerDeleted: 'Клиент удален',
      customerAddedSuccess: 'Клиент успешно добавлен',
      customerUpdatedSuccess: 'Данные клиента успешно обновлены',
      customerDeletedSuccess: 'Клиент успешно удален',
      error: 'Ошибка',
      loadError: 'Не удалось загрузить клиентов',
      saveError: 'Не удалось сохранить данные клиента',
      deleteError: 'Не удалось удалить клиента',
      add: 'Добавить',
      update: 'Обновить',
      newCustomer: 'Зарегистрирован новый клиент'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchCustomers();

    // Real-time подписка на изменения клиентов
    const channel = supabase
      .channel('customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          console.log('Customer change detected:', payload);
          
          // Показываем уведомление о новом клиенте
          if (payload.eventType === 'INSERT') {
            toast({
              title: t.newCustomer,
              description: `${payload.new.name} - ${payload.new.email}`,
            });
          }
          
          fetchCustomers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language, t.newCustomer]);

  const fetchCustomers = async () => {
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (!sessionToken) {
        console.error('No admin session token found');
        return;
      }

      const { data, error } = await supabase.functions.invoke('admin-query', {
        body: { 
          session_token: sessionToken,
          query: 'customers',
          action: 'select'
        }
      });

      if (error) throw error;
      
      if (data?.success) {
        setCustomers(data.data || []);
      } else {
        throw new Error(data?.error || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: t.error,
        description: t.loadError,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (!sessionToken) {
        throw new Error('No admin session found');
      }

      if (editingCustomer) {
        const { data, error } = await supabase.functions.invoke('admin-query', {
          body: { 
            session_token: sessionToken,
            query: 'customers',
            action: 'update',
            data: formData,
            id: editingCustomer.id
          }
        });

        if (error) throw error;
        
        if (!data?.success) {
          throw new Error(data?.error || 'Failed to update customer');
        }

        toast({
          title: t.customerUpdated,
          description: t.customerUpdatedSuccess,
        });
      } else {
        const { data, error } = await supabase.functions.invoke('admin-query', {
          body: { 
            session_token: sessionToken,
            query: 'customers',
            action: 'insert',
            data: formData
          }
        });

        if (error) throw error;
        
        if (!data?.success) {
          throw new Error(data?.error || 'Failed to create customer');
        }

        toast({
          title: t.customerAdded,
          description: t.customerAddedSuccess,
        });
      }

      setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
      setEditingCustomer(null);
      setIsDialogOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : t.saveError,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      notes: customer.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (!sessionToken) {
        throw new Error('No admin session found');
      }

      const { data, error } = await supabase.functions.invoke('admin-query', {
        body: { 
          session_token: sessionToken,
          query: 'customers',
          action: 'delete',
          id: id
        }
      });

      if (error) throw error;
      
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to delete customer');
      }

      toast({
        title: t.customerDeleted,
        description: t.customerDeletedSuccess,
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : t.deleteError,
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
    setIsDialogOpen(true);
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
                {t.addCustomer}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? t.editCustomer : t.addCustomer}
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
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="address">{t.address}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">{t.notes}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingCustomer ? t.update : t.add}
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
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.email}</TableHead>
              <TableHead>{t.phone}</TableHead>
              <TableHead>{t.registrationDate}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone || t.notSpecified}</TableCell>
                <TableCell>
                  {new Date(customer.created_at).toLocaleDateString(
                    language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'es-ES'
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(customer)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(customer.id)}>
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

export default CustomerManager;
