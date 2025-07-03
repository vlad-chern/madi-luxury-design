
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Принудительная прокрутка наверх при изменении маршрута
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Дополнительная проверка через небольшую задержку для надежности
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
};
