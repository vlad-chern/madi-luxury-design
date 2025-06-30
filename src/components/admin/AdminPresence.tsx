
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

interface AdminPresenceProps {
  language?: 'es' | 'en' | 'ru';
}

const AdminPresence: React.FC<AdminPresenceProps> = ({ language = 'es' }) => {
  const [activeAdmins, setActiveAdmins] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

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
      administrator: 'Administrador'
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
      administrator: 'Administrator'
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
      administrator: 'Администратор'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const adminData = {
      id: 'admin-1',
      name: t.administrator,
      email: 'admin@madiluxe.com',
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
  }, [language]);

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t.title}
          <Badge variant="secondary">{activeAdmins.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeAdmins.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t.noActiveAdmins}</p>
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
                        ? t.nowOnline
                        : `${t.lastSeen}: ${new Date(admin.online_at).toLocaleTimeString()}`
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
