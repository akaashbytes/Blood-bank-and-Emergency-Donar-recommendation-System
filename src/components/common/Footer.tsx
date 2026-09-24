import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1B1C1C] text-white border-t border-[#303030]">
      {/* Top Banner */}
      <div className="bg-[#65000F] py-6 px-4 sm:px-8 border-b border-[#8B0015]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">National Blood Transfusion Council Verified Grid</h4>
              <p className="text-xs text-[#FFDAD7]">Real-time encrypted inventory dispatch & donor safety screening compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:108"
              className="px-4 py-2 bg-white text-[#8B0015] font-extrabold rounded-md text-xs hover:bg-[#FFDAD7] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Phone size={14} /> Emergency Helpline: 108
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Institutional Intro */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#8B0015] text-white flex items-center justify-center font-bold text-sm">
              🩸
            </div>
            <span className="text-lg font-bold font-mono">LifeLink Blood</span>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Institutional blood donation networks and regional blood bank logistics platform ensuring rapid response, zero wastage, and transparent blood unit availability across accredited centers.
          </p>
          <span className="text-[11px] text-[#6B7280]">License: NBTC-DL-2024-99881</span>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-2.5">
          <h5 className="text-xs font-bold text-[#FFDAD7] uppercase tracking-wider">Portals & Modules</h5>
          <ul className="flex flex-col gap-2 text-xs text-[#D1D5DB]">
            <li><Link to="/public/find-blood" className="hover:text-white hover:underline flex items-center gap-1"><ExternalLink size={12} /> Find Blood Units</Link></li>
            <li><Link to="/public/track-request" className="hover:text-white hover:underline flex items-center gap-1"><ExternalLink size={12} /> Emergency Request Tracker</Link></li>
            <li><Link to="/donor/dashboard" className="hover:text-white hover:underline flex items-center gap-1"><ExternalLink size={12} /> Donor Eligibility & Schedule</Link></li>
            <li><Link to="/coordinator/dashboard" className="hover:text-white hover:underline flex items-center gap-1"><ExternalLink size={12} /> Blood Bank Coordinator Console</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-white hover:underline flex items-center gap-1"><ExternalLink size={12} /> System Admin Oversight</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact & Nodal Office */}
        <div className="flex flex-col gap-2.5 text-xs text-[#D1D5DB]">
          <h5 className="text-xs font-bold text-[#FFDAD7] uppercase tracking-wider">Regional Control Hub</h5>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-[#8B0015] shrink-0 mt-0.5" />
            <span>Central Regional Blood Center #4, Sector 4, Institutional Area, Sri Aurobindo Marg, New Delhi 110016</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-[#8B0015]" />
            <span>+91 11 2345 6789</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-[#8B0015]" />
            <span>control.hub@lifelink.gov.in</span>
          </div>
        </div>

        {/* Column 4: Compliance & Guidelines */}
        <div className="flex flex-col gap-2.5">
          <h5 className="text-xs font-bold text-[#FFDAD7] uppercase tracking-wider">Clinical Standards</h5>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            All blood collection, component separation, testing, and storage follow strict Drugs and Cosmetics Act & NBTC Guidelines.
          </p>
          <div className="p-3 bg-[#2A2A2A] rounded-lg border border-[#404040] text-[11px] text-[#D1D5DB] flex items-center gap-2">
            <Heart size={14} className="text-[#B91C2A] shrink-0" />
            <span>Every voluntary donation saves up to 3 lives.</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#121212] py-4 px-4 text-center text-xs text-[#6B7280] border-t border-[#262626]">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 LifeLink Blood Institutional Platform. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline font-mono">Terms of Transfusion</a>
            <a href="#" className="hover:underline font-mono">Audit Standard AIP-160</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
