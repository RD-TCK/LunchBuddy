'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Utensils, AlertCircle, Edit3, Loader2, Check } from 'lucide-react';

export default function WeeklyMenuManagement() {
  const [weeklyMenus, setWeeklyMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit form states
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchWeeklyMenu();
  }, []);

  const fetchWeeklyMenu = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('property_id')
        .eq('id', session.user.id)
        .single();

      if (!profile?.property_id) {
        setLoading(false);
        return;
      }

      // Fetch the 7-day templates
      const { data, error: fetchErr } = await supabase
        .from('weekly_menus')
        .select('*')
        .eq('property_id', profile.property_id);

      if (fetchErr) throw fetchErr;

      // Order correctly Monday -> Sunday
      const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      if (data) {
        const sorted = data.sort((a, b) => order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week));
        setWeeklyMenus(sorted);
      }

    } catch (err) {
      console.error("Error loading weekly menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description || '');
    setError(null);
    setSuccess(null);
  };

  const handleUpdateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateErr } = await supabase
        .from('weekly_menus')
        .update({
          title: editTitle.trim(),
          description: editDescription.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id);

      if (updateErr) throw updateErr;

      setSuccess(`Updated ${editingItem.day_of_week} ${editingItem.type} successfully!`);
      setEditingItem(null);
      fetchWeeklyMenu(); // Refresh data

      // Clear success banner after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      setError(err.message || "Failed to update menu template.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-sans">
        <Loader2 size={36} className="animate-spin text-[#FF5B00] mb-3" />
        <span className="font-bold">Loading weekly menu planner...</span>
      </div>
    );
  }

  // Group by day of week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Weekly Menu Planner</h1>
        <p className="text-gray-500 font-medium mt-1">Hostels have fixed weekly menus. Configure recurring menus for each day below.</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {editingItem && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-[#0D1D3A] mb-4 flex items-center gap-2">
            <Edit3 size={18} className="text-[#FF5B00]" />
            Edit {editingItem.day_of_week} - {editingItem.type} Menu
          </h2>
          
          {error && (
            <div className="p-3 mb-4 text-xs font-semibold text-red-650 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleUpdateMenu} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Meal Title</label>
              <input 
                type="text" 
                required 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Meal Description (Dishes)</label>
              <textarea 
                required 
                value={editDescription} 
                onChange={e => setEditDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#FF5B00] text-white font-bold rounded-xl hover:bg-[#E05000] transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7-Day Grid */}
      <div className="space-y-4">
        {days.map(day => {
          const dayItems = weeklyMenus.filter(m => m.day_of_week === day);
          const lunch = dayItems.find(m => m.type === 'LUNCH');
          const dinner = dayItems.find(m => m.type === 'DINNER');

          return (
            <div key={day} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Day Header */}
              <div className="p-6 md:w-48 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center items-center">
                <span className="text-xl font-black text-[#0D1D3A]">{day}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Recurring</span>
              </div>

              {/* Meals Display */}
              <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LUNCH */}
                <div className="space-y-3 p-4 bg-orange-50/20 border border-orange-100/50 rounded-2xl relative flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-black tracking-wider uppercase">LUNCH</span>
                      <button 
                        onClick={() => handleEditClick(lunch)}
                        className="text-xs font-bold text-orange-700 hover:text-orange-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                    </div>
                    {lunch ? (
                      <>
                        <h3 className="font-extrabold text-[#0D1D3A] text-base pt-1">{lunch.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{lunch.description}</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No lunch menu set</p>
                    )}
                  </div>
                </div>

                {/* DINNER */}
                <div className="space-y-3 p-4 bg-blue-50/20 border border-blue-100/50 rounded-2xl relative flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-black tracking-wider uppercase">DINNER</span>
                      <button 
                        onClick={() => handleEditClick(dinner)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                    </div>
                    {dinner ? (
                      <>
                        <h3 className="font-extrabold text-[#0D1D3A] text-base pt-1">{dinner.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{dinner.description}</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No dinner menu set</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
