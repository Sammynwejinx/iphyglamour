'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatNaira } from '@/lib/placeholderProducts';

const ORDER_STATUSES = ['Order Received', 'In Production', 'Ready', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmPayment(order) {
    const sure = window.confirm(
      `Have you personally checked your Access Bank account and confirmed ${formatNaira(order.total)} has actually arrived for order ${order.order_number}?`
    );
    if (!sure) return;
    setBusyId(order.id);
    await supabase
      .from('orders')
      .update({ payment_status: 'Confirmed', updated_at: new Date().toISOString() })
      .eq('id', order.id);
    await load();
    setBusyId(null);
  }

  async function updateOrderStatus(order, order_status) {
    setBusyId(order.id);
    await supabase.from('orders').update({ order_status, updated_at: new Date().toISOString() }).eq('id', order.id);
    await load();
    setBusyId(null);
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Orders</h1>

      {orders === null && <p className="text-sm text-ink/50">Loading…</p>}
      {orders && orders.length === 0 && <p className="text-sm text-ink/50">No orders yet.</p>}

      <div className="grid gap-4">
        {orders?.map((o) => {
          const paymentConfirmed = o.payment_status === 'Confirmed';
          const hasShipping = o.email || o.address || o.country;

          return (
            <div key={o.id} className="border border-sand p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="font-display text-ink">{o.order_number}</p>
                <span className="text-xs text-ink/40">
                  {o.created_at ? new Date(o.created_at).toLocaleString() : ''}
                </span>
              </div>

              {/* Customer */}
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Customer</p>
                <p className="text-ink/80">{o.customer_name || 'No name given'}</p>
                <p className="text-ink/60 text-xs">{o.phone || 'No phone given'} {o.email ? `· ${o.email}` : ''}</p>
              </div>

              {/* Shipping */}
              {hasShipping && (
                <div className="mb-3">
                  <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Shipping</p>
                  <p className="text-ink/70 text-xs">
                    {[o.address, o.city, o.state, o.country, o.postal_code].filter(Boolean).join(', ')}
                  </p>
                  {o.shipping_notes && <p className="text-ink/50 text-xs italic mt-1">Note: {o.shipping_notes}</p>}
                </div>
              )}

              {/* Items */}
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Items</p>
                <ul className="text-ink/70 text-xs space-y-0.5">
                  {(o.items || []).map((i, idx) => (
                    <li key={idx}>
                      {i.name} × {i.quantity} — {formatNaira(i.price * i.quantity)}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-ink/60 mt-2 space-y-0.5">
                  {o.subtotal != null && (
                    <p>
                      Subtotal: {formatNaira(o.subtotal)} {o.delivery_fee ? `+ Delivery: ${formatNaira(o.delivery_fee)}` : ''}
                    </p>
                  )}
                  <p className="text-ink font-display text-sm mt-1">Total: {formatNaira(o.total)}</p>
                </div>
              </div>

              {/* Measurement status */}
              <p className="text-ink/50 text-xs mb-3">Measurement status: {o.measurement_status}</p>

              {/* Payment */}
              <div className="border-t border-sand pt-3 mb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Payment</p>
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded-full ${
                        paymentConfirmed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {paymentConfirmed ? 'Confirmed' : 'Pending'}
                    </span>
                    <p className="text-xs text-ink/50 mt-1">
                      Customer says they paid:{' '}
                      {o.transfer_claimed ? (
                        <span className="text-ink/70">
                          Yes{o.transfer_claimed_at ? ` (${new Date(o.transfer_claimed_at).toLocaleString()})` : ''}
                        </span>
                      ) : (
                        'Not yet'
                      )}
                    </p>
                  </div>
                  {!paymentConfirmed ? (
                    <button
                      onClick={() => confirmPayment(o)}
                      disabled={busyId === o.id}
                      className="bg-ink text-porcelain text-xs px-4 py-2 hover:bg-magenta transition-colors disabled:opacity-50"
                    >
                      Confirm Payment
                    </button>
                  ) : (
                    <span className="text-xs text-ink/40">
                      Confirmed {o.updated_at ? `on ${new Date(o.updated_at).toLocaleDateString()}` : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Order status */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-ink/40">Order status</p>
                <select
                  value={o.order_status || 'Order Received'}
                  onChange={(e) => updateOrderStatus(o, e.target.value)}
                  disabled={busyId === o.id}
                  className="border border-sand px-2 py-1 text-xs"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}