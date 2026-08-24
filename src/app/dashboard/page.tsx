'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Calendar, UtensilsCrossed, ClipboardCheck, User, QrCode, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('there');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        if (user.email) {
          setUserName(user.email.split('@')[0]);
        }

        const { data, error } = await supabase
          .from('meals')
          .select(`
            id,
            status,
            qr_token,
            created_at,
            menus (
              title,
              type,
              date
            )
          `)
          .eq('resident_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setMeals(data);
        }
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Poster Style Greeting Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1D3A]">
            Hi {userName}! 👋
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            What would you like to do today?
          </p>
        </div>

        <Link
          href="/dashboard/book"
          className="px-5 py-3 bg-[#FF5B00] hover:bg-[#E05000] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#FF5B00]/25 transition-all flex items-center gap-2"
        >
          <Calendar size={18} />
          <span>Book Today's Meal</span>
        </Link>
      </div>

      {/* 4 Action Grid Cards (Matching Poster Mobile Interface) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Book Meal */}
        <Link href="/dashboard/book" className="group">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#FF5B00]/50 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4EC] text-[#FF5B00] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#0D1D3A]">Book Meal</div>
              <div className="text-xs font-medium text-gray-400 mt-0.5">Book your meals in advance</div>
            </div>
          </div>
        </Link>

        {/* Card 2: My Meals */}
        <div className="bg-white p-5 rounded-3xl border-2 border-[#22C55E] shadow-md space-y-3 relative">
          <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <div className="text-base font-extrabold text-[#0D1D3A]">My Meals</div>
            <div className="text-xs font-medium text-gray-400 mt-0.5">View your booked meals</div>
          </div>
          <span className="absolute top-3 right-3 flex h-2.5 w-2.5 rounded-full bg-[#22C55E]"></span>
        </div>

        {/* Card 3: Orders */}
        <Link href="/dashboard/orders" className="group">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#0D1D3A]">Orders</div>
              <div className="text-xs font-medium text-gray-400 mt-0.5">Track your orders live</div>
            </div>
          </div>
        </Link>

        {/* Card 4: Profile */}
        <Link href="/dashboard/profile" className="group">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-500/50 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#0D1D3A]">Profile</div>
              <div className="text-xs font-medium text-gray-400 mt-0.5">Update your information</div>
            </div>
          </div>
        </Link>

      </div>

      {/* Booked Meals List / Tracking Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#0D1D3A] flex items-center gap-2">
            <span>Your Meal Bookings & Status</span>
          </h2>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-28 rounded-3xl bg-gray-200"></div>
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#FFF4EC] text-[#FF5B00] rounded-full flex items-center justify-center">
              <UtensilsCrossed size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[#0D1D3A]">No meals booked yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Select from today's fresh menu to get your tiffin delivered directly to your room!
              </p>
            </div>
            <div>
              <Link
                href="/dashboard/book"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5B00] text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#E05000] transition-all"
              >
                <span>Book Your First Meal</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {meals.map((meal) => (
              <div key={meal.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#FFF4EC] text-[#FF5B00] text-xs font-bold rounded-full">
                    {meal.menus?.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold 
                    ${meal.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                      meal.status === 'PREPARING' ? 'bg-amber-100 text-amber-700' : 
                      'bg-blue-100 text-blue-700'}`}>
                    {meal.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-[#0D1D3A]">{meal.menus?.title || 'Daily Tiffin Special'}</h3>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{meal.menus?.date ? format(new Date(meal.menus.date), 'EEEE, MMM d, yyyy') : 'Today'}</span>
                  </div>
                </div>

                {/* QR Code Identification Pill */}
                <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-gray-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#0D1D3A] font-bold">
                    <QrCode size={18} className="text-[#FF5B00]" />
                    <span>QR Token: {meal.qr_token ? meal.qr_token.slice(0, 8) : 'GEN-8832'}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Scan on Delivery</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
