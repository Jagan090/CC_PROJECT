import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  RotateCcw,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Course, Certificate } from '../../types';

interface QuizModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onCertificateEarned: (cert: Certificate) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  course,
  isOpen,
  onClose,
  onCertificateEarned
}) => {
  const { currentUser, refreshAppData } = useAuth();
  const quiz = course.quiz;

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [passed, setPassed] = React.useState(false);
  const [earnedCert, setEarnedCert] = React.useState<Certificate | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Initialize selected answers array
  React.useEffect(() => {
    if (quiz) {
      setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
      setCurrentQuestionIndex(0);
      setIsSubmitted(false);
      setEarnedCert(null);
    }
  }, [quiz, isOpen]);

  if (!isOpen || !quiz) return null;

  const currentQ = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const isAllAnswered = selectedAnswers.every((ans) => ans !== -1);

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optIndex;
    setSelectedAnswers(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Calculate score
      let correctCount = 0;
      quiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });

      const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
      const isPass = calculatedScore >= quiz.passingScore;
      setScore(calculatedScore);
      setPassed(isPass);
      setIsSubmitted(true);

      // Persist results & update skill competency
      const res = await dataService.submitQuiz(
        currentUser.id,
        course.id,
        quiz.id,
        selectedAnswers,
        calculatedScore
      );

      refreshAppData();

      if (res.passed && res.certificate) {
        setEarnedCert(res.certificate);
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers(new Array(totalQuestions).fill(-1));
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setEarnedCert(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        id="quiz-modal-card"
        className="frosted-glass-modal rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-white"
      >
        {/* Header */}
        <div className="p-5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
                Exam Benchmark
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                Pass Threshold: {quiz.passingScore}%
              </span>
            </div>
            <h2 className="font-display text-base sm:text-lg font-bold text-white mt-1">
              {quiz.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin">
          {!isSubmitted ? (
            <>
              {/* Question Stepper */}
              <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/5 pb-3">
                <span className="font-bold text-white">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <div className="flex items-center gap-1.5">
                  {quiz.questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-7 h-7 rounded-full text-[11px] font-extrabold transition flex items-center justify-center cursor-pointer ${
                        currentQuestionIndex === idx
                          ? 'bg-[#c2f866] text-black shadow-md shadow-lime-500/20'
                          : selectedAnswers[idx] !== -1
                          ? 'bg-[#222433] text-[#c2f866] border border-[#c2f866]/30'
                          : 'bg-[#181922] text-zinc-500 hover:bg-[#20222f] hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Question & Options */}
              <div className="space-y-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                  {currentQ.question}
                </h3>

                <div className="space-y-3">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    return (
                      <motion.button
                        key={optIdx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition flex items-start gap-3.5 cursor-pointer macos-card ${
                          isSelected
                            ? 'border-[#c2f866] bg-[#1a1c24] text-white shadow-lg shadow-lime-500/10'
                            : 'border-white/5 hover:border-white/20 bg-[#161720] text-zinc-300'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-[#c2f866] bg-[#c2f866] text-black'
                              : 'border-white/20 text-zinc-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Result Screen */
            <div className="text-center py-4 space-y-6 animate-in fade-in">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-xl ${
                  passed
                    ? 'bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/30 shadow-lime-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}
              >
                {passed ? (
                  <Award className="w-10 h-10" />
                ) : (
                  <AlertTriangle className="w-10 h-10" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {passed ? 'Assessment Passed with Honors!' : 'Assessment Not Passed'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  {passed
                    ? `You achieved ${score}%, exceeding the required ${quiz.passingScore}% passing score. Your competency benchmark has been elevated.`
                    : `You scored ${score}%, which is below the ${quiz.passingScore}% passing score. Review the explanations below and re-attempt.`}
                </p>
              </div>

              {/* Score pill */}
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-[#161722] border border-white/5 text-xs shadow-xl">
                <div>
                  <span className="text-zinc-500 font-semibold block">Your Score</span>
                  <span className={`font-display text-2xl font-black ${passed ? 'text-[#c2f866]' : 'text-red-400'}`}>
                    {score}%
                  </span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <span className="text-zinc-500 font-semibold block">Skill Proficiency Gain</span>
                  <span className="font-display text-2xl font-black text-cyan-400">
                    +{passed ? quiz.skillBoostPoints : 0}%
                  </span>
                </div>
              </div>

              {/* Question Review Breakdown */}
              <div className="text-left space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Detailed Question Review
                </h4>
                {quiz.questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-white">
                          {idx + 1}. {q.question}
                        </span>
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-[#c2f866] shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                      </div>

                      <div className="text-zinc-400 space-y-1">
                        <div>
                          Your answer:{' '}
                          <strong className={isCorrect ? 'text-[#c2f866]' : 'text-red-400'}>
                            {userAns !== -1 ? q.options[userAns] : 'Not answered'}
                          </strong>
                        </div>
                        {!isCorrect && (
                          <div className="text-[#c2f866]">
                            Correct answer: <strong>{q.options[q.correctIndex]}</strong>
                          </div>
                        )}
                        <p className="text-[11px] text-zinc-500 pt-1 italic">
                          Explanation: {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-[#161722] border-t border-white/5 flex items-center justify-between shrink-0">
          {!isSubmitted ? (
            <>
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    className="px-5 py-2.5 bg-[#252836] hover:bg-[#2d3043] text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer macos-button"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    id="submit-quiz-assessment-btn"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-lime-500/20 cursor-pointer macos-button"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submitting ? 'Calculating Score...' : 'Submit Assessment'}</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRetry}
                className="px-4 py-2 text-white bg-[#1e2029] border border-white/10 hover:bg-[#282a36] rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer macos-button"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Exam</span>
              </button>

              {passed && earnedCert ? (
                <button
                  id="view-earned-certificate-btn"
                  onClick={() => {
                    onCertificateEarned(earnedCert);
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-lime-500/20 cursor-pointer macos-button"
                >
                  <Award className="w-4 h-4" />
                  <span>View &amp; Print Certificate</span>
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#252836] text-white rounded-full text-xs font-bold hover:bg-[#303345] transition cursor-pointer macos-button"
                >
                  Close Review
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
