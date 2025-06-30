
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryNavigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[rgb(14,14,14)]/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)]/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          <div className="text-2xl font-bold text-[rgb(180,165,142)]">MADI</div>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavigation;
