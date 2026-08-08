import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Target, Plus, CheckCircle2, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { OKRGoal } from '../types';

export const GoalsView: React.FC = () => {
  const { db, addRecord, updateRecord, deleteRecord, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    objective: '',
    department: 'Sales',
    quarter: 'Q3 2026',
    kr1Title: '',
    kr1Target: '100',
  });

  if (!db) return null;

  const handleCreateOKR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      showToast('OKR title is required', 'error');
      return;
    }

    const newOKR: OKRGoal = {
      id: `okr-${Date.now()}`,
      title: form.title,
      objective: form.objective || 'Company Strategic Objective',
      department: form.department,
      owner: 'Alex Morgan',
      quarter: form.quarter,
      progress: 0,
      status: 'On Track',
      targetDate: '2026-09-30',
      keyResults: [
        {
          id: `kr-${Date.now()}`,
          title: form.kr1Title || 'Achieve milestone key result',
          current: 0,
          target: Number(form.kr1Target) || 100,
          unit: 'units',
        },
      ],
    };

    await addRecord('goals', newOKR);
    setIsModalOpen(false);
    setForm({ title: '', objective: '', department: 'Sales', quarter: 'Q3 2026', kr1Title: '', kr1Target: '100' });
  };

  const handleUpdateProgress = async (okrId: string, newProgress: number) => {
    const status = newProgress >= 100 ? 'Completed' : newProgress >= 70 ? 'On Track' : 'At Risk';
    await updateRecord('goals', okrId, { progress: newProgress, status });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Quarterly Objectives & Key Results (OKRs)
          </h1>
          <p className="text-sm text-slate-500">
            Align engineering, product, sales, and operations around measurable growth targets.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create New Goal / OKR
        </button>
      </div>

      {/* OKR Cards Grid */}
      <div className="space-y-4">
        {db.goals.map((okr) => (
          <div
            key={okr.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {okr.quarter}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {okr.department}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      okr.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : okr.status === 'On Track'
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {okr.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">{okr.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{okr.objective}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{okr.progress}%</span>
                  <div className="text-[10px] text-slate-400">Target: {okr.targetDate}</div>
                </div>

                <button
                  onClick={() => deleteRecord('goals', okr.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Overall Goal Progress</span>
                <span>{okr.progress}% Complete</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${okr.progress}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={okr.progress}
                onChange={(e) => handleUpdateProgress(okr.id, Number(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Key Results list */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Results</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {okr.keyResults.map((kr) => (
                  <div key={kr.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{kr.title}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {kr.current} / {kr.target} {kr.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Create New Goal / OKR</h3>

            <form onSubmit={handleCreateOKR} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Objective Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Expand Enterprise Sales to $2M ARR"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Strategic Objective Description</label>
                <textarea
                  value={form.objective}
                  onChange={(e) => setForm({ ...form, objective: e.target.value })}
                  placeholder="Details on strategic focus..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                  >
                    <option value="Sales">Sales</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Quarter</label>
                  <input
                    type="text"
                    value={form.quarter}
                    onChange={(e) => setForm({ ...form, quarter: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Key Result #1</label>
                <input
                  type="text"
                  value={form.kr1Title}
                  onChange={(e) => setForm({ ...form, kr1Title: e.target.value })}
                  placeholder="e.g. Close 15 new accounts"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
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
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
