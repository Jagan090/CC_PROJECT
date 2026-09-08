import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { UserProfile, Course } from '../../types';

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedUser?: UserProfile | null;
}

export const AssignCourseModal: React.FC<AssignCourseModalProps> = ({
  isOpen,
  onClose,
  preselectedUser
}) => {
  const { currentUser, refreshAppData } = useAuth();
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [selectedUserId, setSelectedUserId] = React.useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>('');
  const [deadlineDays, setDeadlineDays] = React.useState<number>(14);
  const [assignedSuccess, setAssignedSuccess] = React.useState(false);

  React.useEffect(() => {
    const allUsers = dataService.getUsers().filter((u) => u.role === 'employee');
    setUsers(allUsers);
    const allCourses = dataService.getCourses();
    setCourses(allCourses);

    if (preselectedUser) {
      setSelectedUserId(preselectedUser.id);
    } else if (allUsers.length > 0) {
      setSelectedUserId(allUsers[0].id);
    }

    if (allCourses.length > 0) {
      setSelectedCourseId(allCourses[0].id);
    }

    setAssignedSuccess(false);
  }, [preselectedUser, isOpen]);

  if (!isOpen) return null;

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedCourseId) return;

    await dataService.assignCourse(currentUser.id, selectedUserId, selectedCourseId);
    refreshAppData();
    setAssignedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const selectedUserObj = users.find((u) => u.id === selectedUserId);
  const selectedCourseObj = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        id="assign-course-modal-card"
        className="frosted-glass-modal rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden text-white"
      >
        <div className="p-6 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c2f866]/10 border border-[#c2f866]/20 flex items-center justify-center">
              <Send className="w-5 h-5 text-[#c2f866]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">Assign Training Course</h3>
              <p className="text-xs text-zinc-400">
                Dispatch curriculum assignment to accelerate engineer capability
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

        {assignedSuccess ? (
          <div className="p-8 text-center space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20 flex items-center justify-center mx-auto shadow-lime-500/20 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-display text-lg font-bold text-white">
              Assignment Successfully Dispatched!
            </h4>
            <p className="text-xs text-zinc-400">
              Notification sent to {selectedUserObj?.name}. Due in {deadlineDays} days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleAssign} className="p-6 space-y-4">
            {/* Employee Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Target Employee / Learner
              </label>
              <select
                id="assign-employee-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full py-3 px-4 bg-[#181924] border border-white/5 rounded-xl text-xs font-medium text-white focus:outline-hidden focus:border-[#c2f866]/50"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.title} ({u.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Course Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Curriculum to Assign
              </label>
              <select
                id="assign-course-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full py-3 px-4 bg-[#181924] border border-white/5 rounded-xl text-xs font-medium text-white focus:outline-hidden focus:border-[#c2f866]/50"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.category} • {c.difficulty})
                  </option>
                ))}
              </select>
            </div>

            {/* Completion Deadline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Target Completion Window
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDeadlineDays(days)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer macos-button ${
                      deadlineDays === days
                        ? 'border-[#c2f866] bg-[#c2f866] text-black shadow-md shadow-lime-500/20'
                        : 'border-white/5 bg-[#181924] hover:bg-[#20222f] text-zinc-300'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Summary preview */}
            {selectedUserObj && selectedCourseObj && (
              <div className="p-4 bg-[#161722] border border-white/5 rounded-2xl text-[11px] text-zinc-300 space-y-1">
                <div>
                  <strong className="text-white">Action:</strong> Enroll {selectedUserObj.name} in "{selectedCourseObj.title}".
                </div>
                <div>
                  Skill gain expectation: <span className="text-[#c2f866] font-bold">+{selectedCourseObj.quiz.skillBoostPoints}%</span> in target competency.
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="submit-assign-course-btn"
                type="submit"
                className="px-6 py-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-lime-500/20 cursor-pointer macos-button"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Assignment</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
