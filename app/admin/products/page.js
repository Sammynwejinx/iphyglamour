'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { formatNaira } from '@/lib/placeholderProducts';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(null);

  async function load() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleAvailable(p) {
    await supabase.from('products').update({ available: !p.available }).eq('id', p.id);
    load();
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    await supabase.from('products').delete().eq('id', p.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Products</h1>
        <Link href="/admin/products/new" className="bg-ink text-porcelain px-4 py-2 text-sm hover:bg-magenta transition-colors">
          Add product
        </Link>
      </div>

      {products === null && <p className="text-sm text-ink/50">Loading…</p>}
      {products && products.length === 0 && (
        <p className="text-sm text-ink/50">
          No products in Supabase yet — the public site is showing placeholder items until you add real ones here.
        </p>
      )}

      <div className="grid gap-3">
        {products?.map((p) => (
          <div key={p.id} className="flex items-center justify-between border border-sand p-4 text-sm">
            <div>
              <p className="text-ink">{p.name}</p>
              <p className="text-ink/50 text-xs">
                {p.category} · {formatNaira(p.price)} · {p.available ? 'Available' : 'Hidden'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleAvailable(p)} className="text-ink/60 hover:text-magenta text-xs">
                {p.available ? 'Hide' : 'Show'}
              </button>
              <Link href={`/admin/products/${p.id}/edit`} className="text-ink/60 hover:text-magenta text-xs">
                Edit
              </Link>
              <button onClick={() => remove(p)} className="text-ink/60 hover:text-magenta text-xs">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}