'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserDto } from '@mealflow/types';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setTimeout(() => {
        setUser(JSON.parse(storedUser));
      }, 0);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1128] via-[#001F54] to-[#0A1128] text-white p-6 flex flex-col items-center justify-center">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#FF9933]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-[#001F54]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#FF9933] to-[#FF5500] rounded-xl flex items-center justify-center shadow-md shadow-[#FF9933]/20">
              <span className="text-white font-extrabold text-lg">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100">MealFlow Portal</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-[#0A1128] hover:bg-[#0A1128]/80 border border-white/10 hover:border-[#FF9933]/30 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-all text-sm active:scale-95 cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="space-y-6">
          {user?.role === 'OWNER' && (
            <div className="p-6 bg-[#0A1128]/40 border border-white/10 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-200">Tenant Setup (Phase 2)</h3>
                <p className="text-sm text-slate-400">Initialize your Organization and register PG Properties.</p>
              </div>
              <button
                onClick={() => router.push('/properties')}
                className="bg-gradient-to-r from-[#FF9933] to-[#FF5500] hover:from-[#FFB05B] hover:to-[#FF6F1C] text-white font-bold px-4 py-2.5 rounded-xl transition-all text-sm cursor-pointer shadow-md shadow-[#FF9933]/20 active:scale-95"
              >
                Setup Properties
              </button>
            </div>
          )}

          <div className="p-6 bg-[#0A1128]/40 border border-white/10 rounded-2xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text text-transparent mb-4">
              Hello, {user?.name || user?.email || 'User'}!
            </h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div className="bg-[#001F54]/30 p-4 border border-white/5 rounded-xl">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Email
                </span>
                <span className="text-slate-200 font-medium">{user?.email || 'N/A'}</span>
              </div>
              <div className="bg-[#001F54]/30 p-4 border border-white/5 rounded-xl">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Role
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30 uppercase tracking-wider">
                  {user?.role || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#FF9933]/5 border border-[#FF9933]/25 rounded-2xl">
            <h3 className="text-lg font-bold text-[#FF9933] mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FF9933]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Authentication Verification
            </h3>
            <p className="text-sm text-slate-350 leading-relaxed">
              Auth validation was successful. Your session is active and secure. You have been authorized based on your role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
