
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  product_id: string | null;
  message: string | null;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  products?: {
    id: string;
    name: string;
  };
}

interface OrdersManagerProps {
  language?: 'es' | 'en' | 'ru';
}

const OrdersManager: React.FC<OrdersManagerProps> = ({ language = 'es' }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const translations = {
    es: {
      title: 'Gestión de Pedidos',
      date: 'Fecha',
      client: 'Cliente',
      email: 'Email',
      phone: 'Teléfono',
      product: 'Producto',
      status: 'Estado',
      actions: 'Acciones',
      notSpecified: 'No especificado',
      generalConsultation: 'Consulta general',
      statusNew: 'Nuevo',
      statusProcessing: 'En proceso',
      statusCompleted: 'Completado',
      statusCancelled: 'Cancelado',
      statusUpdated: 'Estado actualizado',
      statusUpdateSuccess: 'El estado del pedido se actualizó correctamente',
      error: 'Error',
      loadError: 'No se pudieron cargar los pedidos',
      updateError: 'No se pudo actualizar el estado del pedido',
      newOrder: 'Nuevo pedido recibido'
    },
    en: {
      title: 'Order Management',
      date: 'Date',
      client: 'Client',
      email: 'Email',
      phone: 'Phone',
      product: 'Product',
      status: 'Status',
      actions: 'Actions',
      notSpecified: 'Not specified',
      generalConsultation: 'General consultation',
      statusNew: 'New',
      statusProcessing: 'Processing',
      statusCompleted: 'Completed',
      statusCancelled: 'Cancelled',
      statusUpdated: 'Status updated',
      statusUpdateSuccess: 'Order status updated successfully',
      error: 'Error',
      loadError: 'Could not load orders',
      updateError: 'Could not update order status',
      newOrder: 'New order received'
    },
    ru: {
      title: 'Управление заказами',
      date: 'Дата',
      client: 'Клиент',
      email: 'Email',
      phone: 'Телефон',
      product: 'Товар',
      status: 'Статус',
      actions: 'Действия',
      notSpecified: 'Не указано',
      generalConsultation: 'Общая консультация',
      statusNew: 'Новый',
      statusProcessing: 'В обработке',
      statusCompleted: 'Завершен',
      statusCancelled: 'Отменен',
      statusUpdated: 'Статус обновлен',
      statusUpdateSuccess: 'Статус заказа успешно обновлен',
      error: 'Ошибка',
      loadError: 'Не удалось загрузить заказы',
      updateError: 'Не удалось обновить статус заказа',
      newOrder: 'Получен новый заказ'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchOrders();

    // Real-time подписка на изменения заказов
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected:', payload);
          
          // Показываем уведомление о новом заказе
          if (payload.eventType === 'INSERT') {
            toast({
              title: t.newOrder,
              description: `${payload.new.customer_name} - ${payload.new.customer_email}`,
            });
          }
          
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language, t.newOrder]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure status is properly typed
      const typedOrders = (data || []).map(order => ({
        ...order,
        status: order.status as 'new' | 'processing' | 'completed' | 'cancelled'
      }));
      
      setOrders(typedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: t.error,
        description: t.loadError,
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: t.statusUpdated,
        description: t.statusUpdateSuccess,
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: t.error,
        description: t.updateError,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: t.statusNew, variant: 'default' as const },
      processing: { label: t.statusProcessing, variant: 'secondary' as const },
      completed: { label: t.statusCompleted, variant: 'default' as const },
      cancelled: { label: t.statusCancelled, variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.date}</TableHead>
              <TableHead>{t.client}</TableHead>
              <TableHead>{t.email}</TableHead>
              <TableHead>{t.phone}</TableHead>
              <TableHead>{t.product}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString(
                    language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'es-ES'
                  )}
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.customer_email}</TableCell>
                <TableCell>{order.customer_phone || t.notSpecified}</TableCell>
                <TableCell>{order.products?.name || t.generalConsultation}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">{t.statusNew}</SelectItem>
                      <SelectItem value="processing">{t.statusProcessing}</SelectItem>
                      <SelectItem value="completed">{t.statusCompleted}</SelectItem>
                      <SelectItem value="cancelled">{t.statusCancelled}</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersManager;
