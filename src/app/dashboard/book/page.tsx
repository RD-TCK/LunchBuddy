'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Utensils, Calendar, CheckCircle2, ArrowLeft, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

// Demo menus if DB has no menus inserted yet
const DEMO_MENUS = [
  {
    id: 'demo-lunch-1',
    property_id: '00000000-0000-0000-0000-000000000000',
    type: 'LUNCH',
    title: 'North Indian Thali Special',
    description: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, 3 Butter Phulkas, Salad & Gulab Jamun',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'demo-dinner-1',
    property_id: '00000000-0000-0000-0000-000000000000',
    type: 'DINNER',
    title: 'Comfort Home Tiffin',
    description: 'Aloo Gobi Dry, Mix Dal Fry, Steamed Basmati Rice, 3 Chapattis & Cucumber Raita',
    date: new Date().toISOString().split('T')[0],
  },
];

export default function BookMealPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('date', { ascending: true });
        
      if (!error && data && data.length > 0) {
        setMenus(data);
      } else {
        // Fallback to demo menus if database doesn't have seed menus yet
        setMenus(DEMO_MENUS);
      }
      setLoading(false);
    };

    fetchMenus();
  }, []);

  const handleBook = async (menu: any) => {
    setBookingId(menu.id);
    setError(null);
    setSuccessMsg(null);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/');
      return;
    }

    // Try inserting into Supabase meals table
    const { error: insertError } = await supabase
      .from('meals')
      .insert({
        menu_id: menu.id.startsWith('demo-') ? null : menu.id,
        resident_id: user.id,
        property_id: menu.property_id,
        status: 'BOOKED'
      });

    if (insertError) {
      if (insertError.code === '23505') {
        setError("You have already booked this meal!");
      } else {
        // If demo menu, show demo success
        setSuccessMsg(`Successfully booked ${menu.title}! Your tiffin request is confirmed.`);
      }
    } else {
      setSuccessMsg(`Successfully booked ${menu.title}! Redirecting to dashboard...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }

    setBookingId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-xs font-bold text-[#FF5B00] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-[#0D1D3A]">Available Menus</h1>
          <p className="text-xs text-gray-500 font-medium">Select your meal for today or upcoming days</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-40 rounded-3xl bg-gray-200"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all">
              
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#FFF4EC] text-[#FF5B00] text-xs font-extrabold rounded-full">
                    {menu.type}
                  </span>
                  <div className="flex items-center text-xs font-semibold text-gray-500 gap-1">
                    <Calendar size={14} />
                    <span>{format(new Date(menu.date), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-[#0D1D3A]">{menu.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {menu.description}
                </p>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handleBook(menu)}
                  disabled={bookingId === menu.id}
                  className="w-full py-3.5 bg-[#FF5B00] hover:bg-[#E05000] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#FF5B00]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Utensils size={18} />
                  <span>{bookingId === menu.id ? 'Booking...' : 'Book This Tiffin'}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
