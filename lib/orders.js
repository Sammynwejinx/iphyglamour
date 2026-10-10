import { supabase } from './supabaseClient';

export function generateOrderNumber() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `IPG-${n}`;
}

// Saves the order. It only returns an order number if the order was REALLY
// saved. If saving fails it throws, so the page shows an error, keeps the cart
// and lets the customer try again.
export async function createOrder({
  items,
  total,
  subtotal,
  deliveryFee,
  customerName,
  phone,
  measurementStatus,
  email,
  country,
  state,
  city,
  address,
  postalCode,
  shippingNotes,
  status
}) {
  let lastError = null;

  // If the random order number is already taken, try a new one (up to 5 times)
  for (let attempt = 0; attempt < 5; attempt++) {
    const orderNumber = generateOrderNumber();
    const { error } = await supabase.from('orders').insert({
      order_number: orderNumber,
      customer_name: customerName || null,
      phone: phone || null,
      email: email || null,
      country: country || null,
      state: state || null,
      city: city || null,
      address: address || null,
      postal_code: postalCode || null,
      shipping_notes: shippingNotes || null,
      items,
      total,
      subtotal: subtotal ?? null,
      delivery_fee: deliveryFee ?? null,
      payment_status: 'Pending',
      order_status: 'Order Received',
      measurement_status: measurementStatus || 'awaiting_measurement',
      status: status || 'new'
    });

    if (!error) return orderNumber;

    lastError = error;
    if (error.code !== '23505') break; // only retry when the order number was a duplicate
  }

  throw new Error(lastError?.message || 'Could not save the order');
}

// measurements = { notes, items: [{ product_id, name, type, quantity, values }] }
// One set of measurements per product in the order (gown set or two-piece set).
export async function saveMeasurements(orderNumber, measurements) {
  try {
    const { data: order } = await supabase.from('orders').select('id').eq('order_number', orderNumber).single();

    const cleanItems = (measurements?.items || []).map((item) => ({
      product_id: item.product_id,
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      values: Object.fromEntries(
        Object.entries(item.values || {}).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      )
    }));

    await supabase.from('measurements').insert({
      order_id: order?.id || null,
      details: { items: cleanItems },
      notes: measurements?.notes || null
    });

    if (order?.id) {
      await supabase.from('orders').update({ measurement_status: 'measurement_received' }).eq('id', order.id);
    }
  } catch (e) {
    // non-fatal
  }
}

export async function saveAppointment(orderNumber, appointment) {
  try {
    const { data: order } = await supabase.from('orders').select('id').eq('order_number', orderNumber).single();
    await supabase.from('appointments').insert({ order_id: order?.id || null, ...appointment });
    if (order?.id) {
      await supabase.from('orders').update({ measurement_status: 'appointment_requested' }).eq('id', order.id);
    }
  } catch (e) {
    // non-fatal
  }
}