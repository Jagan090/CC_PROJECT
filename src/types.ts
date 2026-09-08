export type UserRole = 'employee' | 'trainer' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  title: string;
  avatar: string;
  managerId?: string;
  joinedDate: string;
}

export interface CourseModule {
  id: string;
  title: string;
  durationMinutes: number;
  description: string;
  content: string;
  videoPlaceholderUrl?: string;
  resources?: { title: string; url: string; type: 'doc' | 'video' | 'link' }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseQuiz {
  id: string;
  courseId: string;
  title: string;
  passingScore: number; // e.g. 70 (%)
  questions: QuizQuestion[];
  targetSkillId: string;
  skillBoostPoints: number; // skill proficiency points gained on pass
}

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type CourseCategory = 
  | 'Cloud & DevOps'
  | 'AI & Machine Learning'
  | 'Cybersecurity & Governance'
  | 'Leadership & Agile'
  | 'Full-Stack Development'
  | 'Data Engineering';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  instructorRole: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  durationHours: number;
  thumbnailUrl?: string;
  modules: CourseModule[];
  quiz: CourseQuiz;
  targetSkills: string[]; // skill IDs
  enrolledCount: number;
  rating: number;
  createdAt: string;
  featured?: boolean;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedModuleIds: string[];
  progressPercent: number;
  status: 'in_progress' | 'completed';
  completedAt?: string;
  lastAccessedAt: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  courseId: string;
  quizId: string;
  courseTitle: string;
  score: number; // 0 - 100
  passed: boolean;
  attemptedAt: string;
  userAnswers: number[];
  skillIdUpdated?: string;
  skillScoreGained?: number;
}

export interface SkillCompetency {
  id: string;
  name: string;
  category: CourseCategory;
  description: string;
  targetProficiency: number; // e.g. 80 (%)
  recommendedCourseId?: string;
}

export interface UserSkillProficiency {
  skillId: string;
  skillName: string;
  category: CourseCategory;
  currentProficiency: number; // 0 - 100
  targetProficiency: number;
  gap: number; // target - current (positive means gap exists)
  lastAssessedAt: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  expiryDate?: string;
  verificationHash: string;
  finalScore: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  readTimeMinutes: number;
  tags: string[];
  publishedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'assessment' | 'certificate' | 'deadline' | 'announcement';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  detail: string;
  timestamp: string;
  iconType?: 'enroll' | 'complete' | 'quiz' | 'cert' | 'assign';
}
