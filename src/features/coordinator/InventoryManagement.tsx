import React, { useState, useEffect } from 'react';
import { Droplet, Edit3, AlertTriangle, ShieldCheck, Plus, RefreshCw } from 'lucide-react';
import { bloodStockService } from '../../services/apiServices';
import { BloodStockItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BloodGroupBadge, StatusChip } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const InventoryManagement: React.FC = () => {
  const [stock, setStock] = useState<BloodStockItem[]>([]);
  const [editItem, setEditItem] = useState<BloodStockItem | null>(null);
  const [newUnits, setNewUnits] = useState(0);

  useEffect(() => {
    bloodStockService.getStock().then(setStock);
  }, []);

  const handleUpdate = async () => {
    if (!editItem) return;
    const updated = await bloodStockService.updateStockUnits(editItem.id, newUnits);
    setStock(stock.map((s) => (s.id === updated.id ? updated : s)));
    setEditItem(null);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Inventory Vault Management</h1>
          <p className="text-xs text-[#5A413F]">Monitor and adjust live blood stock units across regional cold-chain vaults</p>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden border-[#E2BEBC]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1B1C1C]">
            <thead className="bg-[#F6F3F2] text-[#5A413F] uppercase font-bold text-[10px] tracking-wider border-b border-[#E2BEBC]">
              <tr>
                <th className="p-3.5">Blood Group</th>
                <th className="p-3.5">Component</th>
                <th className="p-3.5">Storage Location</th>
                <th className="p-3.5">Available Units</th>
                <th className="p-3.5">Reserved Units</th>
                <th className="p-3.5">Critical Threshold</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2BEBC]/60 font-medium">
              {stock.map((item) => {
                const isCritical = item.unitsAvailable <= item.criticalThreshold;

                return (
                  <tr key={item.id} className="hover:bg-[#FCF9F8]">
                    <td className="p-3.5">
                      <BloodGroupBadge group={item.bloodGroup} size="sm" active={true} />
                    </td>
                    <td className="p-3.5 font-bold">{item.component}</td>
                    <td className="p-3.5 font-mono text-[#5A413F]">{item.storageUnit}</td>
                    <td className="p-3.5 font-mono font-extrabold text-[#8B0015] text-sm">{item.unitsAvailable}</td>
                    <td className="p-3.5 font-mono">{item.reservedUnits}</td>
                    <td className="p-3.5 font-mono text-[#5A413F]">{item.criticalThreshold}</td>
                    <td className="p-3.5">
                      {isCritical ? (
                        <StatusChip status="CRITICAL" variant="danger" pulse={true} />
                      ) : (
                        <StatusChip status="ADEQUATE" variant="success" />
                      )}
                    </td>
                    <td className="p-3.5">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit3 size={12} />}
                        onClick={() => {
                          setEditItem(item);
                          setNewUnits(item.unitsAvailable);
                        }}
                      >
                        Adjust
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {editItem && (
        <Modal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          title={`Adjust Vault Units - ${editItem.bloodGroup} ${editItem.component}`}
          subtitle={`Vault Container: ${editItem.storageUnit}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditItem(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleUpdate}>Save Adjustments</Button>
            </>
          }
        >
          <div className="flex flex-col gap-4 text-xs text-[#5A413F]">
            <div>
              <label className="font-bold text-[#1B1C1C] block mb-1">Total Available Units in Vault</label>
              <input
                type="number"
                value={newUnits}
                onChange={(e) => setNewUnits(Number(e.target.value))}
                className="w-full h-10 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md font-bold font-mono text-base text-[#8B0015]"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
