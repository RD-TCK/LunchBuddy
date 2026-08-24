'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { History, Loader2, Utensils, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function BookingHistoryPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('meals')
        .select('*, menus(date, type, title, description), colleges(name)')
        .eq('resident_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) setMeals(data);
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusIcon = (s: string) => {
    if (s === 'PENDING' || s === 'BOOKED') return <Clock size={16} className="text-orange-500" />;
    if (s === 'DELIVERED' || s === 'COLLECTED') return <Utensils size={16} className="text-blue-500" />;
    if (s === 'CONFIRMED' || s === 'RETURNED') return <CheckCircle2 size={16} className="text-green-500" />;
    if (s === 'CANCELLED') return <XCircle size={16} className="text-red-500" />;
    return <Clock size={16} className="text-gray-400" />;
  };

  const statusLabel = (s: string) => {
    if (s === 'PENDING' || s === 'BOOKED') return 'Booked';
    if (s === 'DELIVERED' || s === 'COLLECTED') return 'Delivered';
    if (s === 'CONFIRMED' || s === 'RETURNED') return 'Returned';
    if (s === 'CANCELLED') return 'Cancelled';
    return s;
  };

  const statusBadgeClass = (s: string) => {
    if (s === 'PENDING' || s === 'BOOKED') return 'bg-orange-100 text-orange-800';
    if (s === 'DELIVERED' || s === 'COLLECTED') return 'bg-blue-100 text-blue-800';
    if (s === 'CONFIRMED' || s === 'RETURNED') return 'bg-green-100 text-green-800';
    if (s === 'CANCELLED') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-sans">
        <Loader2 size={36} className="animate-spin text-[#FF5B00] mb-3" />
        <span className="font-bold">Loading booking history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0D1D3A] flex items-center gap-2">
          <History size={28} className="text-[#FF5B00]" /> Booking History
        </h1>
        <p className="text-gray-500 font-medium mt-1">Your past and upcoming meal bookings.</p>
      </div>

      {meals.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils size={32} />
          </div>
          <p className="font-bold text-lg text-slate-600">No Bookings Yet</p>
          <p className="text-sm text-gray-400 mt-1">Book your first meal from the Home page.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {meals.map(meal => {
              const menuDate = meal.menus?.date ? new Date(meal.menus.date) : null;
              return (
                <div key={meal.id} className="p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  {/* Date Block */}
                  {menuDate && (
                    <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-xl flex flex-col items-center justify-center shrink-0 border border-slate-200">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {menuDate.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black text-[#0D1D3A]">
                        {menuDate.getDate()}
                      </span>
                    </div>
                  )}

                  {/* Meal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-black tracking-wider uppercase ${
                        meal.menus?.type === 'LUNCH' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {meal.menus?.type || 'MEAL'}
                      </span>
                      {meal.colleges?.name && (
                        <span className="text-[10px] text-gray-400 font-medium truncate">→ {meal.colleges.name}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-[#0D1D3A] text-sm truncate">{meal.menus?.title}</h3>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {statusIcon(meal.status)}
                    <span className={`text-[10px] px-2 py-0.5 rounded font-black ${statusBadgeClass(meal.status)}`}>
                      {statusLabel(meal.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
