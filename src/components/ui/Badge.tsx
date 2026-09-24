import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BloodGroup } from '../../types';

interface BloodGroupBadgeProps {
  group: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({ group, size = 'md', active = false }) => {
  const sizeStyles = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-12 h-12 text-base font-extrabold',
  };

  const activeStyles = active 
    ? 'bg-[#8B0015] text-white shadow-md ring-2 ring-[#8B0015]/30' 
    : 'bg-[#8B0015]/10 text-[#8B0015] hover:bg-[#8B0015]/20 border border-[#8B0015]/20';

  return (
    <div className={clsx('rounded-lg flex items-center justify-center font-mono tracking-tight transition-all', sizeStyles[size], activeStyles)}>
      {group}
    </div>
  );
};

interface StatusChipProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  pulse?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, variant = 'neutral', pulse = false }) => {
  const variantStyles = {
    success: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#B91C2A] border-[#FECACA]',
    info: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    neutral: 'bg-[#F6F3F2] text-[#5A413F] border-[#E2BEBC]',
  };

  return (
    <span className={twMerge(clsx('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase', variantStyles[variant]))}>
      {pulse && <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>}
      {status.replace(/_/g, ' ')}
    </span>
  );
};
