
import { Skeleton } from '@/components/ui/skeleton';
import CategoryNavigation from './CategoryNavigation';

const CategoryLoading = () => {
  return (
    <div className="min-h-screen bg-[rgb(14,14,14)] text-white">
      <CategoryNavigation />
      
      <div className="pt-20">
        {/* Category Header Skeleton */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <Skeleton className="h-12 w-64 mb-6 bg-gray-800" />
            <Skeleton className="h-6 w-96 bg-gray-800" />
          </div>
        </section>

        {/* Products Grid Skeleton */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[rgb(22,22,22)] border border-gray-800 rounded-lg overflow-hidden">
                  <Skeleton className="aspect-video w-full bg-gray-800" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <Skeleton className="h-4 w-2/3 bg-gray-800" />
                    </div>
                    <Skeleton className="h-8 w-24 bg-gray-800" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1 bg-gray-800" />
                      <Skeleton className="h-10 w-12 bg-gray-800" />
                    </div>
                    <Skeleton className="h-10 w-full bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryLoading;
