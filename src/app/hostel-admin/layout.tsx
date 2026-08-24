'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';
import { LogOut, LayoutDashboard, Users, UserCheck, Bell, Truck, Utensils } from 'lucide-react';
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
        router.push('/manager-login');
        return;
      }

      // Enforce ADMIN role (Hostel Admin)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (profile?.role !== 'ADMIN' && profile?.role !== 'OWNER') {
        router.push('/dashboard'); // Kick out non-admins
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
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Admin Portal...</div>;
  }

  const navItemClass = (path: string) => `flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
    pathname === path 
      ? 'bg-white shadow-sm text-slate-800' 
      : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
  }`;

  return (
    <div className="min-h-screen bg-slate-50 text-[#0D1D3A] flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-6 py-3 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/hostel-admin" className="flex items-center gap-4">
            <LunchBuddyLogo size="md" />
            <span className="hidden sm:block text-xs font-bold px-2 py-1 bg-slate-800 text-white rounded-md tracking-wider uppercase">Hostel Admin</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <Link href="/hostel-admin" className={navItemClass('/hostel-admin')}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link href="/hostel-admin/residents" className={navItemClass('/hostel-admin/residents')}>
              <Users size={16} /> Residents
            </Link>
            <Link href="/hostel-admin/vendors" className={navItemClass('/hostel-admin/vendors')}>
              <Truck size={16} /> Vendors
            </Link>
            <Link href="/hostel-admin/menus" className={navItemClass('/hostel-admin/menus')}>
              <Utensils size={16} /> Menus
            </Link>
            <Link href="/hostel-admin/approvals" className={navItemClass('/hostel-admin/approvals')}>
              <UserCheck size={16} /> Approvals
            </Link>
            <Link href="/hostel-admin/notifications" className={navItemClass('/hostel-admin/notifications')}>
              <Bell size={16} /> Notifications
            </Link>
          </nav>

          <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
