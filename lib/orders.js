import { supabase } from './supabaseClient';

export function generateOrderNumber() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `IPG-${n}`;
}

// Creates the order row. Returns the order number either way (even if the
// Supabase write fails, e.g. before the project is wired up) so the customer
// journey still completes and staff can follow up manually via WhatsApp.
export async function createOrder({ items, total, customerName, phone, measurementStatus }) {
  const orderNumber = generateOrderNumber();
  try {
    await supabase.from('orders').insert({
      order_number: orderNumber,
      customer_name: customerName || null,
      phone: phone || null,
      items,
      total,
      measurement_status: measurementStatus || 'awaiting_measurement',
      status: 'new'
    });
  } catch (e) {
    // Swallow errors so the customer-facing flow never breaks; the order
    // number is still shown and can be reconciled from the WhatsApp message.
  }
  return orderNumber;
}

export async function saveMeasurements(orderNumber, measurements) {
  try {
    const { data: order } = await supabase.from('orders').select('id').eq('order_number', orderNumber).single();
    await supabase.from('measurements').insert({ order_id: order?.id || null, ...measurements });
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
