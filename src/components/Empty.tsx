import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const Empty: React.FC<EmptyProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 min-h-[220px] rounded-xl border border-dashed border-slate-800 bg-slate-900/20 ${className}`}>
      <div className="p-3 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400 mb-4">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};
