import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { normalizeCourseKey, getCourseTitleFromKey } from '../data/courseAssignments';

import Sidebar from './Sidebar';
import MagicBento from './MagicBento';
import StudentReviews from './StudentReviews';
import { 
  HomeIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  XMarkIcon,
  Squares2X2Icon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface CourseModule {
  title: string;
  duration: string;
  topics: string[];
}

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  technologies: string[];
  price: number;
  duration: string;
  projects: number;
  modules: CourseModule[];
  image: string;
  rating: number;
  students: number;
  maxStudents: number;
  instructor: string | { name: string };
  paymentMethod?: string;
  adminConfirmedBy?: string;
  adminConfirmedAt?: string;
  courseId?: string;
  enrollmentConfirmationStatus?: string;
  enrollmentStatus?: string;
  status?: string;
  confirmationStatus?: string;
  paymentStatus?: string;
  transactionId?: string;
  paymentId?: string;
}

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
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const enrolledCarouselRef = useRef<HTMLDivElement | null>(null);
  const recommendedCarouselRef = useRef<HTMLDivElement | null>(null);

  // Payment functionality state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<PaymentModalData | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const [enrolledCoursesData, setEnrolledCoursesData] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<{ [courseId: string]: CourseProgress }>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Missing state variables
  const [selectedStudyMaterials, setSelectedStudyMaterials] = useState<string[]>([]);
  const [selectedTestQuestions, setSelectedTestQuestions] = useState<{ question: string; options: string[]; correctAnswer: number }[]>([]);

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
      console.error('Logout error:', e);
      // Hard redirect as fallback
      window.location.href = '/';
    }
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
  const [showStudyMaterialsModal, setShowStudyMaterialsModal] = useState(false);
  const [showTestQuestionsModal, setShowTestQuestionsModal] = useState(false);
  const [currentTestAnswers, setCurrentTestAnswers] = useState<{ [questionIndex: number]: number }>({});
  const [testResults, setTestResults] = useState<{ score: number; total: number } | null>(null);
  
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
      'frontend-intermediate': ['frontend-intermediate', 'Frontend Development - Intermediate', 'FRONTEND-INTERMEDIATE', 'frontend_intermediate', 'front-end-intermediate', 'Front-End Intermediate', 'Intermediate Frontend'],
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
      'Frontend Development - Intermediate': ['frontend-intermediate', 'FRONTEND-INTERMEDIATE'],
      'FRONTEND-INTERMEDIATE': ['frontend-intermediate', 'Frontend Development - Intermediate'],
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
                  console.warn('Could not map assignment statuses from summary', mapErr);
                }
              } else if (typeof totalApi === 'number' && totalApi > 0) {
                total = Math.max(totalLocal, totalApi);
              }
            }
          } catch (apiErr) {
            console.error('Summary API failed, falling back to local data', apiErr);
          }
        }

        const pending = Math.max(total - completed, 0);
        setAssignmentSummary({ total, completed, pending });
      } catch (e) {
        console.error('Failed to compute assignment summary', e);
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
                  console.log('Submitting project:', selectedProjectId, 'with URL:', submissionUrl, 'Type:', isAIToolsProject ? 'Google Drive' : 'Git');
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
      console.log(`Token fetch modules: ${token}`);
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
      console.error('Error fetching module submissions:', error);
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
      console.log('User data for submission:', userData);
      const token = userData.token;
      console.log("The Current User TOken",token);

      console.log('Submitting module:', { courseId, moduleId, submissionUrl });
      console.log('Using student ID:', userData.id); // Log the ID being used

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
        console.log('Module submitted successfully:', result);
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
        console.error('Submission failed:', result);
        alert(`Failed to submit: ${result.message}`);
        return false;
      }
    } catch (error) {
      console.error('Error submitting module:', error);
      alert('Error submitting module. Please try again.');
      return false;
    }
  };

  // Helper function to check if a course is accessible (either purchased or confirmed payment)
  const isCourseAccessible = (courseId: string): boolean => {
    console.log('🔍 Checking course accessibility for:', courseId);
    console.log('📚 Purchased courses:', purchasedCourses);
    console.log('🎓 Enrolled courses:', enrolledCourses.map(c => ({ id: c.id, status: c.confirmationStatus })));
    

    
    // Check if course is in purchased courses list
    if (purchasedCourses.includes(courseId)) {
      console.log('✅ Course found in purchased courses');
      return true;
    }
    
    // Check if course has confirmed payment status in enrolled courses
    const enrolledCourse = enrolledCourses.find(course => course.id === courseId);
    if (enrolledCourse && enrolledCourse.confirmationStatus === 'confirmed') {
      console.log('✅ Course found in enrolled courses with confirmed status');
      return true;
    }
    
    // Check for courseId mappings (for assignments/projects that use different courseId formats)
    const possibleMappings = getCourseIdMapping(courseId);
    for (const mappedId of possibleMappings) {
      if (purchasedCourses.includes(mappedId)) {
        console.log('✅ Course found via mapping in purchased courses:', mappedId);
        return true;
      }
      
      const mappedEnrolledCourse = enrolledCourses.find(course => course.id === mappedId);
      if (mappedEnrolledCourse && mappedEnrolledCourse.confirmationStatus === 'confirmed') {
        console.log('✅ Course found via mapping in enrolled courses with confirmed status:', mappedId);
        return true;
      }
    }
    
    // Check reverse mapping - if any enrolled course maps to this courseId
    const confirmedCourseIds = [...purchasedCourses, ...enrolledCourses.filter(c => c.confirmationStatus === 'confirmed').map(c => c.id)];
    for (const backendCourseId of confirmedCourseIds) {
      const backendMappings = getCourseIdMapping(backendCourseId);
      if (backendMappings.includes(courseId)) {
        console.log('✅ Course found via reverse mapping:', backendCourseId, '→', courseId);
        return true;
      }
    }
    
    console.log('❌ Course not accessible');
    return false;
  };

  // Function to calculate overall completion percentage
  const calculateOverallCompletionPercentage = (): number => {
    try {
      // Get all accessible courses
      const accessibleCourses = allCourses.filter(course => 
        isCourseAccessible(course.courseId || course.id)
      );
      
      if (accessibleCourses.length === 0) return 0;

      let totalAssignments = 0;
      let completedAssignments = 0;
      let totalProjects = 0;
      let completedProjects = 0;
      let totalStudyModules = 0;
      let completedStudyModules = 0;

      // Calculate assignments progress
      accessibleCourses.forEach(course => {
        const courseAssignments = assignments.filter(assignment => {
          const mappedIds = getCourseIdMapping(course.courseId || course.id);
          return mappedIds.includes(assignment.courseId);
        });
        
        totalAssignments += courseAssignments.length;
        completedAssignments += courseAssignments.filter(a => 
          (assignmentStatuses[a.id] || a.status) === 'graded'
        ).length;
      });

      // Calculate projects progress
      accessibleCourses.forEach(course => {
        const courseProjects = projects.filter(project => 
          project.courseId === (course.courseId || course.id)
        );
        
        totalProjects += courseProjects.length;
        completedProjects += courseProjects.filter(p => p.status === 'completed').length;
      });

      // Calculate study materials progress (simplified - assuming each course has modules)
      accessibleCourses.forEach(course => {
        const progress = courseProgress[course.courseId || course.id];
        if (progress) {
          totalStudyModules += progress.totalModules || 0;
          completedStudyModules += progress.completedModules || 0;
        }
      });

      // Calculate weighted average (assignments: 40%, projects: 40%, study materials: 20%)
      const assignmentProgress = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
      const projectProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
      const studyProgress = totalStudyModules > 0 ? (completedStudyModules / totalStudyModules) * 100 : 0;

      const overallProgress = (assignmentProgress * 0.4) + (projectProgress * 0.4) + (studyProgress * 0.2);
      
      return Math.round(overallProgress);
    } catch (error) {
      console.error('Error calculating overall completion percentage:', error);
      return 0;
    }
  };

  // Course type definition (add optional courseId)
  interface Course {
    id: string;
    courseId?: string; // <-- Add this line
    title: string;
    category: string;
    level: string;
    description: string;
    technologies: string[];
    price: number;
    originalPrice?: number;
    duration: string;
    projects: number;
    image: string;
    rating: number;
    students: number;
    maxStudents: number;
    instructor: string;
    certification?: string;
    premiumFeatures?: string[];
    modules?: {
      title: string;
      duration: string;
      topics: string[];
    }[];
    confirmationStatus?: string;
    paymentStatus?: string;
    transactionId?: string;
    progress?: number;
    status?: string;
    enrollmentDate?: string;
  }

  // All available courses from the Courses page
  const allCourses: Course[] = [
    {
      id: 'AI-TOOLS-MASTERY',
      title: 'A.I Tools Mastery - Professional Certification Program',
      category: 'ai',
      level: 'professional',
      description: '🏆 INDUSTRY-LEADING AI MASTERY PROGRAM | Master 50+ cutting-edge AI tools with hands-on industry projects. From DALL-E 3 & Midjourney to Claude API & enterprise automation. Includes 1-on-1 mentorship, portfolio development, job placement assistance, and lifetime access to updates.',
      technologies: ['DALL-E 3', 'Midjourney', 'Runway ML', 'Claude API', 'n8n', 'Promptly AI', 'JSON Prompts', 'Stable Diffusion', 'Synthesia', 'Luma AI', 'Pika Labs', 'Make.com', 'Zapier'],
      price: 12000,
      originalPrice: 25000,
      duration: '24 weeks + Lifetime Access',
      projects: 12,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      rating: 4.9,
      students: 15000,
      maxStudents: 20000,
      instructor: 'Dr. Sarah Chen - Former OpenAI Research Scientist',
      certification: 'Industry-Recognized AI Tools Professional Certificate',
      premiumFeatures: [
        '🎯 1-on-1 Weekly Mentorship Sessions',
        '💼 Professional Portfolio Development',
        '🚀 Job Placement Assistance Program',
        '🔄 Lifetime Access & Course Updates',
        '🏢 Enterprise Project Simulations',
        '📊 Performance Analytics & Tracking'
      ],
      modules: [
        {
          title: 'Module 1: Professional Image Creation & Brand Design',
          duration: '4 weeks',
          topics: ['DALL-E 3 Enterprise Techniques', 'Midjourney Professional Brand Workflows', 'Stable Diffusion Custom Model Training', 'Promptly AI Advanced Optimization', 'Commercial Image Enhancement', 'Brand Identity Creation', 'Copyright & Licensing Mastery', 'Client Presentation Techniques']
        },
        {
          title: 'Module 2: Cinematic Video Production & AI Storytelling',
          duration: '4 weeks',
          topics: ['Runway ML Professional Video Generation', 'Synthesia Enterprise AI Avatars', 'Luma AI Cinematic Sequences', 'Pika Labs Advanced Animation', 'AI-Powered Video Editing', 'Professional Storytelling Techniques', 'Client Video Production', 'Video Marketing Strategies']
        },
        {
          title: 'Module 3: Advanced Animation & Motion Graphics',
          duration: '4 weeks',
          topics: ['Runway Gen-2 Professional Animation', 'Stable Video Diffusion Mastery', 'Pika Labs Motion Control', 'Advanced Motion Brush Techniques', 'Cinematic Camera Movements', 'Professional Animation Workflows', 'Client Animation Projects', 'Motion Graphics for Business']
        },
        {
          title: 'Module 4: Enterprise Data Solutions & API Mastery',
          duration: '4 weeks',
          topics: ['Advanced JSON Prompt Engineering', 'Enterprise Data Generation', 'Professional API Integration', 'Custom Schema Architecture', 'Automated Business Workflows', 'Data Quality & Validation', 'Enterprise Security Practices', 'Scalable Data Solutions']
        },
        {
          title: 'Module 5: Business Automation & AI Agent Development',
          duration: '4 weeks',
          topics: ['n8n Enterprise Automation', 'Zapier Professional Integrations', 'Make.com Advanced Business Scenarios', 'Custom AI Agent Architecture', 'Multi-Platform Enterprise Integration', 'Business Process Optimization', 'ROI-Driven Automation', 'Client Automation Solutions']
        },
        {
          title: 'Module 6: Claude AI Enterprise Implementation',
          duration: '4 weeks',
          topics: ['Claude API Enterprise Integration', 'Advanced Prompt Engineering Mastery', 'Claude Projects & Custom Artifacts', 'Enterprise Application Development', 'Scalable Claude Implementation', 'API Optimization & Cost Management', 'Security & Compliance', 'Client Solution Development']
        }
      ]
    },
    {
      id: 'FRONTEND-BEGINNER',
      title: 'Frontend Development - Beginner',
      category: 'frontend',
      level: 'beginner',
      description: 'Start your web development journey with HTML, CSS, and JavaScript fundamentals',
      technologies: ['HTML', 'CSS', 'JavaScript', 'Git', 'VS Code'],
      price: 1200,
      duration: '8 weeks',
      projects: 5,
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop&crop=center',
      rating: 4.6,
      students: 15678,
      maxStudents: 20000,
      instructor: 'Mike Chen',
      modules: [
        {
          title: 'HTML Fundamentals',
          duration: '2 weeks',
          topics: ['HTML structure', 'Semantic elements', 'Forms and inputs', 'Accessibility basics']
        },
        {
          title: 'CSS Styling',
          duration: '2 weeks',
          topics: ['CSS selectors', 'Box model', 'Flexbox', 'Grid layout']
        },
        {
          title: 'JavaScript Basics',
          duration: '3 weeks',
          topics: ['Variables and functions', 'DOM manipulation', 'Events', 'ES6 features']
        },
        {
          title: 'Project Development',
          duration: '1 week',
          topics: ['Portfolio website', 'Responsive design', 'Code optimization', 'Deployment']
        }
      ]
    },
    {
      id: 'FRONTEND-INTERMEDIATE',
      title: 'Frontend Development - Intermediate',
      category: 'frontend',
      level: 'intermediate',
      description: 'Learn Django fundamentals, databases (MySQL & MongoDB), API integration, environment configuration, and web security best practices. Build backend-powered web applications while strengthening frontend integration skills.',
      technologies: [
        'HTML',
        'Web Development',
        'Object-Relational Mapping (ORM)',
        'Django',
        'MySQL',
        'Model View Controller (MVC)',
        'Database Development',
        'Web Applications',
        'Application Frameworks',
        'Back-End Web Development',
        'Database Management',
        'Web Servers',
        'Data Modeling',
        'MongoDB',
        'API Integration',
        'Environment Variables'
      ],
      price: 1950,
      duration: '10 weeks',
      projects: 4,
      image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=250&fit=crop&crop=center',
      rating: 4.7,
      students: 8453,
      maxStudents: 20000,
      instructor: 'Priya Sharma',
      modules: [
        {
          title: 'Module 1: Django Fundamentals & MVC',
          duration: '3 weeks',
          topics: ['Project setup', 'Apps & URL routing', 'Views & templates', 'Models & ORM']
        },
        {
          title: 'Module 2: Relational & Document Databases',
          duration: '3 weeks',
          topics: ['MySQL schema design', 'MongoDB collections', 'Data modeling patterns', 'CRUD operations']
        },
        {
          title: 'Module 3: API Integration & Environment Config',
          duration: '2 weeks',
          topics: ['REST APIs & requests', 'Authentication tokens', 'Environment variables (.env)', 'Config management']
        },
        {
          title: 'Module 4: Web Security Best Practices',
          duration: '2 weeks',
          topics: ['Input validation', 'Authentication & sessions', 'CSRF protection', 'Secure deployment']
        }
      ]
    },
    {
      id: 'FRONTEND-ADVANCED',
      title: 'Frontend Development - Advanced',
      category: 'frontend',
      level: 'advanced',
      description: 'Master modern frontend with MongoDB, Node.js, React, Django and similar tools — with integrated prompt engineering for Frontend Development',
      technologies: ['MongoDB', 'Node.js', 'React', 'Django', 'Prompt Engineering'],
      price: 9500,
      duration: '12 weeks',
      projects: 8,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center',
      rating: 4.9,
      students: 15000,
      maxStudents: 12000,
      instructor: 'David Kim',
      modules: [
        {
          title: 'Next.js Mastery',
          duration: '4 weeks',
          topics: ['SSR/SSG', 'API routes', 'Performance optimization', 'Deployment']
        },
        {
          title: 'State Management',
          duration: '3 weeks',
          topics: ['Redux Toolkit', 'Zustand', 'Context patterns', 'Data fetching']
        },
        {
          title: 'Testing & Quality',
          duration: '3 weeks',
          topics: ['Unit testing', 'Integration testing', 'E2E testing', 'Code quality']
        },
        {
          title: 'Advanced Topics',
          duration: '2 weeks',
          topics: ['Micro-frontends', 'PWA', 'Web performance', 'Security']
        }
      ]
    },
    {
      id: 'DEVOPS-BEGINNER',
      title: 'DevOps - Beginner',
      category: 'devops',
      level: 'beginner',
      description: 'Learn the fundamentals of DevOps, CI/CD, and cloud infrastructure',
      technologies: ['Docker', 'Git', 'Linux', 'AWS', 'Jenkins'],
      price: 1000,
      duration: '8 weeks',
      projects: 4,
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop&crop=center',
      rating: 4.5,
      students: 8765,
      maxStudents: 20000,
      instructor: 'Alex Thompson',
      modules: [
        {
          title: 'DevOps – Beginner',
          duration: '2 weeks',
          topics: ['DevOps culture', 'Version control', 'Linux basics', 'Command line']
        },
        {
          title: 'Containerization',
          duration: '2 weeks',
          topics: ['Docker basics', 'Container orchestration', 'Docker Compose', 'Best practices']
        },
        {
          title: 'CI/CD Pipelines',
          duration: '2 weeks',
          topics: ['Jenkins setup', 'Pipeline creation', 'Automated testing', 'Deployment strategies']
        },
        {
          title: 'Cloud Basics',
          duration: '2 weeks',
          topics: ['AWS fundamentals', 'EC2 instances', 'S3 storage', 'Basic networking']
        }
      ]
    },
    {
      id: 'devops-intermediate',
      title: 'DevOps - Intermediate',
      category: 'devops',
      level: 'intermediate',
      description: 'Advanced DevOps practices with Kubernetes, monitoring, and infrastructure as code',
      technologies: ['Kubernetes', 'Terraform', 'Prometheus', 'Grafana', 'Ansible'],
      price: 1400,
      duration: '10 weeks',
      projects: 6,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&crop=center',
      rating: 4.6,
      students: 15000,
      maxStudents: 12000,
      instructor: 'Maria Garcia',
      modules: [
        {
          title: 'Kubernetes Fundamentals',
          duration: '3 weeks',
          topics: ['Cluster setup', 'Pods and Services', 'Deployments', 'ConfigMaps and Secrets']
        },
        {
          title: 'Infrastructure as Code',
          duration: '3 weeks',
          topics: ['Terraform basics', 'State management', 'Modules', 'Best practices']
        },
        {
          title: 'Monitoring & Logging',
          duration: '2 weeks',
          topics: ['Prometheus setup', 'Grafana dashboards', 'Log aggregation', 'Alerting']
        },
        {
          title: 'Automation',
          duration: '2 weeks',
          topics: ['Ansible playbooks', 'Configuration management', 'Deployment automation', 'Security']
        }
      ]
    },
    {
      id: 'mobile-core',
      title: 'Mobile Development - Core',
      category: 'mobile',
      level: 'intermediate',
      description: 'Build cross-platform mobile apps with React Native and modern development practices',
      technologies: ['React Native', 'Expo', 'TypeScript', 'Redux', 'Firebase'],
      price: 3500,
      duration: '14 weeks',
      projects: 10,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&crop=center',
      rating: 4.8,
      students: 15000,
      maxStudents: 12000,
      instructor: 'James Wilson',
      modules: [
        {
          title: 'React Native Basics',
          duration: '4 weeks',
          topics: ['Setup and configuration', 'Components', 'Navigation', 'Styling']
        },
        {
          title: 'Advanced Features',
          duration: '4 weeks',
          topics: ['State management', 'API integration', 'Native modules', 'Performance']
        },
        {
          title: 'Backend Integration',
          duration: '3 weeks',
          topics: ['Firebase setup', 'Authentication', 'Database', 'Push notifications']
        },
        {
          title: 'Publishing & Deployment',
          duration: '3 weeks',
          topics: ['App store guidelines', 'Build process', 'Testing', 'Release management']
        }
      ]
    },
    {
      id: 'browser-extensions',
      title: 'Browser Extensions Development',
      category: 'web',
      level: 'intermediate',
      description: 'Create powerful browser extensions for Chrome, Firefox, and Edge',
      technologies: ['JavaScript', 'Chrome APIs', 'WebExtensions', 'Manifest V3', 'React'],
      price: 1500,
      duration: '6 weeks',
      projects: 4,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center',
      rating: 4.4,
      students: 15000,
      maxStudents: 12000,
      instructor: 'Lisa Chen',
      modules: [
        {
          title: 'Extension Fundamentals',
          duration: '2 weeks',
          topics: ['Manifest files', 'Background scripts', 'Content scripts', 'Popup interfaces']
        },
        {
          title: 'Advanced APIs',
          duration: '2 weeks',
          topics: ['Storage API', 'Messaging', 'Permissions', 'Cross-browser compatibility']
        },
        {
          title: 'UI Development',
          duration: '1 week',
          topics: ['React integration', 'Styling', 'User experience', 'Accessibility']
        },
        {
          title: 'Publishing & Distribution',
          duration: '1 week',
          topics: ['Store submission', 'Review process', 'Updates', 'Analytics']
        }
      ]
    },
    {
      id: 'NETWORKING-BEGINNER',
      title: 'Networking - Beginner',
      category: 'networking',
      level: 'beginner',
      description: 'Build a strong foundation in computer networks, protocols, network devices, and hands-on tools like Cisco Packet Tracer, Nmap, and Wireshark.',
      technologies: ['Cisco Packet Tracer', 'Nmap', 'Wireshark', 'Firewalls', 'Routers & Switches', 'Network Troubleshooting Tools'],
      price: 1500,
      duration: '8 weeks',
      projects: 4,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&crop=center',
      rating: 4.7,
      students: 12542,
      maxStudents: 20000,
      instructor: 'Alex Carter',
      modules: [
        {
          title: 'Networking Fundamentals',
          duration: '2 weeks',
          topics: [
            'OSI Model (All 7 Layers)',
            'TCP/IP Model',
            'IP Addressing (IPv4 & IPv6)',
            'TCP vs UDP',
            'MAC Address, ARP, DNS, DHCP',
            'Basic Protocols (HTTP, HTTPS, FTP, SMTP)',
            'Network Topologies & Architecture',
            'Concept of LAN, WAN, MAN, PAN'
          ]
        },
        {
          title: 'Cisco Packet Tracer – Network Building',
          duration: '2 weeks',
          topics: [
            'Installation & Setup',
            'Creating Your First Network',
            'Configuring Routers & Switches',
            'Assigning IP Addresses',
            'Building LAN & WAN Structures',
            'Simulating Real-Time Network Traffic',
            'Creating Your Own Mini-Lab'
          ]
        },
        {
          title: 'Nmap – Network Scanning Basics',
          duration: '1 week',
          topics: [
            'Introduction to Network Scanning',
            'Port Scanning & Host Discovery',
            'Nmap Commands',
            'Scanning Techniques (SYN Scan, UDP Scan)',
            'Detecting Services & OS Fingerprinting'
          ]
        },
        {
          title: 'Wireshark – Packet Analysis',
          duration: '1 week',
          topics: [
            'Introduction to Packet Capturing',
            'Understanding Frames, Packets & Segments',
            'Traffic Filtering',
            'Analyzing TCP/UDP Traffic',
            'Detecting Network Issues with Wireshark'
          ]
        },
        {
          title: 'Networking Troubleshooting',
          duration: '1 week',
          topics: [
            'Common Network Problems',
            'Ping, Traceroute, Netstat, ipconfig',
            'Connectivity Issues',
            'Diagnosing DNS & Routing Problems',
            'Tools and Best Practices for Troubleshooting'
          ]
        },
        {
          title: 'Network Devices & Firewalls',
          duration: '1 week',
          topics: [
            'Routers, Switches, Access Points',
            'Modems, Hubs, Repeaters, Bridges',
            'Introduction to Firewalls',
            'Types of Firewalls',
            'Basic Firewall Rules & Configuration',
            'Overview of Network Security Devices'
          ]
        }
      ]
    },
    {
      id: 'NETWORKING-INTERMEDIATE',
      title: 'Networking - Intermediate',
      category: 'networking',
      level: 'intermediate',
      description: 'Master advanced networking skills using Linux-based tools, server configuration, routing, switching, monitoring, and real-world network automation workflows.',
      technologies: [
        'Linux Networking', 'SSH', 'Netcat (nc)', 'Netstat / ss', 'tcpdump', 'Traceroute / MTR',
        'iptables / ufw / firewalld', 'OpenVPN / WireGuard', 'Nagios / Zabbix', 'SNMP',
        'Bonding & VLANs', 'Routing Protocols (OSPF/BGP basics)'
      ],
      price: 2200,
      duration: '10 weeks',
      projects: 6,
      image: 'https://images.pexels.com/photos/2881232/pexels-photo-2881232.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      rating: 4.8,
      students: 9431,
      maxStudents: 20000,
      instructor: 'Nina Patel',
      modules: [
        {
          title: 'Linux Networking Fundamentals (Advanced)',
          duration: '2 weeks',
          topics: [
            'Linux network configuration (ifconfig, ip, nmcli)',
            'Understanding network interfaces, links, routes',
            'Static & dynamic routing in Linux',
            'Host files, resolv.conf, DNS configuration',
            'Socket programming basics (theory)',
            'SSH, SCP, and secure remote access',
            'Network namespaces & virtual interfaces'
          ]
        },
        {
          title: 'Advanced Network Scanning & Analysis Tools',
          duration: '2 weeks',
          topics: [
            'Deep-dive into Nmap scripting engine (NSE)',
            'Masscan for high-speed scanning',
            'Netcat (nc) for port listening & banner grabbing',
            'tcpdump advanced packet capture',
            'ss & netstat for connection tracking',
            'Scanning services, OS fingerprinting, version detection',
            'Real-world enumeration workflows'
          ]
        },
        {
          title: 'Linux-Based Firewall & Security Devices',
          duration: '2 weeks',
          topics: [
            'iptables deep configuration',
            'NAT, DNAT, SNAT, MASQUERADE rules',
            'firewalld zones, policies, and rich rules',
            'ufw for simplified firewall management',
            'Intro to pfSense (overview)',
            'Configuring port forwarding, blocking, filtering',
            'Linux as a router + firewall combo'
          ]
        },
        {
          title: 'VPNs, Tunneling & Secure Communications',
          duration: '1.5 weeks',
          topics: [
            'OpenVPN setup (server + client)',
            'WireGuard VPN configuration',
            'SSH tunneling & port forwarding',
            'SOCKS proxy with SSH',
            'GRE tunnels',
            'IPsec fundamentals',
            'Secure remote access for enterprise networks'
          ]
        },
        {
          title: 'Network Monitoring, Logging & Performance Tools',
          duration: '1.5 weeks',
          topics: [
            'SNMP setup on Linux',
            'Nagios monitoring',
            'Zabbix installation & alerts',
            'Syslog management & rotation',
            'iftop, htop, bmon, nload for bandwidth monitoring',
            'MTR & traceroute advanced usage',
            'Network baseline creation and anomaly detection'
          ]
        },
        {
          title: 'Routing, Switching & VLANs in Linux',
          duration: '1 week',
          topics: [
            'Linux as a router',
            'Routing tables & policy-based routing',
            'VLAN creation with vconfig / ip link',
            'Bonding & link aggregation (LACP)',
            'Bridging interfaces',
            'DHCP server setup (dnsmasq / isc-dhcp)',
            'Mini enterprise network creation in Linux'
          ]
        }
      ]
    },
    {
      id: 'NETWORKING-ADVANCED',
      title: 'Networking – Advanced (CCNA Certification Track)',
      category: 'networking',
      level: 'advanced',
      description: 'Master enterprise networking, routing, switching, automation, and security to fully prepare for Cisco CCNA 200-301. Real-world Packet Tracer labs and CLI tasks throughout.',
      technologies: [
        'Cisco IOS CLI',
        'Cisco Packet Tracer',
        'GNS3 / EVE-NG (Intro)',
        'IPv4 & IPv6 Routing',
        'Static Routing',
        'RIP',
        'OSPF',
        'Inter-VLAN Routing',
        'NAT',
        'DHCP',
        'DNS',
        'SNMP',
        'ACLs (Standard & Extended)',
        'STP',
        'Port Security',
        'EtherChannel',
        'Wireless LAN Fundamentals',
        'Network Security Devices',
        'REST APIs',
        'Python for Networking Automation'
      ],
      price: 3000,
      duration: '12 weeks',
      projects: 10,
      image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      rating: 4.9,
      students: 11984,
      maxStudents: 20000,
      instructor: 'Marco Ruiz',
      modules: [
        {
          title: 'CCNA Introduction & Exam Orientation',
          duration: '0.5 week',
          topics: [
            'What is CCNA 200-301',
            'Exam Topics Breakdown',
            'Role of a Network Engineer',
            'Understanding Cisco IOS',
            'How to prepare for the exam',
            'How to practice labs (Packet Tracer & GNS3)'
          ]
        },
        {
          title: 'Network Fundamentals (20%)',
          duration: '1.5 weeks',
          topics: [
            'IPv4 & IPv6 Addressing',
            'Subnetting & VLSM',
            'Cabling Types (UTP, Fiber, Coaxial)',
            'Switching Concepts',
            'Routing Concepts',
            'Collision/Broadcast/Collision Domains',
            'Bandwidth, Latency, Throughput',
            'Interface & Cable Issues',
            'Basic Cisco IOS Configuration'
          ]
        },
        {
          title: 'Network Access (20%)',
          duration: '2 weeks',
          topics: [
            'Switch Operations',
            'MAC Address Table',
            'VLANs & Trunking',
            '802.1Q Tagging',
            'Inter-VLAN Routing',
            'STP (Spanning Tree Protocol)',
            'Port Security',
            'EtherChannel',
            'Labs: VLAN Setup',
            'Labs: Trunk Configuration',
            'Labs: STP Behavior',
            'Labs: Port Security Setup'
          ]
        },
        {
          title: 'IP Connectivity (25%)',
          duration: '2 weeks',
          topics: [
            'Static Routing',
            'Default Routes',
            'OSPF (Single Area)',
            'First-Hop Redundancy Concepts',
            'Router Selection Process',
            'ECMP Routing',
            'Routing Table Lookup',
            'IPv6 Routing',
            'Labs: Static Routing',
            'Labs: OSPF Configuration',
            'Labs: Default Routes',
            'Labs: IPv6 Routing'
          ]
        },
        {
          title: 'IP Services (10%)',
          duration: '1 week',
          topics: [
            'NAT, PAT',
            'DHCP, DNS',
            'SNMP Functions',
            'Syslog',
            'QoS Basics',
            'TFTP/FTP Services',
            'Labs: NAT/PAT Setup',
            'Labs: DHCP Server Config',
            'Labs: Syslog Logging'
          ]
        },
        {
          title: 'Security Fundamentals (15%)',
          duration: '1.5 weeks',
          topics: [
            'AAA Concepts',
            'WPA/WPA2 Security',
            'Secure Administration (SSH)',
            'Device Hardening',
            'Access Lists (Standard & Extended ACLs)',
            'VPN Fundamentals',
            'Firewall Basics',
            'Labs: ACL Filtering',
            'Labs: SSH Device Hardening'
          ]
        },
        {
          title: 'Wireless Networking (CCNA Wireless Basics)',
          duration: '1 week',
          topics: [
            'Wireless Standards (802.11)',
            'Frequencies & Channels',
            'WLC vs Autonomous AP',
            'SSID, Authentication, Encryption',
            'Wireless Troubleshooting'
          ]
        },
        {
          title: 'WAN Technologies',
          duration: '1 week',
          topics: [
            'VPN Concepts (IPsec)',
            'GRE Tunnels',
            'Metro Ethernet',
            'MPLS (overview)',
            'WAN Architecture'
          ]
        },
        {
          title: 'Automation & Programmability (10%)',
          duration: '1 week',
          topics: [
            'SDN Concepts',
            'REST APIs',
            'JSON & YAML',
            'Cisco DNA Center Basics',
            'Controller vs Distributed Networks',
            'Python Basics for Networking',
            'Automation Workflows',
            'Labs: Simple Python Interface Info',
            'Labs: REST API Example'
          ]
        },
        {
          title: 'Full CCNA Lab + Final Exam Simulation',
          duration: '1 week',
          topics: [
            'Complete Enterprise Network Setup',
            'Router & Switch Configuration',
            'OSPF + VLANs + ACLs + NAT',
            'Wireless + DHCP + Syslog',
            'Troubleshooting Scenarios',
            'CCNA-Level Final Exam (Mock Test)'
          ]
        }
      ]
    },
    {
      id: 'GENAI-BEGINNER',
      title: "Generative AI (Understanding and Building LLM's) - Beginner Level",
      category: 'ai',
      level: 'beginner',
      description: 'Intro to LLMs, prompt engineering, embeddings, and transformer basics. Build a simple chat assistant.',
      technologies: ['Python', 'OpenAI API', 'Hugging Face', 'Transformers', 'Embeddings', 'LangChain', 'LlamaIndex', 'FastAPI', 'Streamlit'],
      price: 1800,
      duration: '8 weeks',
      projects: 3,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      rating: 4.7,
      students: 4820,
      maxStudents: 20000,
      instructor: 'Ayesha Khan',
      modules: [
        { title: 'Foundations of Generative AI', duration: '1 week', topics: ['Generative models', 'LLMs overview', 'Use cases'] },
        { title: 'Transformers at a Glance', duration: '1 week', topics: ['Attention', 'Tokens', 'Embeddings'] },
        { title: 'Prompt Engineering Basics', duration: '2 weeks', topics: ['Prompt design', 'Chain-of-thought', 'System prompts'] },
        { title: 'APIs and Tooling', duration: '2 weeks', topics: ['OpenAI API', 'Hugging Face', 'LangChain'] },
        { title: 'Retrieval and Embeddings', duration: '1 week', topics: ['Vector stores', 'FAISS', 'Semantic search'] },
        { title: 'Mini Project: Chat Assistant', duration: '1 week', topics: ['Streamlit UI', 'FastAPI backend', 'Evaluation'] }
      ]
    },
    {
      id: 'GENAI-INTERMEDIATE',
      title: "Generative AI (Understanding and Building LLM's) - Intermediate Level",
      category: 'ai',
      level: 'intermediate',
      description: 'RAG systems, fine-tuning (LoRA/PEFT), tokenization, evaluation, and guardrails. Build production-grade apps.',
      technologies: ['PyTorch', 'HuggingFace Transformers', 'Datasets', 'Tokenizers', 'LangChain', 'Vector DB (FAISS/Pinecone)', 'FastAPI', 'Docker', 'Weights & Biases', 'LoRA / PEFT'],
      price: 2400,
      duration: '10 weeks',
      projects: 5,
      image: 'https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      rating: 4.8,
      students: 7210,
      maxStudents: 20000,
      instructor: 'Rahul Mehta',
      modules: [
        { title: 'Tokenization & Datasets', duration: '1 week', topics: ['Subword tokenizers', 'HF Datasets', 'Preprocessing'] },
        { title: 'RAG Architecture', duration: '2 weeks', topics: ['Indexing', 'Query pipelines', 'Context windows'] },
        { title: 'Fine-tuning with LoRA/PEFT', duration: '2 weeks', topics: ['Adapters', 'Training loops', 'Evaluation'] },
        { title: 'Guardrails & Safety', duration: '1 week', topics: ['Prompt safety', 'Content filters', 'OpenAI policies'] },
        { title: 'Observability & Experiment Tracking', duration: '1 week', topics: ['W&B', 'Metrics', 'A/B tests'] },
        { title: 'Packaging & Deployment', duration: '2 weeks', topics: ['Docker', 'FastAPI', 'CI/CD'] }
      ]
    },
    {
      id: 'GENAI-ADVANCED',
      title: "Generative AI (Understanding and Building LLM's) - Advanced Level",
      category: 'ai',
      level: 'advanced',
      description: 'Pretraining, RLHF/DPO, distributed training, quantization, and MLOps for scaling LLMs.',
      technologies: ['PyTorch', 'DeepSpeed', 'FSDP', 'PEFT', 'BitsAndBytes', 'RLHF (PPO/DPO)', 'GGUF/GPTQ', 'Kubernetes', 'Ray', 'Monitoring (Prometheus/W&B)'],
      price: 3500,
      duration: '12 weeks',
      projects: 8,
      image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      rating: 4.9,
      students: 3920,
      maxStudents: 20000,
      instructor: 'Dr. Elena Novikova',
      modules: [
        { title: 'LLM Pretraining Fundamentals', duration: '1 week', topics: ['Objective functions', 'Data pipelines', 'Scaling laws'] },
        { title: 'Distributed Training', duration: '2 weeks', topics: ['FSDP', 'DeepSpeed', 'Sharding'] },
        { title: 'Quantization & Inference', duration: '2 weeks', topics: ['BitsAndBytes', 'GGUF/GPTQ', 'Serving'] },
        { title: 'RLHF & DPO', duration: '2 weeks', topics: ['Reward modeling', 'PPO', 'DPO'] },
        { title: 'Evaluation & Alignment', duration: '1 week', topics: ['Benchmarks', 'Hallucination tests', 'Safety checks'] },
        { title: 'MLOps for LLMs', duration: '2 weeks', topics: ['Kubernetes', 'Ray', 'Monitoring'] },
        { title: 'Capstone: Fine-tuned LLM Service', duration: '2 weeks', topics: ['Data curation', 'Training', 'API serving'] }
      ]
    },
    {
      id: 'CYBER-SECURITY-BEGINNER',
      title: 'Cyber Security - Beginner',
      category: 'cyber',
      level: 'beginner',
      description: 'Start your cybersecurity journey by understanding core security concepts, operating systems, ethical tools, network analysis, firewalls, and foundational attack techniques.',
      technologies: ['Linux', 'Windows', 'Kali Linux', 'Parrot OS', 'Nmap', 'Wireshark', 'Gobuster', 'BloodHound', 'Firewalls', 'IDS/IPS', 'Encryption'],
      price: 1600,
      duration: '8 weeks',
      projects: 6,
      image: 'https://images.pexels.com/photos/5380643/pexels-photo-5380643.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      rating: 4.7,
      students: 12842,
      maxStudents: 20000,
      instructor: 'Rachel Kim',
      modules: [
        {
          title: 'Module 1: Cyber Security Fundamentals',
          duration: '2 weeks',
          topics: [
            'What is Cyber Security?',
            'CIA Triad (Confidentiality, Integrity, Availability)',
            'Threats, Vulnerabilities, and Risks',
            'Malware Types (Virus, Worm, Trojan, Ransomware)',
            'Security Policies & Best Practices',
            'Authentication vs Authorization',
            'Encryption Basics (Symmetric & Asymmetric)',
            'Hashing, Salting & Password Security',
            'Introduction to Ethical Hacking & Cyber Kill Chain'
          ]
        },
        {
          title: 'Module 2: Operating Systems for Cyber Security',
          duration: '2 weeks',
          topics: [
            'Windows OS Basics for Security',
            'Linux OS Basics (Directories & File Permissions)',
            'Kali Linux Overview and Use Cases',
            'Parrot Security OS Overview',
            'Raspberry Pi for Security Projects',
            'Flipper Zero – What It Is & Use Cases',
            'Essential Linux Commands (cd, ls, pwd, chmod, chown, mv, cp, rm)',
            'Package Management (apt, apt-get)',
            'SSH Basics & Creating SSH Keys'
          ]
        },
        {
          title: 'Module 3: Networking Tools – Nmap & Wireshark',
          duration: '1 week',
          topics: [
            'Introduction to Network Scanning',
            'Host Discovery',
            'Port Scanning Techniques',
            'Nmap Basic Commands',
            'OS Fingerprinting (Nmap)',
            'Introduction to Wireshark',
            'Packet Capturing Techniques',
            'Filtering Traffic in Wireshark',
            'Basic TCP/UDP Analysis'
          ]
        },
        {
          title: 'Module 4: Enumeration Tools – Nmap, Gobuster & BloodHound',
          duration: '1 week',
          topics: [
            'Nmap Service Enumeration',
            'Nmap Script Scanning (NSE Introduction)',
            'Understanding Web Enumeration',
            'Gobuster Directory Bruteforcing',
            'Gobuster DNS Enumeration',
            'Active Directory Basics',
            'What is BloodHound?',
            'Mapping AD Relationships with BloodHound',
            'Privilege Escalation Concepts'
          ]
        },
        {
          title: 'Module 5: Firewalls & Network Protection',
          duration: '1 week',
          topics: [
            'What is a Firewall?',
            'Packet Filtering Firewalls',
            'Stateful & Stateless Firewalls',
            'Application-Level Firewalls',
            'IDS vs IPS',
            'Proxy Servers',
            'NAT & Port Forwarding Basics',
            'Basic Firewall Rules & Policies',
            'Real-world Firewall Use Cases'
          ]
        },
        {
          title: 'Module 6: Cyber Attacks & Security Certifications Introduction',
          duration: '1 week',
          topics: [
            'Phishing Attacks',
            'Brute-Force & Password Attacks',
            'Man-in-the-Middle Attacks',
            'Social Engineering Basics',
            'Denial-of-Service (DoS) Attacks',
            'SQL Injection Basics',
            'XSS (Cross-Site Scripting) Basics',
            'Malware Delivery Techniques',
            'Introduction to Certifications (CompTIA Security+, A+, Network+, CEH, OSCP, CC, etc.)'
          ]
        }
      ]
    },
    {
      id: 'CYBER-SECURITY-INTERMEDIATE',
      title: 'Cyber Security - Intermediate',
      category: 'cyber',
      level: 'intermediate',
      description: "Master advanced hacking methodologies, virus creation concepts, password cracking, backdoors, SQL injection, social engineering, phishing, cloud & IoT attacks, post-exploitation, reporting, and tool analysis.",
      technologies: ['Kali Linux', 'John the Ripper', 'Hydra', 'Hashcat', 'CeWL', 'Medusa', 'Netcat', 'msfvenom', 'Meterpreter', 'SQLMap', 'SET', 'Metasploit', 'Python', 'Bash', 'GitHub'],
      price: 2400,
      duration: '10 weeks',
      projects: 12,
      image: 'https://images.pexels.com/photos/5380643/pexels-photo-5380643.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      rating: 4.8,
      students: 9560,
      maxStudents: 20000,
      instructor: 'Omar Hassan',
      modules: [
        { title: 'Module 1: Viruses & Malware Engineering', duration: '1 week', topics: [
          'What is a Computer Virus?',
          'Worms vs Viruses',
          'Trojans & RATs',
          'File Infectors',
          'Macro & Script-based Viruses',
          'Boot Sector Viruses',
          'Polymorphic & Metamorphic Viruses',
          'Ransomware Fundamentals',
          'How AI Can Generate a Virus (Ethical Demonstration)'
        ]},
        { title: 'Module 2: Password Cracking in Kali Linux', duration: '1 week', topics: [
          'Introduction to Password Cracking',
          'John the Ripper Basics',
          'John the Ripper Wordlist Attacks',
          'Introduction to Hydra',
          'Password Cracking with Hydra (SSH, FTP, HTTP)',
          'Hashcat Basics & GPU Cracking',
          'CeWL – Wordlist Generator',
          'Medusa – Parallel Bruteforce Tool',
          'Ethical Use of Password Cracking Tools'
        ]},
        { title: 'Module 3: Backdoors & Persistence', duration: '1 week', topics: [
          'What is a Backdoor?',
          'Remote Access Trojans (RATs)',
          'Bind Shells vs Reverse Shells',
          'Netcat Backdoor Techniques',
          'msfvenom Payload Creation',
          'Meterpreter Backdoor Sessions',
          'Persistence Mechanisms in Linux',
          'Persistence Techniques in Windows',
          'How to Create a Backdoor (Ethical Demo)'
        ]},
        { title: 'Module 4: SQL Injection & Bug Bounty Introduction', duration: '1 week', topics: [
          'What is SQL Injection?',
          'Types of SQL Injection (Union, Blind, Error-Based)',
          'SQLMap Tool Basics',
          'Manual SQL Injection Testing',
          'Database Fingerprinting',
          'Bypassing Login Panels',
          'Extracting Data via SQLi',
          'Preventing SQL Injection',
          'What is Bug Bounty Hunting?'
        ]},
        { title: 'Module 5: Social Engineering Attacks', duration: '1 week', topics: [
          'Introduction to Social Engineering',
          'Pretexting Techniques',
          'Impersonation Attacks',
          'Physical Social Engineering Attacks',
          'Tailgating & Dumpster Diving',
          'Social Engineering Toolkits (SET)',
          'Methods of Influence',
          'Psychological Manipulation Techniques',
          'Summary & Real-World Examples'
        ]},
        { title: 'Module 6: Everything About Phishing Attacks', duration: '1 week', topics: [
          'What is Phishing?',
          'Email Phishing Attacks',
          'Spear Phishing',
          'Whaling Attacks',
          'Clone Phishing',
          'SMS Phishing (Smishing)',
          'Voice Phishing (Vishing)',
          'Phishing Toolkits & Frameworks',
          'Real-World Case Study'
        ]},
        { title: 'Module 7: Cloud, Mobile & IoT Security', duration: '1 week', topics: [
          'Introduction to Cloud & IoT Threats',
          'Cloud Attack Vectors',
          'Vulnerabilities in Cloud Platforms',
          'Attacking Containers & Virtual Machines',
          'Mobile OS Vulnerabilities (Android/iOS)',
          'IoT Device Exploitation Basics',
          'Common Attacks on Specialized Systems',
          'Securing Cloud & IoT',
          'Summary'
        ]},
        { title: 'Module 8: Post-Exploitation Techniques', duration: '1 week', topics: [
          'Introduction to Post-Exploitation',
          'Privilege Escalation Basics',
          'Creating Foothold in a System',
          'Maintaining Persistence',
          'Lateral Movement Techniques',
          'Tokens & Credential Dumping',
          'Detection Avoidance Techniques',
          'Internal Network Enumeration',
          'Summary'
        ]},
        { title: 'Module 9: Reporting & Communication in Cyber Security', duration: '1 week', topics: [
          'Introduction to Security Reporting',
          'Components of a Good Penetration Testing Report',
          'Writing Executive Summaries',
          'Documenting Vulnerabilities & Evidence',
          'Remediation Recommendations',
          'Communication with Clients During Pentesting',
          'Report Delivery Best Practices',
          'Ethics & Confidentiality',
          'Summary'
        ]},
        { title: 'Module 10: Tools & Code Analysis', duration: '1 week', topics: [
          'Introduction to Scripting for Cyber Security',
          'Understanding Python & Bash Basics',
          'Analyzing Exploit Code',
          'Common Automation Scripts for Pentesting',
          'Working with GitHub Exploits',
          'Using Metasploit Modules',
          'Static vs Dynamic Code Analysis',
          'Identifying Malicious Code Patterns',
          'Summary'
        ]}
      ]
    },
    {
      id: 'CYBER-SECURITY-ADVANCED',
      title: 'Cyber Security - Advanced',
      category: 'cyber',
      level: 'advanced',
      description: 'Master OS, networking, IAM, crypto, hardening, ethical hacking, IR/forensics, cloud, and full Security+/A+ prep with hands-on labs.',
      technologies: ['OS Internals', 'Networking', 'IAM', 'Cryptography', 'Endpoint Hardening', 'Ethical Hacking', 'Incident Response', 'Forensics', 'Cloud Security', 'Virtualization'],
      price: 3200,
      duration: '12 weeks',
      projects: 6,
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=60',
      rating: 4.8,
      students: 2750,
      maxStudents: 20000,
      instructor: 'Elena Novikova',
      modules: [
        { title: 'Module 1: Operating System Mastery for Security & IT', duration: '1 week', topics: [
          'Windows OS Architecture',
          'Linux Internals (Advanced)',
          'File systems: NTFS, FAT32, ext4, XFS',
          'System logs & auditing',
          'OS hardening techniques',
          'Boot process & troubleshooting (BIOS/UEFI)',
          'Disk partitioning, imaging & recovery',
          'Hands-On: Windows Admin Tools, systemctl/journalctl, diskpart/gparted, chroot, fsck, dd'
        ]},
        { title: 'Module 2: Networking Mastery for Cybersecurity', duration: '1 week', topics: [
          'Advanced TCP/IP operations',
          'VLANs, Subnets, Routing protocols',
          'Firewalls, NAT, Port Forwarding',
          'Wireless security standards',
          'VPNs (IPSec, OpenVPN, WireGuard)',
          'Network Troubleshooting (A+ Core)',
          'Hands-On: Packet Tracer/GNS3, Wireshark, tcpdump',
          'Hands-On: iptables, ufw, traceroute, mtr, nmap, OpenVPN/WireGuard'
        ]},
        { title: 'Module 3: Hardware & Device Security (A+ Core Coverage)', duration: '1 week', topics: [
          'Computer hardware components',
          'Peripherals, printers, IoT devices',
          'Storage devices & RAID',
          'Mobile device security',
          'BIOS/UEFI security',
          'Safe disposal & data protection',
          'Hands-On: Memtest86, CrystalDiskInfo, SMART monitoring, BIOS security configuration'
        ]},
        { title: 'Module 4: Identity, Access & Authentication', duration: '1 week', topics: [
          'AAA: Authentication, Authorization, Accounting',
          'MFA, RBAC, ABAC, DAC/MAC',
          'SSO & federated identity',
          'Credential management & password policies',
          'Biometrics & zero-trust',
          'Hands-On: FreeIPA, Active Directory, OpenLDAP, SSH key management, Vault'
        ]},
        { title: 'Module 5: Cryptography & Secure Communications', duration: '1 week', topics: [
          'Symmetric / Asymmetric encryption',
          'TLS/SSL, HTTPS',
          'Hashing, Salting',
          'Digital certificates & PKI',
          'VPN cryptography',
          'Cryptographic attacks',
          'Hands-On: OpenSSL, GPG, Hashcat, Wireshark TLS decryption, CA setup'
        ]},
        { title: 'Module 6: Endpoint Security & System Hardening', duration: '1 week', topics: [
          'Endpoint protection, EDR/XDR basics',
          'Host firewalls',
          'Application whitelisting',
          'Patch management',
          'Secure configurations (CIS Benchmarks)',
          'Malware analysis fundamentals',
          'Hands-On: ClamAV, Rkhunter, chkrootkit, Sysinternals, OSQuery, Lynis'
        ]},
        { title: 'Module 7: Ethical Hacking & Penetration Testing', duration: '1 week', topics: [
          'Reconnaissance',
          'Scanning & enumeration',
          'Vulnerability exploitation',
          'Privilege escalation',
          'Web security tests',
          'Practical exploitation labs',
          'Hands-On: Kali, nmap/masscan, Metasploit, Burp, sqlmap, Hydra, John, Nikto'
        ]},
        { title: 'Module 8: Incident Response & Digital Forensics', duration: '1 week', topics: [
          'Incident response lifecycle',
          'Types of attacks',
          'Log analysis',
          'SIEM operations',
          'Disk imaging & volatile memory capture',
          'Forensic chain of custody',
          'Hands-On: Autopsy, FTK Imager, Volatility, Splunk/Wazuh, syslog, tcpdump/Wireshark'
        ]},
        { title: 'Module 9: Cloud Security & Virtualization', duration: '1 week', topics: [
          'Virtualization (VMware, VirtualBox, Proxmox)',
          'Cloud fundamentals (Azure/AWS basics)',
          'IAM cloud policies',
          'Secure cloud networking',
          'Container basics (Docker, image security)',
          'Cloud storage security',
          'Hands-On: VirtualBox labs, Docker, AWS/Azure Free Tier, Minikube (basic)'
        ]},
        { title: 'Module 10: Complete Security+ & A+ Exam Preparation Bootcamp', duration: '1 week', topics: [
          'Complete Security+ Blueprint mapping',
          'A+ Core 1 + Core 2 coverage',
          '200+ scenario-based questions',
          'Attack simulation labs',
          'Troubleshooting war-room practice',
          'OS issues, network issues, security incidents',
          'Hands-On: Boson/SY0-701 tests, VulnHub/TryHackMe, VirtualBox home lab, A+ break-fix'
        ]}
      ]
    },
    {
      id: 'DATA-SCIENCE-BEGINNER',
      title: 'Data Science - Beginner',
      category: 'data-science',
      level: 'beginner',
      description: 'Learn Python, statistics, data wrangling, and EDA.',
      technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
      price: 1800,
      duration: '8 weeks',
      projects: 4,
      image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=400&h=250&q=60',
      rating: 4.6,
      students: 2100,
      maxStudents: 20000,
      instructor: 'Priya Sharma',
      modules: [
        { title: 'Python Foundations for Data', duration: '2 weeks', topics: ['Syntax', 'Data types', 'Functions'] },
        { title: 'Data Wrangling & Cleaning', duration: '2 weeks', topics: ['Pandas basics', 'Missing values', 'Joins'] },
        { title: 'Exploratory Data Analysis', duration: '2 weeks', topics: ['Descriptive stats', 'Visualization'] },
        { title: 'Mini Project', duration: '2 weeks', topics: ['EDA report'] }
      ]
    },
    {
      id: 'DATA-SCIENCE-INTERMEDIATE',
      title: 'Data Science - Intermediate',
      category: 'data-science',
      level: 'intermediate',
      description: 'Statistics, feature engineering, model training, and evaluation.',
      technologies: ['Scikit-learn', 'Statsmodels', 'Jupyter', 'Pandas'],
      price: 2400,
      duration: '10 weeks',
      projects: 5,
      image: 'https://images.unsplash.com/photo-1557425493-6f90ae4659fc?auto=format&fit=crop&w=400&h=250&q=60',
      rating: 4.7,
      students: 1750,
      maxStudents: 20000,
      instructor: 'Miguel Alvarez',
      modules: [
        { title: 'Statistics for DS', duration: '2 weeks', topics: ['Probability', 'Distributions', 'Hypothesis tests'] },
        { title: 'Feature Engineering', duration: '2 weeks', topics: ['Encoding', 'Scaling', 'Pipelines'] },
        { title: 'Modeling & Evaluation', duration: '3 weeks', topics: ['Regression', 'Classification', 'Metrics', 'Cross-validation'] },
        { title: 'Capstone Prep', duration: '3 weeks', topics: ['Framing', 'Iteration', 'Interpretation'] }
      ]
    },
    {
      id: 'DATA-SCIENCE-ADVANCED',
      title: 'Data Science - Advanced',
      category: 'data-science',
      level: 'advanced',
      description: 'Prod ML pipelines, experiment tracking, deployment, and monitoring.',
      technologies: ['XGBoost', 'LightGBM', 'MLflow', 'Docker', 'FastAPI'],
      price: 2900,
      duration: '12 weeks',
      projects: 6,
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=400&h=250&q=60',
      rating: 4.8,
      students: 1320,
      maxStudents: 20000,
      instructor: 'Sara Cohen',
      modules: [
        { title: 'Advanced Modeling', duration: '3 weeks', topics: ['Ensembles', 'Hyperparameters', 'Imbalanced data'] },
        { title: 'Experiment Tracking & Pipelines', duration: '3 weeks', topics: ['MLflow', 'Artifacts', 'Reproducibility'] },
        { title: 'Deployment & Monitoring', duration: '3 weeks', topics: ['FastAPI', 'Docker', 'Serving', 'Drift detection'] },
        { title: 'Capstone: Production ML', duration: '3 weeks', topics: ['Pipeline', 'Docs', 'Presentation'] }
      ]
    }
  ];

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
  console.log('enrolledCoursesData:', enrolledCoursesData);
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
  console.log('Final enrolledCourses:', enrolledCourses);

  const recommendedCourses = allCourses.filter(course => 
    !enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id)
  ).slice(0, 6);

  const getEnrolledCourseImage = (course: Course): string | undefined => {
    const key = normalizeCourseKey(course.courseId || course.id);
    const match = allCourses.find(c => normalizeCourseKey(c.id) === key);
    return match?.image || course.image;
  };

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
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
      title: 'DevOps Beginner Assignment',
      courseId: 'devops-beginner',
      courseName: 'DevOps - Beginner',
      dueDate: '2024-04-01',
      status: 'pending',
      description: 'Learn DevOps fundamentals including CI/CD, containerization, and automation practices.'
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
    { id: 'dashboard', label: 'Overview', icon: HomeIcon, isActive: true },
    { id: 'courses', label: 'My Courses', icon: BookOpenIcon },
    { id: 'projects', label: 'Projects', icon: ClipboardDocumentListIcon },
    { id: 'assignments', label: 'Assignments', icon: ClipboardDocumentListIcon },
    { id: 'browse-courses', label: 'Browse Courses', icon: GlobeAltIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
    { id: 'history', label: 'History', icon: ClipboardDocumentListIcon },
  ];

  // Maintain active tab locally; no BubbleMenu hashes
  useEffect(() => {
    // Default to dashboard
    if (!activeTab) setActiveTab('dashboard');
  }, []);

  useEffect(() => {
    const state = location.state as { activeTab?: string } | null;
    if (state && state.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      navigate('/student-login');
      return;
    }

    const loadStudentData = async () => {
      try {
        const userData = JSON.parse(currentUser);
        if (!userData.isAuthenticated) {
          navigate('/student-login');
          return;
        }

        // Fetch purchased courses from backend
        try {
          console.log('Fetching courses from backend for:', userData.email);
          const response = await fetch(`${BASE_URL}/api/courses/purchased/${userData.email}`, {
            headers: {
              Authorization: `Bearer ${userData.token}`
            }
          });
          if (response.ok) {
            const result = await response.json();
            console.log('Backend response:', result);
            if (result.success && result.data) {
              // Backend now returns full course details with enrollment info
              let enrolledCoursesData = result.data || [];

              // Fix course titles from backend
              enrolledCoursesData = enrolledCoursesData.map((course: any) => {
                if (course.title === 'DevOps Fundamentals') {
                  return { ...course, title: 'DevOps – Beginner' };
                }
                return course;
              });

              // Set purchased courses (just the IDs for compatibility)
              const courseIds = enrolledCoursesData.map((course: any) => course.courseId || course.id);
              setPurchasedCourses(courseIds);
              
              // Set the full course data for display
              setEnrolledCoursesData(enrolledCoursesData);
              console.log("Enrolled Course Data", enrolledCoursesData);
              

              
              // Create course progress from enrollment data
              const progressData = enrolledCoursesData.reduce((acc: any, course: any) => {
                const courseId = course.courseId || course.id;
                acc[courseId] = {
                  courseId: courseId,
                  progress: course.progress || 0,
                  completedLessons: 0, // This should come from enrollment data
                  totalLessons: course.modules?.length * 5 || 20, // Estimate based on modules
                  lastAccessedAt: course.enrollmentDate || new Date().toISOString(),
                  nextLesson: course.progress > 0 ? 'Continue Learning' : 'Start Course',
                  isStarted: course.progress > 0 || course.status === 'active'
                };
                return acc;
              }, {});
              
              setCourseProgress(progressData);
              console.log('Set course progress:', progressData);
              
              // Fetch module submissions for each enrolled course
              for (const course of enrolledCoursesData) {
                const courseId = course.id; // Use the MongoDB _id
                await fetchModuleSubmissions(userData.id, courseId);
              }
            } else {
              console.log('No courses found in backend response');
              setPurchasedCourses([]);
              setEnrolledCoursesData([]);
              setCourseProgress({});
            }
          } else {
            console.error('Backend request failed:', response.status);
            setPurchasedCourses([]);
            setEnrolledCoursesData([]);
          }
        } catch (error) {
          console.error('Error fetching purchased courses:', error);
          // Set empty data if backend fails
          setPurchasedCourses([]);
          setEnrolledCoursesData([]);
          setCourseProgress({});
        }

        // Try to fetch additional student data from backend
        let studentData = userData;
        try {
          const response = await fetch(`${BASE_URL}/api/students/${userData.id}`, {
            headers: {
              'Authorization': `Bearer ${userData.token}`
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log("Result Data IN student portal: ", result.data);
            if (result.success) {
              studentData = { ...userData, ...result.data };
            }
          }
        } catch (error) {
          console.log('Could not fetch additional student data from backend, using localStorage data');
        }

        const fullName = [studentData.firstName, studentData.lastName].filter(Boolean).join(' ').trim();
        setStudentProfile({
          name: fullName || 'Student Name',
          email: studentData.email || 'student@example.com',
          enrolledCourses: purchasedCourses.length,
          phone: studentData.phone || 'Not provided',
          location: studentData.address ? `${studentData.address.city}, ${studentData.address.state}` : 'Not provided',
          joinDate: studentData.createdAt || new Date().toISOString(),
          studentId: studentData.studentId || 'Not assigned',
          dateOfBirth: studentData.dateOfBirth,
          education: studentData.education,
          experience: studentData.experience
        });
      } catch (error) {
        console.error('Error loading student data:', error);
        setStudentProfile({
          name: 'undefined undefined',
          email: 'student@example.com',
          enrolledCourses: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, [navigate]);

  const handleContinueLearning = (courseId: string) => {
    // Check payment confirmation status before allowing access
    const courseData = enrolledCoursesData.find(c => c.courseId === courseId);
    console.log(enrolledCoursesData);
    console.log("CourseData: ", courseData);
    const confirmationStatus = courseData?.confirmationStatus || 'unknown';
    const paymentStatus = courseData?.paymentStatus || 'unknown';
    
    console.log('Course access check:', {
      courseId,
      confirmationStatus,
      paymentStatus,
      courseData
    });
    
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
    console.log('Navigating to course:', courseId);
    
    const courseRoutes: { [key: string]: string } = {
      'frontend-beginner': '/frontend-development-beginner',
      'FRONTEND-BEGINNER': '/frontend-development-beginner',
      'Frontend Development - Beginner': '/frontend-development-beginner',
      'frontend-intermediate': '/frontend-development-intermediate',
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
      'cybersecurity-advanced': '/cyber-security-advanced'
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
        console.error('Error verifying referral code:', error);
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
      console.error('Payment submission error:', error);
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
                        console.log("Enrolled data: ", result.data);
                        if (result.success && result.data) {
                          const enrolledCoursesData = result.data || [];
                          const courseIds = enrolledCoursesData.map((course: any) => course.courseId || course.id);
                          setPurchasedCourses(courseIds);
                          setEnrolledCoursesData(enrolledCoursesData);
                          
                          const progressData = enrolledCoursesData.reduce((acc: any, course: any) => {
                            const courseId = course.courseId || course.id;
                            acc[courseId] = {
                              courseId: courseId,
                              progress: course.progress || 0,
                              completedLessons: 0,
                              totalLessons: course.modules?.length * 5 || 20,
                              lastAccessedAt: course.enrollmentDate || new Date().toISOString(),
                              nextLesson: course.progress > 0 ? 'Continue Learning' : 'Start Course',
                              isStarted: course.progress > 0 || course.status === 'active'
                            };
                            return acc;
                          }, {});
                          
                          setCourseProgress(progressData);
                        }
                      }
                    } catch (error) {
                      console.error('Error refreshing course data:', error);
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
                console.log(`🔍 Course ${course.title} Status Debug:`, {
                  confirmationStatus,
                  enrollmentStatus,
                  paymentStatus: course.paymentStatus,
                  enrollmentConfirmationStatus: course.enrollmentConfirmationStatus,
                  adminConfirmedBy: course.adminConfirmedBy,
                  fullCourse: course
                });
                
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
                
                console.log(`🎯 Course ${course.title} Final Status:`, {
                  isAccessAllowed,
                  isPending, 
                  isRejected,
                  hasNoPayment
                });
                
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
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-bold">Assignments</h2>
            
            {/* Course Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Select Course</h3>
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
                          <p className="text-sm text-gray-400">{course.instructor}</p>
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
                  console.log('Filtering assignments:', {
                    selectedCourse: selectedCourseForAssignments,
                    mappedIds,
                    assignmentCourseId: assignment.courseId,
                    includes: mappedIds.includes(assignment.courseId)
                  });
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
                      By {course.instructor}
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
                          console.error('Password update error:', err);
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
                          <p className="text-sm text-gray-400">{course.instructor}</p>
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
                  console.log('Filtering projects:', {
                    selectedCourse: selectedCourseForProjects,
                    mappedIds,
                    projectCourseId: project.courseId,
                    includes: mappedIds.includes(project.courseId)
                  });
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
                                  console.log('Submitting with data:', {
                                    courseId: courseData.id,
                                    moduleId: moduleId,
                                    submissionUrl: submissionUrl,
                                    projectId: project.id
                                  });
                                  
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-100">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex relative overflow-hidden">

      {/* Professional Sidebar navigation */}
      <Sidebar
        items={sidebarItems}
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id)}
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
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Top Header */}
        <header className="px-4 pt-4">
          <div className="max-w-6xl mx-auto flex items-center justify-end space-x-4">
            <BellIcon className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium border border-red-500/50"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-4 pb-8 overflow-x-hidden bg-gray-950 text-gray-100">

          {activeTab === 'dashboard' ? (
            <React.Fragment>
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 lg:col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Welcome Back,</p>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {studentProfile?.name || 'Student'}
                      </h2>
                      <p className="text-gray-300 text-sm">
                        You have 3 new notifications and {assignments.filter(a => (assignmentStatuses[a.id] || a.status) === 'pending').length} assignments due.
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-28 h-28 rounded-3xl overflow-hidden border border-green-500/40 shadow-lg shadow-green-500/20">
                        <img
                          src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=400"
                          alt="Happy student holding books"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Quick Access</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setActiveTab('browse-courses')}
                        className="group flex flex-col items-center justify-center rounded-2xl px-4 py-5 bg-white/5 border border-white/10 backdrop-blur-lg text-white text-xs font-medium shadow-sm hover:bg-white/10 hover:-translate-y-0.5 transition-all"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                          <Squares2X2Icon className="h-5 w-5" />
                        </div>
                        <span className="text-center leading-snug">Browse Courses</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('assignments')}
                        className="group flex flex-col items-center justify-center rounded-2xl px-4 py-5 bg-white/5 border border-white/10 backdrop-blur-lg text-white text-xs font-medium shadow-sm hover:bg-white/10 hover:-translate-y-0.5 transition-all"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                          <CalendarDaysIcon className="h-5 w-5" />
                        </div>
                        <span className="text-center leading-snug">View Schedules</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-white text-2xl font-bold mb-4">Upcoming Assignments</h3>
                  {assignments.filter(a => (assignmentStatuses[a.id] || a.status) === 'pending').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assignments
                        .filter(a => (assignmentStatuses[a.id] || a.status) === 'pending')
                        .slice(0, 4)
                        .map(assignment => (
                          <div
                            key={assignment.id}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 bg-gray-800"
                          >
                            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white text-lg">
                              📝
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {assignment.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">You have no upcoming assignments.</p>
                  )}
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-white text-2xl font-bold mb-4">My Enrolled Courses</h3>
                  {enrolledCoursesData.length > 0 ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => scrollCarousel(enrolledCarouselRef, 'left')}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-gray-800 shadow text-gray-100 hover:bg-gray-700"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollCarousel(enrolledCarouselRef, 'right')}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-gray-800 shadow text-gray-100 hover:bg-gray-700"
                      >
                        ›
                      </button>
                      <div
                        ref={enrolledCarouselRef}
                        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                      >
                        {enrolledCoursesData.map((course) => {
                          const progress = courseProgress[course.courseId || course.id];
                          const image = getEnrolledCourseImage(course);
                          return (
                            <div
                              key={course.id}
                              className="min-w-[260px] max-w-[260px] bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                            >
                              <div className="relative h-32 overflow-hidden">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                                )}
                                <div className="absolute top-2 left-2">
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-500 text-white">
                                    Enrolled
                                  </span>
                                </div>
                              </div>
                              <div className="p-4">
                                <h4 className="text-white text-sm font-semibold mb-1 line-clamp-2">
                                  {getCourseTitleFromKey(normalizeCourseKey(course.courseId || course.id)) || course.title}
                                </h4>
                                <p className="text-gray-400 text-xs mb-2">
                                  {course.duration}
                                </p>
                                {progress && (
                                  <div className="mt-2 space-y-2">
                                    <div>
                                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                        <span>Progress</span>
                                        <span>{progress.progress || 0}%</span>
                                      </div>
                                      <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                        <div
                                          className="h-full bg-green-500"
                                          style={{ width: `${Math.min(progress.progress || 0, 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleContinueLearning(course.courseId || course.id)}
                                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                                    >
                                      Continue Learning
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No courses enrolled yet.</p>
                  )}
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white text-2xl font-bold">What to learn next</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('browse-courses')}
                      className="text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      View all
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Popular picks based on your interests.
                  </p>
                  {recommendedCourses.length > 0 ? (
                    <div
                      ref={recommendedCarouselRef}
                      className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                    >
                      {recommendedCourses.map((course) => (
                        <div
                          key={course.id}
                          className="min-w-[220px] max-w-[230px] bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                          onClick={() => handleCourseDetails(course as any)}
                        >
                          <div className="relative h-28 overflow-hidden">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="text-white text-sm font-semibold mb-1 line-clamp-2">
                              {course.title}
                            </h4>
                            <p className="text-gray-400 text-xs mb-2">
                              {course.duration} • {course.projects} projects
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-300">
                              <span className="font-semibold">
                                {'₹'}{course.price.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-yellow-400">★</span>
                                <span>{course.rating}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">You have explored all available courses.</p>
                  )}
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 overflow-hidden">
                   <h3 className="text-white text-2xl font-bold mb-4">Student Reviews</h3>
                   <StudentReviews />
                </div>
              </div>
            </React.Fragment>
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

      {/* Study Materials Modal */}
      {showStudyMaterialsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Study Materials</h3>
                <button
                  onClick={() => setShowStudyMaterialsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                {selectedStudyMaterials.map((material, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">Study Material {index + 1}</span>
                    </div>
                    <p className="text-gray-300 mt-2">{material}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowStudyMaterialsModal(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Questions Modal */}
      {showTestQuestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Practice Test</h3>
                <button
                  onClick={() => setShowTestQuestionsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              {!testResults ? (
                <div className="space-y-6">
                  {selectedTestQuestions?.map((question, questionIndex) => (
                    <div key={questionIndex} className="bg-gray-800 rounded-lg p-6">
                      <h4 className="text-white text-lg font-semibold mb-4">
                        Question {questionIndex + 1}: {question.question}
                      </h4>
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              value={optionIndex}
                              checked={currentTestAnswers[questionIndex] === optionIndex}
                              onChange={() =>
                                setCurrentTestAnswers((prev) => ({
                                  ...prev,
                                  [questionIndex]: optionIndex,
                                }))
                              }
                              className="text-purple-600"
                            />
                            <span className="text-gray-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        const score = selectedTestQuestions?.reduce(
                          (acc: number, question: any, index: number) => {
                            return acc + (currentTestAnswers[index] === question.correctAnswer ? 1 : 0);
                          },
                          0
                        ) || 0;
                        setTestResults({ score, total: selectedTestQuestions?.length || 0 });
                      }}
                      disabled={Object.keys(currentTestAnswers).length !== selectedTestQuestions?.length}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors"
                    >
                      Submit Test
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-800 rounded-lg p-8 mb-6">
                    <h4 className="text-2xl font-bold text-white mb-4">Test Results</h4>
                    <div className="text-6xl font-bold mb-4">
                      <span
                        className={testResults.score >= testResults.total * 0.7 ? 'text-green-400' : 'text-red-400'}
                      >
                        {Math.round((testResults.score / testResults.total) * 100)}%
                      </span>
                    </div>
                    <p className="text-gray-300 text-lg">
                      You scored {testResults.score} out of {testResults.total} questions correctly
                    </p>
                    {testResults.score >= testResults.total * 0.7 ? (
                      <p className="text-green-400 mt-2">Great job! You passed the test!</p>
                    ) : (
                      <p className="text-red-400 mt-2">Keep studying and try again!</p>
                    )}
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => {
                        setCurrentTestAnswers({});
                        setTestResults(null);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Retake Test
                    </button>
                    <button
                      onClick={() => setShowTestQuestionsModal(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
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
                      <span className="text-white">{selectedCourseForDetails.instructor}</span>
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

      {/* WhatsApp Floating Action Button */}
      <a
        href="https://wa.me/9347564390"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-white" />
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-gray-700">
          for any support
        </span>
      </a>
    </div>
  );
};

export default StudentPortal;
