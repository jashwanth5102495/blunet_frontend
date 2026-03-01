import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import React, { type ReactNode, Suspense, lazy } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import ClickSpark from './components/ClickSpark';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ProtectedLoginRoute, ProtectedCourseGate } from './components/AuthWrappers';

// Lazy load heavy components
const Hero = lazy(() => import('./components/Hero'));
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const TradingSection = lazy(() => import('./components/TradingSection'));
const TechnologiesCarousel = lazy(() => import('./components/TechnologiesCarousel'));
const HappyClients = lazy(() => import('./components/HappyClients'));
const StudentReviews = lazy(() => import('./components/StudentReviews'));
const IntroductionPage = lazy(() => import('./pages/IntroductionPage.jsx'));
const ModuleComingSoon = lazy(() => import('./pages/ModuleComingSoon.jsx'));
const CourseIntro = lazy(() => import('./pages/CourseIntro.jsx'));
const FrontendProjectPage = lazy(() => import('./components/FrontendProjectPage'));
const ProjectsCatalog = lazy(() => import('./components/ProjectsCatalog'));
const ProjectEnrollment = lazy(() => import('./components/ProjectEnrollment'));
const Footer = lazy(() => import('./components/Footer'));
const About = lazy(() => import('./components/About'));
const Career = lazy(() => import('./components/Career'));
const Contact = lazy(() => import('./components/Contact'));
const Courses = lazy(() => import('./components/Courses'));
const StudentRegistration = lazy(() => import('./components/StudentRegistration'));
const StudentLogin = lazy(() => import('./components/StudentLogin'));
const StudentPortal = lazy(() => import('./components/StudentPortal'));
const CreatorPortal = lazy(() => import('./components/CreatorPortal'));
const SecureAdminPanel = lazy(() => import('./components/SecureAdminPanel'));
const ProjectTracking = lazy(() => import('./components/ProjectTracking'));
const CourseLearning = lazy(() => import('./components/CourseLearning'));
const CourseLearningDevOpsBeginner = lazy(() => import('./components/CourseLearningDevOpsBeginner'));
const CourseLearningDevOpsAdvanced = lazy(() => import('./components/CourseLearningDevOpsAdvanced'));
const CourseLearningNetworkingBeginner = lazy(() => import('./components/CourseLearningNetworkingBeginner'));
const CourseLearningNetworkingIntermediate = lazy(() => import('./components/CourseLearningNetworkingIntermediate'));
const CourseLearningCyberSecurityBeginner = lazy(() => import('./components/CourseLearningCyberSecurityBeginner'));
const CourseLearningFrontendBeginner = lazy(() => import('./components/CourseLearningFrontendBeginner'));
const CourseLearningFrontendIntermediate = lazy(() => import('./components/CourseLearningFrontendIntermediate'));
const CourseLearningCyberSecurityIntermediate = lazy(() => import('./components/CourseLearningCyberSecurityIntermediate'));
const CourseLearningDataScienceBeginner = lazy(() => import('./components/CourseLearningDataScienceBeginner'));
const CourseEnrollment = lazy(() => import('./components/CourseEnrollment'));
const AssignmentPage = lazy(() => import('./components/AssignmentPage'));
const AIStudyMaterial = lazy(() => import('./components/AIStudyMaterial'));
const AIToolsProjectPage = lazy(() => import('./components/AIToolsProjectPage'));
const DevOpsProjectPage = lazy(() => import('./components/DevOpsProjectPage'));
const StudentSetup = lazy(() => import('./components/StudentSetup'));

// New lazy load
const IntroHtmlProtected = lazy(() => import('./components/IntroHtmlProtected'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error Boundary for Google OAuth
class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Google OAuth Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.children; // Fallback to children without provider if it fails
    }
    return this.props.children;
  }
}

// Wrapper components for routes
function CourseLearningProtected() {
  const params = useParams();
  const cid = params.courseId as string;
  if (!cid) return <Navigate to="/courses" replace />;
  return (
    <ProtectedCourseGate courseId={cid}>
      <CourseLearning />
    </ProtectedCourseGate>
  );
}

