'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatNaira } from '@/lib/placeholderProducts';

const STATUSES = [
  'New Order',
  'Awaiting Measurements',
  'Measurement Received',
  'Appointment Requested',
  'Measurements Confirmed',
  'In Production',
  'Ready',
  'Completed'
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(null);

  async function load() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(order, status) {
    await supabase.from('orders').update({ status }).eq('id', order.id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Orders</h1>

      {orders === null && <p className="text-sm text-ink/50">Loading…</p>}
      {orders && orders.length === 0 && <p className="text-sm text-ink/50">No orders yet.</p>}

      <div className="grid gap-4">
        {orders?.map((o) => (
          <div key={o.id} className="border border-sand p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <p className="font-display text-ink">{o.order_number}</p>
              <select
                value={o.status || 'New Order'}
                onChange={(e) => updateStatus(o, e.target.value)}
                className="border border-sand px-2 py-1 text-xs"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-ink/60 text-xs mb-1">
              {o.customer_name || 'No name given'} · {o.phone || 'No phone given'}
            </p>
            <p className="text-ink/60 text-xs mb-2">Measurement status: {o.measurement_status}</p>
            <ul className="text-ink/70 text-xs mb-2">
              {(o.items || []).map((i, idx) => (
                <li key={idx}>
                  {i.name} × {i.quantity} — {formatNaira(i.price * i.quantity)}
                </li>
              ))}
            </ul>
            <p className="text-ink text-sm">Total: {formatNaira(o.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
