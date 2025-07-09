import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionToken = localStorage.getItem('admin_session_token');
        console.log('Checking auth with token:', sessionToken ? 'exists' : 'missing');
        
        if (sessionToken) {
          const { data } = await supabase.functions.invoke('admin-verify', {
            body: { session_token: sessionToken }
          });
          
          console.log('Auth verification response:', data);
          
          if (data?.success) {
            setIsAuthenticated(true);
            setCurrentAdmin(data.admin);
            console.log('Authentication successful, current admin:', data.admin);
          } else {
            console.log('Authentication failed, redirecting to login');
            localStorage.removeItem('admin_session_token');
            navigate('/admin/login');
          }
        } else {
          console.log('No session token, redirecting to login');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
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
    return currentAdmin?.email === 'info@madiluxe.com' || currentAdmin?.role === 'admin';
  };

  return {
    isAuthenticated,
    isLoading,
    currentAdmin,
    handleLogout,
    canAccessAdminManagement
  };
};