import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminSession {
  id: string;
  admin_name: string;
  last_seen: string;
  is_online: boolean;
}

interface AdminPresenceProps {
  language: 'es' | 'en' | 'ru';
}

const AdminPresence: React.FC<AdminPresenceProps> = ({ language }) => {
  const [adminSessions, setAdminSessions] = useState<AdminSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const translations = {
    es: {
      title: 'Administradores',
      online: 'En línea',
      offline: 'Desconectado',
      noAdmins: 'No hay administradores activos',
      lastSeen: 'Visto por última vez',
      now: 'ahora',
      minutesAgo: 'min',
      hoursAgo: 'h'
    },
    en: {
      title: 'Administrators',
      online: 'Online',
      offline: 'Offline',
      noAdmins: 'No active administrators',
      lastSeen: 'Last seen',
      now: 'now',
      minutesAgo: 'min',
      hoursAgo: 'h'
    },
    ru: {
      title: 'Администраторы',
      online: 'Онлайн',
      offline: 'Офлайн',
      noAdmins: 'Нет активных администраторов',
      lastSeen: 'Последний раз',
      now: 'сейчас',
      minutesAgo: 'мин',
      hoursAgo: 'ч'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchAdminSessions();
    const interval = setInterval(fetchAdminSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminSessions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('*')
        .order('last_seen', { ascending: false });

      if (error) {
        console.error('Error fetching admin sessions:', error);
      } else {
        setAdminSessions(data || []);
      }
    } catch (error) {
      console.error('Error fetching admin sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (lastSeen: string) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t.now;
    if (diffInMinutes < 60) return `${diffInMinutes}${t.minutesAgo}`;
    return `${Math.floor(diffInMinutes / 60)}${t.hoursAgo}`;
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <Users className="w-4 h-4" />
          <span className="truncate">{t.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <div className="space-y-3">
          {adminSessions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <Users className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs md:text-sm">{t.noAdmins}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto">
              {adminSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full ${session.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs md:text-sm truncate">{session.admin_name}</p>
                      {!session.is_online && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{getTimeAgo(session.last_seen)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={session.is_online ? 'default' : 'secondary'} className="text-xs">
                    {session.is_online ? t.online : t.offline}
                  </Badge>
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
