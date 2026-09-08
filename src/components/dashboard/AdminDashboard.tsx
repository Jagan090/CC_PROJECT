import React from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Award,
  PlusCircle,
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Course, UserProfile } from '../../types';

interface AdminDashboardProps {
  onOpenCreateCourse: () => void;
  onOpenAssignModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenCreateCourse,
  onOpenAssignModal,
  onNavigateTab
}) => {
  const { currentUser, dataVersion } = useAuth();
  const [analytics, setAnalytics] = React.useState(dataService.getAnalyticsOverview());
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [activities, setActivities] = React.useState(dataService.getActivities());

  React.useEffect(() => {
    setAnalytics(dataService.getAnalyticsOverview());
    setCourses(dataService.getCourses());
    setUsers(dataService.getUsers());
    setActivities(dataService.getActivities());
  }, [dataVersion]);

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Admin Executive Header matching macOS Dark Luxury */}
      <section className="relative bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Global Enterprise Governance</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Executive LMS Administration
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Real-time telemetry across employee participation, curriculum completion velocity, assessment benchmarks, and departmental skill gaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              id="admin-create-course-header-btn"
              onClick={onOpenCreateCourse}
              className="px-5 py-3 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition shadow-lg shadow-lime-500/20 flex items-center gap-2 cursor-pointer macos-button"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Course</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              id="admin-assign-course-header-btn"
              onClick={onOpenAssignModal}
              className="px-5 py-3 bg-[#242635] hover:bg-[#2d3043] text-white border border-white/10 rounded-full text-xs font-extrabold transition flex items-center gap-2 cursor-pointer macos-button"
            >
              <Send className="w-4 h-4" />
              <span>Assign Training</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* 5 Real Computed KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-5 rounded-[24px] border border-white/5 shadow-xl flex flex-col justify-between macos-card"
        >
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Total Employees
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
            {users.length}
          </div>
          <div className="text-[11px] text-zinc-400 font-medium mt-1">
            Across 4 departments
          </div>
        </motion.div>

        {/* KPI 2 */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-5 rounded-[24px] border border-white/5 shadow-xl flex flex-col justify-between macos-card"
        >
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Active Learners
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-[#c2f866] mt-1">
            {analytics.activeLearners}
          </div>
          <div className="text-[11px] text-[#c2f866] font-medium mt-1">
            Engaged this month
          </div>
        </motion.div>

        {/* KPI 3 */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-5 rounded-[24px] border border-white/5 shadow-xl flex flex-col justify-between macos-card"
        >
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Published Courses
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
            {courses.length}
          </div>
          <div className="text-[11px] text-cyan-400 font-medium mt-1">
            Across 6 categories
          </div>
        </motion.div>

        {/* KPI 4 */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-5 rounded-[24px] border border-white/5 shadow-xl flex flex-col justify-between macos-card"
        >
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Course Completion
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
            {analytics.completionRate}%
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            +8% vs last quarter
          </div>
        </motion.div>

        {/* KPI 5 */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-5 rounded-[24px] border border-white/5 shadow-xl flex flex-col justify-between macos-card"
        >
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Avg Quiz Score
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
            {analytics.avgAssessmentScore}%
          </div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">
            Pass threshold: 70%
          </div>
        </motion.div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Performance Comparison Bar Chart */}
        <section className="lg:col-span-7 bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Division Analytics</span>
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight text-white">
                Department Performance &amp; Progress Rates
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Curriculum completion index and earned credentials across divisions
              </p>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.departmentStats} margin={{ top: 10, right: 20, left: -15, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#262837' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#262837' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161720',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="avgProgress" name="Avg Completion Progress (%)" fill="#c2f866" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completedCerts" name="Certified Credentials" fill="#38e1b0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Right: Skill Gap Distribution */}
        <section className="lg:col-span-5 bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Target Vectors</span>
            </div>
            <h3 className="font-display text-xl font-bold tracking-tight text-white">
              Organizational Skill Gap Stats
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 mb-6">
              Targeted capability gaps across enterprise workforce
            </p>

            <div className="space-y-4">
              {analytics.skillGaps.map((item) => (
                <div key={item.skill} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      {item.skill}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-[11px]">
                        {item.current}% / {item.target}%
                      </span>
                      {item.gap > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                          -{item.gap}% Gap
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
                          Target Met
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-[#242735] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.gap === 0 ? 'bg-[#c2f866]' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${item.current}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Catalog & User Governance Table */}
      <section className="bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl text-white">
        <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              Course Catalog Governance
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage curricula, view enrolled students, and inspect assessment pass thresholds
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={onOpenCreateCourse}
            className="px-5 py-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-lime-500/20 cursor-pointer macos-button"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161720] text-zinc-400 font-bold border-b border-white/5 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Course Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Difficulty</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">Enrolled</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-white/[0.03] transition">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white line-clamp-1">
                      {course.title}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Instructor: {course.instructorName}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-zinc-300">
                      {course.category}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        course.difficulty === 'Beginner'
                          ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                          : course.difficulty === 'Intermediate'
                          ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20'
                          : 'bg-purple-400/10 text-purple-300 border border-purple-400/20'
                      }`}
                    >
                      {course.difficulty}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-zinc-400">
                    {course.durationHours} hrs ({course.modules.length} mods)
                  </td>

                  <td className="py-4 px-6 text-white font-bold">
                    {course.enrolledCount || 0}
                  </td>

                  <td className="py-4 px-6 text-amber-400 font-bold">
                    ★ {course.rating}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onNavigateTab('courses')}
                      className="px-3 py-1 text-[#c2f866] hover:text-black hover:bg-[#c2f866] font-bold rounded-full transition border border-[#c2f866]/30 macos-button"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
