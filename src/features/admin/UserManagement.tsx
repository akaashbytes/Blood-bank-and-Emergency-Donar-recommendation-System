import React from 'react';
import { Users, UserCheck, Shield, Edit3 } from 'lucide-react';
import { MOCK_USERS } from '../../services/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusChip } from '../../components/ui/Badge';

export const UserManagement: React.FC = () => {
  const userList = Object.values(MOCK_USERS);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">User & Role Management</h1>
          <p className="text-xs text-[#5A413F]">Configure institutional user credentials, role permissions, and access privileges</p>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden border-[#E2BEBC]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1B1C1C]">
            <thead className="bg-[#F6F3F2] text-[#5A413F] uppercase font-bold text-[10px] tracking-wider border-b border-[#E2BEBC]">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Institution / City</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2BEBC]/60 font-medium">
              {userList.map((usr) => (
                <tr key={usr.id} className="hover:bg-[#FCF9F8]">
                  <td className="p-3.5 flex items-center gap-2.5">
                    <img src={usr.avatarUrl} alt={usr.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="font-bold">{usr.name}</span>
                  </td>
                  <td className="p-3.5 font-mono">{usr.email}</td>
                  <td className="p-3.5 font-bold text-[#8B0015]">{usr.role}</td>
                  <td className="p-3.5">{usr.institutionName || usr.city || 'N/A'}</td>
                  <td className="p-3.5"><StatusChip status="ACTIVE" variant="success" /></td>
                  <td className="p-3.5">
                    <Button variant="outline" size="sm" icon={<Edit3 size={12} />}>
                      Permissions
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
