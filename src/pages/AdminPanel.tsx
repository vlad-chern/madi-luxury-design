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
import IntegrationsManager from '@/components/admin/IntegrationsManager';
import { supabase } from '@/integrations/supabase/client';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'es' | 'en' | 'ru'>('es');

  const translations = {
    es: {
      title: 'Panel de Administración Madiluxe',
      logout: 'Cerrar Sesión',
      categories: 'Categorías',
      products: 'Productos',
      orders: 'Pedidos',
      customers: 'Clientes',
      integrations: 'Integraciones',
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
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <div className="flex items-center space-x-4">
              <Select value={language} onValueChange={(value: 'es' | 'en' | 'ru') => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="categories">{t.categories}</TabsTrigger>
            <TabsTrigger value="products">{t.products}</TabsTrigger>
            <TabsTrigger value="orders">{t.orders}</TabsTrigger>
            <TabsTrigger value="customers">{t.customers}</TabsTrigger>
            <TabsTrigger value="integrations">{t.integrations}</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManager language={language} />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManager />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
