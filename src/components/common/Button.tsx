import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-sans font-medium transition-colors cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A3A24]';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs px-2.5 py-1 rounded-[4px] gap-1.5 min-h-[30px]',
    md: 'text-xs sm:text-sm px-3.5 py-1.5 rounded-[4px] gap-2 min-h-[36px]',
    lg: 'text-sm font-semibold px-5 py-2.5 rounded-[6px] gap-2.5 min-h-[42px]',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[#4A6B3E] hover:bg-[#354D2C] text-white active:bg-[#2A3D23] border border-[#354D2C]/40',
    secondary:
      'bg-[#FCFAF6] hover:bg-[#EAE2D2] text-[#1A2417] border border-[#D9CDAF] active:bg-[#E2D8C5]',
    ghost:
      'bg-transparent hover:bg-[#EAE2D2]/60 text-[#4F5C48] hover:text-[#1A2417] border border-transparent',
    destructive:
      'bg-transparent hover:bg-[#A8531E]/10 text-[#A8531E] hover:text-[#8E4416] border border-[#A8531E]/30',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-3.5 w-3.5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
