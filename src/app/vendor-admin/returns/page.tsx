'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertCircle, Clock } from 'lucide-react';

export default function PendingReturnsPage() {
  const [pendingReturns, setPendingReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingReturns = async () => {
      // Fetch meals where status is COLLECTED (meaning they have the box, but haven't returned it)
      const { data, error } = await supabase
        .from('meals')
        .select(`
          id,
          collected_at,
          profiles(name, room_number),
          properties(name)
        `)
        .eq('status', 'COLLECTED')
        .order('collected_at', { ascending: true });
        
      if (data) {
        setPendingReturns(data);
      }
      setLoading(false);
    };
    
    fetchPendingReturns();
  }, []);

  const calculateTimePending = (collectedAt: string) => {
    if (!collectedAt) return 'Unknown';
    const collected = new Date(collectedAt);
    const now = new Date();
    const diffMs = now.getTime() - collected.getTime();
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `${days} days ${diffHours % 24} hrs`;
    }
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m`;
    }
    return `${diffMins} minutes`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Pending Box Returns</h1>
          <p className="text-gray-500 font-medium mt-1">Students who collected food but haven't returned the tiffin box.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <AlertCircle size={20} />
            <span>{pendingReturns.length} Tiffins Outstanding</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Collection Time</th>
                <th className="px-6 py-4">Pending Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading pending returns...</td>
                </tr>
              ) : pendingReturns.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">All boxes returned! Awesome.</td>
                </tr>
              ) : (
                pendingReturns.map((meal) => (
                  <tr key={meal.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0D1D3A]">{meal.profiles?.name || 'Unknown Student'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{meal.properties?.name || 'Unassigned Hostel'}</div>
                      <div className="text-xs text-gray-500">Room {meal.profiles?.room_number || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {meal.collected_at ? new Date(meal.collected_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-orange-600 font-bold bg-orange-50 px-3 py-1.5 rounded-lg inline-flex">
                        <Clock size={14} />
                        {calculateTimePending(meal.collected_at)}
                      </div>
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
