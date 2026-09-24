import { 
  BloodStockItem, 
  EmergencyRequest, 
  DonorRecord, 
  ExpiryAlert, 
  AuditLogItem, 
  InstitutionalSettings,
  DonationHistoryItem,
  User
} from '../types';

export const MOCK_USERS: Record<string, User> = {
  donor: {
    id: 'usr-donor-1',
    name: 'Ananya Sharma',
    email: 'ananya.donor@lifelink.org',
    role: 'DONOR',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    city: 'New Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  requester: {
    id: 'usr-req-1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.k@cityhospital.org',
    role: 'REQUESTER',
    phone: '+91 98112 34567',
    institutionName: 'City Care Hospital',
    city: 'New Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  coordinator: {
    id: 'usr-coord-1',
    name: 'Sunita Verma',
    email: 'sunita.v@bloodbank.gov.in',
    role: 'COORDINATOR',
    phone: '+91 99001 12233',
    institutionName: 'Central Regional Blood Center #4',
    city: 'New Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  admin: {
    id: 'usr-admin-1',
    name: 'Director Vikramaditya Singh',
    email: 'admin.head@lifelink.gov.in',
    role: 'ADMIN',
    phone: '+91 98000 00001',
    institutionName: 'National Blood Transfusion Council',
    city: 'New Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  }
};

export const MOCK_BLOOD_STOCK: BloodStockItem[] = [
  { id: 'stk-1', bloodGroup: 'O+', component: 'Whole Blood', unitsAvailable: 48, reservedUnits: 12, criticalThreshold: 15, lastUpdated: '10 mins ago', expiryAlertsCount: 2, storageUnit: 'Vault A-1' },
  { id: 'stk-2', bloodGroup: 'O-', component: 'PRBC (Red Cells)', unitsAvailable: 6, reservedUnits: 4, criticalThreshold: 10, lastUpdated: '5 mins ago', expiryAlertsCount: 3, storageUnit: 'Vault A-2 (Cryo)' },
  { id: 'stk-3', bloodGroup: 'A+', component: 'Whole Blood', unitsAvailable: 62, reservedUnits: 8, criticalThreshold: 20, lastUpdated: '15 mins ago', expiryAlertsCount: 0, storageUnit: 'Vault B-1' },
  { id: 'stk-4', bloodGroup: 'A-', component: 'PRBC (Red Cells)', unitsAvailable: 11, reservedUnits: 3, criticalThreshold: 8, lastUpdated: '30 mins ago', expiryAlertsCount: 1, storageUnit: 'Vault B-2' },
  { id: 'stk-5', bloodGroup: 'B+', component: 'Platelets', unitsAvailable: 34, reservedUnits: 10, criticalThreshold: 15, lastUpdated: '12 mins ago', expiryAlertsCount: 4, storageUnit: 'Agitator Unit 3' },
  { id: 'stk-6', bloodGroup: 'B-', component: 'Whole Blood', unitsAvailable: 8, reservedUnits: 2, criticalThreshold: 10, lastUpdated: '45 mins ago', expiryAlertsCount: 1, storageUnit: 'Vault C-1' },
  { id: 'stk-7', bloodGroup: 'AB+', component: 'FFP (Plasma)', unitsAvailable: 29, reservedUnits: 5, criticalThreshold: 12, lastUpdated: '1 hour ago', expiryAlertsCount: 0, storageUnit: 'Freezer D-1' },
  { id: 'stk-8', bloodGroup: 'AB-', component: 'PRBC (Red Cells)', unitsAvailable: 4, reservedUnits: 2, criticalThreshold: 5, lastUpdated: '2 hours ago', expiryAlertsCount: 2, storageUnit: 'Vault D-2' },
];

export const MOCK_EMERGENCY_REQUESTS: EmergencyRequest[] = [
  {
    id: 'req-101',
    requestCode: 'REQ-2026-8812',
    patientName: 'Rohit Malhotra',
    hospitalName: 'AIIMS Emergency Trauma Center',
    city: 'New Delhi',
    bloodGroup: 'O-',
    component: 'PRBC (Red Cells)',
    unitsRequired: 4,
    unitsAllocated: 2,
    urgency: 'CRITICAL_EMERGENCY',
    status: 'IN_PROGRESS',
    requesterName: 'Dr. A. K. Gupta',
    requesterContact: '+91 98111 22334',
    createdAt: '2026-09-24 15:30',
    requiredBy: 'Immediate (< 1 Hour)',
    notes: 'Major polytrauma road accident case. Patient undergoing surgery in OT 4.'
  },
  {
    id: 'req-102',
    requestCode: 'REQ-2026-8815',
    patientName: 'Meera Deshmukh',
    hospitalName: 'Max Super Speciality Hospital',
    city: 'New Delhi',
    bloodGroup: 'B+',
    component: 'Platelets',
    unitsRequired: 6,
    unitsAllocated: 6,
    urgency: 'HIGH',
    status: 'DISPATCHED',
    requesterName: 'Dr. S. Mukherjee',
    requesterContact: '+91 98222 33445',
    createdAt: '2026-09-24 14:15',
    requiredBy: 'Today before 18:00',
    notes: 'Dengue hemorrhagic fever with platelet count dropping below 15,000.'
  },
  {
    id: 'req-103',
    requestCode: 'REQ-2026-8809',
    patientName: 'Karan Patel',
    hospitalName: 'Safdarjung Hospital Wing B',
    city: 'New Delhi',
    bloodGroup: 'AB-',
    component: 'PRBC (Red Cells)',
    unitsRequired: 2,
    unitsAllocated: 0,
    urgency: 'CRITICAL_EMERGENCY',
    status: 'PENDING_VERIFICATION',
    requesterName: 'Nurse Incharge Sunita',
    requesterContact: '+91 98333 44556',
    createdAt: '2026-09-24 16:10',
    requiredBy: 'Within 2 Hours',
    notes: 'Severe anemia complication during elective cardiac bypass setup.'
  },
  {
    id: 'req-104',
    requestCode: 'REQ-2026-8790',
    patientName: 'Pooja Verma',
    hospitalName: 'Fortis Escorts Heart Institute',
    city: 'New Delhi',
    bloodGroup: 'A+',
    component: 'Whole Blood',
    unitsRequired: 3,
    unitsAllocated: 3,
    urgency: 'ROUTINE',
    status: 'FULFILLED',
    requesterName: 'Dr. R. N. Bansal',
    requesterContact: '+91 98444 55667',
    createdAt: '2026-09-24 10:00',
    requiredBy: 'Completed',
    notes: 'Post-operative transfusion completed smoothly.'
  }
];

export const MOCK_DONORS: DonorRecord[] = [
  {
    id: 'dnr-1',
    donorCode: 'LIFELINK-D-9901',
    fullName: 'Ananya Sharma',
    bloodGroup: 'O+',
    age: 28,
    gender: 'Female',
    city: 'New Delhi',
    phone: '+91 98765 43210',
    email: 'ananya.donor@lifelink.org',
    lastDonatedDate: '2026-05-10',
    nextEligibleDate: '2026-08-10',
    totalDonations: 7,
    status: 'ELIGIBLE',
    verifiedBadge: true,
    healthMetrics: { weightKg: 62, hemoglobin: 13.8, bloodPressure: '120/80' }
  },
  {
    id: 'dnr-2',
    donorCode: 'LIFELINK-D-9902',
    fullName: 'Vikram Joshi',
    bloodGroup: 'O-',
    age: 34,
    gender: 'Male',
    city: 'New Delhi',
    phone: '+91 98765 11111',
    email: 'vikram.j@gmail.com',
    lastDonatedDate: '2026-08-20',
    nextEligibleDate: '2026-11-20',
    totalDonations: 14,
    status: 'ELIGIBLE',
    verifiedBadge: true,
    healthMetrics: { weightKg: 78, hemoglobin: 15.2, bloodPressure: '122/82' }
  },
  {
    id: 'dnr-3',
    donorCode: 'LIFELINK-D-9903',
    fullName: 'Neha Kapoor',
    bloodGroup: 'AB-',
    age: 25,
    gender: 'Female',
    city: 'New Delhi',
    phone: '+91 98765 22222',
    email: 'neha.k@outlook.com',
    lastDonatedDate: '2026-09-01',
    nextEligibleDate: '2026-12-01',
    totalDonations: 3,
    status: 'TEMPORARY_DEFERRAL',
    verifiedBadge: false,
    healthMetrics: { weightKg: 54, hemoglobin: 11.9, bloodPressure: '110/75' }
  },
  {
    id: 'dnr-4',
    donorCode: 'LIFELINK-D-9904',
    fullName: 'Amitabh Roy',
    bloodGroup: 'A+',
    age: 41,
    gender: 'Male',
    city: 'New Delhi',
    phone: '+91 98765 33333',
    email: 'aroy@techcorp.com',
    lastDonatedDate: '2026-03-15',
    nextEligibleDate: '2026-06-15',
    totalDonations: 21,
    status: 'ELIGIBLE',
    verifiedBadge: true,
    healthMetrics: { weightKg: 82, hemoglobin: 14.6, bloodPressure: '125/84' }
  }
];

export const MOCK_EXPIRY_ALERTS: ExpiryAlert[] = [
  { id: 'exp-1', unitId: 'U-O-NEG-901', bloodGroup: 'O-', component: 'PRBC (Red Cells)', quantityUnits: 2, expiryDate: '2026-09-25 08:00', daysRemaining: 1, status: 'CRITICAL_24H', location: 'Vault A-2 (Rack 4)' },
  { id: 'exp-2', unitId: 'U-B-POS-442', bloodGroup: 'B+', component: 'Platelets', quantityUnits: 3, expiryDate: '2026-09-26 14:00', daysRemaining: 2, status: 'WARNING_72H', location: 'Agitator Unit 3' },
  { id: 'exp-3', unitId: 'U-AB-NEG-110', bloodGroup: 'AB-', component: 'PRBC (Red Cells)', quantityUnits: 1, expiryDate: '2026-09-25 18:30', daysRemaining: 1, status: 'CRITICAL_24H', location: 'Vault D-2 (Rack 1)' },
  { id: 'exp-4', unitId: 'U-A-NEG-882', bloodGroup: 'A-', component: 'PRBC (Red Cells)', quantityUnits: 1, expiryDate: '2026-09-27 12:00', daysRemaining: 3, status: 'WARNING_72H', location: 'Vault B-2 (Rack 3)' }
];

export const MOCK_DONATION_HISTORY: DonationHistoryItem[] = [
  { id: 'dh-1', donationCode: 'DON-2026-0510', date: '10 May 2026', bloodBankName: 'AIIMS Blood Bank Center', location: 'Ansari Nagar, New Delhi', componentDonated: 'Whole Blood', units: 1, status: 'COMPLETED', certificateUrl: '#' },
  { id: 'dh-2', donationCode: 'DON-2026-0115', date: '15 Jan 2026', bloodBankName: 'Rotary Blood Bank Unit', location: 'Tughlakabad Institutional Area', componentDonated: 'Whole Blood', units: 1, status: 'COMPLETED', certificateUrl: '#' },
  { id: 'dh-3', donationCode: 'DON-2025-0920', date: '20 Sep 2025', bloodBankName: 'Red Cross Society Regional Hub', location: 'Central Secretariat', componentDonated: 'Platelets', units: 1, status: 'COMPLETED', certificateUrl: '#' },
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  { id: 'log-1', timestamp: '2026-09-24 16:42:10', user: 'Sunita Verma (Coordinator)', role: 'COORDINATOR', action: 'DISPATCH_UNITS', module: 'Emergency Management', ipAddress: '10.14.20.108', details: 'Allocated 2 units O- PRBC to REQ-2026-8812', status: 'SUCCESS' },
  { id: 'log-2', timestamp: '2026-09-24 16:15:04', user: 'Dr. Rajesh Kumar (Requester)', role: 'REQUESTER', action: 'CREATE_REQUEST', module: 'Request Gateway', ipAddress: '10.14.88.42', details: 'Submitted emergency request REQ-2026-8815 for 6 units Platelets', status: 'SUCCESS' },
  { id: 'log-3', timestamp: '2026-09-24 15:50:22', user: 'System Automated Monitor', role: 'ADMIN', action: 'EXPIRY_ALERT_GEN', module: 'Inventory Vault', ipAddress: 'localhost', details: 'Triggered Critical 24H alert for 2 units O- PRBC (U-O-NEG-901)', status: 'WARNING' },
  { id: 'log-4', timestamp: '2026-09-24 14:02:19', user: 'Director Vikramaditya Singh', role: 'ADMIN', action: 'UPDATE_SETTINGS', module: 'Institutional Settings', ipAddress: '10.14.1.1', details: 'Updated auto-dispatch threshold to 15% minimum safety margin', status: 'SUCCESS' },
];

export const MOCK_SETTINGS: InstitutionalSettings = {
  bloodBankName: 'Central Regional Blood Center #4 (National Grid)',
  licenseNumber: 'NBTC-DL-2024-99881',
  nodalOfficer: 'Dr. Sunita Verma',
  contactEmail: 'nodal.delhi@lifelink.gov.in',
  contactPhone: '+91 11 2345 6789',
  emergencyHotline: '108-BLOOD-LINE',
  address: 'Sector 4, Institutional Area, Sri Aurobindo Marg, New Delhi 110016',
  autoDispatchThreshold: 15,
  smsAlertsEnabled: true,
  donorAutoReminders: true,
};
