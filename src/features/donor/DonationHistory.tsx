import React, { useState, useEffect } from 'react';
import { Award, Download, Calendar, CheckCircle2, Droplet, FileText } from 'lucide-react';
import { donorService } from '../../services/apiServices';
import { DonationHistoryItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusChip } from '../../components/ui/Badge';

export const DonationHistory: React.FC = () => {
  const [history, setHistory] = useState<DonationHistoryItem[]>([]);

  useEffect(() => {
    donorService.getDonationHistory().then(setHistory);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">My Donation History & Certificates</h1>
          <p className="text-xs text-[#5A413F]">Verified record of voluntary blood donations and official certificates</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {history.map((item) => (
          <Card key={item.id} padding="md" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-[#E2BEBC]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#8B0015]/10 text-[#8B0015] flex items-center justify-center font-extrabold text-lg">
                🩸
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-[#1B1C1C]">{item.bloodBankName}</h4>
                  <StatusChip status={item.status} variant="success" />
                </div>
                <p className="text-xs text-[#5A413F] mt-0.5">
                  {item.componentDonated} ({item.units} Unit) • {item.location}
                </p>
                <span className="text-[11px] font-mono text-[#8B0015] font-bold">
                  Date: {item.date} • Ref: {item.donationCode}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => alert(`Downloading Official Voluntary Donor Certificate ${item.donationCode}...`)}
            >
              Download Certificate (PDF)
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
