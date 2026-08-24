'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Utensils, CheckCircle2, Box, AlertCircle, Clock, Search, MapPin, Loader2, RefreshCw } from 'lucide-react';

interface Stats {
  total: number;
  pending: number;
  delivered: number;
  confirmed: number;
  unreturned: number;
}

export default function VendorDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0, pending: 0, delivered: 0, confirmed: 0, unreturned: 0,
  });
  const [todayOrders, setTodayOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual Lookup State
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: prof } = await supabase
      .from('profiles')
      .select('*, colleges(name), properties(name)')
      .eq('id', session.user.id)
      .single();
    
    setProfile(prof);

    if (prof?.property_id) {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch all today's meals for this vendor's property
      const { data: meals } = await supabase
        .from('meals')
        .select(`id, status, qr_token, resident_id, delivery_college_id, profiles!resident_id(name, room_number), menus!inner(date, title, type), colleges(name)`)
        .eq('property_id', prof.property_id)
        .eq('menus.date', today);

      if (meals) {
        // Filter for this vendor's college if assigned
        const relevantMeals = prof.delivery_college_id 
          ? meals.filter(m => m.delivery_college_id === prof.delivery_college_id)
          : meals;

        const total = relevantMeals.length;
        const pending = relevantMeals.filter(m => m.status === 'PENDING' || m.status === 'BOOKED').length;
        const delivered = relevantMeals.filter(m => m.status === 'DELIVERED' || m.status === 'COLLECTED').length;
        const confirmed = relevantMeals.filter(m => m.status === 'CONFIRMED' || m.status === 'RETURNED').length;
        
        setStats({ total, pending, delivered, confirmed, unreturned: delivered });
        setTodayOrders(relevantMeals);
      }
    }
    setLoading(false);
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim()) return;
    
    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    // Try to find by resident_code OR by qr_token
    let resident: any = null;
    let meal: any = null;

    // First try resident_code
    const { data: res } = await supabase
      .from('profiles')
      .select('id, name, resident_code, properties(name)')
      .eq('resident_code', lookupCode.toUpperCase())
      .maybeSingle();

    if (res) {
      resident = res;
      const today = new Date().toISOString().split('T')[0];
      const { data: m } = await supabase
        .from('meals')
        .select(`id, status, qr_token, delivery_college_id, colleges(name), menus!inner(title, date, type)`)
        .eq('resident_id', res.id)
        .eq('menus.date', today)
        .maybeSingle();
      meal = m;
    } else {
      // Try qr_token lookup
      const { data: m } = await supabase
        .from('meals')
        .select(`id, status, qr_token, delivery_college_id, profiles!resident_id(name, room_number, resident_code, properties(name)), menus(title, date, type), colleges(name)`)
        .eq('qr_token', lookupCode.trim())
        .maybeSingle();
      
      if (m) {
        const mealAny = m as any;
        resident = { 
          name: mealAny.profiles?.name, 
          resident_code: mealAny.profiles?.resident_code, 
          properties: mealAny.profiles?.properties 
        };
        meal = m;
      }
    }

    if (!resident) {
      setLookupError('Student not found. Check the ID or QR token.');
      setLookupLoading(false);
      return;
    }

    if (!meal) {
      setLookupResult({ resident, status: 'NO_MEAL', message: 'No meal booked for today.' });
    } else {
      setLookupResult({
        resident,
        meal,
        isWrongCollege: profile?.delivery_college_id && profile.delivery_college_id !== meal.delivery_college_id
      });
    }
    
    setLookupLoading(false);
  };

  const handleManualAction = async (action: 'DELIVERED' | 'CONFIRMED') => {
    if (!lookupResult?.meal?.id) return;
    
    const updateData: any = { status: action };
    const { data: { session } } = await supabase.auth.getSession();
    
    if (action === 'DELIVERED') {
      updateData.collected_at = new Date().toISOString();
      updateData.collected_by = session?.user.id;
    } else {
      updateData.returned_at = new Date().toISOString();
      updateData.returned_to = session?.user.id;
    }

    const { error } = await supabase
      .from('meals')
      .update(updateData)
      .eq('id', lookupResult.meal.id);

    if (!error) {
      setLookupResult({
        ...lookupResult,
        meal: { ...lookupResult.meal, status: action }
      });
      fetchStats();
    }
  };

  const canHandOver = (s: string) => s === 'PENDING' || s === 'BOOKED';
  const canReturn = (s: string) => s === 'DELIVERED' || s === 'COLLECTED';
  const isDone = (s: string) => s === 'CONFIRMED' || s === 'RETURNED';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-sans">
        <Loader2 size={36} className="animate-spin text-green-600 mb-3" />
        <span className="font-bold">Loading Vendor Dashboard...</span>
      </div>
    );
  }

  if (!profile?.property_id) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center bg-white p-8 rounded-3xl border border-red-200">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-[#0D1D3A] mb-2">No Property Assigned</h2>
        <p className="text-gray-500">Your manager has not assigned you to a property yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Vendor Dashboard</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-3 py-1 bg-orange-100 text-[#FF5B00] rounded-lg font-bold text-sm flex items-center gap-1">
              <MapPin size={14} /> {profile.colleges?.name || 'All Routes'}
            </span>
            <span className="text-gray-500 font-medium text-sm">Today's Deliveries</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStats} 
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw size={18} />
          </button>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm font-bold text-[#0D1D3A]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-gray-800 shadow-sm">
          <div className="text-sm font-bold text-gray-500 mb-2">Total Orders</div>
          <div className="text-3xl font-black text-[#0D1D3A]">{stats.total}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-orange-400 shadow-sm">
          <div className="text-sm font-bold text-gray-500 mb-2">Pending Drop-off</div>
          <div className="text-3xl font-black text-orange-500">{stats.pending}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-blue-400 shadow-sm">
          <div className="text-sm font-bold text-gray-500 mb-2">Handed Over</div>
          <div className="text-3xl font-black text-blue-500">{stats.delivered}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-green-500 shadow-sm">
          <div className="text-sm font-bold text-gray-500 mb-2">Boxes Returned</div>
          <div className="text-3xl font-black text-green-600">{stats.confirmed}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-red-500 shadow-sm">
          <div className="text-sm font-bold text-gray-500 mb-2">Unreturned</div>
          <div className="text-3xl font-black text-red-500">{stats.unreturned}</div>
        </div>
      </div>

      {/* TODAY'S ORDER LIST */}
      {todayOrders.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <span className="text-sm font-bold text-slate-600">Today's Orders ({todayOrders.length})</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
            {todayOrders.map(order => (
              <div key={order.id} className="px-6 py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-[#0D1D3A]">{order.profiles?.name}</span>
                  <span className="text-gray-400 ml-2 text-xs">Room {order.profiles?.room_number || '?'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{order.colleges?.name || '—'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                    canHandOver(order.status) ? 'bg-orange-100 text-orange-800' :
                    canReturn(order.status) ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANUAL LOOKUP TOOL */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 bg-slate-50 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-[#0D1D3A] mb-2">Manual Verification</h2>
          <p className="text-sm text-gray-500 mb-6">Enter student ID (e.g. SPG-1000) or paste their QR token.</p>
          
          <form onSubmit={handleLookup} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                required
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="Student ID or QR Token"
                className="w-full pl-10 pr-4 py-3 text-sm font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={lookupLoading}
              className="w-full py-3 bg-[#0D1D3A] hover:bg-[#1E3A8A] text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {lookupLoading ? 'Searching...' : 'Check Status'}
            </button>
          </form>
          
          {lookupError && (
            <div className="mt-4 p-3 text-xs font-bold text-red-600 bg-red-50 rounded-xl">
              {lookupError}
            </div>
          )}
        </div>

        <div className="p-8 flex-1">
          {!lookupResult ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4 min-h-[200px]">
              <Search size={48} />
              <p className="text-sm font-bold">Search results will appear here</p>
            </div>
          ) : lookupResult.status === 'NO_MEAL' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <AlertCircle size={48} className="text-orange-400" />
              <h3 className="text-xl font-bold text-[#0D1D3A]">{lookupResult.resident.name}</h3>
              <p className="text-gray-500 font-bold bg-gray-100 px-4 py-2 rounded-lg">{lookupResult.message}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0D1D3A]">{lookupResult.resident.name}</h3>
                  <div className="text-sm font-bold text-gray-500 mt-1">Hostel: {lookupResult.resident.properties?.name}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Menu</span>
                    <span className="font-bold text-[#0D1D3A]">{lookupResult.meal.menus?.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
                    <span className="font-black text-[#FF5B00] bg-orange-100 px-2 py-1 rounded">
                      {lookupResult.meal.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                {canHandOver(lookupResult.meal.status) && (
                  <button onClick={() => handleManualAction('DELIVERED')} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <CheckCircle2 size={20} /> Confirm & Hand Over Tiffin
                  </button>
                )}
                {canReturn(lookupResult.meal.status) && (
                  <button onClick={() => handleManualAction('CONFIRMED')} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <Box size={20} /> Confirm Box Return
                  </button>
                )}
                {isDone(lookupResult.meal.status) && (
                  <div className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl text-center">
                    Process Complete ✓
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
