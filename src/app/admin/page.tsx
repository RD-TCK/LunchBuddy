'use client';

import { Users, Building2, PackageOpen, LayoutDashboard, ShieldCheck, Truck, BellRing } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  
  // Real implementation would fetch these from an aggregate RPC, 
  // but we'll mock them briefly for the UI setup.
  const stats = {
    totalUsers: 1450,
    students: 1400,
    hostelAdmins: 35,
    vendors: 15,
    hostels: 42,
    colleges: 5,
    todayOrders: 1250,
    collected: 1100,
    returned: 950,
    activeNotifs: 3
  };

  useEffect(() => {
    // Mock network delay
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Platform Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Global overview of LunchBuddy operations.</p>
        </div>
      </div>

      {/* TOP TIER STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0D1D3A]">{loading ? '-' : stats.totalUsers}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Users</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-300 transition-colors">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0D1D3A]">{loading ? '-' : stats.hostels}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Hostels</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-orange-300 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0D1D3A]">{loading ? '-' : stats.vendors}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Vendors</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-purple-300 transition-colors">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
            <PackageOpen size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0D1D3A]">{loading ? '-' : stats.todayOrders}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Today's Orders</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PLATFORM HEALTH */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#0D1D3A] mb-4">Today's Tiffin Flow (Platform-Wide)</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-black text-slate-700">{stats.todayOrders}</div>
                <div className="text-xs font-bold text-gray-500 uppercase mt-1">Total Orders</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 bg-blue-500 w-[88%]"></div>
                <div className="text-3xl font-black text-blue-700">{stats.collected}</div>
                <div className="text-xs font-bold text-blue-500 uppercase mt-1">Collected</div>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 bg-green-500 w-[76%]"></div>
                <div className="text-3xl font-black text-green-700">{stats.returned}</div>
                <div className="text-xs font-bold text-green-600 uppercase mt-1">Boxes Returned</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <Link href="/admin/users" className="bg-[#0D1D3A] p-6 rounded-3xl shadow-lg text-white group hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-1">User Management</h3>
                <p className="text-blue-200 text-sm">Control roles, suspend accounts, and view all profiles.</p>
             </Link>
             
             <Link href="/admin/organizations" className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm group hover:-translate-y-1 hover:border-slate-300 transition-all">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#0D1D3A] mb-1">Organizations</h3>
                <p className="text-gray-500 text-sm">Manage Colleges and Hostels architecture.</p>
             </Link>
          </div>
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0D1D3A]">System Alerts</h2>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">{stats.activeNotifs} Active</span>
            </div>
            <div className="p-0 flex-1">
              <div className="divide-y divide-slate-50">
                <div className="p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <BellRing className="text-orange-500 shrink-0 mt-0.5" size={16} />
                  <div>
                    <div className="text-sm font-bold text-gray-800">Unusual Box Return Rate</div>
                    <div className="text-xs text-gray-500 mt-1">Hostel B (NIET) is reporting 45% unreturned boxes.</div>
                  </div>
                </div>
                <div className="p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <BellRing className="text-blue-500 shrink-0 mt-0.5" size={16} />
                  <div>
                    <div className="text-sm font-bold text-gray-800">New Vendor Request</div>
                    <div className="text-xs text-gray-500 mt-1">A new vendor account requires approval.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <Link href="/admin/notifications" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center w-full">
                View All Alerts &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
