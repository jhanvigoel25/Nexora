import React from 'react';
import { useApp } from '../context/AppContext';
import { PieChart as PieIcon, Download, Sparkles, TrendingUp, DollarSign, Award, ShieldCheck, FileText } from 'lucide-react';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';
import { exportToPDF } from '../utils/exporter';

export const InvestorView: React.FC = () => {
  const { company, db, showToast } = useApp();

  if (!company || !db) return null;

  const arr = company.monthlyRevenue * 12;
  const cac = 450; // $450 CAC
  const avgLtv = db.customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / (db.customers.length || 1);
  const ltvCacRatio = (avgLtv / cac).toFixed(1);

  const handleExportInvestorDeck = () => {
    exportToPDF(
      `${company.name} Investor Pitch Metrics Report`,
      'Confidential Financial Performance & Key SaaS Metrics',
      [
        { heading: '1. Executive Summary & Traction', content: `Annual Recurring Revenue (ARR): ${formatCurrency(arr)} | MRR: ${formatCurrency(company.monthlyRevenue)} (+${company.mrrGrowthRate}% MoM Growth)` },
        { heading: '2. Unit Economics & LTV', content: `LTV:CAC Ratio: ${ltvCacRatio}x | Avg Customer Lifetime Value: ${formatCurrency(avgLtv)} | Customer Acquisition Cost: $${cac}` },
        { heading: '3. Runway & Burn Metrics', content: `Cash Balance: ${formatCurrency(company.cashBalance)} | Runway: ${company.runwayMonths} Months | Net Burn: ${formatCurrency(company.burnRate)}` },
        { heading: '4. Capitalization Table', content: `Active Funding Rounds: Series A in progress ($10,000,000 Post-Money)` },
      ]
    );
    showToast('Exported Investor Deck PDF!');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <PieIcon className="w-7 h-7 text-indigo-500" /> Investor-Ready Dashboard & Metrics
          </h1>
          <p className="text-sm text-slate-500">
            Real-time SaaS unit economics, LTV:CAC ratios, ARR trajectory, and cap table for board updates.
          </p>
        </div>

        <button
          onClick={handleExportInvestorDeck}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
        >
          <FileText className="w-4 h-4" /> Export Investor Deck PDF
        </button>
      </div>

      {/* Top Investor Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Annual Recurring Revenue (ARR)</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {formatCurrency(arr)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">+{company.mrrGrowthRate}% MoM Acceleration</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">LTV : CAC Ratio</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {ltvCacRatio}x
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Benchmark: &gt;3.0x Healthy</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Gross Profit Margin</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            82.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">SaaS Industry Elite</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Cash Balance & Runway</div>
          <div className="text-2xl font-black text-sky-500 mt-1">
            {company.runwayMonths} Mo
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{formatCurrency(company.cashBalance)}</div>
        </div>
      </div>

      {/* Board Update Narrative */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Monthly Board & Investor Update Highlights
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            <strong>Key Highlights:</strong> {company.name} closed the month at <span className="font-bold text-indigo-600">{formatCurrency(company.monthlyRevenue)} MRR</span> ({formatCurrency(arr)} ARR), growing at +{company.mrrGrowthRate}% MoM. Customer acquisition efficiency remains strong with an LTV:CAC ratio of <span className="font-bold text-emerald-500">{ltvCacRatio}x</span>.
          </p>
          <p>
            <strong>Burn & Capital Runway:</strong> Current cash balance stands at <span className="font-bold">{formatCurrency(company.cashBalance)}</span>, providing {company.runwayMonths} months of runway at current net burn rate of {formatCurrency(company.burnRate)}/mo.
          </p>
        </div>
      </div>
    </div>
  );
};
