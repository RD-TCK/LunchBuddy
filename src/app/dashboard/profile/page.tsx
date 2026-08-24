'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Home, Shield, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [roomNumber, setRoomNumber] = useState('Room 204 (Block B)');
  const [hostelName, setHostelName] = useState('Student PG - Greater Noida');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-xs font-bold text-[#FF5B00] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-[#0D1D3A]">Resident Profile</h1>
          <p className="text-xs text-gray-500 font-medium">Update your accommodation details for tiffin delivery</p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>Profile preferences updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
        
        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
            />
          </div>
        </div>

        {/* Hostel / Residence Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">
            Hostel / Residence Name
          </label>
          <div className="relative">
            <Home className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5B00] text-[#0D1D3A] font-semibold"
            />
          </div>
        </div>

        {/* Room / Bed Number */}
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
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5B00] text-[#0D1D3A] font-semibold"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-[#FF5B00] hover:bg-[#E05000] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#FF5B00]/25 transition-all"
        >
          Save Profile Preferences
        </button>

      </form>
    </div>
  );
}
