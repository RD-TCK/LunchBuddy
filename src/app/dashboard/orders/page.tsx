'use client';

import { useState } from 'react';
import { ClipboardCheck, QrCode, CheckCircle2, Bike, Utensils, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-xs font-bold text-[#FF5B00] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-[#0D1D3A]">Track Orders</h1>
          <p className="text-xs text-gray-500 font-medium">Real-time status and delivery timeline for today's tiffin</p>
        </div>
      </div>

      {/* Live Order Timeline Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="px-3 py-1 bg-[#FFF4EC] text-[#FF5B00] text-xs font-extrabold rounded-full">
              TODAY'S LUNCH TIFFIN
            </span>
            <h3 className="text-lg font-extrabold text-[#0D1D3A] mt-2">North Indian Thali Special</h3>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-extrabold rounded-full animate-pulse">
              PREPARING IN KITCHEN
            </span>
          </div>
        </div>

        {/* Visual Progress Timeline (Poster Inspired) */}
        <div className="space-y-6 pt-2">
          <div className="text-xs font-bold text-[#0D1D3A] uppercase tracking-wider">
            Live Delivery Progress
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            
            {/* Step 1: Booked */}
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#22C55E] text-white flex items-center justify-center text-[10px]">
                ✓
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#0D1D3A]">Meal Booked</div>
                <div className="text-xs text-gray-400">Order confirmed by system</div>
              </div>
            </div>

            {/* Step 2: Preparing */}
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#FF5B00] text-white flex items-center justify-center text-[10px] animate-ping">
              </div>
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#FF5B00] text-white flex items-center justify-center text-[10px]">
                🍳
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#FF5B00]">Preparing in Kitchen</div>
                <div className="text-xs text-gray-400">Chef is preparing your fresh meal</div>
              </div>
            </div>

            {/* Step 3: Dispatch */}
            <div className="relative flex items-start gap-4 opacity-50">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-[10px]">
                🛵
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#0D1D3A]">Dispatched for Delivery</div>
                <div className="text-xs text-gray-400">Assigned to delivery agent</div>
              </div>
            </div>

            {/* Step 4: Delivered */}
            <div className="relative flex items-start gap-4 opacity-50">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-[10px]">
                🍱
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#0D1D3A]">Delivered & Confirmed</div>
                <div className="text-xs text-gray-400">QR code scanned at your door</div>
              </div>
            </div>

          </div>
        </div>

        {/* QR Verification Box */}
        <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
              <QrCode size={32} className="text-[#0D1D3A]" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#0D1D3A]">Delivery Verification QR</div>
              <div className="text-[11px] text-gray-500">Show this QR to the delivery person to confirm receipt</div>
            </div>
          </div>
          <span className="px-4 py-2 bg-[#0D1D3A] text-white font-mono font-bold text-xs rounded-xl">
            TOKEN: LB-9942
          </span>
        </div>

      </div>
    </div>
  );
}
