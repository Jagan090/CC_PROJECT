import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, isFirebaseReady } from '../lib/firebase';
import {
  Course,
  CourseEnrollment,
  AssessmentResult,
  Certificate,
  SkillCompetency,
  UserSkillProficiency,
  KnowledgeArticle,
  NotificationItem,
  ActivityLog,
  UserProfile
} from '../types';
import {
  SEED_COURSES,
  SEED_USERS,
  SEED_SKILLS,
  SEED_ENROLLMENTS,
  SEED_CERTIFICATES,
  SEED_ARTICLES,
  SEED_NOTIFICATIONS,
  SEED_ACTIVITIES,
  SEED_USER_SKILLS
} from '../data/seedData';

// Local cache keys for instant offline-first rendering & fallbacks
const STORAGE_KEYS = {
  COURSES: 'capconnect_courses',
  USERS: 'capconnect_users',
  ENROLLMENTS: 'capconnect_enrollments',
  CERTIFICATES: 'capconnect_certificates',
  USER_SKILLS: 'capconnect_user_skills',
  ARTICLES: 'capconnect_articles',
  NOTIFICATIONS: 'capconnect_notifications',
  ACTIVITIES: 'capconnect_activities',
  ASSESSMENTS: 'capconnect_assessments',
  SEEDED: 'capconnect_is_seeded'
};

// Helper for local storage
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage set failed', e);
  }
}

