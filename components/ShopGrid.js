'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

export default function ShopGrid({ products }) {
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  const [active, setActive] = useState('All');
  const shown = active === 'All' ? products : products.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              active === c ? 'bg-ink text-porcelain border-ink' : 'border-sand text-ink/70 hover:border-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-ink/60 text-sm">No pieces in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
