
import { Button } from '@/components/ui/button';

interface ProductLoadingProps {}

export const ProductLoading = ({}: ProductLoadingProps) => (
  <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
    <div>Cargando producto...</div>
  </div>
);

interface ProductErrorProps {
  error: string;
  onBack: () => void;
}

export const ProductError = ({ error, onBack }: ProductErrorProps) => (
  <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Error al cargar el producto</h1>
      <p className="text-gray-400 mb-4">{error}</p>
      <Button onClick={onBack} className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
        Volver a inicio
      </Button>
    </div>
  </div>
);

interface ProductNotFoundProps {
  productSlug: string | undefined;
  onBack: () => void;
}

export const ProductNotFound = ({ productSlug, onBack }: ProductNotFoundProps) => (
  <div className="min-h-screen bg-[rgb(14,14,14)] text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
      <p className="text-gray-400 mb-4">El producto con slug "{productSlug}" no existe o no está activo.</p>
      <Button onClick={onBack} className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
        Volver a inicio
      </Button>
    </div>
  </div>
);
