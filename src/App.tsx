import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { ManagerDashboard } from './components/dashboard/ManagerDashboard';
import { TrainerDashboard } from './components/dashboard/TrainerDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { CourseCatalog } from './components/courses/CourseCatalog';
import { CoursePlayer } from './components/courses/CoursePlayer';
import { CompetencyMatrix } from './components/competencies/CompetencyMatrix';
import { AssessmentHub } from './components/assessments/AssessmentHub';
import { CertificateView } from './components/certificates/CertificateView';
import { KnowledgeHub } from './components/knowledge/KnowledgeHub';
import { AuthModal } from './components/auth/AuthModal';
import { QuizModal } from './components/assessments/QuizModal';
import { CreateCourseModal } from './components/modals/CreateCourseModal';
import { AssignCourseModal } from './components/modals/AssignCourseModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { Course, Certificate, UserProfile } from './types';
import { dataService } from './services/dataService';

function AppContent() {
  const { currentUser, currentRole, loading } = useAuth();

  // Navigation state
  const [activeTab, setActiveTab] = React.useState<string>('dashboard');
  const [selectedCourseForPlayer, setSelectedCourseForPlayer] = React.useState<Course | null>(null);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = React.useState<Course | null>(null);
  const [selectedCertificateForView, setSelectedCertificateForView] = React.useState<Certificate | null>(null);
  const [preselectedUserForAssign, setPreselectedUserForAssign] = React.useState<UserProfile | null>(null);

  // Modal visibility states
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = React.useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = React.useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = React.useState(false);

  // Sync role switch: when role changes, return to dashboard
  React.useEffect(() => {
    setActiveTab('dashboard');
    setSelectedCourseForPlayer(null);
  }, [currentRole]);

  // Handlers
  const handleLaunchQuiz = (course: Course) => {
    setSelectedCourseForQuiz(course);
    setIsQuizModalOpen(true);
  };

  const handleOpenAssignModal = (user?: UserProfile) => {
    setPreselectedUserForAssign(user || null);
    setIsAssignModalOpen(true);
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseForPlayer(course);
    setActiveTab('player');
  };

  const handleSelectCourseById = (courseId: string) => {
    const found = dataService.getCourse(courseId);
    if (found) {
      handleSelectCourse(found);
    } else {
      setActiveTab('courses');
    }
  };

  const handleCertificateEarned = (cert: Certificate) => {
    setSelectedCertificateForView(cert);
    setActiveTab('certificates');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
            Loading Capacity Connect...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0d] flex flex-col font-sans antialiased text-zinc-100 relative selection:bg-[#c2f866] selection:text-black overflow-x-hidden">
      {/* Ambient Luminous Mesh Background for Frosted Glass Refraction */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Top-Left Cyan & Electric Aura */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-cyan-500/10 blur-[140px]" />
        {/* Top-Right Lime Highlight Aura */}
        <div className="absolute top-12 -right-24 w-[480px] h-[480px] rounded-full bg-[#c2f866]/10 blur-[130px]" />
        {/* Center-Left Emerald Glow */}
        <div className="absolute top-[38%] -left-20 w-[420px] h-[420px] rounded-full bg-emerald-500/8 blur-[150px]" />
        {/* Center-Right Indigo Diffusion */}
        <div className="absolute top-[55%] -right-20 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[160px]" />
        {/* Bottom Ambient Glow */}
        <div className="absolute bottom-10 left-[25%] w-[600px] h-[350px] rounded-full bg-teal-500/8 blur-[150px]" />
      </div>

      {/* Top Navigation matching Screenshot 1 with Frosted Glass */}
      <Navbar
        activeTab={activeTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setSelectedCourseForPlayer(null);
        }}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Responsive Role-Aware Sidebar - Hidden on Dashboard for wide expansive Hero, visible on submodules */}
        {activeTab !== 'dashboard' && activeTab !== 'player' && (
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <Sidebar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  if (tab !== 'player') {
                    setSelectedCourseForPlayer(null);
                  }
                }}
                onOpenCreateCourse={() => setIsCreateCourseOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-16 md:pb-6 flex flex-col justify-between">
          {/* Mobile Bottom Navigation Bar */}
          <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#121318]/95 backdrop-blur-md border-t border-white/10 z-40 flex items-center justify-around py-2 px-1 text-[10px] font-bold text-zinc-400 shadow-2xl">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedCourseForPlayer(null);
              }}
              className={`p-2 flex flex-col items-center ${activeTab === 'dashboard' ? 'text-[#c2f866]' : 'hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('courses');
                setSelectedCourseForPlayer(null);
              }}
              className={`p-2 flex flex-col items-center ${activeTab === 'courses' ? 'text-[#c2f866]' : 'hover:text-white'}`}
            >
              Courses
            </button>
            <button
              onClick={() => {
                setActiveTab('competencies');
                setSelectedCourseForPlayer(null);
              }}
              className={`p-2 flex flex-col items-center ${activeTab === 'competencies' ? 'text-[#c2f866]' : 'hover:text-white'}`}
            >
              Skills
            </button>
            <button
              onClick={() => {
                setActiveTab('assessments');
                setSelectedCourseForPlayer(null);
              }}
              className={`p-2 flex flex-col items-center ${activeTab === 'assessments' ? 'text-[#c2f866]' : 'hover:text-white'}`}
            >
              Exams
            </button>
            <button
              onClick={() => {
                setActiveTab('certificates');
                setSelectedCourseForPlayer(null);
              }}
              className={`p-2 flex flex-col items-center ${activeTab === 'certificates' ? 'text-[#c2f866]' : 'hover:text-white'}`}
            >
              Certs
            </button>
          </div>

          {/* Tab Content Routing with macOS Fluid Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedCourseForPlayer?.id || '')}
              initial={{ opacity: 0, scale: 0.985, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: -8 }}
              transition={{
                duration: 0.32,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="flex-1 w-full"
            >
              {activeTab === 'dashboard' && (
                <>
                  {currentRole === 'employee' && (
                    <EmployeeDashboard
                      onSelectCourse={handleSelectCourse}
                      onLaunchQuiz={handleLaunchQuiz}
                      onNavigateTab={(tab) => {
                        setActiveTab(tab);
                        setSelectedCourseForPlayer(null);
                      }}
                    />
                  )}
                  {currentRole === 'manager' && (
                    <ManagerDashboard
                      onOpenAssignModal={handleOpenAssignModal}
                      onNavigateTab={(tab) => {
                        setActiveTab(tab);
                        setSelectedCourseForPlayer(null);
                      }}
                    />
                  )}
                  {currentRole === 'trainer' && (
                    <TrainerDashboard
                      onOpenCreateCourse={() => setIsCreateCourseOpen(true)}
                      onSelectCourse={handleSelectCourse}
                      onNavigateTab={(tab) => {
                        setActiveTab(tab);
                        setSelectedCourseForPlayer(null);
                      }}
                    />
                  )}
                  {currentRole === 'admin' && (
                    <AdminDashboard
                      onOpenCreateCourse={() => setIsCreateCourseOpen(true)}
                      onOpenAssignModal={() => handleOpenAssignModal()}
                      onNavigateTab={(tab) => {
                        setActiveTab(tab);
                        setSelectedCourseForPlayer(null);
                      }}
                    />
                  )}
                </>
              )}

              {activeTab === 'courses' && (
                <CourseCatalog
                  onSelectCourse={handleSelectCourse}
                  onLaunchQuiz={handleLaunchQuiz}
                  onOpenCreateCourse={() => setIsCreateCourseOpen(true)}
                />
              )}

              {activeTab === 'player' && selectedCourseForPlayer && (
                <CoursePlayer
                  course={selectedCourseForPlayer}
                  onBack={() => setActiveTab('courses')}
                  onLaunchQuiz={handleLaunchQuiz}
                />
              )}

              {activeTab === 'competencies' && (
                <CompetencyMatrix onSelectCourseById={handleSelectCourseById} />
              )}

              {activeTab === 'assessments' && (
                <AssessmentHub onLaunchQuiz={handleLaunchQuiz} />
              )}

              {activeTab === 'certificates' && (
                <CertificateView
                  selectedCertificate={selectedCertificateForView}
                  onBack={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'knowledge' && <KnowledgeHub />}
            </motion.div>
          </AnimatePresence>

          {/* Footer matching Screenshot 3 */}
          <Footer />
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {selectedCourseForQuiz && (
        <QuizModal
          course={selectedCourseForQuiz}
          isOpen={isQuizModalOpen}
          onClose={() => {
            setIsQuizModalOpen(false);
            setSelectedCourseForQuiz(null);
          }}
          onCertificateEarned={handleCertificateEarned}
        />
      )}

      <CreateCourseModal
        isOpen={isCreateCourseOpen}
        onClose={() => setIsCreateCourseOpen(false)}
      />

      <AssignCourseModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setPreselectedUserForAssign(null);
        }}
        preselectedUser={preselectedUserForAssign}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setSelectedCourseForPlayer(null);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
