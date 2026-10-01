'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { useRouter } from 'next/navigation';

export default function AddToCartForm({ product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <label htmlFor="qty" className="text-sm text-ink/70">
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          className="w-16 border border-sand px-2 py-1 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleAdd}
          className="bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors"
        >
          Add to cart
        </button>
        <button
          onClick={() => {
            handleAdd();
            router.push('/cart');
          }}
          className="border border-ink px-6 py-3 text-sm hover:border-magenta hover:text-magenta transition-colors"
        >
          Order now
        </button>
      </div>
      {added && <p className="text-xs text-magenta mt-3">Added to your cart.</p>}
    </div>
  );
}
