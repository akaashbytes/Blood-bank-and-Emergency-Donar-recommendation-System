import React from 'react';
import { ShieldCheck, User, Mail, Phone, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge } from '../../components/ui/Badge';

export const DonorProfile: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-2 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Donor Profile & Voluntary Pass</h1>
          <p className="text-xs text-[#5A413F]">Official NBTC registered donor credentials and health profile</p>
        </div>
        <Button variant="outline" size="sm">Edit Medical Details</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Digital Donor Card */}
        <Card variant="hero" padding="lg" className="md:col-span-5 flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#FFDAD7]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">National Donor Pass</span>
            </div>
            <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded text-white font-bold">VERIFIED</span>
          </div>

          <div className="flex items-center gap-4">
            <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="w-16 h-16 rounded-full border-2 border-white object-cover" />
            <div>
              <h3 className="text-lg font-extrabold text-white">{currentUser?.name}</h3>
              <p className="text-xs text-[#FFDAD7] font-mono">ID: LIFELINK-D-9901</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div>
              <span className="text-[10px] text-[#FFDAD7] font-bold uppercase">Blood Group</span>
              <div className="text-2xl font-black font-mono text-white">O+ (Positive)</div>
            </div>
            <div>
              <span className="text-[10px] text-[#FFDAD7] font-bold uppercase">Total Donations</span>
              <div className="text-xl font-bold font-mono text-white">7 Times</div>
            </div>
          </div>
        </Card>

        {/* Right Column: Personal & Clinical Information */}
        <Card padding="lg" className="md:col-span-7 border-[#E2BEBC]">
          <h3 className="text-sm font-bold text-[#1B1C1C] uppercase tracking-wider mb-4 pb-2 border-b border-[#E2BEBC]/60">
            Personal & Contact Registration
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#5A413F] font-bold block">Full Legal Name</span>
              <span className="text-sm font-semibold text-[#1B1C1C]">{currentUser?.name}</span>
            </div>
            <div>
              <span className="text-[#5A413F] font-bold block">Registered Email</span>
              <span className="text-sm font-semibold text-[#1B1C1C]">{currentUser?.email}</span>
            </div>
            <div>
              <span className="text-[#5A413F] font-bold block">Primary Contact</span>
              <span className="text-sm font-semibold text-[#1B1C1C]">{currentUser?.phone}</span>
            </div>
            <div>
              <span className="text-[#5A413F] font-bold block">Location / Hub</span>
              <span className="text-sm font-semibold text-[#1B1C1C]">{currentUser?.city}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-[#1B1C1C] uppercase tracking-wider mt-6 mb-4 pb-2 border-b border-[#E2BEBC]/60">
            Eligibility & Safety Clearances
          </h3>
          <div className="flex flex-col gap-2 text-xs text-[#5A413F]">
            <div className="flex items-center gap-2 text-[#15803D] font-bold">
              <CheckCircle2 size={16} /> Cleared for PRBC & Whole Blood donation
            </div>
            <div className="flex items-center gap-2 text-[#15803D] font-bold">
              <CheckCircle2 size={16} /> Negative for HBV, HCV, HIV, Syphilis & Malaria
            </div>
            <div className="flex items-center gap-2 text-[#15803D] font-bold">
              <CheckCircle2 size={16} /> Last hemoglobin test: 13.8 g/dL (Above 12.5 threshold)
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
