import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, Trash2, ArrowRight } from 'lucide-react';
import { expiryService } from '../../services/apiServices';
import { ExpiryAlert } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusChip, BloodGroupBadge } from '../../components/ui/Badge';

export const ExpiryAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<ExpiryAlert[]>([]);

  useEffect(() => {
    expiryService.getExpiryAlerts().then(setAlerts);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Stock Expiry Monitoring & Alerts</h1>
          <p className="text-xs text-[#5A413F]">Identify blood units nearing expiration date to prioritize emergency dispatch or transfer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id} padding="md" className="flex flex-col gap-3 border-[#B91C2A]/30">
            <div className="flex items-center justify-between border-b border-[#E2BEBC]/60 pb-3">
              <div className="flex items-center gap-3">
                <BloodGroupBadge group={alert.bloodGroup} size="md" active={true} />
                <div>
                  <h4 className="text-sm font-bold text-[#1B1C1C]">{alert.component}</h4>
                  <span className="text-xs font-mono text-[#8B0015]">Batch ID: {alert.unitId}</span>
                </div>
              </div>
              <StatusChip status={alert.status} variant="danger" pulse={true} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-[#5A413F]">
              <div><span className="font-bold text-[#1B1C1C]">Quantity:</span> {alert.quantityUnits} Units</div>
              <div><span className="font-bold text-[#1B1C1C]">Storage:</span> {alert.location}</div>
              <div><span className="font-bold text-[#1B1C1C]">Expiration Date:</span> <span className="text-[#B91C2A] font-bold">{alert.expiryDate}</span></div>
              <div><span className="font-bold text-[#1B1C1C]">Time Remaining:</span> <span className="font-bold">{alert.daysRemaining} Day(s)</span></div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#E2BEBC]/60">
              <Button variant="primary" size="sm" className="flex-1" icon={<ArrowRight size={14} />}>
                Priority Dispatch
              </Button>
              <Button variant="ghost" size="sm" icon={<Trash2 size={14} />}>
                Disposal Log
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
