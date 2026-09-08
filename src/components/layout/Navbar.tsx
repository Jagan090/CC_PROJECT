import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Shield,
  GraduationCap,
  Users,
  Sparkles,
  LogOut,
  ChevronDown,
  BookOpen,
  Target,
  FileCheck,
  Award,
  BookMarked
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface NavbarProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  onToggleSidebar?: () => void;
  onOpenNotifications: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'dashboard',
  onNavigateTab,
  setActiveTab,
  onOpenNotifications,
  onOpenAuthModal
}) => {
  const { currentUser, currentRole, switchRole, unreadCount } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const navigate = (tab: string) => {
    if (onNavigateTab) onNavigateTab(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  const navLinks = [
    { id: 'dashboard', label: 'Home' },
    { id: 'courses', label: 'Courses' },
    { id: 'competencies', label: 'Skills' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'certificates', label: 'Certifications' },
    { id: 'knowledge', label: 'Knowledge' }
  ];

  const roleConfig: Record<UserRole, { label: string; icon: any; color: string }> = {
    employee: {
      label: 'Learner',
      icon: GraduationCap,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
    },
    trainer: {
      label: 'Instructor',
      icon: BookOpen,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40'
    },
    manager: {
      label: 'Manager',
      icon: Users,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/40'
    },
    admin: {
      label: 'Admin',
      icon: Shield,
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/40'
    }
  };

  const currentRoleInfo = roleConfig[currentRole];
  const RoleIcon = currentRoleInfo.icon;

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    navigate('dashboard');
  };

  return (
    <header className="sticky top-0 z-40 frosted-glass-nav px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#c2f866] text-black flex items-center justify-center font-black text-base shadow-[0_0_15px_rgba(194,248,102,0.4)] group-hover:scale-105 transition-transform">
              <span className="font-display">C</span>
            </div>
            <div className="flex items-baseline">
              <span className="font-display font-extrabold tracking-tight text-white text-xl uppercase">
                LEARN<span className="text-[#c2f866]">ME</span>
              </span>
              <span className="hidden lg:inline-block ml-2 text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                CAPACITY CONNECT
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links matching Screenshot 1 */}
        <nav className="hidden md:flex items-center gap-1 frosted-glass-pill px-3 py-1.5 rounded-full">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`navbar-link-${item.id}`}
                onClick={() => navigate(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-md shadow-white/10'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Role Selector & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              id="role-switcher-dropdown-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-xl shadow-sm transition-all cursor-pointer ${currentRoleInfo.color}`}
              title="Switch role view"
            >
              <RoleIcon className="w-3.5 h-3.5" />
              <span className="font-bold uppercase tracking-wider">{currentRoleInfo.label}</span>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </button>

            <AnimatePresence>
              {roleDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-2 w-56 frosted-glass-modal rounded-2xl shadow-2xl py-2 z-50 origin-top-right overflow-hidden"
                  id="role-switcher-menu"
                >
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/10">
                    Select Perspective
                  </div>
                  {(['employee', 'trainer', 'manager', 'admin'] as UserRole[]).map((role) => {
                    const info = roleConfig[role];
                    const Icon = info.icon;
                    const isSelected = currentRole === role;
                    return (
                      <button
                        key={role}
                        id={`switch-role-${role}-btn`}
                        onClick={() => handleRoleSelect(role)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#c2f866]/15 text-[#c2f866] font-bold border-l-2 border-[#c2f866]'
                            : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#c2f866]' : 'text-zinc-400'}`} />
                          <span>{info.label} View</span>
                        </div>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c2f866] shadow-[0_0_6px_#c2f866]"></span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Button */}
          <button
            id="navbar-notifications-btn"
            onClick={onOpenNotifications}
            className="relative p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-black bg-[#c2f866] rounded-full ring-2 ring-[#0c0d10] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Pill / "Join Now" button style from screenshot */}
          <button
            id="switch-account-modal-btn"
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 frosted-glass-pill hover:border-white/30 rounded-full pl-2 pr-4 py-1.5 text-xs font-semibold text-white transition shadow-sm group cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-white/30"
            />
            <span className="max-w-[140px] truncate hidden sm:inline-block">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-zinc-400 group-hover:text-white transition font-mono">
              Profile
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
