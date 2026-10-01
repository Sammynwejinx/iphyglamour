'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImagePlaceholder from './ImagePlaceholder';
import { formatNaira } from '@/lib/placeholderProducts';
import { useCart } from '@/lib/cartContext';

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const image = product.image_urls?.[0] || product.image_url;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-5"
      onClick={onClose}
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}
    >
      <div
        className="bg-porcelain max-w-2xl w-full grid sm:grid-cols-2 gap-0 relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-porcelain/90 rounded-full text-ink"
        >
          ✕
        </button>
        <div className="aspect-[3/4] sm:aspect-auto sm:h-full">
          <ImagePlaceholder label={product.name} imageUrl={image} alt={product.name} />
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-wide text-magenta mb-2">{product.category}</p>
          <h3 className="font-display text-2xl text-ink mb-2">{product.name}</h3>
          <p className="text-ink/80 mb-3">{formatNaira(product.price)}</p>
          <p className="text-sm text-ink/60 mb-6">{product.description}</p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                addItem(product, 1);
                setAdded(true);
              }}
              className="bg-ink text-porcelain px-5 py-2.5 text-sm hover:bg-magenta transition-colors"
            >
              Add to cart
            </button>
            <Link
              href={`/product/${product.slug}`}
              className="border border-ink px-5 py-2.5 text-sm hover:border-magenta hover:text-magenta transition-colors"
            >
              Full details
            </Link>
          </div>
          {added && <p className="text-xs text-magenta mt-3">Added to your cart.</p>}
        </div>
      </div>
    </div>
  );
}
