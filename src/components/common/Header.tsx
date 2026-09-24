import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HeartHandshake, 
  Search, 
  Activity, 
  ShieldAlert, 
  FileText, 
  Users, 
  Clock, 
  Sliders, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Droplet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { currentUser, currentRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavLinks = () => {
    switch (currentRole) {
      case 'DONOR':
        return [
          { label: 'Donor Dashboard', path: '/donor/dashboard', icon: Activity },
          { label: 'Find Blood', path: '/public/find-blood', icon: Search },
          { label: 'Blood Requests', path: '/donor/requests', icon: Droplet },
          { label: 'Donation History', path: '/donor/history', icon: Clock },
          { label: 'My Profile', path: '/donor/profile', icon: Users },
        ];
      case 'REQUESTER':
        return [
          { label: 'Requester Dashboard', path: '/requester/dashboard', icon: Activity },
          { label: 'Find Blood', path: '/public/find-blood', icon: Search },
          { label: 'Request Tracking', path: '/public/track-request', icon: Clock },
          { label: 'Request History', path: '/requester/history', icon: FileText },
        ];
      case 'COORDINATOR':
        return [
          { label: 'Coordinator Dashboard', path: '/coordinator/dashboard', icon: Activity },
          { label: 'Emergency Requests', path: '/coordinator/emergency', icon: ShieldAlert },
          { label: 'Inventory Vault', path: '/coordinator/inventory', icon: Droplet },
          { label: 'Expiry Alerts', path: '/coordinator/expiry-alerts', icon: Bell },
          { label: 'Donor Verification', path: '/coordinator/donors', icon: Users },
          { label: 'Analytics', path: '/coordinator/analytics', icon: FileText },
        ];
      case 'ADMIN':
        return [
          { label: 'Admin Dashboard', path: '/admin/dashboard', icon: Activity },
          { label: 'System Oversight', path: '/admin/oversight', icon: ShieldAlert },
          { label: 'User & Roles', path: '/admin/users', icon: Users },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
          { label: 'Settings', path: '/admin/settings', icon: Sliders },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-[#8B0015] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-white text-[#8B0015] flex items-center justify-center font-extrabold shadow-sm group-hover:bg-[#FFDAD7] transition-all">
            <Droplet className="w-6 h-6 fill-[#8B0015] text-[#8B0015]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight leading-none text-white font-mono">
              LifeLink<span className="text-[#FFDAD7]">.Blood</span>
            </span>
            <span className="text-[10px] text-[#FFDAD7] font-medium tracking-wide uppercase mt-0.5">
              Institutional Blood Grid
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-[#8B0015] shadow-xs'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & User Dropdown */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="urgent"
            size="sm"
            onClick={() => navigate('/public/find-blood')}
            icon={<HeartHandshake size={14} />}
          >
            Emergency Blood Call
          </Button>

          {currentUser && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/20">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-white/30 object-cover"
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[#FFDAD7] font-medium">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-white hover:bg-white/10 rounded-md"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#65000F] border-t border-white/10 px-4 py-3 flex flex-col gap-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold ${
                  isActive ? 'bg-white text-[#8B0015]' : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#FFDAD7]">Role: {currentRole}</span>
            <Button
              variant="urgent"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/public/find-blood');
              }}
            >
              Emergency Call
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
