'use client';

export default function WhatsAppButton({ message }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2340000000000';
  const text = encodeURIComponent(message || 'Hello IPHYGLAMOUR, I have a question.');
  const href = `https://wa.me/${number}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:block fixed bottom-5 right-5 z-30 bg-magenta text-white text-sm px-4 py-3 rounded-full shadow-lg hover:bg-magentadeep transition-colors"
    >
      Chat on WhatsApp
    </a>
  );
}
