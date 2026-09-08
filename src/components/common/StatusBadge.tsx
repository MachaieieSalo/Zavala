import React from 'react';

export type StatusBadgeVariant = 'neutral' | 'crop' | 'shock' | 'active';
export type StatusBadgeSize = 'sm' | 'md';

export interface StatusBadgeProps {
  variant?: StatusBadgeVariant;
  size?: StatusBadgeSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'neutral',
  size = 'sm',
  icon,
  children,
  className = '',
}) => {
  const variantClasses: Record<StatusBadgeVariant, string> = {
    neutral: 'bg-[#EAE2D2]/70 text-[#1A2417] border-[#D9CDAF]',
    crop: 'bg-[#4A6B3E]/10 text-[#354D2C] border-[#4A6B3E]/30',
    shock: 'bg-[#A8531E]/10 text-[#A8531E] border-[#A8531E]/30',
    active: 'bg-[#2A3A24]/10 text-[#1A2417] border-[#2A3A24]/30',
  };

  const sizeClasses: Record<StatusBadgeSize, string> = {
    sm: 'text-[11px] px-2 py-0.5 rounded-[3px] gap-1',
    md: 'text-xs px-2.5 py-1 rounded-[4px] gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-sans font-medium border leading-none shrink-0 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
