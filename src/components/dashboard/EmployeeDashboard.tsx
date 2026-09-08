import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Award,
  TrendingUp,
  Target,
  Clock,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Play,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Star,
  Quote,
  Layers,
  Network,
  Compass,
  MessageSquareCode
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Course, CourseEnrollment, UserSkillProficiency } from '../../types';
import { CyberneticOrb } from '../common/CyberneticOrb';
import { IridescentCylinder, IridescentSpiral } from '../common/IridescentShapes';

interface EmployeeDashboardProps {
  onSelectCourse: (course: Course) => void;
  onNavigateTab: (tab: string) => void;
  onLaunchQuiz: (course: Course) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onSelectCourse,
  onNavigateTab,
  onLaunchQuiz
}) => {
  const { currentUser, dataVersion } = useAuth();

  const [courses, setCourses] = React.useState<Course[]>([]);
  const [enrollments, setEnrollments] = React.useState<CourseEnrollment[]>([]);
  const [skills, setSkills] = React.useState<UserSkillProficiency[]>([]);
  const [certificatesCount, setCertificatesCount] = React.useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = React.useState(0);

  React.useEffect(() => {
    setCourses(dataService.getCourses());
    setEnrollments(dataService.getUserEnrollments(currentUser.id));
    setSkills(dataService.getUserSkills(currentUser.id));
    setCertificatesCount(dataService.getUserCertificates(currentUser.id).length);
  }, [currentUser.id, dataVersion]);

  // Derived metrics
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed');
  const inProgressEnrollments = enrollments.filter((e) => e.status === 'in_progress');
  const activeEnrollment = inProgressEnrollments[0];
  const activeCourse = activeEnrollment ? courses.find((c) => c.id === activeEnrollment.courseId) : courses[0];

  const avgProficiency = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => acc + s.currentProficiency, 0) / skills.length)
    : 0;

  // Radar chart data: Current vs Target benchmark
  const radarData = skills.map((s) => ({
    subject: s.skillName.split(' ')[0] + ' ' + (s.skillName.split(' ')[1] || ''),
    Current: s.currentProficiency,
    Target: s.targetProficiency,
    fullMark: 100
  }));

  // Identify highest skill gaps
  const largestGaps = [...skills]
    .filter((s) => s.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  // Video lessons data for Screenshot 3 carousel
  const videoLessons = [
    {
      id: 'vl-1',
      title: 'Innovative Leadership Strategies for Tomorrow’s Challenges',
      description: 'Discover the secrets of effective leadership and elevate your managerial prowess to new heights.',
      duration: '45 min',
      views: '150 views',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      courseIndex: 0
    },
    {
      id: 'vl-2',
      title: 'Empowering Managers: The Art of Inspiring Teams',
      description: 'Inspire and motivate your teams like never before with the transformative power of visionary leadership.',
      duration: '50 min',
      views: '210 views',
      thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
      courseIndex: 1
    },
    {
      id: 'vl-3',
      title: 'Agile Leadership: Thriving in a Dynamic Business Landscape',
      description: 'Stay agile and thrive in a fast-paced business world, guiding your team to achieve remarkable results.',
      duration: '35 min',
      views: '235 views',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      courseIndex: 2
    }
  ];

  // Testimonials matching Screenshot 3
  const testimonials = [
    {
      quote: "Absolutely impressed with the top-notch service provided by the LEARNME team! They guided me through every step of the course, and their expertise made the learning experience smooth and enjoyable. Highly recommend!",
      author: "Alex Johnson",
      rating: 5
    },
    {
      quote: "I'm beyond satisfied with the expertise shared in these courses. LEARNME truly delivers excellence in their educational platform. I gained valuable management tools and now feel more confident leading my team effectively.",
      author: "David Martinez",
      rating: 5
    },
    {
      quote: "Enrolling in LEARNME courses was the best decision I made for my career growth. The content was comprehensive, and the instructors were knowledgeable and supportive. I gained valuable insights that I immediately applied.",
      author: "Elena Rostova",
      rating: 5
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* 
        ========================================================================
        SCREENSHOT 1: HERO SECTION ("Keep Learning On Track")
        ========================================================================
      */}
      <section className="relative frosted-glass rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
        {/* Subtle grid background accent with ambient refraction */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Header Row */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          {/* Main Hero Headline */}
          <div className="space-y-4 max-w-xl">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              Keep Learning <br />
              <span className="text-white">On Track</span>
            </h1>
          </div>

          {/* Subtitle & Neon Lime CTA Button */}
          <div className="space-y-6 max-w-md lg:text-left flex flex-col sm:items-start">
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Elevate your management skills with our cutting-edge courses. Join our courses for comprehensive capacity building.
            </p>

            <button
              id="hero-start-now-btn"
              onClick={() => {
                if (activeCourse) {
                  onSelectCourse(activeCourse);
                } else {
                  onNavigateTab('courses');
                }
              }}
              className="inline-flex items-center justify-center gap-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-lg shadow-lime-500/25 active:scale-95 cursor-pointer group"
            >
              <span>{activeEnrollment ? 'Continue Now' : 'Start Now'}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Center: Cybernetic Holographic Orb Visual */}
        <div className="relative z-10 my-6 sm:my-8 flex items-center justify-center">
          <CyberneticOrb className="transform scale-95 sm:scale-105 transition-transform duration-700 hover:scale-110" />
        </div>

        {/* Bottom Bar: Stacked Interactive Floating Cards (Left) & Metrics (Right) */}
        <div className="relative z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
          {/* Stack of 3 Cards matching Screenshot 1 with Frosted Glass Bevels */}
          <div className="flex flex-wrap sm:flex-nowrap items-end gap-3 sm:gap-4">
            {/* Card 1: Coral / Peach Card ("Essentials of Leadership") */}
            <motion.div
              whileHover={{ y: -8, scale: 1.03, rotate: 0 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => {
                const leadCourse = courses.find((c) => c.category === 'Leadership') || courses[0];
                if (leadCourse) onSelectCourse(leadCourse);
              }}
              className="w-full sm:w-48 bg-[#f87171]/90 backdrop-blur-xl border border-white/30 hover:bg-[#ef4444] text-black rounded-[22px] p-4 shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] cursor-pointer transform -rotate-2 select-none"
            >
              <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center mb-2">
                <Compass className="w-4 h-4 text-black" />
              </div>
              <div className="font-extrabold text-xs text-black leading-tight mb-1">
                Essentials of Leadership
              </div>
              <p className="text-[10px] text-black/80 line-clamp-2 mb-3 leading-snug">
                Learn the fundamentals of effective leadership and develop your managerial skills.
              </p>
              <div className="inline-block bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                Explore
              </div>
            </motion.div>

            {/* Card 2: Bright Mint/Turquoise Card ("Management Mastery") */}
            <motion.div
              whileHover={{ y: -8, scale: 1.03, rotate: 0 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => {
                const mgmtCourse = courses.find((c) => c.title.toLowerCase().includes('management')) || courses[1] || courses[0];
                if (mgmtCourse) onSelectCourse(mgmtCourse);
              }}
              className="w-full sm:w-48 bg-[#38e1b0]/90 backdrop-blur-xl border border-white/30 hover:bg-[#2dd4bf] text-black rounded-[22px] p-4 shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] cursor-pointer transform rotate-1 select-none"
            >
              <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center mb-2">
                <Network className="w-4 h-4 text-black" />
              </div>
              <div className="font-extrabold text-xs text-black leading-tight mb-1">
                Management Mastery
              </div>
              <p className="text-[10px] text-black/80 line-clamp-2 mb-3 leading-snug">
                Learn the fundamentals of effective leadership and develop your managerial skills.
              </p>
              <div className="inline-block bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                Explore
              </div>
            </motion.div>

            {/* Card 3: Sleek Silver Card ("Strategic Planning") with circular badge */}
            <motion.div
              whileHover={{ y: -8, scale: 1.03, rotate: 0 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => onNavigateTab('courses')}
              className="w-full sm:w-48 bg-[#e2e8f0]/90 backdrop-blur-xl border border-white/40 hover:bg-white text-black rounded-[22px] p-4 shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)] cursor-pointer transform -rotate-1 select-none relative"
            >
              <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center mb-2">
                <Layers className="w-4 h-4 text-black" />
              </div>
              <div className="font-extrabold text-xs text-black leading-tight mb-1">
                Strategic Planning
              </div>
              <p className="text-[10px] text-black/70 line-clamp-2 mb-2 leading-snug">
                Master adaptive frameworks and organizational roadmaps.
              </p>
              {/* Circular Explore More badge from screenshot */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  ↓
                </div>
                <span className="text-[10px] font-bold text-black uppercase tracking-wider">
                  Explore more
                </span>
              </div>
            </motion.div>
          </div>

          {/* Metric Block: "1.2K" + Avatars matching Screenshot 1 */}
          <div className="flex flex-col sm:items-end space-y-2">
            <div className="flex items-center gap-4">
              <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                1.2K
              </span>
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#121215] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Learner 1"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#121215] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Learner 2"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#121215] object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Learner 3"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-[#c2f866] animate-pulse" />
              <span>Total number of users completed the training</span>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SCREENSHOT 2 (TOP): ADVANCED LEADERSHIP STRATEGIES (3 DARK CARDS)
        ========================================================================
      */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Advanced Leadership Strategies
            </h2>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md">
            Explore case studies and real-world examples that illustrate the application of advanced leadership strategies in various industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Adaptive Leadership Framework */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => onNavigateTab('courses')}
            className="frosted-glass-card rounded-[28px] p-6 relative flex flex-col justify-between h-56 group cursor-pointer shadow-lg"
          >
            <div className="space-y-2">
              <h3 className="font-display font-bold text-white text-lg leading-snug group-hover:text-[#c2f866] transition">
                Adaptive Leadership Framework
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Learn to navigate and lead through complex and rapidly changing environments.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-300">
                <Compass className="w-4 h-4" />
              </div>
              <button
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#c2f866] text-white hover:text-black flex items-center justify-center transition-all shadow-md macos-button cursor-pointer"
                aria-label="Open Adaptive Leadership"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Transformational Leadership Techniques with Emerald Accent */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => onNavigateTab('courses')}
            className="bg-gradient-to-b from-emerald-950/40 to-[#12141a]/60 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400/50 rounded-[28px] p-6 relative flex flex-col justify-between h-56 transition-all duration-300 group cursor-pointer shadow-lg macos-card"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#c2f866] shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Network className="w-5 h-5" />
              </div>
              <button
                className="w-11 h-11 rounded-full bg-white/10 group-hover:bg-[#c2f866] text-white group-hover:text-black flex items-center justify-center transition-all shadow-md macos-button cursor-pointer"
                aria-label="Open Transformational Leadership"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              <h3 className="font-display font-bold text-white text-lg leading-snug group-hover:text-[#c2f866] transition">
                Transformational Leadership Techniques
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Discover powerful strategies to inspire and drive positive organizational change.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Influential Communication Mastery */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => onNavigateTab('courses')}
            className="frosted-glass-card rounded-[28px] p-6 relative flex flex-col justify-between h-56 group cursor-pointer shadow-lg"
          >
            <div className="space-y-2">
              <h3 className="font-display font-bold text-white text-lg leading-snug group-hover:text-[#c2f866] transition">
                Influential Communication Mastery
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Develop advanced communication skills to effectively engage and influence stakeholders.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-300">
                <MessageSquareCode className="w-4 h-4" />
              </div>
              <button
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#c2f866] text-white hover:text-black flex items-center justify-center transition-all shadow-md macos-button cursor-pointer"
                aria-label="Open Influential Communication"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 
        ========================================================================
        SCREENSHOT 2 (BOTTOM): PRISTINE LIGHT PANEL ("Foundational Courses")
        ========================================================================
      */}
      <section className="bg-[#fbfbfa] border border-zinc-200/80 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl text-zinc-900">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight leading-snug max-w-2xl">
            Foundational Courses: <br />
            <span className="text-zinc-800">Transformational Leadership Techniques</span>
          </h2>
        </div>

        {/* Table Rows matching Screenshot 2 */}
        <div className="divide-y divide-zinc-200">
          {[
            {
              id: 'fc-1',
              title: 'Project Management Fundamentals',
              desc: 'Develop advanced communication skills to effectively engage and influence stakeholders.',
              tags: ['Planning', 'Execution', 'Teamwork'],
              date: 'Sep 15, 2024',
              category: 'Management'
            },
            {
              id: 'fc-2',
              title: 'Effective Communication Skills',
              desc: 'Develop advanced communication skills to effectively engage and influence stakeholders.',
              tags: ['Interpersonal', 'Presentation', 'Influence'],
              date: 'Sep 21, 2024',
              category: 'Leadership'
            },
            {
              id: 'fc-3',
              title: 'Strategic Leadership & Roadmaps',
              desc: 'Develop advanced communication skills to effectively engage and influence stakeholders.',
              tags: ['Strategy', 'Leadership', 'Vision'],
              date: 'Oct 9, 2024',
              category: 'Strategy'
            },
            {
              id: 'fc-4',
              title: 'Data–Driven Decision Making',
              desc: 'Develop advanced analytical skills to leverage business metrics for high-impact organizational decisions.',
              tags: ['Analysis', 'Problem Solving', 'Data'],
              date: 'Nov 12, 2024',
              category: 'Analytics'
            }
          ].map((item, idx) => {
            // Find corresponding course if available
            const matchingCourse = courses[idx] || courses[0];
            return (
              <div
                key={item.id}
                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-100/60 px-3 rounded-2xl transition"
              >
                {/* Left: Icon & Titles */}
                <div className="flex items-start gap-4 max-w-xl">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0 mt-0.5">
                    {idx === 0 ? (
                      <Layers className="w-5 h-5" />
                    ) : idx === 1 ? (
                      <MessageSquareCode className="w-5 h-5" />
                    ) : idx === 2 ? (
                      <Compass className="w-5 h-5" />
                    ) : (
                      <Network className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-zinc-950">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Center & Right: Chips, Date & Explore Button */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:justify-end">
                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-zinc-100/90 border border-zinc-300 text-zinc-700 text-[11px] font-semibold rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                    {item.date}
                  </span>

                  {/* Explore Pill Button */}
                  <button
                    onClick={() => {
                      if (matchingCourse) {
                        onSelectCourse(matchingCourse);
                      } else {
                        onNavigateTab('courses');
                      }
                    }}
                    className="bg-zinc-950 hover:bg-black text-white text-xs font-bold px-5 py-2 rounded-full transition shadow-xs"
                  >
                    Explore
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Large Neon Lime Button matching bottom of Screenshot 2 */}
        <div className="mt-8 pt-4">
          <button
            onClick={() => onNavigateTab('courses')}
            className="w-full bg-gradient-to-r from-[#b5f464] to-[#7af09c] hover:opacity-95 text-black font-extrabold text-base py-4 px-8 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-lime-500/15 transition cursor-pointer"
          >
            <span>Show All Courses</span>
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* 
        ========================================================================
        SCREENSHOT 3 (TOP): "Watch the free lessons" Video Carousel
        ========================================================================
      */}
      <section className="frosted-glass rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden">
        {/* Header with Title & Iridescent Cylinder Asset */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-2 max-w-lg">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Watch the free lessons
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Equip yourself with innovative leadership strategies to tackle tomorrow’s business landscape with confidence.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <IridescentCylinder className="hidden sm:block transform scale-90" />
            {/* Carousel navigation controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setActiveLessonIndex((prev) => (prev > 0 ? prev - 1 : videoLessons.length - 1))
                }
                className="w-10 h-10 rounded-full frosted-glass-pill hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                aria-label="Previous lesson"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveLessonIndex((prev) => (prev < videoLessons.length - 1 ? prev + 1 : 0))
                }
                className="w-10 h-10 rounded-full frosted-glass-pill hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                aria-label="Next lesson"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videoLessons.map((lesson, idx) => {
            const courseTarget = courses[lesson.courseIndex] || courses[0];
            return (
              <motion.div
                key={lesson.id}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() => {
                  if (courseTarget) onSelectCourse(courseTarget);
                }}
                className="frosted-glass-card rounded-[24px] overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* Thumbnail with Play Button Overlay */}
                <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#c2f866] group-hover:text-black transition-all shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-sm text-white leading-snug group-hover:text-[#c2f866] transition">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center gap-3 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {lesson.duration}
                    </span>
                    <span>•</span>
                    <span>{lesson.views}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 
        ========================================================================
        COMPETENCY INTELLIGENCE & SKILL RADAR MATRIX (CORE PRESERVED FEATURE)
        ========================================================================
      */}
      <section className="frosted-glass rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostic Benchmark</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Skill Gap &amp; Competency Intelligence
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('competencies')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#c2f866] hover:underline cursor-pointer"
          >
            <span>Open Interactive Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Chart (6 cols) */}
          <div className="lg:col-span-6 bg-white/[0.03] backdrop-blur-md p-6 rounded-[28px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                Multi-Axial Proficiency Radar
              </h3>
              <span className="text-xs font-mono text-[#c2f866] bg-[#c2f866]/15 px-2.5 py-0.5 rounded-full border border-[#c2f866]/30">
                Avg: {avgProficiency}%
              </span>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar
                    name="Target Benchmark"
                    dataKey="Target"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.15}
                  />
                  <Radar
                    name="Current Proficiency"
                    dataKey="Current"
                    stroke="#c2f866"
                    fill="#c2f866"
                    fillOpacity={0.4}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(18, 20, 28, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: '16px',
                      color: '#ffffff'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Gap List (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-300">
              Active Targeted Competencies
            </div>
            <div className="space-y-3">
              {skills.slice(0, 4).map((skill) => (
                <div
                  key={skill.skillId}
                  className="bg-white/[0.04] backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{skill.skillName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {skill.currentProficiency}% / {skill.targetProficiency}%
                      </span>
                      {skill.gap > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/15 text-red-400 border border-red-500/30">
                          -{skill.gap}% Gap
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c2f866]/15 text-[#c2f866] border border-[#c2f866]/30">
                          Target Met
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-[#252834] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        skill.gap === 0 ? 'bg-[#c2f866]' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${skill.currentProficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SCREENSHOT 3 (MIDDLE): "What our students are saying about us:"
        ========================================================================
      */}
      <section className="bg-[#fbfbfa] border border-zinc-200/80 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl text-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            What our students are saying about us:
          </h2>
          <button
            onClick={() => onNavigateTab('knowledge')}
            className="bg-[#c2f866] hover:bg-[#b0f34c] text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 transition shadow-md shadow-lime-500/20 self-start sm:self-auto cursor-pointer"
          >
            <span>Leave Feedback</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs flex flex-col justify-between space-y-4 macos-card"
            >
              <div className="space-y-3">
                <Quote className="w-7 h-7 text-zinc-300" />
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {item.quote}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="font-display font-bold text-xs text-zinc-900">
                  {item.author}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        SCREENSHOT 3 (BOTTOM): "Achievements and Accolades"
        ========================================================================
      */}
      <section className="frosted-glass rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: 3D Iridescent Spiral Graphic */}
          <div className="shrink-0 flex items-center justify-center">
            <IridescentSpiral />
          </div>

          {/* Right: Accolades Copy & Prestigious Award Badges */}
          <div className="space-y-6 flex-1 text-center lg:text-left">
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Achievements and Accolades
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                At LEARNME, we take immense pride in the accomplishments of our students. Join our transformative courses and embark on a journey of continuous growth. From industry recognition to personal triumphs, our learners shine with excellence.
              </p>
            </div>

            {/* Award Brands matching Screenshot 3 */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-2">
              <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider">
                <span className="text-[10px] text-zinc-500 block font-normal">cayuse</span>
                Post-Award
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300 font-bold text-sm">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span>reddot</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-400" />
                <span>WORLD BRANDING AWARDS</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
