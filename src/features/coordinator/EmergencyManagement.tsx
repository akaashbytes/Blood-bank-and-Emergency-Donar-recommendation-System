import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Truck, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { emergencyRequestService } from '../../services/apiServices';
import { EmergencyRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusChip, BloodGroupBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const EmergencyManagement: React.FC = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<EmergencyRequest | null>(null);
  const [allocationUnits, setAllocationUnits] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emergencyRequestService.getRequests().then(setRequests);
  }, []);

  const handleAllocate = async (status: EmergencyRequest['status']) => {
    if (!selectedReq) return;
    setLoading(true);
    const updated = await emergencyRequestService.updateRequestStatus(selectedReq.id, status, allocationUnits);
    setRequests(requests.map((r) => (r.id === updated.id ? updated : r)));
    setLoading(false);
    setSelectedReq(null);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Emergency Requisition & Dispatch Desk</h1>
          <p className="text-xs text-[#5A413F]">Review hospital requisitions, perform compatibility check, and authorize dispatch</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {requests.map((req) => (
          <Card key={req.id} padding="md" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-[#8B0015]/30">
            <div className="flex items-start gap-4">
              <BloodGroupBadge group={req.bloodGroup} size="lg" active={true} />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-[#1B1C1C]">{req.hospitalName}</h4>
                  <StatusChip status={req.status} variant={req.status === 'FULFILLED' ? 'success' : 'warning'} />
                </div>
                <p className="text-xs text-[#5A413F]">
                  Patient: <span className="font-bold text-[#1B1C1C]">{req.patientName}</span> • Requisitioner: {req.requesterName} ({req.requesterContact})
                </p>
                <div className="flex items-center gap-3 text-xs font-mono mt-1">
                  <span className="text-[#8B0015] font-bold">Req Code: {req.requestCode}</span>
                  <span>Component: {req.component}</span>
                  <span className="font-bold">Required: {req.unitsRequired} Units ({req.unitsAllocated} Allocated)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedReq(req);
                  setAllocationUnits(req.unitsRequired);
                }}
              >
                Manage & Allocate
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedReq && (
        <Modal
          isOpen={!!selectedReq}
          onClose={() => setSelectedReq(null)}
          title={`Allocate Blood Units - ${selectedReq.requestCode}`}
          subtitle={`Patient: ${selectedReq.patientName} (${selectedReq.hospitalName})`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setSelectedReq(null)}>Cancel</Button>
              <Button
                variant="urgent"
                isLoading={loading}
                onClick={() => handleAllocate('DISPATCHED')}
                icon={<Truck size={14} />}
              >
                Authorize Dispatch ({allocationUnits} Units)
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4 text-xs text-[#5A413F]">
            <div className="p-3 bg-[#F6F3F2] rounded-lg border border-[#E2BEBC] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1B1C1C] block">Blood Group & Component</span>
                <span className="text-sm font-extrabold text-[#8B0015]">{selectedReq.bloodGroup} {selectedReq.component}</span>
              </div>
              <div>
                <span className="font-bold text-[#1B1C1C] block">Units Requested</span>
                <span className="text-sm font-extrabold">{selectedReq.unitsRequired} Units</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-[#1B1C1C] block mb-1">Set Allocated Units for Release</label>
              <input
                type="number"
                min="1"
                max={selectedReq.unitsRequired}
                value={allocationUnits}
                onChange={(e) => setAllocationUnits(Number(e.target.value))}
                className="w-full h-10 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md font-bold font-mono text-sm"
              />
            </div>

            <div>
              <label className="font-bold text-[#1B1C1C] block mb-1">Select Vault Storage Container</label>
              <select className="w-full h-10 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md font-semibold text-[#1B1C1C]">
                <option>Vault A-2 (Cryo Preserved Batch #9901)</option>
                <option>Vault B-1 (Standard Reserve Batch #8812)</option>
              </select>
            </div>

            <div className="p-3 bg-[#DCFCE7] text-[#15803D] rounded-lg border border-[#BBF7D0]">
              <span className="font-bold block">Safety Screening Confirmation:</span>
              <span>All candidate units pass cross-matching and HIV/HBV/HCV negative certification.</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
