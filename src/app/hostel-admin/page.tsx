'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, UserCheck, UtensilsCrossed, PackageOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function HostelAdminDashboard() {
  const [stats, setStats] = useState({
    totalResidents: 0,
    pendingApprovals: 0,
    todayOrders: 0,
    pendingReturns: 0,
    collected: 0,
    pendingCollection: 0,
    returned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Get manager's property_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('property_id')
          .eq('id', session.user.id)
          .single();

        if (!profile?.property_id) {
          setLoading(false);
          return;
        }

        const propertyId = profile.property_id;

        // Approved residents count
        const { count: totalResidents } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'RESIDENT')
          .eq('property_id', propertyId)
          .eq('status', 'APPROVED');

        // Pending approvals count
        const { count: pendingApprovals } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'RESIDENT')
          .eq('property_id', propertyId)
          .eq('status', 'PENDING');

        // Today's meals
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const { data: todayMeals } = await supabase
          .from('meals')
          .select('status')
          .eq('property_id', propertyId)
          .gte('created_at', todayStart.toISOString());

        let todayOrders = 0;
        let collected = 0;
        let pendingCollection = 0;
        let returned = 0;
        let pendingReturns = 0;

        if (todayMeals) {
          todayOrders = todayMeals.filter(m => m.status !== 'CANCELLED').length;
          collected = todayMeals.filter(m => m.status === 'CONFIRMED' || m.status === 'DELIVERED').length;
          pendingCollection = todayMeals.filter(m => ['BOOKED', 'PREPARING', 'PACKED', 'ASSIGNED', 'DISPATCHED'].includes(m.status)).length;
          returned = todayMeals.filter(m => m.status === 'CONFIRMED').length;
          pendingReturns = todayMeals.filter(m => m.status === 'DELIVERED').length;
        }

        setStats({
          totalResidents: totalResidents || 0,
          pendingApprovals: pendingApprovals || 0,
          todayOrders,
          pendingReturns,
          collected,
          pendingCollection,
          returned,
        });

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-sans">
        <Loader2 size={36} className="animate-spin text-[#FF5B00] mb-3" />
        <span className="font-bold">Fetching live dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Hostel Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your residents and view tiffin operations.</p>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0D1D3A]">{stats.totalResidents}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Residents</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0D1D3A]">{stats.pendingApprovals}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Approvals</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0D1D3A]">{stats.todayOrders}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Today's Orders</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <PackageOpen size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0D1D3A]">{stats.pendingReturns}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Returns</div>
          </div>
        </div>
      </div>

      {/* DETAILED OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Actions Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-[#0D1D3A]">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link href="/hostel-admin/approvals" className="p-4 border border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-colors group">
              <div className="font-bold text-[#0D1D3A] group-hover:text-blue-700">Review Approvals</div>
              <div className="text-sm text-gray-500 mt-1">{stats.pendingApprovals} students waiting</div>
            </Link>
            <Link href="/hostel-admin/notifications" className="p-4 border border-slate-200 rounded-2xl hover:border-orange-400 hover:bg-orange-50 transition-colors group">
              <div className="font-bold text-[#0D1D3A] group-hover:text-orange-700">Send Notification</div>
              <div className="text-sm text-gray-500 mt-1">Alert residents</div>
            </Link>
            <Link href="/hostel-admin/residents" className="p-4 border border-slate-200 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-colors group">
              <div className="font-bold text-[#0D1D3A] group-hover:text-green-700">Manage Residents</div>
              <div className="text-sm text-gray-500 mt-1">View directory</div>
            </Link>
          </div>
        </div>

        {/* Today's Tiffin Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-[#0D1D3A]">Today's Tiffin Overview</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-700">Total Orders</span>
                <span className="font-black text-lg">{stats.todayOrders}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 border border-blue-100">
                <span className="font-bold text-blue-700">Collected by Students</span>
                <span className="font-black text-blue-700 text-lg">{stats.collected}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-orange-50 border border-orange-100">
                <span className="font-bold text-orange-700">Pending Collection</span>
                <span className="font-black text-orange-700 text-lg">{stats.pendingCollection}</span>
              </div>
              
              <div className="h-px w-full bg-slate-200 my-2"></div>
              
              <div className="flex justify-between items-center px-3 text-sm text-gray-500">
                <span>Boxes Returned: <strong className="text-gray-800">{stats.returned}</strong></span>
                <span>Pending Return: <strong className="text-gray-800">{stats.pendingReturns}</strong></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
