import React from 'react';

export interface EditorialDividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const EditorialDivider: React.FC<EditorialDividerProps> = ({
  orientation = 'horizontal',
  spacing = 'md',
  className = '',
}) => {
  if (orientation === 'vertical') {
    const spacingClasses = {
      none: 'mx-0',
      sm: 'mx-2',
      md: 'mx-3',
      lg: 'mx-4',
    };
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px self-stretch bg-[#D9CDAF] ${spacingClasses[spacing]} ${className}`}
      />
    );
  }

  const spacingClasses = {
    none: 'my-0',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
  };

  return (
    <hr
      role="separator"
      className={`border-0 border-t border-[#D9CDAF] w-full ${spacingClasses[spacing]} ${className}`}
    />
  );
};
