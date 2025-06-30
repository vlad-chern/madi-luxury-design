
interface ProductHeaderProps {
  categoryName?: string;
  productName: string;
  price: string;
}

const ProductHeader = ({ categoryName, productName, price }: ProductHeaderProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="text-sm text-[rgb(180,165,142)] mb-4">{categoryName}</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{productName}</h1>
        <div className="text-3xl font-bold text-[rgb(180,165,142)] mb-8">{price}</div>
      </div>
    </section>
  );
};

export default ProductHeader;
