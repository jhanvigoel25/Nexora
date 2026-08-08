import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Calendar,
  Kanban,
  AlertTriangle,
  CheckSquare,
  Clock,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Briefcase,
  Award,
} from 'lucide-react';
import { Task, Employee } from '../types';

export const TeamView: React.FC = () => {
  const { db, addRecord, updateRecord, deleteRecord, showToast } = useApp();
  const [viewMode, setViewMode] = useState<'kanban' | 'employees' | 'calendar'>('kanban');

  // Task creation state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigneeId: '',
    department: 'Engineering',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    dueDate: new Date().toISOString().split('T')[0],
  });

  if (!db) return null;

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) {
      showToast('Task title is required', 'error');
      return;
    }

    const assignee = db.employees.find((e) => e.id === taskForm.assigneeId) || db.employees[0];

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskForm.title,
      description: taskForm.description || 'Sprint task item',
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      department: taskForm.department,
      priority: taskForm.priority,
      status: 'To Do',
      dueDate: taskForm.dueDate,
      progress: 0,
      commentsCount: 0,
    };

    await addRecord('tasks', newTask);
    setIsTaskModalOpen(false);
    setTaskForm({ title: '', description: '', assigneeId: '', department: 'Engineering', priority: 'Medium', dueDate: new Date().toISOString().split('T')[0] });
  };

  const handleMoveTaskStatus = async (taskId: string, currentStatus: Task['status'], direction: 'next' | 'prev') => {
    const statuses: Task['status'][] = ['To Do', 'In Progress', 'In Review', 'Done'];
    const idx = statuses.indexOf(currentStatus);
    const targetIdx = direction === 'next' ? Math.min(3, idx + 1) : Math.max(0, idx - 1);
    const targetStatus = statuses[targetIdx];

    await updateRecord('tasks', taskId, { status: targetStatus, progress: targetStatus === 'Done' ? 100 : 50 });
  };

  const overdueTasks = db.tasks.filter((t) => t.isOverdue && t.status !== 'Done');

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Team Operations & Productivity Engine
          </h1>
          <p className="text-sm text-slate-500">
            Manage 50 employees, assign tasks, track sprint velocity on Kanban/Calendar views with late task detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban' ? 'bg-white dark:bg-slate-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              onClick={() => setViewMode('employees')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'employees' ? 'bg-white dark:bg-slate-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Employees (50)
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar' ? 'bg-white dark:bg-slate-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Overdue Task Banner */}
      {overdueTasks.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-amber-900 dark:text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Late Task Detector:</strong> {overdueTasks.length} tasks are overdue past target deadline. Reassign or prioritize engineering sprint.
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
            {overdueTasks.length} Alerts
          </span>
        </div>
      )}

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['To Do', 'In Progress', 'In Review', 'Done'] as const).map((columnStatus) => {
            const columnTasks = db.tasks.filter((t) => t.status === columnStatus).slice(0, 15);
            return (
              <div key={columnStatus} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col h-[650px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {columnStatus}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {db.tasks.filter((t) => t.status === columnStatus).length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow transition-shadow space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{t.title}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            t.priority === 'Critical'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : t.priority === 'High'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700">
                        <span>{t.assigneeName}</span>
                        <span className="font-mono">{t.dueDate}</span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          disabled={columnStatus === 'To Do'}
                          onClick={() => handleMoveTaskStatus(t.id, t.status, 'prev')}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 disabled:opacity-20"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteRecord('tasks', t.id)}
                          className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={columnStatus === 'Done'}
                          onClick={() => handleMoveTaskStatus(t.id, t.status, 'next')}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 disabled:opacity-20"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: EMPLOYEES DIRECTORY */}
      {viewMode === 'employees' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>Active Team Members ({db.employees.length} Employees)</span>
            <span className="text-xs text-slate-500 font-normal">Average Productivity: 88.4%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5">Employee</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Productivity</th>
                  <th className="p-3.5">Tasks</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {db.employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-medium flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="text-slate-900 dark:text-slate-100">{emp.name}</div>
                        <div className="text-[10px] text-slate-400">{emp.email}</div>
                      </div>
                    </td>
                    <td className="p-3.5">{emp.role}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium">
                        {emp.department}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${emp.productivityScore}%` }}></div>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{emp.productivityScore}%</span>
                      </div>
                    </td>
                    <td className="p-3.5">{emp.tasksCompleted} Completed / {emp.tasksPending} Pending</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Sprint Timeline Calendar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {db.tasks.slice(0, 12).map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-indigo-500 font-semibold">{t.dueDate}</span>
                  <span className="font-bold">{t.department}</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.title}</div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Assigned: {t.assigneeName}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Create New Task
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Implement Supabase Realtime indexing"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Assignee</label>
                <select
                  value={taskForm.assigneeId}
                  onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {db.employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
