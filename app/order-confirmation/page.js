'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const STATUS_COPY = {
  measurement_received: 'Measurement status: Received',
  appointment_requested: 'Measurement status: Appointment requested',
  chat_pending: 'Measurement status: Awaiting WhatsApp conversation'
};

function Confirmation() {
  const params = useSearchParams();
  const order = params.get('order') || 'IPG-0000';
  const status = params.get('status') || 'measurement_received';

  return (
    <div className="max-w-xl mx-auto px-5 py-16 text-center">
      <h1 className="font-display text-3xl text-ink mb-3">Order received</h1>
      <p className="text-ink/70 mb-1">Thank you for choosing IPHYGLAMOUR.</p>
      <p className="font-display text-2xl text-magenta my-4">#{order}</p>
      <p className="text-sm text-ink/60 mb-10">{STATUS_COPY[status] || STATUS_COPY.measurement_received}</p>

      <div className="text-left border border-sand p-6">
        <p className="font-display text-lg text-ink mb-3">What&apos;s next?</p>
        <ol className="text-sm text-ink/70 space-y-2 list-decimal list-inside">
          <li>We&apos;ll review your order and measurement details.</li>
          <li>If you booked an appointment, we&apos;ll confirm the time with you by phone or WhatsApp.</li>
          <li>Once confirmed, your piece goes into production.</li>
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
