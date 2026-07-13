import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  showBackButton = false,
  onBackClick,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 ${className}`}>
      <div className="flex items-start gap-3">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="mt-1 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight leading-none mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-400 font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-3 self-start md:self-auto">
          {action}
        </div>
      )}
    </div>
  );
};
