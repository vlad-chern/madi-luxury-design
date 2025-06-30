
import { Product } from '@/lib/supabase';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[rgb(180,165,142)]">Descripción</h2>
        <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
      </div>

      {product.includes && product.includes.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Incluye</h3>
          <ul className="space-y-2 text-gray-300">
            {product.includes.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      )}

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-[rgb(180,165,142)]">Especificaciones</h3>
          <ul className="space-y-2 text-gray-300">
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key}>• {key}: {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
