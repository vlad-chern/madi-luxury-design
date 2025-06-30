
import { Category } from '@/lib/supabase';

export const getCategorySEOData = (categoryData: Category | null) => {
  if (!categoryData) return {};
  
  return {
    title: `${categoryData.name} de Lujo a Medida | MADI - Mobiliario Exclusivo Madrid`,
    description: `Descubre nuestra colección de ${categoryData.name.toLowerCase()} de lujo personalizados. ${categoryData.description || ''} Diseño exclusivo y calidad artesanal premium en Madrid.`,
    keywords: `${categoryData.name} de lujo, ${categoryData.name} a medida Madrid, ${categoryData.name} personalizados, mobiliario exclusivo, MADI luxury design`,
    url: `https://madiluxe.com/category/${categoryData.slug}`,
    type: 'website' as const
  };
};
