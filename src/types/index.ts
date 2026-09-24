export type UserRole = 'DONOR' | 'REQUESTER' | 'COORDINATOR' | 'ADMIN';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type ComponentType = 'Whole Blood' | 'PRBC (Red Cells)' | 'Platelets' | 'FFP (Plasma)' | 'Cryoprecipitate';

export type RequestUrgency = 'CRITICAL_EMERGENCY' | 'HIGH' | 'ROUTINE';

export type RequestStatus = 
  | 'PENDING_VERIFICATION' 
  | 'IN_PROGRESS' 
  | 'MATCH_FOUND' 
  | 'DISPATCHED' 
  | 'FULFILLED' 
  | 'REJECTED' 
  | 'CANCELLED';

export type DonorStatus = 'ELIGIBLE' | 'TEMPORARY_DEFERRAL' | 'PERMANENT_DEFERRAL' | 'PENDING_VERIFICATION';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  bloodGroup?: BloodGroup;
  institutionName?: string;
  city?: string;
  avatarUrl?: string;
}

export interface BloodStockItem {
  id: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  unitsAvailable: number;
  reservedUnits: number;
  criticalThreshold: number;
  lastUpdated: string;
  expiryAlertsCount: number;
  storageUnit: string;
}

export interface ExpiryAlert {
  id: string;
  unitId: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  quantityUnits: number;
  expiryDate: string;
  daysRemaining: number;
  status: 'EXPIRED' | 'CRITICAL_24H' | 'WARNING_72H';
  location: string;
}

export interface EmergencyRequest {
  id: string;
  requestCode: string;
  patientName: string;
  hospitalName: string;
  city: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  unitsRequired: number;
  unitsAllocated: number;
  urgency: RequestUrgency;
  status: RequestStatus;
  requesterName: string;
  requesterContact: string;
  createdAt: string;
  requiredBy: string;
  notes?: string;
}

export interface DonorRecord {
  id: string;
  donorCode: string;
  fullName: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: string;
  city: string;
  phone: string;
  email: string;
  lastDonatedDate?: string;
  nextEligibleDate: string;
  totalDonations: number;
  status: DonorStatus;
  verifiedBadge: boolean;
  healthMetrics?: {
    weightKg: number;
    hemoglobin: number;
    bloodPressure: string;
  };
}

export interface DonationHistoryItem {
  id: string;
  donationCode: string;
  date: string;
  bloodBankName: string;
  location: string;
  componentDonated: ComponentType;
  units: number;
  status: 'COMPLETED' | 'TESTING' | 'REJECTED';
  certificateUrl?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface InstitutionalSettings {
  bloodBankName: string;
  licenseNumber: string;
  nodalOfficer: string;
  contactEmail: string;
  contactPhone: string;
  emergencyHotline: string;
  address: string;
  autoDispatchThreshold: number;
  smsAlertsEnabled: boolean;
  donorAutoReminders: boolean;
}

export interface AnalyticsSummary {
  totalUnitsInStock: number;
  criticalRequests24h: number;
  activeDonors: number;
  fulfilledRequestsMonth: number;
  stockDistribution: Record<BloodGroup, number>;
  demandTrend: Array<{ date: string; requests: number; donations: number }>;
}
