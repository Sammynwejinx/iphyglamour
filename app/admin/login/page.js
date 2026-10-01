'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Could not sign in — check your email and password.');
      return;
    }
    router.push('/admin');
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <h1 className="font-display text-2xl text-ink mb-6">Admin sign in</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-sand px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-sand px-3 py-2 text-sm"
        />
        {error && <p className="text-xs text-magenta">{error}</p>}
        <button
          disabled={loading}
          className="bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-xs text-ink/40 mt-6">
        Admin accounts are created in the Supabase dashboard, not on this page. See SETUP.md.
      </p>
    </div>
  );
}
