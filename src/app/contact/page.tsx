import Link from 'next/link';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';

export const metadata = {
  title: 'Contact | LunchBuddy',
  description: 'Get in touch with the LunchBuddy team to onboard your hostel or PG.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#0D1D3A] font-sans selection:bg-[#FF5B00] selection:text-white flex flex-col">
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <LunchBuddyLogo size="md" />
          </Link>
          <div className="flex items-center gap-8 text-sm font-bold text-gray-600">
            <Link href="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[#FF5B00] transition-colors">About Us</Link>
            <Link href="/contact" className="text-[#0D1D3A]">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-[#0D1D3A]">Get in <span className="text-[#FF5B00]">Touch</span></h1>
        <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
          Want to bring LunchBuddy to your PG or Hostel? Reach out to us and we'll get your dashboard configured in minutes.
        </p>
        
        <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-sm max-w-lg mx-auto text-left mt-8">
          <form className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">Your Name</label>
              <input type="text" className="w-full px-4 py-3 mt-1 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5B00]" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">Email Address</label>
              <input type="email" className="w-full px-4 py-3 mt-1 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5B00]" placeholder="john@example.com" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">Hostel / PG Name</label>
              <input type="text" className="w-full px-4 py-3 mt-1 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5B00]" placeholder="Sunny PG" />
            </div>
            <button type="button" className="w-full py-3.5 mt-4 bg-[#0D1D3A] hover:bg-[#1E3A8A] text-white font-bold rounded-xl shadow-lg transition-all">
              Send Message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
