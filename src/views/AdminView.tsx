import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, RefreshCw, Users, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { user, db, resetDatabase, showToast } = useApp();
  const [isResetting, setIsResetting] = useState(false);

  if (!db) return null;

  const handleResetSeed = async () => {
    if (!window.confirm('Are you sure you want to re-seed the entire database with fresh 24-month startup data? Custom additions will be reset.')) {
      return;
    }

    setIsResetting(true);
    try {
      await resetDatabase();
      showToast('Database successfully re-seeded with 500 customers and 24 months of metrics!');
    } catch (err: any) {
      showToast('Failed to reset database', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Shield className="w-7 h-7 text-indigo-500" /> Admin Panel & System Control
        </h1>
        <p className="text-sm text-slate-500">
          User permissions, audit logs, and master database re-seeding controls.
        </p>
      </div>

      {/* Database Reset Action Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-500" /> Database Reset & Seed Control
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-lg">
            Re-populates the database with 24 months of revenue history, 500 customers, 50 employees, 10 OKRs, and active operational risks.
          </p>
        </div>

        <button
          onClick={handleResetSeed}
          disabled={isResetting}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all shrink-0 flex items-center gap-2"
        >
          {isResetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>Re-Seed Database</span>
        </button>
      </div>

      {/* User Roles Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          User Access & Permission Roles
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{user?.name || 'Alex Morgan'}</td>
                <td className="p-3 text-slate-500">{user?.email || 'alex@apexos.com'}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold">Admin</span></td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Active</span></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-medium text-slate-900 dark:text-slate-100">Sarah Jenkins</td>
                <td className="p-3 text-slate-500">sarah.j@apexos.com</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 text-[10px] font-bold">Editor</span></td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Active</span></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-medium text-slate-900 dark:text-slate-100">David Miller</td>
                <td className="p-3 text-slate-500">david.m@apexos.com</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">Viewer</span></td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
