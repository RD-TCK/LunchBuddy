'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, AlertTriangle, Info, Send, Clock, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [targetAudience, setTargetAudience] = useState('ALL');
  const [targetValue, setTargetValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    // MVP Mock: Fetch notifications. In prod, filter by property_id
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (data) {
      setNotifications(data);
    }
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setIsSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    
    // We need the admin's property_id to link the notification.
    const { data: profile } = await supabase
      .from('profiles')
      .select('property_id')
      .eq('id', session?.user.id)
      .single();

    if (!profile?.property_id) {
      alert("Error: You are not assigned to a hostel.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('notifications')
      .insert({
        property_id: profile.property_id,
        title,
        message,
        priority,
        target_audience: targetAudience,
        target_value: targetAudience !== 'ALL' ? targetValue : null,
        created_by: session?.user.id
      });

    if (error) {
      alert("Failed to send notification: " + error.message);
    } else {
      // Reset form and refresh list
      setTitle('');
      setMessage('');
      setPriority('NORMAL');
      setTargetAudience('ALL');
      setTargetValue('');
      fetchNotifications();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (!error) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const getPriorityIcon = (p: string) => {
    switch (p) {
      case 'URGENT': return <AlertTriangle className="text-red-500" size={18} />;
      case 'IMPORTANT': return <AlertTriangle className="text-orange-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'URGENT': return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">URGENT</span>;
      case 'IMPORTANT': return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-bold">IMPORTANT</span>;
      default: return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">NORMAL</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0D1D3A]">Communications</h1>
        <p className="text-gray-500 font-medium mt-1">Broadcast announcements and alerts to your residents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COMPOSER */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Bell className="text-slate-500" size={18} />
              <h2 className="text-lg font-bold text-[#0D1D3A]">New Notification</h2>
            </div>
            
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tiffin Delivery Delay" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..." 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold bg-white"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">Urgent (Popup)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Audience</label>
                  <select 
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold bg-white"
                  >
                    <option value="ALL">All Residents</option>
                    <option value="BLOCK">Specific Block</option>
                    <option value="ROOM">Specific Room</option>
                  </select>
                </div>
              </div>

              {targetAudience !== 'ALL' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Specify {targetAudience === 'BLOCK' ? 'Block Name' : 'Room Number'}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder={targetAudience === 'BLOCK' ? 'e.g. Block A' : 'e.g. 204'} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#0D1D3A] text-white font-bold rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {isSubmitting ? 'Sending...' : 'Broadcast Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* HISTORY */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-[#0D1D3A] flex items-center gap-2">
            <Clock className="text-slate-400" size={20} />
            Recent Broadcasts
          </h2>

          <div className="space-y-4">
            {loading ? (
              <div className="p-12 text-center text-gray-400 bg-white rounded-3xl border border-slate-200">Loading history...</div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-gray-400 bg-white rounded-3xl border border-slate-200">No notifications sent yet.</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group relative">
                  
                  <button 
                    onClick={() => handleDelete(notif.id)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Broadcast"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0">
                      {getPriorityIcon(notif.priority)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#0D1D3A] text-lg leading-tight">{notif.title}</h3>
                          {getPriorityBadge(notif.priority)}
                        </div>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{notif.message}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 pt-3 border-t border-slate-100">
                        <span>Target: <span className="text-gray-700">{notif.target_audience === 'ALL' ? 'All Residents' : `${notif.target_audience} ${notif.target_value}`}</span></span>
                        <span>•</span>
                        <span>Sent: {new Date(notif.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
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
