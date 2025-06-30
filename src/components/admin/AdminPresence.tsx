
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Circle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  online_at: string;
  status: 'online' | 'away' | 'offline';
}

const AdminPresence = () => {
  const [activeAdmins, setActiveAdmins] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Инициализируем presence для текущего пользователя
    const adminData = {
      id: 'admin-1', // В реальном приложении это будет получаться из сессии
      name: 'Администратор',
      email: 'admin@madiluxe.com',
      online_at: new Date().toISOString(),
      status: 'online' as const
    };

    setCurrentUser(adminData);

    // Создаем channel для присутствия администраторов
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
          // Отправляем информацию о присутствии текущего пользователя
          await adminPresenceChannel.track(adminData);
        }
      });

    // Обновляем статус присутствия каждые 30 секунд
    const heartbeat = setInterval(async () => {
      if (adminPresenceChannel) {
        await adminPresenceChannel.track({
          ...adminData,
          online_at: new Date().toISOString()
        });
      }
    }, 30000);

    // Cleanup при размонтировании
    return () => {
      clearInterval(heartbeat);
      supabase.removeChannel(adminPresenceChannel);
    };
  }, []);

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
      case 'online': return 'В сети';
      case 'away': return 'Отошел';
      case 'offline': return 'Не в сети';
      default: return 'Неизвестно';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isRecentlyActive = (onlineAt: string) => {
    const lastSeen = new Date(onlineAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    return diffMinutes < 5; // Считаем активным если был в сети менее 5 минут назад
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Активные администраторы
          <Badge variant="secondary">{activeAdmins.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeAdmins.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Нет активных администраторов</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAdmins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{getInitials(admin.name)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(admin.status)}`}>
                        <Circle className="w-full h-full" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={admin.status === 'online' ? 'default' : 'secondary'}>
                      {getStatusLabel(admin.status)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {isRecentlyActive(admin.online_at) 
                        ? 'Сейчас в сети' 
                        : `Был в сети: ${new Date(admin.online_at).toLocaleTimeString()}`
                      }
                    </span>
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
