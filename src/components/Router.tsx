
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetail from '@/pages/ProductDetail';
import AdminPanel from '@/pages/AdminPanel';
import AdminLogin from '@/pages/AdminLogin';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import NotFound from '@/pages/NotFound';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/category/:categorySlug" element={<CategoryPage />} />
      <Route path="/product/:productSlug" element={<ProductDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
