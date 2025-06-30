
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Phone, Mail } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  product: string;
  message: string;
  date: string;
  status: 'new' | 'contacted' | 'completed';
}

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Загружаем заявки (пример данных)
    const sampleOrders: Order[] = [
      {
        id: '1',
        clientName: 'Анна Иванова',
        email: 'anna@example.com',
        phone: '+7 (999) 123-45-67',
        product: 'Geometría Gourmet',
        message: 'Интересует кухня для квартиры 60 кв.м',
        date: '2024-01-15',
        status: 'new'
      },
      {
        id: '2',
        clientName: 'Петр Петров',
        email: 'petr@example.com',
        phone: '+7 (999) 987-65-43',
        product: 'Orden Natural',
        message: 'Нужна гардеробная комната',
        date: '2024-01-14',
        status: 'contacted'
      }
    ];
    setOrders(sampleOrders);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">Новая</Badge>;
      case 'contacted':
        return <Badge variant="default">Связались</Badge>;
      case 'completed':
        return <Badge variant="secondary">Завершена</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const updateStatus = (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заявки клиентов</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Товар</TableHead>
              <TableHead>Контакты</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.clientName}</div>
                    <div className="text-sm text-gray-500">{order.message}</div>
                  </div>
                </TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-1" />
                      {order.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-1" />
                      {order.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {order.status === 'new' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => updateStatus(order.id, 'contacted')}
                      >
                        Связались
                      </Button>
                    )}
                    {order.status === 'contacted' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => updateStatus(order.id, 'completed')}
                      >
                        Завершить
                      </Button>
                    )}
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

export default OrdersManager;
