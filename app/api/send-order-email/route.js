import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'IPHYGLAMOUR <orders@iphyglamour.online>';
const ADMIN_EMAIL = 'sammynwejinx46@gmail.com';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (n) => '₦' + Number(n || 0).toLocaleString();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function dressNames(items) {
  return (items || []).filter((i) => i && i.name).map((i) => String(i.name).replace(/[\r\n]+/g, ' '));
}

// For subject lines: "Navy Kaftan" or "Navy Kaftan, Orange Set" (more than two: "A, B +1 more")
function dressLabel(items) {
  const names = dressNames(items);
  if (names.length === 0) return '';
  return names.length <= 2 ? names.join(', ') : `${names[0]}, ${names[1]} +${names.length - 2} more`;
}

// Looks up each dress photo. If anything goes wrong the email is sent without photos.
async function loadImages(items) {
  try {
    const ids = (items || []).map((i) => i && i.id).filter((id) => UUID_RE.test(String(id)));
    if (ids.length === 0) return {};
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });
    const { data } = await db.from('products').select('id, image_url, image_urls').in('id', ids);
    const map = {};
    (data || []).forEach((p) => {
      const url = (Array.isArray(p.image_urls) && p.image_urls[0]) || p.image_url;
      if (url && /^https:\/\//.test(url)) map[p.id] = url;
    });
    return map;
  } catch (e) {
    return {};
  }
}

function itemsHtml(items, images) {
  return (items || [])
    .filter((i) => i && i.name)
    .map((i) => {
      const img = images[i.id]
        ? `<td style="padding-right:14px;vertical-align:top"><img src="${esc(images[i.id])}" alt="${esc(i.name)}" width="140" style="display:block;width:140px;max-width:100%;height:auto;border-radius:4px"/></td>`
        : '';
      return `<table role="presentation" style="margin:0 0 12px"><tr>${img}<td style="vertical-align:top"><strong>${esc(i.name)}</strong><br/><span style="color:#777">Quantity: ${esc(i.quantity)} · ${money(i.price * i.quantity)}</span></td></tr></table>`;
    })
    .join('');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderNumber, customerName, email, items, subtotal, deliveryFee, total } = body;

    const dress = dressLabel(items);
    const tag = dress ? ` · ${dress}` : '';
    const full = dressNames(items).join(', ');
    const ref = `<strong>Order #${esc(orderNumber)}</strong>${full ? ` — ${esc(full)}` : ''}`;
    const images = await loadImages(items);
    const list = itemsHtml(items, images);

    if (email) {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: `Order Received — IPHYGLAMOUR Order #${orderNumber}${tag}`,
        html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#222;line-height:1.6">
<h2 style="letter-spacing:3px;font-weight:normal">IPHYGLAMOUR</h2>
<p style="font-size:17px;margin:0 0 14px">${ref}</p>
${list}
<p>Hi ${esc(customerName || 'there')},</p>
<p>We've received your order. Here are the details:</p>
${subtotal != null ? `<p>Subtotal: ${money(subtotal)}</p>` : ''}
${deliveryFee != null ? `<p>Delivery fee: ${money(deliveryFee)}</p>` : ''}
<p><strong>Total: ${money(total)}</strong></p>
<p>Payment method: Bank transfer<br/>Payment status: Pending</p>
<p>We'll confirm your payment and keep you updated as your order moves through production. Thank you for choosing IPHYGLAMOUR.</p>
</div>`
      });
    }

    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New Order — IPHYGLAMOUR Order #${orderNumber}${tag}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;color:#222;line-height:1.6">
<p>${ref}</p>
<p><strong>Customer:</strong> ${esc(customerName || 'N/A')}<br/>
<strong>Email:</strong> ${esc(email || 'N/A')}</p>
${list}
<p><strong>Total: ${money(total)}</strong></p>
<p>View it in the admin dashboard.</p>
</div>`
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Order email error:', error);
    return Response.json({ ok: false, error: 'send-failed' }, { status: 500 });
  }
}