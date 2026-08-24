'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity, User, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        profiles(name, email, role)
      `)
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (data) setLogs(data);
    setLoading(false);
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1D3A]">System Audit Trail</h1>
          <p className="text-gray-500 font-medium mt-1">Immutable chronological log of all highly sensitive platform actions.</p>
        </div>
        <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold flex items-center gap-1.5">
          <ShieldAlert size={14} /> Only visible to Platform Admins
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-600 flex items-center gap-2">
            <Activity size={16} /> Recent Actions
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading audit trail...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="font-bold text-lg text-slate-600">Audit Trail is Empty</p>
              <p className="text-sm">No sensitive actions have been performed yet.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-50/50 transition-colors">
                
                <div className="w-32 shrink-0 border-r border-slate-100 pr-4">
                  <div className="text-xs font-bold text-gray-400">
                    {new Date(log.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-bold text-[#0D1D3A]">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-800 text-white rounded text-[10px] font-bold tracking-wider">
                      {formatAction(log.action)}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      ON {log.entity_type}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700 font-mono bg-slate-50 p-2 rounded border border-slate-100 mt-2 whitespace-pre-wrap">
                    {log.details ? JSON.stringify(log.details, null, 2) : 'No additional details'}
                  </div>
                  
                  <div className="text-xs text-gray-400 font-mono truncate">
                    Entity ID: {log.entity_id}
                  </div>
                </div>

                <div className="w-48 shrink-0 flex items-start gap-2 pt-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-4">
                  <User size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Performed By</div>
                    <div className="font-bold text-[#0D1D3A] text-sm">{log.profiles?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{log.profiles?.role}</div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
