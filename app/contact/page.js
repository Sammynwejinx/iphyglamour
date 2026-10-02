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
        <div className="flex justify-between border-b border-sand pb-3 items-start">
          <dt className="text-ink/60">Shop address</dt>
          <dd className="text-ink text-right max-w-[60%]">
            Paris World Plaza, beside Grand Maridos Hotel, adjacent to Ire Akari Estate, Akala Expressway, Ibadan.
          </dd>
        </div>
        <div className="flex justify-between border-b border-sand pb-3 items-center">
          <dt className="text-ink/60">Follow us</dt>
          <dd className="flex items-center gap-4">
            <a href="https://www.tiktok.com/@iphyglamour?_r=1&_t=ZS-9AAJGcx8aYB" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-ink hover:text-magenta transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 2h-3.2v13.6c0 1.5-1.2 2.7-2.7 2.7a2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7c.3 0 .6 0 .9.1V9.7a6 6 0 0 0-.9-.1A5.9 5.9 0 0 0 4.7 15.5a5.9 5.9 0 0 0 5.9 5.9 5.9 5.9 0 0 0 5.9-5.9V8.3a8.3 8.3 0 0 0 4.8 1.5V6.6a5 5 0 0 1-4.8-4.6Z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/iphyglamour_fashion" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ink hover:text-magenta transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
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