function AIStudyMaterialProtected() {
  // Primary course id for AI study material
  const requiredCourseId = 'AI-TOOLS-MASTERY';
  return (
    <ProtectedCourseGate courseId={requiredCourseId}>
      <AIStudyMaterial />
    </ProtectedCourseGate>
  );
}

function AppInner() {
  const location = useLocation();
  return (
      <ClickSpark 
        sparkColor="#60a5fa" 
        sparkCount={8} 
        sparkRadius={80} 
        duration={800}
        className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900 font-sans relative"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <section id="home">
                  <Hero />
                </section>
                <section id="services">
                  <ServicesSection />
                </section>
                <section id="career">
                  <TradingSection />
                </section>
  
                {/* <HappyClients /> */}
  
                <section id="contact">
                  <TechnologiesCarousel />
                </section>
  
                <Footer />
              </>
            } />
            <Route path="/about" element={<><Header /><About /></>} />
            <Route path="/career" element={<><Header /><Career /></>} />
            <Route path="/contact" element={<><Header /><Contact /></>} />
  
            <Route path="/projects" element={<><Header /><ProjectsCatalog /></>} />
            <Route path="/projects/enroll" element={<><Header /><ProjectEnrollment /></>} />
  
            <Route path="/courses" element={<><Header /><Courses /></>} />
            
            <Route path="/frontend-development-beginner" element={<><Header hideDock={true} /><CourseIntro courseSlug="frontend-development-beginner" /></>} />
            <Route
              path="/frontend-development-beginner/module/:slug"
              element={
                <ProtectedLoginRoute>
                  <><Header hideDock={true} /><CourseLearningFrontendBeginner /></>
                </ProtectedLoginRoute>
              }
            />
  
            <Route path="/frontend-development-intermediate" element={<><Header hideDock={true} /><CourseIntro courseSlug="frontend-development-intermediate" /></>} />
            <Route path="/new-frontend-development-intermediate" element={<Navigate to="/frontend-development-intermediate" replace />} />
            <Route path="/frontend-development-intermediate/module/:slug" element={<><Header hideDock={true} /><CourseLearningFrontendIntermediate /></>} />
            <Route path="/course-enrollment/:courseId" element={<CourseEnrollment />} />
            <Route path="/student-registration" element={<StudentRegistration />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/student-setup" element={<StudentSetup />} />
            <Route path="/student-portal" element={<StudentPortal />} />
            <Route path="/creator-portal" element={<><Header /><CreatorPortal /></>} />
            <Route path="/AJRV8328" element={<SecureAdminPanel />} />
            <Route path="/project-tracking" element={<><Header /><ProjectTracking /></>} />
            <Route path="/course-learning/:courseId/:moduleId/:lessonId" element={<CourseLearningProtected />} />
            <Route path="/course-learning" element={<ProtectedLoginRoute><CourseLearning /></ProtectedLoginRoute>} />
            <Route path="/course-learning-devops-beginner/:courseId/:moduleId/:lessonId" element={<CourseLearningDevOpsBeginner />} />
            <Route path="/course-learning-devops-beginner/*" element={<CourseLearningDevOpsBeginner />} />
            <Route path="/course-learning-devops-advanced/:courseId/:moduleId/:lessonId" element={<CourseLearningDevOpsAdvanced />} />
            <Route path="/course-learning-devops-advanced/*" element={<CourseLearningDevOpsAdvanced />} />
            <Route path="/ai-study-material" element={<AIStudyMaterialProtected />} />
            <Route path="/ethical-hacker/module/:moduleId" element={<AIStudyMaterialProtected />} />
  
            <Route path="/learn/:studentSlug/frontend-development-beginner" element={<IntroHtmlProtected />} />
            
  
            <Route path="/devops-beginner" element={<><Header hideDock={true} /><CourseIntro courseSlug="devops-beginner" /></>} />
            <Route path="/devops-beginner/module/:slug" element={<><Header hideDock={true} /><CourseLearningDevOpsBeginner /></>} />
  
  
            <Route path="/networking-beginner" element={<><Header hideDock={true} /><CourseIntro courseSlug="networking-beginner" /></>} />
            <Route path="/networking-beginner/module/:slug" element={<><Header hideDock={true} /><CourseLearningNetworkingBeginner /></>} />
            <Route path="/networking-intermediate" element={<><Header hideDock={true} /><CourseIntro courseSlug="networking-intermediate" /></>} />
            <Route path="/networking-intermediate/module/:slug" element={<><Header hideDock={true} /><CourseLearningNetworkingIntermediate /></>} />
            <Route path="/networking-advanced" element={<><Header hideDock={true} /><CourseIntro courseSlug="networking-advanced" /></>} />
            <Route path="/networking-advanced/module/:slug" element={<><Header hideDock={true} /><ModuleComingSoon /></>} />
            
            <Route path="/data-science-beginner" element={<><Header hideDock={true} /><CourseIntro courseSlug="data-science-beginner" /></>} />
            <Route path="/data-science-beginner/module/:slug" element={<><Header hideDock={true} /><CourseLearningDataScienceBeginner /></>} />
  
  
            <Route path="/genai-beginner" element={<><Header hideDock={true} /><CourseIntro courseSlug="genai-beginner" /></>} />
            <Route path="/genai-beginner/module/:slug" element={<><Header hideDock={true} /><ModuleComingSoon /></>} />
            <Route path="/genai-intermediate" element={<><Header hideDock={true} /><CourseIntro courseSlug="genai-intermediate" /></>} />
            <Route path="/genai-intermediate/module/:slug" element={<><Header hideDock={true} /><ModuleComingSoon /></>} />
            <Route path="/genai-advanced" element={<><Header hideDock={true} /><CourseIntro courseSlug="genai-advanced" /></>} />
            <Route path="/genai-advanced/module/:slug" element={<><Header hideDock={true} /><ModuleComingSoon /></>} />
  
  
            <Route path="/cyber-security-beginner" element={<><Header hideDock={true} /><CourseIntro courseSlug="cyber-security-beginner" /></>} />
            <Route
              path="/cyber-security-beginner/module/:slug"
              element={
                <ProtectedLoginRoute>
                  <><Header hideDock={true} /><CourseLearningCyberSecurityBeginner /></>
                </ProtectedLoginRoute>
              }
            />
            <Route path="/cyber-security-intermediate" element={<><Header hideDock={true} /><CourseIntro courseSlug="cyber-security-intermediate" /></>} />
            <Route path="/cyber-security-intermediate/module/:slug" element={
              <ProtectedCourseGate courseId="cyber-security-intermediate">
                <><Header hideDock={true} /><CourseLearningCyberSecurityIntermediate /></>
              </ProtectedCourseGate>
            } />
            <Route path="/cyber-security-advanced" element={<><Header hideDock={true} /><CourseIntro courseSlug="cyber-security-advanced" /></>} />
            <Route path="/cyber-security-advanced/module/:slug" element={<><Header hideDock={true} /><ModuleComingSoon /></>} />
            
            <Route path="/assignment/:assignmentId" element={<AssignmentPage />} />
            <Route path="/ai-tools-project/:projectId" element={<AIToolsProjectPage />} />
            <Route path="/devops-project/:projectId" element={<DevOpsProjectPage />} />
            <Route path="/frontend-project/:projectId" element={<FrontendProjectPage />} />
            {/* Plasma/Dither demo routes removed */}
  
          </Routes>
        </Suspense>
      </ClickSpark>
  );
}

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const appTree = (
    <ThemeProvider>
      <Router basename={import.meta.env.VITE_BASE_PATH || '/'}>
        <AppInner />
      </Router>
    </ThemeProvider>
  );

  return clientId ? (
    <ErrorBoundary fallback={appTree}>
      <GoogleOAuthProvider clientId={clientId}>
        {appTree}
      </GoogleOAuthProvider>
    </ErrorBoundary>
  ) : appTree;
}

export default App;
