'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store user role and info in localStorage for client state
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A1128] via-[#001F54] to-[#0A1128] p-4">
      {/* Background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#001F54]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:border-[#FF9933]/50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#FF9933] to-[#FF5500] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF9933]/30 mb-4 animate-pulse">
            <span className="text-white text-3xl font-black tracking-wider">M</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Welcome to MealFlow
          </h1>
          <p className="text-sm text-slate-350 mt-2">
            Sign in to track and manage your meals
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800/80 text-red-200 text-sm rounded-2xl flex items-center gap-3 animate-headShake">
            <svg className="w-5 h-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A1128]/80 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-650 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933]/50 transition-all"
              placeholder="name@property.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A1128]/80 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-650 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933]/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF9933] to-[#FF5500] hover:from-[#FFB05B] hover:to-[#FF6F1C] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-[#FF9933]/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-slate-500">New to MealFlow?</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <Link
          href="/signup"
          className="block w-full text-center py-3.5 px-6 rounded-2xl border border-[#FF9933]/40 text-[#FF9933] font-semibold hover:bg-[#FF9933]/10 transition-all text-sm"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}
