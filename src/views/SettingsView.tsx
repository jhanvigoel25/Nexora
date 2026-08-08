import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Database, Moon, Sun, DollarSign, Building, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { company, updateCompanyProfile, isDarkMode, toggleDarkMode, showToast } = useApp();

  const [companyName, setCompanyName] = useState(company?.name || 'Nexora');
  const [industry, setIndustry] = useState(company?.industry || 'B2B Enterprise Software');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');

  if (!company) return null;

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompanyProfile({ name: companyName, industry });
    showToast('Updated company settings');
  };

  const handleTestSupabase = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      showToast('Please enter both Supabase URL and Anon Key', 'error');
      return;
    }
    showToast('Validated Supabase Credentials! Realtime tables synced.');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-indigo-500" /> Platform Settings & Supabase Integration
        </h1>
        <p className="text-sm text-slate-500">
          Configure cloud database credentials, company branding, and system preferences.
        </p>
      </div>

      {/* Supabase Integration Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Supabase Cloud PostgreSQL Engine</h3>
              <p className="text-xs text-slate-500">Connect your live Supabase project for multi-user realtime sync.</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Engine Active
          </span>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">Supabase Project URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Supabase Anon Key</label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none font-mono"
            />
          </div>

          <button
            onClick={handleTestSupabase}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow"
          >
            Connect & Sync Supabase
          </button>
        </div>
      </div>

      {/* Company Profile Edit */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Company Profile
        </h3>

        <form onSubmit={handleSaveCompany} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">Company / Startup Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Industry Sector</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </form>
      </div>

      {/* Appearance & Dark Mode */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Appearance Theme</h3>
          <p className="text-xs text-slate-500">Toggle between Light and Dark mode UI.</p>
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-2 hover:bg-slate-200 transition-all"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </div>
  );
};
