import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, UserCheck, AlertTriangle, Search } from 'lucide-react';
import { donorService } from '../../services/apiServices';
import { DonorRecord } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusChip, BloodGroupBadge } from '../../components/ui/Badge';

export const DonorManagement: React.FC = () => {
  const [donors, setDonors] = useState<DonorRecord[]>([]);

  useEffect(() => {
    donorService.getDonors().then(setDonors);
  }, []);

  const toggleVerification = async (id: string, currentStatus: DonorRecord['status']) => {
    const nextStatus = currentStatus === 'ELIGIBLE' ? 'TEMPORARY_DEFERRAL' : 'ELIGIBLE';
    const updated = await donorService.verifyDonor(id, nextStatus);
    setDonors(donors.map((d) => (d.id === updated.id ? updated : d)));
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Donor Management & Verification</h1>
          <p className="text-xs text-[#5A413F]">Verify voluntary donor health screenings, badges, and eligibility statuses</p>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden border-[#E2BEBC]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1B1C1C]">
            <thead className="bg-[#F6F3F2] text-[#5A413F] uppercase font-bold text-[10px] tracking-wider border-b border-[#E2BEBC]">
              <tr>
                <th className="p-3.5">Donor Code</th>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">Blood Group</th>
                <th className="p-3.5">Contact & City</th>
                <th className="p-3.5">Total Donations</th>
                <th className="p-3.5">Eligibility Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2BEBC]/60 font-medium">
              {donors.map((dnr) => (
                <tr key={dnr.id} className="hover:bg-[#FCF9F8]">
                  <td className="p-3.5 font-mono font-bold text-[#8B0015]">{dnr.donorCode}</td>
                  <td className="p-3.5">
                    <div className="font-bold flex items-center gap-1.5">
                      {dnr.fullName}
                      {dnr.verifiedBadge && <ShieldCheck size={14} className="text-[#15803D]" />}
                    </div>
                    <div className="text-[11px] text-[#5A413F]">{dnr.email}</div>
                  </td>
                  <td className="p-3.5">
                    <BloodGroupBadge group={dnr.bloodGroup} size="sm" active={true} />
                  </td>
                  <td className="p-3.5">
                    <div>{dnr.phone}</div>
                    <div className="text-[11px] text-[#5A413F]">{dnr.city}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold">{dnr.totalDonations} Times</td>
                  <td className="p-3.5">
                    <StatusChip status={dnr.status} variant={dnr.status === 'ELIGIBLE' ? 'success' : 'warning'} />
                  </td>
                  <td className="p-3.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVerification(dnr.id, dnr.status)}
                    >
                      {dnr.status === 'ELIGIBLE' ? 'Defer' : 'Verify & Clear'}
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
