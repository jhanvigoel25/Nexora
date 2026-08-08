import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, Users, Briefcase, DollarSign, ShieldAlert, CheckSquare, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const { db, isSearchOpen, setIsSearchOpen, setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen || !db) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter items
  const matchedCustomers = cleanQuery
    ? db.customers.filter((c) => c.name.toLowerCase().includes(cleanQuery) || c.company.toLowerCase().includes(cleanQuery) || c.email.toLowerCase().includes(cleanQuery)).slice(0, 4)
    : [];

  const matchedEmployees = cleanQuery
    ? db.employees.filter((e) => e.name.toLowerCase().includes(cleanQuery) || e.department.toLowerCase().includes(cleanQuery) || e.role.toLowerCase().includes(cleanQuery)).slice(0, 4)
    : [];

  const matchedTasks = cleanQuery
    ? db.tasks.filter((t) => t.title.toLowerCase().includes(cleanQuery) || t.department.toLowerCase().includes(cleanQuery)).slice(0, 4)
    : [];

  const matchedExpenses = cleanQuery
    ? db.expenses.filter((ex) => ex.vendor.toLowerCase().includes(cleanQuery) || ex.category.toLowerCase().includes(cleanQuery)).slice(0, 4)
    : [];

  const matchedRisks = cleanQuery
    ? db.risks.filter((r) => r.title.toLowerCase().includes(cleanQuery) || r.category.toLowerCase().includes(cleanQuery)).slice(0, 3)
    : [];

  const totalResults = matchedCustomers.length + matchedEmployees.length + matchedTasks.length + matchedExpenses.length + matchedRisks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers, employees, tasks, expenses, risks... (Type 'Stripe', 'Engineering', etc.)"
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="ml-3 text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!cleanQuery && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Start typing to search across your startup database...
            </div>
          )}

          {cleanQuery && totalResults === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No results found for "<span className="text-slate-700 dark:text-slate-200 font-medium">{query}</span>"
            </div>
          )}

          {/* Customers */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <Users className="w-3.5 h-3.5" /> Customers & Leads ({matchedCustomers.length})
              </div>
              <div className="space-y-1">
                {matchedCustomers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveTab('crm');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.name} ({c.company})</div>
                      <div className="text-xs text-slate-500">{c.email} • {c.industry}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(c.dealValue)}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Employees */}
          {matchedEmployees.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <Briefcase className="w-3.5 h-3.5" /> Team ({matchedEmployees.length})
              </div>
              <div className="space-y-1">
                {matchedEmployees.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      setActiveTab('team');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={e.avatar} alt={e.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{e.name}</div>
                        <div className="text-xs text-slate-500">{e.role} • {e.department}</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      Score: {e.productivityScore}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <CheckSquare className="w-3.5 h-3.5" /> Tasks ({matchedTasks.length})
              </div>
              <div className="space-y-1">
                {matchedTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab('team');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.title}</div>
                      <div className="text-xs text-slate-500">Assigned: {t.assigneeName} • Status: {t.status}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${t.priority === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {t.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Expenses */}
          {matchedExpenses.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <DollarSign className="w-3.5 h-3.5" /> Finance ({matchedExpenses.length})
              </div>
              <div className="space-y-1">
                {matchedExpenses.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      setActiveTab('finance');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{ex.vendor}</div>
                      <div className="text-xs text-slate-500">{ex.category} • {ex.date}</div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(ex.amount)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
