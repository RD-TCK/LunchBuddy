'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Clock, CheckCircle2, AlertCircle, Utensils, Bell, Info, User, MapPin, Loader2, Sparkles, Copy, XCircle, Lock, CalendarDays } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [todayMeal, setTodayMeal] = useState<any>(null);
  const [tomorrowMeal, setTomorrowMeal] = useState<any>(null);
  const [tomorrowTemplate, setTomorrowTemplate] = useState<any>(null);
  const [weeklyMenu, setWeeklyMenu] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Tomorrow dates
  const [tomorrowDayName, setTomorrowDayName] = useState('');
  const [tomorrowStr, setTomorrowStr] = useState('');

  // 10 PM cutoff check
  const isAfter10PM = new Date().getHours() >= 22;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Fetch Profile and Status
      const { data: prof } = await supabase
        .from('profiles')
        .select('*, properties(name), colleges(name)')
        .eq('id', session.user.id)
        .single();
      
      setProfile(prof);

      // If they aren't approved yet, we can stop here.
      if (prof?.status === 'PENDING') {
        setLoading(false);
        return;
      }

      // Calculate tomorrow's info
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
      const tStr = tomorrow.toISOString().split('T')[0];
      setTomorrowDayName(dayName);
      setTomorrowStr(tStr);

      const todayStr = new Date().toISOString().split('T')[0];

      // 2. Fetch Today's Meal
      const { data: tMeal } = await supabase
        .from('meals')
        .select('*, menus!inner(*)')
        .eq('resident_id', session.user.id)
        .eq('menus.date', todayStr)
        .maybeSingle();

      setTodayMeal(tMeal);

      // 3. Fetch Tomorrow's Meal
      const { data: tomMeal } = await supabase
        .from('meals')
        .select('*, menus!inner(*)')
        .eq('resident_id', session.user.id)
        .eq('menus.date', tStr)
        .maybeSingle();

      setTomorrowMeal(tomMeal);

      // 4. Fetch Tomorrow's Weekly Menu Template (if not booked)
      if (!tomMeal && prof?.property_id) {
        const { data: temp } = await supabase
          .from('weekly_menus')
          .select('*')
          .eq('property_id', prof.property_id)
          .eq('day_of_week', dayName)
          .eq('type', 'LUNCH')
          .maybeSingle();
        setTomorrowTemplate(temp);
      }

      // 5. Fetch Full Weekly Menu for this hostel
      if (prof?.property_id) {
        const { data: wMenu } = await supabase
          .from('weekly_menus')
          .select('*')
          .eq('property_id', prof.property_id)
          .eq('type', 'LUNCH');
        if (wMenu) {
          const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          setWeeklyMenu(wMenu.sort((a, b) => order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week)));
        }
      }

      // 6. Fetch Colleges List
      const { data: cols } = await supabase.from('colleges').select('*').order('name');
      if (cols) setColleges(cols);

      // 7. Fetch Announcements
      if (prof?.property_id) {
        const { data: notifs } = await supabase
          .from('notifications')
          .select('*')
          .eq('property_id', prof.property_id)
          .order('created_at', { ascending: false })
          .limit(3);
        if (notifs) setNotifications(notifs);
      }

    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTomorrow = async () => {
    if (isAfter10PM) {
      alert("Booking is locked after 10:00 PM. Please try before 10 PM.");
      return;
    }
    if (!selectedCollegeId) {
      alert("Please select a delivery location first!");
      return;
    }

    setIsBooking(true);

    try {
      // 1. Get or create tomorrow's menu row
      let menuId = '';
      const { data: existingMenu } = await supabase
        .from('menus')
        .select('id')
        .eq('property_id', profile.property_id)
        .eq('date', tomorrowStr)
        .eq('type', 'LUNCH')
        .maybeSingle();

      if (existingMenu) {
        menuId = existingMenu.id;
      } else {
        const { data: newMenu, error: menuErr } = await supabase
          .from('menus')
          .insert({
            property_id: profile.property_id,
            date: tomorrowStr,
            type: 'LUNCH',
            title: tomorrowTemplate?.title || "Daily Lunch",
            description: tomorrowTemplate?.description || "Standard hostel lunch."
          })
          .select('id')
          .single();

        if (menuErr) throw menuErr;
        menuId = newMenu.id;
      }

      // 2. Insert meal booking (status defaults to PENDING in DB)
      const { error: mealErr } = await supabase
        .from('meals')
        .insert({
          property_id: profile.property_id,
          menu_id: menuId,
          resident_id: profile.id,
          delivery_college_id: selectedCollegeId,
        });

      if (mealErr) throw mealErr;

      fetchDashboardData();

    } catch (err: any) {
      alert("Booking failed: " + err.message);
    } finally {
      setIsBooking(false);
    }
  };

  const handleUnbookTomorrow = async () => {
    if (!tomorrowMeal) return;
    if (isAfter10PM) {
      alert("Cannot cancel after 10:00 PM.");
      return;
    }
    if (!confirm("Are you sure you want to cancel tomorrow's lunch booking?")) return;
    
    setIsCancelling(true);
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', tomorrowMeal.id);
      
      if (error) throw error;
      fetchDashboardData();
    } catch (err: any) {
      alert("Failed to cancel: " + err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    alert('Token copied!');
  };

  const canHandOver = (s: string) => s === 'PENDING' || s === 'BOOKED';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-sans">
        <Loader2 size={36} className="animate-spin text-[#FF5B00] mb-3" />
        <span className="font-bold">Loading dashboard...</span>
      </div>
    );
  }

  // --- ACCOUNT PENDING STATE ---
  if (profile?.status === 'PENDING') {
    return (
      <div className="max-w-2xl mx-auto mt-12 font-sans">
        <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-sm text-center space-y-4">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto">
            <Clock size={40} />
          </div>
          <h1 className="text-2xl font-black text-[#0D1D3A]">Account Under Review</h1>
          <p className="text-gray-600">
            Your registration for <strong>{profile.properties?.name || 'your hostel'}</strong> is pending approval from your Hostel Admin.
          </p>
          <div className="p-4 bg-orange-50 text-orange-800 text-sm font-bold rounded-xl inline-block mt-4">
            You will be able to book meals and view your QR code once approved.
          </div>
        </div>
      </div>
    );
  }

  // --- APPROVED STATE ---
  return (
    <div className="space-y-8 pb-16 font-sans">
      
      <div>
        <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Hi, {profile?.name?.split(' ')[0] || 'Resident'}! 👋</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your lunch bookings and view delivery status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER COLS: TODAY & TOMORROW */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TODAY'S TIFFIN STATUS */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#0D1D3A] flex items-center gap-2">
              <Utensils size={18} className="text-[#FF5B00]" /> Today's Tiffin
            </h2>
            {todayMeal ? (
              <div className={`rounded-3xl border-2 shadow-sm overflow-hidden relative transition-all duration-300
                ${canHandOver(todayMeal.status) ? 'bg-white border-[#FF5B00]' : ''}
                ${todayMeal.status === 'DELIVERED' ? 'bg-blue-50 border-blue-500' : ''}
                ${todayMeal.status === 'CONFIRMED' ? 'bg-green-50 border-green-500' : ''}
              `}>
                <div className={`px-6 py-3.5 flex items-center gap-2 text-white font-bold text-sm
                  ${canHandOver(todayMeal.status) ? 'bg-[#FF5B00]' : ''}
                  ${todayMeal.status === 'DELIVERED' ? 'bg-blue-500' : ''}
                  ${todayMeal.status === 'CONFIRMED' ? 'bg-green-500' : ''}
                `}>
                  {canHandOver(todayMeal.status) && <><Clock size={16} /> Booked (Ready for Delivery)</>}
                  {todayMeal.status === 'DELIVERED' && <><Utensils size={16} /> Delivered! Enjoy your meal</>}
                  {todayMeal.status === 'CONFIRMED' && <><CheckCircle2 size={16} /> Box Returned Successfully</>}
                </div>

                <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="shrink-0">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <QRCode 
                        value={todayMeal.qr_token} 
                        size={130} 
                        level="H"
                        fgColor={todayMeal.status === 'CONFIRMED' ? '#9CA3AF' : '#0D1D3A'}
                      />
                    </div>
                    <button 
                      onClick={() => copyToken(todayMeal.qr_token)}
                      className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-mono text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Copy size={10} /> {todayMeal.qr_token?.substring(0, 8)}...
                    </button>
                  </div>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h3 className="text-lg font-extrabold text-[#0D1D3A]">{todayMeal.menus?.title}</h3>
                    <p className="text-gray-600 text-xs">{todayMeal.menus?.description}</p>
                    <div className="pt-2 text-xs font-bold text-gray-500 flex items-center justify-center md:justify-start gap-1">
                      <AlertCircle size={14} /> 
                      {canHandOver(todayMeal.status) ? "Show QR to distributor to collect your box." : 
                       todayMeal.status === 'DELIVERED' ? "Show QR to distributor when returning the box." : 
                       "Thank you for returning the box today!"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200 text-center">
                <p className="text-sm font-bold text-slate-500">No lunch booked for today.</p>
              </div>
            )}
          </div>

          {/* TOMORROW'S LUNCH BOOKING WIDGET */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#0D1D3A] flex items-center gap-2">
              <Sparkles size={18} className="text-[#FF5B00]" /> Tomorrow's Lunch
              {isAfter10PM && (
                <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-black flex items-center gap-1">
                  <Lock size={10} /> LOCKED
                </span>
              )}
            </h2>

            {tomorrowMeal ? (
              // Tomorrow already booked — show QR + unbook option
              <div className="bg-white rounded-3xl border-2 border-green-500 shadow-sm overflow-hidden relative">
                <div className="px-6 py-3.5 bg-green-500 text-white font-bold text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Tomorrow's Lunch Booked!</span>
                  {!isAfter10PM && (
                    <button 
                      onClick={handleUnbookTomorrow}
                      disabled={isCancelling}
                      className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {isCancelling ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                      Cancel Booking
                    </button>
                  )}
                </div>

                <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="shrink-0">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <QRCode value={tomorrowMeal.qr_token} size={130} level="H" fgColor="#0D1D3A" />
                    </div>
                    <button 
                      onClick={() => copyToken(tomorrowMeal.qr_token)}
                      className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-mono text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Copy size={10} /> {tomorrowMeal.qr_token?.substring(0, 8)}...
                    </button>
                  </div>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h3 className="text-lg font-extrabold text-[#0D1D3A]">{tomorrowMeal.menus?.title}</h3>
                    <p className="text-gray-600 text-xs">{tomorrowMeal.menus?.description}</p>
                    <div className="pt-2 text-xs font-bold text-green-700 flex items-center justify-center md:justify-start gap-1">
                      <CheckCircle2 size={14} /> QR code is generated and ready for tomorrow.
                    </div>
                    {isAfter10PM && (
                      <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <Lock size={12} /> Cancellation locked after 10:00 PM.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : tomorrowTemplate ? (
              // Tomorrow not booked, show template + book form
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] px-2.5 py-0.5 bg-orange-100 text-orange-800 rounded-full font-black uppercase tracking-wider">
                      {tomorrowDayName}'s Special
                    </span>
                    <h3 className="text-2xl font-black text-[#0D1D3A]">{tomorrowTemplate.title}</h3>
                    <p className="text-gray-600 text-sm">{tomorrowTemplate.description}</p>
                  </div>

                  {isAfter10PM ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                      <Lock size={20} className="text-red-500 shrink-0" />
                      <div>
                        <p className="font-bold text-red-800 text-sm">Booking Locked</p>
                        <p className="text-xs text-red-600">Bookings close at 10:00 PM. Please book before 10 PM tomorrow.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:flex-1 relative">
                        <MapPin className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                        <select 
                          required
                          value={selectedCollegeId}
                          onChange={e => setSelectedCollegeId(e.target.value)}
                          className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-semibold text-slate-800 appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Choose Delivery College...</option>
                          {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>

                      <button 
                        onClick={handleBookTomorrow}
                        disabled={isBooking}
                        className="w-full sm:w-auto px-8 py-3 bg-[#FF5B00] hover:bg-[#E05000] text-white font-bold rounded-xl shadow-lg shadow-[#FF5B00]/15 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        {isBooking && <Loader2 size={16} className="animate-spin" />}
                        Book Tomorrow's Lunch
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200 text-center">
                <p className="text-sm font-bold text-slate-500">Weekly menu template not uploaded by hostel manager yet.</p>
              </div>
            )}
          </div>

          {/* WEEKLY MENU */}
          {weeklyMenu.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-[#0D1D3A] flex items-center gap-2">
                <CalendarDays size={18} className="text-[#FF5B00]" /> This Week's Menu
              </h2>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {weeklyMenu.map(item => {
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === item.day_of_week;
                    const isTomorrow = tomorrowDayName === item.day_of_week;
                    return (
                      <div key={item.id} className={`px-6 py-4 flex items-center gap-4 ${isToday ? 'bg-orange-50/50' : ''}`}>
                        <div className="w-20 shrink-0">
                          <span className={`text-xs font-black ${isToday ? 'text-[#FF5B00]' : isTomorrow ? 'text-blue-600' : 'text-slate-500'}`}>
                            {item.day_of_week.substring(0, 3).toUpperCase()}
                          </span>
                          {isToday && <span className="block text-[8px] font-bold text-[#FF5B00] uppercase">Today</span>}
                          {isTomorrow && <span className="block text-[8px] font-bold text-blue-600 uppercase">Tomorrow</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#0D1D3A] text-sm truncate">{item.title}</h4>
                          <p className="text-xs text-gray-400 truncate">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COL: MY PROFILE & NOTIFICATIONS */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#0D1D3A] mb-4 flex items-center gap-2">
              <User size={20} className="text-[#FF5B00]" /> 
              My Profile
            </h2>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Name</div>
                <div className="text-sm font-bold text-[#0D1D3A]">{profile?.name || '—'}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Student ID</div>
                <div className="text-sm font-bold text-[#0D1D3A] font-mono">{profile?.resident_code || 'PENDING'}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Hostel & Room</div>
                <div className="text-sm font-bold text-[#0D1D3A]">
                  {profile?.properties?.name || 'Not assigned'}
                  {profile?.room_number && <span className="text-gray-400 font-medium"> • Room {profile.room_number}</span>}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">College</div>
                <div className="text-sm font-bold text-[#0D1D3A]">{profile?.colleges?.name || 'Not set'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#0D1D3A] flex items-center gap-2 px-1">
              <Bell size={18} className="text-[#FF5B00]" /> Notice Board
            </h2>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-gray-400 font-medium">
                  No announcements published yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 rounded-2xl border ${
                    notif.priority === 'URGENT' ? 'bg-red-50 border-red-200' :
                    notif.priority === 'IMPORTANT' ? 'bg-orange-50 border-orange-200' :
                    'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-orange-500 shrink-0">
                        <Info size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#0D1D3A]">{notif.title}</h3>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                        <p className="text-[9px] font-bold text-gray-400 mt-2">{new Date(notif.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
