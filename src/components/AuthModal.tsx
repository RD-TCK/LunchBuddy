'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { X, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LunchBuddyLogo } from './LunchBuddyLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (activeTab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        onClose();
        router.push('/dashboard');
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg('Account created successfully! Check your email to verify or log in.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1D3A]/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-[#0D1D3A] rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="p-8 pb-4 text-center">
          <div className="flex justify-center mb-3">
            <LunchBuddyLogo size="md" iconOnly />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0D1D3A]">
            {activeTab === 'login' ? 'Welcome Back!' : 'Join LunchBuddy 👋'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'login'
              ? 'Log in to manage & track your daily tiffins'
              : 'Your meal management companion for hostels & PGs'}
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="flex border-b border-gray-100 px-8">
          <button
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'login'
                ? 'border-[#FF5B00] text-[#FF5B00]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => { setActiveTab('login'); setError(null); setSuccessMsg(null); }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'signup'
                ? 'border-[#FF5B00] text-[#FF5B00]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => { setActiveTab('signup'); setError(null); setSuccessMsg(null); }}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
          {error && (
            <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs font-semibold text-green-700 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@hostel.com"
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 transition-all text-[#0D1D3A] placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 transition-all text-[#0D1D3A] placeholder-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-[#FF5B00] hover:bg-[#E05000] text-white font-bold rounded-xl shadow-lg shadow-[#FF5B00]/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <span>{loading ? 'Please wait...' : activeTab === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

      </div>
    </div>
  );
};
