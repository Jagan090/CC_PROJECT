import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  FileCheck,
  Award,
  Clock,
  BookOpen,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Course, CourseEnrollment, CourseModule } from '../../types';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
  onLaunchQuiz: (course: Course) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  onBack,
  onLaunchQuiz
}) => {
  const { currentUser, dataVersion, refreshAppData } = useAuth();
  const [enrollment, setEnrollment] = React.useState<CourseEnrollment | undefined>(undefined);
  const [activeModuleIndex, setActiveModuleIndex] = React.useState(0);
  const [isPlayingMockVideo, setIsPlayingMockVideo] = React.useState(false);
  const [completing, setCompleting] = React.useState(false);

  React.useEffect(() => {
    let enr = dataService.getEnrollment(currentUser.id, course.id);
    if (!enr) {
      // Auto enroll on opening player if not already
      dataService.enrollCourse(currentUser.id, course.id).then((newEnr) => {
        setEnrollment(newEnr);
        refreshAppData();
      });
    } else {
      setEnrollment(enr);
      // Auto-select first incomplete module if available
      const firstIncomplete = course.modules.findIndex((m) => !enr?.completedModuleIds.includes(m.id));
      if (firstIncomplete !== -1) {
        setActiveModuleIndex(firstIncomplete);
      }
    }
  }, [course.id, currentUser.id, dataVersion]);

  const activeModule: CourseModule = course.modules[activeModuleIndex] || course.modules[0];
  const isCurrentCompleted = Boolean(enrollment?.completedModuleIds.includes(activeModule.id));

  const handleMarkModuleComplete = async () => {
    setCompleting(true);
    try {
      const updated = await dataService.completeModule(currentUser.id, course.id, activeModule.id);
      setEnrollment(updated);
      refreshAppData();

      // Automatically advance to next module if available
      if (activeModuleIndex < course.modules.length - 1) {
        setActiveModuleIndex(activeModuleIndex + 1);
      }
    } finally {
      setCompleting(false);
    }
  };

  const allModulesDone = course.modules.every((m) => enrollment?.completedModuleIds.includes(m.id));

  return (
    <div className="space-y-6 animate-in fade-in text-white">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="course-player-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white bg-[#161722] border border-white/10 px-4 py-2.5 rounded-full transition shadow-md cursor-pointer macos-button"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-[#161722] px-3.5 py-2 rounded-full border border-white/5">
            <span>Overall Progress:</span>
            <span className="font-extrabold text-[#c2f866]">{enrollment?.progressPercent || 0}%</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="course-player-launch-quiz-top-btn"
            onClick={() => onLaunchQuiz(course)}
            className="px-5 py-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black text-xs font-extrabold rounded-full transition flex items-center gap-1.5 shadow-md shadow-lime-500/20 cursor-pointer macos-button"
          >
            <FileCheck className="w-4 h-4" />
            <span>Launch Certification Exam</span>
          </motion.button>
        </div>
      </div>

      {/* Main Learning Canvas Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Interactive Video & Study Reader */}
        <div className="lg:col-span-8 space-y-6">
          {/* Simulated Video & Media Player */}
          <div className="bg-[#121318] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl text-white macos-card">
            <div className="relative aspect-video bg-gradient-to-tr from-[#0a0a0e] via-[#12131c] to-[#181a28] flex flex-col items-center justify-center p-6 text-center">
              {isPlayingMockVideo ? (
                <div className="space-y-3 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#c2f866]/20 border-2 border-[#c2f866] flex items-center justify-center mx-auto animate-pulse">
                    <Sparkles className="w-8 h-8 text-[#c2f866] animate-spin" />
                  </div>
                  <div className="font-display text-sm font-bold text-white">
                    Streaming Interactive Lecture: Module {activeModuleIndex + 1}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {activeModule.title}
                  </div>
                  <button
                    onClick={() => setIsPlayingMockVideo(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-full border border-white/20 transition cursor-pointer macos-button"
                  >
                    Pause Video
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    id="player-play-video-btn"
                    onClick={() => setIsPlayingMockVideo(true)}
                    className="w-16 h-16 rounded-full bg-[#c2f866] hover:bg-[#b0f34c] text-black flex items-center justify-center shadow-lg shadow-lime-500/30 transition mx-auto cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </motion.button>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-white">
                      {activeModule.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center justify-center gap-3">
                      <span>{course.instructorName}</span>
                      <span>•</span>
                      <span>{activeModule.durationMinutes} Minutes</span>
                      <span>•</span>
                      <span className="text-[#c2f866]">HD 1080p Interactive</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Video Timeline Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md p-3.5 flex items-center justify-between text-xs text-zinc-400 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingMockVideo(!isPlayingMockVideo)}
                    className="p-1 hover:text-white transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <span>04:12 / {activeModule.durationMinutes}:00</span>
                </div>
                <div className="flex-1 mx-4 bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#c2f866] h-full w-1/3" />
                </div>
                <span className="font-mono text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded">1080p</span>
              </div>
            </div>
          </div>

          {/* Module Text Material / Study Notes */}
          <div className="bg-[#121318] rounded-[32px] border border-white/5 p-6 sm:p-8 shadow-2xl space-y-6 macos-card">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <div className="text-[11px] font-bold text-[#c2f866] uppercase tracking-wider">
                  Module {activeModuleIndex + 1} of {course.modules.length}
                </div>
                <h2 className="font-display text-xl font-bold text-white mt-1">
                  {activeModule.title}
                </h2>
              </div>

              {isCurrentCompleted && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>

            {/* Formatted Technical Notes */}
            <div className="text-zinc-300 text-xs sm:text-sm leading-relaxed space-y-4">
              <div className="bg-[#161722] border border-white/5 rounded-2xl p-4 text-zinc-300 text-xs font-medium leading-relaxed">
                <strong className="text-white">Executive Summary:</strong> {activeModule.description}
              </div>

              <div className="whitespace-pre-line font-sans text-zinc-400 leading-relaxed">
                {activeModule.content}
              </div>
            </div>

            {/* Complete Module Button & Exam Launcher */}
            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                id="module-mark-completed-btn"
                onClick={handleMarkModuleComplete}
                disabled={completing || isCurrentCompleted}
                className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-md cursor-pointer macos-button ${
                  isCurrentCompleted
                    ? 'bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/30 cursor-default'
                    : 'bg-[#c2f866] hover:bg-[#b0f34c] text-black shadow-lime-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCurrentCompleted ? 'Module Completed' : completing ? 'Saving Progress...' : 'Mark as Complete & Next'}</span>
              </button>

              <button
                onClick={() => onLaunchQuiz(course)}
                className="px-5 py-2.5 bg-[#1e2029] hover:bg-[#272a38] text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-2 border border-white/10 cursor-pointer macos-button"
              >
                <FileCheck className="w-4 h-4 text-[#c2f866]" />
                <span>Take Course Quiz ({course.quiz.questions.length} Questions)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Curriculum Syllabus & Module List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121318] rounded-[32px] border border-white/5 p-6 shadow-2xl space-y-4 macos-card">
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Curriculum Syllabus
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {enrollment?.completedModuleIds.length || 0} of {course.modules.length} modules completed
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#181924] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#c2f866] h-full rounded-full transition-all"
                style={{ width: `${enrollment?.progressPercent || 0}%` }}
              />
            </div>

            {/* Module Item Buttons */}
            <div className="space-y-2 pt-2">
              {course.modules.map((module, idx) => {
                const isCompleted = enrollment?.completedModuleIds.includes(module.id);
                const isActive = activeModuleIndex === idx;

                return (
                  <motion.button
                    key={module.id}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    id={`syllabus-mod-btn-${idx}`}
                    onClick={() => setActiveModuleIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start gap-3 cursor-pointer macos-card ${
                      isActive
                        ? 'border-[#c2f866] bg-[#1a1c25] shadow-lg shadow-lime-500/10'
                        : 'border-white/5 hover:border-white/20 bg-[#161720]'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#c2f866]" />
                      ) : (
                        <Circle className={`w-4 h-4 ${isActive ? 'text-[#c2f866]' : 'text-zinc-500'}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Module {idx + 1} • {module.durationMinutes}m
                      </div>
                      <div className={`text-xs font-bold truncate mt-0.5 ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                        {module.title}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Quiz Banner in Syllabus */}
            <div className="pt-4 border-t border-white/5">
              <div className="p-4 bg-[#161722] border border-white/5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-white text-xs font-bold">
                  <Award className="w-4 h-4 text-[#c2f866]" />
                  <span>Certification Assessment</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Pass with 70% or higher to automatically boost your skill proficiency and earn an enterprise certificate.
                </p>
                <button
                  onClick={() => onLaunchQuiz(course)}
                  className="w-full py-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-md shadow-lime-500/20 cursor-pointer macos-button"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Start Quiz ({course.quiz.questions.length} MCQs)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Instructor & Skill Gain Card */}
          <div className="bg-[#121318] rounded-[32px] border border-white/5 p-6 shadow-2xl space-y-3 macos-card">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Instructor Profile
            </h4>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                alt={course.instructorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
              />
              <div>
                <div className="text-xs font-bold text-white">
                  {course.instructorName}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {course.instructorRole}
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Skill Award:</span>
              <span className="font-extrabold text-[#c2f866]">+{course.quiz.skillBoostPoints}% Competency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
