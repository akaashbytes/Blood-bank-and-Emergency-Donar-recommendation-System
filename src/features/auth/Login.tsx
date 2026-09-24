import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Key, Mail, Lock, UserCheck, ArrowRight, Droplet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const Login: React.FC = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('COORDINATOR');
  const [email, setEmail] = useState('sunita.v@bloodbank.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      await loginAs(selectedRole);
      setLoading(false);
      const roleRoutes: Record<UserRole, string> = {
        DONOR: '/donor/dashboard',
        REQUESTER: '/requester/dashboard',
        COORDINATOR: '/coordinator/dashboard',
        ADMIN: '/admin/dashboard',
      };
      navigate(roleRoutes[selectedRole]);
    }, 600);
  };

  const roleOptions: Array<{ role: UserRole; title: string; desc: string }> = [
    { role: 'DONOR', title: 'Voluntary Donor', desc: 'Book appointments, view history & certificates' },
    { role: 'REQUESTER', title: 'Hospital / Patient', desc: 'Submit & track emergency blood unit requests' },
    { role: 'COORDINATOR', title: 'Blood Bank Officer', desc: 'Vault management, verification & dispatch' },
    { role: 'ADMIN', title: 'System Administrator', desc: 'National grid oversight & regulatory audit' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8B0015]/10 text-[#8B0015] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Shield size={14} /> Official Transfusion Portal
        </div>
        <h1 className="text-3xl font-extrabold text-[#1B1C1C] tracking-tight">
          Institutional Login Gateway
        </h1>
        <p className="text-sm text-[#5A413F] mt-1">
          Select your registered role to access accredited regional blood bank console
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Role Selector */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <label className="text-xs font-bold text-[#5A413F] uppercase tracking-wider">
            1. Select Operational Role
          </label>
          {roleOptions.map((opt) => (
            <div
              key={opt.role}
              onClick={() => {
                setSelectedRole(opt.role);
                const emails: Record<UserRole, string> = {
                  DONOR: 'ananya.donor@lifelink.org',
                  REQUESTER: 'rajesh.k@cityhospital.org',
                  COORDINATOR: 'sunita.v@bloodbank.gov.in',
                  ADMIN: 'admin.head@lifelink.gov.in',
                };
                setEmail(emails[opt.role]);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRole === opt.role
                  ? 'bg-[#8B0015] text-white border-[#8B0015] shadow-md ring-2 ring-[#8B0015]/20'
                  : 'bg-white border-[#E2BEBC] hover:border-[#8B0015] text-[#1B1C1C]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">{opt.title}</h4>
                <UserCheck size={16} className={selectedRole === opt.role ? 'text-white' : 'text-[#8B0015]'} />
              </div>
              <p className={`text-xs mt-1 ${selectedRole === opt.role ? 'text-white/80' : 'text-[#5A413F]'}`}>
                {opt.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: Credentials Form */}
        <Card variant="elevated" padding="lg" className="md:col-span-7 border-[#8B0015]/20">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2BEBC]/60">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-[#8B0015] fill-[#8B0015]" />
                <span className="font-bold text-sm text-[#1B1C1C]">
                  Sign In as {selectedRole}
                </span>
              </div>
              <span className="text-xs text-[#15803D] font-bold bg-[#DCFCE7] px-2 py-0.5 rounded">
                SSL Secured
              </span>
            </div>

            <Input
              label="Institutional Email / ID"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
            />

            <Input
              label="Access Password / Token"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={16} />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#5A413F]">
                <input type="checkbox" defaultChecked className="accent-[#8B0015] rounded" /> Remember session
              </label>
              <a href="#" className="text-[#8B0015] font-semibold hover:underline">
                Forgot Security Key?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              icon={<ArrowRight size={18} />}
              className="w-full mt-2"
            >
              Authenticate & Enter Console
            </Button>

            <div className="text-center text-xs text-[#5A413F] pt-3 border-t border-[#E2BEBC]/60 flex items-center justify-between">
              <span>New to LifeLink Blood?</span>
              <Link to="/register" className="text-[#8B0015] font-bold hover:underline">
                Create Account / Register Facility →
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
