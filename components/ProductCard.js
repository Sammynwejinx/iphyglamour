'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImagePlaceholder from './ImagePlaceholder';
import QuickViewModal from './QuickViewModal';
import { formatNaira } from '@/lib/placeholderProducts';

export default function ProductCard({ product }) {
  const [quickView, setQuickView] = useState(false);

  return (
    <div className="group">
      <div className="relative aspect-[3/4] rounded-sm overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <ImagePlaceholder label={product.name} imageUrl={product.image_urls?.[0] || product.image_url} alt={product.name} />
        </Link>
        <button
          onClick={() => setQuickView(true)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-porcelain/95 text-ink text-xs px-4 py-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          Quick view
        </button>
      </div>
      <Link href={`/product/${product.slug}`} className="block mt-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-base text-ink group-hover:text-magenta transition-colors">
            {product.name}
          </h3>
          <span className="text-sm text-ink/70 whitespace-nowrap">{formatNaira(product.price)}</span>
        </div>
        <p className="text-xs text-ink/50 mt-0.5">{product.category}</p>
      </Link>

      {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
    </div>
  );
}
