'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { QrCode, CheckCircle2, AlertCircle, RefreshCw, Keyboard, Loader2, Camera } from 'lucide-react';

export default function QRScannerPage() {
  const [manualToken, setManualToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [mealData, setMealData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  const handleTokenVerification = useCallback(async (token: string) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setMealData(null);

    const { data: meal, error } = await supabase
      .from('meals')
      .select(`
        id, status, qr_token, collected_at, returned_at,
        profiles!resident_id(name, room_number),
        menus(date, type, title),
        properties(name)
      `)
      .eq('qr_token', token)
      .single();

    if (error || !meal) {
      setErrorMsg("Invalid QR Code. No active tiffin order found.");
    } else {
      setMealData(meal);
      // Stop camera when result is found
      stopScanner();
    }
    
    setLoading(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (scannerRef.current || !containerRef.current) return;

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode("qr-camera-feed");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleTokenVerification(decodedText);
        },
        () => { /* ignore failures */ }
      );
      setScannerActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setScannerActive(false);
    }
  }, [handleTokenVerification]);

  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current.clear();
        scannerRef.current = null;
        setScannerActive(false);
      }).catch(() => {
        scannerRef.current = null;
        setScannerActive(false);
      });
    }
  }, []);

  useEffect(() => {
    // Strict mode guard
    if (initRef.current) return;
    initRef.current = true;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!mealData) startScanner();
    }, 300);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    handleTokenVerification(manualToken.trim());
  };

  const confirmAction = async (newStatus: string) => {
    if (!mealData) return;
    setLoading(true);
    
    const updateData: any = { status: newStatus };
    const { data: { session } } = await supabase.auth.getSession();
    
    if (newStatus === 'DELIVERED') {
      updateData.collected_at = new Date().toISOString();
      updateData.collected_by = session?.user.id;
    } else if (newStatus === 'CONFIRMED') {
      updateData.returned_at = new Date().toISOString();
      updateData.returned_to = session?.user.id;
    }

    const { error } = await supabase
      .from('meals')
      .update(updateData)
      .eq('id', mealData.id);

    if (error) {
      setErrorMsg("Failed to update. Try again.");
    } else {
      setMealData({ ...mealData, status: newStatus, ...updateData });
      setSuccessMsg(newStatus === 'DELIVERED' ? "Tiffin handed over!" : "Box returned!");
    }
    setLoading(false);
  };

  const resetScanner = () => {
    setMealData(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    setManualToken('');
    // Restart camera
    setTimeout(() => startScanner(), 300);
  };

  const canHandOver = (s: string) => s === 'PENDING' || s === 'BOOKED';
  const canReturn = (s: string) => s === 'DELIVERED' || s === 'COLLECTED';
  const isDone = (s: string) => s === 'CONFIRMED' || s === 'RETURNED';

  const statusColor = (s: string) => {
    if (canHandOver(s)) return 'bg-orange-500';
    if (canReturn(s)) return 'bg-blue-500';
    if (isDone(s)) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const statusLabel = (s: string) => {
    if (canHandOver(s)) return 'Ready for Collection';
    if (canReturn(s)) return 'Awaiting Box Return';
    if (isDone(s)) return 'Completed';
    return s;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Scan Student QR</h1>
        <p className="text-gray-500 font-medium">Verify orders for distribution or box return.</p>
      </div>

      {/* SCANNER VIEW */}
      {!mealData && (
        <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-black relative" style={{ minHeight: '300px' }}>
            <div id="qr-camera-feed" ref={containerRef} className="w-full"></div>
            {!scannerActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 gap-3">
                <Camera size={48} />
                <p className="text-sm font-bold">Starting camera...</p>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="text-center text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider flex items-center justify-center gap-2">
              <Keyboard size={16} /> OR ENTER TOKEN MANUALLY
            </div>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input 
                type="text" 
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste QR token or Student ID..." 
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-xs"
              />
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#0D1D3A] text-white font-bold rounded-xl hover:bg-[#1E3A8A] transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <QrCode size={20} />}
                Verify
              </button>
            </form>
            {errorMsg && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 font-bold rounded-xl flex items-start gap-3">
                <AlertCircle className="shrink-0" size={18} />
                <p className="text-sm">{errorMsg}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESULT VIEW */}
      {mealData && (
        <div className="bg-white rounded-3xl border-2 border-[#0D1D3A] shadow-lg overflow-hidden">
          <div className={`px-6 py-4 text-white font-bold text-lg ${statusColor(mealData.status)}`}>
            {statusLabel(mealData.status)}
          </div>

          <div className="p-6 space-y-6">
            {successMsg && (
              <div className="p-4 bg-green-50 text-green-700 font-bold rounded-xl flex items-center gap-3 border border-green-200">
                <CheckCircle2 className="shrink-0" size={20} />
                <p>{successMsg}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1 space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Student</p>
                <p className="font-extrabold text-[#0D1D3A] text-lg">{mealData.profiles?.name}</p>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Hostel</p>
                <p className="font-bold text-gray-800">{mealData.properties?.name}</p>
                <p className="text-sm text-gray-500">Room: {mealData.profiles?.room_number}</p>
              </div>
              <div className="col-span-2 border-t border-gray-100 pt-4 space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Meal</p>
                <p className="font-bold text-gray-800">{mealData.menus?.type} • {mealData.menus?.date}</p>
                <p className="text-sm text-gray-600">{mealData.menus?.title}</p>
              </div>
              <div className="col-span-2 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">QR Token</p>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 select-all break-all">
                  {mealData.qr_token}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {canHandOver(mealData.status) && (
                <button 
                  onClick={() => confirmAction('DELIVERED')}
                  disabled={loading || !!successMsg}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 disabled:opacity-50 text-lg cursor-pointer"
                >
                  Confirm & Hand Over Tiffin
                </button>
              )}
              {canReturn(mealData.status) && !successMsg && (
                <button 
                  onClick={() => confirmAction('CONFIRMED')}
                  disabled={loading}
                  className="w-full py-4 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 disabled:opacity-50 text-lg cursor-pointer"
                >
                  Confirm Box Return
                </button>
              )}
              {isDone(mealData.status) && !successMsg && (
                <div className="p-4 bg-gray-100 text-gray-500 font-bold rounded-xl text-center">
                  Already returned at {new Date(mealData.returned_at).toLocaleTimeString()}.
                </div>
              )}
              <button onClick={resetScanner} className="w-full py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl cursor-pointer">
                Scan Another QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
