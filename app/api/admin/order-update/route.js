import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const FROM = 'IPHYGLAMOUR <orders@iphyglamour.online>';
const STATUS_TO_TYPE = {
  'In Production': 'in_production',
  Ready: 'ready',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled'
};

const money = (n) => '₦' + Number(n || 0).toLocaleString();
const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const addDays = (date, n) => new Date(date.getTime() + n * 86400000);
const isoDate = (d) => d.toISOString().slice(0, 10);

function buildEmail(type, o) {
  const n = o.order_number;
  const name = esc(o.customer_name || 'there');
  const win =
    o.estimated_delivery_start && o.estimated_delivery_end
      ? ` (an estimate: between ${fmtDate(o.estimated_delivery_start)} and ${fmtDate(o.estimated_delivery_end)})`
      : '';
  const tracking = [
    o.delivery_company ? `Delivery company: ${esc(o.delivery_company)}` : '',
    o.tracking_number ? `Tracking number: ${esc(o.tracking_number)}` : '',
    o.tracking_info ? esc(o.tracking_info) : ''
  ]
    .filter(Boolean)
    .join('<br/>');

  const T = {
    payment_confirmed: {
      subject: `Payment Confirmed — IPHYGLAMOUR Order #${n}`,
      body: `<p>Your payment of <strong>${money(o.total)}</strong> for IPHYGLAMOUR order <strong>#${n}</strong> has been confirmed.</p>
<p>Your order is now confirmed and will proceed to production.</p>
<p>You can expect your finished dress within approximately 2 weeks${win}, depending on the production and delivery process.</p>`
    },
    in_production: {
      subject: `Your IPHYGLAMOUR dress is now in production — Order #${n}`,
      body: `<p>Your IPHYGLAMOUR dress for order <strong>#${n}</strong> is now in production.</p>`
    },
    ready: {
      subject: `Your IPHYGLAMOUR dress is ready — Order #${n}`,
      body: `<p>Your IPHYGLAMOUR dress for order <strong>#${n}</strong> is ready.</p>`
    },
    shipped: {
      subject: `Your IPHYGLAMOUR order has been shipped — Order #${n}`,
      body: `<p>Your IPHYGLAMOUR order <strong>#${n}</strong> has been shipped and is on its way to you.</p>${
        tracking ? `<p>${tracking}</p>` : ''
      }`
    },
    delivered: {
      subject: `Your IPHYGLAMOUR order has been delivered — Order #${n}`,
      body: `<p>Your IPHYGLAMOUR order <strong>#${n}</strong> has been delivered. We hope you love it.</p>`
    },
    cancelled: {
      subject: `Your IPHYGLAMOUR order has been cancelled — Order #${n}`,
      body: `<p>Your IPHYGLAMOUR order <strong>#${n}</strong> has been cancelled. If you have any questions, please reply to this email or contact us on WhatsApp.</p>`
    }
  }[type];

  const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#222;line-height:1.6">
<h2 style="letter-spacing:3px;font-weight:normal">IPHYGLAMOUR</h2>
<p>Hi ${name},</p>
${T.body}
<p>Thank you for choosing IPHYGLAMOUR.</p>
</div>`;
  return { subject: T.subject, html };
}

async function logEmail(db, order, type, status, extra = {}) {
  await db.from('email_log').insert({
    order_id: order.id,
    email_type: type,
    recipient: order.email || null,
    status,
    ...extra
  });
}

async function sendStatusEmail(db, order, type) {
  const { data: already } = await db
    .from('email_log')
    .select('id')
    .eq('order_id', order.id)
    .eq('email_type', type)
    .eq('status', 'sent')
    .limit(1);
  if (already && already.length) return 'already_sent';

  if (!order.email) {
    await logEmail(db, order, type, 'skipped', { error: 'No customer email on this order' });
    return 'skipped';
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { subject, html } = buildEmail(type, order);
    const { data, error } = await resend.emails.send({ from: FROM, to: order.email, subject, html });
    if (error) throw new Error(error.message || 'Resend error');
    await logEmail(db, order, type, 'sent', { provider_id: data?.id || null });
    return 'sent';
  } catch (e) {
    await logEmail(db, order, type, 'failed', { error: String(e.message || e) });
    return 'failed';
  }
}

export async function POST(request) {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  // Only a signed-in admin may use this route
  const token = (request.headers.get('authorization') || '').replace('Bearer ', '');
  const { data: userData, error: authError } = token ? await db.auth.getUser(token) : { error: true };
  if (authError || !userData?.user) {
    return Response.json({ ok: false, error: 'Not signed in as admin' }, { status: 401 });
  }

  const { orderId, action, status, deliveryCompany, trackingNumber, trackingInfo } = await request.json();

  const { data: order, error: findError } = await db.from('orders').select('*').eq('id', orderId).single();
  if (findError || !order) return Response.json({ ok: false, error: 'Order not found' }, { status: 404 });

  let update = {};
  let emailType = null;

  if (action === 'confirm_payment') {
    if (order.payment_status === 'Confirmed') return Response.json({ ok: true, changed: false });
    const now = new Date();
    update = {
      payment_status: 'Confirmed',
      payment_confirmed_at: now.toISOString(),
      estimated_delivery_start: isoDate(addDays(now, 12)),
      estimated_delivery_end: isoDate(addDays(now, 16))
    };
    emailType = 'payment_confirmed';
  } else if (action === 'set_status') {
    const allowed = ['Order Received', 'In Production', 'Ready', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) return Response.json({ ok: false, error: 'Invalid status' }, { status: 400 });
    if (order.order_status === status) return Response.json({ ok: true, changed: false });
    update = { order_status: status };
    if (deliveryCompany) update.delivery_company = deliveryCompany;
    if (trackingNumber) update.tracking_number = trackingNumber;
    if (trackingInfo) update.tracking_info = trackingInfo;
    emailType = STATUS_TO_TYPE[status] || null;
  } else {
    return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  }

  update.updated_at = new Date().toISOString();
  const { error: updateError } = await db.from('orders').update(update).eq('id', order.id);
  if (updateError) return Response.json({ ok: false, error: updateError.message }, { status: 500 });

  // The status change is already saved. An email problem never undoes it.
  let emailStatus = 'none';
  if (emailType) emailStatus = await sendStatusEmail(db, { ...order, ...update }, emailType);

  return Response.json({ ok: true, changed: true, emailStatus });
}