'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';
import { LogOut, Calendar, UtensilsCrossed, ClipboardCheck, User, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center gap-3">
          <LunchBuddyLogo size="md" iconOnly />
          <div className="text-sm font-bold text-[#0D1D3A] animate-pulse">Loading LunchBuddy...</div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'My Meals', href: '/dashboard', icon: UtensilsCrossed },
    { name: 'Book Meal', href: '/dashboard/book', icon: Calendar },
    { name: 'Orders', href: '/dashboard/orders', icon: ClipboardCheck },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0D1D3A] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass-nav px-6 py-3 border-b border-gray-200/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard">
            <LunchBuddyLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-gray-200/60 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#0D1D3A] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#0D1D3A] hover:bg-gray-100/80'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Email & Logout */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-[#FF5B00] rounded-xl hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-xl transition-all ${
                isActive ? 'text-[#FF5B00]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
