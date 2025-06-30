
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase, Order } from '@/lib/supabase';

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

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
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
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
        title: "Статус обновлен",
        description: "Статус заявки успешно обновлен",
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заявки",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'Новая', variant: 'default' as const },
      processing: { label: 'В обработке', variant: 'secondary' as const },
      completed: { label: 'Завершена', variant: 'default' as const },
      cancelled: { label: 'Отменена', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление заявками</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Товар</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.customer_email}</TableCell>
                <TableCell>{order.customer_phone || 'Не указан'}</TableCell>
                <TableCell>{order.products?.name || 'Общая консультация'}</TableCell>
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
                      <SelectItem value="new">Новая</SelectItem>
                      <SelectItem value="processing">В обработке</SelectItem>
                      <SelectItem value="completed">Завершена</SelectItem>
                      <SelectItem value="cancelled">Отменена</SelectItem>
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
