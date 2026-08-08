import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, Trash2, ShieldAlert, DollarSign, Users, Sparkles } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const NotificationsView: React.FC = () => {
  const { db, updateRecord, deleteRecord, showToast } = useApp();

  if (!db) return null;

  const handleMarkAllRead = async () => {
    for (const n of db.notifications.filter((item) => !item.read)) {
      await updateRecord('notifications', n.id, { read: true });
    }
    showToast('All notifications marked as read');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-indigo-500" /> Notifications & Operational Alerts
          </h1>
          <p className="text-sm text-slate-500">
            Real-time feed of system events, risk alerts, revenue milestones, and team updates.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-all flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {db.notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              !n.read
                ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 shrink-0">
                {n.type === 'Risk' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                ) : n.type === 'Revenue' ? (
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">{formatDate(n.createdAt)}</span>
              </div>
            </div>

            <button
              onClick={() => deleteRecord('notifications', n.id)}
              className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
