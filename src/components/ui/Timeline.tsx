import React from 'react';
import { CheckCircle2, Clock, AlertCircle, CircleDot } from 'lucide-react';

export interface TimelineStep {
  id: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
}

interface TimelineProps {
  steps: TimelineStep[];
}

export const Timeline: React.FC<TimelineProps> = ({ steps }) => {
  return (
    <div className="relative py-2">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.id} className="flex gap-4 items-start relative pb-6 group">
            {!isLast && (
              <span
                className={`absolute left-4 top-8 w-0.5 h-[calc(100%-12px)] ${
                  step.status === 'completed' ? 'bg-[#8B0015]' : 'bg-[#E2BEBC]'
                }`}
              />
            )}
            <div className="relative z-10">
              {step.status === 'completed' && (
                <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
              )}
              {step.status === 'active' && (
                <div className="w-8 h-8 rounded-full bg-[#8B0015] text-white flex items-center justify-center ring-4 ring-[#8B0015]/20 animate-pulse">
                  <CircleDot size={18} />
                </div>
              )}
              {step.status === 'pending' && (
                <div className="w-8 h-8 rounded-full bg-[#F6F3F2] border-2 border-[#E2BEBC] text-[#5A413F] flex items-center justify-center">
                  <Clock size={16} />
                </div>
              )}
              {step.status === 'failed' && (
                <div className="w-8 h-8 rounded-full bg-[#B91C2A] text-white flex items-center justify-center">
                  <AlertCircle size={18} />
                </div>
              )}
            </div>

            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#1B1C1C]">{step.title}</h4>
                {step.timestamp && <span className="text-xs text-[#5A413F] font-mono">{step.timestamp}</span>}
              </div>
              {step.subtitle && <p className="text-xs text-[#5A413F] mt-1">{step.subtitle}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
