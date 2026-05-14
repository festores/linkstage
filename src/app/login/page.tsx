'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const isSignup = params.get('signup') === 'true';

  const [mode, setMode] = useState<'signin' | 'signup'>(isSignup ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password: pass,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) { setError(error.message); setLoading(false); return; }
      window.location.href = '/dashboard';
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl p-10 border border-gray-200 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="font-bold text-xl mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm">We sent a confirmation link to <strong>{email}</strong>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-[family-name:var(--font-syne)] text-2xl font-bold">
            Link<span className="text-purple-600">Stage</span>
          </Link>
          <p className="text-gray-500 mt-2 text-sm">{mode === 'signup' ? 'Create your creator page' : 'Welcome back'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex rounded-lg border border-gray-200 mb-6 p-1 text-sm">
            {(['signin', 'signup'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === m ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                {m === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Password</label>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required minLength={6} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="••••••••" />
            </div>
            {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors">
              {loading ? 'Loading...' : mode === 'signup' ? 'Create account →' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}