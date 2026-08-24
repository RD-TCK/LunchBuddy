'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar as CalendarIcon, Utensils, AlertCircle, CheckCircle2, MapPin, Clock } from 'lucide-react';

export default function BookMealsPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [bookedMealIds, setBookedMealIds] = useState<Set<string>>(new Set());
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [propertySettings, setPropertySettings] = useState<any>(null);
  
  // State for which college the student wants the lunch delivered to
  const [selectedCollegeId, setSelectedCollegeId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch Profile
    const { data: prof } = await supabase
      .from('profiles')
      .select('*, properties(name, lunch_cutoff_time)')
      .eq('id', session.user.id)
      .single();
    
    setProfile(prof);
    
    if (prof?.properties) {
      setPropertySettings(prof.properties);
    }

    // Only fetch menus if they are approved
    if (prof?.status === 'APPROVED' && prof.property_id) {
      // 1. Fetch available menus for this property
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const { data: availableMenus } = await supabase
        .from('menus')
        .select('*')
        .eq('property_id', prof.property_id)
        .gte('date', today.toISOString().split('T')[0])
        .lte('date', nextWeek.toISOString().split('T')[0])
        .order('date', { ascending: true });
        
      if (availableMenus) setMenus(availableMenus);

      // 2. Fetch the student's existing bookings
      const { data: existingMeals } = await supabase
        .from('meals')
        .select('menu_id')
        .eq('resident_id', session.user.id);
        
      if (existingMeals) {
        const bookedIds = new Set(existingMeals.map(m => m.menu_id));
        setBookedMealIds(bookedIds);
      }
      
      // 3. Fetch all colleges for delivery selection
      const { data: colData } = await supabase.from('colleges').select('*').order('name');
      if (colData) setColleges(colData);
    }
    setLoading(false);
  };

  const isPastCutoff = (menuDateString: string) => {
    if (!propertySettings?.lunch_cutoff_time) return false;
    
    const menuDate = new Date(menuDateString);
    const today = new Date();
    
    // Only apply cutoff to TODAY's meals. Future meals are always bookable.
    if (menuDate.toISOString().split('T')[0] !== today.toISOString().split('T')[0]) {
      return false;
    }

    // Compare current time with cutoff time (e.g. '10:00:00')
    const cutoffTime = propertySettings.lunch_cutoff_time;
    const [cutoffHour, cutoffMinute] = cutoffTime.split(':').map(Number);
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour > cutoffHour || (currentHour === cutoffHour && currentMinute >= cutoffMinute)) {
      return true; // Past cutoff!
    }
    
    return false;
  };

  const handleBookMeal = async (menuId: string) => {
    if (!selectedCollegeId) {
      alert("Please select a delivery location first!");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !profile?.property_id) return;

    // Optimistic UI update
    const newBookedSet = new Set(bookedMealIds);
    newBookedSet.add(menuId);
    setBookedMealIds(newBookedSet);

    const { error } = await supabase
      .from('meals')
      .insert({
        property_id: profile.property_id,
        menu_id: menuId,
        resident_id: session.user.id,
        delivery_college_id: selectedCollegeId, // The new delivery routing!
        status: 'PENDING'
      });

    if (error) {
      alert("Failed to book meal. Please try again.");
      const revertedSet = new Set(bookedMealIds);
      revertedSet.delete(menuId);
      setBookedMealIds(revertedSet);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex items-center justify-center p-12">Loading menu...</div>;
  }

  if (profile?.account_status === 'PENDING') {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center bg-white p-8 rounded-3xl border border-orange-200">
        <h2 className="text-xl font-bold text-[#0D1D3A] mb-2">Account Pending Review</h2>
        <p className="text-gray-500">Your Hostel Manager needs to approve your account before you can book meals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Weekly Menu</h1>
          <p className="text-gray-500 font-medium mt-1">Select your meals and choose where you want them delivered.</p>
        </div>
        
        {/* Universal Delivery Selector */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <MapPin className="text-[#FF5B00] shrink-0 ml-2" size={20} />
          <select 
            className="w-full md:w-64 bg-transparent outline-none text-sm font-bold text-[#0D1D3A] cursor-pointer"
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
          >
            <option value="" disabled>Choose Delivery College...</option>
            {colleges.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {menus.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center">
          <Utensils className="mx-auto text-gray-300 mb-4" size={48} />
          <h2 className="text-xl font-bold text-[#0D1D3A] mb-2">No Menus Available</h2>
          <p className="text-gray-500">Your hostel admin hasn't published the menu for this week yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {menus.map((menu) => {
            const isBooked = bookedMealIds.has(menu.id);
            const dateObj = new Date(menu.date);
            const isToday = dateObj.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
            const cutoffExceeded = isPastCutoff(menu.date);
            
            return (
              <div key={menu.id} className={`bg-white rounded-3xl border ${cutoffExceeded && !isBooked ? 'border-red-200' : 'border-gray-200'} shadow-sm overflow-hidden flex flex-col md:flex-row transition-all relative`}>
                
                {/* Date Block */}
                <div className={`p-6 md:w-48 flex flex-col justify-center items-center md:border-r border-gray-100 ${isToday ? 'bg-orange-50' : 'bg-slate-50'}`}>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-4xl font-black ${isToday ? 'text-[#FF5B00]' : 'text-[#0D1D3A]'}`}>
                    {dateObj.getDate()}
                  </div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
                    {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  {isToday && <span className="mt-2 px-2 py-0.5 bg-[#FF5B00] text-white text-[10px] font-bold rounded">TODAY</span>}
                </div>

                {/* Menu Details & Action */}
                <div className={`p-6 flex-1 flex flex-col md:flex-row gap-6 justify-between items-center ${cutoffExceeded && !isBooked ? 'opacity-60' : ''}`}>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Utensils size={16} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{menu.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0D1D3A]">{menu.title}</h3>
                    <p className="text-gray-600 text-sm max-w-md">{menu.description}</p>
                    
                    {cutoffExceeded && !isBooked && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                        <Clock size={12} />
                        Booking closed at {propertySettings?.lunch_cutoff_time.substring(0,5)}
                      </div>
                    )}
                  </div>
                  
                  <div className="shrink-0 w-full md:w-auto">
                    {isBooked ? (
                      <div className="px-6 py-3 bg-green-50 text-green-700 font-bold rounded-xl flex items-center justify-center gap-2 border border-green-200 w-full md:w-48">
                        <CheckCircle2 size={18} />
                        Booked
                      </div>
                    ) : cutoffExceeded ? (
                       <div className="px-6 py-3 bg-gray-100 text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2 border border-gray-200 w-full md:w-48 cursor-not-allowed">
                        Missed Deadline
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleBookMeal(menu.id)}
                        className="px-6 py-3 bg-[#0D1D3A] text-white font-bold rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-sm w-full md:w-48 text-center"
                      >
                        Book Tiffin
                      </button>
                    )}
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
