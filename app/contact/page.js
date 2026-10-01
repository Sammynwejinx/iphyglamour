import Link from 'next/link';

export const metadata = { title: 'Contact — IPHYGLAMOUR' };

export default function ContactPage() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2340000000000';

  return (
    <div className="max-w-xl mx-auto px-5 py-10 md:py-14">
      <h1 className="font-display text-3xl text-ink mb-2">Contact</h1>
      <p className="text-ink/60 text-sm mb-10">Reach IPHYGLAMOUR directly, or book a measurement.</p>

      <dl className="grid gap-4 text-sm mb-10">
        <div className="flex justify-between border-b border-sand pb-3">
          <dt className="text-ink/60">Phone / WhatsApp</dt>
          <dd className="text-ink">0803 345 7024</dd>
        </div>
        <div className="flex justify-between border-b border-sand pb-3">
          <dt className="text-ink/60">Email</dt>
          <dd className="text-ink">iphyglamour78@gmail.com</dd>
        </div>
        <div className="flex justify-between border-b border-sand pb-3">
          <dt className="text-ink/60">Opening hours</dt>
          <dd className="text-ink">10am – 6pm</dd>
        </div>
        <div className="flex justify-between border-b border-sand pb-3">
          <dt className="text-ink/60">TikTok</dt>
          <dd className="text-ink">
            <a href="https://www.tiktok.com/@iphyglamour?_r=1&_t=ZS-9AAJGcx8aYB" target="_blank" rel="noopener noreferrer" className="hover:text-magenta transition-colors">
              @iphyglamour
            </a>
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-4">
        <a
          href={`https://wa.me/${number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-magenta text-white px-6 py-3 text-sm hover:bg-magentadeep transition-colors"
        >
          Chat on WhatsApp
        </a>
        <Link href="/measurements" className="border border-ink px-6 py-3 text-sm hover:border-magenta hover:text-magenta transition-colors">
          Book a measurement
        </Link>
      </div>
    </div>
  );
}