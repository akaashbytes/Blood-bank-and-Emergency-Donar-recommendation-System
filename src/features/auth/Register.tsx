import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, BloodGroup } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { BLOOD_GROUPS } from '../../config/theme';

export const Register: React.FC = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('DONOR');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState('New Delhi');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      await loginAs(role);
      setLoading(false);
      const routes = {
        DONOR: '/donor/dashboard',
        REQUESTER: '/requester/dashboard',
        COORDINATOR: '/coordinator/dashboard',
        ADMIN: '/admin/dashboard'
      };
      navigate(routes[role] || '/');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8B0015]/10 text-[#8B0015] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Shield size={14} /> Official Registration
        </div>
        <h1 className="text-3xl font-extrabold text-[#1B1C1C]">
          Register for LifeLink Blood Portal
        </h1>
        <p className="text-sm text-[#5A413F] mt-1">
          Join the national blood grid to donate, request, or coordinate blood bank logistics
        </p>
      </div>

      <Card variant="elevated" padding="lg" className="border-[#8B0015]/20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Role Choice */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#5A413F] uppercase tracking-wider">
              Account Registration Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setRole('DONOR')}
                className={`p-3.5 rounded-lg border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  role === 'DONOR'
                    ? 'bg-[#8B0015] text-white border-[#8B0015]'
                    : 'bg-white text-[#1B1C1C] border-[#E2BEBC] hover:border-[#8B0015]'
                }`}
              >
                <Heart size={16} /> Voluntary Blood Donor
              </button>
              <button
                type="button"
                onClick={() => setRole('REQUESTER')}
                className={`p-3.5 rounded-lg border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  role === 'REQUESTER'
                    ? 'bg-[#8B0015] text-white border-[#8B0015]'
                    : 'bg-white text-[#1B1C1C] border-[#E2BEBC] hover:border-[#8B0015]'
                }`}
              >
                <User size={16} /> Hospital Representative
              </button>
              <button
                type="button"
                onClick={() => setRole('COORDINATOR')}
                className={`p-3.5 rounded-lg border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  role === 'COORDINATOR'
                    ? 'bg-[#8B0015] text-white border-[#8B0015]'
                    : 'bg-white text-[#1B1C1C] border-[#E2BEBC] hover:border-[#8B0015]'
                }`}
              >
                <Shield size={16} /> Blood Bank Registration
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Dr. Rajesh Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User size={16} />}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
            />
          </div>

          <div className={`grid grid-cols-1 ${role === 'DONOR' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
            <Input
              label="Mobile Number"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone size={16} />}
              required
            />
            {role === 'DONOR' && (
              <Select
                label="Blood Group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
              />
            )}
            <Input
              label="City / District"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              icon={<MapPin size={16} />}
              required
            />
          </div>

          {(role === 'REQUESTER' || role === 'COORDINATOR') && (
            <Input
              label={role === 'COORDINATOR' ? "Blood Bank / Institution Name" : "Hospital / Institution Name (If applicable)"}
              placeholder={role === 'COORDINATOR' ? "e.g. Central Regional Blood Bank" : "e.g. AIIMS Emergency Unit"}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required={role === 'COORDINATOR'}
            />
          )}

          {/* Screening Checkboxes */}
          <div className="bg-[#F6F3F2] p-4 rounded-lg border border-[#E2BEBC]/60 flex flex-col gap-2 text-xs text-[#5A413F]">
            <span className="font-bold text-[#1B1C1C]">Regulatory Medical Confirmation:</span>
            <label className="flex items-center gap-2">
              <input type="checkbox" required className="accent-[#8B0015] rounded" />
              I confirm that all provided personal and medical contact details are accurate.
            </label>
            {role === 'DONOR' && (
              <label className="flex items-center gap-2">
                <input type="checkbox" required className="accent-[#8B0015] rounded" />
                I am above 18 years old, weigh at least 45kg, and agree to voluntary health screening.
              </label>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            icon={<ArrowRight size={18} />}
            className="w-full"
          >
            Complete Registration & Sign In
          </Button>

          <div className="text-center text-xs text-[#5A413F]">
            Already have an accredited account?{' '}
            <Link to="/login" className="text-[#8B0015] font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
