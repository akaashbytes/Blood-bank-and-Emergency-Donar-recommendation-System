import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/apiServices';
import { InstitutionalSettings } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<InstitutionalSettings | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminService.getSettings().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    await adminService.updateSettings(settings);
    setLoading(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  if (!settings) return null;

  return (
    <div className="max-w-4xl mx-auto py-2 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">Institutional & Regional Settings</h1>
          <p className="text-xs text-[#5A413F]">Configure blood bank license info, safety thresholds, and SMS gateways</p>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] rounded-xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 size={18} /> Settings successfully updated and synchronized across regional nodes.
        </div>
      )}

      <Card padding="lg" className="border-[#E2BEBC]">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nodal Blood Bank Name"
              value={settings.bloodBankName}
              onChange={(e) => setSettings({ ...settings, bloodBankName: e.target.value })}
              required
            />
            <Input
              label="NBTC License Registration Number"
              value={settings.licenseNumber}
              onChange={(e) => setSettings({ ...settings, licenseNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Nodal Officer Name"
              value={settings.nodalOfficer}
              onChange={(e) => setSettings({ ...settings, nodalOfficer: e.target.value })}
              required
            />
            <Input
              label="Contact Email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              required
            />
            <Input
              label="Emergency Hotline Phone"
              value={settings.emergencyHotline}
              onChange={(e) => setSettings({ ...settings, emergencyHotline: e.target.value })}
              required
            />
          </div>

          <Input
            label="Nodal Office Address"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            required
          />

          <div className="p-4 bg-[#F6F3F2] rounded-xl border border-[#E2BEBC]/60 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-[#1B1C1C] uppercase tracking-wider">
              Safety & Automated Thresholds
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#5A413F] block mb-1">
                  Auto-Dispatch Safety Threshold (%)
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={settings.autoDispatchThreshold}
                  onChange={(e) => setSettings({ ...settings, autoDispatchThreshold: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-white border border-[#D1D5DB] rounded-md font-mono text-sm font-bold"
                />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <label className="flex items-center gap-2 text-xs text-[#1B1C1C] font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.smsAlertsEnabled}
                    onChange={(e) => setSettings({ ...settings, smsAlertsEnabled: e.target.checked })}
                    className="accent-[#8B0015] rounded"
                  />
                  Enable SMS Gateway for Urgent Emergency Dispatches
                </label>
                <label className="flex items-center gap-2 text-xs text-[#1B1C1C] font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.donorAutoReminders}
                    onChange={(e) => setSettings({ ...settings, donorAutoReminders: e.target.checked })}
                    className="accent-[#8B0015] rounded"
                  />
                  Auto-remind Voluntary Donors upon 90-day eligibility
                </label>
              </div>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={loading} icon={<Save size={18} />}>
            Save Institutional Configurations
          </Button>
        </form>
      </Card>
    </div>
  );
};
