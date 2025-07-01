
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminSession {
  id: string;
  created_at: string;
  expires_at: string;
  admins: {
    name: string;
    email: string;
  };
}

interface AdminPresenceProps {
  language: 'es' | 'en' | 'ru';
}

const AdminPresence = ({ language }: AdminPresenceProps) => {
  const [adminSessions, setAdminSessions] = useState<AdminSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const translations = {
    es: {
      title: 'Administradores Activos',
      noActive: 'No hay administradores activos',
      loading: 'Cargando...',
      online: 'En línea',
      expires: 'Expira',
      lastUpdate: 'Última actualización'
    },
    en: {
      title: 'Active Administrators',
      noActive: 'No active administrators',
      loading: 'Loading...',
      online: 'Online',
      expires: 'Expires',
      lastUpdate: 'Last update'
    },
    ru: {
      title: 'Активные Администраторы',
      noActive: 'Нет активных администраторов',
      loading: 'Загрузка...',
      online: 'Онлайн',
      expires: 'Истекает',
      lastUpdate: 'Последнее обновление'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchAdminSessions();
    
    // Обновляем только каждые 15 минут (900000 мс) вместо 30 секунд
    const interval = setInterval(fetchAdminSessions, 900000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminSessions = async () => {
    // Не делаем новый запрос если последний был менее 5 минут назад
    if (lastUpdate && Date.now() - lastUpdate.getTime() < 300000) {
      return;
    }

    setIsLoading(true);
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (!sessionToken) {
        console.log('No session token available');
        setAdminSessions([]);
        return;
      }

      console.log('Fetching admin sessions...');
      
      // Используем edge функцию для получения сессий
      const { data, error } = await supabase.functions.invoke('admin-query', {
        body: {
          session_token: sessionToken,
          query: 'admin_sessions',
          action: 'select'
        }
      });

      if (error) {
        console.error('Error fetching admin sessions:', error);
        return;
      }

      if (data?.success) {
        // Фильтруем только активные сессии
        const now = new Date();
        const activeSessions = (data.data || []).filter((session: any) => {
          const expiresAt = new Date(session.expires_at);
          return expiresAt > now;
        });

        // Получаем информацию об админах для каждой сессии (максимум 3 запроса)
        const sessionsWithAdmins = await Promise.all(
          activeSessions.slice(0, 3).map(async (session: any) => {
            try {
              const adminResult = await supabase.functions.invoke('admin-query', {
                body: {
                  session_token: sessionToken,
                  query: 'admins',
                  action: 'select',
                  filters: { id: session.admin_id }
                }
              });

              if (adminResult.data?.success && adminResult.data.data.length > 0) {
                const admin = adminResult.data.data[0];
                return {
                  ...session,
                  admins: {
                    name: admin.name || admin.email,
                    email: admin.email
                  }
                };
              }
              return null;
            } catch (err) {
              console.error('Error fetching admin info:', err);
              return null;
            }
          })
        );

        setAdminSessions(sessionsWithAdmins.filter(Boolean));
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching admin sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const expires = new Date(expiresAt);
    const now = new Date();
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return '0 min';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'hace menos de 1 min';
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `hace ${hours}h ${minutes % 60}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4" />
          {t.title}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchAdminSessions}
            disabled={isLoading}
            className="ml-auto text-xs"
          >
            Actualizar
          </Button>
        </CardTitle>
        {lastUpdate && (
          <div className="text-xs text-gray-500">
            {t.lastUpdate}: {formatLastUpdate()}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-sm text-gray-500">{t.loading}</div>
        ) : adminSessions.length === 0 ? (
          <div className="text-center text-sm text-gray-500">{t.noActive}</div>
        ) : (
          <div className="space-y-3">
            {adminSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">{session.admins.name}</div>
                    <div className="text-xs text-gray-500">{session.admins.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs mb-1">
                    {t.online}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {t.expires}: {formatTimeRemaining(session.expires_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AdminPresence;
