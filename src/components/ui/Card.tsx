import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'elevated' | 'outline' | 'hero';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: 'bg-white border border-[#1b1c1c]/10 rounded-xl shadow-xs hover:border-[#E2BEBC] transition-all',
    flat: 'bg-[#F6F3F2] border border-[#E2BEBC]/60 rounded-xl',
    elevated: 'bg-white border border-[#1b1c1c]/10 rounded-xl shadow-md hover:shadow-lg transition-all',
    outline: 'bg-transparent border border-[#8B0015]/30 rounded-xl',
    hero: 'bg-gradient-to-br from-[#8B0015] to-[#65000F] text-white rounded-xl shadow-md border border-[#8B0015]',
  };

  return (
    <div className={twMerge(clsx(variantStyles[variant], paddingStyles[padding], className))} {...props}>
      {children}
    </div>
  );
};
