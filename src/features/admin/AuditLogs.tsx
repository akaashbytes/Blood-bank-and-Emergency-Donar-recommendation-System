import React, { useState, useEffect } from 'react';
import { FileText, Shield, Search, Download } from 'lucide-react';
import { adminService } from '../../services/apiServices';
import { AuditLogItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusChip } from '../../components/ui/Badge';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    adminService.getAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">System Audit Logs (AIP-160 Standard)</h1>
          <p className="text-xs text-[#5A413F]">Immutable trail of user transactions, dispatch approvals, and configuration changes</p>
        </div>
        <Button variant="outline" size="sm" icon={<Download size={14} />}>
          Export Audit Trail (CSV)
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden border-[#E2BEBC]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1B1C1C]">
            <thead className="bg-[#F6F3F2] text-[#5A413F] uppercase font-bold text-[10px] tracking-wider border-b border-[#E2BEBC]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User & Role</th>
                <th className="p-3.5">Action & Module</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Event Details</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2BEBC]/60 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FCF9F8]">
                  <td className="p-3.5 font-mono text-[#5A413F]">{log.timestamp}</td>
                  <td className="p-3.5">
                    <div className="font-bold">{log.user}</div>
                    <span className="text-[10px] text-[#8B0015] font-bold">{log.role}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold">{log.action}</div>
                    <div className="text-[11px] text-[#5A413F]">{log.module}</div>
                  </td>
                  <td className="p-3.5 font-mono text-[#5A413F]">{log.ipAddress}</td>
                  <td className="p-3.5 text-[11px]">{log.details}</td>
                  <td className="p-3.5">
                    <StatusChip status={log.status} variant={log.status === 'SUCCESS' ? 'success' : 'warning'} />
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
