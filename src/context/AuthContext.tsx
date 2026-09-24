import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/apiServices';
import { MOCK_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('lifelink_role') as UserRole) || 'COORDINATOR';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const roleKey = currentRole.toLowerCase() as keyof typeof MOCK_USERS;
    return MOCK_USERS[roleKey] || MOCK_USERS.coordinator;
  });

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('lifelink_role', role);
    const roleKey = role.toLowerCase() as keyof typeof MOCK_USERS;
    const newUser = MOCK_USERS[roleKey] || MOCK_USERS.donor;
    setCurrentUser(newUser);
    localStorage.setItem('lifelink_user', JSON.stringify(newUser));
  };

  const loginAs = async (role: UserRole) => {
    const user = await authService.login(role);
    setCurrentUser(user);
    setCurrentRole(role);
    localStorage.setItem('lifelink_role', role);
    localStorage.setItem('lifelink_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lifelink_user');
  };

  useEffect(() => {
    localStorage.setItem('lifelink_role', currentRole);
  }, [currentRole]);

  return (
    <AuthContext.Provider value={{ currentUser, currentRole, setRole, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
