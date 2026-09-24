import React from 'react';
import { Bell, ShieldAlert, CheckCircle2, Clock, Info } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatusChip } from '../../components/ui/Badge';

export const Notifications: React.FC = () => {
  const notificationsList = [
    { id: '1', title: 'Critical Stock Threshold Warning (O- PRBC)', time: '10 mins ago', type: 'CRITICAL', body: 'Vault A-2 units dropped below safety threshold (6 units available).' },
    { id: '2', title: 'New Emergency Requisition (REQ-2026-8812)', time: '25 mins ago', type: 'URGENT', body: 'AIIMS Emergency Trauma Center requested 4 units PRBC for polytrauma case.' },
    { id: '3', title: 'Donation Campaign Confirmation', time: '2 hours ago', type: 'INFO', body: 'Rotary Blood Bank registered 45 donor pledges for upcoming drive.' },
  ];

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Notifications & Alert Center</h1>
          <p className="text-xs text-[#5A413F]">Real-time system dispatches, inventory warnings, and regulatory notices</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {notificationsList.map((item) => (
          <Card key={item.id} padding="md" className="flex flex-col gap-2 border-[#E2BEBC]">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#1B1C1C] flex items-center gap-2">
                <Bell size={16} className="text-[#8B0015]" /> {item.title}
              </h4>
              <span className="text-xs font-mono text-[#5A413F]">{item.time}</span>
            </div>
            <p className="text-xs text-[#5A413F]">{item.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
