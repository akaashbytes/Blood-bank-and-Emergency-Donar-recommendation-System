import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, ShieldCheck, PhoneCall, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { bloodStockService } from '../../services/apiServices';
import { BloodStockItem, BloodGroup, ComponentType } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BloodGroupBadge, StatusChip } from '../../components/ui/Badge';
import { BLOOD_GROUPS, COMPONENTS_LIST } from '../../config/theme';

export const FindBlood: React.FC = () => {
  const navigate = useNavigate();
  const [stockList, setStockList] = useState<BloodStockItem[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    bloodStockService.getStock().then(setStockList);
  }, []);

  const filteredStock = stockList.filter((item) => {
    const matchGroup = selectedGroup === 'ALL' || item.bloodGroup === selectedGroup;
    const matchComp = selectedComponent === 'ALL' || item.component === selectedComponent;
    const matchSearch = item.storageUnit.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGroup && matchComp && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2BEBC] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B0015] bg-[#8B0015]/10 px-2.5 py-0.5 rounded-full">
            Real-Time Inventory Vault Search
          </span>
          <h1 className="text-2xl font-bold text-[#1B1C1C] mt-1">
            Find Blood Availability in Regional Grid
          </h1>
          <p className="text-xs text-[#5A413F]">
            Directly query accredited blood banks, available storage units, and emergency reserve thresholds
          </p>
        </div>

        <Button
          variant="urgent"
          size="md"
          onClick={() => navigate('/login')}
          icon={<PhoneCall size={16} />}
        >
          Request Emergency Allocation
        </Button>
      </div>

      {/* Filter Controls */}
      <Card padding="md" className="border-[#E2BEBC]/80">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5A413F] uppercase tracking-wider">
            <Filter size={14} className="text-[#8B0015]" /> Filter Blood Vault Stock
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#5A413F] block mb-1">Blood Group</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full h-10 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md text-xs font-bold text-[#1B1C1C]"
              >
                <option value="ALL">All Blood Groups (A+, O-, B+...)</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g} Blood Type</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#5A413F] block mb-1">Component Required</label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full h-10 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md text-xs font-bold text-[#1B1C1C]"
              >
                <option value="ALL">All Components (PRBC, Platelets...)</option>
                {COMPONENTS_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#5A413F] block mb-1">Search Vault / Unit</label>
              <input
                type="text"
                placeholder="e.g. Vault A-1 or O-"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md text-xs font-semibold text-[#1B1C1C] placeholder-[#9CA3AF]"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStock.map((item) => {
          const isCritical = item.unitsAvailable <= item.criticalThreshold;

          return (
            <Card key={item.id} variant="default" padding="md" className="flex flex-col gap-4 relative">
              <div className="flex items-center justify-between border-b border-[#E2BEBC]/40 pb-3">
                <div className="flex items-center gap-3">
                  <BloodGroupBadge group={item.bloodGroup} size="lg" active={true} />
                  <div>
                    <h4 className="text-base font-extrabold text-[#1B1C1C]">{item.bloodGroup} {item.component}</h4>
                    <span className="text-xs text-[#5A413F] font-mono">{item.storageUnit}</span>
                  </div>
                </div>
                {isCritical ? (
                  <StatusChip status="CRITICAL SHORTAGE" variant="danger" pulse={true} />
                ) : (
                  <StatusChip status="STOCK OK" variant="success" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 py-1 bg-[#F6F3F2] p-3 rounded-lg border border-[#E2BEBC]/40">
                <div>
                  <span className="text-[10px] text-[#5A413F] uppercase font-bold">Units Available</span>
                  <div className="text-2xl font-black font-mono text-[#8B0015]">{item.unitsAvailable} Units</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#5A413F] uppercase font-bold">Reserved / In-Transit</span>
                  <div className="text-xl font-bold font-mono text-[#1B1C1C]">{item.reservedUnits} Units</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#5A413F]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#15803D]" /> Cold Chain Tested
                </span>
                <span className="font-mono">Updated: {item.lastUpdated}</span>
              </div>

              <Button
                variant={isCritical ? 'urgent' : 'primary'}
                size="sm"
                onClick={() => navigate('/login')}
                className="w-full mt-1"
                icon={<ArrowRight size={14} />}
              >
                Request Units From Vault
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