// In-memory runtime data initialized from LocalStorage or Seeds
class DataService {
  private courses: Course[] = [];
  private users: UserProfile[] = [];
  private enrollments: CourseEnrollment[] = [];
  private certificates: Certificate[] = [];
  private userSkills: Record<string, UserSkillProficiency[]> = {};
  private articles: KnowledgeArticle[] = [];
  private notifications: NotificationItem[] = [];
  private activities: ActivityLog[] = [];
  private assessments: AssessmentResult[] = [];
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    // First load from local storage or seeds for instant UI paint
    this.courses = getLocal<Course[]>(STORAGE_KEYS.COURSES, SEED_COURSES);
    this.users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, SEED_USERS);
    this.enrollments = getLocal<CourseEnrollment[]>(STORAGE_KEYS.ENROLLMENTS, SEED_ENROLLMENTS);
    this.certificates = getLocal<Certificate[]>(STORAGE_KEYS.CERTIFICATES, SEED_CERTIFICATES);
    this.userSkills = getLocal<Record<string, UserSkillProficiency[]>>(STORAGE_KEYS.USER_SKILLS, SEED_USER_SKILLS);
    this.articles = getLocal<KnowledgeArticle[]>(STORAGE_KEYS.ARTICLES, SEED_ARTICLES);
    this.notifications = getLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    this.activities = getLocal<ActivityLog[]>(STORAGE_KEYS.ACTIVITIES, SEED_ACTIVITIES);
    this.assessments = getLocal<AssessmentResult[]>(STORAGE_KEYS.ASSESSMENTS, []);

    // Ensure migration of any legacy cached user name
    let usersUpdated = false;
    this.users = this.users.map((u) => {
      if (u.id === 'usr-emp-1' || u.name === 'Alex Morgan') {
        usersUpdated = true;
        return {
          ...u,
          name: 'Jagan Sakthivel',
          email: 'jagansakthi45@gmail.com'
        };
      }
      return u;
    });
    if (usersUpdated) {
      setLocal(STORAGE_KEYS.USERS, this.users);
    }

    let certsUpdated = false;
    this.certificates = this.certificates.map((c) => {
      if (c.userId === 'usr-emp-1' || c.userName === 'Alex Morgan') {
        certsUpdated = true;
        return { ...c, userName: 'Jagan Sakthivel' };
      }
      return c;
    });
    if (certsUpdated) {
      setLocal(STORAGE_KEYS.CERTIFICATES, this.certificates);
    }

    let activitiesUpdated = false;
    this.activities = this.activities.map((a) => {
      if (a.userId === 'usr-emp-1' || a.userName === 'Alex Morgan') {
        activitiesUpdated = true;
        return { ...a, userName: 'Jagan Sakthivel' };
      }
      return a;
    });
    if (activitiesUpdated) {
      setLocal(STORAGE_KEYS.ACTIVITIES, this.activities);
    }

    // If Firestore is available, attempt sync or seed in background
    if (isFirebaseReady) {
      this.syncWithFirestore().catch((err) => {
        console.warn('Firestore initial sync skipped or offline:', err);
      });
    }

    this.initialized = true;
  }

  private async syncWithFirestore(): Promise<void> {
    try {
      const coursesCol = collection(db, 'courses');
      const snap = await getDocs(coursesCol);

      if (snap.empty) {
        // Seed Firestore
        console.log('Populating Firestore with realistic seed data...');
        for (const course of SEED_COURSES) {
          await setDoc(doc(db, 'courses', course.id), course);
        }
        for (const user of SEED_USERS) {
          await setDoc(doc(db, 'users', user.id), user);
        }
        for (const enr of SEED_ENROLLMENTS) {
          await setDoc(doc(db, 'enrollments', enr.id), enr);
        }
        for (const cert of SEED_CERTIFICATES) {
          await setDoc(doc(db, 'certificates', cert.id), cert);
        }
        for (const art of SEED_ARTICLES) {
          await setDoc(doc(db, 'articles', art.id), art);
        }
      } else {
        // Fetch fresh data from Firestore
        const fetchedCourses: Course[] = [];
        snap.forEach((d) => fetchedCourses.push(d.data() as Course));
        if (fetchedCourses.length > 0) {
          this.courses = fetchedCourses;
          setLocal(STORAGE_KEYS.COURSES, this.courses);
        }

        // Fetch enrollments
        try {
          const enrSnap = await getDocs(collection(db, 'enrollments'));
          const fetchedEnr: CourseEnrollment[] = [];
          enrSnap.forEach((d) => fetchedEnr.push(d.data() as CourseEnrollment));
          if (fetchedEnr.length > 0) {
            this.enrollments = fetchedEnr;
            setLocal(STORAGE_KEYS.ENROLLMENTS, this.enrollments);
          }
        } catch (e) {
          // ignore
        }
        // Ensure user usr-emp-1 is synced with Jagan Sakthivel
        try {
          const emp1 = this.users.find((u) => u.id === 'usr-emp-1');
          if (emp1) {
            await setDoc(doc(db, 'users', 'usr-emp-1'), emp1, { merge: true });
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.warn('Firestore sync note:', err);
    }
  }

  // --- Users ---
  getUsers(): UserProfile[] {
    return this.users;
  }

  getUser(id: string): UserProfile | undefined {
    return this.users.find((u) => u.id === id);
  }

  getTeamMembers(managerId: string): UserProfile[] {
    return this.users.filter((u) => u.managerId === managerId || u.role === 'employee');
  }

  // --- Courses ---
  getCourses(): Course[] {
    return this.courses;
  }

  getCourse(id: string): Course | undefined {
    return this.courses.find((c) => c.id === id);
  }

  async addCourse(newCourse: Course): Promise<Course> {
    this.courses.unshift(newCourse);
    setLocal(STORAGE_KEYS.COURSES, this.courses);

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'courses', newCourse.id), newCourse);
      } catch (err) {
        console.warn('Firestore addCourse failed', err);
      }
    }

    this.logActivity({
      id: 'act-' + Date.now(),
      userId: newCourse.instructorId,
      userName: newCourse.instructorName,
      userRole: 'trainer',
      action: 'Published New Course',
      detail: `Published "${newCourse.title}" in ${newCourse.category}`,
      timestamp: 'Just now',
      iconType: 'complete'
    });

    return newCourse;
  }

  // --- Enrollments ---
  getUserEnrollments(userId: string): CourseEnrollment[] {
    return this.enrollments.filter((e) => e.userId === userId);
  }

  getEnrollment(userId: string, courseId: string): CourseEnrollment | undefined {
    return this.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
  }

  async enrollCourse(userId: string, courseId: string): Promise<CourseEnrollment> {
    const existing = this.getEnrollment(userId, courseId);
    if (existing) return existing;

    const course = this.getCourse(courseId);
    const user = this.getUser(userId);

    const enrollment: CourseEnrollment = {
      id: `enr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString().split('T')[0],
      completedModuleIds: [],
      progressPercent: 0,
      status: 'in_progress',
      lastAccessedAt: new Date().toISOString()
    };

    this.enrollments.push(enrollment);
    setLocal(STORAGE_KEYS.ENROLLMENTS, this.enrollments);

    // Update course enrolled count
    if (course) {
      course.enrolledCount = (course.enrolledCount || 0) + 1;
      setLocal(STORAGE_KEYS.COURSES, this.courses);
    }

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'enrollments', enrollment.id), enrollment);
        if (course) {
          await updateDoc(doc(db, 'courses', course.id), { enrolledCount: course.enrolledCount });
        }
      } catch (e) {
        console.warn('Firestore enroll error', e);
      }
    }

    if (user && course) {
      this.logActivity({
        id: 'act-' + Date.now(),
        userId,
        userName: user.name,
        userRole: user.role,
        action: 'Enrolled in Course',
        detail: `Started "${course.title}"`,
        timestamp: 'Just now',
        iconType: 'enroll'
      });
    }

    return enrollment;
  }

  async completeModule(userId: string, courseId: string, moduleId: string): Promise<CourseEnrollment> {
    let enr = this.getEnrollment(userId, courseId);
    if (!enr) {
      enr = await this.enrollCourse(userId, courseId);
    }

    const course = this.getCourse(courseId);
    if (!course) return enr;

    if (!enr.completedModuleIds.includes(moduleId)) {
      enr.completedModuleIds.push(moduleId);
    }

    const totalModules = course.modules.length;
    enr.progressPercent = Math.round((enr.completedModuleIds.length / totalModules) * 100);
    enr.lastAccessedAt = new Date().toISOString();

    if (enr.progressPercent >= 100 && enr.status !== 'completed') {
      enr.status = 'completed';
      enr.completedAt = new Date().toISOString().split('T')[0];
    }

    setLocal(STORAGE_KEYS.ENROLLMENTS, this.enrollments);

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'enrollments', enr.id), enr);
      } catch (e) {
        console.warn('Firestore completeModule update failed', e);
      }
    }

    const user = this.getUser(userId);
    const mod = course.modules.find((m) => m.id === moduleId);
    if (user && mod) {
      this.logActivity({
        id: 'act-' + Date.now(),
        userId,
        userName: user.name,
        userRole: user.role,
        action: 'Completed Module',
        detail: `Completed "${mod.title}" in ${course.title}`,
        timestamp: 'Just now',
        iconType: 'complete'
      });
    }

    return enr;
  }

  // --- Quizzes, Assessments & Competency Updates ---
  async submitQuiz(
    userId: string,
    courseId: string,
    quizId: string,
    userAnswers: number[],
    score: number
  ): Promise<{ passed: boolean; certificate?: Certificate; score: number }> {
    const course = this.getCourse(courseId);
    if (!course) throw new Error('Course not found');

    const passed = score >= course.quiz.passingScore;
    const user = this.getUser(userId);

    const assessmentResult: AssessmentResult = {
      id: `ass-${Date.now()}`,
      userId,
      courseId,
      quizId,
      courseTitle: course.title,
      score,
      passed,
      attemptedAt: new Date().toISOString(),
      userAnswers,
      skillIdUpdated: course.quiz.targetSkillId,
      skillScoreGained: passed ? course.quiz.skillBoostPoints : 0
    };

    this.assessments.push(assessmentResult);
    setLocal(STORAGE_KEYS.ASSESSMENTS, this.assessments);

    // If passed, mark course completed and boost competency!
    let certificate: Certificate | undefined;
    if (passed) {
      // Complete all modules in enrollment
      let enr = this.getEnrollment(userId, courseId);
      if (!enr) {
        enr = await this.enrollCourse(userId, courseId);
      }
      enr.completedModuleIds = course.modules.map((m) => m.id);
      enr.progressPercent = 100;
      enr.status = 'completed';
      enr.completedAt = new Date().toISOString().split('T')[0];
      setLocal(STORAGE_KEYS.ENROLLMENTS, this.enrollments);

      // Boost skill proficiency
      if (course.quiz.targetSkillId) {
        this.boostSkillProficiency(userId, course.quiz.targetSkillId, course.quiz.skillBoostPoints);
      }

      // Generate Certificate
      certificate = await this.issueCertificate(userId, course, score);

      // Trigger notification
      this.addNotification({
        id: 'notif-' + Date.now(),
        userId,
        title: 'Assessment Passed! 🎉',
        message: `You scored ${score}% on "${course.quiz.title}" and earned your verified certificate!`,
        type: 'certificate',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: 'certificates'
      });
    } else {
      this.addNotification({
        id: 'notif-' + Date.now(),
        userId,
        title: 'Assessment Result',
        message: `You scored ${score}% on "${course.quiz.title}". Review course modules and retry to earn certification.`,
        type: 'assessment',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: 'courses'
      });
    }

    if (user) {
      this.logActivity({
        id: 'act-' + Date.now(),
        userId,
        userName: user.name,
        userRole: user.role,
        action: passed ? 'Passed Quiz with Distinction' : 'Attempted Quiz',
        detail: `Scored ${score}% on "${course.quiz.title}"`,
        timestamp: 'Just now',
        iconType: passed ? 'quiz' : 'complete'
      });
    }

    return { passed, certificate, score };
  }

  // --- Skills & Competencies ---
  getUserSkills(userId: string): UserSkillProficiency[] {
    // If not exists for this user, clone default from SEED_USER_SKILLS or seed default
    if (!this.userSkills[userId]) {
      const base = SEED_USER_SKILLS['usr-emp-1'] || [];
      this.userSkills[userId] = base.map((s) => ({
        ...s,
        currentProficiency: Math.max(30, s.currentProficiency - Math.floor(Math.random() * 15)),
        gap: Math.max(0, s.targetProficiency - s.currentProficiency)
      }));
      setLocal(STORAGE_KEYS.USER_SKILLS, this.userSkills);
    }
    return this.userSkills[userId];
  }

  boostSkillProficiency(userId: string, skillId: string, points: number): void {
    const skills = this.getUserSkills(userId);
    const target = skills.find((s) => s.skillId === skillId);
    if (target) {
      target.currentProficiency = Math.min(100, target.currentProficiency + points);
      target.gap = Math.max(0, target.targetProficiency - target.currentProficiency);
      target.lastAssessedAt = new Date().toISOString().split('T')[0];
      setLocal(STORAGE_KEYS.USER_SKILLS, this.userSkills);
    }
  }

  // --- Certificates ---
  getUserCertificates(userId: string): Certificate[] {
    return this.certificates.filter((c) => c.userId === userId);
  }

  getAllCertificates(): Certificate[] {
    return this.certificates;
  }

  async issueCertificate(userId: string, course: Course, score: number): Promise<Certificate> {
    const user = this.getUser(userId);
    const existing = this.certificates.find((c) => c.userId === userId && c.courseId === course.id);
    if (existing) {
      existing.finalScore = Math.max(existing.finalScore, score);
      setLocal(STORAGE_KEYS.CERTIFICATES, this.certificates);
      return existing;
    }

    const certNum = `CAP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const cert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      userId,
      userName: user ? user.name : 'Learner',
      courseId: course.id,
      courseTitle: course.title,
      instructorName: course.instructorName,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      verificationHash: `hash-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`,
      finalScore: score
    };

    this.certificates.unshift(cert);
    setLocal(STORAGE_KEYS.CERTIFICATES, this.certificates);

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'certificates', cert.id), cert);
      } catch (e) {
        console.warn('Firestore cert write failed', e);
      }
    }

    return cert;
  }

  // --- Knowledge Hub ---
  getArticles(): KnowledgeArticle[] {
    return this.articles;
  }

  // --- Notifications ---
  getUserNotifications(userId: string): NotificationItem[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  markNotificationAsRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      setLocal(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    }
  }

  addNotification(notif: NotificationItem): void {
    this.notifications.unshift(notif);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  // --- Activity Feed ---
  getActivities(): ActivityLog[] {
    return this.activities;
  }

  logActivity(act: ActivityLog): void {
    this.activities.unshift(act);
    if (this.activities.length > 50) {
      this.activities.pop();
    }
    setLocal(STORAGE_KEYS.ACTIVITIES, this.activities);
  }

  // --- Manager / Admin Assignment ---
  async assignCourse(managerId: string, employeeId: string, courseId: string): Promise<void> {
    const emp = this.getUser(employeeId);
    const mgr = this.getUser(managerId);
    const course = this.getCourse(courseId);
    if (!emp || !course) return;

    await this.enrollCourse(employeeId, courseId);

    this.addNotification({
      id: 'notif-' + Date.now(),
      userId: employeeId,
      title: 'Training Assignment 📋',
      message: `${mgr ? mgr.name : 'Your Manager'} assigned you "${course.title}". Targeted deadline is within 14 days.`,
      type: 'assignment',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: 'courses'
    });

    this.logActivity({
      id: 'act-' + Date.now(),
      userId: managerId,
      userName: mgr ? mgr.name : 'Manager',
      userRole: mgr ? mgr.role : 'manager',
      action: 'Assigned Course',
      detail: `Assigned "${course.title}" to ${emp.name}`,
      timestamp: 'Just now',
      iconType: 'assign'
    });
  }

  // --- Computed Analytics for Admin & Manager ---
  getAnalyticsOverview() {
    const totalEmployees = this.users.filter((u) => u.role === 'employee').length;
    const activeLearners = new Set(this.enrollments.map((e) => e.userId)).size;
    const totalCourses = this.courses.length;
    
    const completedCount = this.enrollments.filter((e) => e.status === 'completed').length;
    const totalEnrollmentsCount = this.enrollments.length || 1;
    const completionRate = Math.round((completedCount / totalEnrollmentsCount) * 100);

    const assessmentsList = this.assessments;
    const avgScore = assessmentsList.length > 0
      ? Math.round(assessmentsList.reduce((acc, curr) => acc + curr.score, 0) / assessmentsList.length)
      : 84; // realistic baseline if none attempted yet

    // Department breakdown
    const departmentStats = [
      { name: 'Platform Eng', employees: 8, avgProgress: 76, completedCerts: 14 },
      { name: 'Data & AI', employees: 6, avgProgress: 68, completedCerts: 9 },
      { name: 'Cybersecurity', employees: 5, avgProgress: 82, completedCerts: 11 },
      { name: 'Product & Agile', employees: 7, avgProgress: 90, completedCerts: 18 }
    ];

    // Skill Gap Distribution
    const skillGaps = [
      { skill: 'Cloud Infra', target: 85, current: 72, gap: 13 },
      { skill: 'Kubernetes', target: 80, current: 65, gap: 15 },
      { skill: 'Generative AI', target: 75, current: 48, gap: 27 },
      { skill: 'Cybersecurity', target: 80, current: 76, gap: 4 },
      { skill: 'Agile Delivery', target: 75, current: 78, gap: 0 },
      { skill: 'Real-Time Data', target: 70, current: 52, gap: 18 }
    ];

    return {
      totalEmployees,
      activeLearners,
      totalCourses,
      completionRate,
      avgAssessmentScore: avgScore,
      departmentStats,
      skillGaps
    };
  }
}

export const dataService = new DataService();
