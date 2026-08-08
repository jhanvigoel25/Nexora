import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Activity,
  Award,
  Zap,
} from 'lucide-react';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';

export const DashboardView: React.FC = () => {
  const { db, company, setActiveTab } = useApp();

  if (!db || !company) return null;

  // Prepare chart data for Revenue vs Expense history
  const monthlyDataMap: Record<string, { month: string; revenue: number; expense: number; profit: number }> = {};

  db.revenue.forEach((r) => {
    const monthKey = r.date.slice(0, 7); // YYYY-MM
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = { month: monthKey, revenue: 0, expense: 0, profit: 0 };
    }
    monthlyDataMap[monthKey].revenue += r.amount;
  });

  db.expenses.forEach((e) => {
    const monthKey = e.date.slice(0, 7);
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = { month: monthKey, revenue: 0, expense: 0, profit: 0 };
    }
    monthlyDataMap[monthKey].expense += e.amount;
  });

  const chartData = Object.values(monthlyDataMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12)
    .map((item) => ({
      ...item,
      profit: item.revenue - item.expense,
      monthLabel: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
    }));

  // Customer Growth & Pipeline Data
  const customersByIndustryMap: Record<string, number> = {};
  db.customers.forEach((c) => {
    customersByIndustryMap[c.industry] = (customersByIndustryMap[c.industry] || 0) + 1;
  });
  const customerChartData = Object.entries(customersByIndustryMap).map(([industry, count]) => ({
    industry,
    count,
  }));

  // Task Status Pie
  const doneTasks = db.tasks.filter((t) => t.status === 'Done').length;
  const inProgTasks = db.tasks.filter((t) => t.status === 'In Progress').length;
  const toDoTasks = db.tasks.filter((t) => t.status === 'To Do').length;

  const taskPieData = [
    { name: 'Done', value: doneTasks, color: '#10b981' },
    { name: 'In Progress', value: inProgTasks, color: '#6366f1' },
    { name: 'To Do', value: toDoTasks, color: '#f59e0b' },
  ];

  const activeRisks = db.risks.filter((r) => r.status === 'Active');

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Top AI Strategy Brief Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white p-6 border border-indigo-500/30 shadow-xl dark:shadow-indigo-950/20">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 animate-pulse text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">AI Executive Strategy Brief</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Intelligence
                </span>
              </div>
              <p className="text-xs md:text-sm text-zinc-200 mt-2 leading-relaxed">
                "{company.name} health score is optimal at <span className="text-indigo-300 font-bold font-mono">{company.healthScore}/100</span> with <span className="text-emerald-400 font-bold font-mono">{company.runwayMonths} months</span> of cash runway. Shifting 15% spend from Meta to LinkedIn can increase Enterprise pipeline by +18%."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 z-10 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
            <button
              onClick={() => setActiveTab('advisor')}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" /> Execute Strategy
            </button>
            <button
              onClick={() => setActiveTab('scenario')}
              className="px-4 py-2.5 border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-all"
            >
              Simulate Scenario
            </button>
          </div>
        </div>
      </div>

      {/* Top KPI Metric Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 - ARR */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 p-5 rounded-2xl shadow-sm hover:border-indigo-500/40 transition-all glow-card">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Annual Recurring Revenue</p>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white tracking-tight">{formatCurrency(company.monthlyRevenue * 12)}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              +{company.mrrGrowthRate}%
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 flex items-center justify-between">
            <span>Monthly MRR:</span>
            <span className="font-semibold font-mono text-zinc-700 dark:text-zinc-300">{formatCurrency(company.monthlyRevenue)}</span>
          </p>
        </div>

        {/* Metric 2 - Net Burn Rate */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 p-5 rounded-2xl shadow-sm hover:border-rose-500/40 transition-all glow-card">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Monthly Net Burn Rate</p>
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white tracking-tight">{formatCurrency(company.burnRate)}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">-3.1%</span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 flex items-center justify-between">
            <span>Expenses:</span>
            <span className="font-semibold font-mono text-zinc-700 dark:text-zinc-300">{formatCurrency(company.monthlyExpenses)}</span>
          </p>
        </div>

        {/* Metric 3 - Cash Runway */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 p-5 rounded-2xl shadow-sm hover:border-emerald-500/40 transition-all glow-card-emerald">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Cash Runway</p>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white tracking-tight">{company.runwayMonths} <span className="text-xs text-zinc-400 font-sans">mo</span></span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">Stable</span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 flex items-center justify-between">
            <span>Cash Reserve:</span>
            <span className="font-semibold font-mono text-zinc-700 dark:text-zinc-300">{formatCurrency(company.cashBalance)}</span>
          </p>
        </div>

        {/* Metric 4 - Health Score */}
        <div className="bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 dark:from-indigo-950/30 dark:via-zinc-900 dark:to-zinc-900 border border-indigo-200/80 dark:border-indigo-500/30 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Health Score</p>
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-600/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold font-mono text-indigo-950 dark:text-indigo-100 tracking-tight">{company.healthScore}<span className="text-xs text-indigo-400 font-sans">/100</span></span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Excellent</span>
          </div>
          <p className="text-[11px] text-indigo-600/80 dark:text-indigo-300/80 mt-2 flex items-center justify-between">
            <span>Status:</span>
            <span className="font-bold text-indigo-900 dark:text-indigo-200">Prime Condition</span>
          </p>
        </div>
      </div>

      {/* Main Visualized Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Block */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Revenue & Expense Trajectory
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Historical financial trajectory and monthly operating margins</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Expense</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" strokeOpacity={0.2} />
                <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#71717a' }} tickFormatter={(val) => `$${formatCompactNumber(val)}`} />
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val), '']}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Risk Block */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Operational Risk Center
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                {activeRisks.length} Active Risks
              </span>
            </div>

            <div className="space-y-3">
              {activeRisks.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    r.riskLevel === 'Critical'
                      ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                      : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        r.riskLevel === 'Critical' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {r.riskLevel}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">Active</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-2">{r.title}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">{r.metricImpact}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('risks')}
            className="mt-5 w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-xl transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            Review All Operational Risks
          </button>
        </div>
      </div>

      {/* Customer Pipeline & Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Breakdown */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Customer Sector Distribution</h3>
            <button onClick={() => setActiveTab('crm')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View CRM
            </button>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" strokeOpacity={0.2} />
                <XAxis dataKey="industry" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '10px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Velocity */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Task Velocity & Execution</h3>
            <button onClick={() => setActiveTab('team')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Open Kanban
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 my-3 text-center">
            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 font-mono">Completed</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{doneTasks}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
              <div className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 font-mono">In Progress</div>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">{inProgTasks}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 font-mono">To Do</div>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{toDoTasks}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-zinc-50 to-indigo-50/40 dark:from-zinc-800/80 dark:to-indigo-950/30 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">50 Active Team Members</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Execution Efficiency: 88.4%</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
