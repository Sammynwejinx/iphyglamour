'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cartContext';

const items = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/cart', label: 'Cart' }
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2340000000000';

  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-porcelain border-t border-sand flex text-xs"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 relative ${
              active ? 'text-magenta' : 'text-ink/60'
            }`}
          >
            {item.label}
            {item.href === '/cart' && count > 0 && (
              <span className="absolute top-1 right-1/3 bg-magenta text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        );
      })}
      <a
        href={`https://wa.me/${number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-ink/60"
      >
        WhatsApp
      </a>
    </nav>
  );
}
