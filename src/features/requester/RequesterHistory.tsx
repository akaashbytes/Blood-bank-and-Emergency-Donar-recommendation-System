import React, { useState, useEffect } from 'react';
import { FileText, Search, Clock, Download, CheckCircle2 } from 'lucide-react';
import { emergencyRequestService } from '../../services/apiServices';
import { EmergencyRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusChip, BloodGroupBadge } from '../../components/ui/Badge';

export const RequesterHistory: React.FC = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);

  useEffect(() => {
    emergencyRequestService.getRequests().then(setRequests);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Requisition History & Transfusion Records</h1>
          <p className="text-xs text-[#5A413F]">Complete audit history of blood requests and fulfillment status</p>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden border-[#E2BEBC]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1B1C1C]">
            <thead className="bg-[#F6F3F2] text-[#5A413F] uppercase font-bold text-[10px] tracking-wider border-b border-[#E2BEBC]">
              <tr>
                <th className="p-3.5">Requisition Code</th>
                <th className="p-3.5">Patient & Hospital</th>
                <th className="p-3.5">Blood Group & Component</th>
                <th className="p-3.5">Units (Req/Alloc)</th>
                <th className="p-3.5">Urgency</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2BEBC]/60 font-medium">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-[#FCF9F8]">
                  <td className="p-3.5 font-mono font-bold text-[#8B0015]">{req.requestCode}</td>
                  <td className="p-3.5">
                    <div className="font-bold">{req.patientName}</div>
                    <div className="text-[11px] text-[#5A413F]">{req.hospitalName}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <BloodGroupBadge group={req.bloodGroup} size="sm" active={true} />
                      <span>{req.component}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-bold">{req.unitsRequired} / {req.unitsAllocated}</td>
                  <td className="p-3.5 font-bold text-[#B91C2A]">{req.urgency}</td>
                  <td className="p-3.5">
                    <StatusChip status={req.status} variant={req.status === 'FULFILLED' ? 'success' : 'warning'} />
                  </td>
                  <td className="p-3.5">
                    <Button variant="ghost" size="sm" icon={<Download size={12} />}>
                      PDF Slip
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
