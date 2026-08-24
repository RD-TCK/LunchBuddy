'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Check, X, UserCheck, Loader2 } from 'lucide-react';

export default function ApprovalsPage() {
  const [pendingResidents, setPendingResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingResidents();
  }, []);

  const fetchPendingResidents = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get manager's property_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('property_id')
        .eq('id', session.user.id)
        .single();

      if (!profile?.property_id) {
        setPendingResidents([]);
        return;
      }

      // Fetch pending residents associated ONLY with this property
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          room_number,
          status,
          properties(name)
        `)
        .eq('role', 'RESIDENT')
        .eq('status', 'PENDING')
        .eq('property_id', profile.property_id)
        .order('created_at', { ascending: false });
        
      if (data) {
        setPendingResidents(data);
      }
    } catch (err) {
      console.error("Error loading approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    // Optimistic UI update
    setPendingResidents(prev => prev.filter(r => r.id !== id));
    
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      alert("Failed to update status.");
      fetchPendingResidents(); // Revert on failure
    }
  };

  const filteredResidents = pendingResidents.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Pending Approvals</h1>
          <p className="text-gray-500 font-medium mt-1">Review and approve new student registrations.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-orange-50/50">
          <div className="flex items-center gap-2 text-orange-700 font-bold">
            <UserCheck size={20} />
            <span>{pendingResidents.length} Students waiting for approval</span>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <Loader2 className="animate-spin text-[#FF5B00] inline-block mr-2" size={24} />
              <span className="font-bold">Loading pending requests...</span>
            </div>
          ) : filteredResidents.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <p className="font-bold text-lg text-slate-600">All Caught Up!</p>
              <p className="text-sm">There are no pending registrations for your hostel right now.</p>
            </div>
          ) : (
            filteredResidents.map((resident) => (
              <div key={resident.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Student</div>
                    <div className="font-bold text-[#0D1D3A] text-lg">{resident.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{resident.email}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Hostel</div>
                    <div className="font-bold text-gray-800">{resident.properties?.name || 'Unassigned'}</div>
                    <div className="text-sm text-gray-500">Room: {resident.room_number || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold inline-block">
                      {resident.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => handleApproval(resident.id, 'REJECTED')}
                    className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Reject
                  </button>
                  <button 
                    onClick={() => handleApproval(resident.id, 'APPROVED')}
                    className="flex-1 md:flex-none px-6 py-2 bg-[#0D1D3A] text-white hover:bg-[#1E3A8A] font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Approve Access
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
