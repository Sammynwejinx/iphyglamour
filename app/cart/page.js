'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cartContext';
import { formatNaira } from '@/lib/placeholderProducts';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-2xl text-ink mb-3">Your cart is empty</h1>
        <p className="text-ink/60 mb-6">Nothing here yet — find something you love.</p>
        <Link href="/shop" className="bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 md:py-14">
      <h1 className="font-display text-3xl text-ink mb-8">Your cart</h1>

      <div className="divide-y divide-sand">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 py-5">
            <div>
              <p className="font-display text-ink">{item.name}</p>
              <p className="text-sm text-ink/60">{formatNaira(item.price)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="w-14 border border-sand px-2 py-1 text-sm"
              />
              <button onClick={() => removeItem(item.id)} className="text-xs text-ink/50 hover:text-magenta">
                Remove
              </button>
            </div>
            <p className="text-sm text-ink w-24 text-right">{formatNaira(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink/20">
        <p className="font-display text-lg text-ink">Total</p>
        <p className="font-display text-lg text-ink">{formatNaira(total)}</p>
      </div>

      <Link
        href="/measurements"
        className="mt-8 block text-center bg-ink text-porcelain px-6 py-3.5 text-sm hover:bg-magenta transition-colors"
      >
        Proceed to order
      </Link>
    </div>
  );
}
