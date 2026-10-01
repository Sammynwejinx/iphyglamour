'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminOverview() {
  const [counts, setCounts] = useState({ products: null, newOrders: null, appointments: null });

  useEffect(() => {
    async function load() {
      const [{ count: products }, { count: newOrders }, { count: appointments }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'requested')
      ]);
      setCounts({ products: products ?? 0, newOrders: newOrders ?? 0, appointments: appointments ?? 0 });
    }
    load();
  }, []);

  const cards = [
    { label: 'Products', value: counts.products, href: '/admin/products' },
    { label: 'New orders', value: counts.newOrders, href: '/admin/orders' },
    { label: 'Pending appointments', value: counts.appointments, href: '/admin/appointments' }
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Overview</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="border border-sand p-5 hover:border-magenta transition-colors">
            <p className="text-3xl font-display text-ink">{c.value === null ? '—' : c.value}</p>
            <p className="text-sm text-ink/60 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
