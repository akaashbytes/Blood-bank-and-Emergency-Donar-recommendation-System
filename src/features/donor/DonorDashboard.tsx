import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, ShieldCheck, Award, Clock, Activity, MapPin, CheckCircle2, ArrowRight, Droplet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { donorService, emergencyRequestService } from '../../services/apiServices';
import { DonorRecord, EmergencyRequest, DonationHistoryItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { BloodGroupBadge, StatusChip } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const DonorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [donorData, setDonorData] = useState<DonorRecord | null>(null);
  const [urgentCalls, setUrgentCalls] = useState<EmergencyRequest[]>([]);
  const [history, setHistory] = useState<DonationHistoryItem[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    donorService.getDonors().then((donors) => {
      const current = donors.find((d) => d.email === currentUser?.email) || donors[0];
      setDonorData(current);
    });
    emergencyRequestService.getRequests().then((reqs) => {
      setUrgentCalls(reqs.filter((r) => r.status !== 'FULFILLED'));
    });
    donorService.getDonationHistory().then(setHistory);
  }, [currentUser]);

  if (!donorData) return null;

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Donor Welcome & Eligibility Banner */}
      <div className="bg-gradient-to-r from-[#8B0015] to-[#65000F] text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatarUrl}
            alt={donorData.fullName}
            className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{donorData.fullName}</h1>
              {donorData.verifiedBadge && (
                <span className="bg-[#15803D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Voluntary Donor
                </span>
              )}
            </div>
            <p className="text-xs text-[#FFDAD7] mt-1 font-mono">
              Donor ID: {donorData.donorCode} • Registered City: {donorData.city}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="urgent"
            size="md"
            onClick={() => setBookingModalOpen(true)}
            icon={<Calendar size={16} />}
          >
            Schedule Next Donation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Blood Group"
          value={donorData.bloodGroup}
          subtext="Universal Donor Type"
          icon={<Droplet size={20} />}
          highlight={true}
        />
        <StatCard
          title="Donation Status"
          value="ELIGIBLE NOW"
          subtext={`Last donated: ${donorData.lastDonatedDate || 'N/A'}`}
          icon={<CheckCircle2 size={20} />}
          statusTag="READY"
          statusVariant="success"
        />
        <StatCard
          title="Total Donations"
          value={`${donorData.totalDonations} Times`}
          subtext="21 Units donated to date"
          icon={<Award size={20} />}
          statusTag="GOLD DONOR"
          statusVariant="info"
        />
        <StatCard
          title="Next Eligible Date"
          value={donorData.nextEligibleDate}
          subtext="Cleared for Whole Blood / PRBC"
          icon={<Clock size={20} />}
        />
      </div>

      {/* Health Metrics & Screening Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card padding="md" className="md:col-span-4 border-[#E2BEBC]">
          <h3 className="text-sm font-bold text-[#1B1C1C] uppercase tracking-wider mb-4 pb-2 border-b border-[#E2BEBC]/60 flex items-center gap-2">
            <Activity size={16} className="text-[#8B0015]" /> Recent Health Metrics
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 bg-[#F6F3F2] rounded-lg">
              <span className="text-xs text-[#5A413F] font-bold">Hemoglobin Count:</span>
              <span className="text-sm font-extrabold font-mono text-[#15803D]">
                {donorData.healthMetrics?.hemoglobin} g/dL (Normal)
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F6F3F2] rounded-lg">
              <span className="text-xs text-[#5A413F] font-bold">Body Weight:</span>
              <span className="text-sm font-extrabold font-mono text-[#1B1C1C]">
                {donorData.healthMetrics?.weightKg} kg
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F6F3F2] rounded-lg">
              <span className="text-xs text-[#5A413F] font-bold">Blood Pressure:</span>
              <span className="text-sm font-extrabold font-mono text-[#1B1C1C]">
                {donorData.healthMetrics?.bloodPressure} mmHg
              </span>
            </div>
          </div>
        </Card>

        {/* Urgent Local Calls Matching Donor's Blood Group */}
        <Card padding="md" className="md:col-span-8 border-[#8B0015]/30">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2BEBC]/60">
            <h3 className="text-sm font-bold text-[#8B0015] uppercase tracking-wider flex items-center gap-2">
              <Heart size={16} /> Urgent Local Blood Calls ({donorData.bloodGroup})
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/donor/requests')}>
              View All Requests →
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {urgentCalls.slice(0, 2).map((req) => (
              <div
                key={req.id}
                className="p-4 bg-white border border-[#E2BEBC] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <BloodGroupBadge group={req.bloodGroup} size="md" active={true} />
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1C1C]">{req.hospitalName}</h4>
                    <p className="text-xs text-[#5A413F]">
                      Patient: {req.patientName} • Required: {req.unitsRequired} Units {req.component}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <StatusChip status={req.urgency} variant="danger" />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setBookingModalOpen(true)}
                  >
                    Pledge Blood
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Appointment Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Schedule Voluntary Blood Donation"
        subtitle="Book a verified slot at AIIMS Regional Blood Center #4"
        footer={
          <>
            <Button variant="ghost" onClick={() => setBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setBookingSuccess(true);
                setTimeout(() => {
                  setBookingSuccess(false);
                  setBookingModalOpen(false);
                }, 1500);
              }}
            >
              Confirm Appointment Slot
            </Button>
          </>
        }
      >
        {bookingSuccess ? (
          <div className="p-6 text-center text-[#15803D] flex flex-col items-center gap-2">
            <CheckCircle2 size={48} />
            <h4 className="text-lg font-bold">Appointment Confirmed!</h4>
            <p className="text-xs text-[#5A413F]">Confirmation SMS and QR Entry Pass sent to your mobile.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-xs text-[#5A413F]">
            <div>
              <label className="font-bold text-[#1B1C1C] block mb-1">Select Donation Center</label>
              <select className="w-full h-10 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md font-semibold text-[#1B1C1C]">
                <option>Central Regional Blood Center #4 (AIIMS Campus)</option>
                <option>Rotary Blood Bank Unit (Tughlakabad)</option>
                <option>Red Cross Regional Center (Central Sec)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-[#1B1C1C] block mb-1">Select Preferred Date</label>
              <input type="date" defaultValue="2026-09-26" className="w-full h-10 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md font-semibold text-[#1B1C1C]" />
            </div>
            <div>
              <label className="font-bold text-[#1B1C1C] block mb-1">Select Time Slot</label>
              <select className="w-full h-10 px-3 bg-[#F6F3F2] border border-[#E2BEBC] rounded-md font-semibold text-[#1B1C1C]">
                <option>10:00 AM - 11:30 AM (Morning Slot)</option>
                <option>02:00 PM - 03:30 PM (Afternoon Slot)</option>
                <option>05:00 PM - 06:30 PM (Evening Slot)</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
