'use client';

import { useState, useEffect } from 'react';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';
import { AuthModal } from '@/components/AuthModal';
import { Calendar, UtensilsCrossed, Bike, ClipboardCheck, ArrowRight, Heart, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  const openAuth = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0D1D3A] flex flex-col selection:bg-[#FF5B00] selection:text-white">
      
      {/* Auth Modal Component */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authTab}
      />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 glass-nav px-6 py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <LunchBuddyLogo size="md" />

          {/* Right Header Navigation & Login / Sign Up options */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-[#0D1D3A] text-white font-bold text-sm rounded-2xl hover:bg-[#1E3A8A] transition-all shadow-md flex items-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="px-5 py-2.5 text-sm font-bold text-[#0D1D3A] hover:text-[#FF5B00] transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="px-5 py-2.5 bg-[#FF5B00] text-white text-sm font-bold rounded-2xl shadow-md shadow-[#FF5B00]/25 hover:bg-[#E05000] hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 lg:py-16 space-y-20">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Poster Typography & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200/80 shadow-sm text-xs font-bold text-[#0D1D3A]">
              <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span>Smarter Meal Operations for Hostels & PGs</span>
            </div>

            {/* Poster Headline */}
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-[#0D1D3A]">
                Hello <br />
                <span className="text-[#FF5B00] relative inline-block">
                  World!
                  {/* Decorative Green Doodle Curve */}
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#22C55E]" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,10 Q50,20 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Hand-drawn Green Heart Doodle */}
              <div className="absolute top-2 right-12 text-[#22C55E] hidden sm:block animate-float">
                <Heart size={36} strokeWidth={2.5} />
              </div>
            </div>

            {/* Welcome Intro */}
            <div className="space-y-2 pt-2">
              <h2 className="text-2xl font-bold text-[#0D1D3A] flex items-center gap-2">
                We're <span className="text-[#0D1D3A]">Lunch</span><span className="text-[#FF5B00]">Buddy</span> 👋
              </h2>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-medium">
                Your meal management companion for hostels, PGs & residences. Good food. Happy people. Simpler together.
              </p>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => openAuth('signup')}
                className="px-8 py-4 bg-[#FF5B00] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-[#FF5B00]/30 hover:bg-[#E05000] hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-3"
              >
                <span>Get Started Now</span>
                <ArrowRight size={20} />
              </button>
              
              <button
                onClick={() => openAuth('login')}
                className="px-8 py-4 bg-white text-[#0D1D3A] font-extrabold text-base rounded-2xl border border-gray-200 shadow-md hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <span>Sign In</span>
              </button>
            </div>

            {/* Feature Pills (Poster Design) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
              
              <div className="p-3.5 bg-[#FFF4EC] rounded-2xl border border-[#FFD8BE] text-center space-y-1">
                <div className="w-8 h-8 mx-auto bg-[#FF5B00] text-white rounded-xl flex items-center justify-center shadow-sm">
                  <Calendar size={18} />
                </div>
                <div className="text-xs font-bold text-[#0D1D3A]">Easy Booking</div>
              </div>

              <div className="p-3.5 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] text-center space-y-1">
                <div className="w-8 h-8 mx-auto bg-[#22C55E] text-white rounded-xl flex items-center justify-center shadow-sm">
                  <UtensilsCrossed size={18} />
                </div>
                <div className="text-xs font-bold text-[#0D1D3A]">Kitchen Mgmt</div>
              </div>

              <div className="p-3.5 bg-[#FEFCE8] rounded-2xl border border-[#FEF08A] text-center space-y-1">
                <div className="w-8 h-8 mx-auto bg-[#EAB308] text-white rounded-xl flex items-center justify-center shadow-sm">
                  <Bike size={18} />
                </div>
                <div className="text-xs font-bold text-[#0D1D3A]">Timely Delivery</div>
              </div>

              <div className="p-3.5 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] text-center space-y-1">
                <div className="w-8 h-8 mx-auto bg-[#3B82F6] text-white rounded-xl flex items-center justify-center shadow-sm">
                  <ClipboardCheck size={18} />
                </div>
                <div className="text-xs font-bold text-[#0D1D3A]">Real-time Updates</div>
              </div>

            </div>

          </div>

          {/* Right Column - Mobile App Screen Showcase (Replicating Poster) */}
          <div className="lg:col-span-5 flex justify-center">
            
            <div className="relative w-full max-w-[340px] bg-[#0D1D3A] rounded-[44px] p-4 shadow-2xl border-4 border-gray-800 shadow-2xl">
              
              {/* Phone Notch & Speaker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>

              {/* Mobile Screen Container */}
              <div className="relative bg-[#F8FAFC] rounded-[36px] overflow-hidden pt-8 pb-6 px-4 space-y-5 text-left border border-gray-200 min-h-[580px] flex flex-col justify-between">
                
                {/* Mobile Header Bar */}
                <div className="flex items-center justify-between pt-2 px-1">
                  <LunchBuddyLogo size="sm" />
                </div>

                {/* Greeting */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-1">
                  <div className="text-base font-bold text-[#0D1D3A] flex items-center gap-1.5">
                    Hi there! 👋
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    What would you like to do today?
                  </div>
                </div>

                {/* Mobile Grid Cards (Matching Poster Phone Screen) */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Book Meal */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#FF5B00] transition-all cursor-pointer text-center space-y-2 group">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-orange-50 text-[#FF5B00] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0D1D3A]">Book Meal</div>
                      <div className="text-[10px] text-gray-400">Book in advance</div>
                    </div>
                  </div>

                  {/* My Meals */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#22C55E] transition-all cursor-pointer text-center space-y-2 group">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-green-50 text-[#22C55E] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UtensilsCrossed size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0D1D3A]">My Meals</div>
                      <div className="text-[10px] text-gray-400">View booked meals</div>
                    </div>
                  </div>

                  {/* Orders */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 transition-all cursor-pointer text-center space-y-2 group">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ClipboardCheck size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0D1D3A]">Orders</div>
                      <div className="text-[10px] text-gray-400">Track orders</div>
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-500 transition-all cursor-pointer text-center space-y-2 group">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0D1D3A]">Profile</div>
                      <div className="text-[10px] text-gray-400">Update info</div>
                    </div>
                  </div>

                </div>

                {/* Bottom Card Preview */}
                <div className="bg-gradient-to-r from-[#0D1D3A] to-[#1E3A8A] text-white p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Today's Lunch Tiffin</span>
                    <span className="px-2 py-0.5 bg-[#22C55E] text-white rounded-full text-[10px]">PREPARING</span>
                  </div>
                  <div className="text-xs opacity-80">Paneer Butter Masala + Dal + Rice</div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

      {/* FOOTER & BRAND BANNER (Poster Motto) */}
      <footer className="bg-[#0D1D3A] text-white mt-auto py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-extrabold tracking-tight">
              Better meals. <span className="text-[#FF5B00]">Better living.</span>
            </h3>
            <p className="text-sm text-gray-400">
              Join us on this journey towards smarter meal operations.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center">
            <div className="text-sm font-semibold flex items-center gap-1.5 justify-center">
              Made with <span className="text-[#22C55E]">Care 💚</span>. Delivered with <span className="text-[#FF5B00]">Trust.</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
