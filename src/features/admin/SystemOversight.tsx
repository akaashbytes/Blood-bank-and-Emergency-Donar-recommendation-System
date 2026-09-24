import React, { useState, useEffect } from 'react';
import { ShieldAlert, Server, Activity, CheckCircle2 } from 'lucide-react';
import { emergencyRequestService } from '../../services/apiServices';
import { EmergencyRequest } from '../../types';
import { Card } from '../../components/ui/Card';
import { StatusChip, BloodGroupBadge } from '../../components/ui/Badge';

export const SystemOversight: React.FC = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);

  useEffect(() => {
    emergencyRequestService.getRequests().then(setRequests);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">System Request Oversight</h1>
          <p className="text-xs text-[#5A413F]">High-level monitoring of all hospital requisitions across regional centers</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {requests.map((req) => (
          <Card key={req.id} padding="md" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-[#E2BEBC]">
            <div className="flex items-center gap-4">
              <BloodGroupBadge group={req.bloodGroup} size="md" active={true} />
              <div>
                <h4 className="text-sm font-bold text-[#1B1C1C]">{req.hospitalName} ({req.city})</h4>
                <p className="text-xs text-[#5A413F]">
                  Patient: {req.patientName} • Code: {req.requestCode}
                </p>
                <span className="text-[11px] font-mono text-[#8B0015]">Required: {req.unitsRequired} Units {req.component}</span>
              </div>
            </div>

            <StatusChip status={req.status} variant={req.status === 'FULFILLED' ? 'success' : 'warning'} />
          </Card>
        ))}
      </div>
    </div>
  );
};
