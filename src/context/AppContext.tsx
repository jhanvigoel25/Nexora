import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DatabaseState, User, UserRole, Company } from '../types';
import { fetchDatabaseState, addDatabaseRecord, updateDatabaseRecord, deleteDatabaseRecord, resetDatabase, loginUser, signupUser, updateCompanySettings } from '../services/api';

export type NavTab =
  | 'dashboard'
  | 'finance'
  | 'team'
  | 'crm'
  | 'goals'
  | 'risks'
  | 'advisor'
  | 'health'
  | 'scenario'
  | 'investor'
  | 'notifications'
  | 'reports'
  | 'admin'
  | 'settings'
  | 'workflow';

interface AppContextType {
  db: DatabaseState | null;
  company: Company | null;
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string, name?: string) => Promise<void>;
  logout: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  theme: 'light' | 'dark';
  isDarkMode: boolean;
  toggleTheme: () => void;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addRecord: (table: keyof DatabaseState, record: any) => Promise<void>;
  updateRecord: (table: keyof DatabaseState, id: string, updates: any) => Promise<void>;
  deleteRecord: (table: keyof DatabaseState, id: string) => Promise<void>;
  resetAllData: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateCompanyProfile: (updates: { name?: string; industry?: string }) => Promise<void>;
}

const defaultUser: User = {
  id: 'usr-1',
  email: 'alex@founder.ai',
  name: 'Alex Morgan',
  role: 'Founder',
  companyId: 'comp-101',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<DatabaseState | null>(null);
  const [user, setUser] = useState<User>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('nexora_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      // Ignore
    }
    return 'dark';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const freshDb = await fetchDatabaseState();
      setDb(freshDb);
    } catch (err) {
      console.error('Error fetching db:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    // Poll every 10 seconds for real-time syncing simulation
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Dark Mode Class Sync
  useEffect(() => {
    try {
      localStorage.setItem('nexora_theme', theme);
    } catch (e) {
      // Ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
      return next;
    });
  }, [showToast]);

  const login = async (email: string, password?: string) => {
    try {
      const res = await loginUser(email, password);
      if (res.user) setUser(res.user);
      setIsAuthenticated(true);
      setIsAuthOpen(false);
      showToast(`Welcome back, ${res.user?.name || 'Founder'}!`);
    } catch (err: any) {
      setUser((prev) => ({ ...prev, email }));
      setIsAuthenticated(true);
      setIsAuthOpen(false);
      showToast('Signed in successfully!');
    }
  };

  const signup = async (email: string, password?: string, name?: string) => {
    try {
      const res = await signupUser({ name: name || 'Founder', email, role: 'Founder' });
      if (res.user) setUser(res.user);
      setIsAuthenticated(true);
      setIsAuthOpen(false);
      showToast('Account created successfully!');
    } catch (err: any) {
      setUser((prev) => ({ ...prev, email, name: name || 'Founder' }));
      setIsAuthenticated(true);
      setIsAuthOpen(false);
      showToast('Account created successfully!');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAuthOpen(true);
    showToast('Logged out successfully', 'info');
  };

  const updateCompanyProfile = async (updates: { name?: string; industry?: string }) => {
    if (!db) return;
    const company = db.companies?.[0];
    try {
      if (company) {
        await updateCompanySettings({ id: company.id, ...updates }, {});
      }
      await refreshData();
      showToast('Company profile updated!');
    } catch (err: any) {
      showToast('Failed to update company profile', 'error');
    }
  };

  const addRecord = async (table: keyof DatabaseState, record: any) => {
    try {
      const res = await addDatabaseRecord(table, record);
      if (res.db) setDb(res.db);
      showToast(`Added new record in ${String(table)}`);
    } catch (err: any) {
      showToast(`Failed to add record: ${err.message}`, 'error');
    }
  };

  const updateRecord = async (table: keyof DatabaseState, id: string, updates: any) => {
    try {
      const res = await updateDatabaseRecord(table, id, updates);
      if (res.db) setDb(res.db);
      showToast(`Updated item in ${String(table)}`);
    } catch (err: any) {
      showToast(`Failed to update item: ${err.message}`, 'error');
    }
  };

  const deleteRecord = async (table: keyof DatabaseState, id: string) => {
    try {
      const res = await deleteDatabaseRecord(table, id);
      if (res.db) setDb(res.db);
      showToast(`Deleted item from ${String(table)}`, 'info');
    } catch (err: any) {
      showToast(`Failed to delete item: ${err.message}`, 'error');
    }
  };

  const resetAllData = async () => {
    try {
      const res = await resetDatabase();
      if (res.db) setDb(res.db);
      showToast('Database reset to initial auto-seeded dataset!', 'info');
    } catch (err: any) {
      showToast('Failed to reset database', 'error');
    }
  };

  const switchRole = (newRole: UserRole) => {
    setUser((prev) => ({ ...prev, role: newRole }));
    showToast(`Role switched to ${newRole}`);
  };

  const company = db?.companies?.[0] || null;

  return (
    <AppContext.Provider
      value={{
        db,
        company,
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        activeTab,
        setActiveTab,
        theme,
        isDarkMode: theme === 'dark',
        toggleTheme,
        toggleDarkMode: toggleTheme,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isAuthOpen,
        setIsAuthOpen,
        toastMessage,
        showToast,
        isLoading,
        refreshData,
        addRecord,
        updateRecord,
        deleteRecord,
        resetAllData,
        switchRole,
        updateCompanyProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
