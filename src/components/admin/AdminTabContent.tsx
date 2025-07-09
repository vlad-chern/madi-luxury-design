import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import OrdersManager from './OrdersManager';
import CustomerManager from './CustomerManager';
import ImprovedIntegrationsManager from './ImprovedIntegrationsManager';
import AdminManager from './AdminManager';
import SEOManager from './SEOManager';
import ImageOptimizer from './ImageOptimizer';

interface AdminTabContentProps {
  language: 'es' | 'en' | 'ru';
  canAccessAdminManagement: boolean;
}

const AdminTabContent: React.FC<AdminTabContentProps> = ({ 
  language, 
  canAccessAdminManagement 
}) => {
  return (
    <>
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

      <TabsContent value="seo">
        <SEOManager language={language} />
      </TabsContent>

      <TabsContent value="images">
        <ImageOptimizer language={language} />
      </TabsContent>

      {canAccessAdminManagement && (
        <TabsContent value="administrators">
          <AdminManager language={language} />
        </TabsContent>
      )}
    </>
  );
};

export default AdminTabContent;