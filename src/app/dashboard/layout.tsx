'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';
import { LogOut, LayoutDashboard, History, User } from 'lucide-react';
import Link from 'next/link';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (profile?.role === 'OWNER') {
        router.push('/admin');
        return;
      } else if (profile?.role === 'ADMIN') {
        router.push('/hostel-admin');
        return;
      } else if (profile?.role === 'VENDOR') {
        router.push('/vendor-admin');
        return;
      }
      setLoading(false);
    };
    
    checkRole();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center">Loading Student Portal...</div>;
  }

  const navItemClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
      isActive 
        ? 'bg-[#0D1D3A] text-white shadow-sm'
        : 'hover:bg-white text-gray-600 hover:text-[#0D1D3A] hover:shadow-sm'
    }`;
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#0D1D3A] flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-3 border-b border-orange-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4">
            <LunchBuddyLogo size="md" />
            <span className="hidden sm:block text-xs font-bold px-2 py-1 bg-orange-100 text-[#FF5B00] rounded-md uppercase tracking-wider">Resident</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-orange-50/50 p-1.5 rounded-2xl border border-orange-100/50 shadow-sm">
            <Link href="/dashboard" className={navItemClass('/dashboard')}>
              <LayoutDashboard size={16} /> Home
            </Link>
            <Link href="/dashboard/history" className={navItemClass('/dashboard/history')}>
              <History size={16} /> History
            </Link>
            <Link href="/dashboard/profile" className={navItemClass('/dashboard/profile')}>
              <User size={16} /> Profile
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/profile" className="p-2 text-gray-500 hover:text-[#0D1D3A] hover:bg-orange-50 rounded-xl transition-colors">
              <User size={18} />
            </Link>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 pb-safe">
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-[#0D1D3A]' : 'text-gray-400'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/dashboard/history" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/history' ? 'text-[#0D1D3A]' : 'text-gray-400'}`}>
          <History size={20} />
          <span className="text-[10px] font-bold">History</span>
        </Link>
        <Link href="/dashboard/profile" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/profile' ? 'text-[#FF5B00]' : 'text-gray-400'}`}>
          <User size={20} />
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>
    </div>
  );
}
