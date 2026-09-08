import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { SEED_USERS } from '../../data/seedData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const { loginWithGoogle, switchRole, currentRole } = useAuth();
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const rolesConfig: {
    role: UserRole;
    title: string;
    description: string;
    icon: any;
    user: any;
  }[] = [
    {
      role: 'employee',
      title: 'Employee / Learner',
      description: 'Track personal competency gaps, complete interactive modules, take quizzes, and earn printable certifications.',
      icon: GraduationCap,
      user: SEED_USERS.find((u) => u.role === 'employee')
    },
    {
      role: 'trainer',
      title: 'Instructor / Trainer',
      description: 'Publish curricula, author MCQ quizzes, review assessment passing metrics, and monitor student engagement.',
      icon: BookOpen,
      user: SEED_USERS.find((u) => u.role === 'trainer')
    },
    {
      role: 'manager',
      title: 'Engineering Manager',
      description: 'Review direct report skill matrix, identify team competency gaps, assign required training, and monitor progress.',
      icon: Users,
      user: SEED_USERS.find((u) => u.role === 'manager')
    },
    {
      role: 'admin',
      title: 'Executive LMS Admin',
      description: 'Organization-wide analytics, department benchmarking, catalog governance, and capacity development oversight.',
      icon: Shield,
      user: SEED_USERS.find((u) => u.role === 'admin')
    }
  ];

  const handleRoleLogin = (role: UserRole) => {
    switchRole(role);
    onLoginSuccess();
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onLoginSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        id="auth-modal-card"
        className="frosted-glass-modal rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden text-white"
      >
        {/* Header */}
        <div className="p-6 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c2f866]/15 border border-[#c2f866]/30 flex items-center justify-center shadow-[0_0_15px_rgba(194,248,102,0.2)]">
              <Sparkles className="w-5 h-5 text-[#c2f866]" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Sign In &amp; Demo Roles</h2>
              <p className="text-xs text-zinc-400">
                Switch personas instantly to present each portal capability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Google Sign-in */}
          <div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 frosted-glass-pill hover:bg-white/15 text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer macos-button"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{loading ? 'Authenticating...' : 'Continue with Google Account'}</span>
            </motion.button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#121318]/90 px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider absolute backdrop-blur-md rounded-full">
              Or Select Demo Role
            </span>
          </div>

          {/* 4 Role Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rolesConfig.map((item) => {
              const Icon = item.icon;
              const isCurrent = currentRole === item.role;
              return (
                <motion.button
                  key={item.role}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  id={`demo-role-select-${item.role}-btn`}
                  onClick={() => handleRoleLogin(item.role)}
                  className={`text-left p-4 rounded-[22px] border transition-all flex flex-col justify-between cursor-pointer macos-card ${
                    isCurrent
                      ? 'border-[#c2f866] bg-white/[0.08] backdrop-blur-md shadow-lg shadow-lime-500/10'
                      : 'border-white/10 hover:border-white/20 bg-white/[0.04] backdrop-blur-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
                          <Icon className={`w-4 h-4 ${isCurrent ? 'text-[#c2f866]' : 'text-zinc-300'}`} />
                        </div>
                        <span className={`font-display text-xs font-bold ${isCurrent ? 'text-[#c2f866]' : 'text-white'}`}>
                          {item.title}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold text-black bg-[#c2f866] px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.user && (
                    <div className="pt-2.5 border-t border-white/5 flex items-center gap-2">
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <div className="text-[11px] font-medium text-zinc-300 truncate">
                        {item.user.name} ({item.user.department.split(' ')[0]})
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-[#161722] border-t border-white/5 text-center text-xs text-zinc-500 font-medium">
          Tip: You can switch roles anytime using the top navigation badge during presentations.
        </div>
      </motion.div>
    </div>
  );
};
