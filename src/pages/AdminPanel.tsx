import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { LogOut, Globe, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'es' | 'en' | 'ru'>('es');
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const translations = {
    es: {
      title: 'Panel de Administración Madiluxe',
      logout: 'Cerrar Sesión',
      categories: 'Categorías',
      products: 'Productos',
      orders: 'Pedidos',
      customers: 'Clientes',
      integrations: 'Integraciones',
      admins: 'Administradores',
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
      admins: 'Administrators',
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
      admins: 'Администраторы',
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
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="mr-2"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                {isMobile ? 'Admin' : t.title}
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Select value={language} onValueChange={(value: 'es' | 'en' | 'ru') => setLanguage(value)}>
                <SelectTrigger className="w-20 sm:w-32">
                  <Globe className="w-4 h-4 mr-1 sm:mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">ES</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="ru">RU</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleLogout} variant="outline" size={isMobile ? "sm" : "default"}>
                <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
                {!isMobile && t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {isMobile ? (
          <div className="space-y-4">
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="categories" className="text-xs p-2">{t.categories}</TabsTrigger>
                <TabsTrigger value="products" className="text-xs p-2">{t.products}</TabsTrigger>
                <TabsTrigger value="orders" className="text-xs p-2">{t.orders}</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-3 h-auto mt-2">
                <TabsTrigger value="customers" className="text-xs p-2">{t.customers}</TabsTrigger>
                <TabsTrigger value="integrations" className="text-xs p-2">{t.integrations}</TabsTrigger>
                {canAccessAdminManagement() && (
                  <TabsTrigger value="admins" className="text-xs p-2">{t.admins}</TabsTrigger>
                )}
              </TabsList>

              <div className="mt-4">
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
                  <TabsContent value="admins">
                    <AdminManager language={language} />
                  </TabsContent>
                )}
              </div>
            </Tabs>

            <div className="space-y-4">
              <AdminPresence language={language} />
              <StorageMonitor language={language} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Tabs defaultValue="categories" className="space-y-6">
                <TabsList className={`grid w-full ${canAccessAdminManagement() ? 'grid-cols-6' : 'grid-cols-5'}`}>
                  <TabsTrigger value="categories">{t.categories}</TabsTrigger>
                  <TabsTrigger value="products">{t.products}</TabsTrigger>
                  <TabsTrigger value="orders">{t.orders}</TabsTrigger>
                  <TabsTrigger value="customers">{t.customers}</TabsTrigger>
                  <TabsTrigger value="integrations">{t.integrations}</TabsTrigger>
                  {canAccessAdminManagement() && (
                    <TabsTrigger value="admins">{t.admins}</TabsTrigger>
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
                  <TabsContent value="admins">
                    <AdminManager language={language} />
                  </TabsContent>
                )}
              </Tabs>
            </div>
            
            <div className="space-y-6">
              <AdminPresence language={language} />
              <StorageMonitor language={language} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
