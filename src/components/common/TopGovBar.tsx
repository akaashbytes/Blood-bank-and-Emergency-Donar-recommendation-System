import React from 'react';
import { ShieldCheck, PhoneCall, Globe, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const TopGovBar: React.FC = () => {
  const { currentRole, setRole, currentUser } = useAuth();

  const roleLabels: Record<UserRole, string> = {
    DONOR: 'Donor Portal',
    REQUESTER: 'Hospital Representative',
    COORDINATOR: 'Coordinator / Blood Bank',
    ADMIN: 'System Admin'
  };

  return (
    <div className="bg-[#FFFFFF] border-b border-[#E2BEBC]/60 text-[#1B1C1C] text-xs py-1.5 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Government emblem & regulatory notice */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#8B0015] text-white rounded-full flex items-center justify-center font-bold text-[10px]">
            🇮🇳
          </div>
          <span className="font-semibold text-[#1B1C1C] hidden sm:inline">
            Government of India • Ministry of Health & Family Welfare
          </span>
          <span className="text-[#8E706E] hidden md:inline">|</span>
          <span className="flex items-center gap-1 text-[#15803D] font-medium">
            <ShieldCheck size={14} /> NBTC Accredited Blood Grid
          </span>
        </div>

        {/* Right side: Emergency hotline, language & role switcher demo dropdown */}
        <div className="flex items-center gap-4 ml-auto">
          <a
            href="tel:108"
            className="flex items-center gap-1 text-[#B91C2A] font-bold hover:underline"
          >
            <PhoneCall size={13} /> 24/7 Hotline: 108-BLOOD
          </a>

          <div className="hidden lg:flex items-center gap-1 text-[#5A413F]">
            <Globe size={13} />
            <span>EN</span>
          </div>

          {/* Institutional Role Switcher for seamless demo testing */}
          <div className="flex items-center gap-1.5 bg-[#F6F3F2] px-2 py-0.5 rounded border border-[#E2BEBC]">
            <UserCheck size={13} className="text-[#8B0015]" />
            <span className="text-[11px] font-semibold text-[#5A413F]">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent font-bold text-[#8B0015] cursor-pointer focus:outline-none text-[11px]"
            >
              <option value="DONOR">Donor</option>
              <option value="REQUESTER">Hospital Representative</option>
              <option value="COORDINATOR">Coordinator (Blood Bank)</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
