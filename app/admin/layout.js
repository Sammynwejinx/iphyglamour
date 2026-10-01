'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/collections', label: 'Collections' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/appointments', label: 'Appointments' }
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    if (session === null) router.replace('/admin/login');
  }, [session, pathname, router]);

  if (pathname === '/admin/login') return children;

  if (session === undefined) {
    return <div className="max-w-6xl mx-auto px-5 py-14 text-sm text-ink/50">Loading…</div>;
  }

  if (!session) return null; // redirecting

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-[180px_1fr] gap-10">
      <aside>
        <p className="font-display text-lg text-ink mb-4">Admin</p>
        <nav className="flex md:flex-col gap-1 flex-wrap text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="py-1.5 text-ink/70 hover:text-magenta transition-colors">
              {l.label}
            </Link>
          ))}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/admin/login');
            }}
            className="text-left py-1.5 text-ink/50 hover:text-magenta transition-colors text-sm mt-2"
          >
            Sign out
          </button>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
