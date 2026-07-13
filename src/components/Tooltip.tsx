import React from 'react';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  position = 'top',
  children
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent'
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-max max-w-[200px] bg-slate-850 border border-slate-700 text-slate-200 text-[11px] font-normal px-2.5 py-1.5 rounded shadow-xl ${positionClasses[position]}`}
      >
        <span>{text}</span>
        <div
          className={`absolute border-[5px] ${arrowClasses[position]}`}
        />
      </div>
    </div>
  );
};
