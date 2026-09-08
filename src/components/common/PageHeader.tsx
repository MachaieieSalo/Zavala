import React from 'react';

interface PageHeaderProps {
  context?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  context,
  title,
  description,
  actions,
  className = '',
}) => {
  return (
    <div className={`pb-3 border-b border-[#D9CDAF] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1 min-w-0 max-w-3xl">
          {context && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#4F5C48] uppercase tracking-wider block">
              {context}
            </span>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A2417] leading-tight font-display tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-[#4F5C48] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
