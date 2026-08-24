'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2, User, Building2, MapPin, Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';

export default function ManagerLoginPage() {
  const router = useRouter();
  
  // Tab State: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup Specific Fields
  const [name, setName] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (activeTab === 'login') {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          throw authError;
        }

        if (authData.user) {
          // Fetch user profile to enforce manager/owner roles
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single();

          if (profileError || !profile) {
            await supabase.auth.signOut();
            throw new Error('Error retrieving user profile.');
          }

          const isManager = profile.role === 'ADMIN';
          const isSuperAdmin = profile.role === 'OWNER';

          if (!isManager && !isSuperAdmin) {
            // Reject resident/vendors from this login page
            await supabase.auth.signOut();
            throw new Error('Access denied. This login portal is strictly reserved for Hostel Managers and Platform Admins.');
          }

          // Role-based routing
          if (isSuperAdmin) {
            router.push('/admin');
          } else {
            router.push('/hostel-admin');
          }
        }
      } else {
        // Manager & Property Signup Validation
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!propertyName.trim()) throw new Error('Please enter your Hostel/PG name.');

        // Send registration to custom API endpoint to securely insert property & auth user
        const res = await fetch('/api/register-manager', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            propertyName,
            propertyAddress,
            email,
            password
          })
        });

        const resData = await res.json();
        
        if (!res.ok) {
          throw new Error(resData.error || 'Failed to complete manager registration.');
        }

        setSuccessMsg(`Hostel "${propertyName}" and manager account registered successfully! Check your email to verify, then sign in.`);
        
        // Clear registration fields
        setName('');
        setPropertyName('');
        setPropertyAddress('');
        setEmail('');
        setPassword('');
        
        // Auto switch tab to login
        setTimeout(() => {
          setActiveTab('login');
        }, 5000);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1D3A] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Decorative Gradients for premium dark feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF5B00]/10 blur-[120px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse-subtle" />

      {/* Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <LunchBuddyLogo size="md" />
        </Link>
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
          Back to Website
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 z-10">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col relative transition-all duration-300 hover:border-white/15">
          
          {/* Dynamic top ambient light bar inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#FF5B00] to-transparent" />

          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5B00]/10 border border-[#FF5B00]/20 text-[#FF5B00] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" />
              <span>Management Portal</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {activeTab === 'login' ? 'Manager Sign In' : 'Register Hostel & PG'}
            </h1>
            <p className="text-sm text-slate-400">
              {activeTab === 'login' 
                ? 'Enter your credentials to manage properties, tiffins, and delivery routes.'
                : 'Create an admin account and register a new Hostel/PG property.'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-slate-900/40 p-1 rounded-xl border border-white/5 mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#FF5B00] text-white shadow-md shadow-[#FF5B00]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => handleTabChange('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-[#FF5B00] text-white shadow-md shadow-[#FF5B00]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => handleTabChange('signup')}
            >
              Register Hostel
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 text-xs font-semibold text-red-250 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
              <ShieldAlert className="shrink-0 text-red-400 mt-0.5" size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 text-xs font-semibold text-green-200 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="shrink-0 text-green-400 mt-0.5" size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'signup' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Hostel/PG Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Hostel / PG Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      placeholder="e.g. Skyline Residency"
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Hostel/PG Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Hostel Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="e.g. Knowledge Park III, Greater Noida"
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@lunchbuddy.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-[#FF5B00] hover:bg-[#E05000] text-white font-bold rounded-xl shadow-lg shadow-[#FF5B00]/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{loading ? 'Processing...' : activeTab === 'login' ? 'Secure Login' : 'Register Hostel & Account'}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-xs text-slate-500 z-10">
        &copy; {new Date().getFullYear()} LunchBuddy. Secured B2B Gateway.
      </footer>

    </div>
  );
}
