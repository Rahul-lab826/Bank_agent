import React from 'react';
import { ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { Card } from './Card';
import { Tooltip } from './Tooltip';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number | string;
    isPositive: boolean;
    label?: string;
  };
  description?: string;
  tooltipText?: string;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  tooltipText,
  className = '',
  onClick
}) => {
  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer ${onClick ? 'active:scale-[0.99]' : ''} ${className}`}
      hoverEffect={!!onClick}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 tracking-wider uppercase mb-1">
            <span>{title}</span>
            {tooltipText && (
              <Tooltip text={tooltipText}>
                <HelpCircle className="h-3 w-3 text-slate-500 hover:text-slate-400 cursor-help" />
              </Tooltip>
            )}
          </div>
          <h3 className="font-display font-semibold text-2xl md:text-3xl text-white tracking-tight">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300">
            {icon}
          </div>
        )}
      </div>

      {(trend || description) && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/60">
          {trend && (
            <div className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-rose-500/10 text-rose-400'
            }`}>
              {trend.isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
          {description && (
            <span className="text-xs text-slate-500">
              {description} {trend?.label && `vs ${trend.label}`}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
