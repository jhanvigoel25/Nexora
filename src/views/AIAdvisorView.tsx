import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Sparkles, Send, RefreshCw, Copy, Check, ArrowRight, Zap } from 'lucide-react';
import { askAIAdvisor } from '../services/api';
import { AIAdvisorMessage } from '../types';

export const AIAdvisorView: React.FC = () => {
  const { company, db, showToast } = useApp();
  const [messages, setMessages] = useState<AIAdvisorMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello Founder! I am your **Autonomous AI Startup Advisor**. I have scanned your live database metrics for **${company?.name || 'Apex OS SaaS'}**:

• **Monthly Revenue (MRR)**: $${company?.monthlyRevenue.toLocaleString()} (+${company?.mrrGrowthRate}% MoM)
• **Cash Runway**: ${company?.runwayMonths} Months ($${company?.cashBalance.toLocaleString()} Bank Balance)
• **Startup Health Score**: ${company?.healthScore}/100

How can I help guide your executive decisions today? Choose a preset question or ask anything about your business metrics!`,
      timestamp: 'Just now',
      suggestions: [
        'How is my startup performing overall?',
        'Predict next month\'s revenue and cash runway.',
        'Why is burn rate increasing and how to cut costs?',
        'What should I prioritize this week across my teams?',
        'Which department needs immediate attention?',
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!company || !db) return null;

  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: AIAdvisorMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);

    try {
      const res = await askAIAdvisor(promptText, messages);

      const aiMsg: AIAdvisorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedMetrics: res.context,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      showToast('AI service response error', 'error');
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied AI recommendations to clipboard');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-indigo-400" /> Server-Side Gemini 3.6 Flash Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
            AI Business Advisor & Strategy OS
          </h1>
          <p className="text-xs text-indigo-200 mt-1">
            Analyzing live database tables ({db.customers.length} customers, {db.employees.length} employees, {db.revenue.length} revenue records).
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs text-indigo-300">Live Health Score</div>
          <div className="text-2xl font-extrabold text-emerald-400">{company.healthScore} / 100</div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 min-h-[450px] flex flex-col justify-between">
        <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-2 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{m.text}</div>
                </div>

                {/* Suggestions buttons if available */}
                {m.suggestions && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {m.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200/60 dark:border-indigo-800/60 transition-all text-left flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>{m.timestamp}</span>
                  {m.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 text-xs text-indigo-500 font-medium animate-pulse p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>AI is querying live database tables & modeling startup recommendations...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputPrompt);
          }}
          className="relative flex items-center pt-4 border-t border-slate-100 dark:border-slate-800"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask AI Advisor about performance, revenue forecasts, expenses, or team velocity..."
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isThinking}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
