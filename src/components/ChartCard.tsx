import React from 'react';
import { Card } from './Card';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  metric?: string;
  metricLabel?: string;
  ranges?: string[];
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  metric,
  metricLabel,
  ranges,
  selectedRange,
  onRangeChange,
  children,
  className = '',
  isLoading = false
}) => {
  return (
    <Card className={`flex flex-col ${className}`}>
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display font-semibold text-base text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-550 mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
          {metric && (
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display font-bold text-2xl text-white">
                {metric}
              </span>
              {metricLabel && (
                <span className="text-xs text-slate-500 font-medium">
                  {metricLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Range Selectors */}
        {ranges && ranges.length > 0 && onRangeChange && (
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 self-start sm:self-auto">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => onRangeChange(range)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  selectedRange === range
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Content Area */}
      <div className="relative flex-1 min-h-[260px] w-full">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-500 font-semibold">Updating chart...</span>
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </Card>
  );
};
