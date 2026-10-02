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
          <p>Paris World Plaza, beside Grand Maridos Hotel, adjacent to Ire Akari Estate, Akala Expressway, Ibadan.</p>
          <p className="mt-2">Opening hours — 10am to 6pm</p>
        </div>
        <div>
          <p className="text-ink mb-2">Reach us</p>
          <p>Phone / WhatsApp — 0803 345 7024</p>
          <p className="mb-3">Email — iphyglamour78@gmail.com</p>
          <div className="flex items-center gap-4">
            <a href="https://www.tiktok.com/@iphyglamour?_r=1&_t=ZS-9AAJGcx8aYB" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-magenta transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 2h-3.2v13.6c0 1.5-1.2 2.7-2.7 2.7a2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7c.3 0 .6 0 .9.1V9.7a6 6 0 0 0-.9-.1A5.9 5.9 0 0 0 4.7 15.5a5.9 5.9 0 0 0 5.9 5.9 5.9 5.9 0 0 0 5.9-5.9V8.3a8.3 8.3 0 0 0 4.8 1.5V6.6a5 5 0 0 1-4.8-4.6Z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/iphyglamour_fashion" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-magenta transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-ink/40 pb-6">© {new Date().getFullYear()} IPHYGLAMOUR</p>
    </footer>
  );
}
