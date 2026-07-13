import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  subLabel?: string;
  color?: 'blue' | 'green' | 'indigo' | 'rose' | 'amber';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  subLabel,
  color = 'blue',
  size = 'sm',
  className = ''
}) => {
  // Clamp value between 0 and max
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    blue: 'bg-blue-500 shadow-sm shadow-blue-500/25',
    green: 'bg-emerald-500 shadow-sm shadow-emerald-500/25',
    indigo: 'bg-indigo-500 shadow-sm shadow-indigo-500/25',
    rose: 'bg-rose-500 shadow-sm shadow-rose-500/25',
    amber: 'bg-amber-500 shadow-sm shadow-amber-500/25'
  };

  const trackColors = {
    blue: 'bg-blue-500/10',
    green: 'bg-emerald-500/10',
    indigo: 'bg-indigo-500/10',
    rose: 'bg-rose-500/10',
    amber: 'bg-amber-500/10'
  };

  const heights = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || subLabel) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-slate-350">{label}</span>}
          {subLabel && <span className="text-xs font-semibold text-slate-100">{subLabel}</span>}
        </div>
      )}
      <div className={`w-full ${trackColors[color]} ${heights[size]} rounded-full overflow-hidden`}>
        <div
          className={`${colors[color]} ${heights[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
