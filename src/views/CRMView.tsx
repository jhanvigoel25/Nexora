import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  Trash2,
  Edit,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Customer } from '../types';

export const CRMView: React.FC = () => {
  const { db, addRecord, updateRecord, deleteRecord, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [industryFilter, setIndustryFilter] = useState<string>('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: 'Fintech',
    dealValue: '15000',
    leadStatus: 'Lead' as Customer['leadStatus'],
    leadSource: 'Outbound Sales' as Customer['leadSource'],
  });

  if (!db) return null;

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) {
      showToast('Name and Company are required', 'error');
      return;
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: formData.name,
      email: formData.email || `contact@${formData.company.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: '+1 (555) 234-5678',
      company: formData.company,
      industry: formData.industry,
      leadSource: formData.leadSource,
      dealValue: Number(formData.dealValue) || 15000,
      leadStatus: formData.leadStatus,
      lifetimeValue: (Number(formData.dealValue) || 15000) * 2.5,
      isChurned: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    await addRecord('customers', newCustomer);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', company: '', industry: 'Fintech', dealValue: '15000', leadStatus: 'Lead', leadSource: 'Outbound Sales' });
  };

  const handleUpdateStatus = async (customerId: string, newStatus: Customer['leadStatus']) => {
    await updateRecord('customers', customerId, { leadStatus: newStatus });
  };

  const cleanSearch = search.toLowerCase().trim();

  const filteredCustomers = db.customers.filter((c) => {
    const matchesQuery =
      !cleanSearch ||
      c.name.toLowerCase().includes(cleanSearch) ||
      c.company.toLowerCase().includes(cleanSearch) ||
      c.email.toLowerCase().includes(cleanSearch);

    const matchesStatus = statusFilter === 'All' || c.leadStatus === statusFilter;
    const matchesIndustry = industryFilter === 'All' || c.industry === industryFilter;

    return matchesQuery && matchesStatus && matchesIndustry;
  });

  const totalPipelineValue = db.customers.reduce((sum, c) => sum + c.dealValue, 0);
  const totalLTV = db.customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const closedWonCount = db.customers.filter((c) => c.leadStatus === 'Closed Won').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Customer CRM & Pipeline Management
          </h1>
          <p className="text-sm text-slate-500">
            Real-time database of {db.customers.length} customer records, pipeline deals, CLV analytics, and lead sources.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Lead / Customer
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Total Pipeline Deal Value</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {formatCurrency(totalPipelineValue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across {db.customers.length} Accounts</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Customer Lifetime Value (LTV)</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalLTV)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Avg LTV: {formatCurrency(totalLTV / (db.customers.length || 1))}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Closed Won Conversion Rate</div>
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {((closedWonCount / (db.customers.length || 1)) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{closedWonCount} Won Contracts</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, company, email..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="All">All Lead Statuses</option>
            <option value="Lead">Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Demo / Proposal">Demo / Proposal</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="All">All Industries</option>
            <option value="Fintech">Fintech</option>
            <option value="SaaS">SaaS</option>
            <option value="AI / ML">AI / ML</option>
            <option value="Healthcare">Healthcare</option>
            <option value="E-Commerce">E-Commerce</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
          Showing {filteredCustomers.length} of {db.customers.length} Records
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Customer & Company</th>
                <th className="p-3.5">Industry</th>
                <th className="p-3.5">Lead Source</th>
                <th className="p-3.5">Deal Value</th>
                <th className="p-3.5">Lifetime Value</th>
                <th className="p-3.5">Pipeline Stage</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredCustomers.slice(0, 40).map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-medium">
                    <div className="text-slate-900 dark:text-slate-100">{cust.name}</div>
                    <div className="text-[11px] text-slate-400">{cust.company} • {cust.email}</div>
                  </td>
                  <td className="p-3.5">{cust.industry}</td>
                  <td className="p-3.5 text-slate-500">{cust.leadSource}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(cust.dealValue)}</td>
                  <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(cust.lifetimeValue)}</td>
                  <td className="p-3.5">
                    <select
                      value={cust.leadStatus}
                      onChange={(e) => handleUpdateStatus(cust.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Demo / Proposal">Demo / Proposal</option>
                      <option value="Closed Won">Closed Won</option>
                      <option value="Closed Lost">Closed Lost</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => deleteRecord('customers', cust.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Add New Customer / Lead
            </h3>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Acme SaaS Inc"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Deal Value ($)</label>
                <input
                  type="number"
                  value={formData.dealValue}
                  onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Fintech">Fintech</option>
                  <option value="SaaS">SaaS</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-Commerce">E-Commerce</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
