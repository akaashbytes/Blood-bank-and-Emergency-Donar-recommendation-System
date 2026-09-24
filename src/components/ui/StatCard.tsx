import React from 'react';
import { Card } from './Card';
import { StatusChip } from './Badge';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  statusTag?: string;
  statusVariant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  statusTag,
  statusVariant = 'neutral',
  highlight = false,
}) => {
  return (
    <Card variant={highlight ? 'hero' : 'default'} padding="md" className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className={`text-xs font-semibold uppercase tracking-wider ${highlight ? 'text-white/80' : 'text-[#5A413F]'}`}>
            {title}
          </span>
          <div className={`text-3xl font-extrabold tracking-tight font-mono ${highlight ? 'text-white' : 'text-[#1B1C1C]'}`}>
            {value}
          </div>
          {subtext && (
            <p className={`text-xs mt-1 ${highlight ? 'text-white/70' : 'text-[#5A413F]'}`}>
              {subtext}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {icon && (
            <div className={`p-2.5 rounded-lg ${highlight ? 'bg-white/15 text-white' : 'bg-[#8B0015]/10 text-[#8B0015]'}`}>
              {icon}
            </div>
          )}
          {statusTag && <StatusChip status={statusTag} variant={statusVariant} />}
        </div>
      </div>
    </Card>
  );
};
