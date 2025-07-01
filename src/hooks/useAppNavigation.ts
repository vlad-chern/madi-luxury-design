
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = useCallback((path: string, options?: { replace?: boolean }) => {
    // Убираем лишние слеши и нормализуем путь
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    navigate(normalizedPath, options);
    
    // Принудительная прокрутка вверх после навигации
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [navigate]);

  const goBack = useCallback(() => {
    // Проверяем, есть ли история для возврата
    if (window.history.length > 1 && document.referrer) {
      navigate(-1);
    } else {
      // Если истории нет, идем на главную
      navigate('/');
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [navigate]);

  const goHome = useCallback(() => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [navigate]);

  return {
    navigateTo,
    goBack,
    goHome,
  };
};
