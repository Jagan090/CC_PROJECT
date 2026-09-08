import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bell,
  CheckCircle2,
  Award,
  BookOpen,
  Clock,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { currentUser, dataVersion, refreshAppData } = useAuth();
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);

  React.useEffect(() => {
    setNotifications(dataService.getUserNotifications(currentUser.id));
  }, [currentUser.id, dataVersion]);

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string, actionUrl?: string) => {
    dataService.markNotificationAsRead(id);
    refreshAppData();
    if (actionUrl) {
      onNavigateTab(actionUrl);
      onClose();
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'certificate':
        return <Award className="w-4 h-4 text-[#c2f866]" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'deadline':
        return <Clock className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          id="notifications-drawer-panel"
          className="w-screen max-w-sm frosted-glass-modal shadow-2xl border-l border-white/15 flex flex-col text-white"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#c2f866]" />
              <h3 className="font-display font-bold text-white text-sm">Notifications</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c2f866] text-black">
                {notifications.filter((n) => !n.read).length} Unread
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id, notif.actionUrl)}
                  className={`p-4 transition cursor-pointer hover:bg-white/5 flex items-start gap-3 ${
                    !notif.read ? 'bg-[#181924]' : 'bg-transparent'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-2xs mt-0.5 shrink-0">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-xs font-bold text-white truncate">
                        {notif.title}
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#c2f866] shrink-0 shadow-[0_0_6px_#c2f866]" />
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-500">
                      <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                      {notif.actionUrl && (
                        <span className="text-[#c2f866] font-bold flex items-center gap-1">
                          Open <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#161722] border-t border-white/5 text-center">
            <button
              onClick={() => {
                notifications.forEach((n) => dataService.markNotificationAsRead(n.id));
                refreshAppData();
              }}
              className="text-xs font-bold text-zinc-400 hover:text-[#c2f866] transition cursor-pointer"
            >
              Mark all as read
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
