import { supabase } from './supabaseClient';
import { placeholderProducts } from './placeholderProducts';

export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return placeholderProducts;
    return data;
  } catch (e) {
    return placeholderProducts;
  }
}

export async function getProductBySlug(slug) {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
    if (error || !data) {
      return placeholderProducts.find((p) => p.slug === slug) || null;
    }
    return data;
  } catch (e) {
    return placeholderProducts.find((p) => p.slug === slug) || null;
  }
}
