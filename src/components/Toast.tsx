import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-slate-900/90 text-slate-100 border-emerald-500/30 dark:bg-slate-800 dark:border-emerald-500/40',
    error: 'bg-slate-900/90 text-slate-100 border-rose-500/30 dark:bg-slate-800 dark:border-rose-500/40',
    info: 'bg-slate-900/90 text-slate-100 border-indigo-500/30 dark:bg-slate-800 dark:border-indigo-500/40',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-bounce-in max-w-md">
      <div className={`flex items-center gap-3 ${bgStyles[toastMessage.type]}`}>
        {icons[toastMessage.type]}
        <span className="text-sm font-medium tracking-wide">{toastMessage.text}</span>
      </div>
    </div>
  );
};
