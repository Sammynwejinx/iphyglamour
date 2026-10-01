'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { supabase } from '@/lib/supabaseClient';

export default function EditProductPage({ params }) {
  const [product, setProduct] = useState(undefined);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()
      .then(({ data }) => setProduct(data || null));
  }, [params.id]);

  if (product === undefined) return <p className="text-sm text-ink/50">Loading…</p>;
  if (product === null) return <p className="text-sm text-ink/50">Product not found.</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Edit product</h1>
      <ProductForm initialProduct={product} />
    </div>
  );
}
