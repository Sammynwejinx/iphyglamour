'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import { formatNaira } from '@/lib/placeholderProducts';
import { createOrder, saveMeasurements, saveAppointment } from '@/lib/orders';
import { sectionsForItem } from '@/lib/measurementFields';

const DELIVERY_FEE = 15000;

export default function MeasurementsPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [path, setPath] = useState(null); // 'measurements' | 'appointment' | 'whatsapp'
  const [measurementStep, setMeasurementStep] = useState('form'); // 'form' | 'details'
  const [apptType, setApptType] = useState(null); // 'home' | 'shop'
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const [itemValues, setItemValues] = useState({}); // { [productId]: { [measurementKey]: value } }
  const [notes, setNotes] = useState('');
  const [appointment, setAppointment] = useState({ address: '', preferred_date: '', preferred_time: '', notes: '' });
  const [shipping, setShipping] = useState({
    email: '',
    country: '',
    state: '',
    city: '',
    address: '',
    postalCode: '',
    notes: ''
  });

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-2xl text-ink mb-3">No order to complete yet</h1>
        <p className="text-ink/60 mb-6">Add something to your cart first.</p>
        <a href="/shop" className="bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors">
          Browse the shop
        </a>
      </div>
    );
  }

  function continueToDetails(e) {
    e.preventDefault();
    setMeasurementStep('details');
  }

  async function finishWithMeasurements(e) {
    e.preventDefault();
    setSubmitting(true);
    setOrderError(null);
    const subtotal = total;
    const grandTotal = subtotal + DELIVERY_FEE;
    try {
      const orderNumber = await createOrder({
        items,
        total: grandTotal,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        customerName,
        phone,
        measurementStatus: 'measurement_received',
        email: shipping.email,
        country: shipping.country,
        state: shipping.state,
        city: shipping.city,
        address: shipping.address,
        postalCode: shipping.postalCode,
        shippingNotes: shipping.notes
      });
      await saveMeasurements(orderNumber, {
        notes,
        items: items.map((i) => ({
          product_id: i.id,
          name: i.name,
          type: sectionsForItem(i).typeId,
          quantity: i.quantity,
          values: itemValues[i.id] || {}
        }))
      });
      fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName,
          email: shipping.email,
          items,
          subtotal,
          deliveryFee: DELIVERY_FEE,
          total: grandTotal
        })
      }).catch(() => {});
      clearCart();
      router.push(
        `/order-confirmation?order=${orderNumber}&status=measurement_received&subtotal=${subtotal}&fee=${DELIVERY_FEE}&total=${grandTotal}`
      );
    } catch (err) {
      setSubmitting(false);
      setOrderError('Something went wrong saving your order. Please check your connection and try again.');
    }
  }

  async function finishWithAppointment(e) {
    e.preventDefault();
    setSubmitting(true);
    setOrderError(null);
    try {
      const orderNumber = await createOrder({ items, total, customerName, phone, measurementStatus: 'appointment_requested' });
      await saveAppointment(orderNumber, { type: apptType, customer_name: customerName, phone, ...appointment });
      clearCart();
      router.push(`/order-confirmation?order=${orderNumber}&status=appointment_requested`);
    } catch (err) {
      setSubmitting(false);
      setOrderError('Something went wrong saving your request. Please try again.');
    }
  }

  async function finishWithWhatsApp() {
    setSubmitting(true);
    setOrderError(null);
    try {
      const orderNumber = await createOrder({ items, total, customerName, phone, measurementStatus: 'chat_pending' });
      const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2340000000000';
      const lines = [
        `Hello IPHYGLAMOUR, I just placed an order.`,
        `Order #: ${orderNumber}`,
        ...items.map((i) => `${i.name} x${i.quantity} — ${formatNaira(i.price * i.quantity)}`),
        `Total: ${formatNaira(total)}`,
        `I would like to discuss my measurements.`
      ];
      const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
      clearCart();
      window.open(url, '_blank');
      router.push(`/order-confirmation?order=${orderNumber}&status=chat_pending`);
    } catch (err) {
      setSubmitting(false);
      setOrderError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 md:py-14">
      <h1 className="font-display text-3xl text-ink mb-2">How would you like to provide your measurements?</h1>
      <p className="text-ink/60 text-sm mb-8">Order total: {formatNaira(total)}</p>

      {orderError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{orderError}</div>
      )}

      {!path && (
        <div className="grid gap-4">
          <button
            onClick={() => setPath('measurements')}
            className="text-left border border-sand p-5 hover:border-magenta transition-colors"
          >
            <p className="font-display text-lg text-ink">Enter my measurements</p>
            <p className="text-sm text-ink/60 mt-1">I already know my measurements.</p>
          </button>
          <button
            onClick={() => setPath('appointment')}
            className="text-left border border-sand p-5 hover:border-magenta transition-colors"
          >
            <p className="font-display text-lg text-ink">I need help with my measurements</p>
            <p className="text-sm text-ink/60 mt-1">Book a measurement appointment with IPHYGLAMOUR.</p>
          </button>
          <button
            onClick={() => setPath('whatsapp')}
            className="text-left border border-sand p-5 hover:border-magenta transition-colors"
          >
            <p className="font-display text-lg text-ink">I&apos;d rather talk to IPHYGLAMOUR</p>
            <p className="text-sm text-ink/60 mt-1">Chat with us directly on WhatsApp.</p>
          </button>
        </div>
      )}

      {path === 'measurements' && measurementStep === 'form' && (
        <form onSubmit={continueToDetails} className="mt-2">
          <button type="button" onClick={() => setPath(null)} className="text-xs text-ink/50 mb-6 hover:text-magenta">
            ← Back
          </button>
          <div className="grid gap-4 mb-6">
            <input
              required
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border border-sand px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-sand px-3 py-2 text-sm"
            />
          </div>
          <p className="text-xs text-ink/50 mb-4">All measurements are in inches.</p>
          {items.map((item) => {
            const { typeName, sections } = sectionsForItem(item);
            return (
              <div key={item.id} className="border border-sand p-4 mb-6">
                <p className="font-display text-lg text-ink">{item.name}</p>
                <p className="text-xs text-ink/50 mb-4">
                  {typeName} measurements{item.quantity > 1 ? ` · used for all ${item.quantity} pieces` : ''}
                </p>
                {sections.map((section) => (
                  <div key={section.title} className="mb-4">
                    <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">{section.title}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {section.fields.map((f) => (
                        <div key={f.key}>
                          <label className="text-xs text-ink/60 block mb-1">{f.label}</label>
                          <input
                            type="number"
                            step="0.1"
                            value={itemValues[item.id]?.[f.key] ?? ''}
                            onChange={(e) =>
                              setItemValues((v) => ({
                                ...v,
                                [item.id]: { ...(v[item.id] || {}), [f.key]: e.target.value }
                              }))
                            }
                            className="border border-sand px-3 py-2 text-sm w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          <textarea
            placeholder="Anything else we should know? (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border border-sand px-3 py-2 text-sm w-full mb-6"
            rows={3}
          />
          <button className="bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors">
            Continue
          </button>
        </form>
      )}

      {path === 'measurements' && measurementStep === 'details' && (
        <form onSubmit={finishWithMeasurements} className="mt-2">
          <button
            type="button"
            onClick={() => setMeasurementStep('form')}
            className="text-xs text-ink/50 mb-6 hover:text-magenta"
          >
            ← Back to measurements
          </button>
          <h2 className="font-display text-xl text-ink mb-1">Your details</h2>
          <p className="text-ink/60 text-sm mb-6">So we know where to send your order.</p>
          <div className="grid gap-4 mb-6">
            <input
              required
              type="email"
              placeholder="Email address"
              value={shipping.email}
              onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
              className="border border-sand px-3 py-2 text-sm"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Country"
                value={shipping.country}
                onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))}
                className="border border-sand px-3 py-2 text-sm"
              />
              <input
                required
                placeholder="State / Province"
                value={shipping.state}
                onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                className="border border-sand px-3 py-2 text-sm"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="City"
                value={shipping.city}
                onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                className="border border-sand px-3 py-2 text-sm"
              />
              <input
                placeholder="Postal / ZIP code"
                value={shipping.postalCode}
                onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                className="border border-sand px-3 py-2 text-sm"
              />
            </div>
            <textarea
              required
              placeholder="Full delivery address"
              value={shipping.address}
              onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
              className="border border-sand px-3 py-2 text-sm"
              rows={2}
            />
            <textarea
              placeholder="Delivery notes (optional)"
              value={shipping.notes}
              onChange={(e) => setShipping((s) => ({ ...s, notes: e.target.value }))}
              className="border border-sand px-3 py-2 text-sm"
              rows={2}
            />
          </div>

          <div className="border border-sand p-4 mb-6 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-ink/60">Subtotal</span>
              <span className="text-ink">{formatNaira(total)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink/60">Delivery fee</span>
              <span className="text-ink">{formatNaira(DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-sand mt-1 font-display">
              <span>Total</span>
              <span>{formatNaira(total + DELIVERY_FEE)}</span>
            </div>
          </div>

          <p className="text-xs text-ink/50 mb-4">
            Payment is by bank transfer — you&apos;ll see the account details on the next page.
          </p>
          <button
            disabled={submitting}
            className="bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit order'}
          </button>
        </form>
      )}

      {path === 'appointment' && !apptType && (
        <div>
          <button type="button" onClick={() => setPath(null)} className="text-xs text-ink/50 mb-6 hover:text-magenta">
            ← Back
          </button>
          <p className="text-ink/70 mb-6">
            Don&apos;t have your measurements? No problem — book a measurement appointment with IPHYGLAMOUR.
          </p>
          <div className="grid gap-4">
            <button
              onClick={() => setApptType('home')}
              className="text-left border border-sand p-5 hover:border-magenta transition-colors"
            >
              Have IPHYGLAMOUR come to me
            </button>
            <button
              onClick={() => setApptType('shop')}
              className="text-left border border-sand p-5 hover:border-magenta transition-colors"
            >
              I&apos;ll visit the IPHYGLAMOUR shop
            </button>
          </div>
        </div>
      )}

      {path === 'appointment' && apptType && (
        <form onSubmit={finishWithAppointment} className="mt-2">
          <button type="button" onClick={() => setApptType(null)} className="text-xs text-ink/50 mb-6 hover:text-magenta">
            ← Back
          </button>
          <div className="grid gap-4 mb-6">
            <input
              required
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border border-sand px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-sand px-3 py-2 text-sm"
            />
            {apptType === 'home' && (
              <input
                required
                placeholder="Address / location"
                value={appointment.address}
                onChange={(e) => setAppointment((a) => ({ ...a, address: e.target.value }))}
                className="border border-sand px-3 py-2 text-sm"
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="date"
                value={appointment.preferred_date}
                onChange={(e) => setAppointment((a) => ({ ...a, preferred_date: e.target.value }))}
                className="border border-sand px-3 py-2 text-sm"
              />
              <input
                required
                type="time"
                value={appointment.preferred_time}
                onChange={(e) => setAppointment((a) => ({ ...a, preferred_time: e.target.value }))}
                className="border border-sand px-3 py-2 text-sm"
              />
            </div>
            <textarea
              placeholder="Additional notes (optional)"
              value={appointment.notes}
              onChange={(e) => setAppointment((a) => ({ ...a, notes: e.target.value }))}
              className="border border-sand px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <p className="text-xs text-ink/50 mb-4">
            This is a request — IPHYGLAMOUR will confirm your appointment time by phone or WhatsApp.
          </p>
          <button
            disabled={submitting}
            className="bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Request appointment'}
          </button>
        </form>
      )}

      {path === 'whatsapp' && (
        <div>
          <button type="button" onClick={() => setPath(null)} className="text-xs text-ink/50 mb-6 hover:text-magenta">
            ← Back
          </button>
          <p className="text-ink/70 mb-6">
            We&apos;ll open WhatsApp with your order details filled in — just hit send.
          </p>
          <button
            onClick={finishWithWhatsApp}
            disabled={submitting}
            className="bg-magenta text-white px-6 py-3 text-sm hover:bg-magentadeep transition-colors disabled:opacity-50"
          >
            {submitting ? 'Preparing…' : 'Chat on WhatsApp'}
          </button>
        </div>
      )}
    </div>
  );
}