// plus1-rewards/src/components/admin/AdminNotifications.tsx
import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../../lib/supabase';

interface Notification {
  id: string;
  type: string;
  member_name: string;
  member_phone: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  created_at: string;
  metadata?: {
    progress_percent?: number;
    missing_fields?: string[];
  };
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('admin_notifications')
        .select('*')
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabaseAdmin
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', id);

      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabaseAdmin
        .from('admin_notifications')
        .update({ read: true })
        .eq('read', false);

      setNotifications([]);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) return null;
  if (notifications.length === 0) return null;

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl">notifications_active</span>
            <div>
              <h3 className="text-xl font-black">Action Required</h3>
              <p className="text-yellow-50 text-sm">{notifications.length} member(s) need attention</p>
            </div>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-lg transition-all text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="divide-y divide-yellow-200">
          {displayedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-yellow-50/50 transition-colors ${
                notification.priority === 'high' ? 'bg-red-50/30' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notification.priority === 'high' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">
                      {notification.priority === 'high' ? 'priority_high' : 'warning'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-black text-gray-900 text-lg">
                        {notification.member_name}
                      </h4>
                      {notification.priority === 'high' && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full uppercase">
                          Urgent
                        </span>
                      )}
                      {notification.metadata?.progress_percent && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                          {notification.metadata.progress_percent.toFixed(0)}% Complete
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {notification.message}
                    </p>

                    {notification.metadata?.missing_fields && (
                      <div className="bg-white border border-yellow-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-bold text-gray-600 mb-2">Missing Fields:</p>
                        <div className="flex flex-wrap gap-2">
                          {notification.metadata.missing_fields.map((field, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <a
                        href={`tel:${notification.member_phone}`}
                        className="inline-flex items-center gap-2 bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-lg transition-all text-sm"
                      >
                        <span className="material-symbols-outlined text-lg">call</span>
                        Call {notification.member_phone}
                      </a>

                      <p className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  title="Mark as read"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {notifications.length > 3 && (
          <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-3 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[#1a558b] hover:text-[#1a558b]/80 font-bold text-sm"
            >
              {showAll ? 'Show Less' : `Show ${notifications.length - 3} More`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
