
interface CategoryHeaderProps {
  categoryName: string;
  categoryDescription?: string;
}

const CategoryHeader = ({ categoryName, categoryDescription }: CategoryHeaderProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 capitalize">{categoryName}</h1>
        {categoryDescription && (
          <p className="text-xl text-gray-300 max-w-3xl">{categoryDescription}</p>
        )}
      </div>
    </section>
  );
};

export default CategoryHeader;
