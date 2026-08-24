'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Home, Shield, Mail, ArrowLeft, CheckCircle2, Lock, GraduationCap, Hash, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [roomNumber, setRoomNumber] = useState('');
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: prof } = await supabase
        .from('profiles')
        .select('*, properties(name), colleges(name)')
        .eq('id', session.user.id)
        .single();

      if (prof) {
        setProfile(prof);
        setName(prof.name || '');
        setRoomNumber(prof.room_number || '');
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          room_number: roomNumber.trim(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-sans">
        <Loader2 size={36} className="animate-spin text-[#FF5B00] mb-3" />
        <span className="font-bold">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12 text-gray-500 font-bold">
        Unable to load profile. Please log in again.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-xs font-bold text-[#FF5B00] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-[#0D1D3A]">Resident Profile</h1>
          <p className="text-xs text-gray-500 font-medium">Update your details for tiffin delivery</p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
        
        {/* Email Address (read-only) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              disabled
              value={profile.email || ''}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
            />
          </div>
        </div>

        {/* Name (editable) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5B00] text-[#0D1D3A] font-semibold"
            />
          </div>
        </div>

        {/* Student ID (read-only) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">
            Student ID
          </label>
          <div className="relative">
            <Hash className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              disabled
              value={profile.resident_code || 'PENDING'}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>

        {/* Hostel / Residence Name (read-only — assigned at registration) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider flex items-center gap-1">
            Hostel / Residence <Lock size={12} className="text-gray-400" />
          </label>
          <div className="relative">
            <Home className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              disabled
              value={profile.properties?.name || 'Not assigned'}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-semibold cursor-not-allowed"
            />
          </div>
          <p className="text-[10px] text-gray-400 font-medium pl-1">Hostel can only be changed by your Hostel Admin.</p>
        </div>

        {/* College (read-only — locked after registration) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider flex items-center gap-1">
            College <Lock size={12} className="text-gray-400" />
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              disabled
              value={profile.colleges?.name || 'Not assigned'}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-semibold cursor-not-allowed"
            />
          </div>
          <p className="text-[10px] text-gray-400 font-medium pl-1">College can only be changed by your Hostel Admin.</p>
        </div>

        {/* Room / Bed Number (editable) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">
            Room & Bed Number
          </label>
          <div className="relative">
            <Shield className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. Room 204 (Block B)"
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5B00] text-[#0D1D3A] font-semibold"
            />
          </div>
        </div>

        {/* Status (read-only) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">Account Status</label>
          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
            <span className={`text-xs px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
              profile.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {profile.status}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 bg-[#FF5B00] hover:bg-[#E05000] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#FF5B00]/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          Save Profile
        </button>

      </form>
    </div>
  );
}
