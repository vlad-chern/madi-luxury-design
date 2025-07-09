import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { adminTranslations } from '@/utils/adminTranslations';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabNavigation from '@/components/admin/AdminTabNavigation';
import AdminTabContent from '@/components/admin/AdminTabContent';
import AdminPresence from '@/components/admin/AdminPresence';
import StorageMonitor from '@/components/admin/StorageMonitor';

const AdminPanel = () => {
  const [language, setLanguage] = useState<'es' | 'en' | 'ru'>('es');
  const { 
    isAuthenticated, 
    isLoading, 
    handleLogout, 
    canAccessAdminManagement 
  } = useAdminAuth();

  const t = adminTranslations[language];

  const tabItems = [
    { value: 'categories', label: t.categories },
    { value: 'products', label: t.products },
    { value: 'orders', label: t.orders },
    { value: 'customers', label: t.customers },
    { value: 'integrations', label: t.integrations },
    { value: 'seo', label: t.seo },
    { value: 'images', label: t.images },
    ...(canAccessAdminManagement() ? [{ value: 'administrators', label: t.administrators }] : [])
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">{t.checking}</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        language={language}
        setLanguage={setLanguage}
        onLogout={handleLogout}
        tabItems={tabItems}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Main content area */}
          <div className="flex-1 lg:flex-none lg:w-3/4">
            <Tabs defaultValue="categories" className="space-y-4 md:space-y-6">
              <AdminTabNavigation tabItems={tabItems} />
              <AdminTabContent 
                language={language} 
                canAccessAdminManagement={canAccessAdminManagement()} 
              />
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