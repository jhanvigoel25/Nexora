import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ShieldCheck, TrendingUp, Users, Clock, CheckCircle2, Award, Info } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const FounderHealthView: React.FC = () => {
  const { company, db } = useApp();

  if (!company || !db) return null;

  const score = company.healthScore;

  let scoreLabel = 'Excellent';
  let scoreBadgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
  if (score < 50) {
    scoreLabel = 'Critical';
    scoreBadgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
  } else if (score < 70) {
    scoreLabel = 'Average';
    scoreBadgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
  } else if (score < 85) {
    scoreLabel = 'Good';
    scoreBadgeColor = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';
  }

  // Component breakdowns
  const runwayScore = Math.min(100, Math.round((company.runwayMonths / 18) * 100));
  const churnScore = Math.max(0, Math.round(100 - company.customerChurnRate * 15));
  const taskScore = Math.round((db.tasks.filter((t) => t.status === 'Done').length / (db.tasks.length || 1)) * 100);
  const teamScore = Math.round(db.employees.reduce((sum, e) => sum + e.productivityScore, 0) / (db.employees.length || 1));

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Activity className="w-7 h-7 text-emerald-500" /> Startup Health Score & Index
        </h1>
        <p className="text-sm text-slate-500">
          Weighted health composite calculated from cash runway, churn rate, sprint task velocity, and revenue trajectory.
        </p>
      </div>

      {/* Main Gauge Card */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${scoreBadgeColor}`}>
              Status: {scoreLabel}
            </span>
            <span className="text-xs text-slate-400">Updated in Real-Time</span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {company.name} Health Index
          </h2>

          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
            Your score increased <strong className="text-emerald-500">+4 points this month</strong> due to low customer churn ({company.customerChurnRate}%), strong cash runway ({company.runwayMonths} months), and high team sprint task completion velocity.
          </p>
        </div>

        {/* Circular Gauge Representation */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-1000 stroke-current"
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{score}</span>
              <span className="text-xs block text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">Composite Score</span>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metric 1: Runway */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">1. Cash Runway Position (30% Weight)</span>
            <span className="font-bold text-emerald-500">{runwayScore}/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${runwayScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">
            Provides {company.runwayMonths} months of operation. Target is 18+ months.
          </p>
        </div>

        {/* Metric 2: Customer Churn */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">2. Customer Retention & Churn (20% Weight)</span>
            <span className="font-bold text-indigo-500">{churnScore}/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${churnScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">
            Churn rate is {company.customerChurnRate}%. Well below the 3% SaaS danger threshold.
          </p>
        </div>

        {/* Metric 3: Task Velocity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">3. Task Execution & Velocity (25% Weight)</span>
            <span className="font-bold text-sky-500">{taskScore}/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${taskScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">
            {db.tasks.filter((t) => t.status === 'Done').length} out of {db.tasks.length} tasks completed.
          </p>
        </div>

        {/* Metric 4: Team Productivity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">4. Team Output Score (25% Weight)</span>
            <span className="font-bold text-amber-500">{teamScore}/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${teamScore}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">
            50 employees across Engineering, Product, Sales, and Operations.
          </p>
        </div>
      </div>
    </div>
  );
};
