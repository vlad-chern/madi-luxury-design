
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CategoryNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
        <Button onClick={() => navigate('/')} className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
          Volver a inicio
        </Button>
      </div>
    </div>
  );
};

export default CategoryNotFound;
