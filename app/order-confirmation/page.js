'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { formatNaira } from '@/lib/placeholderProducts';

const STATUS_COPY = {
  measurement_received: 'Payment status: Pending',
  appointment_requested: 'Measurement status: Appointment requested',
  chat_pending: 'Measurement status: Awaiting WhatsApp conversation'
};

function Confirmation() {
  const params = useSearchParams();
  const order = params.get('order') || 'IPG-0000';
  const status = params.get('status') || 'measurement_received';
  const subtotal = params.get('subtotal');
  const fee = params.get('fee');
  const total = params.get('total');

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  async function markTransferClaimed() {
    setClaiming(true);
    try {
      await supabase.rpc('mark_transfer_claimed', { p_order_number: order });
      setClaimed(true);
    } catch (e) {
      // keep it simple — allow retry
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-16 text-center">
      <h1 className="font-display text-3xl text-ink mb-3">Order received</h1>
      <p className="text-ink/70 mb-1">Thank you for choosing IPHYGLAMOUR.</p>
      <p className="font-display text-2xl text-magenta my-4">#{order}</p>
      <p className="text-sm text-ink/60 mb-10">{STATUS_COPY[status] || STATUS_COPY.measurement_received}</p>

      {status === 'measurement_received' && total && (
        <div className="text-left border border-sand p-6 mb-6">
          <p className="font-display text-lg text-ink mb-3">Payment</p>
          <div className="text-sm mb-4">
            {subtotal && (
              <div className="flex justify-between py-1">
                <span className="text-ink/60">Subtotal</span>
                <span className="text-ink">{formatNaira(Number(subtotal))}</span>
              </div>
            )}
            {fee && (
              <div className="flex justify-between py-1">
                <span className="text-ink/60">Delivery fee</span>
                <span className="text-ink">{formatNaira(Number(fee))}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t border-sand mt-1 font-display">
              <span>Total to pay</span>
              <span>{formatNaira(Number(total))}</span>
            </div>
          </div>

          <p className="text-sm text-ink/70 mb-2">Please transfer the total above to:</p>
          <div className="bg-blush text-sm p-4 mb-4">
            <p><span className="text-ink/60">Bank:</span> Access Bank</p>
            <p><span className="text-ink/60">Account name:</span> NWOYE IFEOMA DOROTHY</p>
            <p><span className="text-ink/60">Account number:</span> 0027647791</p>
          </div>

          {!claimed ? (
            <button
              onClick={markTransferClaimed}
              disabled={claiming}
              className="w-full bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors disabled:opacity-50"
            >
              {claiming ? 'Saving…' : "I've made the transfer"}
            </button>
          ) : (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3">
              Thanks — we&apos;ll confirm your payment and update your order status shortly.
            </p>
          )}
        </div>
      )}

      <div className="text-left border border-sand p-6">
        <p className="font-display text-lg text-ink mb-3">What&apos;s next?</p>
        <ol className="text-sm text-ink/70 space-y-2 list-decimal list-inside">
          <li>We&apos;ll review your order and measurement details.</li>
          <li>If you booked an appointment, we&apos;ll confirm the time with you by phone or WhatsApp.</li>
          <li>Once payment is confirmed, your piece goes into production.</li>
        </ol>
      </div>

      <Link href="/shop" className="inline-block mt-10 text-sm text-magenta hover:text-magentadeep">
        Continue browsing →
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <Confirmation />
    </Suspense>
  );
}