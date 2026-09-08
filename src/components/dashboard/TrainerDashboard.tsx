import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Users,
  Award,
  PlusCircle,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Course } from '../../types';

interface TrainerDashboardProps {
  onOpenCreateCourse: () => void;
  onSelectCourse: (course: Course) => void;
  onNavigateTab: (tab: string) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  onOpenCreateCourse,
  onSelectCourse,
  onNavigateTab
}) => {
  const { currentUser, dataVersion } = useAuth();
  const [courses, setCourses] = React.useState<Course[]>([]);

  React.useEffect(() => {
    setCourses(dataService.getCourses());
  }, [dataVersion]);

  const authoredCourses = courses; // In this enterprise demo, Marcus authored key courses
  const totalEnrolled = authoredCourses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const totalModules = authoredCourses.reduce((acc, c) => acc + c.modules.length, 0);

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Header matching macOS Dark Luxury */}
      <section className="relative bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Technical Enablement &amp; Instruction</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Instructor Studio: {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Author deep-dive technical modules, configure MCQ assessments, and track enterprise learner proficiency benchmarks.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            id="trainer-create-course-hero-btn"
            onClick={onOpenCreateCourse}
            className="px-6 py-3.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-sm font-extrabold transition shadow-lg shadow-lime-500/20 flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer macos-button"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Author New Course</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-6 rounded-[26px] border border-white/5 shadow-xl flex items-center justify-between macos-card"
        >
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Authored Courses
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
              {authoredCourses.length}
            </div>
            <div className="text-xs text-[#c2f866] font-semibold mt-1">
              {totalModules} interactive modules
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#c2f866] flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-6 rounded-[26px] border border-white/5 shadow-xl flex items-center justify-between macos-card"
        >
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Total Student Reach
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
              {totalEnrolled}
            </div>
            <div className="text-xs text-cyan-400 font-semibold mt-1">
              Active engineering enrollments
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-6 rounded-[26px] border border-white/5 shadow-xl flex items-center justify-between macos-card"
        >
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Avg Pass Rate
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
              87.4%
            </div>
            <div className="text-xs text-amber-400 font-semibold mt-1">
              Passing threshold: 70%
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-amber-400 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-6 rounded-[26px] border border-white/5 shadow-xl flex items-center justify-between macos-card"
        >
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Average Feedback
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
              4.88 / 5
            </div>
            <div className="text-xs text-[#c2f866] font-semibold mt-1">
              Based on 180+ reviews
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#c2f866] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Authored Courses Grid */}
      <section className="bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curriculum Management</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              Authored Curricula &amp; Question Banks
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage module syllabi, video resources, and assessment questions
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={onOpenCreateCourse}
            className="px-5 py-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-lime-500/20 self-start sm:self-auto cursor-pointer macos-button"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {authoredCourses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-[#14151b] border border-white/5 hover:border-white/20 rounded-[28px] overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between macos-card"
            >
              <div>
                <div className="relative h-44 w-full bg-[#1b1c24] overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-xs">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                      {course.difficulty}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      ★ {course.rating}
                    </span>
                  </div>

                  <h4 className="font-display text-base font-bold text-white line-clamp-2 leading-snug">
                    {course.title}
                  </h4>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-500 flex items-center justify-between">
                    <span>{course.modules.length} modules</span>
                    <span>•</span>
                    <span>{course.quiz.questions.length} quiz questions</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#181922] border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">
                  {course.enrolledCount} enrolled
                </span>
                <button
                  onClick={() => onSelectCourse(course)}
                  className="px-4 py-1.5 bg-[#252836] hover:bg-[#c2f866] hover:text-black text-white rounded-full text-xs font-bold transition flex items-center gap-1 border border-white/5 macos-button"
                >
                  <span>Preview</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
