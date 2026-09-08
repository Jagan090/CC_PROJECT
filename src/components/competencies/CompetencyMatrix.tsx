import React from 'react';
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { UserSkillProficiency, Course } from '../../types';

interface CompetencyMatrixProps {
  onSelectCourseById: (courseId: string) => void;
}

export const CompetencyMatrix: React.FC<CompetencyMatrixProps> = ({
  onSelectCourseById
}) => {
  const { currentUser, dataVersion } = useAuth();
  const [skills, setSkills] = React.useState<UserSkillProficiency[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [viewMode, setViewMode] = React.useState<'radar' | 'bar'>('radar');

  React.useEffect(() => {
    setSkills(dataService.getUserSkills(currentUser.id));
    setCourses(dataService.getCourses());
  }, [currentUser.id, dataVersion]);

  // Overall benchmark comparison
  const avgCurrent = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => acc + s.currentProficiency, 0) / skills.length)
    : 0;

  const avgTarget = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => acc + s.targetProficiency, 0) / skills.length)
    : 80;

  const totalGaps = skills.filter((s) => s.gap > 0).length;

  const chartData = skills.map((s) => ({
    name: s.skillName.split(' ')[0] + ' ' + (s.skillName.split(' ')[1] || ''),
    fullName: s.skillName,
    Actual: s.currentProficiency,
    Target: s.targetProficiency,
    Gap: s.gap
  }));

  // Find course for each skill
  const getCourseForSkill = (skillId: string) => {
    return courses.find((c) => c.targetSkills.includes(skillId));
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Competency Profile &amp; Skill-Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Dynamic capability mapping evaluating current engineering proficiencies against organizational benchmarks.
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-1 bg-[#191a22] p-1.5 rounded-full border border-white/5 self-start sm:self-auto">
          <button
            id="competency-view-radar-btn"
            onClick={() => setViewMode('radar')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              viewMode === 'radar'
                ? 'bg-[#c2f866] text-black shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Radar View
          </button>
          <button
            id="competency-view-bar-btn"
            onClick={() => setViewMode('bar')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              viewMode === 'bar'
                ? 'bg-[#c2f866] text-black shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Bar View
          </button>
        </div>
      </div>

      {/* Profile Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#121318] p-6 rounded-[28px] border border-white/5 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Current Aggregate Score
            </div>
            <div className="font-display text-3xl font-extrabold text-white mt-1">
              {avgCurrent}%
            </div>
            <div className="text-xs text-[#c2f866] font-medium mt-1">
              Target Benchmark: {avgTarget}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121318] p-6 rounded-[28px] border border-white/5 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Identified Skill Gaps
            </div>
            <div className="font-display text-3xl font-extrabold text-white mt-1">
              {totalGaps} Areas
            </div>
            <div className="text-xs text-red-400 font-medium mt-1">
              Requires training focus
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121318] p-6 rounded-[28px] border border-white/5 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Mastered Capabilities
            </div>
            <div className="font-display text-3xl font-extrabold text-white mt-1">
              {skills.filter((s) => s.gap === 0).length} Skills
            </div>
            <div className="text-xs text-emerald-400 font-medium mt-1">
              Exceeding role targets
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-[#121318] rounded-[32px] border border-white/5 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
              {viewMode === 'radar' ? 'Comparative Radar Alignment' : 'Proficiency vs. Benchmark Gap'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Visual delta between your verified assessment scores and role requirements
            </p>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'radar' ? (
              <RadarChart data={chartData}>
                <PolarGrid stroke="#262835" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar
                  name="Role Target Benchmark"
                  dataKey="Target"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.2}
                />
                <Radar
                  name="Your Verified Proficiency"
                  dataKey="Actual"
                  stroke="#c2f866"
                  fill="#c2f866"
                  fillOpacity={0.45}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181922',
                    borderColor: '#374151',
                    borderRadius: '12px',
                    color: '#ffffff'
                  }}
                />
              </RadarChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181922',
                    borderColor: '#374151',
                    borderRadius: '12px',
                    color: '#ffffff'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Actual" name="Actual Proficiency (%)" fill="#c2f866" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Target" name="Role Target (%)" fill="#3f4557" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Skill Breakdown Table */}
      <div className="bg-[#121318] rounded-[32px] border border-white/5 overflow-hidden shadow-xl">
        <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
              Individual Skill Diagnostic &amp; Closure Pathways
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Launch targeted course curricula and certification quizzes to elevate proficiency scores
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171822] text-zinc-400 font-bold border-b border-white/5 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Skill / Competency</th>
                <th className="py-4 px-6">Domain Category</th>
                <th className="py-4 px-6">Proficiency Meter</th>
                <th className="py-4 px-6">Benchmark Gap</th>
                <th className="py-4 px-6 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {skills.map((skill) => {
                const targetCourse = getCourseForSkill(skill.skillId);
                const hasGap = skill.gap > 0;

                return (
                  <tr key={skill.skillId} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-xs">
                        {skill.skillName}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Assessed on {skill.lastAssessedAt}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 text-zinc-300 border border-white/10">
                        {skill.category}
                      </span>
                    </td>

                    <td className="py-4 px-6 w-56">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-white">
                            {skill.currentProficiency}%
                          </span>
                          <span className="text-zinc-400">
                            Target: {skill.targetProficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-[#1f202a] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              hasGap ? 'bg-cyan-400' : 'bg-[#c2f866]'
                            }`}
                            style={{ width: `${skill.currentProficiency}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {hasGap ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          -{skill.gap}% Deficit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Target Fulfilled
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {targetCourse ? (
                        <button
                          onClick={() => onSelectCourseById(targetCourse.id)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer ${
                            hasGap
                              ? 'bg-[#c2f866] hover:bg-[#b0f34c] text-black font-extrabold shadow-sm'
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                        >
                          <BookOpen className="w-3 h-3" />
                          {hasGap ? 'Close Gap' : 'Review Course'}
                        </button>
                      ) : (
                        <span className="text-zinc-500 italic">Curriculum in review</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
