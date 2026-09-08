import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Star,
  CheckCircle2,
  Play,
  Award,
  Sparkles,
  PlusCircle,
  FileCheck,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Course, CourseEnrollment } from '../../types';

interface CourseCatalogProps {
  onSelectCourse: (course: Course) => void;
  onLaunchQuiz: (course: Course) => void;
  onOpenCreateCourse: () => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  onSelectCourse,
  onLaunchQuiz,
  onOpenCreateCourse
}) => {
  const { currentUser, currentRole, dataVersion, refreshAppData } = useAuth();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [enrollments, setEnrollments] = React.useState<CourseEnrollment[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>('All');
  const [statusFilter, setStatusFilter] = React.useState<'All' | 'Enrolled' | 'Completed'>('All');
  const [enrollingId, setEnrollingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCourses(dataService.getCourses());
    setEnrollments(dataService.getUserEnrollments(currentUser.id));
  }, [currentUser.id, dataVersion]);

  const categories = [
    'All',
    'Leadership',
    'Cloud & DevOps',
    'AI & Machine Learning',
    'Cybersecurity & Governance',
    'Full-Stack Development',
    'Data Engineering'
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;

    const enr = enrollments.find((e) => e.courseId === course.id);
    let matchesStatus = true;
    if (statusFilter === 'Enrolled') {
      matchesStatus = Boolean(enr && enr.status === 'in_progress');
    } else if (statusFilter === 'Completed') {
      matchesStatus = Boolean(enr && enr.status === 'completed');
    }

    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const handleEnroll = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEnrollingId(courseId);
    try {
      await dataService.enrollCourse(currentUser.id, courseId);
      refreshAppData();
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Enterprise Course Catalog
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Industry-aligned technical curricula, practical hands-on modules, and verified certification assessments.
          </p>
        </div>

        {(currentRole === 'trainer' || currentRole === 'admin') && (
          <button
            id="catalog-create-course-btn"
            onClick={onOpenCreateCourse}
            className="px-5 py-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black font-extrabold rounded-full text-xs transition flex items-center gap-2 shadow-lg shadow-lime-500/20 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Course
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121318] rounded-[28px] border border-white/5 p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="course-catalog-search-input"
              type="text"
              placeholder="Search courses, instructors, or technical keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#191a22] border border-white/10 rounded-full text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#c2f866] transition"
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-zinc-400 whitespace-nowrap">
              Level:
            </span>
            <select
              id="course-difficulty-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="py-2.5 px-4 text-xs bg-[#191a22] border border-white/10 rounded-full font-semibold text-white focus:outline-hidden focus:border-[#c2f866]"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-[#191a22] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-[#191a22] p-1 rounded-full w-full md:w-auto justify-center border border-white/5">
            {(['All', 'Enrolled', 'Completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  statusFilter === status
                    ? 'bg-[#c2f866] text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#c2f866] text-black font-extrabold shadow-sm'
                  : 'bg-[#191a22] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const enr = enrollments.find((e) => e.courseId === course.id);
          const isCompleted = enr?.status === 'completed';
          const isEnrolled = Boolean(enr);
          const progress = enr ? enr.progressPercent : 0;

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => onSelectCourse(course)}
              className="bg-[#13141b] rounded-[28px] border border-white/5 hover:border-white/20 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group macos-card"
            >
              <div>
                {/* Thumbnail banner */}
                <div className="relative h-48 w-full bg-[#1b1c24] overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13141b] via-transparent to-transparent" />

                  {/* Category Chip */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-xs">
                      {course.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {course.durationHours} hrs
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {course.rating}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                      {course.difficulty}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {course.modules.length} Modules
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-white leading-snug group-hover:text-[#c2f866] transition">
                    {course.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 text-xs text-zinc-400 flex items-center justify-between border-t border-white/5">
                    <span>Trainer: <strong className="text-zinc-200">{course.instructorName}</strong></span>
                    <span>{course.enrolledCount} learners</span>
                  </div>

                  {/* Progress bar if enrolled */}
                  {isEnrolled && (
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-zinc-400">Curriculum Progress</span>
                        <span className={isCompleted ? 'text-[#c2f866]' : 'text-cyan-400'}>
                          {progress}% {isCompleted ? '• Completed' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-[#1f202b] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCompleted ? 'bg-[#c2f866]' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action footer */}
              <div className="p-4 bg-[#171822] border-t border-white/5 flex items-center justify-between gap-2">
                {isCompleted ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c2f866]">
                      <CheckCircle2 className="w-4 h-4 text-[#c2f866]" />
                      Completed
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLaunchQuiz(course);
                      }}
                      className="px-4 py-1.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black font-extrabold rounded-full text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Award className="w-3.5 h-3.5" />
                      Certificate
                    </button>
                  </>
                ) : isEnrolled ? (
                  <>
                    <span className="text-xs font-semibold text-zinc-400">
                      In Progress
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course);
                      }}
                      className="px-4 py-1.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black font-extrabold rounded-full text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Resume
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-semibold text-zinc-400">
                      Free Enterprise Access
                    </span>
                    <button
                      onClick={(e) => handleEnroll(course.id, e)}
                      disabled={enrollingId === course.id}
                      className="px-4 py-1.5 bg-[#252834] hover:bg-[#c2f866] hover:text-black text-white font-extrabold rounded-full text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      {enrollingId === course.id ? (
                        'Enrolling...'
                      ) : (
                        <>
                          <span>Enroll</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
