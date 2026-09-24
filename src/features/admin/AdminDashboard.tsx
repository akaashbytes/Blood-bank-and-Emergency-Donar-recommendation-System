import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sliders, Users, FileText, Activity, AlertTriangle, ArrowRight, Server } from 'lucide-react';
import { adminService } from '../../services/apiServices';
import { AuditLogItem, InstitutionalSettings } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusChip } from '../../components/ui/Badge';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [settings, setSettings] = useState<InstitutionalSettings | null>(null);

  useEffect(() => {
    adminService.getAuditLogs().then(setAuditLogs);
    adminService.getSettings().then(setSettings);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-[#1B1C1C] via-[#303030] to-[#121212] text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#404040]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFDAD7] bg-[#8B0015] px-2.5 py-0.5 rounded-full">
            National Grid Governance
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            System Administration & Regulatory Oversight
          </h1>
          <p className="text-xs text-[#D1D5DB]">
            Audit compliance, user roles, security event logging & institutional configuration
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/admin/settings')}
            className="text-white border-white hover:bg-white/10"
            icon={<Sliders size={16} />}
          >
            Institutional Config
          </Button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Regional Nodes"
          value="18 Hubs"
          subtext="100% online & connected"
          icon={<Server size={20} />}
          statusTag="ONLINE"
          statusVariant="success"
        />
        <StatCard
          title="Registered Portal Users"
          value="5,240 Users"
          subtext="Donors, Requesters & Admins"
          icon={<Users size={20} />}
        />
        <StatCard
          title="Security Audit Events"
          value="1,420 Events"
          subtext="AIP-160 Compliant"
          icon={<FileText size={20} />}
          statusTag="SECURE"
          statusVariant="success"
        />
        <StatCard
          title="Auto Dispatch Safety"
          value={`${settings?.autoDispatchThreshold || 15}%`}
          subtext="Minimum safety threshold"
          icon={<ShieldCheck size={20} />}
          highlight={true}
        />
      </div>

      {/* Main Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: System Audit Log Stream */}
        <Card padding="md" className="lg:col-span-7 border-[#E2BEBC]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2BEBC]/60">
            <h3 className="text-sm font-bold text-[#1B1C1C] uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#8B0015]" /> Recent Compliance Audit Logs
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/audit-logs')}>
              Full Logs →
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 bg-[#F6F3F2] rounded-lg border border-[#E2BEBC]/60 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-[#1B1C1C]">{log.action}</div>
                  <div className="text-[11px] text-[#5A413F]">{log.user} • {log.details}</div>
                  <span className="text-[10px] font-mono text-[#8B0015]">{log.timestamp} • IP: {log.ipAddress}</span>
                </div>
                <StatusChip status={log.status} variant={log.status === 'SUCCESS' ? 'success' : 'warning'} />
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Institutional Details */}
        <Card padding="md" className="lg:col-span-5 border-[#E2BEBC]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2BEBC]/60">
            <h3 className="text-sm font-bold text-[#1B1C1C] uppercase tracking-wider flex items-center gap-2">
              <Sliders size={16} className="text-[#8B0015]" /> Institutional Nodal Hub
            </h3>
          </div>

          {settings && (
            <div className="flex flex-col gap-3 text-xs text-[#5A413F]">
              <div>
                <span className="font-bold text-[#1B1C1C] block">Nodal Blood Center:</span>
                <span className="font-semibold text-sm text-[#8B0015]">{settings.bloodBankName}</span>
              </div>
              <div>
                <span className="font-bold text-[#1B1C1C] block">NBTC License Number:</span>
                <span className="font-mono font-bold text-[#1B1C1C]">{settings.licenseNumber}</span>
              </div>
              <div>
                <span className="font-bold text-[#1B1C1C] block">Nodal Officer:</span>
                <span>{settings.nodalOfficer}</span>
              </div>
              <div>
                <span className="font-bold text-[#1B1C1C] block">Emergency Hotline:</span>
                <span className="font-mono font-bold text-[#B91C2A]">{settings.emergencyHotline}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/settings')}
                className="mt-2"
                icon={<ArrowRight size={14} />}
              >
                Modify Institutional Parameters
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
