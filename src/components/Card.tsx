import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  ...props
}) => {
  const cardStyle = `${
    glass ? 'glass-panel' : 'bg-slate-900 border border-slate-800'
  } rounded-xl p-5 shadow-lg shadow-black/30 transition-all duration-300 ${
    hoverEffect ? 'hover:border-slate-700 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/40' : ''
  } ${className}`;

  return (
    <div className={cardStyle} {...props}>
      {children}
    </div>
  );
};

interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

export const CardHeader: React.FC<CardSectionProps> = ({
  children,
  className = '',
  divider = false,
  ...props
}) => {
  return (
    <div className={`mb-4 pb-3 ${divider ? 'border-b border-slate-800/80' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardSectionProps> = ({
  children,
  className = '',
  divider = false,
  ...props
}) => {
  return (
    <div className={`mt-4 pt-3 ${divider ? 'border-t border-slate-800/80' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};
