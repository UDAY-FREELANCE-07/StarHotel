'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { UtensilsCrossed, Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push('/admin');
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <Loader2 className="w-8 h-8 text-champagne animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <UtensilsCrossed className="w-8 h-8 text-champagne" />
            <div className="flex flex-col leading-none text-left">
              <span className="font-serif text-xl font-bold text-white">Star Family</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-champagne">Restaurant</span>
            </div>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-sm text-white/50">Sign in to manage orders and menu</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-deep-charcoal rounded-lg border border-white/10 p-6 space-y-4">
          {error && (
            <div className="bg-destructive/20 border border-destructive/30 rounded-md p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne"
                placeholder="admin@starfamily.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-champagne hover:bg-champagne-dark disabled:opacity-50 text-white px-6 py-2.5 rounded-md font-medium transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-white/30 mt-6">
          No public registration. Contact the owner for admin access.
        </p>
      </div>
    </div>
  );
}
