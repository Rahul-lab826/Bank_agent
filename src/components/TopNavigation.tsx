import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Sparkles, LogOut, ChevronRight } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface TopNavigationProps {
  onMenuToggle: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const formatPathname = (path: string) => {
    if (path === '/dashboard') return 'Core Banking';
    if (path === '/wealth') return 'WealthTwin AI';
    if (path.startsWith('/wealth/')) {
      const sub = path.split('/')[2];
      if (sub === 'twin') return 'Digital Twin';
      if (sub === 'advisor') return 'AI Wealth Advisor';
      if (sub === 'simulator') return 'What-If Simulator';
      if (sub === 'goals') return 'Goal Planner';
      return sub;
    }
    return '';
  };

  const isWealthRoute = location.pathname.startsWith('/wealth');

  const notifications = [
    {
      id: 1,
      title: 'AI Alert: Investment Surplus Detected',
      message: 'Arjun, you have an unallocated surplus of ₹24,000 this month. Let\'s optimize it.',
      time: '10m ago',
      type: 'advisor'
    },
    {
      id: 2,
      title: 'Salary Credited',
      message: 'Your salary of ₹85,000 from TechCorp Solutions was credited.',
      time: '1h ago',
      type: 'bank'
    }
  ];

  return (
    <header className="h-16 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Left side: Menu toggle for mobile and Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white md:hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span className="text-slate-400">Apex Portal</span>
          <ChevronRight className="h-3 w-3" />
          <span className={`${isWealthRoute ? 'text-blue-400' : 'text-slate-350'}`}>
            {formatPathname(location.pathname)}
          </span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-bold tracking-widest uppercase">
            Demo Mode
          </span>
        </div>
      </div>

      {/* Right side: Search, Notifications, Profile/Logout */}
      <div className="flex items-center gap-4">
        {/* Mock Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 w-64 focus-within:border-slate-700 transition-all">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search accounts or features..."
            className="bg-transparent border-none text-xs text-slate-300 focus:outline-none w-full placeholder-slate-600"
          />
        </div>

        {/* WealthTwin Quick Launch (only visible in Core Banking) */}
        {!isWealthRoute && (
          <button
            onClick={() => navigate('/wealth')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/25 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold transition-all cursor-pointer group"
          >
            <Sparkles className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            <span>Launch WealthTwin</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-450 hover:text-white transition-all cursor-pointer relative"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <>
              <div 
                onClick={() => setNotificationsOpen(false)}
                className="fixed inset-0 z-40 bg-transparent"
              />
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/50 z-50 p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                    Notifications
                  </h4>
                  <button 
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[10px] font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Mark read
                  </button>
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-800 transition-all cursor-pointer"
                      onClick={() => {
                        setNotificationsOpen(false);
                        if (notif.type === 'advisor') navigate('/wealth/advisor');
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold ${
                          notif.type === 'advisor' ? 'text-blue-400' : 'text-emerald-400'
                        }`}>
                          {notif.type === 'advisor' ? 'WEALTHTWIN AI' : 'BANKING'}
                        </span>
                        <span className="text-[9px] text-slate-500">{notif.time}</span>
                      </div>
                      <h5 className="text-xs font-semibold text-white truncate">
                        {notif.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Logout */}
        <Tooltip text="Logout Demo Account">
          <button
            onClick={() => navigate('/login')}
            className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-450 hover:text-rose-450 hover:border-rose-950/30 transition-all cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};
