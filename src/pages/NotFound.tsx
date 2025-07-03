
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { goHome, goBack } = useAppNavigation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/2ff321c4-11f7-489a-860b-fadf6b38b375.png" 
            alt="MADI Logo" 
            className="h-12 w-auto mx-auto mb-6"
          />
        </div>

        <h1 className="text-6xl font-bold mb-4 text-[rgb(180,165,142)]">404</h1>
        <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Lo sentimos, la página que está buscando no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={goBack}
            variant="outline"
            className="border-[rgb(180,165,142)] text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)] hover:text-[rgb(14,14,14)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver atrás
          </Button>
          
          <Button 
            onClick={goHome}
            className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir a inicio
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            ¿Necesita ayuda? Contáctenos en{' '}
            <a 
              href="mailto:info@madiluxe.com" 
              className="text-[rgb(180,165,142)] hover:underline"
            >
              info@madiluxe.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
