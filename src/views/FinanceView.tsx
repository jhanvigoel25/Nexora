import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  TrendingDown,
  Building,
  CreditCard,
  PieChart as PieIcon,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exporter';

export const FinanceView: React.FC = () => {
  const { db, company, addRecord, updateRecord, deleteRecord, showToast } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'revenue' | 'expenses' | 'pnl' | 'payroll' | 'funding'>('revenue');

  // Modal states for Create / Edit Revenue or Expense
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'revenue' | 'expense'>('revenue');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Subscriptions',
    vendorOrCustomer: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  if (!db || !company) return null;

  const openCreateModal = (type: 'revenue' | 'expense') => {
    setModalType(type);
    setEditingId(null);
    setFormData({
      amount: '',
      category: type === 'revenue' ? 'Subscriptions' : 'Cloud & Infrastructure',
      vendorOrCustomer: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount))) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    const numAmount = Number(formData.amount);

    if (modalType === 'revenue') {
      if (editingId) {
        await updateRecord('revenue', editingId, {
          amount: numAmount,
          category: formData.category,
          customerName: formData.vendorOrCustomer || 'Client',
          date: formData.date,
          notes: formData.notes,
        });
      } else {
        await addRecord('revenue', {
          id: `rev-${Date.now()}`,
          amount: numAmount,
          category: formData.category,
          source: 'Direct Invoice',
          customerName: formData.vendorOrCustomer || 'New Customer',
          date: formData.date,
          isRecurring: true,
          notes: formData.notes,
        });
      }
    } else {
      if (editingId) {
        await updateRecord('expenses', editingId, {
          amount: numAmount,
          category: formData.category,
          vendor: formData.vendorOrCustomer || 'Vendor',
          date: formData.date,
          notes: formData.notes,
        });
      } else {
        await addRecord('expenses', {
          id: `exp-${Date.now()}`,
          amount: numAmount,
          category: formData.category,
          vendor: formData.vendorOrCustomer || 'Vendor',
          date: formData.date,
          paymentMethod: 'Corporate Amex',
          status: 'Paid',
          notes: formData.notes,
        });
      }
    }

    setIsModalOpen(false);
  };

  // Export handlers
  const handleExportCSV = () => {
    if (activeSubTab === 'revenue') {
      exportToCSV('Revenue_Report', db.revenue);
    } else {
      exportToCSV('Expense_Report', db.expenses);
    }
    showToast('Exported CSV file successfully!');
  };

  const handleExportExcel = () => {
    if (activeSubTab === 'revenue') {
      exportToExcel('Revenue_Spreadsheet', 'Revenue', db.revenue);
    } else {
      exportToExcel('Expense_Spreadsheet', 'Expenses', db.expenses);
    }
    showToast('Exported Excel spreadsheet successfully!');
  };

  const handleExportPDF = () => {
    const totalRev = db.revenue.reduce((sum, r) => sum + r.amount, 0);
    const totalExp = db.expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRev - totalExp;

    exportToPDF(
      `${company.name} Financial Report`,
      'Income Statement and Profit & Loss Breakdown',
      [
        { heading: 'Executive Summary', content: `Monthly Recurring Revenue: ${formatCurrency(company.monthlyRevenue)} | Expenses: ${formatCurrency(company.monthlyExpenses)} | Runway: ${company.runwayMonths} Months` },
        { heading: 'Total Revenue Recorded', content: `${formatCurrency(totalRev)} across ${db.revenue.length} transactions` },
        { heading: 'Total Expenses Recorded', content: `${formatCurrency(totalExp)} across ${db.expenses.length} vendor items` },
        { heading: 'Net Cumulative Profit/Loss', content: `${formatCurrency(netProfit)}` },
      ]
    );
    showToast('Generated PDF report!');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Financial Management & P&L
          </h1>
          <p className="text-sm text-slate-500">
            Real-time income, expense line items, payroll, and funding tracking with live database persistence.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreateModal('revenue')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Revenue
          </button>
          <button
            onClick={() => openCreateModal('expense')}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Monthly Revenue (MRR)</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(company.monthlyRevenue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">+{company.mrrGrowthRate}% MoM Growth</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Monthly Expenses</div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(company.monthlyExpenses)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Includes Payroll & Cloud</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Net Cash Flow</div>
          <div className={`text-xl font-bold mt-1 ${company.monthlyRevenue - company.monthlyExpenses >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatCurrency(company.monthlyRevenue - company.monthlyExpenses)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cash Flow Position</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Runway & Cash Balance</div>
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {company.runwayMonths} Months
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{formatCurrency(company.cashBalance)} in Bank</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'revenue', label: `Revenue (${db.revenue.length})` },
            { id: 'expenses', label: `Expenses (${db.expenses.length})` },
            { id: 'pnl', label: 'Profit & Loss Statement' },
            { id: 'payroll', label: `Payroll (${db.payroll.length})` },
            { id: 'funding', label: `Funding (${db.funding.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeSubTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Revenue Table */}
      {activeSubTab === 'revenue' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Customer / Source</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Recurring</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {db.revenue.slice(0, 30).map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">{rev.customerName}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium">
                        {rev.category}
                      </span>
                    </td>
                    <td className="p-3.5">{formatDate(rev.date)}</td>
                    <td className="p-3.5">{rev.isRecurring ? 'Yes (Monthly)' : 'One-time'}</td>
                    <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(rev.amount)}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => deleteRecord('revenue', rev.id)}
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
      )}

      {/* SUB-TAB 2: Expenses Table */}
      {activeSubTab === 'expenses' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Vendor</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {db.expenses.slice(0, 30).map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">{exp.vendor}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-medium">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5">{formatDate(exp.date)}</td>
                    <td className="p-3.5">{exp.paymentMethod}</td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(exp.amount)}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => deleteRecord('expenses', exp.id)}
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
      )}

      {/* SUB-TAB 3: Profit & Loss Statement */}
      {activeSubTab === 'pnl' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Profit & Loss (P&L) Statement
          </h3>

          <div className="space-y-4 text-sm">
            {/* Revenue breakdown */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">1. Revenue & Income</div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between"><span>SaaS Subscriptions</span><span className="font-semibold">{formatCurrency(company.monthlyRevenue * 0.7)}</span></div>
                <div className="flex justify-between"><span>Enterprise Contracts</span><span className="font-semibold">{formatCurrency(company.monthlyRevenue * 0.25)}</span></div>
                <div className="flex justify-between"><span>Consulting Services</span><span className="font-semibold">{formatCurrency(company.monthlyRevenue * 0.05)}</span></div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-slate-900 dark:text-slate-100">
                  <span>Total Gross Revenue</span>
                  <span className="text-emerald-500">{formatCurrency(company.monthlyRevenue)}</span>
                </div>
              </div>
            </div>

            {/* Expense breakdown */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">2. Operating Expenses (OPEX)</div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between"><span>Payroll & Benefits</span><span className="font-semibold">{formatCurrency(company.monthlyExpenses * 0.55)}</span></div>
                <div className="flex justify-between"><span>Cloud Infrastructure & Hosting</span><span className="font-semibold">{formatCurrency(company.monthlyExpenses * 0.22)}</span></div>
                <div className="flex justify-between"><span>Marketing & Customer Acquisition</span><span className="font-semibold">{formatCurrency(company.monthlyExpenses * 0.15)}</span></div>
                <div className="flex justify-between"><span>Software & Subscriptions</span><span className="font-semibold">{formatCurrency(company.monthlyExpenses * 0.08)}</span></div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-slate-900 dark:text-slate-100">
                  <span>Total Operating Expenses</span>
                  <span className="text-rose-500">{formatCurrency(company.monthlyExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex justify-between items-center text-base font-bold">
              <span>Net Monthly Operating Income (EBITDA)</span>
              <span className={company.monthlyRevenue - company.monthlyExpenses >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {formatCurrency(company.monthlyRevenue - company.monthlyExpenses)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Payroll */}
      {activeSubTab === 'payroll' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100">
            Active Payroll Register ({db.payroll.length} Employees Processed)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5">Employee Name</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Monthly Gross</th>
                  <th className="p-3.5">Tax Withheld</th>
                  <th className="p-3.5">Net Salary</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {db.payroll.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-medium">{pay.employeeName}</td>
                    <td className="p-3.5">{pay.department}</td>
                    <td className="p-3.5">{formatCurrency(pay.salaryMonthly)}</td>
                    <td className="p-3.5 text-slate-400">{formatCurrency(pay.taxDeduction)}</td>
                    <td className="p-3.5 font-semibold text-emerald-500">{formatCurrency(pay.netPay)}</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Processed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Funding History */}
      {activeSubTab === 'funding' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Funding History & Cap Table Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {db.funding.map((f) => (
              <div key={f.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{f.roundName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">{f.status}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(f.amount)}</div>
                <div className="text-xs text-slate-500 mt-2">Lead: <span className="font-medium text-slate-700 dark:text-slate-300">{f.leadInvestor}</span></div>
                <div className="text-xs text-slate-500">Post-Money Val: <span className="font-semibold text-indigo-400">{formatCurrency(f.postMoneyValuation)}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Add New {modalType === 'revenue' ? 'Revenue Record' : 'Expense Record'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 15000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {modalType === 'revenue' ? (
                    <>
                      <option value="Subscriptions">Subscriptions</option>
                      <option value="Enterprise Deals">Enterprise Deals</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Ad Tech">Ad Tech</option>
                    </>
                  ) : (
                    <>
                      <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                      <option value="Payroll">Payroll</option>
                      <option value="Marketing & Growth">Marketing & Growth</option>
                      <option value="Software Subscriptions">Software Subscriptions</option>
                      <option value="Office & Admin">Office & Admin</option>
                      <option value="Legal & Tax">Legal & Tax</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">{modalType === 'revenue' ? 'Customer Name' : 'Vendor Name'}</label>
                <input
                  type="text"
                  value={formData.vendorOrCustomer}
                  onChange={(e) => setFormData({ ...formData, vendorOrCustomer: e.target.value })}
                  placeholder={modalType === 'revenue' ? 'Acme Corp' : 'AWS Cloud'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
