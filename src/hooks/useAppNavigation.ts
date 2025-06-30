
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = useCallback((path: string, options?: { replace?: boolean }) => {
    // Убираем лишние слеши и нормализуем путь
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    navigate(normalizedPath, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    navigateTo,
    goBack,
    goHome,
  };
};
