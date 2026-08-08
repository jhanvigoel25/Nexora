import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GitCommit,
  ArrowRight,
  Sparkles,
  DollarSign,
  Users,
  Briefcase,
  Target,
  ShieldAlert,
  Bot,
  Activity,
  GitFork,
  FileText,
  PieChart,
  CheckCircle2,
  HelpCircle,
  Play,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface FlowNode {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  category: 'Setup' | 'Finance' | 'Execution' | 'Intelligence' | 'Governance' | 'Reporting';
  icon: React.ReactNode;
  navTab: any;
  color: string;
  borderColor: string;
  badgeBg: string;
  description: string;
  inputs: string[];
  outputs: string[];
  roles: string[];
}

export const WorkflowView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('step-1');
  const [filterRole, setFilterRole] = useState<string>('All');

  const nodes: FlowNode[] = [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Company Setup & RBAC',
      subtitle: 'Profile & Role Switcher',
      category: 'Setup',
      icon: <Layers className="w-5 h-5" />,
      navTab: 'settings',
      color: 'from-blue-600 to-indigo-600',
      borderColor: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-500/10 text-indigo-400',
      description: 'Initialize your startup profile, configure industry verticals, and switch roles (Founder, Executive, Investor) to test RBAC permissions.',
      inputs: ['Company Name & Industry', 'Cash Reserve & Target Runway', 'User Persona Role'],
      outputs: ['Configured Startup Profile', 'Role-Specific Dashboard View'],
      roles: ['Founder', 'Co-Founder', 'Executive', 'Investor'],
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Financial Ledger & Burn',
      subtitle: 'P&L & Runway Tracking',
      category: 'Finance',
      icon: <DollarSign className="w-5 h-5" />,
      navTab: 'finance',
      color: 'from-emerald-600 to-teal-600',
      borderColor: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/10 text-emerald-400',
      description: 'Record recurring revenue, log operating expenses, calculate monthly net burn rate, and monitor exact cash runway in months.',
      inputs: ['Monthly Recurring Revenue (MRR)', 'Operating Expenses & Payroll', 'Cash Reserve Balance'],
      outputs: ['Net Burn Rate ($/mo)', 'Cash Runway (Months)', 'ARR Trajectory Chart'],
      roles: ['Founder', 'Executive'],
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Customer CRM & Pipeline',
      subtitle: 'Deal Stages & Churn Risk',
      category: 'Execution',
      icon: <Briefcase className="w-5 h-5" />,
      navTab: 'crm',
      color: 'from-amber-600 to-orange-600',
      borderColor: 'border-amber-500/30',
      badgeBg: 'bg-amber-500/10 text-amber-400',
      description: 'Manage B2B enterprise accounts across pipeline stages (Lead, Proposal, Closed Won), track contract sizes, and monitor churn risks.',
      inputs: ['Account Name & Value', 'Deal Pipeline Stage', 'Industry Sector'],
      outputs: ['Total Pipeline Value', 'Closed Won ARR Contribution', 'Sector Distribution'],
      roles: ['Founder', 'Co-Founder', 'Executive'],
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Team Kanban & OKRs',
      subtitle: 'Task Velocity & Goals',
      category: 'Execution',
      icon: <Users className="w-5 h-5" />,
      navTab: 'team',
      color: 'from-violet-600 to-purple-600',
      borderColor: 'border-purple-500/30',
      badgeBg: 'bg-purple-500/10 text-purple-400',
      description: 'Align 50+ team members with quarterly OKRs and organize sprint tasks across Kanban boards (To Do, In Progress, Completed).',
      inputs: ['Sprint Deliverables', 'Task Assignees & Deadlines', 'Quarterly Key Results'],
      outputs: ['Task Execution Velocity', 'Team Efficiency Index (88.4%)', 'OKR Completion Rate'],
      roles: ['Founder', 'Co-Founder'],
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Scenario Simulator',
      subtitle: 'What-If Growth & Hiring',
      category: 'Intelligence',
      icon: <GitFork className="w-5 h-5" />,
      navTab: 'scenario',
      color: 'from-sky-600 to-cyan-600',
      borderColor: 'border-sky-500/30',
      badgeBg: 'bg-sky-500/10 text-sky-400',
      description: 'Test financial scenarios prior to spending. Adjust hiring counts, average engineering salary, marketing spend, or pricing changes.',
      inputs: ['Hiring Delta (+/- Headcount)', 'Marketing Budget Adjustment', 'Pricing Change %'],
      outputs: ['Projected Net Burn', 'New Runway Duration', 'Impact Summary Report'],
      roles: ['Founder', 'Executive', 'Investor'],
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: 'AI Business Advisor',
      subtitle: 'Gemini Real-Time Strategy',
      category: 'Intelligence',
      icon: <Bot className="w-5 h-5" />,
      navTab: 'advisor',
      color: 'from-indigo-600 to-violet-600',
      borderColor: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-500/10 text-indigo-400',
      description: 'Feed current financial, pipeline, and team metrics into Google Gemini AI to receive instant, prioritized growth and burn reduction action plans.',
      inputs: ['Live Database Metrics', 'Strategic Priority Focus', 'Custom Prompt Queries'],
      outputs: ['Prioritized Action Steps', 'Burn Reduction Playbooks', 'Market Expansion Briefs'],
      roles: ['Founder', 'Co-Founder', 'Executive'],
    },
    {
      id: 'step-7',
      stepNumber: 7,
      title: 'Risk Center & Founder Health',
      subtitle: 'Mitigation & Burnout Score',
      category: 'Governance',
      icon: <ShieldAlert className="w-5 h-5" />,
      navTab: 'risks',
      color: 'from-rose-600 to-pink-600',
      borderColor: 'border-rose-500/30',
      badgeBg: 'bg-rose-500/10 text-rose-400',
      description: 'Identify critical startup risks (technical, market, operational) and track the Founder Wellness Index to prevent burnout during scaling.',
      inputs: ['Risk Severity & Impact', 'Mitigation Plan Steps', 'Workload & Sleep Metrics'],
      outputs: ['Risk Resolution Status', 'Startup Health Score (92/100)', 'Burnout Prevention Guidance'],
      roles: ['Founder', 'Co-Founder'],
    },
    {
      id: 'step-8',
      stepNumber: 8,
      title: 'Investor Updates & Export',
      subtitle: 'Cap Table & Board Reports',
      category: 'Reporting',
      icon: <FileText className="w-5 h-5" />,
      navTab: 'reports',
      color: 'from-emerald-600 to-teal-600',
      borderColor: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/10 text-emerald-400',
      description: 'Generate concise investor updates, review cap table equity distribution, and export formatted PDF and Excel board decks in one click.',
      inputs: ['Monthly Highlights & Lowlights', 'Runway & Valuation Data', 'Target Metrics'],
      outputs: ['Investor Email Update', 'PDF Board Report', 'Excel Financial Export'],
      roles: ['Founder', 'Investor'],
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const filteredNodes = nodes.filter((node) => {
    if (filterRole === 'All') return true;
    return node.roles.includes(filterRole);
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white p-6 md:p-8 border border-indigo-500/30 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
              <GitCommit className="w-3.5 h-3.5" /> Nexora — Know What’s Next
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Nexora Interactive Architecture & Flowchart
            </h1>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
              Understand how data flows through Nexora — from initial setup and financial ledger tracking to AI strategy execution and investor reporting.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">Filter by Persona</span>
            <div className="flex flex-wrap gap-1.5 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800">
              {['All', 'Founder', 'Executive', 'Investor'].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterRole === role
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Flowchart Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Flow Nodes (8 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Executive Workflow Sequence
            </h2>
            <span className="text-xs font-mono text-zinc-500">{filteredNodes.length} Active Steps</span>
          </div>

          <div className="space-y-3 relative">
            {/* Connecting Vertical Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-emerald-500 to-purple-500 opacity-30 pointer-events-none z-0"></div>

            {filteredNodes.map((node, index) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`relative z-10 p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 border-indigo-500 dark:border-indigo-500 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                      : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/90 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Step Number Badge */}
                    <div
                      className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${node.color} text-white flex items-center justify-center font-bold text-sm shadow-md font-mono`}
                    >
                      {node.stepNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase font-mono ${node.badgeBg}`}>
                          {node.category}
                        </span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{node.title}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{node.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(node.navTab);
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors border border-zinc-200 dark:border-zinc-700"
                    >
                      <Play className="w-3 h-3 text-indigo-500 fill-indigo-500" /> Launch
                    </button>
                    <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${isSelected ? 'rotate-90 text-indigo-500' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Inspector Detail Panel (5 Cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-6 shadow-lg space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedNode.color} text-white flex items-center justify-center shadow-md`}>
                  {selectedNode.icon}
                </div>
                <div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase font-mono ${selectedNode.badgeBg}`}>
                    Step {selectedNode.stepNumber} • {selectedNode.category}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">{selectedNode.title}</h3>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">Objective & Function</h4>
              <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 mt-2 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                {selectedNode.description}
              </p>
            </div>

            {/* Data Inputs & Outputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">Required Inputs</h4>
                <ul className="space-y-1.5">
                  {selectedNode.inputs.map((inp, i) => (
                    <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {inp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">Produced Outputs</h4>
                <ul className="space-y-1.5">
                  {selectedNode.outputs.map((out, i) => (
                    <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {out}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Relevant Roles */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono mb-2">Authorized Roles</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.roles.map((r) => (
                  <span key={r} className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch Module Button */}
            <button
              onClick={() => setActiveTab(selectedNode.navTab)}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" /> Open {selectedNode.title} Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
