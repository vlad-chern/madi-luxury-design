
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ContactForm from '@/components/ContactForm';

interface ProductNavigationProps {
  onBack: () => void;
  productId: string;
  productName: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const ProductNavigation = ({ onBack, productId, productName, isDialogOpen, setIsDialogOpen }: ProductNavigationProps) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[rgb(14,14,14)]/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-[rgb(180,165,142)] hover:bg-[rgb(180,165,142)]/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          <div className="text-2xl font-bold text-[rgb(180,165,142)]">MADI</div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[rgb(180,165,142)] text-[rgb(14,14,14)] hover:bg-[rgb(160,145,122)]">
              Solicitar Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Consulta sobre {productName}</DialogTitle>
            </DialogHeader>
            <ContactForm 
              productId={productId}
              productName={productName}
              language="es"
              source="product_detail"
            />
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

export default ProductNavigation;
