import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Briefcase,
  Target,
  ShieldAlert,
  Bot,
  Activity,
  GitFork,
  PieChart,
  Bell,
  FileText,
  Shield,
  Settings,
  GitCommit,
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  category: 'core' | 'intelligence' | 'operations' | 'system';
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, db } = useApp();

  const activeRisksCount = db?.risks?.filter((r) => r.status === 'Active').length || 0;
  const unreadNotifsCount = db?.notifications?.filter((n) => !n.read).length || 0;

  const navItems: NavItem[] = [
    // Core
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, category: 'core' },
    { id: 'finance', label: 'Finance & P&L', icon: <DollarSign className="w-4 h-4" />, category: 'core' },
    { id: 'team', label: 'Team & Kanban', icon: <Users className="w-4 h-4" />, category: 'core' },
    { id: 'crm', label: 'Customer CRM', icon: <Briefcase className="w-4 h-4" />, category: 'core' },
    { id: 'goals', label: 'Goals & OKRs', icon: <Target className="w-4 h-4" />, category: 'core' },

    // Intelligence
    { id: 'advisor', label: 'AI Business Advisor', icon: <Bot className="w-4 h-4 text-indigo-500" />, badge: 'AI', category: 'intelligence' },
    { id: 'workflow', label: 'App Flowchart & Guide', icon: <GitCommit className="w-4 h-4 text-indigo-400" />, badge: 'Flow', category: 'intelligence' },
    { id: 'scenario', label: 'Scenario Simulator', icon: <GitFork className="w-4 h-4 text-amber-500" />, category: 'intelligence' },
    { id: 'health', label: 'Founder Health Score', icon: <Activity className="w-4 h-4 text-emerald-500" />, category: 'intelligence' },
    { id: 'risks', label: 'Risk Center', icon: <ShieldAlert className="w-4 h-4 text-rose-500" />, badge: activeRisksCount > 0 ? `${activeRisksCount}` : undefined, category: 'intelligence' },

    // Operations
    { id: 'investor', label: 'Investor Metrics', icon: <PieChart className="w-4 h-4" />, category: 'operations' },
    { id: 'reports', label: 'Reports & Exports', icon: <FileText className="w-4 h-4" />, category: 'operations' },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : undefined, category: 'operations' },

    // System
    { id: 'admin', label: 'Admin Panel', icon: <Shield className="w-4 h-4" />, category: 'system' },
    { id: 'settings', label: 'Settings & Supabase', icon: <Settings className="w-4 h-4" />, category: 'system' },
  ];

  const categories = [
    { id: 'core', label: 'Core Modules' },
    { id: 'intelligence', label: 'AI & Intelligence' },
    { id: 'operations', label: 'Operations & Reporting' },
    { id: 'system', label: 'System & Admin' },
  ];

  return (
    <aside className="w-60 shrink-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-r border-zinc-200/90 dark:border-zinc-800/90 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 transition-colors select-none shadow-sm z-20">
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {categories.map((cat) => {
          const items = navItems.filter((i) => i.category === cat.id);
          return (
            <div key={cat.id}>
              <div className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 px-3 py-1 tracking-wider font-mono">
                {cat.label}
              </div>
              <div className="space-y-1 mt-1">
                {items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20 dark:shadow-indigo-900/30'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md ${
                            isActive
                              ? 'bg-white/20 text-white backdrop-blur-sm'
                              : item.badge === 'AI'
                              ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                              : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Info / User Bar */}
      <div className="p-3.5 border-t border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/80 dark:bg-zinc-900/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 border border-indigo-400/30 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {db?.company?.name ? db.company.name.slice(0, 2).toUpperCase() : 'NX'}
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-200 truncate">{db?.user?.name || 'Alex Morgan'}</p>
            <p className="text-[10px] text-zinc-500 truncate font-mono">{db?.user?.role || 'Founder'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
