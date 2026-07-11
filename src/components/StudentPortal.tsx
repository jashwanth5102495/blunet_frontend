import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { normalizeCourseKey, getCourseTitleFromKey } from '../data/courseAssignments';
import { useCourses } from '../hooks/useCourses';
import { Course } from '../data/courses';
import { appLogger } from '../lib/logger';
import { useTheme } from '../contexts/ThemeContext';
import Switch from './ui/sky-toggle';
import Loader4 from './ui/loader-4';
import { AnimatedBorderCard } from './ui/animated-border-card';
import Sidebar from './Sidebar';
import MagicBento from './MagicBento';
import { Bars3Icon, Cog6ToothIcon, GlobeAltIcon, BookOpenIcon, ClipboardDocumentListIcon, Squares2X2Icon, CalendarDaysIcon, XMarkIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { 
  Briefcase, 
  ClipboardList, 
  Clock,
  History,
  LogOut,
  Search,
  Users,
} from 'lucide-react';

const CommunityTab = lazy(() => import('./community/CommunityTab'));
import {
  getStoredProgressForCourse,
  type CourseLessonProgressRecord,
} from '../utils/courseLessonProgress';

const FALLBACK_BACKEND_URL =
  import.meta.env.DEV
    ? 'http://localhost:5000'
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

const BASE_URL = import.meta.env.VITE_BACKEND_URL || FALLBACK_BACKEND_URL;



interface CourseProgress {
  courseId: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessedAt: string;
  nextLesson: string;
  isStarted: boolean;
  totalModules?: number;
  completedModules?: number;
}

interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  description: string;
  grade?: number;
  studyMaterials?: string[];
  testQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

interface Project {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  requirements: string[];
  technologies: string[];
  estimatedTime: string;
  status: 'not_started' | 'in_progress' | 'completed';
  dueDate?: string;
  submissionUrl?: string;
  grade?: number;
}

interface PurchaseHistory {
  id: string;
  courseId: string;
  courseName: string;
  instructor: string;
  purchaseDate: string;
  amount: number;
  status: 'completed' | 'pending';
}

interface StudentProfile {
  name: string;
  email: string;
  enrolledCourses?: number;
  phone?: string;
  location?: string;
  joinDate?: string;
  studentId?: string;
  dateOfBirth?: string;
  education?: string;
  experience?: string;
}

interface PaymentModalData {
  course: Course;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  referralCode: string;
}

const StudentPortal: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  // Use the shared courses data
  const { courses: allCourses } = useCourses();

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const enrolledCarouselRef = useRef<HTMLDivElement>(null);
  const recommendedCarouselRef = useRef<HTMLDivElement>(null);

  // Payment functionality state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<PaymentModalData | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const [enrolledCoursesData, setEnrolledCoursesData] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<{ [courseId: string]: CourseProgress }>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  // Logout handler: clear session and go to company landing page
  const handleLogout = () => {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      navigate('/');
    } catch (e) {
      
      // Hard redirect as fallback
      window.location.href = '/';
    }
  };

  // Handle unauthorized/expired session - clears storage and redirects to login
  const handleUnauthorized = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    navigate('/student-login');
  };

  
  // Git functionality state
  const [showGitTutorialModal, setShowGitTutorialModal] = useState(false);
  const [showProjectSubmissionModal, setShowProjectSubmissionModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectGitUrl, setProjectGitUrl] = useState('');
  const [projectGoogleDriveUrl, setProjectGoogleDriveUrl] = useState('');

  // Derived flag: selected course in payment modal is AI Tools Mastery (no discounts allowed)
  const isAIToolsMasterySelected = !!paymentModalData && (
    paymentModalData.course?.id === 'ai-tools-mastery' ||
    (paymentModalData.course as any)?.courseId === 'AI-TOOLS-MASTERY' ||
    (paymentModalData.course?.title || '').toLowerCase().includes('ai tools')
  );

  // Assignment course selection state
  const [selectedCourseForAssignments, setSelectedCourseForAssignments] = useState<string | null>(null);
  
  // Project course selection state
  const [selectedCourseForProjects, setSelectedCourseForProjects] = useState<string | null>(null);

  // Overall completion tracking state

  
  // Course details state
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);

  
  // Assignment tracking state
  const [assignmentStatuses, setAssignmentStatuses] = useState<{ [assignmentId: string]: Assignment['status'] }>({});

  const [assignmentSummary, setAssignmentSummary] = useState<{ total: number; completed: number; pending: number } | null>(null);
  
  // Module submission tracking state
  const [moduleSubmissions, setModuleSubmissions] = useState<{ [courseId: string]: { [moduleId: string]: { submissionUrl: string; submittedAt: string } } }>({});

  // Course ID mapping function to handle inconsistent courseId values
  const getCourseIdMapping = (courseId: string): string[] => {
    const mappings: { [key: string]: string[] } = {
      'ai-tools-mastery': ['1', 'AI-TOOLS-MASTERY', 'ai-tools-mastery', 'AI Tools Mastery'],
      'frontend-beginner': ['frontend-beginner', 'Frontend Development - Beginner', 'FRONTEND-BEGINNER'],
      'frontend-intermediate': [
        'frontend-intermediate',
        'frontend-development-intermediate',
        'Frontend Development - Intermediate',
        'FRONTEND-INTERMEDIATE',
        'frontend_intermediate',
        'front-end-intermediate',
        'Front-End Intermediate',
        'Intermediate Frontend'
      ],
      'frontend-development-intermediate': [
        'frontend-intermediate',
        'frontend-development-intermediate',
        'Frontend Development - Intermediate',
        'FRONTEND-INTERMEDIATE'
      ],
      'frontend-advanced': ['3', 'frontend-advanced', 'Frontend Development - Advanced'],
      'devops-beginner': ['DEVOPS-BEGINNER', 'devops-beginner', 'DevOps - Beginner'],
      'devops-intermediate': ['4', 'devops-intermediate', 'DevOps - Intermediate'],
      'mobile-core': ['5', 'mobile-core', 'Mobile Development - Core'],
      'networking-beginner': ['networking-beginner', 'Networking - Beginner', 'NETWORKING-BEGINNER', 'networking_beginner', 'Networking Beginner'],
      'networking-intermediate': ['networking-intermediate', 'Networking - Intermediate', 'NETWORKING-INTERMEDIATE', 'networking_intermediate', 'Networking Intermediate'],
      'cyber-security-beginner': ['cyber-security-beginner', 'CYBER-SECURITY-BEGINNER', 'Cyber Security - Beginner', 'cybersecurity-beginner', 'CYBERSECURITY-BEGINNER'],
      'cyber-security-intermediate': ['cyber-security-intermediate', 'CYBER-SECURITY-INTERMEDIATE', 'Cyber Security - Intermediate', 'cybersecurity-intermediate', 'CYBERSECURITY-INTERMEDIATE'],
      '1': ['ai-tools-mastery', 'AI-TOOLS-MASTERY', 'AI Tools Mastery'],
      'AI-TOOLS-MASTERY': ['ai-tools-mastery', '1', 'AI-TOOLS-MASTERY'],
      'AI Tools Mastery': ['ai-tools-mastery', '1', 'AI-TOOLS-MASTERY'],
      'Frontend Development - Beginner': ['frontend-beginner', 'FRONTEND-BEGINNER'],
      'Frontend Development - Intermediate': ['frontend-intermediate', 'frontend-development-intermediate', 'FRONTEND-INTERMEDIATE'],
      'FRONTEND-INTERMEDIATE': ['frontend-intermediate', 'frontend-development-intermediate', 'Frontend Development - Intermediate'],
      'FRONTEND-BEGINNER': ['frontend-beginner', 'Frontend Development - Beginner'],
      'DevOps - Beginner': ['devops-beginner', 'DEVOPS-BEGINNER'],
      'DEVOPS-BEGINNER': ['devops-beginner', 'DevOps - Beginner'],
      'Networking - Beginner': ['networking-beginner', 'NETWORKING-BEGINNER'],
      'NETWORKING-BEGINNER': ['networking-beginner', 'Networking - Beginner'],
      'Networking Beginner': ['networking-beginner', 'Networking - Beginner', 'NETWORKING-BEGINNER'],
      'Networking - Intermediate': ['networking-intermediate', 'NETWORKING-INTERMEDIATE'],
      'NETWORKING-INTERMEDIATE': ['networking-intermediate', 'Networking - Intermediate'],
      'Networking Intermediate': ['networking-intermediate', 'Networking - Intermediate', 'NETWORKING-INTERMEDIATE'],
      'CYBER-SECURITY-BEGINNER': ['cyber-security-beginner', 'CYBER-SECURITY-BEGINNER', 'Cyber Security - Beginner'],
      'Cyber Security - Beginner': ['cyber-security-beginner', 'CYBER-SECURITY-BEGINNER'],
      'CYBER-SECURITY-INTERMEDIATE': ['cyber-security-intermediate', 'CYBER-SECURITY-INTERMEDIATE', 'Cyber Security - Intermediate'],
      'Cyber Security - Intermediate': ['cyber-security-intermediate', 'CYBER-SECURITY-INTERMEDIATE'],
      'CYBERSECURITY-BEGINNER': ['cyber-security-beginner', 'CYBER-SECURITY-BEGINNER', 'Cyber Security - Beginner'],
      'CYBERSECURITY-INTERMEDIATE': ['cyber-security-intermediate', 'CYBER-SECURITY-INTERMEDIATE', 'Cyber Security - Intermediate']
    };
    return mappings[courseId] || [courseId];
  };

  // Compute assignment summary (completed/pending) when course selection changes
  useEffect(() => {
    const fetchSummary = async () => {
      if (!selectedCourseForAssignments) {
        setAssignmentSummary(null);
        return;
      }
      try {
        const currentUserRaw = localStorage.getItem('currentUser');
        const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
        const mappedIds = getCourseIdMapping(selectedCourseForAssignments);
        const courseKey = mappedIds[0] || selectedCourseForAssignments;

        const courseAssignments = assignments.filter(a => mappedIds.includes(a.courseId));
        const totalLocal = courseAssignments.length;
        const completedLocal = courseAssignments.filter(a => (a.grade || 0) >= 5).length;
        let total = totalLocal;
        let completed = completedLocal;

        if (currentUser?.id) {
          const headers: Record<string, string> | undefined = currentUser?.token ? { Authorization: `Bearer ${currentUser.token}` } : undefined;
          try {
            const resp = await fetch(`${BASE_URL}/api/progress/student/${currentUser.id}/course/${courseKey}/summary`, { headers });
            if (resp.ok) {
              const result = await resp.json();
              const list = result?.data?.assignments?.list;
              const totalApi: number | undefined = result?.data?.assignments?.total;

              if (Array.isArray(list)) {
                total = Math.max(totalLocal, list.length);
                completed = list.filter((item: any) => (item?.status === 'graded' || item?.status === 'passed') || Number(item?.score ?? 0) >= 5).length;

                // Sync assignment status badges with backend summary for current course
                try {
                  const courseAssignments = assignments.filter(a => mappedIds.includes(a.courseId));
                  const updatedStatuses: { [assignmentId: string]: Assignment['status'] } = {};
                  for (const a of courseAssignments) {
                    const match = list.find((it: any) => it?.title === a.title);
                    if (match) {
                      const statusNorm = match.status === 'passed' ? 'graded' : (match.status === 'attempted' ? 'submitted' : match.status);
                      const s: Assignment['status'] = statusNorm === 'graded' ? 'graded' : (statusNorm === 'submitted' ? 'submitted' : 'pending');
                      updatedStatuses[a.id] = s;
                    }
                  }
                  if (Object.keys(updatedStatuses).length > 0) {
                    setAssignmentStatuses(prev => ({ ...prev, ...updatedStatuses }));
                  }
                } catch (mapErr) {
                  
                }
              } else if (typeof totalApi === 'number' && totalApi > 0) {
                total = Math.max(totalLocal, totalApi);
              }
            }
          } catch (apiErr) {
            
          }
        }

        const pending = Math.max(total - completed, 0);
        setAssignmentSummary({ total, completed, pending });
      } catch (e) {
        
        const mappedIds = getCourseIdMapping(selectedCourseForAssignments);
        const courseAssignments = assignments.filter(a => mappedIds.includes(a.courseId));
        const total = courseAssignments.length;
        const completed = courseAssignments.filter(a => (a.grade || 0) >= 5).length;
        setAssignmentSummary({ total, completed, pending: Math.max(total - completed, 0) });
      }
    };

    fetchSummary();
  }, [selectedCourseForAssignments]);

  // Helper to render Project Submission Modal (refactored from inline IIFE)
  const renderProjectSubmissionModal = () => {
    if (!(showProjectSubmissionModal && selectedProjectId)) return null;
    const selectedProject = projects.find(p => p.id === selectedProjectId);
    const isAIToolsProject = selectedProject?.courseId === 'ai-tools-mastery';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Submit Project</h3>
            <button
              onClick={() => {
                setShowProjectSubmissionModal(false);
                setSelectedProjectId(null);
                setProjectGitUrl('');
                setProjectGoogleDriveUrl('');
              }}
              className="text-gray-400 hover:text-white"
              aria-label="Close project submission modal"
              title="Close"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mb-4">
            {isAIToolsProject ? (
              <>
                <p className="text-gray-300 text-sm mb-4">
                  Submit your AI Tools project by providing a Google Drive URL. Make sure your folder is shared with view access so instructors can review your work.
                </p>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Google Drive Folder URL *
                </label>
                <input
                  type="url"
                  value={projectGoogleDriveUrl}
                  onChange={(e) => setProjectGoogleDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/your-folder-id"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <p className="text-gray-400 text-xs mt-1">
                  Example: https://drive.google.com/drive/folders/1ABC123xyz...
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-300 text-sm mb-4">
                  Submit your project by providing the Git repository URL. Make sure your repository is public so instructors can review your code.
                </p>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Git Repository URL *
                </label>
                <input
                  type="url"
                  value={projectGitUrl}
                  onChange={(e) => setProjectGitUrl(e.target.value)}
                  placeholder="https://github.com/username/project-name"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <p className="text-gray-400 text-xs mt-1">
                  Example: https://github.com/yourusername/your-project
                </p>
              </>
            )}
          </div>

          {!isAIToolsProject && (
            <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3 mb-4">
              <p className="text-blue-400 text-sm">
                💡 <strong>Tip:</strong> Don't know how to use Git? Click the "Learn Git" button in your project to get started with step-by-step instructions!
              </p>
            </div>
          )}

          {isAIToolsProject && (
            <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-3 mb-4">
              <p className="text-purple-400 text-sm">
                📁 <strong>Tip:</strong> Create a well-organized folder structure with your AI-generated content, prompts used, and documentation. Make sure to set sharing permissions to "Anyone with the link can view".
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowProjectSubmissionModal(false);
                setSelectedProjectId(null);
                setProjectGitUrl('');
                setProjectGoogleDriveUrl('');
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const submissionUrl = isAIToolsProject ? projectGoogleDriveUrl.trim() : projectGitUrl.trim();
                if (submissionUrl) {
                  appLogger.info('student.project.submit', 'Submitting student project', {
                    selectedProjectId,
                    submissionType: isAIToolsProject ? 'google_drive' : 'git'
                  });
                  alert(`Project submitted successfully! Your instructor will review your ${isAIToolsProject ? 'Google Drive folder' : 'Git repository'} soon.`);
                  setShowProjectSubmissionModal(false);
                  setSelectedProjectId(null);
                  setProjectGitUrl('');
                  setProjectGoogleDriveUrl('');
                }
              }}
              disabled={isAIToolsProject ? !projectGoogleDriveUrl.trim() : !projectGitUrl.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Submit Project
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to get module ID from enrolled course data
  const getModuleIdForProject = (projectId: string, courseData: any): string | null => {
    if (!courseData || !courseData.modules) return null;

    // Map project IDs to module indexes
    const projectToModuleIndex: { [courseType: string]: { [projectId: string]: number } } = {
      'ai-tools-mastery': {
        'ai-tools-project-1': 0, // AI Fundamentals
        'ai-tools-project-2': 1, // ChatGPT & Language Models
        'ai-tools-project-3': 2, // AI Image & Video Tools
        'ai-tools-project-4': 3, // AI Automation & Workflows
        'ai-tools-project-5': 0, // Fallback to first module
        'ai-tools-project-6': 1  // Fallback to second module
      },
      'frontend-beginner': {
        'project-1': 0, // HTML Fundamentals
        'project-2': 1, // CSS Styling
        'project-3': 2, // JavaScript Basics
        'project-4': 3  // Project Development (fallback-safe)
      },
      'frontend-intermediate': {
        'frontend-intermediate-project-1': 0, // Modern JS Patterns
        'frontend-intermediate-project-2': 1, // Advanced CSS & Themes
        'frontend-intermediate-project-3': 2, // TypeScript Component Library
        'frontend-intermediate-project-4': 3  // React Data Fetching
      },
      'devops-beginner': {
        'devops-project-1': 0, // DevOps Fundamentals
        'devops-project-2': 1, // Containerization
        'devops-project-3': 2, // CI/CD Pipelines
        'devops-project-4': 3  // Cloud Platforms
      }
    };

    // Determine course type from courseData
    let courseType = '';
    if (courseData.courseId === 'AI-TOOLS-MASTERY' || courseData.title?.includes('AI Tools')) {
      courseType = 'ai-tools-mastery';
    } else if (courseData.title?.includes('Frontend') && (courseData.level || '').toLowerCase() === 'beginner') {
      courseType = 'frontend-beginner';
    } else if (courseData.title?.includes('Frontend') && (courseData.level || '').toLowerCase() === 'intermediate') {
      courseType = 'frontend-intermediate';
    } else if (courseData.title?.includes('DevOps') && (courseData.level || '').toLowerCase() === 'beginner') {
      courseType = 'devops-beginner';
    }

    const moduleIndex = projectToModuleIndex[courseType]?.[projectId];

    // Fallback: if mapped index is missing/out of range, use last available module
    if (Array.isArray(courseData.modules) && courseData.modules.length > 0) {
      const isIndexValid = typeof moduleIndex === 'number' && moduleIndex >= 0 && moduleIndex < courseData.modules.length;

      if (isIndexValid) {
        const selectedModule = courseData.modules[moduleIndex];
        // Try multiple shapes for module ID
        const rawId = selectedModule?._id || selectedModule?.id || (selectedModule?._id && selectedModule._id.$oid);
        if (rawId) {
          return typeof rawId === 'string' ? rawId : String(rawId);
        }
      }

      // Out-of-range or missing mapping: generate a stable 24-hex pseudo ObjectId based on course + project
      const seed = `${courseData.id || courseData.courseId || courseData.title}:${projectId}`;
      const generateStableObjectIdHex = (s: string) => {
        const chars = 'abcdef0123456789';
        let h1 = 0xABCDEF;
        let h2 = 0x123456;
        for (let i = 0; i < s.length; i++) {
          h1 = (h1 ^ s.charCodeAt(i)) >>> 0;
          h2 = (h2 + (s.charCodeAt(i) * 31)) >>> 0;
        }
        let out = '';
        for (let i = 0; i < 24; i++) {
          const v = (h1 + i * 2654435761 + (h2 << (i % 5))) >>> 0;
          out += chars[(v >> (i % 4)) & 0x0f];
        }
        return out;
      };

      return generateStableObjectIdHex(seed);
    }

    return null;
  };

  // Function to fetch module submissions for a course
  const fetchModuleSubmissions = async (studentId: string, courseId: string) => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      const userData = JSON.parse(currentUser!);
      const token = userData.token;
      const response = await fetch(`${BASE_URL}/api/students/${studentId}/module-submissions/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const submissionsMap: { [moduleId: string]: { submissionUrl: string; submittedAt: string } } = {};
          
          result.data.forEach((submission: any) => {
            submissionsMap[submission.moduleId] = {
              submissionUrl: submission.submissionUrl,
              submittedAt: submission.submittedAt
            };
          });
          
          setModuleSubmissions(prev => ({
            ...prev,
            [courseId]: submissionsMap
          }));
        }
      }
    } catch (error) {
      
    }
  };

  // Function to submit module with URL
  const submitModuleUrl = async (courseId: string, moduleId: string, submissionUrl: string) => {
    try {
      const currentUser = localStorage.getItem('currentUser');

      if (!currentUser) {
        alert('Please log in to submit projects');
        return false;
      }

      const userData = JSON.parse(currentUser);
      const token = userData.token;

      appLogger.info('student.module.submit', 'Submitting module URL', {
        courseId,
        moduleId,
        studentId: userData.id
      });

      const response = await fetch(`${BASE_URL}/api/students/${userData.id}/submit-module`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          moduleId,
          submissionUrl
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        appLogger.info('student.module.submit.success', 'Module submitted successfully', {
          courseId,
          moduleId,
          studentId: userData.id
        });
        // Update local state
        setModuleSubmissions(prev => ({
          ...prev,
          [courseId]: {
            ...prev[courseId],
            [moduleId]: {
              submissionUrl,
              submittedAt: new Date().toISOString()
            }
          }
        }));
        return true;
      } else {
        
        alert(`Failed to submit: ${result.message}`);
        return false;
      }
    } catch (error) {
      
      alert('Error submitting module. Please try again.');
      return false;
    }
  };

  // Helper function to check if a course is accessible (either purchased or confirmed payment)
  const isCourseAccessible = (courseId: string): boolean => {
    appLogger.debug('student.course.access.check', 'Checking course accessibility', {
      courseId,
      purchasedCoursesCount: purchasedCourses.length,
      enrolledCoursesCount: enrolledCourses.length
    });
    

    
    // Check if course is in purchased courses list
    if (purchasedCourses.includes(courseId)) {
      return true;
    }
    
    // Check if course has confirmed payment status in enrolled courses
    const enrolledCourse = enrolledCourses.find(course => course.id === courseId);
    if (enrolledCourse && enrolledCourse.confirmationStatus === 'confirmed') {
      return true;
    }
    
    // Check for courseId mappings (for assignments/projects that use different courseId formats)
    const possibleMappings = getCourseIdMapping(courseId);
    for (const mappedId of possibleMappings) {
      if (purchasedCourses.includes(mappedId)) {
        return true;
      }
      
      const mappedEnrolledCourse = enrolledCourses.find(course => course.id === mappedId);
      if (mappedEnrolledCourse && mappedEnrolledCourse.confirmationStatus === 'confirmed') {
        return true;
      }
    }
    
    // Check reverse mapping - if any enrolled course maps to this courseId
    const confirmedCourseIds = [...purchasedCourses, ...enrolledCourses.filter(c => c.confirmationStatus === 'confirmed').map(c => c.id)];
    for (const backendCourseId of confirmedCourseIds) {
      const backendMappings = getCourseIdMapping(backendCourseId);
      if (backendMappings.includes(courseId)) {
        return true;
      }
    }
    
    appLogger.warn('student.course.access.denied', 'Course access check failed', { courseId });
    return false;
  };

  const categories = ['all', 'frontend', 'ai', 'devops', 'mobile', 'networking', 'cyber', 'data-science'];
  const filteredCourses = selectedCategory === 'all' 
    ? allCourses 
    : allCourses.filter(course => course.category === selectedCategory);

  // Define a summary type for enrolled courses
  interface EnrolledCourseSummary {
    id: string;
    title: string;
    instructor: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    duration: string;
    nextLesson: string;
    isStarted: boolean;
    // Payment status fields
    paymentStatus?: string;
    confirmationStatus?: string;
    transactionId?: string;
    paymentId?: string;
    paymentMethod?: string;
    adminConfirmedBy?: string;
    adminConfirmedAt?: string;
    enrollmentConfirmationStatus?: string;
    enrollmentStatus?: string;
    status?: string;
  }

  // Generate enrolled courses summary from backend data
  const enrolledCourses: EnrolledCourseSummary[] = enrolledCoursesData.map((course: Course & { 
    courseId?: string;
    paymentMethod?: string;
    adminConfirmedBy?: string;
    adminConfirmedAt?: string;
    instructor: string | { name: string };
  }) => {
    const progress = courseProgress[course.courseId || course.id];

    
    return {
      id: course.courseId || course.id,
      title: getCourseTitleFromKey(normalizeCourseKey(course.courseId || course.id)) || course.title,
      instructor: (course.instructor as any)?.name || course.instructor as string || 'Unknown Instructor',
      progress: progress?.progress || 0,
      totalLessons: progress?.totalLessons || 20,
      completedLessons: progress?.completedLessons || 0,
      duration: course.duration,
      nextLesson: progress?.nextLesson || 'Introduction to Course',
      isStarted: progress?.isStarted || false,
      // Include payment status fields
      paymentStatus: course.paymentStatus,
      confirmationStatus: course.confirmationStatus,
      transactionId: course.transactionId,
      paymentMethod: course.paymentMethod,
      adminConfirmedBy: course.adminConfirmedBy,
      adminConfirmedAt: course.adminConfirmedAt
    };
  });
  appLogger.debug('student.enrollment.summary', 'Built enrolled course summary', {
    totalEnrolledCourses: enrolledCourses.length
  });

  const recommendedCourses = allCourses.filter(course => 
    !enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id)
  ).slice(0, 6);

  const getEnrolledCourseImage = (course: Course): string | undefined => {
    const key = normalizeCourseKey(course.courseId || course.id);
    const match = allCourses.find(c => normalizeCourseKey(c.id) === key);
    return match?.image || course.image;
  };

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    const container = ref.current;
    if (!container) return;
    const delta = direction === 'left' ? -320 : 320;
    container.scrollBy({ left: delta, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!recommendedCarouselRef.current || recommendedCourses.length <= 1) return;
    const container = recommendedCarouselRef.current;
    const interval = setInterval(() => {
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      const next = container.scrollLeft + 320;
      container.scrollTo({
        left: next >= maxScroll ? 0 : next,
        behavior: 'smooth'
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [recommendedCourses.length]);

  // Available courses for browsing (using allCourses data)
  /* const _availableCourses = allCourses.filter(course => 
    !enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id)
  ); */

  // Sample projects for Frontend Development - Beginner (8 progressive difficulty projects)
  const projects: Project[] = [
    // A.I Tools Mastery Course Projects - 6 Module Structure
    {
      id: 'ai-tools-project-1',
      title: 'Module 1 Project: AI Image Generation Portfolio',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery',
      difficulty: 'intermediate',
      description: 'Create a professional portfolio showcasing AI-generated images using DALL-E 3, Midjourney, and Stable Diffusion with Promptly AI optimization.',
      requirements: [
        'Generate 50+ professional images using different AI tools',
        'Use Promptly AI to optimize and perfect prompts',
        'Create themed collections (business, art, photography)',
        'Build a responsive web gallery to showcase work',
        'Document prompt engineering techniques used'
      ],
      technologies: ['DALL-E 3', 'Midjourney', 'Stable Diffusion', 'Promptly AI', 'HTML/CSS/JS'],
      estimatedTime: '2-3 weeks',
      status: 'not_started'
    },
    {
      id: 'ai-tools-project-2',
      title: 'Module 2 Project: AI Video Production Studio',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery',
      difficulty: 'advanced',
      description: 'Produce a complete 5-minute promotional video using AI video generation tools and professional editing techniques.',
      requirements: [
        'Create video content using Runway ML and Synthesia',
        'Generate AI avatars and voiceovers',
        'Use Luma AI for cinematic sequences',
        'Edit and post-process with professional tools',
        'Create a complete video production pipeline'
      ],
      technologies: ['Runway ML', 'Synthesia', 'Luma AI', 'Pika Labs', 'DaVinci Resolve'],
      estimatedTime: '3-4 weeks',
      status: 'not_started'
    },
    {
      id: 'ai-tools-project-3',
      title: 'Module 3 Project: Image-to-Video Animation Suite',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery',
      difficulty: 'intermediate',
      description: 'Transform static images into dynamic videos using advanced AI animation techniques and motion control.',
      requirements: [
        'Convert 20+ static images to animated videos',
        'Master motion brush and camera movement controls',
        'Create seamless transitions and effects',
        'Build an automated batch processing workflow',
        'Produce a final compilation showcase video'
      ],
      technologies: ['Runway Gen-2', 'Stable Video Diffusion', 'Pika Labs', 'Motion Brush', 'FFmpeg'],
      estimatedTime: '2-3 weeks',
      status: 'not_started'
    },
    {
      id: 'ai-tools-project-4',
      title: 'Module 4 Project: JSON-Powered AI Data Generator',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery',
      difficulty: 'advanced',
      description: 'Build a comprehensive data generation system using structured JSON prompts for business applications.',
      requirements: [
        'Design JSON schemas for different data types',
        'Create automated data generation workflows',
        'Build API integrations for data processing',
        'Implement data validation and quality control',
        'Generate sample datasets for e-commerce, CRM, and analytics'
      ],
      technologies: ['JSON Schema', 'OpenAI API', 'Node.js', 'MongoDB', 'Data Validation'],
      estimatedTime: '3-4 weeks',
      status: 'not_started'
    },
    {
      id: 'ai-tools-project-5',
      title: 'Module 5 Project: Multi-Platform AI Agent Network',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery',
      difficulty: 'advanced',
      description: 'Create an intelligent agent network using n8n, Zapier, and Make.com for complete business automation.',
      requirements: [
        'Design multi-step automation workflows',
        'Integrate AI decision-making capabilities',
        'Connect multiple platforms and APIs',
        'Implement error handling and monitoring',
        'Create a dashboard for workflow management'
      ],
      technologies: ['n8n', 'Zapier', 'Make.com', 'OpenAI API', 'Webhook Integration'],
      estimatedTime: '4-5 weeks',
      status: 'not_started'
    },
    {
      id: 'ai-tools-project-6',
      title: 'Module 6 Project: Claude AI Enterprise Application',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery',
      difficulty: 'advanced',
      description: 'Develop a complete enterprise application using Claude AI API with advanced features and custom integrations.',
      requirements: [
        'Build a full-stack application with Claude API integration',
        'Implement advanced prompt engineering techniques',
        'Create custom Claude workflows and automations',
        'Add enterprise features (user management, analytics)',
        'Deploy with proper security and scaling considerations'
      ],
      technologies: ['Claude API', 'React/Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS/Azure'],
      estimatedTime: '5-6 weeks',
      status: 'not_started'
    },

    // Frontend Development - Beginner Course Projects
    {
      id: 'project-1',
      title: 'Personal Portfolio Website',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      difficulty: 'beginner',
      description: 'Create a simple personal portfolio website using HTML and CSS',
      requirements: [
        'Create an HTML structure with header, about, and contact sections',
        'Style with CSS including colors, fonts, and layout',
        'Make it responsive for mobile devices',
        'Include a profile image and contact information'
      ],
      technologies: ['HTML5', 'CSS3'],
      estimatedTime: '1 week',
      status: 'not_started'
    },
    {
      id: 'project-2',
      title: 'Interactive To-Do List',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      difficulty: 'beginner',
      description: 'Build a functional to-do list application with JavaScript',
      requirements: [
        'Add new tasks with input field',
        'Mark tasks as complete/incomplete',
        'Delete tasks from the list',
        'Store tasks in localStorage',
        'Filter tasks by status (all, active, completed)'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      estimatedTime: '1.5 weeks',
      status: 'in_progress'
    },
    {
      id: 'project-3',
      title: 'Weather Dashboard',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      difficulty: 'beginner',
      description: 'Create a weather dashboard that fetches data from a weather API',
      requirements: [
        'Search for weather by city name',
        'Display current weather conditions',
        'Show 5-day weather forecast',
        'Use weather icons and animations',
        'Handle API errors gracefully'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Weather API'],
      estimatedTime: '2 weeks',
      status: 'not_started'
    },
    {
      id: 'project-4',
      title: 'E-commerce Product Catalog',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      difficulty: 'intermediate',
      description: 'Build a product catalog with filtering and shopping cart functionality',
      requirements: [
        'Display products in a grid layout',
        'Filter products by category and price',
        'Add products to shopping cart',
        'Calculate total price with taxes',
        'Responsive design for all devices'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Local Storage'],
      estimatedTime: '2.5 weeks',
      status: 'not_started'
    },

    // Frontend Development - Intermediate Course Projects
    {
      id: 'frontend-intermediate-project-1',
      title: 'Modern JavaScript SPA Refactor',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      difficulty: 'intermediate',
      description: 'Refactor a vanilla JS app into modular ES6 with routing, async data, and error handling.',
      requirements: [
        'Break code into ES modules',
        'Implement client-side routing',
        'Use async/await with robust error handling',
        'Add unit tests for utility functions',
        'Optimize bundle with Vite'
      ],
      technologies: ['JavaScript (ES6+)', 'Vite', 'Routing (Page.js or custom)', 'Jest'],
      estimatedTime: '1.5–2 weeks',
      status: 'not_started'
    },
    {
      id: 'frontend-intermediate-project-2',
      title: 'Advanced CSS Themes & Animations',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      difficulty: 'intermediate',
      description: 'Build a theming system with CSS variables, dark mode, and micro-interactions.',
      requirements: [
        'Theme switching with CSS variables',
        'Responsive layout with Grid/Flexbox',
        'Accessible focus states',
        'Keyframe animations and transitions',
        'Prefers-reduced-motion support'
      ],
      technologies: ['CSS Grid/Flexbox', 'CSS Variables', 'Animations', 'Accessibility'],
      estimatedTime: '1–1.5 weeks',
      status: 'not_started'
    },
    {
      id: 'frontend-intermediate-project-3',
      title: 'TypeScript React Component Library',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      difficulty: 'advanced',
      description: 'Create a small React component library with TypeScript, props typing, and docs.',
      requirements: [
        'Strongly type components and hooks',
        'Storybook for docs and demos',
        'Unit tests with React Testing Library',
        'CI lint/test workflow',
        'Publish to npm or GitHub Packages (optional)'
      ],
      technologies: ['React', 'TypeScript', 'Storybook', 'Testing Library', 'CI'],
      estimatedTime: '2–3 weeks',
      status: 'not_started'
    },
    {
      id: 'frontend-intermediate-project-4',
      title: 'React Data Fetching & Caching',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      difficulty: 'intermediate',
      description: 'Build a React app with SWR/RTK Query style caching, optimistic updates, and error states.',
      requirements: [
        'Reusable fetch hooks with caching',
        'Loading skeletons and error boundaries',
        'Pagination and infinite scroll',
        'Optimistic updates for mutations',
        'Persist selected state across routes'
      ],
      technologies: ['React', 'TypeScript', 'SWR or RTK Query patterns'],
      estimatedTime: '2 weeks',
      status: 'not_started'
    },

    // DevOps - Beginner Course Projects
    {
      id: 'devops-project-1',
      title: 'Git Version Control Setup',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      difficulty: 'beginner',
      description: 'Set up a complete Git workflow with branching strategies and collaboration practices',
      requirements: [
        'Create a Git repository with proper structure',
        'Implement branching strategy (main, develop, feature branches)',
        'Set up pull request workflow',
        'Configure Git hooks for automated checks',
        'Document the workflow and best practices'
      ],
      technologies: ['Git', 'GitHub/GitLab', 'Shell Scripting'],
      estimatedTime: '1.5 weeks',
      status: 'not_started'
    },
    {
      id: 'devops-project-2',
      title: 'CI/CD Pipeline Implementation',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      difficulty: 'intermediate',
      description: 'Build a complete CI/CD pipeline for a web application with automated testing and deployment',
      requirements: [
        'Set up automated build process',
        'Implement automated testing (unit, integration)',
        'Configure deployment to staging and production',
        'Set up monitoring and alerting',
        'Create deployment rollback strategy'
      ],
      technologies: ['GitHub Actions', 'Docker', 'AWS/Azure', 'Testing Frameworks'],
      estimatedTime: '2.5 weeks',
      status: 'not_started'
    },
    {
      id: 'devops-project-3',
      title: 'Docker Containerization Project',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      difficulty: 'intermediate',
      description: 'Containerize a multi-tier application using Docker and Docker Compose',
      requirements: [
        'Create Dockerfiles for frontend and backend services',
        'Set up Docker Compose for multi-container deployment',
        'Implement environment-specific configurations',
        'Set up container networking and volumes',
        'Optimize container images for production'
      ],
      technologies: ['Docker', 'Docker Compose', 'Linux', 'Networking'],
      estimatedTime: '2 weeks',
      status: 'not_started'
    },
    {
      id: 'devops-project-4',
      title: 'Infrastructure Monitoring Dashboard',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      difficulty: 'intermediate',
      description: 'Set up comprehensive monitoring and logging for application infrastructure',
      requirements: [
        'Deploy monitoring stack (Prometheus, Grafana)',
        'Configure application and infrastructure metrics',
        'Set up centralized logging with ELK stack',
        'Create custom dashboards and alerts',
        'Implement automated incident response'
      ],
      technologies: ['Prometheus', 'Grafana', 'ELK Stack', 'Docker', 'Linux'],
      estimatedTime: '2.5 weeks',
      status: 'not_started'
    },



  ];

  // Comprehensive assignments data - 6 assignments per purchased course
  const assignments: Assignment[] = [
    // A.I Tools Mastery Professional Certification Program Assignments (Course ID: 'ai-tools-mastery') - 6 Module Structure
    {
      id: 'ai-tools-1',
      title: 'Module 1: Professional Image Creation & Brand Design Portfolio',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery - Professional Certification Program',
      dueDate: '2024-02-10',
      status: 'pending',
      description: '🎯 ENTERPRISE PROJECT: Create a complete brand identity package for a Fortune 500 client using DALL-E 3, Midjourney, and Stable Diffusion. Master enterprise-grade prompt engineering with Promptly AI. Deliverables: Logo suite, brand guidelines, marketing materials, and client presentation deck.',
      studyMaterials: [
        'DALL-E 3 Enterprise Techniques & Commercial Applications',
        'Midjourney Professional Brand Workflow Masterclass',
        'Stable Diffusion Custom Model Training for Business',
        'Promptly AI Advanced Optimization & Enterprise Setup',
        'Commercial Image Enhancement & Professional Editing',
        'Copyright, Licensing & Legal Compliance for AI-Generated Content',
        'Client Presentation Techniques & Portfolio Development',
        'Brand Identity Design Principles for AI Artists'
      ],
      testQuestions: [
        {
          question: 'What is Promptly AI\'s primary enterprise application?',
          options: ['Video editing workflows', 'Advanced prompt optimization and correction for professional AI outputs', 'Audio generation', 'Code debugging'],
          correctAnswer: 1
        },
        {
          question: 'Which tool provides the most control for creating custom AI models for enterprise image generation?',
          options: ['DALL-E 3', 'Midjourney', 'Stable Diffusion with custom training', 'Canva Pro'],
          correctAnswer: 2
        },
        {
          question: 'What is the most important consideration when using AI-generated images for commercial clients?',
          options: ['Image quality', 'Copyright and licensing compliance', 'Processing speed', 'File size'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'ai-tools-2',
      title: 'Module 2: Enterprise Video Production & AI Cinematography Mastery',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery - Professional Certification Program',
      dueDate: '2024-02-24',
      status: 'pending',
      description: '🎬 ENTERPRISE PROJECT: Produce a complete video marketing campaign for a Fortune 500 client using Runway ML, Synthesia, Luma AI Dream Machine, and Pika Labs. Create corporate training videos, product launches, and executive presentations. Deliverables: 15+ professional video assets, production timeline, and client presentation.',
      studyMaterials: [
        'Runway ML Enterprise Video Production & Custom Model Training',
        'Synthesia Professional AI Avatar Creation & Brand Alignment',
        'Luma AI Dream Machine Advanced Cinematography Techniques',
        'Pika Labs Professional Animation & Motion Graphics',
        'Enterprise Video Editing Workflows & Quality Standards',
        'Corporate Video Production Pipeline & Project Management',
        'AI Cinematography for Business Applications',
        'Video ROI Analytics & Performance Measurement',
        'Client Video Delivery & Professional Presentation'
      ],
      testQuestions: [
        {
          question: 'Which AI tool provides the most professional control for creating branded corporate avatars?',
          options: ['Runway ML', 'Synthesia with custom avatar training', 'Luma AI', 'Pika Labs'],
          correctAnswer: 1
        },
        {
          question: 'What is the primary advantage of Luma AI Dream Machine for enterprise video production?',
          options: ['Low cost', 'Advanced 3D scene generation and realistic physics', 'Simple interface', 'Fast rendering'],
          correctAnswer: 1
        },
        {
          question: 'What is most important when delivering enterprise video projects?',
          options: ['Video length', 'Brand consistency and professional quality standards', 'File size', 'Social media optimization'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'ai-tools-3',
      title: 'Module 3: Professional Image-to-Video Transformation & Motion Design',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery - Professional Certification Program',
      dueDate: '2024-03-10',
      status: 'pending',
      description: '🎨 ENTERPRISE PROJECT: Transform static brand assets into dynamic video content for a luxury brand campaign using Runway Gen-2, Stable Video Diffusion, and Pika Labs. Create product showcases, architectural walkthroughs, and brand storytelling videos. Deliverables: 20+ animated assets, motion design guidelines, and campaign presentation.',
      studyMaterials: [
        'Runway Gen-2 Enterprise Image Animation & Custom Training',
        'Stable Video Diffusion Professional Motion Control',
        'Pika Labs Advanced Image-to-Video Production Workflows',
        'Professional Motion Brush Techniques & Precision Control',
        'Cinematic Camera Movement & Direction for Brand Videos',
        'Enterprise Animation Workflows & Quality Standards',
        'Luxury Brand Motion Design Principles',
        'Product Visualization & Architectural Animation',
        'Client Motion Design Delivery & Brand Guidelines'
      ],
      testQuestions: [
        {
          question: 'Which tool provides the most precise control for enterprise image-to-video transformation?',
          options: ['Basic video editors', 'Runway Gen-2 with motion brush', 'Simple GIF makers', 'PowerPoint animations'],
          correctAnswer: 1
        },
        {
          question: 'What is the key advantage of Stable Video Diffusion for professional motion design?',
          options: ['Free usage', 'Customizable models and enterprise deployment', 'Simple interface', 'Fast processing'],
          correctAnswer: 1
        },
        {
          question: 'What is most critical when creating motion design for luxury brands?',
          options: ['Speed of production', 'Sophisticated motion quality and brand alignment', 'File compression', 'Social media format'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'ai-tools-4',
      title: 'Module 4: Enterprise JSON Prompts & Automated Data Systems',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery - Professional Certification Program',
      dueDate: '2024-03-24',
      status: 'pending',
      description: '⚙️ ENTERPRISE PROJECT: Build an automated data processing system for a multinational corporation using advanced JSON prompt engineering. Create structured data pipelines, API integrations, and enterprise-grade automation workflows. Deliverables: Complete data system, API documentation, and scalability report.',
      studyMaterials: [
        'Enterprise JSON Prompt Engineering & Schema Design',
        'Advanced Structured Data Generation for Business Intelligence',
        'Enterprise API Integration Patterns & Security',
        'Scalable Schema Design for Large-Scale AI Applications',
        'Automated Batch Processing & Enterprise Workflows',
        'Data Validation, Quality Control & Compliance Standards',
        'Enterprise Data Pipeline Architecture',
        'JSON-Based AI System Integration & Deployment',
        'Performance Optimization for High-Volume Data Processing'
      ],
      testQuestions: [
        {
          question: 'What is the primary advantage of JSON prompts in enterprise AI applications?',
          options: ['Faster processing', 'Structured, predictable outputs for system integration', 'Smaller file sizes', 'Better graphics'],
          correctAnswer: 1
        },
        {
          question: 'Which approach is most important for enterprise data validation?',
          options: ['Speed optimization', 'Comprehensive schema validation and error handling', 'Visual presentation', 'File compression'],
          correctAnswer: 1
        },
        {
          question: 'What is critical when designing JSON schemas for enterprise systems?',
          options: ['Simplicity only', 'Scalability, maintainability, and compliance standards', 'Color coding', 'Font selection'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'ai-tools-5',
      title: 'Module 5: Enterprise AI Agents & Business Process Automation',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery - Professional Certification Program',
      dueDate: '2024-04-07',
      status: 'pending',
      description: '🤖 ENTERPRISE PROJECT: Design and deploy an intelligent business automation ecosystem for a Fortune 500 company using n8n, Zapier, Make.com, and custom AI agents. Automate complex workflows, integrate enterprise systems, and optimize business processes. Deliverables: Complete automation suite, ROI analysis, and deployment guide.',
      studyMaterials: [
        'n8n Enterprise Workflow Automation & Custom Node Development',
        'Zapier Professional AI Integrations & Enterprise Connectors',
        'Make.com Advanced Business Scenarios & Error Handling',
        'Custom AI Agent Development for Enterprise Applications',
        'Multi-Platform Integration Architecture & Security',
        'Enterprise Business Process Automation & Optimization',
        'AI Agent Deployment & Monitoring in Production',
        'Workflow Performance Analytics & ROI Measurement',
        'Enterprise Integration Security & Compliance'
      ],
      testQuestions: [
        {
          question: 'Which platform provides the most flexibility for custom enterprise AI agent development?',
          options: ['Basic Zapier', 'n8n with custom nodes and self-hosting', 'Simple IFTTT', 'Manual processes'],
          correctAnswer: 1
        },
        {
          question: 'What is the most critical factor when deploying AI agents in enterprise environments?',
          options: ['Speed only', 'Security, compliance, and error handling', 'Visual design', 'Cost reduction'],
          correctAnswer: 1
        },
        {
          question: 'How should enterprise AI automation ROI be measured?',
          options: ['Time saved only', 'Comprehensive metrics including efficiency, accuracy, and cost reduction', 'User satisfaction only', 'Technical performance only'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'ai-tools-6',
      title: 'Module 6: Enterprise Claude AI Mastery & Custom Application Development',
      courseId: 'ai-tools-mastery',
      courseName: 'A.I Tools Mastery - Professional Certification Program',
      dueDate: '2024-04-21',
      status: 'pending',
      description: '🚀 CAPSTONE PROJECT: Build a complete enterprise AI application using Claude AI for a Fortune 500 client. Develop custom solutions with advanced API integration, implement enterprise security, and create scalable AI-powered business applications. Deliverables: Full-stack AI application, technical documentation, and deployment strategy.',
      studyMaterials: [
        'Claude AI Enterprise Features & Advanced Capabilities',
        'Claude API Advanced Integration & Authentication',
        'Professional Claude Prompting & Optimization Techniques',
        'Claude for Enterprise Developers & System Architecture',
        'Building Production Applications with Claude API',
        'Claude Enterprise Security & Compliance Implementation',
        'Claude vs Other AI Models: Enterprise Comparison & Selection',
        'Custom Claude Workflows & Enterprise Automation',
        'Claude API Performance Optimization & Scaling',
        'Enterprise AI Application Deployment & Monitoring'
      ],
      testQuestions: [
        {
          question: 'What is Claude AI\'s primary enterprise advantage over other AI models?',
          options: ['Image generation capabilities', 'Superior long-form reasoning, safety, and enterprise compliance', 'Video creation features', 'Audio processing abilities'],
          correctAnswer: 1
        },
        {
          question: 'Which API endpoint is used for Claude enterprise text generation?',
          options: ['/v1/chat/completions', '/v1/messages', '/v1/generate', '/v1/claude'],
          correctAnswer: 1
        },
        {
          question: 'What is most critical when implementing Claude AI in enterprise environments?',
          options: ['Processing speed only', 'Security, compliance, and scalable architecture', 'User interface design', 'Cost optimization only'],
          correctAnswer: 1
        },
        {
          question: 'How should enterprise Claude AI applications be optimized?',
          options: ['Focus on speed only', 'Balance performance, accuracy, cost, and compliance requirements', 'Prioritize visual design', 'Minimize functionality'],
          correctAnswer: 1
        }
      ]
    },

    // Frontend Development - Beginner Course Assignments (Course ID: 'frontend-beginner')
    {
      id: 'frontend-beginner-1',
      title: 'HTML Part 1',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      dueDate: '2024-02-15',
      status: 'pending',
      description: 'Learn HTML basics and document structure.'
    },
    {
      id: 'frontend-beginner-2',
      title: 'HTML Part 2',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      dueDate: '2024-02-20',
      status: 'pending',
      description: 'Master HTML forms and semantic elements.'
    },

    {
      id: 'frontend-beginner-4',
      title: 'CSS Part 1',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      dueDate: '2024-03-01',
      status: 'pending',
      description: 'CSS fundamentals and styling basics.'
    },
    {
      id: 'frontend-beginner-5',
      title: 'CSS Part 2',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      dueDate: '2024-03-06',
      status: 'pending',
      description: 'Advanced CSS layouts and responsive design.'
    },
    {
      id: 'frontend-beginner-6',
      title: 'JavaScript Part 1',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      dueDate: '2024-03-11',
      status: 'pending',
      description: 'JavaScript basics and programming fundamentals.'
    },
    {
      id: 'frontend-beginner-7',
      title: 'JavaScript Part 2',
      courseId: 'frontend-beginner',
      courseName: 'Frontend Development - Beginner',
      dueDate: '2024-03-16',
      status: 'pending',
      description: 'DOM manipulation and interactive web development.'
    },

    // DevOps - Beginner Course Assignments (Course ID: 'devops-beginner')
    {
      id: 'devops-beginner-1',
      title: 'Assignment 1: Foundations Beyond DevOps Basics',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      dueDate: '2024-04-01',
      status: 'pending',
      description: 'Concept strengthening & industry awareness'
    },
    {
      id: 'devops-beginner-2',
      title: 'Assignment 2: Software Development Lifecycle & Release Strategies',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      dueDate: '2024-04-08',
      status: 'pending',
      description: 'How software moves from idea to production',
      studyMaterials: [
        'SDLC Phases: Requirement, Design, Develop, Test, Deploy, Maintain',
        'Agile vs Waterfall Methodologies',
        'CI/CD Concepts: Continuous Integration, Delivery, & Deployment',
        'Release Strategies: Blue-Green, Canary, Rolling Updates',
        'Semantic Versioning (Major.Minor.Patch)',
        'Environment Management (Dev, Staging, Prod)'
      ],
      testQuestions: [
        {
          question: 'Which release strategy involves running two identical environments (old and new) simultaneously?',
          options: ['Rolling Update', 'Blue-Green Deployment', 'Canary Release', 'Big Bang'],
          correctAnswer: 1
        },
        {
          question: 'What does "CI" stand for in CI/CD?',
          options: ['Continuous Improvement', 'Continuous Integration', 'Code Inspection', 'Cloud Infrastructure'],
          correctAnswer: 1
        },
        {
          question: 'Which methodology emphasizes iterative development and adaptability?',
          options: ['Waterfall', 'Agile', 'V-Model', 'Spiral'],
          correctAnswer: 1
        },
        {
          question: 'In Semantic Versioning (e.g., 1.2.3), what does the number "2" represent?',
          options: ['Major version', 'Minor version', 'Patch version', 'Build number'],
          correctAnswer: 1
        },
        {
          question: 'What is typically the first phase of the Software Development Lifecycle (SDLC)?',
          options: ['Testing', 'Deployment', 'Requirement Analysis', 'Coding'],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 'devops-beginner-3',
      title: 'Assignment 3: Networking & System Fundamentals for DevOps',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      dueDate: '2024-04-15',
      status: 'pending',
      description: 'What DevOps engineers must understand about systems',
      studyMaterials: [
        'OSI Model Layers (Focus on L4 Transport & L7 Application)',
        'TCP/IP Basics: IP Addressing, Subnets, DNS, DHCP',
        'Linux Process Management: ps, top, kill, systemd',
        'Linux File System Hierarchy & Permissions (chmod, chown)',
        'SSH & Remote Management Best Practices',
        'HTTP/HTTPS Protocols, Headers & Status Codes'
      ],
      testQuestions: [
        {
          question: 'Which port is the default for HTTPS traffic?',
          options: ['80', '22', '443', '8080'],
          correctAnswer: 2
        },
        {
          question: 'Which command is used to change file permissions in Linux?',
          options: ['chown', 'chmod', 'chgrp', 'passwd'],
          correctAnswer: 1
        },
        {
          question: 'Which OSI model layer is responsible for end-to-end communication (e.g., TCP, UDP)?',
          options: ['Layer 1 (Physical)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
          correctAnswer: 2
        },
        {
          question: 'What is the primary purpose of SSH (Secure Shell)?',
          options: ['Web browsing', 'Secure remote login and command execution', 'File compression', 'Database management'],
          correctAnswer: 1
        },
        {
          question: 'What function does DNS perform?',
          options: ['Encrypts data', 'Resolves domain names to IP addresses', 'Routes packets', 'Filters firewall traffic'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'devops-beginner-4',
      title: 'Assignment 4: Security Awareness & Access Management in DevOps',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      dueDate: '2024-04-22',
      status: 'pending',
      description: 'Beginner DevSecOps thinking',
      studyMaterials: [
        'Principle of Least Privilege',
        'IAM (Identity and Access Management) Fundamentals',
        'SSH Key Management vs Password Authentication',
        'Secrets Management: Environment Variables vs Vaults',
        'Firewall Basics: UFW, Security Groups, NACLs',
        'Common Vulnerabilities: OWASP Top 10 Awareness'
      ],
      testQuestions: [
        {
          question: 'What is the "Principle of Least Privilege"?',
          options: ['Giving users all access by default', 'Giving users only the access they need to do their job', 'Giving admins less access than users', 'Removing all access'],
          correctAnswer: 1
        },
        {
          question: 'Where should application secrets (API keys, DB passwords) be stored?',
          options: ['Hardcoded in source code', 'In public GitHub repositories', 'Environment variables or Secrets Manager', 'Text files on desktop'],
          correctAnswer: 2
        },
        {
          question: 'What does IAM stand for in the context of cloud security?',
          options: ['Internet Access Mode', 'Identity and Access Management', 'Internal Application Monitor', 'Infrastructure as Machine'],
          correctAnswer: 1
        },
        {
          question: 'Which of the following is a common host-based firewall for Linux?',
          options: ['Notepad', 'UFW (Uncomplicated Firewall)', 'Excel', 'VLC'],
          correctAnswer: 1
        },
        {
          question: 'What is the OWASP Top 10?',
          options: ['A list of the top 10 DevOps tools', 'A standard awareness document for the most critical web application security risks', 'A list of the top 10 cloud providers', 'A coding challenge'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'devops-beginner-5',
      title: 'Assignment 5: Performance, Reliability & Failure Handling',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      dueDate: '2024-04-29',
      status: 'pending',
      description: 'How systems behave under load and failure',
      studyMaterials: [
        'High Availability (HA) vs Fault Tolerance',
        'Load Balancing Strategies: Round Robin, Least Connections',
        'Monitoring Metrics: CPU, Memory, Latency, Throughput',
        'Logging Best Practices: Structured Logging, Log Levels',
        'Disaster Recovery Concepts: RTO (Recovery Time Objective) & RPO',
        'Scalability Types: Vertical vs Horizontal Scaling'
      ],
      testQuestions: [
        {
          question: 'What is "Horizontal Scaling"?',
          options: ['Adding more power (CPU/RAM) to an existing server', 'Adding more servers to the pool', 'Deleting servers', 'Upgrading the OS'],
          correctAnswer: 1
        },
        {
          question: 'What does RTO stand for in Disaster Recovery?',
          options: ['Real Time Optimization', 'Recovery Time Objective', 'Return To Origin', 'Rapid Task Organization'],
          correctAnswer: 1
        },
        {
          question: 'What is the primary function of a Load Balancer?',
          options: ['To encrypt data', 'To distribute incoming network traffic across multiple servers', 'To store backup files', 'To write code'],
          correctAnswer: 1
        },
        {
          question: 'What is "Structured Logging"?',
          options: ['Writing logs on paper', 'Writing logs in a consistent, machine-parsable format like JSON', 'Writing random notes', 'Logging only errors'],
          correctAnswer: 1
        },
        {
          question: 'What does "High Availability" aim to minimize?',
          options: ['Cost', 'Downtime', 'Security', 'Performance'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'devops-beginner-6',
      title: 'Assignment 6: DevOps Tools Ecosystem & Professional Practices',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      dueDate: '2024-05-06',
      status: 'pending',
      description: 'Industry tools, roles, and best practices',
      studyMaterials: [
        'The DevOps Periodic Table: Understanding the Tool Landscape',
        'Git & Version Control: Branching Strategies (GitFlow, Trunk-Based)',
        'Containerization (Docker) vs Virtualization (VMs)',
        'Orchestration: Kubernetes High-Level Overview',
        'Infrastructure as Code (IaC): Terraform & Ansible Concepts',
        'Collaboration Tools: Jira, Slack, & Documentation (Confluence)'
      ],
      testQuestions: [
        {
          question: 'Which tool is primarily used for "Infrastructure as Code"?',
          options: ['Photoshop', 'Terraform', 'Slack', 'Excel'],
          correctAnswer: 1
        },
        {
          question: 'What is the main difference between a Container and a VM?',
          options: ['Containers are larger', 'VMs share the OS kernel, Containers do not', 'Containers share the OS kernel, VMs have their own OS', 'No difference'],
          correctAnswer: 2
        },
        {
          question: 'What is "GitFlow"?',
          options: ['A type of coffee', 'A Git branching strategy', 'A network protocol', 'A programming language'],
          correctAnswer: 1
        },
        {
          question: 'What is Kubernetes primarily used for?',
          options: ['Word processing', 'Container Orchestration', 'Image editing', 'Video streaming'],
          correctAnswer: 1
        },
        {
          question: 'Which tool is commonly used for issue tracking and project management in DevOps?',
          options: ['Jira', 'Notepad', 'Paint', 'WinRAR'],
          correctAnswer: 0
        }
      ]
    },

    // Networking - Beginner Course Assignments (Course ID: 'networking-beginner')
    {
      id: 'networking-beginner-1',
      title: 'Assignment 1: Linux Network Interface Operations & Configuration',
      courseId: 'networking-beginner',
      courseName: 'Networking - Beginner',
      dueDate: '2024-06-15',
      status: 'pending',
      description: 'Hands-on interface configuration, IP addressing, routes, and DNS on Linux.'
    },
    {
      id: 'networking-beginner-2',
      title: 'Cisco Packet Tracer Basics',
      courseId: 'networking-beginner',
      courseName: 'Networking - Beginner',
      dueDate: '2024-06-22',
      status: 'pending',
      description: 'Build simple network topologies and simulate traffic in Packet Tracer.'
    },
    {
      id: 'networking-beginner-3',
      title: 'Ping, Traceroute, Netstat',
      courseId: 'networking-beginner',
      courseName: 'Networking - Beginner',
      dueDate: '2024-06-29',
      status: 'pending',
      description: 'Use core troubleshooting tools to test connectivity and inspect sockets.'
    },
    {
      id: 'networking-beginner-4',
      title: 'Nmap Scanning Basics',
      courseId: 'networking-beginner',
      courseName: 'Networking - Beginner',
      dueDate: '2024-07-06',
      status: 'pending',
      description: 'Perform safe host discovery and port scans; interpret common states.'
    },
    {
      id: 'networking-beginner-5',
      title: 'DNS and DHCP Fundamentals',
      courseId: 'networking-beginner',
      courseName: 'Networking - Beginner',
      dueDate: '2024-07-13',
      status: 'pending',
      description: 'Understand name resolution and dynamic addressing; verify and troubleshoot.'
    },
    {
      id: 'networking-beginner-6',
      title: 'Wireshark Traffic Analysis',
      courseId: 'networking-beginner',
      courseName: 'Networking - Beginner',
      dueDate: '2024-07-20',
      status: 'pending',
      description: 'Capture and analyze traffic; apply filters to inspect protocols and flows.'
    },

    // Networking - Intermediate Course Assignments (Course ID: 'networking-intermediate')
    {
      id: 'networking-intermediate-1',
      title: 'Advanced Linux Network Isolation',
      courseId: 'networking-intermediate',
      courseName: 'Networking - Intermediate',
      dueDate: '2024-08-10',
      status: 'pending',
      description: 'Hands-on with Linux network namespaces and isolation patterns.',
      studyMaterials: [
        'Linux Network Namespaces',
        'Process Isolation vs Network Isolation',
        'veth Pairs and Virtual Ethernet Devices',
        'Linux Loopback Behavior in Isolated Environments',
        'Namespace-Based Firewalling',
        'Per-Namespace Routing Tables',
        'DNS Handling Inside Network Namespaces',
        'Isolating Applications Using Network Namespaces',
        'Namespace Communication Models',
        'Namespace Cleanup and Resource Management',
        'Network Namespace Security Risks',
        'Namespace Performance Considerations',
        'Using Namespaces for Network Labs',
        'Troubleshooting Namespace Connectivity',
        'Real-World Use Cases of Network Namespaces'
      ]
    },
    {
      id: 'networking-intermediate-2',
      title: 'Dynamic Firewall and Security Rules',
      courseId: 'networking-intermediate',
      courseName: 'Networking - Intermediate',
      dueDate: '2024-08-17',
      status: 'pending',
      description: 'Advanced firewall concepts including conntrack, rule ordering, and monitoring.',
      studyMaterials: [
        'Stateful vs Stateless Firewalls in Linux',
        'Connection Tracking (conntrack) Internals',
        'Dynamic Firewall Rule Evaluation',
        'Firewall Rule Ordering and Optimization',
        'Rate Limiting Strategies in Firewalls',
        'Temporary IP Blocking Mechanisms',
        'Time-Based Firewall Rules',
        'Geo-IP Based Firewall Filtering',
        'Application-Aware Firewalling',
        'Firewall Rule Performance Tuning',
        'Detecting Firewall Rule Conflicts',
        'Logging Strategies for Security Events',
        'Firewall Hardening Best Practices',
        'Automated Firewall Rule Updates',
        'Real-Time Firewall Monitoring'
      ]
    },
    {
      id: 'networking-intermediate-3',
      title: 'High Availability Networking',
      courseId: 'networking-intermediate',
      courseName: 'Networking - Intermediate',
      dueDate: '2024-08-24',
      status: 'pending',
      description: 'Designing redundant, resilient networks with bonding and failover.',
      studyMaterials: [
        'Concepts of High Availability in Networks',
        'Network Redundancy Design Principles',
        'Linux Bonding Architecture',
        'Failover Detection Mechanisms',
        'Active-Passive Network Designs',
        'Active-Active Network Designs',
        'Link Monitoring and Health Checks',
        'Switch Requirements for Aggregation',
        'High Availability in Virtualized Environments',
        'NIC Failover Scenarios',
        'High Availability with Multiple Gateways',
        'Split-Brain Scenarios in Networking',
        'Network Downtime Analysis',
        'Testing High Availability Setups',
        'Enterprise High Availability Case Studies'
      ]
    },
    {
      id: 'networking-intermediate-4',
      title: 'Enterprise Routing & Segmentation',
      courseId: 'networking-intermediate',
      courseName: 'Networking - Intermediate',
      dueDate: '2024-08-31',
      status: 'pending',
      description: 'Policy-based routing, segmentation, and multi-gateway architectures.',
      studyMaterials: [
        'Fundamentals of Enterprise Routing',
        'Static vs Dynamic Routing Comparison',
        'Policy-Based Routing Concepts',
        'Source-Based Routing',
        'Destination-Based Routing',
        'Traffic Segmentation Strategies',
        'Inter-VLAN Routing Concepts',
        'Routing Between Isolated Networks',
        'Routing Failover Design',
        'Multi-Gateway Network Architectures',
        'Traffic Flow Analysis',
        'Routing Loop Detection',
        'Route Priority and Metrics',
        'Enterprise Network Segmentation Models',
        'Troubleshooting Routing Issues'
      ]
    },
    {
      id: 'networking-intermediate-5',
      title: 'Secure Network Tunnels and VPNs',
      courseId: 'networking-intermediate',
      courseName: 'Networking - Intermediate',
      dueDate: '2024-09-07',
      status: 'pending',
      description: 'Tunneling fundamentals, encryption, performance, and enterprise VPN design.',
      studyMaterials: [
        'Fundamentals of Network Tunneling',
        'Encryption vs Encapsulation',
        'Site-to-Site VPN Concepts',
        'Remote Access VPN Models',
        'Authentication Methods in VPNs',
        'Key Exchange Mechanisms',
        'Tunnel Interface Design',
        'VPN Performance Optimization',
        'Split Tunneling vs Full Tunneling',
        'Secure Access for Remote Employees',
        'VPN Failover Strategies',
        'Tunnel Security Threats',
        'VPN Logging and Auditing',
        'VPN Compliance and Policies',
        'Enterprise VPN Architecture Examples'
      ]
    },
    {
      id: 'networking-intermediate-6',
      title: 'Monitoring, Logging, and Performance Tools',
      courseId: 'networking-intermediate',
      courseName: 'Networking - Intermediate',
      dueDate: '2024-09-14',
      status: 'pending',
      description: 'Enterprise-grade network monitoring, logging, and performance analysis.',
      studyMaterials: [
        'Importance of Network Monitoring',
        'Active vs Passive Monitoring',
        'Performance Metrics and KPIs',
        'Network Baseline Concepts',
        'Bandwidth Utilization Analysis',
        'Latency, Jitter, and Packet Loss',
        'Log Collection Strategies',
        'Centralized Logging Architecture',
        'Log Retention and Compliance',
        'Alerting and Notification Systems',
        'Incident Detection Using Logs',
        'Root Cause Analysis Techniques',
        'Performance Bottleneck Identification',
        'Capacity Planning Basics',
        'Network Monitoring in Enterprise Environments'
      ]
    },

    // Frontend Development - Intermediate Course Assignments (Course ID: 'frontend-intermediate')
    {
      id: 'frontend-intermediate-1',
      title: '1. Assignment 1 — Mastering Developer Tools & Frontend Debugging',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      dueDate: '2024-05-01',
      status: 'pending',
      description: 'Focus: Chrome DevTools, Performance tab, Lighthouse, debugging JS/React issues, network analysis.'
    },
    {
      id: 'frontend-intermediate-2',
      title: '2. Assignment 2 — Version Control & Industry-Standard Git Workflow',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      dueDate: '2024-05-08',
      status: 'pending',
      description: 'Focus: Git, GitHub, branching strategies, PR workflow, merge conflicts, issue tracking.'
    },
    {
      id: 'frontend-intermediate-3',
      title: '3. Assignment 3 — API Consumption, Error Handling & Data Security Basics',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      dueDate: '2024-05-15',
      status: 'pending',
      description: 'Focus: Secure API consumption, error boundaries in React, handling edge cases, rate limits, CORS.'
    },
    {
      id: 'frontend-intermediate-4',
      title: '4. Assignment 4 — UI/UX Fundamentals Every Frontend Engineer Must Know',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      dueDate: '2024-05-22',
      status: 'pending',
      description: 'Focus: Design thinking, accessibility (a11y), usability heuristics, color psychology, ARIA roles.'
    },
    {
      id: 'frontend-intermediate-5',
      title: '5. Assignment 5 — State Management Beyond Basics',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      dueDate: '2024-05-29',
      status: 'pending',
      description: 'Focus: Context API advanced usage, localStorage/sessionStorage syncing, reducers, global state patterns.'
    },
    {
      id: 'frontend-intermediate-6',
      title: '6. Assignment 6 — Testing Frontend Applications',
      courseId: 'frontend-intermediate',
      courseName: 'Frontend Development - Intermediate',
      dueDate: '2024-06-05',
      status: 'pending',
      description: 'Focus: Unit testing (Jest), component testing (React Testing Library), mocking APIs, snapshot testing.'
    },

    {
      id: 'cyber-security-1',
      title: 'Fundamentals of Cyber Security Governance & Risk',
      courseId: 'cyber-security-beginner',
      courseName: 'Cyber Security - Beginner',
      dueDate: '2025-01-15',
      status: 'pending',
      description: 'Understand security governance frameworks, risk management, compliance, and policy foundations.'
    },
    {
      id: 'cyber-security-2',
      title: 'Secure Software Development & Web Vulnerabilities',
      courseId: 'cyber-security-beginner',
      courseName: 'Cyber Security - Beginner',
      dueDate: '2025-01-22',
      status: 'pending',
      description: 'Learn secure SDLC, OWASP Top 10, input validation, authentication, and common web vulnerabilities.'
    },
    {
      id: 'cyber-security-3',
      title: 'Malware, Threat Intelligence & Incident Response',
      courseId: 'cyber-security-beginner',
      courseName: 'Cyber Security - Beginner',
      dueDate: '2025-01-29',
      status: 'pending',
      description: 'Identify malware types, use threat intelligence sources, and practice basic incident response workflows.'
    },
    {
      id: 'cyber-security-4',
      title: 'Advanced Network Security & Defense Mechanisms',
      courseId: 'cyber-security-beginner',
      courseName: 'Cyber Security - Beginner',
      dueDate: '2025-02-05',
      status: 'pending',
      description: 'Explore firewalls, IDS/IPS, segmentation, VPNs, and secure network architecture principles.'
    },
    {
      id: 'cyber-security-5',
      title: 'Ethical Hacking Tools, OSINT & Exploit Techniques',
      courseId: 'cyber-security-beginner',
      courseName: 'Cyber Security - Beginner',
      dueDate: '2025-02-12',
      status: 'pending',
      description: 'Practice ethical hacking workflows, OSINT gathering, reconnaissance, and basic exploitation concepts.'
    },
    {
      id: 'cyber-security-6',
      title: 'Emerging Technologies & Cybersecurity Trends',
      courseId: 'cyber-security-beginner',
      courseName: 'Cyber Security - Beginner',
      dueDate: '2025-02-19',
      status: 'pending',
      description: 'Review modern threats and defenses across AI, cloud, mobile, IoT, and evolving security landscapes.'
    },

    // Cyber Security - Intermediate Course Assignments (Course ID: 'cyber-security-intermediate')
    {
      id: 'cyber-security-intermediate-1',
      title: 'Assignment 1: Network Security & Fundamentals',
      courseId: 'cyber-security-intermediate',
      courseName: 'Cyber Security - Intermediate',
      dueDate: '2024-08-01',
      status: 'pending',
      description: 'Deep dive into network protocols and securing infrastructure. Analyze packet captures and identify security flaws.'
    },
    {
      id: 'cyber-security-intermediate-2',
      title: 'Assignment 2: Web & Application Security',
      courseId: 'cyber-security-intermediate',
      courseName: 'Cyber Security - Intermediate',
      dueDate: '2024-08-08',
      status: 'pending',
      description: 'Analyzing and securing web applications against common vulnerabilities like SQL Injection and XSS.'
    },
    {
      id: 'cyber-security-intermediate-3',
      title: 'Assignment 3: Cryptography & Data Security',
      courseId: 'cyber-security-intermediate',
      courseName: 'Cyber Security - Intermediate',
      dueDate: '2024-08-15',
      status: 'pending',
      description: 'Implementing encryption and protecting data at rest and in transit. Practice with symmetric and asymmetric encryption tools.'
    },
    {
      id: 'cyber-security-intermediate-4',
      title: 'Assignment 4: Malware & Threat Analysis',
      courseId: 'cyber-security-intermediate',
      courseName: 'Cyber Security - Intermediate',
      dueDate: '2024-08-22',
      status: 'pending',
      description: 'Deep dive into malware types, analysis techniques, and threat mitigation strategies.'
    },
    {
      id: 'cyber-security-intermediate-5',
      title: 'Assignment 5: Cyber Attack & Defense Techniques',
      courseId: 'cyber-security-intermediate',
      courseName: 'Cyber Security - Intermediate',
      dueDate: '2024-08-29',
      status: 'pending',
      description: 'Mastering attack methodologies and implementing robust defense strategies.'
    },
    {
      id: 'cyber-security-intermediate-6',
      title: 'Assignment 6: Security Tools, Scripting & Automation',
      courseId: 'cyber-security-intermediate',
      courseName: 'Cyber Security - Intermediate',
      dueDate: '2024-09-05',
      status: 'pending',
      description: 'Mastering security automation, scripting, and tools for efficient defense.'
    },

  ];

  // Purchase history - use enrolledCourses for enrolled courses summary
  // const enrolledCourses = courses; // Now courses contains only enrolled courses from backend

  const purchaseHistory: PurchaseHistory[] = [
    {
      id: '1',
      courseId: 'AI-TOOLS-MASTERY',
      courseName: 'AI Tools Mastery',
      instructor: 'Rohan Sharma',
      purchaseDate: '2024-01-15',
      amount: 4999,
      status: 'completed'
    },
    {
      id: '3',
      courseId: 'DEVOPS-BEGINNER',
      courseName: 'DevOps – Beginner',
      instructor: 'Rohan Sharma',
      purchaseDate: '2024-03-10',
      amount: 9999,
      status: 'completed'
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Overview', icon: Squares2X2Icon },
    { id: 'courses', label: 'My Courses', icon: BookOpenIcon },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'browse-courses', label: 'Browse Courses', icon: GlobeAltIcon },
    { id: 'community', label: 'Community', icon: Users, badge: 'New' },
    { id: 'history', label: 'History', icon: History },
  ];

  const mergeProgressWithLocalStorage = (
    enrolledCourses: { courseId?: string; id?: string; progress?: number; enrollmentDate?: string; status?: string; modules?: { length: number }[] }[]
  ) => {
    return enrolledCourses.reduce((acc: Record<string, CourseProgress>, course) => {
      const courseId = course.courseId || course.id || '';
      const aliases = getCourseIdMapping(courseId);
      const local: CourseLessonProgressRecord | null = getStoredProgressForCourse(courseId, aliases);
      const backendProgress = course.progress || 0;
      const localProgress = local?.progress ?? 0;
      const progress = Math.max(backendProgress, localProgress);
      const totalLessons =
        local?.totalLessons ?? (course.modules?.length ? course.modules.length * 5 : 20);

      acc[courseId] = {
        courseId,
        progress,
        completedLessons: local?.completedLessons ?? 0,
        totalLessons,
        lastAccessedAt: local?.lastUpdated || course.enrollmentDate || new Date().toISOString(),
        nextLesson: progress > 0 ? 'Continue Learning' : 'Start Course',
        isStarted: progress > 0 || course.status === 'active',
      };
      return acc;
    }, {});
  };

  const refreshProgressFromStorage = () => {
    if (enrolledCoursesData.length === 0) return;
    setCourseProgress(mergeProgressWithLocalStorage(enrolledCoursesData));
  };

  // Maintain active tab locally; no BubbleMenu hashes
  useEffect(() => {
    // Default to dashboard
    if (!activeTab) setActiveTab('dashboard');
  }, []);

  useEffect(() => {
    const onProgressUpdated = () => refreshProgressFromStorage();
    window.addEventListener('student-progress-updated', onProgressUpdated);
    window.addEventListener('focus', onProgressUpdated);
    return () => {
      window.removeEventListener('student-progress-updated', onProgressUpdated);
      window.removeEventListener('focus', onProgressUpdated);
    };
  }, [enrolledCoursesData]);

  useEffect(() => {
    const state = location.state as { activeTab?: string } | null;
    if (state && state.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    const authToken = localStorage.getItem('authToken');
    
    // Redirect if no user data in localStorage
    if (!currentUser) {
      handleUnauthorized();
      return;
    }

    // Safely parse currentUser JSON
    let userData: any;
    try {
      userData = JSON.parse(currentUser);
    } catch (parseError) {
      
      handleUnauthorized();
      return;
    }

    // Verify user is authenticated
    if (!userData.isAuthenticated) {
      handleUnauthorized();
      return;
    }

    // Verify token exists
    const token = userData.token || authToken;
    if (!token) {
      handleUnauthorized();
      return;
    }

    const buildProfileFromUser = (data: Record<string, unknown>, enrolledCount = 0) => {
      const first = String(data.firstName ?? '').trim();
      const last = String(data.lastName ?? '').trim();
      const fullName = [first, last].filter(Boolean).join(' ').trim();
      const email = String(data.email ?? '').trim();
      return {
        name: fullName || String(data.username ?? '').trim() || 'Student',
        email: email || 'Not provided',
        enrolledCourses: enrolledCount,
        phone: String(data.phone ?? '') || 'Not provided',
        location:
          data.address && typeof data.address === 'object'
            ? [(data.address as { city?: string }).city, (data.address as { state?: string }).state]
                .filter(Boolean)
                .join(', ') || 'Not provided'
            : 'Not provided',
        joinDate: String(data.createdAt ?? new Date().toISOString()),
        studentId: String(data.studentId ?? '') || 'Not assigned',
        dateOfBirth: data.dateOfBirth as string | undefined,
        education: data.education as string | undefined,
        experience: data.experience as string | undefined,
      };
    };

    const studentDocId = userData._id || userData.id;
    setStudentProfile(buildProfileFromUser(userData, purchasedCourses.length));

    const loadStudentData = async () => {
      const profileId = studentDocId ? String(studentDocId) : String(userData.id || userData._id);
      let enrolledCount = Array.isArray(userData.enrolledCourses)
        ? userData.enrolledCourses.length
        : purchasedCourses.length;

      try {
        // Fetch purchased courses from backend
        const coursesResponse = await fetch(`${BASE_URL}/api/courses/purchased/${userData.email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Handle unauthorized response for courses fetch
        if (coursesResponse.status === 401) {
          
          handleUnauthorized();
          return;
        }

        if (coursesResponse.ok) {
          const result = await coursesResponse.json();

          if (result.success && result.data) {
            // Backend now returns full course details with enrollment info
            let enrolledCourses = result.data || [];

            // Fix course titles from backend
            enrolledCourses = enrolledCourses.map((course: any) => {
              if (course.title === 'DevOps Fundamentals') {
                return { ...course, title: 'DevOps – Beginner' };
              }
              return course;
            });

            // Set purchased courses (just the IDs for compatibility)
            const courseIds = enrolledCourses.map((course: any) => course.courseId || course.id);
            setPurchasedCourses(courseIds);
            
            // Set the full course data for display
            setEnrolledCoursesData(enrolledCourses);
            
            // Update enrolled count
            enrolledCount = enrolledCourses.length;
            console.log('Enrolled Course Data', enrolledCourses);
            
            // Use mergeProgressWithLocalStorage to keep progress from localStorage
            const progress = mergeProgressWithLocalStorage(enrolledCourses);
            setCourseProgress(progress);
            console.log('Set course progress:', progress);
            
            // Fetch module submissions for each enrolled course
            for (const course of enrolledCourses) {
              const courseId = course.id; // Use the MongoDB _id
              await fetchModuleSubmissions(profileId, courseId);
            }
          } else {
            // Backend returned success but no data
            setPurchasedCourses([]);
            setEnrolledCoursesData([]);
            setCourseProgress({});
          }
        } else {
          // Non-401 error from courses endpoint
          
          setPurchasedCourses([]);
          setEnrolledCoursesData([]);
          setCourseProgress({});
        }

        // Fetch additional student data from backend (must use student document _id)
        let studentData = { ...userData };
        const studentResponse = await fetch(`${BASE_URL}/api/students/profile/${profileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Handle unauthorized response for student data fetch
        if (studentResponse.status === 401) {
          
          handleUnauthorized();
          return;
        }

        if (studentResponse.ok) {
          const result = await studentResponse.json();
          console.log('Result Data IN student portal:', result.data);
          if (result.success && result.data) {
            studentData = { ...userData, ...result.data };
          }
        } else {
          console.log(
            'Could not fetch student profile from backend, using login session data',
            studentResponse.status
          );
        }

        setStudentProfile(buildProfileFromUser(studentData, enrolledCount));

      } catch (error) {
        console.error('Error loading student data:', error);
        setStudentProfile(buildProfileFromUser(userData, purchasedCourses.length));
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, [navigate]);

  const handleContinueLearning = (courseId: string) => {
    // Check payment confirmation status before allowing access
    const courseData = enrolledCoursesData.find(c => c.courseId === courseId);
    const confirmationStatus = courseData?.confirmationStatus || 'unknown';
    const paymentStatus = courseData?.paymentStatus || 'unknown';
    
    
    // Allow access if payment is confirmed by admin
    const isAccessAllowed = confirmationStatus === 'confirmed';
    
    if (!isAccessAllowed) {
      if (confirmationStatus === 'waiting_for_confirmation') {
        alert('⏳ Your payment is being verified. Course access will be granted within 24 hours after confirmation.');
      } else if (confirmationStatus === 'rejected') {
        alert('❌ Your payment was rejected. Please contact support or submit a new payment to access this course.');
      } else {
        alert('❓ Payment status unknown. Please contact support for assistance.');
      }
      return;
    }
    
    // Navigate to course content/study material based on course ID
    
    const courseRoutes: { [key: string]: string } = {
      'frontend-beginner': '/frontend-development-beginner',
      'FRONTEND-BEGINNER': '/frontend-development-beginner',
      'Frontend Development - Beginner': '/frontend-development-beginner',
      'frontend-intermediate': '/frontend-development-intermediate',
      'frontend-development-intermediate': '/frontend-development-intermediate',
      'FRONTEND-INTERMEDIATE': '/frontend-development-intermediate',
      'frontend-advanced': '/course-learning-advanced/frontend-advanced/advanced-react/performance-optimization',
      'devops-beginner': '/devops-beginner',
      'DEVOPS-BEGINNER': '/devops-beginner',
      'devops-advanced': '/course-learning-devops-advanced/devops-advanced/kubernetes/cluster-management',
      'DEVOPS-ADVANCED': '/course-learning-devops-advanced/devops-advanced/kubernetes/cluster-management',
      'mobile-advanced': '/course-learning-mobile-advanced/mobile-advanced/react-native/navigation',
      'browser-extensions': '/course-learning-browser-extensions/browser-extensions/extension-fundamentals/manifest-files',
      'ai-tools-mastery': '/ai-study-material',
      'AI-TOOLS-MASTERY': '/ai-study-material',
      'networking-beginner': '/networking-beginner',
      'NETWORKING-BEGINNER': '/networking-beginner',
      'networking-intermediate': '/networking-intermediate',
      'NETWORKING-INTERMEDIATE': '/networking-intermediate',
      'cyber-security-beginner': '/cyber-security-beginner/module/module-1',
      'CYBER-SECURITY-BEGINNER': '/cyber-security-beginner/module/module-1',
      'cybersecurity-beginner': '/cyber-security-beginner/module/module-1',
      'CYBERSECURITY-BEGINNER': '/cyber-security-beginner/module/module-1',
      'cyber-security-intermediate': '/cyber-security-intermediate/module/module-1',
      'CYBER-SECURITY-INTERMEDIATE': '/cyber-security-intermediate/module/module-1',
      'cybersecurity-intermediate': '/cyber-security-intermediate/module/module-1',
      'CYBERSECURITY-INTERMEDIATE': '/cyber-security-intermediate/module/module-1',
      'cyber-security-advanced': '/cyber-security-advanced',
      'CYBER-SECURITY-ADVANCED': '/cyber-security-advanced',
      'cybersecurity-advanced': '/cyber-security-advanced',
      'data-science-beginner': '/data-science-beginner/module/module-1',
      'DATA-SCIENCE-BEGINNER': '/data-science-beginner/module/module-1'
    };

    const mappingKeys = getCourseIdMapping(courseId);
    let route: string | undefined;

    for (const key of mappingKeys) {
      const mappedRoute = courseRoutes[key];
      if (mappedRoute) {
        route = mappedRoute;
        break;
      }
    }

    if (!route) {
      route = courseRoutes[courseId];
    }

    if (route) {
      navigate(route);
    } else {
      navigate(`/course-learning/${courseId}/module-1/lesson-1`);
    }
  };

  const handlePurchaseCourse = (courseId: string) => {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;

    if (purchasedCourses.includes(courseId)) {
      alert('You have already purchased this course!');
      return;
    }

    navigate(`/course-enrollment/${courseId}`, {
      state: { from: 'student-portal-browse' }
    });
  };

  const handleCourseDetails = (course: Course) => {
    setSelectedCourseForDetails(course);
    setShowCourseDetails(true);
  };



  const handleReferralCodeChange = async (code: string) => {
    setReferralCode(code);
    if (paymentModalData) {
      // Block referral codes for AI Tools Mastery program
      if (isAIToolsMasterySelected) {
        setPaymentModalData({
          ...paymentModalData,
          discount: 0,
          discountedPrice: paymentModalData.originalPrice,
          referralCode: ''
        });
        return;
      }
      if (code.trim() === '') {
        // Reset to original price if no code
        setPaymentModalData({
          ...paymentModalData,
          discount: 0,
          discountedPrice: paymentModalData.originalPrice,
          referralCode: ''
        });
        return;
      }

      try {
        // Verify referral code with backend
        const response = await fetch(`${BASE_URL}/api/courses/verify-referral`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            referralCode: code.toUpperCase()
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.valid) {
            const discount = result.discount;
            const discountedPrice = paymentModalData.originalPrice * (1 - discount / 100);
            setPaymentModalData({
              ...paymentModalData,
              discount,
              discountedPrice,
              referralCode: code.toUpperCase()
            });
          } else {
            // Invalid code - reset to original price
            setPaymentModalData({
              ...paymentModalData,
              discount: 0,
              discountedPrice: paymentModalData.originalPrice,
              referralCode: code.toUpperCase()
            });
          }
        }
      } catch (error) {
        
        // On error, reset to original price
        setPaymentModalData({
          ...paymentModalData,
          discount: 0,
          discountedPrice: paymentModalData.originalPrice,
          referralCode: code.toUpperCase()
        });
      }
    }
  };

  const processPayment = async () => {
    if (!paymentModalData || !transactionId.trim()) {
      alert('Please enter a valid transaction ID');
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      // Get current user from localStorage
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('Please log in to continue');
        return;
      }

      const userData = JSON.parse(currentUser);
      
      // Submit payment with transaction ID
      const paymentResponse = await fetch(`${BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transactionId.trim(),
          studentId: userData.id || userData._id,
          courseId: paymentModalData.course.id,
          courseName: paymentModalData.course.title,
          amount: paymentModalData.discountedPrice,
          originalAmount: paymentModalData.originalPrice,
          studentName: userData.name || `${userData.firstName} ${userData.lastName}`,
          studentEmail: userData.email,
          referralCode: paymentModalData.referralCode || null,
          metadata: {
            paymentMethod: 'manual_qr',
            submittedAt: new Date().toISOString()
          }
        })
      });
      
      if (paymentResponse.ok) {
        const result = await paymentResponse.json();
        if (result.success) {
          // Show success message
          alert(`Payment submitted successfully! Your course will be listed in "My Courses" tab shortly after confirmation of payment in max 24hrs. Transaction ID: ${transactionId}`);
          
          // Close modal and reset form
          setShowPaymentModal(false);
          setPaymentModalData(null);
          setReferralCode('');
          setTransactionId('');
          
          // Switch to My Courses tab
          setActiveTab('courses');
        } else {
          alert('Failed to submit payment. Please try again.');
        }
      } else {
        const errorData = await paymentResponse.json();
        // Friendly handling when backend indicates student is already enrolled
        if (typeof errorData?.message === 'string' && errorData.message.toLowerCase().includes('already enrolled')) {
          alert('You are already enrolled in this course. Please check the My Courses tab to continue learning.');
          // Close modal and guide user to courses
          setShowPaymentModal(false);
          setPaymentModalData(null);
          setReferralCode('');
          setTransactionId('');
          setActiveTab('courses');
        } else {
          alert(errorData.message || 'Failed to submit payment. Please try again.');
        }
      }
    } catch (error) {
      
      alert('Error submitting payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };



  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-6 max-w-full">

            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-bold">My Courses</h2>
              <button
                onClick={() => {
                  setIsLoading(true);
                  const loadStudentData = async () => {
                    try {
                      const currentUser = localStorage.getItem('currentUser');
                      if (!currentUser) return;
                      
                      const userData = JSON.parse(currentUser);
                      const response = await fetch(`${BASE_URL}/api/courses/purchased/${userData.email}`, {
                        headers: {
                          Authorization: `Bearer ${userData.token}`
                        }
                      });
                      if (response.ok) {
                        const result = await response.json();
                        if (result.success && result.data) {
                          const enrolledCoursesData = result.data || [];
                          const courseIds = enrolledCoursesData.map((course: any) => course.courseId || course.id);
                          setPurchasedCourses(courseIds);
                          setEnrolledCoursesData(enrolledCoursesData);
                          
                          setCourseProgress(mergeProgressWithLocalStorage(enrolledCoursesData));
                        }
                      }
                    } catch (error) {
                      
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  loadStudentData();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Status
              </button>
            </div>
            
            {/* Assignment Information Message */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📚</span>
                </div>
                <div>
                  <h3 className="text-blue-400 font-semibold">Assignment Information</h3>
                  <p className="text-gray-300 text-sm">
                    Assignments will be available after completing the first two modules of each course. 
                    Keep learning to unlock your assignments!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 max-w-full">
              {enrolledCourses.map((course) => {
                const progress = courseProgress[course.id] || {
                  progress: 0,
                  completedLessons: 0,
                  totalLessons: 20,
                  nextLesson: 'Introduction to Course',
                  isStarted: false
                };
                
                // Use payment and enrollment status from course data
                const confirmationStatus = course.confirmationStatus || course.enrollmentConfirmationStatus || 'unknown';
                const enrollmentStatus = course.enrollmentStatus || course.status || 'unknown';
                const transactionId = course.transactionId;
                
                // Debug logging
                
                // Simplified and more flexible access logic
                // Priority: Payment confirmation status > Enrollment status > Payment status
                const isAccessAllowed = (
                  confirmationStatus === 'confirmed' || 
                  course.paymentStatus === 'completed' ||
                  (course.adminConfirmedBy && course.adminConfirmedAt) // Admin confirmed the payment
                );
                
                const isRejected = (
                  confirmationStatus === 'rejected' || 
                  enrollmentStatus === 'payment_rejected' ||
                  course.paymentStatus === 'failed'
                );
                
                const isPending = (
                  confirmationStatus === 'waiting_for_confirmation' || 
                  enrollmentStatus === 'pending_payment' ||
                  course.paymentStatus === 'pending' ||
                  (!isAccessAllowed && !isRejected && course.transactionId) // Has transaction but not confirmed
                );
                
                const hasNoPayment = (
                  confirmationStatus === 'no_payment_record' ||
                  (!course.transactionId && !course.paymentId)
                );
                
                
                return (
                  <div key={course.id} className="bg-gray-800 rounded-lg p-6 w-full max-w-full">
                    {/* Payment Status Info Bar */}
                    {!isAccessAllowed && (
                      <div className={`mb-4 p-3 rounded-lg border ${
                        isPending ? 'bg-yellow-900/20 border-yellow-600/30' :
                        isRejected ? 'bg-red-900/20 border-red-600/30' :
                        hasNoPayment ? 'bg-blue-900/20 border-blue-600/30' :
                        'bg-gray-900/20 border-gray-600/30'
                      }`}>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`w-2 h-2 rounded-full ${
                            isPending ? 'bg-yellow-500' :
                            isRejected ? 'bg-red-500' :
                            hasNoPayment ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}></span>
                          <span className={`font-medium ${
                            isPending ? 'text-yellow-400' :
                            isRejected ? 'text-red-400' :
                            hasNoPayment ? 'text-blue-400' :
                            'text-gray-400'
                          }`}>
                            {isPending ? 'Payment Pending Admin Confirmation' :
                             isRejected ? 'Payment Rejected - Please Contact Support' :
                             hasNoPayment ? 'No Payment Record Found' :
                             enrollmentStatus === 'pending_payment' ? 'Course Added - Awaiting Payment Confirmation' :
                             'Payment Status Unknown'}
                          </span>
                        </div>
                        {transactionId && (
                          <p className="text-gray-400 text-xs mt-1">
                            Transaction ID: {transactionId}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white text-lg font-semibold">{course.title}</h4>
                          {/* Show status badges */}
                          {isAccessAllowed && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-600/20 text-green-400 rounded-full">
                              ✅ Active
                            </span>
                          )}
                          {isPending && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-600/20 text-yellow-400 rounded-full">
                              ⏳ Pending
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-600/20 text-red-400 rounded-full">
                              ❌ Rejected
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm mt-1">
                          Duration: {course.duration}
                        </p>
                        {transactionId && (
                          <p className="text-gray-500 text-xs mt-1">
                            Transaction ID: {transactionId}
                          </p>
                        )}
                        
                        {/* Payment Status Message */}
                        {isPending && (
                          <div className="mt-2 p-2 bg-yellow-600/20 border border-yellow-600/30 rounded text-yellow-300 text-xs max-w-md">
                            💳 Payment verification in progress. Course access will be granted within 24 hours after confirmation.
                          </div>
                        )}
                        {isRejected && (
                          <div className="mt-2 p-2 bg-red-600/20 border border-red-600/30 rounded text-red-300 text-xs max-w-md">
                            ❌ Payment was rejected. Please contact support or submit a new payment.
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {isAccessAllowed && (
                          <button
                            onClick={() => handleContinueLearning(course.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            {progress.isStarted && progress.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                          </button>
                        )}
                        {isPending && (
                          <div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-600 text-yellow-100">
                              Pending
                            </span>
                          </div>
                        )}
                        {isRejected && (
                          <button
                            onClick={() => alert('Please contact support to resolve payment issues or submit a new payment.')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Contact Support
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-6 max-w-6xl mx-auto">
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold">Assignments</h2>
            
            {/* Course Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4">Select Course</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCourses
                  .filter(course => isCourseAccessible(course.id))
                  .map(course => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourseForAssignments(course.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCourseForAssignments === course.id
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <BookOpenIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{course.title}</h4>
                          <p className="text-sm text-gray-400">{typeof course.instructor === 'string' ? course.instructor : course.instructor.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                              {course.level}
                            </span>
                            <span className="text-xs text-gray-400">{course.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {allCourses.filter(course => isCourseAccessible(course.id)).length === 0 && (
                <div className="text-center py-8">
                  <BookOpenIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No enrolled courses found. Please enroll in a course to view assignments.</p>
                </div>
              )}
            </div>

            {selectedCourseForAssignments && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-white text-lg font-semibold mb-4">Assignment Summary</h3>
                {(() => {
                  const mappedIds = getCourseIdMapping(selectedCourseForAssignments);
                  const courseAssignments = assignments.filter(assignment => 
                    mappedIds.includes(assignment.courseId)
                  );
                  const totalAssignments = assignmentSummary?.total ?? courseAssignments.length;
                  const completedAssignments = assignmentSummary?.completed ?? courseAssignments.filter(a => (a.grade || 0) >= 5).length;
                  const pendingAssignments = assignmentSummary?.pending ?? Math.max(totalAssignments - completedAssignments, 0);

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{totalAssignments}</div>
                        <div className="text-gray-400 text-sm">Total</div>
                      </div>
                      <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{completedAssignments}</div>
                        <div className="text-gray-400 text-sm">Completed (score ≥ 5)</div>
                      </div>
                      <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400">{pendingAssignments}</div>
                        <div className="text-gray-400 text-sm">Pending</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Assignments List */}
            {selectedCourseForAssignments && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments
                .filter(assignment => {
                  const mappedIds = getCourseIdMapping(selectedCourseForAssignments);
                  return mappedIds.includes(assignment.courseId);
                })
                .map((assignment) => (
                <button
                  key={assignment.id}
                  onClick={() => {
                    // Navigate using the actual assignment ID without remapping
                    navigate(`/assignment/${assignment.id}`);
                  }}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white text-lg font-semibold">{assignment.title}</h4>
                      <p className="text-gray-400 text-sm">{assignment.courseName}</p>
                      <p className="text-gray-300 text-sm mt-2">{assignment.description}</p>
                    </div>
                    {(() => {
                      const rawStatus = assignmentStatuses[assignment.id] || assignment.status;
                      const isCompleted = rawStatus === 'graded' || (assignment.grade || 0) >= 5;
                      const label = isCompleted ? 'Completed' : (rawStatus === 'submitted' ? 'Submitted' : 'Pending');
                      const cls = isCompleted
                        ? 'bg-green-600 text-green-100'
                        : (rawStatus === 'submitted' ? 'bg-blue-600 text-blue-100' : 'bg-yellow-600 text-yellow-100');
                      return (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
                          {label}
                        </span>
                      );
                    })()}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <BookOpenIcon className="w-4 h-4" />
                      <span>Study & Test</span>
                    </div>
                    <div className="text-blue-400 text-sm">Click to start →</div>
                  </div>
                </button>
              ))}
              </div>
            )}
          
          {!selectedCourseForAssignments && (
            <div className="text-center text-gray-400 py-8">
              <ClipboardDocumentListIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a course to view its assignments</p>
            </div>
          )}
          </div>
        );
      case 'browse-courses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-2xl font-bold">Browse Courses</h2>
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-black/50 text-white hover:bg-gray-800 border border-gray-700'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer"
                  onClick={() => handleCourseDetails(course)}
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        course.level === 'beginner' 
                          ? 'bg-green-500 text-white' 
                          : course.level === 'intermediate' 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    {/* Course Title */}
                    <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    {/* Instructor */}
                    <p className="text-gray-400 text-sm mb-3">
                      By {typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-sm mb-3">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium text-white">{course.rating}</span>
                    </div>

                    {/* Duration and Projects */}
                    <div className="text-sm mb-4 text-gray-400">
                      {course.duration} • {course.projects} projects
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {course.technologies.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{course.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Referral Code Message (hidden for AI Tools Mastery) */}
                    {!(course.id === 'ai-tools-mastery' || (course as any).courseId === 'AI-TOOLS-MASTERY' || (course.title || '').toLowerCase().includes('ai tools')) && (
                      <div className="mb-4 p-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-sm">🎯</span>
                          <span className="text-xs font-medium text-green-400">
                            Use referral code for 60% OFF!
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-white">
                        {'₹'}{course.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Purchase Button */}
                    {course.students >= course.maxStudents ? (
                       <button 
                         disabled
                         className="w-full bg-gray-600 text-gray-300 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
                       >
                         Slots Closed
                       </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchaseCourse(course.id);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-bold">Settings</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Change Password</h4>
                  {pwdSuccess && (
                    <div className="p-2 bg-green-600/20 border border-green-500/30 rounded text-green-300 text-sm">{pwdSuccess}</div>
                  )}
                  {pwdError && (
                    <div className="p-2 bg-red-600/20 border border-red-500/30 rounded text-red-300 text-sm">{pwdError}</div>
                  )}
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current Password (optional)"
                      value={pwdCurrent}
                      onChange={(e) => setPwdCurrent(e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={async () => {
                        setPwdError(null);
                        setPwdSuccess(null);
                        if (!pwdNew || pwdNew.length < 6) {
                          setPwdError('New password must be at least 6 characters.');
                          return;
                        }
                        if (pwdNew !== pwdConfirm) {
                          setPwdError('New password and confirm do not match.');
                          return;
                        }
                        setPwdLoading(true);
                        try {
                          const currentUserRaw = localStorage.getItem('currentUser');
                          if (!currentUserRaw) {
                            setPwdError('Please login to update password.');
                            navigate('/student-login');
                            return;
                          }
                          const currentUser = JSON.parse(currentUserRaw);
                          const studentId = currentUser.id ?? currentUser._id;
                          const token = currentUser.token ?? localStorage.getItem('token');
                          const resp = await fetch(`${BASE_URL}/api/students/${studentId}/password`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              ...(token ? { Authorization: `Bearer ${token}` } : {})
                            },
                            body: JSON.stringify({ newPassword: pwdNew })
                          });
                          const result = await resp.json().catch(async () => ({ success: false, message: await resp.text() }));
                          if (resp.ok && result?.success) {
                            setPwdSuccess('Password updated successfully.');
                            setPwdCurrent('');
                            setPwdNew('');
                            setPwdConfirm('');
                          } else {
                            setPwdError(result?.message || 'Failed to update password.');
                          }
                        } catch (err) {
                          
                          setPwdError('Network or server error while updating password.');
                        } finally {
                          setPwdLoading(false);
                        }
                      }}
                      disabled={pwdLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {pwdLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6 max-w-full">
            <h2 className="text-white text-2xl font-bold">Purchase History</h2>
            
            <div className="space-y-4 max-w-full">
              {purchaseHistory.map((purchase) => (
                <div key={purchase.id} className="bg-gray-800 rounded-lg p-6 w-full max-w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white text-lg font-semibold">{purchase.courseName}</h4>
                      <p className="text-gray-300 text-sm mt-1">
                        Purchase Date: {new Date(purchase.purchaseDate).toLocaleDateString()} at {new Date(purchase.purchaseDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-xl font-bold">{'₹'}{purchase.amount.toLocaleString()}</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        purchase.status === 'completed' ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'
                      }`}>
                        {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-bold">Projects</h2>
            
            {/* Course Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Select Course</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCourses
                  .filter(course => isCourseAccessible(course.id))
                  .map(course => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourseForProjects(course.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCourseForProjects === course.id
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <GlobeAltIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{course.title}</h4>
                          <p className="text-sm text-gray-400">{typeof course.instructor === 'string' ? course.instructor : course.instructor.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                              {course.level}
                            </span>
                            <span className="text-xs text-gray-400">{course.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {allCourses.filter(course => isCourseAccessible(course.id)).length === 0 && (
                <div className="text-center py-8">
                  <GlobeAltIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No enrolled courses found. Please enroll in a course to view projects.</p>
                </div>
              )}
            </div>

            {/* Project Progress Summary commented out */}
            {/* {selectedCourseForProjects && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-white text-lg font-semibold mb-4">Project Progress</h3>
                {(() => {
                  const mappedIds = getCourseIdMapping(selectedCourseForProjects);
                  const courseProjects = projects.filter(project => 
                    mappedIds.includes(project.courseId)
                  );
                  const totalProjects = courseProjects.length;
                  const completedProjects = courseProjects.filter(p => p.status === 'completed').length;
                  const inProgressProjects = courseProjects.filter(p => p.status === 'in_progress').length;
                  const notStartedProjects = courseProjects.filter(p => p.status === 'not_started').length;
                  const progressPercentage = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-white">{totalProjects}</p>
                        <p className="text-gray-400 text-sm">Total Projects</p>
                      </div>
                      <div className="bg-green-600/20 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-green-400">{completedProjects}</p>
                        <p className="text-gray-400 text-sm">Completed</p>
                      </div>
                      <div className="bg-blue-600/20 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-400">{inProgressProjects}</p>
                        <p className="text-gray-400 text-sm">In Progress</p>
                      </div>
                      <div className="bg-gray-600/20 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-gray-400">{notStartedProjects}</p>
                        <p className="text-gray-400 text-sm">Not Started</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )} */}

            {/* Projects List */}
            {selectedCourseForProjects && (
              <div className="space-y-4">
              {projects
                .filter(project => {
                  const mappedIds = getCourseIdMapping(selectedCourseForProjects);
                  return mappedIds.includes(project.courseId);
                })
                .map((project) => (
                <div key={project.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        project.difficulty === 'beginner' ? 'bg-green-600' :
                        project.difficulty === 'intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        <span className="text-white font-bold text-lg">{project.title.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="text-white text-lg font-semibold">{project.title}</h4>
                        <p className="text-gray-400 text-sm">{project.courseName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            project.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            project.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                          </span>
                          <span className="text-gray-400 text-xs">• {project.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {/* Project status badge commented out */}
                      {/* <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'completed' ? 'bg-green-600 text-green-100' :
                        project.status === 'in_progress' ? 'bg-blue-600 text-blue-100' :
                        'bg-gray-600 text-gray-100'
                      }`}>
                        {project.status === 'not_started' ? 'Not Started' :
                         project.status === 'in_progress' ? 'In Progress' : 'Completed'}
                      </span> */}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <h5 className="text-white font-medium mb-2">Requirements:</h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {project.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-white font-medium mb-2">Technologies:</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 rounded text-xs font-medium bg-blue-600/20 text-blue-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {(() => {
                    // Get the course data for this project
                    const courseData = enrolledCoursesData.find((course: any) => {
                      const courseId = course.courseId || course.id;
                      return getCourseIdMapping(courseId).includes(project.courseId);
                    });
                    
                    if (!courseData) {
                      return (
                        <div className="text-red-400 text-sm">
                          Course data not found. Please refresh the page.
                        </div>
                      );
                    }
                    
                    // Get the module ID for this project
                    const moduleId = getModuleIdForProject(project.id, courseData);
                    
                    if (!moduleId) {
                      return (
                        <div className="text-yellow-400 text-sm">
                          Module mapping not found for this project.
                        </div>
                      );
                    }
                    
                    // Check if this module is already submitted
                    const isSubmitted = moduleSubmissions[courseData.id]?.[moduleId];
                    const isAIToolsProject = project.courseId === 'ai-tools-mastery';
                    
                    if (isSubmitted) {
                      // Show submitted status
                      return (
                        <div className="space-y-3">
                          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-0.5">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-green-400 font-medium mb-2">Existing Module Submission Found</h4>
                                <p className="text-gray-300 text-sm mb-3">
                                  Submitted on {new Date(isSubmitted.submittedAt).toLocaleDateString()}
                                </p>
                                <div className="bg-gray-800 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="text-gray-400 text-xs mb-1">
                                        {isAIToolsProject ? 'Google Drive Folder' : 'Git Repository'}
                                      </p>
                                      <a 
                                        href={isSubmitted.submissionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline break-all text-sm"
                                      >
                                        {isSubmitted.submissionUrl}
                                      </a>
                                    </div>
                                    <button
                                      onClick={() => window.open(isSubmitted.submissionUrl, '_blank')}
                                      className="ml-3 text-blue-400 hover:text-blue-300 transition-colors"
                                      title="Open submission link"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* View Details Button */}
                          <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                // Navigate to specific project page based on course type
                                if (project.courseId === 'ai-tools-mastery') {
                                  navigate(`/ai-tools-project/${project.id}`);
                                } else if (project.courseId === 'devops-beginner' || project.courseId === 'devops-advanced') {
                                  navigate(`/devops-project/${project.id}`);
                                } else if (project.courseId === 'frontend-beginner') {
                                  navigate(`/frontend-project/${project.id}`);
                                } else if (project.courseId === 'frontend-intermediate') {
                                  navigate(`/frontend-project/${project.id}`);
                                } else {
                                  // For other courses, show alert for now
                                  alert('Project details page coming soon for this course!');
                                }
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // Show submission form if not submitted
                    return (
                      <div className="space-y-3">
                        {/* URL Upload Field - Conditional based on course */}
                        <div className="space-y-3">
                          <div>
                            {isAIToolsProject ? (
                              <>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Google Drive Folder URL
                                </label>
                                <input
                                  type="url"
                                  value={projectGoogleDriveUrl}
                                  onChange={(e) => setProjectGoogleDriveUrl(e.target.value)}
                                  placeholder="https://drive.google.com/drive/folders/your-folder-id"
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                  Share your Google Drive folder containing your AI tools project files
                                </p>
                              </>
                            ) : (
                              <>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Git Repository URL
                                </label>
                                <input
                                  type="url"
                                  value={projectGitUrl}
                                  onChange={(e) => setProjectGitUrl(e.target.value)}
                                  placeholder="https://github.com/username/project-name"
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                  Enter your GitHub repository URL to submit your project
                                </p>
                              </>
                            )}
                          </div>
                          
                          <div className="flex gap-3">
                            {/* View Details Button */}
                            <button 
                              onClick={() => {
                                // Navigate to specific project page based on course type
                                if (project.courseId === 'ai-tools-mastery') {
                                  navigate(`/ai-tools-project/${project.id}`);
                                } else if (project.courseId === 'devops-beginner' || project.courseId === 'devops-advanced') {
                                  navigate(`/devops-project/${project.id}`);
                                } else if (project.courseId === 'frontend-beginner') {
                                  navigate(`/frontend-project/${project.id}`);
                                } else if (project.courseId === 'frontend-intermediate') {
                                  navigate(`/frontend-project/${project.id}`);
                                } else {
                                  // For other courses, show alert for now
                                  alert('Project details page coming soon for this course!');
                                }
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              View Details
                            </button>
                            
                            <button 
                              onClick={async () => {
                                const submissionUrl = isAIToolsProject ? projectGoogleDriveUrl.trim() : projectGitUrl.trim();
                                
                                if (submissionUrl) {
                                  
                                  const success = await submitModuleUrl(courseData.id, moduleId, submissionUrl);
                                  
                                  if (success) {
                                    alert(`✅ Project submitted successfully! Your ${isAIToolsProject ? 'Google Drive folder' : 'Git repository'} has been saved.`);
                                    // Clear the input field
                                    if (isAIToolsProject) {
                                      setProjectGoogleDriveUrl('');
                                    } else {
                                      setProjectGitUrl('');
                                    }
                                  }
                                } else {
                                  alert(`Please enter a valid ${isAIToolsProject ? 'Google Drive folder URL' : 'Git repository URL'}`);
                                }
                              }}
                              disabled={isAIToolsProject ? !projectGoogleDriveUrl.trim() : !projectGitUrl.trim()}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              Submit Project
                            </button>
                          </div>
                        </div>
                        
                        {/* Git Learning Section */}
                        <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-medium">Need help with Git?</p>
                              <p className="text-gray-400 text-xs">Learn how to create repositories and submit your projects</p>
                            </div>
                            <button
                              onClick={() => setShowGitTutorialModal(true)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Learn Git
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  
                  {project.status === 'completed' && project.grade && (
                    <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-medium">Project Completed</span>
                        <span className="text-green-400 font-bold">Grade: {project.grade}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            )}

            {!selectedCourseForProjects && (
              <div className="text-center py-12">
                <GlobeAltIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Select a Course</h3>
                <p className="text-gray-400">Choose a course above to view and work on its projects.</p>
              </div>
            )}
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-bold">Support</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Get help and support.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const pendingAssignments = assignments.filter(
    (a) => (assignmentStatuses[a.id] || a.status) === 'pending'
  );
  const overallProgress =
    enrolledCoursesData.length > 0
      ? Math.round(
          enrolledCoursesData.reduce((sum, c) => {
            const p = courseProgress[c.courseId || c.id];
            return sum + (p?.progress || 0);
          }, 0) / enrolledCoursesData.length
        )
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col items-center justify-center">
        <Loader4 />
        <p className="text-slate-700 dark:text-gray-100 mt-4 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 dark:bg-[#050508] relative overflow-hidden md:pl-[calc(1.25rem+18.5rem+1.5rem)] lg:pl-[calc(1.25rem+19.5rem+1.75rem)]">

      <Sidebar
        items={sidebarItems}
        activeId={activeTab}
        onSelect={(id) => {
          setActiveTab(id);
          setIsSidebarOpen(false);
        }}
        profile={
          studentProfile
            ? {
                name: studentProfile.name,
                subtitle: studentProfile.email || undefined,
                avatarInitial: studentProfile.name.charAt(0).toUpperCase(),
              }
            : undefined
        }
        onProfileClick={() => setShowProfileDetails(true)}
        mobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
        footerNavItem={{ id: 'settings', label: 'Settings', icon: Cog6ToothIcon }}
        footerAction={{
          label: 'Logout',
          icon: LogOut,
          onClick: handleLogout,
          variant: 'danger',
        }}
      />

      <div className="flex flex-col relative z-10 min-w-0 h-screen overflow-y-auto overflow-x-hidden">
        <header className="px-4 py-4 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-white/10"
                aria-label="Open menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <div className="relative w-full max-w-lg hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses or assignments..."
                  className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-gray-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://wa.me/9347564390"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                aria-label="WhatsApp support"
                className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-2.5 py-2 text-xs font-medium text-green-700 hover:bg-green-500/20 transition-colors dark:border-green-500/40 dark:text-green-400 dark:hover:bg-green-500/15"
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" />
                <span className="hidden sm:inline whitespace-nowrap">for any support</span>
              </a>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                  Welcome Back, {studentProfile?.name?.split(' ')[0] || 'Student'}
                </p>
                <p className="text-[10px] tracking-widest text-slate-400 dark:text-gray-500 uppercase">
                  Active Session
                </p>
              </div>
              <Switch checked={theme === 'dark'} onChange={() => toggleTheme()} />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-8 overflow-x-hidden bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100">

          {activeTab === 'dashboard' ? (
            <React.Fragment>
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Hero — Master Your Academic Journey */}
                  <div className="lg:col-span-3 relative min-h-[320px] md:min-h-[340px] rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#0a1128]/88 dark:bg-[#0a1128]/92" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] via-[#0a1128]/80 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-10 lg:p-12 text-white">
                      <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold leading-tight mb-4 max-w-xl">
                        Master Your Academic Journey
                      </h2>
                      <p className="text-slate-300 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
                        Track your assignments, monitor course progress, and stay ahead of your learning goals with our integrated student dashboard.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('assignments')}
                        className="self-start inline-flex items-center gap-2 bg-white text-[#0a1128] px-6 py-3 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors shadow-md"
                      >
                        <CalendarDaysIcon className="h-5 w-5" />
                        View Schedule
                      </button>
                    </div>
                  </div>

                  {/* Overall Progress — animated border (matches landing collaboration card) */}
                  <AnimatedBorderCard
                    className="lg:col-span-2 min-h-[320px] md:min-h-[340px] h-full"
                    innerClassName="bg-white dark:bg-gray-900 shadow-2xl p-8 md:p-10 flex flex-col items-center justify-center min-h-[316px] md:min-h-[336px]"
                  >
                    <div className="w-full text-center mb-8">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                        Overall Progress
                      </h3>
                      <p className="text-sm md:text-base text-slate-500 dark:text-gray-400 mt-1">
                        Academic Year 2023-2024
                      </p>
                    </div>
                    <div className="relative w-44 h-44 md:w-52 md:h-52 lg:w-56 lg:h-56">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="10"
                          className="text-slate-100 dark:text-gray-800"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${overallProgress * 2.51} 251`}
                          className="text-emerald-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                          {overallProgress}%
                        </span>
                      </div>
                    </div>
                    <p className="mt-8 text-base md:text-lg font-bold text-slate-800 dark:text-gray-200 text-center">
                      {overallProgress >= 70 ? 'High Distinction Track' : overallProgress > 0 ? 'Keep Going!' : 'Start Learning'}
                    </p>
                  </AnimatedBorderCard>
                </div>

                <section>
                  <div className="flex items-end justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                        Upcoming Assignments
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                        Your immediate academic priorities.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('assignments')}
                      className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white shrink-0"
                    >
                      View All &gt;
                    </button>
                  </div>
                  {pendingAssignments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {pendingAssignments.slice(0, 3).map((assignment, idx) => {
                        const badgeStyles = [
                          'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
                          'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20',
                          'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
                        ];
                        const badgeLabels = ['Due in 2 days', 'Next week', 'Upcoming'];
                        return (
                          <div
                            key={assignment.id}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <span className={`inline-block text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded border mb-3 ${badgeStyles[idx % 3]}`}>
                              {badgeLabels[idx % 3]}
                            </span>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-2">
                              {assignment.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">{assignment.courseName}</p>
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 pt-3 border-t border-slate-100 dark:border-gray-800">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                              <span className="font-semibold text-slate-700 dark:text-gray-300">100 Points</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-gray-500 text-sm">You have no upcoming assignments.</p>
                  )}
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">My Enrolled Courses</h3>
                  {enrolledCoursesData.length > 0 ? (
                    <div className="space-y-4">
                      {enrolledCoursesData.map((course) => {
                        const progress = courseProgress[course.courseId || course.id];
                        const pct = progress?.progress || 0;
                        const image = getEnrolledCourseImage(course);
                        const title =
                          getCourseTitleFromKey(normalizeCourseKey(course.courseId || course.id)) || course.title;
                        const instructor =
                          typeof course.instructor === 'string'
                            ? course.instructor
                            : course.instructor?.name || 'Instructor';
                        return (
                          <div
                            key={course.id}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm flex flex-col sm:flex-row"
                          >
                            <div className="sm:w-48 h-36 sm:h-auto shrink-0 relative">
                              {image ? (
                                <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-800 dark:to-gray-900" />
                              )}
                            </div>
                            <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
                                  <p className="text-sm text-slate-500 dark:text-gray-400">{instructor}</p>
                                </div>
                                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
                                  Enrolled
                                </span>
                              </div>
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400 mb-1">
                                  <span>Course Progress</span>
                                  <span className="font-semibold text-slate-700 dark:text-gray-300">{pct}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100 dark:bg-gray-800 overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full transition-all"
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleContinueLearning(course.courseId || course.id)}
                                className="mt-4 self-start text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                              >
                                Continue Learning →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 p-8 text-center">
                      <p className="text-slate-500 dark:text-gray-500 text-sm mb-4">No courses enrolled yet.</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('browse-courses')}
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:scale-105 transition-transform"
                      >
                        Explore Programs
                      </button>
                    </div>
                  )}
                </section>

                {recommendedCourses.length > 0 && (
                  <section className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">What to learn next</h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('browse-courses')}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                      >
                        View all
                      </button>
                    </div>
                    <div ref={recommendedCarouselRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth">
                      {recommendedCourses.map((course) => (
                        <div
                          key={course.id}
                          className="min-w-[220px] max-w-[230px] bg-slate-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700 hover:border-emerald-500 transition-all cursor-pointer shrink-0"
                          onClick={() => handleCourseDetails(course as Course)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCourseDetails(course as Course)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="relative h-28 overflow-hidden">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="p-4">
                            <h4 className="text-slate-900 dark:text-white text-sm font-semibold mb-1 line-clamp-2">{course.title}</h4>
                            <p className="text-slate-500 dark:text-gray-400 text-xs">
                              {course.duration} • {course.projects} projects
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </div>
            </React.Fragment>
          ) : activeTab === 'community' ? (
            <Suspense
              fallback={
                <div className="flex justify-center py-20">
                  <Loader4 />
                </div>
              }
            >
              <CommunityTab />
            </Suspense>
          ) : activeTab === 'history' ? (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">History</h2>
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 p-6 shadow-sm">
                <p className="text-slate-500 dark:text-gray-400 text-sm">Your learning activity history will appear here.</p>
              </div>
            </div>
          ) : (
            renderTabContent()
          )}
        </main>
      </div>

      {showProfileDetails && studentProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 max-w-xl w-full mx-4 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Student Profile</h2>
              <button
                onClick={() => setShowProfileDetails(false)}
                className="text-gray-400 hover:text-gray-200"
                aria-label="Close profile details"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {studentProfile.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-white text-2xl font-bold">
                    {studentProfile.name || 'Student Name'}
                  </h3>
                  <span className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>
                </div>
                <p className="text-gray-300 mb-2">Frontend Development Student</p>
                <p className="text-gray-400 text-sm mb-4">
                  📍 {studentProfile.location || 'Location not specified'}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-gray-100">{studentProfile.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Student ID</p>
                    <p className="text-gray-100">{studentProfile.studentId || 'STU001'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-gray-100">{studentProfile.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Join Date</p>
                    <p className="text-gray-100">{studentProfile.joinDate || 'January 2024'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Education Level</p>
                    <p className="text-gray-100">{studentProfile.education || "Bachelor's Degree"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Experience Level</p>
                    <p className="text-gray-100">{studentProfile.experience || 'Beginner'}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm">
                    Online Learning
                  </span>
                  <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                    Part-time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Complete Purchase</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentModalData(null);
                  setReferralCode('');
                }}
                className="text-gray-400 hover:text-white"
                aria-label="Close payment modal"
                title="Close"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mb-4">
              <img
                src={paymentModalData.course.image}
                alt={paymentModalData.course.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="text-lg font-semibold text-white mb-2">
                {paymentModalData.course.title}
              </h4>
              <p className="text-gray-400 text-sm mb-3">{paymentModalData.course.description}</p>
            </div>

            {!isAIToolsMasterySelected && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => handleReferralCodeChange(e.target.value)}
                  placeholder="Enter SAVE60 for 60% off"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {referralCode.toUpperCase() === 'SAVE60' && (
                  <p className="text-green-400 text-sm mt-1">✓ 60% discount applied!</p>
                )}
              </div>
            )}
            {isAIToolsMasterySelected && (
              <div className="mb-4 bg-yellow-600/20 border border-yellow-600/30 rounded p-3 text-yellow-300 text-sm">
                No offers available for A.I Tools Mastery - Professional Certification Program.
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Original Price:</span>
                <span className="text-gray-300">
                  {'₹'}{paymentModalData.originalPrice.toLocaleString()}
                </span>
              </div>
              {!isAIToolsMasterySelected && paymentModalData.discount > 0 ? (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400">{`Discount (${paymentModalData.discount}%):`}</span>
                  <span className="text-green-400">
                    -{'₹'}{(paymentModalData.originalPrice - paymentModalData.discountedPrice).toLocaleString()}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between items-center text-lg font-bold border-t border-gray-600 pt-2">
                <span className="text-white">Total:</span>
                <span className="text-blue-400">
                  {'₹'}{Math.round(paymentModalData.discountedPrice).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-3">Scan QR Code to Pay</h4>
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img src="/img/qr.png" alt="Payment QR Code" className="w-48 h-48 mx-auto" />
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {'Scan the QR code above with your UPI app to make the payment of '}
                {'₹'}{Math.round(paymentModalData.discountedPrice).toLocaleString()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Transaction ID *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter your transaction ID after payment"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-gray-400 text-xs mt-1">
                Enter the transaction ID you received after making the payment
              </p>
            </div>

            <button
              onClick={processPayment}
              disabled={isProcessingPayment || !transactionId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {isProcessingPayment ? 'Submitting...' : 'Submit Payment'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Your course will be activated within 24 hours after payment verification
            </p>
          </div>
        </div>
      )}

      {/* Project Submission Modal */}
      {renderProjectSubmissionModal()}

      {/* Git Tutorial Modal */}
      {showGitTutorialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowGitTutorialModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close Git tutorial modal"
              title="Close"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="space-y-6">
              {/* Introduction */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-2">What is Git?</h4>
                <p className="text-gray-300 text-sm">
                  Git is a version control system that helps you track changes in your code and collaborate with others.
                  GitHub is a platform that hosts Git repositories online.
                </p>
              </div>

              {/* Step 1: Install Git */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Step 1: Install Git</h4>
                <p className="text-gray-300 text-sm mb-2">Download and install Git from:</p>
                <div className="bg-gray-800 rounded p-2 mb-2">
                  <code className="text-green-400">https://git-scm.com/downloads</code>
                </div>
                <p className="text-gray-300 text-sm">Verify installation by running:</p>
                <div className="bg-gray-800 rounded p-2">
                  <code className="text-green-400">git --version</code>
                </div>
              </div>

              {/* Step 2: Configure Git */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Step 2: Configure Git (First Time Setup)</h4>
                <p className="text-gray-300 text-sm mb-2">Set your name and email:</p>
                <div className="space-y-2">
                  <div className="bg-gray-800 rounded p-2">
                    <code className="text-green-400">git config --global user.name "Your Name"</code>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <code className="text-green-400">git config --global user.email "your.email@example.com"</code>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-2">Check your configuration:</p>
                <div className="bg-gray-800 rounded p-2">
                  <code className="text-green-400">git config --list</code>
                </div>
              </div>

              {/* Step 3: Create Repository */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Step 3: Create a Repository</h4>
                <div className="mb-4">
                  <h5 className="text-white font-medium mb-2">Option A: Create on GitHub first (Recommended)</h5>
                  <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                    <li>Go to <span className="text-blue-400">github.com</span> and sign in</li>
                    <li>Click "New repository" or the "+" icon</li>
                    <li>Enter repository name (e.g., "my-project")</li>
                    <li>Make it <strong>Public</strong> so instructors can see it</li>
                    <li>Check "Add a README file"</li>
                    <li>Click "Create repository"</li>
                  </ol>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">Option B: Create locally first</h5>
                  <div className="space-y-2">
                    <div className="bg-gray-800 rounded p-2">
                      <code className="text-green-400">mkdir my-project</code>
                    </div>
                    <div className="bg-gray-800 rounded p-2">
                      <code className="text-green-400">cd my-project</code>
                    </div>
                    <div className="bg-gray-800 rounded p-2">
                      <code className="text-green-400">git init</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Clone Repository */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Step 4: Clone Repository (If created on GitHub)</h4>
                <p className="text-gray-300 text-sm mb-2">Copy the repository to your computer:</p>
                <div className="bg-gray-800 rounded p-2 mb-2">
                  <code className="text-green-400">git clone https://github.com/username/repository-name.git</code>
                </div>
                <div className="bg-gray-800 rounded p-2">
                  <code className="text-green-400">cd repository-name</code>
                </div>
              </div>

              {/* Step 5: Basic Git Workflow */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Step 5: Basic Git Workflow</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-white font-medium mb-2">1. Check status of your files:</h5>
                    <div className="bg-gray-800 rounded p-2">
                      <code className="text-green-400">git status</code>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-2">2. Add files to staging area:</h5>
                    <div className="space-y-2">
                      <div className="bg-gray-800 rounded p-2">
                        <code className="text-green-400">git add filename.txt</code>
                        <span className="text-gray-400 ml-2"># Add specific file</span>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <code className="text-green-400">git add .</code>
                        <span className="text-gray-400 ml-2"># Add all files</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-2">3. Commit your changes:</h5>
                    <div className="bg-gray-800 rounded p-2">
                      <code className="text-green-400">git commit -m "Your commit message"</code>
                    </div>
                    <p className="text-gray-300 text-xs mt-1">Example: "Add project files" or "Fix login bug"</p>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-2">4. Push to GitHub:</h5>
                    <div className="bg-gray-800 rounded p-2">
                      <code className="text-green-400">git push origin main</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6: Connect Local to Remote */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Step 6: Connect Local Repository to GitHub</h4>
                <p className="text-gray-300 text-sm mb-2">If you created the repository locally first:</p>
                <div className="space-y-2">
                  <div className="bg-gray-800 rounded p-2">
                    <code className="text-green-400">git remote add origin https://github.com/username/repository-name.git</code>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <code className="text-green-400">git branch -M main</code>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <code className="text-green-400">git push -u origin main</code>
                  </div>
                </div>
              </div>

              {/* Common Commands */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Common Git Commands</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-white font-medium mb-2">View Information:</h5>
                    <div className="space-y-1 text-sm">
                      <div className="bg-gray-800 rounded p-2">
                        <code className="text-green-400">git status</code>
                        <span className="text-gray-400 block text-xs">Check file status</span>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <code className="text-green-400">git log</code>
                        <span className="text-gray-400 block text-xs">View commit history</span>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <code className="text-green-400">git diff</code>
                        <span className="text-gray-400 block text-xs">See changes</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-2">Undo Changes:</h5>
                    <div className="space-y-1 text-sm">
                      <div className="bg-gray-800 rounded p-2">
                        <code className="text-green-400">git reset filename</code>
                        <span className="text-gray-400 block text-xs">Unstage file</span>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <code className="text-green-400">git checkout -- filename</code>
                        <span className="text-gray-400 block text-xs">Discard changes</span>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <code className="text-green-400">git pull</code>
                        <span className="text-gray-400 block text-xs">Get latest changes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Start Guide */}
              <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-400 mb-3">🚀 Quick Start for Your Project</h4>
                <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                  <li>Create a new repository on GitHub (make it <strong>public</strong>)</li>
                  <li>
                    Clone it: <code className="bg-gray-800 px-1 rounded text-green-400">git clone [your-repo-url]</code>
                  </li>
                  <li>Add your project files to the folder</li>
                  <li>
                    Stage files: <code className="bg-gray-800 px-1 rounded text-green-400">git add .</code>
                  </li>
                  <li>
                    Commit: <code className="bg-gray-800 px-1 rounded text-green-400">git commit -m "Initial project submission"</code>
                  </li>
                  <li>
                    Push: <code className="bg-gray-800 px-1 rounded text-green-400">git push origin main</code>
                  </li>
                  <li>Copy the repository URL and submit it in your project!</li>
                </ol>
              </div>

              {/* Tips */}
              <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3">💡 Important Tips</h4>
                <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                  <li>Always make your repository <strong>public</strong> so instructors can access it</li>
                  <li>Write clear commit messages describing what you changed</li>
                  <li>Include a README.md file explaining your project</li>
                  <li>Don't commit sensitive information (passwords, API keys)</li>
                  <li>Commit frequently with small, logical changes</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowGitTutorialModal(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Got it! Close Tutorial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {showCourseDetails && selectedCourseForDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedCourseForDetails.title}</h3>
              <button
                onClick={() => setShowCourseDetails(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                      {selectedCourseForDetails.level.charAt(0).toUpperCase() + selectedCourseForDetails.level.slice(1)}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                      {selectedCourseForDetails.category.charAt(0).toUpperCase() +
                        selectedCourseForDetails.category.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{selectedCourseForDetails.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{selectedCourseForDetails.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📚</span>
                      <span>{selectedCourseForDetails.modules?.length || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🚀</span>
                      <span>{selectedCourseForDetails.projects} Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⭐</span>
                      <span>
                        {selectedCourseForDetails.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies You'll Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourseForDetails.technologies.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedCourseForDetails.modules && selectedCourseForDetails.modules.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Course Curriculum</h3>
                    <div className="space-y-3">
                      {selectedCourseForDetails.modules.map((module, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-blue-400 font-medium">
                              Module {index + 1}: {module.title}
                            </h4>
                            <span className="text-sm text-gray-400">{module.duration}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {module.topics.map((topic, topicIndex) => (
                              <div key={topicIndex} className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:col-span-1">
                <MagicBento
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={false}
                  enableMagnetism={true}
                  clickEffect={true}
                  spotlightRadius={280}
                  particleCount={8}
                  glowColor="132, 0, 255"
                  className="sticky top-6 bg-gray-800 rounded-lg p-6"
                >
                  <div className="mb-4">
                    <img
                      src={selectedCourseForDetails.image}
                      alt={selectedCourseForDetails.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {'₹'}{selectedCourseForDetails.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">One-time payment • Lifetime access</div>
                  </div>
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Instructor</span>
                      <span className="text-white">{typeof selectedCourseForDetails.instructor === 'string' ? selectedCourseForDetails.instructor : selectedCourseForDetails.instructor.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">{selectedCourseForDetails.duration}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Level</span>
                      <span className="text-white capitalize">{selectedCourseForDetails.level}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Projects</span>
                      <span className="text-white">{selectedCourseForDetails.projects}</span>
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm">🎯</span>
                      <span className="text-xs font-medium text-green-400">
                        Use referral code for 60% OFF!
                      </span>
                    </div>
                  </div>
                  {selectedCourseForDetails.students >= selectedCourseForDetails.maxStudents ? (
                    <button
                      disabled
                      className="w-full bg-gray-600 text-gray-300 py-3 px-4 rounded-lg font-medium cursor-not-allowed mb-4"
                    >
                      Slots Closed
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowCourseDetails(false);
                        handlePurchaseCourse(selectedCourseForDetails.id);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 mb-4"
                    >
                      Enroll Now
                    </button>
                  )}
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="font-medium text-white mb-3">What's Included:</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        Lifetime access to course content
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        {selectedCourseForDetails.projects} hands-on projects
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        Certificate of completion
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        24/7 community support
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        Regular content updates
                      </li>
                    </ul>
                  </div>
                </MagicBento>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentPortal;

