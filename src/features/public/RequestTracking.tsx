import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, Clock, MapPin, Truck, PhoneCall, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Timeline, TimelineStep } from '../../components/ui/Timeline';
import { StatusChip, BloodGroupBadge } from '../../components/ui/Badge';
import { MOCK_EMERGENCY_REQUESTS } from '../../services/mockData';
import { EmergencyRequest } from '../../types';

export const RequestTracking: React.FC = () => {
  const [requestCode, setRequestCode] = useState<string>('REQ-2026-8812');
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(MOCK_EMERGENCY_REQUESTS[0]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const found = MOCK_EMERGENCY_REQUESTS.find(
      (r) => r.requestCode.toUpperCase() === requestCode.trim().toUpperCase()
    );
    if (found) {
      setActiveRequest(found);
    } else {
      setActiveRequest(null);
      setErrorMsg(`Request code '${requestCode}' not found in active dispatch grid.`);
    }
  };

  const steps: TimelineStep[] = activeRequest
    ? [
        { id: '1', title: 'Request Requisition Received', subtitle: `Submitted by ${activeRequest.requesterName}`, timestamp: activeRequest.createdAt, status: 'completed' },
        { id: '2', title: 'Medical Eligibility & Vault Check', subtitle: `Vault stock verified for ${activeRequest.bloodGroup} ${activeRequest.component}`, timestamp: '15:45', status: 'completed' },
        { id: '3', title: 'Cold-Chain Allocation & Packaging', subtitle: `${activeRequest.unitsAllocated} of ${activeRequest.unitsRequired} units packed in Insulated Cryo Container #4`, timestamp: '16:05', status: activeRequest.unitsAllocated > 0 ? 'completed' : 'active' },
        { id: '4', title: 'Ambulance Dispatch & En-Route', subtitle: 'Dispatched via Express Emergency Transit (GPS Unit DL-01-AMB-88)', timestamp: '16:20', status: activeRequest.status === 'DISPATCHED' ? 'active' : 'pending' },
        { id: '5', title: 'Hospital Delivery & Handover', subtitle: `Handover at ${activeRequest.hospitalName} Emergency OT`, timestamp: 'Pending', status: activeRequest.status === 'FULFILLED' ? 'completed' : 'pending' },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto py-2 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="text-center mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8B0015] bg-[#8B0015]/10 px-3 py-1 rounded-full">
          Live Dispatch Tracking
        </span>
        <h1 className="text-3xl font-extrabold text-[#1B1C1C] mt-2">
          Emergency Request Tracker
        </h1>
        <p className="text-xs text-[#5A413F] mt-1">
          Track real-time status, cold-chain temperature, and ambulance dispatch for your blood requisition
        </p>
      </div>

      {/* Search Bar */}
      <Card padding="md" className="border-[#8B0015]/30">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-end">
          <Input
            label="Enter Requisition / Tracking Code"
            placeholder="e.g. REQ-2026-8812"
            value={requestCode}
            onChange={(e) => setRequestCode(e.target.value)}
            className="font-mono text-sm uppercase"
            required
          />
          <Button type="submit" variant="primary" size="md" className="h-11 shrink-0" icon={<Search size={16} />}>
            Track Request
          </Button>
        </form>
        {errorMsg && <p className="text-xs text-[#B91C2A] font-bold mt-2">{errorMsg}</p>}
      </Card>

      {/* Request Details View */}
      {activeRequest && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Summary Card */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Card variant="elevated" padding="md" className="border-[#8B0015]/20 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#E2BEBC]/60 pb-3">
                <div>
                  <span className="text-[10px] text-[#5A413F] font-bold uppercase">Tracking ID</span>
                  <div className="text-lg font-black font-mono text-[#8B0015]">{activeRequest.requestCode}</div>
                </div>
                <StatusChip status={activeRequest.status} variant={activeRequest.status === 'IN_PROGRESS' ? 'warning' : 'success'} pulse={true} />
              </div>

              <div className="flex items-center gap-3">
                <BloodGroupBadge group={activeRequest.bloodGroup} size="lg" active={true} />
                <div>
                  <h4 className="text-base font-bold text-[#1B1C1C]">{activeRequest.bloodGroup} {activeRequest.component}</h4>
                  <span className="text-xs font-bold text-[#8B0015]">{activeRequest.unitsRequired} Units Required ({activeRequest.unitsAllocated} Allocated)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#E2BEBC]/60 text-xs text-[#5A413F]">
                <div><span className="font-bold text-[#1B1C1C]">Patient:</span> {activeRequest.patientName}</div>
                <div><span className="font-bold text-[#1B1C1C]">Hospital:</span> {activeRequest.hospitalName}</div>
                <div><span className="font-bold text-[#1B1C1C]">Requisitioner:</span> {activeRequest.requesterName}</div>
                <div><span className="font-bold text-[#1B1C1C]">Urgency Level:</span> <span className="text-[#B91C2A] font-extrabold">{activeRequest.urgency}</span></div>
              </div>

              <div className="bg-[#DCFCE7] p-3 rounded-lg border border-[#BBF7D0] text-xs text-[#15803D] flex items-center gap-2">
                <Truck size={18} className="shrink-0" />
                <span>Express Transit Ambulance #4 assigned with temperature logging active (4°C).</span>
              </div>
            </Card>
          </div>

          {/* Right Column: Step Timeline */}
          <Card padding="md" className="md:col-span-7 border-[#E2BEBC]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B1C1C] mb-4 pb-2 border-b border-[#E2BEBC]/60">
              Live Fulfillment Timeline
            </h3>
            <Timeline steps={steps} />
          </Card>
        </div>
      )}
    </div>
  );
};
