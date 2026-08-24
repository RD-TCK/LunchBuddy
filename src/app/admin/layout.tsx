'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LunchBuddyLogo } from '@/components/LunchBuddyLogo';
import { LogOut, LayoutDashboard, Building2, Users, PackageOpen, Bell, FileText, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SuperAdminLayout({
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

      // Enforce OWNER role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (profile?.role !== 'OWNER') {
        router.push('/dashboard');
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
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading Platform Admin...</div>;
  }

  const navItemClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + '/');
    return `flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
      isActive ? 'bg-[#0D1D3A] text-white shadow-sm' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
    }`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0D1D3A] flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-6 py-3 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-4">
            <LunchBuddyLogo size="md" />
            <span className="hidden sm:flex items-center gap-1 text-xs font-bold px-2 py-1 bg-[#0D1D3A] text-white rounded-md tracking-widest uppercase">
              Platform Admin
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            <Link href="/admin" className={pathname === '/admin' ? navItemClass('/admin') : 'hover:bg-gray-100 text-gray-600 flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl'}>
              <LayoutDashboard size={16} /> Global Stats
            </Link>
            <Link href="/admin/users" className={navItemClass('/admin/users')}>
              <Users size={16} /> Users
            </Link>
            <Link href="/admin/organizations" className={navItemClass('/admin/organizations')}>
              <Building2 size={16} /> Organizations
            </Link>
            <Link href="/admin/tiffin-ops" className={navItemClass('/admin/tiffin-ops')}>
              <PackageOpen size={16} /> Tiffin Ops
            </Link>
            <Link href="/admin/notifications" className={navItemClass('/admin/notifications')}>
              <Bell size={16} /> Broadcast
            </Link>
            <Link href="/admin/audit" className={navItemClass('/admin/audit')}>
              <Activity size={16} /> Audit Logs
            </Link>
          </nav>

          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
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
