export default function Footer() {
  return (
    <footer className="border-t border-sand mt-24" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-6xl mx-auto px-5 py-10 grid gap-8 sm:grid-cols-3 text-sm text-ink/70">
        <div>
          <p className="font-display text-lg text-ink mb-2">IPHYGLAMOUR</p>
          <p>Made-to-measure women&apos;s fashion, cut for individual style.</p>
        </div>
        <div>
          <p className="text-ink mb-2">Visit</p>
          <p>Opening hours — 10am to 6pm</p>
        </div>
        <div>
          <p className="text-ink mb-2">Reach us</p>
          <p>Phone / WhatsApp — 0803 345 7024</p>
          <p>Email — iphyglamour78@gmail.com</p>
          <a href="https://www.tiktok.com/@iphyglamour?_r=1&_t=ZS-9AAJGcx8aYB" target="_blank" rel="noopener noreferrer" className="hover:text-magenta transition-colors inline-block">
            TikTok
          </a>
        </div>
      </div>
      <p className="text-center text-xs text-ink/40 pb-6">© {new Date().getFullYear()} IPHYGLAMOUR</p>
    </footer>
  );
}