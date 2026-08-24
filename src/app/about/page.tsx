import Link from 'next/link';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';

export const metadata = {
  title: 'About Us | LunchBuddy',
  description: 'Learn more about LunchBuddy and our mission to streamline tiffin distribution.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#0D1D3A] font-sans selection:bg-[#FF5B00] selection:text-white flex flex-col">
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <LunchBuddyLogo size="md" />
          </Link>
          <div className="flex items-center gap-8 text-sm font-bold text-gray-600">
            <Link href="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
            <Link href="/about" className="text-[#0D1D3A]">About Us</Link>
            <Link href="/contact" className="hover:text-[#FF5B00] transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-[#0D1D3A]">About <span className="text-[#FF5B00]">LunchBuddy</span></h1>
        <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
          We built LunchBuddy to solve a massive logistical nightmare: keeping track of hundreds of tiffins, students, colleges, and returned boxes every single day.
        </p>
        <p className="text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
          Our platform empowers Hostel Managers to oversee operations, allows Students to effortlessly book their meals for delivery to their college, and gives Vendors a seamless QR-code based application to verify every drop-off and return.
        </p>
      </main>
    </div>
  );
}
