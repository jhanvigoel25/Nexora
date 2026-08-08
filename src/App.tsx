import React from 'react';
import { AppProvider, useApp, NavTab } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Toast } from './components/Toast';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { FinanceView } from './views/FinanceView';
import { TeamView } from './views/TeamView';
import { CRMView } from './views/CRMView';
import { GoalsView } from './views/GoalsView';
import { RiskCenterView } from './views/RiskCenterView';
import { AIAdvisorView } from './views/AIAdvisorView';
import { FounderHealthView } from './views/FounderHealthView';
import { ScenarioSimulatorView } from './views/ScenarioSimulatorView';
import { InvestorView } from './views/InvestorView';
import { NotificationsView } from './views/NotificationsView';
import { ReportsView } from './views/ReportsView';
import { AdminView } from './views/AdminView';
import { SettingsView } from './views/SettingsView';
import { WorkflowView } from './views/WorkflowView';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activeTab, isLoading } = useApp();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'finance':
        return <FinanceView />;
      case 'team':
        return <TeamView />;
      case 'crm':
        return <CRMView />;
      case 'goals':
        return <GoalsView />;
      case 'risks':
        return <RiskCenterView />;
      case 'advisor':
        return <AIAdvisorView />;
      case 'health':
        return <FounderHealthView />;
      case 'scenario':
        return <ScenarioSimulatorView />;
      case 'investor':
        return <InvestorView />;
      case 'notifications':
        return <NotificationsView />;
      case 'reports':
        return <ReportsView />;
      case 'admin':
        return <AdminView />;
      case 'settings':
        return <SettingsView />;
      case 'workflow':
        return <WorkflowView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors overflow-x-hidden">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col justify-between">
          <div>
            {isLoading && (
              <div className="p-3 mb-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-ping"></span>
                <span>Syncing live cloud database tables...</span>
              </div>
            )}

            {renderView()}
          </div>

          {/* Minimal Footer Status Bar */}
          <footer className="mt-12 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 text-[11px] text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 font-normal">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 dark:text-zinc-500">System:</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">v2.4 Minimal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 dark:text-zinc-500">Sync:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Live</span>
              </div>
            </div>
            <div className="text-zinc-400 dark:text-zinc-500">
              FounderOS Decision Engine
            </div>
          </footer>
        </main>
      </div>

      <GlobalSearchModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
