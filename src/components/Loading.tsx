import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  variant?: 'full' | 'block' | 'spinner' | 'skeleton';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  text = 'Loading...',
  className = ''
}) => {
  if (variant === 'full') {
    return (
      <div className={`fixed inset-0 z-50 bg-[#080c18] flex flex-col items-center justify-center gap-4 ${className}`}>
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        {text && <p className="text-sm text-slate-400 font-medium tracking-wide">{text}</p>}
      </div>
    );
  }

  if (variant === 'block') {
    return (
      <div className={`w-full min-h-[200px] flex flex-col items-center justify-center gap-3 p-6 bg-slate-900/40 border border-slate-800/80 rounded-xl ${className}`}>
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        {text && <p className="text-sm text-slate-400 font-medium">{text}</p>}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={`animate-pulse space-y-4 w-full ${className}`}>
        <div className="h-4 bg-slate-800 rounded w-2/3"></div>
        <div className="space-y-2">
          <div className="h-8 bg-slate-800 rounded"></div>
          <div className="h-8 bg-slate-800 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      {text && <span className="text-sm text-slate-400 font-medium">{text}</span>}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-5 border border-slate-800 bg-slate-900 rounded-xl space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-3.5 bg-slate-800 rounded w-1/3"></div>
        <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
      </div>
      <div className="h-7 bg-slate-800 rounded w-2/3"></div>
      <div className="pt-3 border-t border-slate-800/60 flex gap-2">
        <div className="h-5 bg-slate-800 rounded-full w-12"></div>
        <div className="h-3.5 bg-slate-800 rounded w-1/2 self-center"></div>
      </div>
    </div>
  );
};
