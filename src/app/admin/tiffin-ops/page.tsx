'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PackageOpen, Clock, CheckCircle2, AlertCircle, Box } from 'lucide-react';

export default function GlobalTiffinOpsPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalMeals();
  }, []);

  const fetchGlobalMeals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('meals')
      .select(`
        id,
        status,
        created_at,
        collected_at,
        returned_at,
        profiles(name, role),
        properties(name, colleges(name)),
        menus(title, type)
      `)
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (data) setMeals(data);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold">PENDING COLLECTION</span>;
      case 'COLLECTED': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">COLLECTED</span>;
      case 'RETURNED': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">RETURNED</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Global Tiffin Operations</h1>
        <p className="text-gray-500 font-medium mt-1">Platform-wide overview of all orders, collections, and box returns.</p>
      </div>

      {/* Global Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-[#0D1D3A]">{loading ? '-' : meals.length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</div>
          </div>
          <PackageOpen className="text-slate-300" size={32} />
        </div>
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-orange-400 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-orange-500">{loading ? '-' : meals.filter(m => m.status === 'PENDING').length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Collection</div>
          </div>
          <Clock className="text-orange-200" size={32} />
        </div>
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-blue-400 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-blue-500">{loading ? '-' : meals.filter(m => m.status === 'COLLECTED').length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Box Return</div>
          </div>
          <AlertCircle className="text-blue-200" size={32} />
        </div>
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-green-400 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-green-500">{loading ? '-' : meals.filter(m => m.status === 'RETURNED').length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Boxes Returned</div>
          </div>
          <CheckCircle2 className="text-green-200" size={32} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="text-sm font-bold text-slate-600">Recent Platform Activity (Last 100 Orders)</div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Location (College/Hostel)</th>
                <th className="px-6 py-4">Meal Details</th>
                <th className="px-6 py-4">Timestamps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading global ops...</td>
                </tr>
              ) : meals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders found on the platform.</td>
                </tr>
              ) : (
                meals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {getStatusBadge(meal.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0D1D3A]">{meal.profiles?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{meal.properties?.colleges?.name || 'Unknown College'}</div>
                      <div className="text-xs text-slate-500">{meal.properties?.name || 'Unknown Hostel'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{meal.menus?.type}</div>
                      <div className="text-xs text-slate-500">{meal.menus?.title}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      <div><span className="text-gray-400">Ord:</span> {new Date(meal.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      {meal.collected_at && <div><span className="text-blue-400">Col:</span> {new Date(meal.collected_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>}
                      {meal.returned_at && <div><span className="text-green-400">Ret:</span> {new Date(meal.returned_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
