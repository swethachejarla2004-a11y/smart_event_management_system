import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, Sparkles, CheckCircle2, Info } from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'recommendation': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'volunteer': return <CheckCircle2 className="w-5 h-5 text-purple-400" />;
      default: return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            In-App Notifications {unreadCount > 0 && <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">{unreadCount} New</span>}
          </h1>
          <p className="text-xs text-slate-400">Updates on event registrations, volunteer approvals, and AI match alerts.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs border border-indigo-500/20 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl text-slate-400">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-white">No notifications yet</p>
          <p className="text-xs text-slate-400 mt-1">You will be alerted when new events or volunteer approvals occur.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`glass-card p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                n.isRead 
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-75' 
                  : 'bg-slate-900 border-indigo-500/30 shadow-lg'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default NotificationsPage;
