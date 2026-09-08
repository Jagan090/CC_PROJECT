import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Target,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { UserProfile, Course, CourseEnrollment } from '../../types';

interface ManagerDashboardProps {
  onAssignCourse: (employee?: UserProfile) => void;
  onNavigateTab: (tab: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  onAssignCourse,
  onNavigateTab
}) => {
  const { currentUser, dataVersion } = useAuth();
  const [teamMembers, setTeamMembers] = React.useState<UserProfile[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);

  React.useEffect(() => {
    setTeamMembers(dataService.getTeamMembers(currentUser.id));
    setCourses(dataService.getCourses());
  }, [currentUser.id, dataVersion]);

  // Aggregate team members' skills and enrollments
  const teamOverview = teamMembers.map((member) => {
    const enrollments = dataService.getUserEnrollments(member.id);
    const completed = enrollments.filter((e) => e.status === 'completed').length;
    const skills = dataService.getUserSkills(member.id);
    const avgScore = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.currentProficiency, 0) / skills.length)
      : 70;
    const certs = dataService.getUserCertificates(member.id).length;
    const largestGap = [...skills].sort((a, b) => b.gap - a.gap)[0];

    return {
      member,
      enrolledCount: enrollments.length,
      completedCount: completed,
      avgScore,
      certsCount: certs,
      largestGap
    };
  });

  // Team competency gap comparison data for chart
  const teamCompetencyChartData = [
    { skill: 'Cloud Infra', target: 85, teamAvg: 68 },
    { skill: 'Kubernetes', target: 80, teamAvg: 60 },
    { skill: 'Generative AI', target: 75, teamAvg: 54 },
    { skill: 'Zero-Trust', target: 80, teamAvg: 72 },
    { skill: 'Agile Velocity', target: 75, teamAvg: 76 },
    { skill: 'Data Streaming', target: 70, teamAvg: 62 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Header Banner matching macOS Dark Luxury */}
      <section className="relative bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
              <Users className="w-3.5 h-3.5" />
              <span>Platform Engineering Division</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Manager Console: {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Oversee team competency profiles, track active training pipelines, and assign targeted courses to close critical departmental skill gaps.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            id="mgr-assign-training-hero-btn"
            onClick={() => onAssignCourse()}
            className="px-6 py-3.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-sm font-extrabold transition shadow-lg shadow-lime-500/20 flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer macos-button"
          >
            <Send className="w-4 h-4" />
            <span>Assign Training Course</span>
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
              Direct Reports
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
              {teamMembers.length} Engineers
            </div>
            <div className="text-xs text-[#c2f866] font-semibold mt-1">
              100% active in LMS
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#c2f866] flex items-center justify-center">
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
              Team Avg Proficiency
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
              67%
            </div>
            <div className="text-xs text-cyan-400 font-semibold mt-1">
              Target benchmark: 75%
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-6 rounded-[26px] border border-white/5 shadow-xl flex items-center justify-between macos-card"
        >
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Assigned Courses
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
              {teamOverview.reduce((acc, t) => acc + t.enrolledCount, 0)} Total
            </div>
            <div className="text-xs text-amber-400 font-semibold mt-1">
              4 pending completion
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#14151b] p-6 rounded-[26px] border border-white/5 shadow-xl flex items-center justify-between macos-card"
        >
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Team Certifications
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
              {teamOverview.reduce((acc, t) => acc + t.certsCount, 0)} Badges
            </div>
            <div className="text-xs text-[#c2f866] font-semibold mt-1">
              Quarterly goal: 8
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#c2f866] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Team Competency Gap Comparison Chart */}
      <section className="bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Benchmarks</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              Team Competency Benchmark vs. Current Average
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Identifies group-level deficiencies across key architectural capabilities
            </p>
          </div>
          <span className="text-xs font-bold text-[#c2f866] bg-[#c2f866]/10 px-3.5 py-1.5 rounded-full border border-[#c2f866]/20 self-start sm:self-auto">
            GenAI &amp; Kubernetes prioritized
          </span>
        </div>

        <div className="h-[300px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamCompetencyChartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <XAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#262837' }} />
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
              <Bar dataKey="target" name="Target Benchmark (%)" fill="#292c3a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="teamAvg" name="Current Team Average (%)" fill="#c2f866" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Team Members List */}
      <section className="bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl text-white">
        <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              Team Member Development Roster
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Live progress and individualized skill gap metrics for direct reports
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-400 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 self-start sm:self-auto">
            {teamOverview.length} Members Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161720] text-zinc-400 font-bold border-b border-white/5 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Engineer</th>
                <th className="py-4 px-6">Role / Title</th>
                <th className="py-4 px-6">Avg Competency</th>
                <th className="py-4 px-6">Primary Skill Gap</th>
                <th className="py-4 px-6">Course Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {teamOverview.map(({ member, avgScore, enrolledCount, completedCount, largestGap }) => (
                <tr key={member.id} className="hover:bg-white/[0.03] transition">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {member.email}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-zinc-300">
                    <div className="font-semibold text-white">{member.title}</div>
                    <div className="text-[11px] text-zinc-400">{member.department}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-20 bg-[#242735] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#c2f866] h-full rounded-full transition-all duration-500"
                          style={{ width: `${avgScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-white text-xs">{avgScore}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    {largestGap && largestGap.gap > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        <AlertTriangle className="w-3 h-3" />
                        -{largestGap.gap}% in {largestGap.skillName.split(' ')[0]}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Benchmarks Met
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-zinc-400">
                    <span className="font-bold text-white">{completedCount}</span> / {enrolledCount} Completed
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      id={`mgr-assign-btn-${member.id}`}
                      onClick={() => onAssignCourse(member)}
                      className="px-3.5 py-1.5 bg-[#252836] hover:bg-[#c2f866] hover:text-black text-white rounded-full text-xs font-bold transition inline-flex items-center gap-1.5 border border-white/5 macos-button"
                    >
                      <Send className="w-3 h-3" />
                      Assign Course
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
