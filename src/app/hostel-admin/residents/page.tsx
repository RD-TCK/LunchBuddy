'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, MoreVertical, Loader2 } from 'lucide-react';

export default function ResidentsPage() {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResidents = async () => {
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
          setLoading(false);
          return;
        }

        // Fetch residents associated ONLY with this property
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
          .eq('property_id', profile.property_id)
          .order('name', { ascending: true })
          .limit(50);
          
        if (data) {
          setResidents(data);
        }
      } catch (err) {
        console.error("Error loading residents:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResidents();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">PENDING</span>;
      case 'APPROVED': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">APPROVED</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">REJECTED</span>;
      case 'INACTIVE': return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">INACTIVE</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const filteredResidents = residents.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Resident Directory</h1>
          <p className="text-gray-500 font-medium mt-1">Manage all students living in your hostel.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Resident</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="animate-spin text-[#FF5B00] inline-block mr-2" size={20} />
                    <span className="font-bold">Loading residents...</span>
                  </td>
                </tr>
              ) : filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-bold">
                    No residents found for your hostel yet.
                  </td>
                </tr>
              ) : (
                filteredResidents.map((resident) => (
                  <tr key={resident.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0D1D3A]">{resident.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{resident.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{resident.properties?.name || 'Unassigned'}</div>
                      <div className="text-xs text-gray-500">Room: {resident.room_number || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(resident.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-[#0D1D3A] p-2 rounded-lg hover:bg-slate-100 transition-colors inline-flex">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
