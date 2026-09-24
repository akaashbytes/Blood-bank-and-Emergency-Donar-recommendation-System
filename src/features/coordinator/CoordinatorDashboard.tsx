import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, Droplet, Bell, Users, CheckCircle2, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { bloodStockService, emergencyRequestService, expiryService } from '../../services/apiServices';
import { BloodStockItem, EmergencyRequest, ExpiryAlert } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusChip, BloodGroupBadge } from '../../components/ui/Badge';

export const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stock, setStock] = useState<BloodStockItem[]>([]);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [alerts, setAlerts] = useState<ExpiryAlert[]>([]);

  useEffect(() => {
    bloodStockService.getStock().then(setStock);
    emergencyRequestService.getRequests().then(setRequests);
    expiryService.getExpiryAlerts().then(setAlerts);
  }, []);

  const totalStockUnits = stock.reduce((acc, s) => acc + s.unitsAvailable, 0);
  const pendingCount = requests.filter((r) => r.status !== 'FULFILLED').length;
  const criticalAlertsCount = alerts.filter((a) => a.status === 'CRITICAL_24H').length;

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#8B0015] via-[#65000F] to-[#4A000B] text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFDAD7] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
            Nodal Regional Command Console
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Central Blood Bank Coordinator Console
          </h1>
          <p className="text-xs text-[#FFDAD7]">
            Real-time vault control, emergency request dispatch & cold-chain inventory management
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="urgent"
            size="md"
            onClick={() => navigate('/coordinator/emergency')}
            icon={<ShieldAlert size={16} />}
          >
            Emergency Dispatch Desk
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Stock in Vaults"
          value={`${totalStockUnits} Units`}
          subtext="8 Storage units active"
          icon={<Droplet size={20} />}
          highlight={true}
        />
        <StatCard
          title="Active Requisitions"
          value={`${pendingCount} Requests`}
          subtext="4 Critical emergency"
          icon={<ShieldAlert size={20} />}
          statusTag="ACTION REQUIRED"
          statusVariant="warning"
        />
        <StatCard
          title="Critical Expiry Alerts"
          value={`${criticalAlertsCount} Units`}
          subtext="Expiring within 24 Hours"
          icon={<Bell size={20} />}
          statusTag="EXPIRY RISK"
          statusVariant="danger"
        />
        <StatCard
          title="Voluntary Donors On-Call"
          value="142 Donors"
          subtext="Eligible for O- & AB- calls"
          icon={<Users size={20} />}
          statusTag="READY"
          statusVariant="success"
        />
      </div>

      {/* Main Grid: Vault Quick Matrix & Emergency Requests Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Real-Time Stock Matrix */}
        <Card padding="md" className="lg:col-span-5 border-[#E2BEBC]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2BEBC]/60">
            <h3 className="text-sm font-bold text-[#1B1C1C] uppercase tracking-wider flex items-center gap-2">
              <Droplet size={16} className="text-[#8B0015]" /> Vault Stock Matrix
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/coordinator/inventory')}>
              Vault Console →
            </Button>
          </div>

          <div className="flex flex-col gap-2.5">
            {stock.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#F6F3F2] rounded-lg border border-[#E2BEBC]/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <BloodGroupBadge group={item.bloodGroup} size="sm" active={true} />
                  <div>
                    <div className="text-xs font-bold text-[#1B1C1C]">{item.component}</div>
                    <div className="text-[10px] text-[#5A413F] font-mono">{item.storageUnit}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold font-mono text-[#8B0015]">{item.unitsAvailable} Units</div>
                  <span className="text-[10px] text-[#5A413F] font-mono">Res: {item.reservedUnits}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Emergency Requests Queue */}
        <Card padding="md" className="lg:col-span-7 border-[#8B0015]/30">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2BEBC]/60">
            <h3 className="text-sm font-bold text-[#8B0015] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={16} /> Urgent Requisitions Queue
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/coordinator/emergency')}>
              Full Dispatch Desk →
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {requests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="p-4 bg-white border border-[#E2BEBC] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <BloodGroupBadge group={req.bloodGroup} size="md" active={true} />
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1C1C]">{req.hospitalName}</h4>
                    <p className="text-xs text-[#5A413F]">
                      Patient: {req.patientName} • Needed: {req.unitsRequired} Units {req.component}
                    </p>
                    <span className="text-[10px] font-mono text-[#8B0015] font-bold">Req Code: {req.requestCode}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  <StatusChip status={req.urgency} variant="danger" pulse={true} />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/coordinator/emergency')}
                  >
                    Allocate & Dispatch
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
