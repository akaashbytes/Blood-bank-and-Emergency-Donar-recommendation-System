import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Plus, Clock, Search, CheckCircle2, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { emergencyRequestService } from '../../services/apiServices';
import { EmergencyRequest, BloodGroup, ComponentType, RequestUrgency } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { StatCard } from '../../components/ui/StatCard';
import { StatusChip, BloodGroupBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { BLOOD_GROUPS, COMPONENTS_LIST } from '../../config/theme';

export const RequesterDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState(currentUser?.institutionName || 'City Care Hospital');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<ComponentType>('PRBC (Red Cells)');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [urgency, setUrgency] = useState<RequestUrgency>('CRITICAL_EMERGENCY');
  const [requiredBy, setRequiredBy] = useState('Within 1 Hour');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emergencyRequestService.getRequests().then(setRequests);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const created = await emergencyRequestService.createRequest({
      patientName,
      hospitalName,
      city: 'New Delhi',
      bloodGroup,
      component,
      unitsRequired,
      urgency,
      requesterName: currentUser?.name || 'Dr. Rajesh Kumar',
      requesterContact: currentUser?.phone || '+91 98112 34567',
      requiredBy,
      notes,
    });
    setRequests([created, ...requests]);
    setLoading(false);
    setModalOpen(false);
    // Reset form
    setPatientName('');
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2BEBC] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B0015] bg-[#8B0015]/10 px-2.5 py-0.5 rounded-full">
            Accredited Requester Gateway
          </span>
          <h1 className="text-2xl font-bold text-[#1B1C1C] mt-1">
            Requester & Hospital Emergency Console
          </h1>
          <p className="text-xs text-[#5A413F]">
            Submit clinical blood requisitions directly to regional vault dispatch & track allocations
          </p>
        </div>

        <Button
          variant="urgent"
          size="md"
          onClick={() => setModalOpen(true)}
          icon={<Plus size={16} />}
        >
          Create Emergency Requisition
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Active Requisitions"
          value={requests.filter((r) => r.status !== 'FULFILLED').length}
          subtext="In active dispatch or verification"
          icon={<Clock size={20} />}
          statusTag="IN PROGRESS"
          statusVariant="warning"
        />
        <StatCard
          title="Allocated Units"
          value={requests.reduce((acc, r) => acc + r.unitsAllocated, 0)}
          subtext="Dispatched cold-chain units"
          icon={<CheckCircle2 size={20} />}
          statusTag="ALLOCATED"
          statusVariant="success"
        />
        <StatCard
          title="Total Requisitions"
          value={requests.length}
          subtext="Submitted through portal"
          icon={<FileText size={20} />}
        />
      </div>

      {/* Requisitions List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1B1C1C]">Active Blood Requisitions</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/public/track-request')}>
            Open Live Tracking Page →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <Card key={req.id} padding="md" className="flex flex-col gap-3 border-[#8B0015]/20">
              <div className="flex items-center justify-between border-b border-[#E2BEBC]/60 pb-3">
                <div className="flex items-center gap-3">
                  <BloodGroupBadge group={req.bloodGroup} size="md" active={true} />
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1C1C]">Patient: {req.patientName}</h4>
                    <span className="text-xs font-mono text-[#8B0015]">Tracking Code: {req.requestCode}</span>
                  </div>
                </div>
                <StatusChip status={req.status} variant={req.status === 'FULFILLED' ? 'success' : 'warning'} pulse={req.status !== 'FULFILLED'} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#5A413F]">
                <div><span className="font-bold text-[#1B1C1C]">Hospital:</span> {req.hospitalName}</div>
                <div><span className="font-bold text-[#1B1C1C]">Component:</span> {req.component}</div>
                <div><span className="font-bold text-[#1B1C1C]">Units Needed:</span> {req.unitsRequired} ({req.unitsAllocated} Allocated)</div>
                <div><span className="font-bold text-[#1B1C1C]">Urgency:</span> <span className="text-[#B91C2A] font-bold">{req.urgency}</span></div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/public/track-request')}
                className="w-full mt-1"
              >
                Track Dispatch Status
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* New Requisition Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Clinical Blood Requisition"
        subtitle="Submit urgent blood unit requirement to Central Vault Dispatch"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Patient Name"
            placeholder="e.g. Rohit Malhotra"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hospital / Emergency Unit"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
            />
            <Select
              label="Blood Group Required"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Component Type"
              value={component}
              onChange={(e) => setComponent(e.target.value as ComponentType)}
              options={COMPONENTS_LIST.map((c) => ({ value: c, label: c }))}
            />
            <Input
              label="Units Required"
              type="number"
              min="1"
              max="10"
              value={unitsRequired}
              onChange={(e) => setUnitsRequired(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Urgency Level"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as RequestUrgency)}
              options={[
                { value: 'CRITICAL_EMERGENCY', label: 'CRITICAL EMERGENCY (< 1 Hour)' },
                { value: 'HIGH', label: 'HIGH (Within 4 Hours)' },
                { value: 'ROUTINE', label: 'ROUTINE (Today)' },
              ]}
            />
            <Input
              label="Required By Timeframe"
              value={requiredBy}
              onChange={(e) => setRequiredBy(e.target.value)}
              required
            />
          </div>

          <Input
            label="Clinical Diagnosis / OT Notes"
            placeholder="e.g. Major polytrauma, undergoing surgery in OT 4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="pt-3 border-t border-[#E2BEBC]/60 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={loading}>
              Submit Requisition
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
