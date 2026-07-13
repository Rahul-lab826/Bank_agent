import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate minor network delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex items-center justify-center p-4 selection:bg-blue-600/30">
      <Card className="w-full max-w-md p-8 relative overflow-hidden" glass={true}>
        {/* Decorative backdrop glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-600/5 blur-2xl pointer-events-none" />

        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-display font-bold text-xl text-white tracking-tight uppercase">
            Apex Digital Bank
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Secure client portal access
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label 
              htmlFor="customerId" 
              className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"
            >
              Customer ID
            </label>
            <input
              id="customerId"
              type="text"
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="e.g. 10938482"
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-650 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 transition-all"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-650 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer h-3.5 w-3.5" 
              />
              <span>Remember ID</span>
            </label>
            <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
              Forgot ID/Password?
            </a>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Secure Sign In
            </Button>
          </div>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-800/80"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-550 uppercase tracking-widest">
            OR DEMO SYSTEM
          </span>
          <div className="flex-grow border-t border-slate-800/80"></div>
        </div>

        {/* Demo Login Button */}
        <div>
          <Button
            type="button"
            variant="secondary"
            className="w-full border-blue-500/20 bg-blue-950/10 text-blue-400 hover:bg-blue-950/25 hover:text-blue-300 hover:border-blue-500/30"
            onClick={handleDemoLogin}
            isLoading={isLoading}
          >
            Try Demo Account
          </Button>
          <p className="text-[10px] text-center text-slate-500 mt-2.5 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Logs in as Arjun Mehta (Moderate Risk, ₹85k income)
          </p>
        </div>

        {/* Help footer */}
        <div className="mt-8 pt-4 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-550">
          <span className="flex items-center gap-1">
            <HelpCircle className="h-3 w-3" />
            Support: 1800-APEX-HELP
          </span>
          <span>Version 1.0.4-Beta</span>
        </div>
      </Card>
    </div>
  );
};
