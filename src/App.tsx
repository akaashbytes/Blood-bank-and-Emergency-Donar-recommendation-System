import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppShell } from './components/shell/AppShell';
import { ProtectedRoute } from './components/shell/ProtectedRoute';

// Public & Auth
import { LandingPage } from './features/public/LandingPage';
import { FindBlood } from './features/public/FindBlood';
import { RequestTracking } from './features/public/RequestTracking';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';

// Donor
import { DonorDashboard } from './features/donor/DonorDashboard';
import { DonorProfile } from './features/donor/DonorProfile';
import { DonorRequests } from './features/donor/DonorRequests';
import { DonationHistory } from './features/donor/DonationHistory';

// Requester
import { RequesterDashboard } from './features/requester/RequesterDashboard';
import { RequesterHistory } from './features/requester/RequesterHistory';

// Coordinator
import { CoordinatorDashboard } from './features/coordinator/CoordinatorDashboard';
import { EmergencyManagement } from './features/coordinator/EmergencyManagement';
import { InventoryManagement } from './features/coordinator/InventoryManagement';
import { ExpiryAlerts } from './features/coordinator/ExpiryAlerts';
import { DonorManagement } from './features/coordinator/DonorManagement';
import { AnalyticsDemand } from './features/coordinator/AnalyticsDemand';

// Admin
import { AdminDashboard } from './features/admin/AdminDashboard';
import { SystemOversight } from './features/admin/SystemOversight';
import { UserManagement } from './features/admin/UserManagement';
import { AuditLogs } from './features/admin/AuditLogs';
import { SettingsPage } from './features/admin/InstitutionalSettings';
import { Notifications } from './features/admin/Notifications';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            {/* Public Routes */}
            <Route index element={<LandingPage />} />
            <Route path="public/find-blood" element={<FindBlood />} />
            <Route path="public/track-request" element={<RequestTracking />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Donor Routes */}
            <Route
              path="donor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['DONOR']}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="donor/profile"
              element={
                <ProtectedRoute allowedRoles={['DONOR']}>
                  <DonorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="donor/requests"
              element={
                <ProtectedRoute allowedRoles={['DONOR']}>
                  <DonorRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="donor/history"
              element={
                <ProtectedRoute allowedRoles={['DONOR']}>
                  <DonationHistory />
                </ProtectedRoute>
              }
            />

            {/* Requester Routes */}
            <Route
              path="requester/dashboard"
              element={
                <ProtectedRoute allowedRoles={['REQUESTER']}>
                  <RequesterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="requester/history"
              element={
                <ProtectedRoute allowedRoles={['REQUESTER']}>
                  <RequesterHistory />
                </ProtectedRoute>
              }
            />

            {/* Coordinator Routes */}
            <Route
              path="coordinator/dashboard"
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR']}>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="coordinator/emergency"
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR']}>
                  <EmergencyManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="coordinator/inventory"
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR']}>
                  <InventoryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="coordinator/expiry-alerts"
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR']}>
                  <ExpiryAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="coordinator/donors"
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR']}>
                  <DonorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="coordinator/analytics"
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR']}>
                  <AnalyticsDemand />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/oversight"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <SystemOversight />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/settings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/notifications"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
