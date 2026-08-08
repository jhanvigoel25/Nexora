import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, ArrowRight, Lock, Mail, User } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, signup, showToast } = useApp();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        if (!name || !email || !password) {
          showToast('Please fill out all fields', 'error');
          setIsLoading(false);
          return;
        }
        await signup(email, password, name);
      } else {
        if (!email || !password) {
          showToast('Please enter email and password', 'error');
          setIsLoading(false);
          return;
        }
        await login(email, password);
      }
    } catch (err: any) {
      showToast('Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await login('founder@apexos.com', 'password123');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 border border-indigo-400/30 text-white font-extrabold text-2xl shadow-xl shadow-indigo-500/25 mx-auto">
            <span>N<span className="text-cyan-300 font-mono text-base font-bold">›</span></span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Nexora — Know What’s Next
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Nexora
          </h1>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            AI-powered decision engine & startup operating system. Full-stack business intelligence, scenario modeling, and Gemini strategic guidance.
          </p>
        </div>

        {/* Login Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
          {/* Demo Login Banner */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> One-Click Demo Founder Login
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">or sign in with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {isSignup && (
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-xs text-indigo-400 hover:underline font-medium"
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
