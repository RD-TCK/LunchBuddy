'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, ShieldAlert, Check, Ban, Settings } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'RESIDENT' | 'ADMIN' | 'VENDOR'>('ALL');
  const [isChangingRole, setIsChangingRole] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        role,
        status,
        properties(name)
      `)
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (data) setUsers(data);
    setLoading(false);
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}? This is a highly sensitive action.`)) return;
    
    setIsChangingRole(userId);
    
    // Call the secure RPC function to bypass RLS and log the action
    const { error } = await supabase.rpc('admin_change_role', {
      target_user_id: userId,
      new_role: newRole
    });

    if (error) {
      alert("Failed to change role: " + error.message);
    } else {
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    
    setIsChangingRole(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER': return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold">Platform Admin</span>;
      case 'ADMIN': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">Hostel Admin</span>;
      case 'VENDOR': return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold">Vendor</span>;
      case 'RESIDENT': return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold">Resident</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold">{role}</span>;
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'ALL' || u.role === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0D1D3A]">User Management</h1>
        <p className="text-gray-500 font-medium mt-1">Global access to all profiles across the platform.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Tabs */}
        <div className="flex px-4 border-b border-slate-100 bg-slate-50 pt-2">
          {['ALL', 'RESIDENT', 'ADMIN', 'VENDOR'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-[#0D1D3A] text-[#0D1D3A]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'ALL' ? 'All Users' : tab + 'S'}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
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
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Super Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading platform users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No users found matching criteria.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0D1D3A]">{user.name || 'No Name'}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{user.properties?.name || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        user.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        user.status === 'INACTIVE' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {user.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'OWNER' && (
                        <div className="flex items-center justify-end gap-2">
                          <select 
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value=""
                            onChange={(e) => {
                              if(e.target.value) handleChangeRole(user.id, e.target.value);
                            }}
                            disabled={isChangingRole === user.id}
                          >
                            <option value="">Change Role...</option>
                            {user.role !== 'RESIDENT' && <option value="RESIDENT">Make Resident</option>}
                            {user.role !== 'ADMIN' && <option value="ADMIN">Make Hostel Admin</option>}
                            {user.role !== 'VENDOR' && <option value="VENDOR">Make Vendor</option>}
                          </select>
                          
                          <button className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors" title="Suspend Account">
                            <Ban size={16} />
                          </button>
                        </div>
                      )}
                      {user.role === 'OWNER' && <span className="text-xs text-gray-400 font-bold italic">Protected</span>}
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
