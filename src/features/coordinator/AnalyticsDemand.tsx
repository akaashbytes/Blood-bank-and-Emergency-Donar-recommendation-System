import React from 'react';
import { Activity, TrendingUp, BarChart2, PieChart, ShieldCheck, Award } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { BLOOD_GROUPS } from '../../config/theme';

export const AnalyticsDemand: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Regional Analytics & Demand Forecasting</h1>
          <p className="text-xs text-[#5A413F]">Clinical supply trends, component fulfillment ratios, and regional demand forecasting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Fulfillment Rate"
          value="98.4%"
          subtext="Avg response time: 18 mins"
          icon={<TrendingUp size={20} />}
          statusTag="OPTIMAL"
          statusVariant="success"
        />
        <StatCard
          title="Wastage Index"
          value="0.12%"
          subtext="Below 1% NBTC safety target"
          icon={<ShieldCheck size={20} />}
          statusTag="ZERO WASTAGE"
          statusVariant="success"
        />
        <StatCard
          title="Peak Demand Group"
          value="O- Negative"
          subtext="Trauma OT surge demand"
          icon={<Activity size={20} />}
          statusTag="HIGH DEMAND"
          statusVariant="warning"
        />
      </div>

      {/* Demand & Supply Visualization Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card padding="md" className="lg:col-span-8 border-[#E2BEBC]">
          <h3 className="text-sm font-bold text-[#1B1C1C] uppercase tracking-wider mb-4 pb-2 border-b border-[#E2BEBC]/60 flex items-center gap-2">
            <BarChart2 size={16} className="text-[#8B0015]" /> Weekly Requisition vs Donation Flow
          </h3>

          <div className="space-y-4 pt-2">
            {[
              { day: 'Mon', req: 42, don: 48 },
              { day: 'Tue', req: 56, don: 52 },
              { day: 'Wed', req: 64, don: 70 },
              { day: 'Thu', req: 38, don: 44 },
              { day: 'Fri', req: 72, don: 80 },
              { day: 'Sat', req: 84, don: 96 },
              { day: 'Sun', req: 50, don: 62 },
            ].map((item) => (
              <div key={item.day} className="flex items-center gap-4 text-xs font-mono">
                <span className="w-8 font-bold text-[#1B1C1C]">{item.day}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-4 bg-[#8B0015] rounded text-white text-[10px] flex items-center justify-end px-2" style={{ width: `${item.req * 2.5}px` }}>
                    {item.req} Req
                  </div>
                  <div className="h-4 bg-[#15803D] rounded text-white text-[10px] flex items-center justify-end px-2" style={{ width: `${item.don * 2.5}px` }}>
                    {item.don} Don
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 text-xs font-semibold pt-4 mt-4 border-t border-[#E2BEBC]/60">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#8B0015] rounded"></span> Requisitions</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#15803D] rounded"></span> Voluntary Donations</span>
          </div>
        </Card>

        <Card padding="md" className="lg:col-span-4 border-[#E2BEBC]">
          <h3 className="text-sm font-bold text-[#1B1C1C] uppercase tracking-wider mb-4 pb-2 border-b border-[#E2BEBC]/60 flex items-center gap-2">
            <PieChart size={16} className="text-[#8B0015]" /> Group Stock Distribution
          </h3>

          <div className="flex flex-col gap-3">
            {[
              { group: 'O+', pct: '35%', color: 'bg-[#8B0015]' },
              { group: 'A+', pct: '28%', color: 'bg-[#B51828]' },
              { group: 'B+', pct: '20%', color: 'bg-[#D9353D]' },
              { group: 'AB+', pct: '10%', color: 'bg-[#821920]' },
              { group: 'Rare (-ve)', pct: '7%', color: 'bg-[#61000E]' },
            ].map((g) => (
              <div key={g.group} className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1B1C1C] flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${g.color}`}></span> {g.group}
                </span>
                <span className="font-mono font-extrabold text-[#8B0015]">{g.pct}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
