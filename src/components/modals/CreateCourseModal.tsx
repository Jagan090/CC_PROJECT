import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  PlusCircle,
  BookOpen,
  Trash2,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Course, CourseCategory, CourseDifficulty } from '../../types';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, refreshAppData } = useAuth();

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<CourseCategory>('Cloud & DevOps');
  const [difficulty, setDifficulty] = React.useState<CourseDifficulty>('Intermediate');
  const [durationHours, setDurationHours] = React.useState<number>(10);
  const [thumbnailUrl, setThumbnailUrl] = React.useState(
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
  );

  // Modules
  const [modules, setModules] = React.useState([
    {
      id: 'mod-1',
      title: 'Module 1: Architecture Foundations & Core Tenets',
      description: 'Understanding enterprise architectural topology and design principles.',
      durationMinutes: 45,
      content: 'This module covers high-availability clustering, failover strategies, and microservice topology in mission-critical deployments.'
    }
  ]);

  // Quiz Question
  const [quizTitle, setQuizTitle] = React.useState('Technical Qualification Exam');
  const [quizQuestion, setQuizQuestion] = React.useState('What is the primary factor in configuring multi-region redundancy?');
  const [options, setOptions] = React.useState([
    'Replication latency and data consistency models',
    'Local client browser storage quotas',
    'Single-node CPU clock frequency',
    'Static file compression format'
  ]);
  const [correctIndex, setCorrectIndex] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleAddModule = () => {
    const nextIdx = modules.length + 1;
    setModules([
      ...modules,
      {
        id: `mod-${Date.now()}-${nextIdx}`,
        title: `Module ${nextIdx}: Advanced Enterprise Practices`,
        description: 'Applied architectural patterns and telemetry.',
        durationMinutes: 40,
        content: 'Exploration of latency budgets, SLO tracking, and circuit-breaker patterns for resilient cloud infrastructure.'
      }
    ]);
  };

  const handleRemoveModule = (index: number) => {
    if (modules.length <= 1) return;
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const newCourseId = `course-${Date.now()}`;
      const newCourse: Course = {
        id: newCourseId,
        title,
        description,
        category,
        difficulty,
        durationHours,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        instructorId: currentUser.id,
        instructorName: currentUser.name,
        instructorRole: 'Lead Instructor & Curriculum Specialist',
        targetSkills: ['skill-1', 'skill-2'],
        rating: 4.9,
        enrolledCount: 1,
        createdAt: new Date().toISOString(),
        modules: modules.map((m, i) => ({
          id: `${newCourseId}-m${i + 1}`,
          title: m.title,
          description: m.description,
          durationMinutes: m.durationMinutes,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          content: m.content
        })),
        quiz: {
          id: `quiz-${newCourseId}`,
          courseId: newCourseId,
          targetSkillId: 'skill-1',
          title: quizTitle || `${title} Certification Exam`,
          passingScore: 70,
          skillBoostPoints: 15,
          questions: [
            {
              id: `q-1`,
              question: quizQuestion,
              options: options,
              correctIndex: correctIndex,
              explanation: 'Enterprise distributed consensus requires factoring in cross-region replication latency guarantees.'
            }
          ]
        }
      };

      await dataService.addCourse(newCourse);
      refreshAppData();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        id="create-course-modal-card"
        className="frosted-glass-modal rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-white"
      >
        <div className="p-6 bg-white/[0.04] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c2f866]/10 border border-[#c2f866]/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-[#c2f866]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">Author New Enterprise Course</h3>
              <p className="text-xs text-zinc-400">
                Publish curriculum, modules, and assessment questions to the academy catalog
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

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs scrollbar-thin">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#c2f866] uppercase tracking-wider text-[11px]">
              1. Basic Course Specifications
            </h4>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1.5">
                Course Title
              </label>
              <input
                id="create-course-title-input"
                type="text"
                required
                placeholder="e.g. Distributed Systems & Kafka Stream Processing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#181924] border border-white/5 rounded-xl focus:outline-hidden focus:border-[#c2f866]/50 focus:ring-2 focus:ring-[#c2f866]/20 font-medium text-white placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1.5">
                Course Description &amp; Objectives
              </label>
              <textarea
                id="create-course-desc-input"
                required
                rows={2}
                placeholder="High-level summary of what engineers will learn and implement..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#181924] border border-white/5 rounded-xl focus:outline-hidden focus:border-[#c2f866]/50 focus:ring-2 focus:ring-[#c2f866]/20 font-medium text-white placeholder-zinc-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CourseCategory)}
                  className="w-full px-3 py-2 bg-[#181924] border border-white/5 rounded-xl text-white focus:outline-hidden"
                >
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Cybersecurity & Governance">Cybersecurity</option>
                  <option value="Leadership & Agile">Leadership & Agile</option>
                  <option value="Full-Stack Development">Full-Stack Dev</option>
                  <option value="Data Engineering">Data Engineering</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1.5">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as CourseDifficulty)}
                  className="w-full px-3 py-2 bg-[#181924] border border-white/5 rounded-xl text-white focus:outline-hidden"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1.5">Duration (Hours)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#181924] border border-white/5 rounded-xl text-white focus:outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* Modules section */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#c2f866] uppercase tracking-wider text-[11px]">
                2. Curriculum Modules ({modules.length})
              </h4>
              <button
                type="button"
                onClick={handleAddModule}
                className="text-[#c2f866] font-extrabold hover:underline flex items-center gap-1 text-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Module
              </button>
            </div>

            <div className="space-y-3">
              {modules.map((mod, idx) => (
                <div key={mod.id} className="p-3.5 bg-[#181924] border border-white/5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const copy = [...modules];
                        copy[idx].title = e.target.value;
                        setModules(copy);
                      }}
                      className="font-bold text-white bg-[#121318] border border-white/10 px-3 py-1.5 rounded-lg text-xs flex-1"
                      placeholder="Module Title"
                    />
                    {modules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveModule(idx)}
                        className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={mod.content}
                    onChange={(e) => {
                      const copy = [...modules];
                      copy[idx].content = e.target.value;
                      setModules(copy);
                    }}
                    placeholder="Module study notes & architectural material..."
                    className="w-full p-2.5 bg-[#121318] border border-white/10 rounded-lg text-xs text-zinc-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Quiz section */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h4 className="font-bold text-[#c2f866] uppercase tracking-wider text-[11px]">
              3. Verification Exam Question
            </h4>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1.5">
                Question Text
              </label>
              <input
                type="text"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                className="w-full px-3 py-2 bg-[#181924] border border-white/5 rounded-xl text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-zinc-300 block">
                Answer Options (select the correct radio)
              </label>
              {options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="correct-opt"
                    checked={correctIndex === oIdx}
                    onChange={() => setCorrectIndex(oIdx)}
                    className="text-[#c2f866] focus:ring-[#c2f866]"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const copy = [...options];
                      copy[oIdx] = e.target.value;
                      setOptions(copy);
                    }}
                    className="w-full px-3 py-1.5 bg-[#181924] border border-white/5 rounded-lg text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-create-course-btn"
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-lime-500/20 cursor-pointer macos-button"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Publishing Course...' : 'Publish Course'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
