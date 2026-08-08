import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Sun, Moon, Shield, ChevronDown, Check, LogOut, RefreshCw, Zap, Building, GitCommit } from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    company,
    user,
    theme,
    toggleTheme,
    setIsSearchOpen,
    switchRole,
    activeTab,
    setActiveTab,
    db,
    refreshData,
    logout,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const roles: UserRole[] = [
    'Founder',
    'Co-Founder',
    'Finance Manager',
    'Operations Manager',
    'HR',
    'Investor (Read Only)',
    'Admin',
  ];

  const unreadNotifsCount = db?.notifications?.filter((n) => !n.read).length || 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/90 dark:border-zinc-800/90 transition-colors select-none shadow-xs">
      {/* Left: Logo & Search Trigger */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white flex items-center justify-center font-extrabold text-sm tracking-tight shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              N<span className="text-cyan-300 font-mono text-[10px] leading-none -mt-1 font-bold">›</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-white dark:border-zinc-900 animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Nexora
              </span>
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Know What’s Next
              </span>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-mono">LIVE ENGINE</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium hidden md:block lg:hidden">Know What’s Next</p>
          </div>
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/80 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 text-zinc-500 dark:text-zinc-400 text-xs font-medium transition-all border border-zinc-200/80 dark:border-zinc-700/60"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span>Quick search...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-400 font-bold">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Flowchart Guide Button */}
        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            activeTab === 'workflow'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20'
          }`}
          title="Open FounderOS Flowchart & Usage Guide"
        >
          <GitCommit className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Flowchart</span>
        </button>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200/80 dark:border-zinc-700/60 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>{user.role}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 py-1.5 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Switch Role Permissions
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
                >
                  <span>{r}</span>
                  {user.role === r && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sync / Refresh */}
        <button
          onClick={refreshData}
          title="Refresh Live DB Sync"
          className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Light/Dark Theme"
          className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4 text-zinc-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-700 transition-all"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 z-50">
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsProfileOpen(false);
                }}
                className="w-full px-4 py-2 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
              >
                <Building className="w-3.5 h-3.5 text-zinc-400" />
                <span>Company Settings & Supabase</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                }}
                className="w-full px-4 py-2 text-xs text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
