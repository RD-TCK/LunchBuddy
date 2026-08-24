'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Hash, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab State: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);

  // Sync tab from search params if present
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error: fetchErr } = await supabase
        .from('properties')
        .select('id, name')
        .order('name');
      
      if (fetchErr) throw fetchErr;
      if (data) setProperties(data);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
    }
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setError(null);
    setSuccessMsg(null);
    // Maintain state in URL without pushing to history stack
    window.history.replaceState(null, '', `/login?tab=${tab}`);
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
          password 
        });
        
        if (authError) {
          throw authError;
        }

        if (authData.user) {
          // Fetch user role from profiles table
          const { data: profile, error: profileErr } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single();

          if (profileErr) {
            console.error('Error fetching profile:', profileErr);
          }
          
          // Smart Redirect based on role
          const role = profile?.role;
          if (role === 'OWNER') {
            router.push('/admin');
          } else if (role === 'ADMIN') {
            router.push('/hostel-admin');
          } else if (role === 'VENDOR') {
            router.push('/vendor-admin');
          } else {
            router.push('/dashboard'); // Default resident dashboard
          }
        }
      } else {
        // Signup Specific Validation
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!propertyId) throw new Error('Please select a Hostel/PG.');
        if (!roomNumber.trim()) throw new Error('Please enter your room number.');

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              name: name.trim(),
              property_id: propertyId,
              room_number: roomNumber.trim()
            }
          }
        });
        
        if (signUpError) {
          throw signUpError;
        }

        setSuccessMsg('Account created successfully! Please check your email to verify your account, then sign in.');
        
        // Clear registration fields
        setName('');
        setPropertyId('');
        setRoomNumber('');
        setEmail('');
        setPassword('');
        // Automatically switch back to login tab after brief pause
        setTimeout(() => {
          setActiveTab('login');
          window.history.replaceState(null, '', `/login?tab=login`);
        }, 4000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col relative transition-all duration-300 hover:border-white/15">
      {/* Dynamic top ambient light bar inside the card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#FF5B00] to-transparent" />
      
      {/* Brand Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 font-sans">
          <Sparkles size={12} className="text-[#FF5B00] animate-pulse" />
          <span>Student Portal</span>
        </div>
      </div>

      {/* Toggle Tabs */}
      <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 mb-8">
        <button
          type="button"
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
            activeTab === 'login'
              ? 'bg-[#FF5B00] text-white shadow-lg shadow-[#FF5B00]/25'
              : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => handleTabChange('login')}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
            activeTab === 'signup'
              ? 'bg-[#FF5B00] text-white shadow-lg shadow-[#FF5B00]/25'
              : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => handleTabChange('signup')}
        >
          Create Account
        </button>
      </div>

      {/* Header messages */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          {activeTab === 'login' ? 'Welcome Back!' : 'Join LunchBuddy 👋'}
        </h1>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          {activeTab === 'login'
            ? 'Access your daily tiffin bookings, schedules, and QR delivery codes.'
            : 'Register to link your profile with your PG/Hostel kitchen.'}
        </p>
      </div>

      {/* Status Alert Panels */}
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

      {/* Forms */}
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
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Hostel/PG Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Hostel / PG</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <select
                  required
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 bg-[#17243c] border border-white/10 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-sm font-medium text-white appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-slate-500 bg-[#0d1d3a]">-- Choose your Hostel --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id} className="text-white bg-[#0d1d3a]">
                      {p.name}
                    </option>
                  ))}
                </select>
                {/* Custom arrow decoration */}
                <div className="absolute right-4 top-5 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400 w-0 h-0" />
              </div>
            </div>

            {/* Room Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Room Number</label>
              <div className="relative">
                <Hash className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 102-B"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-11 pr-4 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#FF5B00] rounded-xl outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Password</label>
            {activeTab === 'login' && (
              <span className="text-xs text-slate-400 hover:text-[#FF5B00] transition-colors cursor-pointer font-medium">
                Forgot password?
              </span>
            )}
          </div>
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-4 bg-[#FF5B00] hover:bg-[#E05000] text-white font-bold rounded-xl shadow-lg shadow-[#FF5B00]/25 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{loading ? 'Processing request...' : activeTab === 'login' ? 'Sign In to Dashboard' : 'Create Resident Account'}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </form>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <div className="min-h-screen bg-[#0D1D3A] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Decorative Gradients for premium dark feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#FF5B00]/10 blur-[130px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none animate-pulse-subtle" />

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

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 z-10">
        <Suspense fallback={
          <div className="w-full max-w-lg bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-center min-h-[400px]">
            <div className="text-slate-400 font-semibold animate-pulse">Loading auth components...</div>
          </div>
        }>
          <LoginContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-xs text-slate-500 z-10">
        &copy; {new Date().getFullYear()} LunchBuddy. Smart Meal Fulfillment Systems.
      </footer>
    </div>
  );
}
