import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, ShieldAlert, PhoneCall, CheckCircle2 } from 'lucide-react';
import { emergencyRequestService } from '../../services/apiServices';
import { EmergencyRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BloodGroupBadge, StatusChip } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const DonorRequests: React.FC = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<EmergencyRequest | null>(null);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  useEffect(() => {
    emergencyRequestService.getRequests().then(setRequests);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Active Blood Calls & Urgent Needs</h1>
          <p className="text-xs text-[#5A413F]">Emergency patient requirements in your region matching voluntary donors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req) => (
          <Card key={req.id} padding="md" className="flex flex-col gap-4 border-[#8B0015]/20">
            <div className="flex items-center justify-between border-b border-[#E2BEBC]/60 pb-3">
              <div className="flex items-center gap-3">
                <BloodGroupBadge group={req.bloodGroup} size="md" active={true} />
                <div>
                  <h4 className="text-base font-bold text-[#1B1C1C]">{req.hospitalName}</h4>
                  <span className="text-xs font-mono text-[#5A413F]">Req Code: {req.requestCode}</span>
                </div>
              </div>
              <StatusChip status={req.urgency} variant="danger" pulse={true} />
            </div>

            <div className="flex flex-col gap-1 text-xs text-[#5A413F]">
              <div><span className="font-bold text-[#1B1C1C]">Patient Name:</span> {req.patientName}</div>
              <div><span className="font-bold text-[#1B1C1C]">Required Component:</span> {req.unitsRequired} Units of {req.component}</div>
              <div><span className="font-bold text-[#1B1C1C]">Required Timing:</span> <span className="text-[#8B0015] font-bold">{req.requiredBy}</span></div>
              {req.notes && <div className="mt-1 p-2 bg-[#F6F3F2] rounded text-[11px] font-mono">{req.notes}</div>}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setSelectedReq(req)}
              icon={<Heart size={14} />}
              className="w-full mt-2"
            >
              Respond & Pledge Blood
            </Button>
          </Card>
        ))}
      </div>

      {selectedReq && (
        <Modal
          isOpen={!!selectedReq}
          onClose={() => setSelectedReq(null)}
          title={`Pledge Blood for ${selectedReq.patientName}`}
          subtitle={`Hospital: ${selectedReq.hospitalName}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setSelectedReq(null)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={() => {
                  pledgeSuccess ? null : setPledgeSuccess(true);
                  setTimeout(() => {
                    setPledgeSuccess(false);
                    setSelectedReq(null);
                  }, 1500);
                }}
              >
                Confirm Pledge
              </Button>
            </>
          }
        >
          {pledgeSuccess ? (
            <div className="p-6 text-center text-[#15803D] flex flex-col items-center gap-2">
              <CheckCircle2 size={48} />
              <h4 className="text-lg font-bold">Pledge Registered!</h4>
              <p className="text-xs text-[#5A413F]">The hospital nodal coordinator has been notified. Instructions sent via SMS.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-xs text-[#5A413F]">
              <p className="font-semibold text-[#1B1C1C]">
                Thank you for stepping forward! By pledging, you agree to visit {selectedReq.hospitalName} or the central blood bank for screening and donation.
              </p>
              <div className="p-3 bg-[#F6F3F2] rounded-lg">
                <div className="font-bold text-[#1B1C1C]">Contact Nodal Desk:</div>
                <div>{selectedReq.requesterName} ({selectedReq.requesterContact})</div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
