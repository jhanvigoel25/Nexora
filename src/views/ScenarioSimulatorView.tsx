import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GitFork, ArrowRight, TrendingUp, TrendingDown, Clock, Activity, Check, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { simulateScenario } from '../services/api';

export const ScenarioSimulatorView: React.FC = () => {
  const { company, showToast } = useApp();

  const [newHires, setNewHires] = useState<number>(3);
  const [avgSalary, setAvgSalary] = useState<number>(120000);
  const [marketingDelta, setMarketingDelta] = useState<number>(25000);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(10);
  const [fundingAmount, setFundingAmount] = useState<number>(1000000);

  const [simulation, setSimulation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!company) return null;

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await simulateScenario({
        name: 'Expansion Scenario',
        hireEmployeesCount: newHires,
        avgHireSalary: avgSalary,
        marketingSpendIncrease: marketingDelta,
        priceChangePct: priceChangePercent,
        churnChangePct: 0,
      });

      setSimulation(res);
      showToast('Simulation calculated successfully!');
    } catch (err: any) {
      showToast('Simulation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <GitFork className="w-7 h-7 text-amber-500" /> Strategic Scenario Simulator
        </h1>
        <p className="text-sm text-slate-500">
          Model decision impacts on cash runway, net burn, revenue trajectory, and founder health before executing real changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Column */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Decision Variables
          </h3>

          <div className="space-y-3 text-xs">
            {/* Variable 1: New Hires */}
            <div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                <span>Hire New Team Members</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{newHires} Employees</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={newHires}
                onChange={(e) => setNewHires(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Variable 2: Avg Salary */}
            <div>
              <label className="block text-slate-500 mb-1">Avg Salary per Hire ($ / Year)</label>
              <input
                type="number"
                value={avgSalary}
                onChange={(e) => setAvgSalary(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Variable 3: Marketing Spend */}
            <div>
              <label className="block text-slate-500 mb-1">Additional Monthly Growth / Marketing ($)</label>
              <input
                type="number"
                value={marketingDelta}
                onChange={(e) => setMarketingDelta(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Variable 4: Price Change */}
            <div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                <span>Pricing Adjustment (%)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+{priceChangePercent}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                value={priceChangePercent}
                onChange={(e) => setPriceChangePercent(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Variable 5: Funding Raised */}
            <div>
              <label className="block text-slate-500 mb-1">Inject New Equity Funding ($)</label>
              <input
                type="number"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitFork className="w-4 h-4" />}
              <span>Simulate Before & After</span>
            </button>
          </div>
        </div>

        {/* Results Comparison Column */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Simulated Impact Results
          </h3>

          {!simulation ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <GitFork className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-sm font-semibold">Click "Simulate Before & After" to execute scenario models.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Runway Comparison */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Cash Runway</div>
                  <div className="text-xs font-bold text-slate-400 mt-1">Current: {company.runwayMonths} Months</div>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-400" />

                <div className="text-right">
                  <div className="text-xs text-slate-500">Simulated Target</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {simulation.newRunwayMonths} Months
                  </div>
                </div>
              </div>

              {/* Monthly Revenue Comparison */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Monthly Revenue (MRR)</div>
                  <div className="text-xs font-bold text-slate-400 mt-1">Current: {formatCurrency(company.monthlyRevenue)}</div>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-400" />

                <div className="text-right">
                  <div className="text-xs text-slate-500">Simulated Target</div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(simulation.newRevenue)}
                  </div>
                </div>
              </div>

              {/* Monthly Expenses Comparison */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Monthly Expenses</div>
                  <div className="text-xs font-bold text-slate-400 mt-1">Current: {formatCurrency(company.monthlyExpenses)}</div>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-400" />

                <div className="text-right">
                  <div className="text-xs text-slate-500">Simulated Target</div>
                  <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
                    {formatCurrency(simulation.newExpenses)}
                  </div>
                </div>
              </div>

              {/* Health Score Comparison */}
              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Health Index Impact</div>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                    Current: {company.healthScore} / 100
                  </div>
                </div>

                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300">
                  {simulation.newHealthScore} / 100
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
