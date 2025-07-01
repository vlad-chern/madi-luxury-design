
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string | null;
  name_en: string | null;
  description_en: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_from: number | null;
  price_fixed: number | null;
  price_type: 'from' | 'fixed';
  category_id: string;
  images: string[];
  videos: string[];
  includes: string[];
  specifications: Record<string, any>;
  name_en: string | null;
  description_en: string | null;
  includes_en: string[] | null;
  specifications_en: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  product_id: string | null;
  message: string | null;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  products?: Product;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Integration functions
export interface Integration {
  id: string;
  name: string;
  config: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getIntegrations = async () => {
  const { data, error } = await supabase
    .from('integrations')
    .select('*');
  return { data, error };
};

export const updateIntegration = async (name: string, config: Record<string, any>, is_active: boolean) => {
  const { data, error } = await supabase
    .from('integrations')
    .update({ config, is_active })
    .eq('name', name)
    .select()
    .single();
  return { data, error };
};
