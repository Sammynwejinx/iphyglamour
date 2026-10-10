import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'IPHYGLAMOUR <orders@iphyglamour.online>';
const ADMIN_EMAIL = 'sammynwejinx46@gmail.com';
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      orderNumber,
      customerName,
      email,
      items,
      subtotal,
      deliveryFee,
      total,
    } = body;
    const itemLines = (items || [])
      .map(
        (item) =>
          `${item.name} x${item.quantity} — ₦${Number(
            item.price * item.quantity
          ).toLocaleString()}`
      )
      .join('<br/>');
    if (email) {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: `Order Received — IPHYGLAMOUR Order #${orderNumber}`,
        html: `
          <p>Hi ${customerName || 'there'},</p>
          <p>We've received your order. Here are the details:</p>
          <p><strong>Order #${orderNumber}</strong></p>
          <p>${itemLines}</p>
          ${
            subtotal != null
              ? `<p>Subtotal: ₦${Number(subtotal).toLocaleString()}</p>`
              : ''
          }
          ${
            deliveryFee != null
              ? `<p>Delivery fee: ₦${Number(deliveryFee).toLocaleString()}</p>`
              : ''
          }
          <p><strong>Total: ₦${Number(total).toLocaleString()}</strong></p>
          <p>Payment method: Bank transfer<br/>Payment status: Pending</p>
          <p>We'll confirm your payment and keep you updated as your order moves through production. Thank you for choosing IPHYGLAMOUR.</p>
        `,
      });
    }
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New Order — IPHYGLAMOUR Order #${orderNumber}`,
      html: `
        <p><strong>Order number:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${customerName || 'N/A'}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p>${itemLines}</p>
        <p><strong>Total: ₦${Number(total).toLocaleString()}</strong></p>
        <p>View it in the admin dashboard.</p>
      `,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Order email error:', error);
    return Response.json(
      { ok: false, error: 'send-failed' },
      { status: 500 }
    );
  }
}