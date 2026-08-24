'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, MapPin, AlertCircle, Edit3, Check, X, Loader2, Key } from 'lucide-react';

export default function VendorsManagementPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyId, setPropertyId] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [deliveryCollegeId, setDeliveryCollegeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit State
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCollegeId, setEditCollegeId] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get manager's property_id
    const { data: profile } = await supabase.from('profiles').select('property_id').eq('id', session.user.id).single();
    
    if (profile?.property_id) {
      setPropertyId(profile.property_id);

      // Fetch Vendors for this property
      const { data: vendorData } = await supabase
        .from('profiles')
        .select('id, name, email, delivery_college_id, status, colleges(name)')
        .eq('property_id', profile.property_id)
        .eq('role', 'VENDOR');
      if (vendorData) setVendors(vendorData);

      // Fetch all colleges for the dropdown
      const { data: collegeData } = await supabase.from('colleges').select('*').order('name');
      if (collegeData) setColleges(collegeData);
    }
    
    setLoading(false);
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();

    try {
      const response = await fetch('/api/create-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          property_id: propertyId,
          delivery_college_id: deliveryCollegeId,
          requesting_user_id: session?.user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create vendor');
      }

      // Success
      setShowForm(false);
      setEmail('');
      setPassword('');
      setName('');
      setDeliveryCollegeId('');
      fetchData(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (vendor: any) => {
    setEditingVendorId(vendor.id);
    setEditName(vendor.name || '');
    setEditCollegeId(vendor.delivery_college_id || '');
    setEditStatus(vendor.status || 'APPROVED');
    setEditEmail(vendor.email || '');
    setEditPassword('');
  };

  const cancelEdit = () => {
    setEditingVendorId(null);
  };

  const handleUpdateVendor = async (vendorId: string) => {
    setIsUpdating(true);
    try {
      // Update profile fields
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          name: editName.trim(),
          delivery_college_id: editCollegeId || null,
          status: editStatus,
        })
        .eq('id', vendorId);

      if (updateErr) throw updateErr;

      // Update email/password if changed via server API
      const { data: { session } } = await supabase.auth.getSession();
      if (editEmail.trim() || editPassword.trim()) {
        const res = await fetch('/api/update-vendor-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vendor_id: vendorId,
            email: editEmail.trim() || undefined,
            password: editPassword.trim() || undefined,
            requesting_user_id: session?.user.id,
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update credentials');
      }

      setEditingVendorId(null);
      fetchData(); // Refresh
    } catch (err: any) {
      alert("Failed to update vendor: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Vendor Delivery Fleet</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your tiffin distributors and their delivery routes.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0D1D3A] text-white font-bold rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-sm cursor-pointer"
        >
          {showForm ? 'Cancel' : <><UserPlus size={16} /> Add Vendor</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-[#0D1D3A] mb-4">Register New Vendor</h2>
          {error && (
            <div className="p-3 mb-4 text-xs font-semibold text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <form onSubmit={handleCreateVendor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Vendor Name</label>
              <input type="text" required value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="e.g. Ramesh Singh" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Delivery College Route</label>
              <select required value={deliveryCollegeId} onChange={e=>setDeliveryCollegeId(e.target.value)} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white">
                <option value="" disabled>Select College Drop-off...</option>
                {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Email (Login ID)</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="ramesh@lunchbuddy.com" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
              <input type="text" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="Secure password" />
            </div>
            <div className="md:col-span-2 pt-2 border-t border-slate-100 mt-2">
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#FF5B00] text-white font-bold rounded-xl hover:bg-[#E05000] transition-colors disabled:opacity-50 cursor-pointer">
                {isSubmitting ? 'Creating Vendor...' : 'Create Vendor Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-600 flex items-center gap-2">
            Active Fleet ({vendors.length})
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <Loader2 size={20} className="animate-spin inline-block mr-2" />
              Loading vendors...
            </div>
          ) : vendors.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="font-bold text-lg text-slate-600">No Vendors Assigned</p>
              <p className="text-sm">Click "Add Vendor" to create accounts for your delivery staff.</p>
            </div>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                {editingVendorId === vendor.id ? (
                  // EDIT MODE
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Name</label>
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={e => setEditName(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">College Route</label>
                        <select 
                          value={editCollegeId} 
                          onChange={e => setEditCollegeId(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                        >
                          <option value="">Unassigned</option>
                          {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</label>
                        <select 
                          value={editStatus} 
                          onChange={e => setEditStatus(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                        >
                          <option value="APPROVED">ACTIVE</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                        </select>
                      </div>
                    </div>
                    {/* Credentials Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <Key size={10} /> Email (Login ID)
                        </label>
                        <input 
                          type="email" 
                          value={editEmail} 
                          onChange={e => setEditEmail(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                          placeholder="vendor@email.com"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <Key size={10} /> New Password (leave blank to keep)
                        </label>
                        <input 
                          type="text" 
                          value={editPassword} 
                          onChange={e => setEditPassword(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="New password (optional)"
                          minLength={6}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={cancelEdit}
                        className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button 
                        onClick={() => handleUpdateVendor(vendor.id)}
                        disabled={isUpdating}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#FF5B00] hover:bg-[#E05000] rounded-lg transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#0D1D3A] text-lg">{vendor.name}</h3>
                        {vendor.status === 'APPROVED' ? 
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">ACTIVE</span> : 
                          <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">SUSPENDED</span>}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">{vendor.email}</div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
                        <MapPin size={16} className="text-[#FF5B00]" />
                        <div className="text-sm font-bold text-orange-900">
                          Route: <span className="text-[#FF5B00]">{vendor.colleges?.name || 'Unassigned'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => startEdit(vendor)}
                        className="p-2 text-slate-400 hover:text-[#FF5B00] hover:bg-orange-50 rounded-xl transition-all cursor-pointer"
                        title="Edit vendor"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
