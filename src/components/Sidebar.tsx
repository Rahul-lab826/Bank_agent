import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  TrendingUp, 
  Sparkles, 
  Cpu, 
  MessageSquare, 
  LineChart, 
  Target, 
  ChevronLeft,
  X,
  Building
} from 'lucide-react';
import { customerProfile, bankAccounts, investments, loans, financialGoals } from '../mock/financialData';
import { Badge } from './Badge';
import { calculateFinancialHealthScore } from '../engine/healthScore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const path = location.pathname;
  
  const healthData = calculateFinancialHealthScore(
    customerProfile.monthlyIncome,
    customerProfile.monthlyExpenses,
    bankAccounts,
    investments,
    loans,
    financialGoals
  );
  
  const isWealthRoute = path.startsWith('/wealth');

  const mainBankLinks = [
    { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Accounts', to: '/accounts', icon: Wallet, badge: '2' },
    { name: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
    { name: 'Investments', to: '/investments', icon: TrendingUp },
  ];

  const wealthTwinLinks = [
    { name: 'Financial Overview', to: '/wealth', icon: Sparkles, end: true },
    { name: 'Digital Twin', to: '/wealth/twin', icon: Cpu },
    { name: 'AI Advisor', to: '/wealth/advisor', icon: MessageSquare },
    { name: 'What-If Simulator', to: '/wealth/simulator', icon: LineChart },
    { name: 'Goal Planner', to: '/wealth/goals', icon: Target },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-[#090d16] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Building className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-sm tracking-wide text-white">
                APEX DIGITAL BANK
              </span>
            </Link>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Area */}
          <div className="p-4 space-y-6">
            {isWealthRoute ? (
              // WealthTwin AI Sub-Navigation
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Link 
                    to="/dashboard"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Back to Core Banking
                  </Link>
                  <Badge variant="accent" size="sm">Twin Mode</Badge>
                </div>

                <div className="space-y-1">
                  <div className="px-3 mb-2">
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                      WealthTwin AI Suite
                    </span>
                  </div>
                  {wealthTwinLinks.map((link) => {
                    const Icon = link.icon;
                    // For active match, check if path equals link.to. If link.end is true, check exact match.
                    const isActive = link.end ? path === link.to : path.startsWith(link.to) && (link.to !== '/wealth' || path === '/wealth');
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400 font-semibold'
                            : 'border border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                          <span>{link.name}</span>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Main Banking Navigation
              <div className="space-y-1">
                <div className="px-3 mb-2">
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                    Banking
                  </span>
                </div>
                {mainBankLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = path === link.to;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-800 border border-slate-700/50 text-white font-semibold'
                          : 'border border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-850 border border-slate-750 text-slate-300 rounded-md">
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}

                {/* WealthTwin Entry in Main Sidebar */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-1">
                  <div className="px-3 mb-2">
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                      AI Services
                    </span>
                  </div>
                  <Link
                    to="/wealth"
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold border border-blue-500/25 bg-blue-950/20 hover:bg-blue-950/45 text-blue-400 hover:border-blue-500/40 shadow-sm shadow-blue-500/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4.5 w-4.5 text-blue-400 animate-pulse group-hover:scale-110 transition-transform" />
                      <span>WealthTwin AI</span>
                    </div>
                    <Badge variant="accent" size="sm" className="bg-blue-500/20 border-transparent animate-pulse text-blue-300">
                      Beta
                    </Badge>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Block */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-display font-semibold text-white shadow-inner">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">
                {customerProfile.name}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-medium text-slate-500">Risk Profile:</span>
                <span className="text-[10px] font-semibold text-indigo-400">
                  {customerProfile.riskProfile}
                </span>
              </div>
            </div>
          </div>
          {/* Health Score Indicator */}
          <div className="mt-3 pt-2.5 border-t border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] font-medium text-slate-400">Financial Health:</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400">
              {healthData.overallScore}/100
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
