import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, ShieldAlert, Award, Clock, ArrowRight, ShieldCheck, Activity, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { BloodGroupBadge } from '../../components/ui/Badge';
import { BLOOD_GROUPS } from '../../config/theme';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12 py-2">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#8B0015] via-[#65000F] to-[#4A000B] text-white rounded-2xl p-8 sm:p-12 overflow-hidden shadow-xl border border-[#8B0015]">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none flex items-center justify-center font-mono text-[180px] font-black leading-none text-white select-none">
          +
        </div>
        
        <div className="max-w-2xl flex flex-col gap-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-[#FFDAD7] w-fit border border-white/20">
            <ShieldCheck size={14} className="text-white" /> National Institutional Blood Grid
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Rapid Emergency Blood Logistics & Voluntary Donor Grid
          </h1>

          <p className="text-sm sm:text-base text-[#FFDAD7] leading-relaxed">
            Connecting regional blood banks, accredited hospital emergency trauma units, and verified voluntary donors across India. Zero friction emergency dispatch and real-time inventory monitoring.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="urgent"
              size="lg"
              onClick={() => navigate('/public/find-blood')}
              icon={<Search size={18} />}
            >
              Find Real-Time Blood Stock
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/donor/dashboard')}
              className="text-white border-white hover:bg-white/10 hover:text-white"
              icon={<Heart size={18} />}
            >
              Become a Donor
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Search Widget */}
      <Card variant="elevated" padding="lg" className="border-[#8B0015]/20 -mt-6 z-20 relative bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#E2BEBC]/60 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B0015] flex items-center gap-2">
              <Search size={16} /> Instant Regional Blood Availability Screener
            </h3>
            <span className="text-xs text-[#15803D] font-bold bg-[#DCFCE7] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Activity size={12} /> Live Inventory Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs font-bold text-[#5A413F] uppercase tracking-wider block mb-1.5">
                City / Region
              </label>
              <select className="w-full h-11 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md text-sm font-semibold text-[#1B1C1C]">
                <option>New Delhi (NCR Central)</option>
                <option>Mumbai Metropolitan</option>
                <option>Bengaluru Urban</option>
                <option>Kolkata Hub</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#5A413F] uppercase tracking-wider block mb-1.5">
                Required Blood Group
              </label>
              <select className="w-full h-11 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md text-sm font-semibold text-[#1B1C1C]">
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g} Blood Type</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#5A413F] uppercase tracking-wider block mb-1.5">
                Component Type
              </label>
              <select className="w-full h-11 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md text-sm font-semibold text-[#1B1C1C]">
                <option>PRBC (Red Cells)</option>
                <option>Whole Blood</option>
                <option>Platelets</option>
                <option>FFP (Plasma)</option>
              </select>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/public/find-blood')}
              className="h-11 w-full"
              icon={<Search size={16} />}
            >
              Search Availability
            </Button>
          </div>
        </div>
      </Card>

      {/* Live Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Units Available in Vaults"
          value="256 Units"
          subtext="Across 18 regional blood banks"
          icon={<Activity size={20} />}
          statusTag="SYNCED"
          statusVariant="success"
        />
        <StatCard
          title="Emergency Requests 24h"
          value="14 Requests"
          subtext="Avg allocation time: 18 mins"
          icon={<ShieldAlert size={20} />}
          statusTag="ACTIVE"
          statusVariant="warning"
        />
        <StatCard
          title="Registered Voluntary Donors"
          value="4,820 Donors"
          subtext="Verified eligible & active"
          icon={<Users size={20} />}
          statusTag="VERIFIED"
          statusVariant="success"
        />
        <StatCard
          title="Lives Saved This Month"
          value="1,140 Lives"
          subtext="Zero wastage compliance rate"
          icon={<Award size={20} />}
          highlight={true}
        />
      </div>

      {/* Blood Group Quick Palette */}
      <Card variant="flat" padding="lg" className="border-[#E2BEBC]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1B1C1C]">Regional Stock Overview by Blood Type</h3>
              <p className="text-xs text-[#5A413F]">Click any blood group to view regional availability</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/public/find-blood')}>
              View Full Breakdown →
            </Button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {BLOOD_GROUPS.map((group) => (
              <div
                key={group}
                onClick={() => navigate(`/public/find-blood?group=${encodeURIComponent(group)}`)}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-[#E2BEBC] hover:border-[#8B0015] cursor-pointer transition-all shadow-xs"
              >
                <BloodGroupBadge group={group} size="md" active={group === 'O-' || group === 'O+'} />
                <span className="text-[11px] font-bold text-[#5A413F]">
                  {group === 'O-' ? '6 Units (Crit)' : '48+ Units'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 3 Step Journey */}
      <div className="py-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1B1C1C]">How LifeLink Blood Platform Works</h2>
          <p className="text-xs text-[#5A413F]">Standardized clinical protocols ensuring safe & rapid transfusion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="lg" className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8B0015] text-white flex items-center justify-center font-bold text-base">
              1
            </div>
            <h4 className="text-base font-bold text-[#1B1C1C]">Verified Request Submission</h4>
            <p className="text-xs text-[#5A413F] leading-relaxed">
              Hospitals and patients submit emergency blood requirements with medical requisition and required timing.
            </p>
          </Card>

          <Card padding="lg" className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8B0015] text-white flex items-center justify-center font-bold text-base">
              2
            </div>
            <h4 className="text-base font-bold text-[#1B1C1C]">Automated Vault Match & Dispatch</h4>
            <p className="text-xs text-[#5A413F] leading-relaxed">
              Our nodal coordinator console matches nearest stock, runs compatibility checks, and releases cold-chain units.
            </p>
          </Card>

          <Card padding="lg" className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8B0015] text-white flex items-center justify-center font-bold text-base">
              3
            </div>
            <h4 className="text-base font-bold text-[#1B1C1C]">Tracked Emergency Delivery</h4>
            <p className="text-xs text-[#5A413F] leading-relaxed">
              Real-time tracking of dispatch status, cold-chain temperature metrics, and hospital receiving confirmation.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
