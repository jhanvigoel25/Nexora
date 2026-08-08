import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, AlertTriangle, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const RiskCenterView: React.FC = () => {
  const { db, company, updateRecord, showToast, setActiveTab } = useApp();

  if (!db || !company) return null;

  const handleMitigateRisk = async (riskId: string, actionText: string) => {
    await updateRecord('risks', riskId, { status: 'Mitigated' });
    showToast(`Executed mitigation: ${actionText}`);
  };

  const handleDismissRisk = async (riskId: string) => {
    await updateRecord('risks', riskId, { status: 'Dismissed' });
    showToast('Risk dismissed', 'info');
  };

  const activeRisks = db.risks.filter((r) => r.status === 'Active');
  const mitigatedRisks = db.risks.filter((r) => r.status === 'Mitigated');

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-rose-500" />
            Operational Risk & Anomaly Detection Center
          </h1>
          <p className="text-sm text-slate-500">
            Real-time automated scanning for cash burn anomalies, churn spikes, overdue engineering tasks, and budget overruns.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('advisor')}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" /> Consult AI Risk Advisor
        </button>
      </div>

      {/* Top Risk Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Active Operational Risks</div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {activeRisks.length} Detected
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Automated 24/7 Monitoring</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Mitigated Risks</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {mitigatedRisks.length} Resolved
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Actions Applied</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">System Risk Status</div>
          <div className="text-2xl font-extrabold text-amber-500 mt-1">
            {activeRisks.filter((r) => r.riskLevel === 'Critical').length > 0 ? 'CRITICAL ATTENTION' : 'STABLE'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Health Score: {company.healthScore}/100</div>
        </div>
      </div>

      {/* Active Risks List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Active Risks & AI Recommendations
        </h3>

        {activeRisks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No Active Operational Risks Detected</p>
            <p className="text-xs">Your cash runway, customer retention, and engineering velocity are operating within safe parameters.</p>
          </div>
        ) : (
          activeRisks.map((risk) => (
            <div
              key={risk.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      risk.riskLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : risk.riskLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {risk.riskLevel} Level
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Category: {risk.category}
                  </span>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  Detected: {new Date(risk.detectedAt).toLocaleTimeString()}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{risk.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{risk.metricImpact}</p>
              </div>

              {/* AI Recommendation Box */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  <Sparkles className="w-4 h-4 text-indigo-500" /> AI Recommendation Action Plan
                </div>
                <p className="text-xs text-indigo-950 dark:text-indigo-300 leading-relaxed">
                  {risk.aiRecommendation}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleMitigateRisk(risk.id, risk.aiRecommendation)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Apply AI Recommendation
                  </button>

                  <button
                    onClick={() => handleDismissRisk(risk.id)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mitigated Risks Section */}
      {mitigatedRisks.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Resolved & Mitigated Risks</h3>
          <div className="space-y-2">
            {mitigatedRisks.map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{r.title}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Mitigated</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
