
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { LogOut, Globe } from 'lucide-react';
import ProductManager from '@/components/admin/ProductManager';
import CategoryManager from '@/components/admin/CategoryManager';
import OrdersManager from '@/components/admin/OrdersManager';
import CustomerManager from '@/components/admin/CustomerManager';
import ImprovedIntegrationsManager from '@/components/admin/ImprovedIntegrationsManager';
import AdminManager from '@/components/admin/AdminManager';
import StorageMonitor from '@/components/admin/StorageMonitor';
import AdminPresence from '@/components/admin/AdminPresence';
import { supabase } from '@/integrations/supabase/client';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'es' | 'en' | 'ru'>('es');
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  const translations = {
    es: {
      title: 'Panel de Administración Madiluxe',
      logout: 'Cerrar Sesión',
      categories: 'Categorías',
      products: 'Productos',
      orders: 'Pedidos',
      customers: 'Clientes',
      integrations: 'Integraciones',
      admins: 'Usuarios',
      storage: 'Storage',
      presence: 'Presencia',
      checking: 'Verificando autorización...'
    },
    en: {
      title: 'Madiluxe Admin Panel',
      logout: 'Sign Out',
      categories: 'Categories',
      products: 'Products',
      orders: 'Orders',
      customers: 'Customers',
      integrations: 'Integrations',
      admins: 'Users',
      storage: 'Storage',
      presence: 'Presence',
      checking: 'Checking authorization...'
    },
    ru: {
      title: 'Админ-панель Madiluxe',
      logout: 'Выйти',
      categories: 'Категории',
      products: 'Товары',
      orders: 'Заказы',
      customers: 'Клиенты',
      integrations: 'Интеграции',
      admins: 'Пользователи',
      storage: 'Хранилище',
      presence: 'Присутствие',
      checking: 'Проверка авторизации...'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionToken = localStorage.getItem('admin_session_token');
        if (sessionToken) {
          const { data } = await supabase.functions.invoke('admin-verify', {
            body: { session_token: sessionToken }
          });
          
          if (data?.success) {
            setIsAuthenticated(true);
            setCurrentAdmin(data.admin);
            console.log('Current admin:', data.admin);
          } else {
            localStorage.removeItem('admin_session_token');
            navigate('/admin/login');
          }
        } else {
          navigate('/admin/login');
        }
      } catch (error) {
        localStorage.removeItem('admin_session_token');
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    const sessionToken = localStorage.getItem('admin_session_token');
    
    if (sessionToken) {
      try {
        await supabase.functions.invoke('admin-logout', {
          body: { session_token: sessionToken }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('admin_session_token');
    navigate('/admin/login');
  };

  const canAccessAdminManagement = () => {
    console.log('Checking admin access:', currentAdmin);
    return currentAdmin?.role === 'admin';
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">{t.checking}</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{t.title}</h1>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Select value={language} onValueChange={(value: 'es' | 'en' | 'ru') => setLanguage(value)}>
                <SelectTrigger className="w-24 md:w-32">
                  <Globe className="w-4 h-4 mr-1 md:mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">ES</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="ru">RU</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleLogout} variant="outline" size="sm" className="text-xs md:text-sm">
                <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{t.logout}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Main content area */}
          <div className="flex-1 lg:flex-none lg:w-3/4">
            <Tabs defaultValue="categories" className="space-y-4 md:space-y-6">
              <TabsList className={`grid w-full text-xs md:text-sm overflow-x-auto ${canAccessAdminManagement() ? 'grid-cols-6' : 'grid-cols-5'}`}>
                <TabsTrigger value="categories" className="px-2 py-1 md:px-3 md:py-1.5">{t.categories}</TabsTrigger>
                <TabsTrigger value="products" className="px-2 py-1 md:px-3 md:py-1.5">{t.products}</TabsTrigger>
                <TabsTrigger value="orders" className="px-2 py-1 md:px-3 md:py-1.5">{t.orders}</TabsTrigger>
                <TabsTrigger value="customers" className="px-2 py-1 md:px-3 md:py-1.5">{t.customers}</TabsTrigger>
                <TabsTrigger value="integrations" className="px-2 py-1 md:px-3 md:py-1.5">{t.integrations}</TabsTrigger>
                {canAccessAdminManagement() && (
                  <TabsTrigger value="users" className="px-2 py-1 md:px-3 md:py-1.5">{t.admins}</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="categories">
                <CategoryManager language={language} />
              </TabsContent>

              <TabsContent value="products">
                <ProductManager language={language} />
              </TabsContent>

              <TabsContent value="orders">
                <OrdersManager language={language} />
              </TabsContent>

              <TabsContent value="customers">
                <CustomerManager language={language} />
              </TabsContent>

              <TabsContent value="integrations">
                <ImprovedIntegrationsManager language={language} />
              </TabsContent>

              {canAccessAdminManagement() && (
                <TabsContent value="users">
                  <AdminManager language={language} />
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          {/* Sidebar with monitoring components */}
          <div className="lg:w-1/4 space-y-4 md:space-y-6">
            <AdminPresence language={language} />
            <StorageMonitor language={language} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
