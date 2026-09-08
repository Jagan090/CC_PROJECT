import React from 'react';
import { motion } from 'motion/react';
import {
  FileCheck,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Course, Certificate } from '../../types';

interface AssessmentHubProps {
  onLaunchQuiz: (course: Course) => void;
}

export const AssessmentHub: React.FC<AssessmentHubProps> = ({
  onLaunchQuiz
}) => {
  const { currentUser, dataVersion } = useAuth();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);

  React.useEffect(() => {
    setCourses(dataService.getCourses());
    setCertificates(dataService.getUserCertificates(currentUser.id));
  }, [currentUser.id, dataVersion]);

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Header Banner matching macOS Dark Luxury */}
      <section className="relative bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Standardized Technical Evaluations</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Assessments &amp; Competency Certification
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Test your knowledge across core engineering disciplines. Scoring 70% or higher automatically boosts your competency benchmark and issues verified credentials.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#161722] p-5 rounded-[24px] border border-white/10 backdrop-blur-md shrink-0 macos-card">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                Certifications Unlocked
              </div>
              <div className="font-display text-3xl font-black text-white mt-0.5">
                {certificates.length} <span className="text-zinc-500 text-lg font-medium">/ {courses.length}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const cert = certificates.find((c) => c.courseId === course.id);
          const isPassed = Boolean(cert);

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`rounded-[28px] border p-6 shadow-xl flex flex-col justify-between transition-all macos-card ${
                isPassed
                  ? 'bg-[#121815] border-emerald-500/30'
                  : 'bg-[#14151c] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    {course.category}
                  </span>
                  {isPassed ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#c2f866] bg-[#c2f866]/10 px-3 py-1 rounded-full border border-[#c2f866]/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passed ({cert?.finalScore}%)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-zinc-400">
                      Passing Score: {course.quiz.passingScore}%
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-white leading-snug">
                    {course.quiz.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    Evaluation for curriculum: {course.title}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between text-xs text-zinc-400 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-zinc-400" />
                    {course.quiz.questions.length} Questions (MCQ)
                  </span>
                  <span className="font-bold text-[#c2f866]">
                    +{course.quiz.skillBoostPoints}% Competency Gain
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  Instructor: {course.instructorName}
                </span>

                <button
                  id={`launch-assessment-btn-${course.id}`}
                  onClick={() => onLaunchQuiz(course)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition flex items-center gap-2 shadow-sm cursor-pointer macos-button ${
                    isPassed
                      ? 'bg-[#242735] hover:bg-[#c2f866] hover:text-black text-white border border-white/10'
                      : 'bg-[#c2f866] hover:bg-[#b0f34c] text-black shadow-lime-500/20 shadow-md'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{isPassed ? 'Retake for Higher Score' : 'Launch Assessment'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
