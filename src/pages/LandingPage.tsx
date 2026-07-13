import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Cpu, Compass, Landmark } from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-between selection:bg-blue-600/30">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-base tracking-wide text-white">
            APEX DIGITAL BANK
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate('/login')}>
            Try Demo
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-24 grid md:grid-cols-12 gap-12 items-center">
        {/* Left column: Hook & CTAs */}
        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="sm" className="bg-blue-600/10 border-blue-500/20 text-blue-400">
              Hackathon Prototype
            </Badge>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
            <span className="text-xs text-slate-400 font-semibold">Embedded Financial Intelligence</span>
          </div>
          
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
            WealthTwin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">AI</span>
          </h1>
          <p className="font-display font-medium text-xl sm:text-2xl text-slate-300">
            "Your finances. Understood. Simulated. Optimized."
          </p>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            WealthTwin AI is a next-generation AI-powered Financial Digital Twin and Agentic Wealth Advisor designed to be embedded directly inside an existing bank's digital banking application. Experience personalized financial simulations and advisory, synthesized from a holistic view of your transactions, accounts, and investment portfolios.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              rightIcon={<ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />}
              className="group shadow-lg shadow-blue-500/15"
            >
              Enter Demo Banking Experience
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-400">
                <Cpu className="h-4 w-4" />
                <span className="text-xs font-bold text-white tracking-wide uppercase">Digital Twin</span>
              </div>
              <p className="text-[11px] text-slate-450">Synchronized model of savings, investments, loans, and surplus.</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400">
                <Compass className="h-4 w-4" />
                <span className="text-xs font-bold text-white tracking-wide uppercase">What-Ifs</span>
              </div>
              <p className="text-[11px] text-slate-455">Simulate major purchases, budget edits, and portfolio allocation.</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-bold text-white tracking-wide uppercase">Agentic Wealth</span>
              </div>
              <p className="text-[11px] text-slate-455">Autonomous recommendations to optimize idle funds and debt.</p>
            </div>
          </div>
        </div>

        {/* Right column: Embedded Architecture & Integration Mockup */}
        <div className="md:col-span-5 flex justify-center">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl shadow-black relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-blue-600/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-emerald-600/10 blur-xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">System Architecture</span>
              <Badge variant="success" size="sm">Active Sync</Badge>
            </div>

            <div className="space-y-5">
              {/* Box 1: Core Bank */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700/50">
                  <Landmark className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Apex Digital Core</h4>
                  <p className="text-[10px] text-slate-500">Savings &bull; EMI Accounts &bull; Cards</p>
                </div>
              </div>

              {/* Data Flow Indicator */}
              <div className="flex justify-center my-1">
                <div className="h-6 w-0.5 border-l border-dashed border-slate-800 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                </div>
              </div>

              {/* Box 2: WealthTwin AI Context Engine */}
              <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-550/25 flex flex-col gap-2 shadow-sm shadow-blue-500/5 relative">
                <div className="absolute top-2 right-2 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="h-4.5 w-4.5 text-blue-400" />
                  <h4 className="text-xs font-bold text-white">WealthTwin AI Engine</h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Synthesizes banking and external ledger records into an active context graph.
                </p>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <div className="px-1.5 py-0.5 rounded bg-blue-950/50 text-[8px] font-semibold text-blue-300 border border-blue-900/30 text-center">
                    Ledger Context
                  </div>
                  <div className="px-1.5 py-0.5 rounded bg-blue-950/50 text-[8px] font-semibold text-blue-300 border border-blue-900/30 text-center">
                    Projection Graph
                  </div>
                </div>
              </div>

              {/* Data Flow Indicator */}
              <div className="flex justify-center my-1">
                <div className="h-6 w-0.5 border-l border-dashed border-slate-800 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                </div>
              </div>

              {/* Box 3: Client Experience */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700/50">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Embedded Advisor UI</h4>
                  <p className="text-[10px] text-slate-500">Financial Digital Twin & Advisor</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-850 flex items-center justify-center text-[10px] text-slate-500 gap-1.5">
              <span>Secure Vercel Edge Serverless Flow</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-950 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-550 gap-4">
        <span>&copy; 2026 WealthTwin AI. All rights reserved. Hackathon Prototype.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Integration Guide</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};
