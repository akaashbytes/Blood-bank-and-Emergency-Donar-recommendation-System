import axios from 'axios';
import { 
  BloodStockItem, 
  EmergencyRequest, 
  DonorRecord, 
  ExpiryAlert, 
  AuditLogItem, 
  InstitutionalSettings,
  DonationHistoryItem,
  User,
  UserRole
} from '../types';
import { 
  MOCK_USERS, 
  MOCK_BLOOD_STOCK, 
  MOCK_EMERGENCY_REQUESTS, 
  MOCK_DONORS, 
  MOCK_EXPIRY_ALERTS, 
  MOCK_DONATION_HISTORY, 
  MOCK_AUDIT_LOGS, 
  MOCK_SETTINGS 
} from './mockData';

// Axios Instance with base configuration for future backend integration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor for attaching auth tokens when backend is attached
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('lifelink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service implementations (currently using mock data store)
let stockStore = [...MOCK_BLOOD_STOCK];
let requestStore = [...MOCK_EMERGENCY_REQUESTS];
let donorStore = [...MOCK_DONORS];
let alertStore = [...MOCK_EXPIRY_ALERTS];
let historyStore = [...MOCK_DONATION_HISTORY];
let auditStore = [...MOCK_AUDIT_LOGS];
let settingsStore = { ...MOCK_SETTINGS };

export const authService = {
  async login(role: UserRole): Promise<User> {
    const roleKeyMap: Record<UserRole, string> = {
      DONOR: 'donor',
      REQUESTER: 'requester',
      COORDINATOR: 'coordinator',
      ADMIN: 'admin'
    };
    return MOCK_USERS[roleKeyMap[role]];
  },
  
  async getCurrentUser(): Promise<User | null> {
    const saved = localStorage.getItem('lifelink_user');
    return saved ? JSON.parse(saved) : MOCK_USERS.donor;
  }
};

export const bloodStockService = {
  async getStock(): Promise<BloodStockItem[]> {
    return [...stockStore];
  },
  async updateStockUnits(id: string, newUnits: number): Promise<BloodStockItem> {
    stockStore = stockStore.map(item => item.id === id ? { ...item, unitsAvailable: newUnits, lastUpdated: 'Just now' } : item);
    const updated = stockStore.find(item => item.id === id);
    if (!updated) throw new Error('Stock item not found');
    return updated;
  }
};

export const emergencyRequestService = {
  async getRequests(): Promise<EmergencyRequest[]> {
    return [...requestStore];
  },
  async createRequest(payload: Omit<EmergencyRequest, 'id' | 'requestCode' | 'createdAt' | 'status' | 'unitsAllocated'>): Promise<EmergencyRequest> {
    const newReq: EmergencyRequest = {
      ...payload,
      id: `req-${Date.now()}`,
      requestCode: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PENDING_VERIFICATION',
      unitsAllocated: 0
    };
    requestStore = [newReq, ...requestStore];
    return newReq;
  },
  async updateRequestStatus(id: string, status: EmergencyRequest['status'], unitsAllocated?: number): Promise<EmergencyRequest> {
    requestStore = requestStore.map(req => req.id === id ? { 
      ...req, 
      status, 
      unitsAllocated: unitsAllocated !== undefined ? unitsAllocated : req.unitsAllocated 
    } : req);
    const updated = requestStore.find(req => req.id === id);
    if (!updated) throw new Error('Request not found');
    return updated;
  }
};

export const donorService = {
  async getDonors(): Promise<DonorRecord[]> {
    return [...donorStore];
  },
  async getDonationHistory(): Promise<DonationHistoryItem[]> {
    return [...historyStore];
  },
  async verifyDonor(id: string, status: DonorRecord['status']): Promise<DonorRecord> {
    donorStore = donorStore.map(d => d.id === id ? { ...d, status, verifiedBadge: status === 'ELIGIBLE' } : d);
    const updated = donorStore.find(d => d.id === id);
    if (!updated) throw new Error('Donor not found');
    return updated;
  }
};

export const expiryService = {
  async getExpiryAlerts(): Promise<ExpiryAlert[]> {
    return [...alertStore];
  }
};

export const adminService = {
  async getAuditLogs(): Promise<AuditLogItem[]> {
    return [...auditStore];
  },
  async getSettings(): Promise<InstitutionalSettings> {
    return { ...settingsStore };
  },
  async updateSettings(newSettings: InstitutionalSettings): Promise<InstitutionalSettings> {
    settingsStore = { ...newSettings };
    return settingsStore;
  }
};
