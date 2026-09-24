import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { currentRole, currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentRole)) {
    // Redirect user to their role-specific dashboard if role mismatch
    const roleRoutes: Record<UserRole, string> = {
      DONOR: '/donor/dashboard',
      REQUESTER: '/requester/dashboard',
      COORDINATOR: '/coordinator/dashboard',
      ADMIN: '/admin/dashboard',
    };
    return <Navigate to={roleRoutes[currentRole]} replace />;
  }

  return <>{children}</>;
};
