import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  FileCheck,
  Award,
  BookMarked,
  PlusCircle,
  ShieldCheck,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenCreateCourse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  setActiveTab,
  isOpen = false,
  onClose,
  onOpenCreateCourse
}) => {
  const { currentRole, currentUser } = useAuth();

  const handleSelect = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    if (setActiveTab) setActiveTab(tab);
    if (onClose) onClose();
  };

  const navItems = [
    {
      id: 'dashboard',
      label: currentRole === 'employee' 
        ? 'Dashboard' 
        : currentRole === 'trainer' 
        ? 'Trainer Studio' 
        : currentRole === 'manager' 
        ? 'Manager Hub' 
        : 'Admin Center',
      icon: LayoutDashboard,
    },
    {
      id: 'courses',
      label: 'Course Catalog',
      icon: BookOpen
    },
    {
      id: 'competencies',
      label: 'Skill Gap & Matrix',
      icon: Target
    },
    {
      id: 'assessments',
      label: 'Assessments',
      icon: FileCheck
    },
    {
      id: 'certificates',
      label: 'Certifications',
      icon: Award
    },
    {
      id: 'knowledge',
      label: 'Knowledge Hub',
      icon: BookMarked
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="main-sidebar"
        className="frosted-glass text-zinc-300 rounded-[28px] p-4 flex flex-col shadow-2xl transition-all"
      >
        {/* User Context Header */}
        <div className="p-3.5 mb-3 bg-white/[0.04] backdrop-blur-md rounded-[20px] border border-white/10 shadow-inner">
          <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1">
            Active Workspace
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                {currentRole}
              </div>
              <div className="text-[11px] text-[#c2f866] font-medium truncate max-w-[130px]">
                {currentUser.name}
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#c2f866] shadow-[0_0_8px_#c2f866] animate-pulse" />
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                id={`sidebar-nav-${item.id}-btn`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#c2f866] text-black font-extrabold shadow-md shadow-lime-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />}
              </motion.button>
            );
          })}
        </nav>

        {/* Quick Trainer / Admin CTA */}
        {(currentRole === 'trainer' || currentRole === 'admin') && onOpenCreateCourse && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={onOpenCreateCourse}
              className="w-full py-2.5 px-3 bg-[#1e2029] hover:bg-[#c2f866] hover:text-black text-white rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-2 transition cursor-pointer macos-button"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#c2f866] group-hover:text-black" />
              <span>Create Course</span>
            </motion.button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#c2f866]" />
            <span>Capacity Connect</span>
          </div>
          <span className="font-mono text-zinc-600">v3.0</span>
        </div>
      </aside>
    </>
  );
};
