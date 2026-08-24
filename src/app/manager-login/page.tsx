'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2, User, Building2, MapPin, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FDF8F5] text-[#0D1D3A] flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF5B00]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 max-w-7xl mx-auto w-full flex items-center justify-between z-10 border-b border-orange-100/50 sm:border-none">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <LunchBuddyLogo size="md" />
        </Link>
        <Link 
          href="/" 
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#0D1D3A] transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
          Back to Website
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-white border border-orange-100 p-6 md:p-10 rounded-[2rem] shadow-xl shadow-orange-100/10 flex flex-col relative transition-all duration-300 hover:border-orange-200">
          
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#FF5B00] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" />
              <span>Management Portal</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#0D1D3A]">
              {activeTab === 'login' ? 'Manager Sign In' : 'Register Hostel & PG'}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {activeTab === 'login' 
                ? 'Enter your credentials to manage properties, tiffins, and delivery routes.'
                : 'Create an admin account and register a new Hostel/PG property.'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#FF5B00] text-white shadow-md shadow-[#FF5B00]/25'
                  : 'text-slate-500 hover:text-[#0D1D3A]'
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
                  : 'text-slate-500 hover:text-[#0D1D3A]'
              }`}
              onClick={() => handleTabChange('signup')}
            >
              Register Hostel
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3.5 text-xs font-semibold text-red-800 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-fadeIn">
              <ShieldAlert className="shrink-0 text-red-500 mt-0.5" size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 text-xs font-semibold text-green-800 bg-green-50 border border-green-100 rounded-xl flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="shrink-0 text-green-500 mt-0.5" size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-xs font-semibold text-[#0D1D3A] placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Hostel/PG Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Hostel / PG Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    <input
                      type="text"
                      required
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      placeholder="e.g. Skyline Residency"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-xs font-semibold text-[#0D1D3A] placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Hostel/PG Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Hostel Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="e.g. Knowledge Park III, Greater Noida"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-xs font-semibold text-[#0D1D3A] placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@lunchbuddy.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-xs font-semibold text-[#0D1D3A] placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-xs font-semibold text-[#0D1D3A] placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-400 hover:text-[#0D1D3A] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#FF5B00] hover:bg-[#E05000] text-white font-extrabold rounded-xl shadow-lg shadow-[#FF5B00]/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs uppercase tracking-wider"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Secure Login' : 'Register Hostel & Account'}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-[10px] text-gray-400 z-10 font-bold uppercase tracking-wider">
        &copy; {new Date().getFullYear()} LunchBuddy. Secured B2B Gateway.
      </footer>

    </div>
  );
}
