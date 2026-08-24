'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';
import { LogOut, Users, Utensils, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function HostelAdminLayout({
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

      // Enforce ADMIN or MANAGER role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
        if (profile?.role !== 'VENDOR' && profile?.role !== 'OWNER') {
          router.push('/dashboard'); // Kick out non-vendors
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
    return <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center">Loading Vendor Portal...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-[#0D1D3A] flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-6 py-3 border-b border-green-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/vendor-admin" className="flex items-center gap-4">
            <LunchBuddyLogo size="md" />
            <span className="hidden sm:block text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-md">Vendor Portal</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-[#F0FDF4] p-1.5 rounded-2xl border border-green-200 shadow-sm">
            <Link href="/vendor-admin" className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl hover:bg-green-100 text-green-900 transition-all">
              <BarChart size={16} /> Dashboard
            </Link>
            <Link href="/vendor-admin/orders" className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl hover:bg-green-100 text-green-900 transition-all">
              <Users size={16} /> Orders
            </Link>
            <Link href="/vendor-admin/scan" className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#0D1D3A] text-white hover:bg-[#1E3A8A] transition-all">
              <Utensils size={16} /> Scan QR
            </Link>
          </nav>

          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 pb-20">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 px-6 py-3 flex justify-around items-center z-50 pb-safe">
        <Link href="/vendor-admin" className={`flex flex-col items-center gap-1 ${pathname === '/vendor-admin' ? 'text-green-700' : 'text-gray-400'}`}>
          <BarChart size={20} />
          <span className="text-[10px] font-bold">Dashboard</span>
        </Link>
        <Link href="/vendor-admin/orders" className={`flex flex-col items-center gap-1 ${pathname === '/vendor-admin/orders' ? 'text-green-700' : 'text-gray-400'}`}>
          <Users size={20} />
          <span className="text-[10px] font-bold">Orders</span>
        </Link>
        <Link href="/vendor-admin/scan" className={`flex flex-col items-center gap-1 ${pathname === '/vendor-admin/scan' ? 'text-blue-700' : 'text-gray-400'}`}>
          <Utensils size={20} />
          <span className="text-[10px] font-bold">Scan QR</span>
        </Link>
      </div>
    </div>
  );
}
