import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  pill?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  pill = true,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium tracking-wide uppercase';
  
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-450 border border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-450 border border-rose-500/20',
    info: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    neutral: 'bg-slate-800 text-slate-350 border border-slate-700',
    accent: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
  };

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1'
  };

  const rounded = pill ? 'rounded-full' : 'rounded';

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${rounded} ${className}`}>
      {children}
    </span>
  );
};
