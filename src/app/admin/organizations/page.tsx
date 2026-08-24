'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Building2, School, Plus, MapPin } from 'lucide-react';

export default function OrganizationsPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Colleges
    const { data: cols } = await supabase
      .from('colleges')
      .select('*')
      .order('name');
    if (cols) setColleges(cols);

    // Fetch Hostels with their assigned College
    const { data: props } = await supabase
      .from('properties')
      .select('*, colleges(name)')
      .order('name');
    if (props) setHostels(props);

    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Organization Hierarchy</h1>
        <p className="text-gray-500 font-medium mt-1">Manage Colleges and their associated Hostels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLLEGES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0D1D3A] flex items-center gap-2">
              <School className="text-blue-500" /> Colleges
            </h2>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
              <Plus size={14} /> Add College
            </button>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading colleges...</div>
            ) : colleges.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No colleges registered.</div>
            ) : (
              colleges.map(college => (
                <div key={college.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#0D1D3A] text-lg">{college.name}</h3>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {college.address || 'No address provided'}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                      {hostels.filter(h => h.college_id === college.id).length} Hostels
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HOSTELS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0D1D3A] flex items-center gap-2">
              <Building2 className="text-indigo-500" /> Hostels & PGs
            </h2>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200">
              <Plus size={14} /> Add Hostel
            </button>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading hostels...</div>
            ) : hostels.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No hostels registered.</div>
            ) : (
              hostels.map(hostel => (
                <div key={hostel.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#0D1D3A] text-lg">{hostel.name}</h3>
                      <div className="text-sm text-indigo-600 font-bold mt-1">
                        {hostel.colleges?.name || 'Unassigned / Independent'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {hostel.address || 'No address provided'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
