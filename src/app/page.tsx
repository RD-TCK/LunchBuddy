import Link from 'next/link';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';
import { ShieldCheck, ArrowRight, Utensils, CheckCircle2, Clock } from 'lucide-react';

export const metadata = {
  title: 'LunchBuddy - Tiffin Management for Hostels & PGs',
  description: 'The ultimate platform for managing daily tiffin subscriptions, vendor routing, and student meal bookings across colleges and hostels.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#0D1D3A] font-sans selection:bg-[#FF5B00] selection:text-white flex flex-col">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-orange-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <LunchBuddyLogo size="lg" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
            <Link href="/" className="text-[#0D1D3A]">Home</Link>
            <Link href="/about" className="hover:text-[#FF5B00] transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-[#FF5B00] transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/manager-login"
              className="px-5 py-2.5 text-sm font-bold text-[#0D1D3A] bg-white border-2 border-gray-200 hover:border-[#0D1D3A] rounded-xl transition-all"
            >
              Manager Login
            </Link>
            <Link 
              href="/login"
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#FF5B00] hover:bg-[#E05000] rounded-xl shadow-lg shadow-[#FF5B00]/30 transition-all flex items-center gap-2 group"
            >
              Student Login
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-[#FF5B00] font-bold text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5B00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5B00]"></span>
                </span>
                Now available at select PGs and Colleges
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                No more <br/>
                <span className="text-[#FF5B00]">missed tiffins</span> <br/>
                or lost boxes.
              </h1>
              
              <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                The smart way for hostels, students, and vendors to manage daily lunch deliveries. Book your meal, select your college, and scan to receive.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link 
                  href="/login?tab=signup"
                  className="w-full sm:w-auto px-8 py-4 bg-[#0D1D3A] hover:bg-[#1E3A8A] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg group text-center"
                >
                  Register as Student
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-gray-200/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-[#22C55E]" size={20} />
                  <span className="text-sm font-bold text-gray-600">Smart QR Scanning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-[#FF5B00]" size={20} />
                  <span className="text-sm font-bold text-gray-600">Daily Cutoffs</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5B00]/20 to-transparent rounded-full blur-3xl"></div>
              <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <div className="text-sm font-bold text-gray-400">Today's Lunch</div>
                      <div className="text-xl font-bold text-[#0D1D3A]">Paneer Butter Masala</div>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-[#FF5B00]">
                      <Utensils size={24} />
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <div className="w-48 h-48 bg-white mx-auto rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                      <span className="font-bold text-gray-400 text-sm">QR Code<br/>Generated</span>
                    </div>
                    <div className="text-sm font-bold text-[#0D1D3A]">Delivering to: <span className="text-[#FF5B00]">NIET College</span></div>
                    <div className="text-xs text-gray-500 mt-1">Show this to the vendor</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <LunchBuddyLogo size="sm" />
          <div className="text-sm font-bold text-gray-500 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} LunchBuddy. All rights reserved.
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0 text-sm font-bold text-gray-400">
            <Link href="/about" className="hover:text-[#0D1D3A]">About</Link>
            <Link href="/contact" className="hover:text-[#0D1D3A]">Contact</Link>
            <Link href="/privacy" className="hover:text-[#0D1D3A]">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
