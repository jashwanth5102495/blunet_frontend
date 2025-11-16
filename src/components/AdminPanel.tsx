import React, { useState, useEffect, useMemo } from 'react';
import { getAssignmentDefinitions, normalizeCourseKey } from '../data/courseAssignments';
import { useNavigate } from 'react-router-dom';
import StudentDetailModal from './StudentDetailModal';
import { PaymentStatusBadge, PaymentStatusType } from './PaymentStatus';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Project {
  id: string;
  businessName: string;
  customerName: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  description: string;
  status: string;
  startingDate: string;
  deliveryDate: string;
  createdAt: string;
}

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone: string;
  finalPrice:string;
  studentId: string;
  paymentStatus?: string;
  selectedCourse?: string;
  amountPaid?: number;
  enrolledCourses: Array<{
    courseId: {
      _id: string;
      title: string;
      courseId: string;
      price: number;
    };
    enrollmentDate: string;
    progress: number;
    status: string;
    certificateIssued?: boolean;
    assignments?: {
      completed: number;
      total: number;
      list?: Array<{
        title: string;
        status: string;
        score?: number;
      }>;
    };
    tests?: {
      completed: number;
      total: number;
      list?: Array<{
        title: string;
        score?: number;
      }>;
    };
    projects?: Array<{
      title: string;
      submittedAt: string;
      status?: string;
      score?: number;
      gitUrl?: string;
    }>;
  }>;
  paymentHistory: Array<{
    courseId: {
      _id: string;
      title: string;
    };
    amount: number;
    paymentMethod: string;
    transactionId: string;
    paymentDate: string;
    status: string;
    confirmationStatus?: string;
  }>;
  createdAt: string;
  referralCode?: string;
}

interface Payment {
  _id: string;
  paymentId: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  courseId: {
    _id: string;
    title: string;
    price: number;
  };
  amount: number;
  status: string;
  confirmationStatus: string;
  transactionId: string;
  paymentMethod: string;
  adminConfirmedBy?: string;
  adminConfirmedAt?: string;
  createdAt: string;
}

interface ReferredStudent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  selectedCourse: string;
  amountPaid: number;
  paymentStatus: string;
  referralCode: string;
  createdAt: string;
}

interface Faculty {
  _id: string;
  name: string;
  email: string;
  referralCode: string;
  commissionRate: number;
  isActive: boolean;
  totalCommissionsEarned?: number;
  createdAt: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'courses' | 'payments' | 'referral' | 'faculty'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [newProject, setNewProject] = useState({
    businessName: '',
    customerName: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    description: '',
    startingDate: '',
    deliveryDate: ''
  });

  // Faculty Management States
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [referredStudents, setReferredStudents] = useState<Student[]>([]);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    referralCode: '',
    discountPercentage: ''
  });

  // Student Detail Modal States
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Delete Student States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Payment Status Update States
  const [pendingPaymentChanges, setPendingPaymentChanges] = useState<{[key: string]: {studentId: string, paymentId: string, newStatus: string, courseId: string, isNewPayment: boolean}}>({});
  const [savingPayments, setSavingPayments] = useState<{[key: string]: boolean}>({});

  // Collapsible Sections States
  const [expandedStudents, setExpandedStudents] = useState<{[key: string]: {courses: boolean, payments: boolean}}>({});

  // Student Submissions States
  const [studentSubmissions, setStudentSubmissions] = useState<any[]>([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Credentials Modal State
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [credentialsInfo, setCredentialsInfo] = useState<{ studentId: string; username?: string; tempPassword?: string } | null>(null);
  const [activeCredentialsStudent, setActiveCredentialsStudent] = useState<Student | null>(null);
  // View toggle for Student Courses
  const [courseView, setCourseView] = useState<'all' | 'completed'>('all');
  // Certificate Upload States & Handlers
  const [certificateFileMap, setCertificateFileMap] = useState<{[key:string]: File | null}>({});
  const [certificateUploading, setCertificateUploading] = useState<{[key:string]: boolean}>({});
  const [certificateMessages, setCertificateMessages] = useState<{[key:string]: string}>({});

  const handleCertificateFileChange = (studentId: string, file: File | null) => {
    setCertificateFileMap(prev => ({ ...prev, [studentId]: file || null }));
    setCertificateMessages(prev => ({ ...prev, [studentId]: '' }));
  };

  const uploadCertificateForStudent = async (studentId: string, courseId?: string) => {
    const file = certificateFileMap[studentId];
    if (!file) {
      setCertificateMessages(prev => ({ ...prev, [studentId]: 'Please select a certificate file' }));
      return;
    }
    try {
      setCertificateUploading(prev => ({ ...prev, [studentId]: true }));
      setCertificateMessages(prev => ({ ...prev, [studentId]: 'Uploading...' }));
      const form = new FormData();
      form.append('studentId', studentId);
      if (courseId) form.append('courseId', courseId);
      form.append('certificate', file);

      const res = await fetch(`${BASE_URL}/api/certificates/upload`, {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (data?.success) {
        setCertificateMessages(prev => ({ ...prev, [studentId]: 'Certificate uploaded successfully' }));
        setCertificateFileMap(prev => ({ ...prev, [studentId]: null }));
        if (courseId) {
          setStudents(prev => prev.map(s => {
            if (s.studentId !== studentId) return s;
            return {
              ...s,
              enrolledCourses: (s.enrolledCourses || []).map(ec => {
                const ecCourseId = typeof ec.courseId === 'object' ? ec.courseId?._id : (ec.courseId as any);
                const match = ecCourseId && courseId && ecCourseId === courseId;
                return match ? { ...ec, certificateIssued: true } : ec;
              })
            };
          }));
        }
      } else {
        setCertificateMessages(prev => ({ ...prev, [studentId]: data?.message || 'Upload failed' }));
      }
    } catch (err) {
      setCertificateMessages(prev => ({ ...prev, [studentId]: 'Upload failed' }));
    } finally {
      setCertificateUploading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  // Student Courses: Filter & Pagination
  const [studentFilter, setStudentFilter] = useState<'all' | 'pending' | 'confirmed' | 'error'>('all');
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const studentsPerPage = 8;
  const [studentSearchId, setStudentSearchId] = useState('');

  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students) || students.length === 0) return [];

    const normalize = (s?: string) => (s || '').toLowerCase();
    const isPending = (s?: string) => ['pending', 'waiting_for_confirmation'].includes(normalize(s));
    const isError = (s?: string) => ['error', 'rejected'].includes(normalize(s));
    const isConfirmed = (s?: string) => normalize(s) === 'confirmed';

    return students.filter((s) => {
      // Search by Student ID (case-insensitive, partial match)
      const search = studentSearchId.trim().toLowerCase();
      const matchesSearch = search === ''
        ? true
        : normalize(String(s.studentId || '')).includes(search);

      // When filter is 'all', rely solely on the search match
      if (studentFilter === 'all') return matchesSearch;

      const studentPayments = getStudentPayments(s._id);
      const hasConfirmed = studentPayments.some(p => isConfirmed(p.confirmationStatus));
      const hasError = studentPayments.some(p => isError(p.confirmationStatus));
      const hasPendingForAnyCourse = (s.enrolledCourses || []).some(e => {
        const enrollmentCourseId = typeof e.courseId === 'object' ? (e.courseId?._id || null) : (typeof e.courseId === 'string' ? e.courseId : null);
        const payment = studentPayments.find(p => {
          const paymentCourseId = p.courseId?._id;
          return !!paymentCourseId && !!enrollmentCourseId && paymentCourseId === enrollmentCourseId;
        });
        // Treat no payment as pending review
        if (!payment) return true;
        return isPending(payment.confirmationStatus);
      });

      if (studentFilter === 'confirmed') return hasConfirmed && matchesSearch;
      if (studentFilter === 'error') return hasError && matchesSearch;
      if (studentFilter === 'pending') return hasPendingForAnyCourse && !hasConfirmed && matchesSearch;
      return matchesSearch;
    });
  }, [students, payments, studentFilter, studentSearchId]);

  const totalStudentPages = useMemo(() => Math.max(1, Math.ceil(filteredStudents.length / studentsPerPage)), [filteredStudents.length]);
  const paginatedStudents = useMemo(() => {
    const start = (currentStudentPage - 1) * studentsPerPage;
    const end = start + studentsPerPage;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, currentStudentPage]);

  useEffect(() => {
    // Reset to first page when data, filter, or search changes
    setCurrentStudentPage(1);
  }, [studentFilter, studentSearchId, students.length]);

  // Toggle functions for collapsible sections
  const toggleStudentSection = (studentId: string, section: 'courses' | 'payments') => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [section]: !prev[studentId]?.[section]
      }
    }));
  };

  // Helper function to get payments for a specific student
  // Use a function declaration so it is hoisted and safe to call
  // from memoized filters defined earlier in the component.
  function getStudentPayments(studentId: string) {
    return payments.filter(payment => payment.studentId && payment.studentId._id === studentId);
  }

  // Project requirements per course and completion helpers
  const PROJECT_REQUIREMENTS: Record<string, number> = {
    'frontend-beginner': 4,
    'ai-tools-mastery': 4,
    'devops-beginner': 4,
  };

  function getCourseKeyFromEnrollment(enrollment: any) {
    const courseRef = enrollment.courseId;
    const rawCourseKey = (courseRef && (courseRef._id || courseRef.id || courseRef)) || enrollment.courseId;
    return normalizeCourseKey(courseRef) || normalizeCourseKey(rawCourseKey) || rawCourseKey;
  }

  function isEnrollmentFullyCompleted(enrollment: any) {
    const courseKey = getCourseKeyFromEnrollment(enrollment);
    const assignmentsDone = (enrollment.assignments?.completed || 0) >= (enrollment.assignments?.total || 0) && (enrollment.assignments?.total || 0) > 0;
    const projectsDone = (enrollment.completedModules?.length || 0) >= (PROJECT_REQUIREMENTS[courseKey] || 0);
    return assignmentsDone && projectsDone;
  }

  // Derive a completion timestamp from known fields
  function getEnrollmentCompletedAt(enrollment: any): Date | null {
    // Prefer explicit completedAt if present
    if (enrollment?.completedAt) {
      const t = Date.parse(enrollment.completedAt);
      if (!Number.isNaN(t)) return new Date(t);
    }
    // Otherwise, use the latest project submission time
    const times: number[] = [];
    if (Array.isArray(enrollment?.projects)) {
      for (const p of enrollment.projects) {
        if (p?.submittedAt) {
          const ts = Date.parse(p.submittedAt);
          if (!Number.isNaN(ts)) times.push(ts);
        }
      }
    }
    if (times.length === 0) return null;
    return new Date(Math.max(...times));
  }

  // Recently = completed within the last N days (default: 3)
  function isRecentlyCompleted(enrollment: any, days = 3): boolean {
    if (!isEnrollmentFullyCompleted(enrollment)) return false;
    const dt = getEnrollmentCompletedAt(enrollment);
    if (!dt) return false;
    return (Date.now() - dt.getTime()) <= days * 24 * 60 * 60 * 1000;
  }

  const projectPhases = [
    'Planning & Analysis',
    'Design & Wireframing',
    'Development - Frontend',
    'Development - Backend',
    'Testing & QA',
    'Deployment',
    'Completed'
  ];

  useEffect(() => {
    fetchProjects();
    fetchStudents();
    fetchPayments();
    fetchFaculty();
  }, []);

  // After students are fetched, augment enrollments with assignment/test counts from backend progress
  useEffect(() => {
    const augmentCounts = async () => {
      if (!students || students.length === 0) return;
      try {
        const updated = await Promise.all(students.map(async (student: any) => {
          if (!student?.enrolledCourses || student.enrolledCourses.length === 0) return student;

          const updatedEnrollments = await Promise.all(student.enrolledCourses.map(async (enrollment: any) => {
            const courseRef = enrollment.courseId; // May be populated doc or ObjectId/string
            const rawCourseKey = (courseRef && (courseRef._id || courseRef.id || courseRef)) || enrollment.courseId;
            const courseKey = normalizeCourseKey(courseRef) || normalizeCourseKey(rawCourseKey) || rawCourseKey;
            const localDefs = getAssignmentDefinitions(courseKey as string);

            // Guard: if courseKey is missing, skip backend call and use local/defaults
            if (!courseKey) {
              return {
                ...enrollment,
                assignments: enrollment.assignments || { completed: 0, total: (localDefs?.length || 0), list: [] },
                tests: enrollment.tests || { completed: 0, total: 0, list: [] }
              };
            }

            try {
              const resp = await fetch(`${BASE_URL}/api/progress/student/${student._id}/course/${courseKey}/summary`);
              if (resp.ok) {
                const result = await resp.json();
                const data = result?.data || {};
                return {
                  ...enrollment,
                  assignments: {
                    completed: data.assignments?.completed || 0,
                    total: (localDefs?.length || data.assignments?.total || 0),
                    list: data.assignments?.list || []
                  },
                  tests: data.quizzes || { completed: 0, total: 0, list: [] }
                };
              }
            } catch (err) {
              console.error('Failed to fetch progress summary for', student._id, courseKey, err);
            }
            return {
              ...enrollment,
              assignments: enrollment.assignments || { completed: 0, total: (localDefs?.length || 0), list: [] },
              tests: enrollment.tests || { completed: 0, total: 0, list: [] }
            };
          }));

          return { ...student, enrolledCourses: updatedEnrollments };
        }));

        setStudents(updated);
      } catch (e) {
        console.error('Error augmenting assignment/test counts:', e);
      }
    };

    augmentCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students.length]);

  // Function to fetch student submissions
  const fetchStudentSubmissions = async () => {
    setSubmissionsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/students/admin/submissions`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStudentSubmissions(result.data || []);
          console.log('Fetched submissions:', result.data);
        } else {
          console.error('Failed to fetch submissions:', result.message);
          setStudentSubmissions([]);
        }
      } else {
        console.error('Failed to fetch submissions:', response.status);
        setStudentSubmissions([]);
      }
    } catch (error) {
      console.error('Error fetching student submissions:', error);
      setStudentSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const refreshAllData = async () => {
    console.log('🔄 Refreshing all data...');
    await Promise.all([
      fetchProjects(),
      fetchStudents(),
      fetchPayments(),
      fetchFaculty()
    ]);
    console.log('✅ All data refreshed');
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`);
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setProjects(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch projects:', response.status);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const fetchStudents = async () => {
    try {
      console.log('🔍 Fetching students...');
      const token = sessionStorage.getItem('admin_auth_token') || '';
      const response = await fetch(`${BASE_URL}/api/students?all=true&includeInactive=true`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        console.log('📊 Students API response:', result);
        console.log('📊 Students data:', data);
        
        // Check if course prices are populated
        if (Array.isArray(data) && data.length > 0) {
          const firstStudent = data[0];
          console.log('📊 First student sample:', firstStudent);
          if (firstStudent.enrolledCourses && firstStudent.enrolledCourses.length > 0) {
            console.log('📊 First enrolled course:', firstStudent.enrolledCourses[0]);
            console.log('📊 Course price:', firstStudent.enrolledCourses[0].courseId?.price);
          }
        }
        
        setStudents(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch students:', response.status);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/payments`);
      if (response.ok) {
        const data = await response.json();
        console.log('Payments API response:', data); // Debug log
        setPayments(data.data?.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleAddProject = async () => {
    try {
      const projectData = {
        ...newProject,
        id: `PRJ-${Date.now()}`,
        status: 'Planning & Analysis',
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        fetchProjects();
        setNewProject({
          businessName: '',
          customerName: '',
          email: '',
          phone: '',
          projectType: '',
          budget: '',
          description: '',
          startingDate: '',
          deliveryDate: ''
        });
        setShowAddProject(false);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, notes: statusNotes }),
      });

      if (response.ok) {
        fetchProjects();
        setStatusNotes('');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Planning & Analysis': 'bg-blue-500',
      'Design & Wireframing': 'bg-purple-500',
      'Development - Frontend': 'bg-yellow-500',
      'Development - Backend': 'bg-orange-500',
      'Testing & QA': 'bg-red-500',
      'Deployment': 'bg-indigo-500',
      'Completed': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  // Faculty Management Functions
  const fetchFaculty = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/faculty/all`);
      const data = await response.json();
      
      if (data.success) {
        setFacultyList(data.data);
      } else {
        console.error('Failed to fetch faculty:', data.message);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewFaculty({...newFaculty, referralCode: result});
  };

  const handleAddFaculty = async () => {
    if (!newFaculty.name || !newFaculty.email || !newFaculty.referralCode || !newFaculty.discountPercentage) {
      alert('Please fill in all required fields');
      return;
    }

    const discountNum = parseFloat(String(newFaculty.discountPercentage).trim());
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      alert('Please enter a valid discount percentage between 0 and 100');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/faculty/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFaculty.name,
          email: newFaculty.email,
          referralCode: newFaculty.referralCode.toUpperCase().trim(),
          commissionRate: Math.min(Math.max(discountNum / 100, 0), 1)
        }),
      });

      const text = await response.text();
      let data = null;
      try { data = JSON.parse(text); } catch {}

      if (response.ok && data?.success) {
        alert('Faculty member created successfully!');
        setNewFaculty({
           name: '',
           email: '',
           referralCode: '',
           discountPercentage: ''
         });
        setShowAddFaculty(false);
        fetchFaculty(); // Refresh the faculty list
      } else {
        const message = (data && data.message) || text || 'Failed to create faculty member';
        alert(message);
      }
    } catch (error) {
      console.error('Error creating faculty:', error);
      alert(error?.message || 'Error creating faculty member');
    }
  };

  const handleDeleteFaculty = async (facultyId: string) => {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/faculty/${facultyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

        const data = await response.json();

        if (data.success) {
          // Remove faculty from local state
          setFacultyList(facultyList.filter(faculty => faculty._id !== facultyId));
          if (selectedFaculty && selectedFaculty._id === facultyId) {
            setSelectedFaculty(null);
          }
          
          // Show success message
          alert(data.message);
        } else {
          alert(data.message || 'Failed to delete faculty member');
        }
      } catch (error) {
        console.error('Error deleting faculty:', error);
        alert('Error deleting faculty member. Please try again.');
      }
    }
  };

  const fetchReferredStudents = async (referralCode: string) => {
    try {
      // Fetch students who used this referral code from the backend
      const response = await fetch(`${BASE_URL}/api/students/by-referral/${referralCode}`);

      let result: any = null;
      let rawText = '';
      try {
        result = await response.json();
      } catch (e) {
        rawText = await response.text();
      }

      if (response.ok && result && result.success) {
        const data = Array.isArray(result.data) ? result.data : [];
        setReferredStudents(data);
        console.log('Referred students fetched:', { count: data.length, sample: data[0] });
      } else {
        console.error('Failed to fetch referred students', {
          status: response.status,
          statusText: response.statusText,
          body: result || rawText
        });
        setReferredStudents([]);
      }
    } catch (error) {
      console.error('Error fetching referred students:', error);
      setReferredStudents([]);
    }
  };

  // Student Detail Modal Handlers
  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleCloseStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
  };

  // Delete Student Handlers
  const handleDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  // Open Credentials Modal
  const openStudentCredentials = (student: Student) => {
    setActiveCredentialsStudent(student);
    setCredentialsError(null);
    setCredentialsInfo({ studentId: student.studentId });
    setShowCredentialsModal(true);
    // Auto-generate a temporary password when opening the modal
    generateAndShowTempPassword(student);
  };

  // Reset password to generate a temporary password
  const resetStudentPassword = async () => {
    if (!activeCredentialsStudent) return;
    setCredentialsLoading(true);
    setCredentialsError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/students/admin/reset-password/${activeCredentialsStudent._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to reset password');
      }
      const data = result.data || {};
      setCredentialsInfo({
        studentId: data.studentId || activeCredentialsStudent.studentId,
        username: data.username,
        tempPassword: data.tempPassword
      });
    } catch (error: any) {
      setCredentialsError(error.message || 'Error generating temporary password');
    } finally {
      setCredentialsLoading(false);
    }
  };

  // Generate temp password for a given student (used on modal open)
  const generateAndShowTempPassword = async (student: Student) => {
    setCredentialsLoading(true);
    setCredentialsError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/students/admin/reset-password/${student._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to reset password');
      }
      const data = result.data || {};
      setCredentialsInfo({
        studentId: data.studentId || student.studentId,
        username: data.username,
        tempPassword: data.tempPassword
      });
    } catch (error: any) {
      setCredentialsError(error.message || 'Error generating temporary password');
    } finally {
      setCredentialsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/students/${studentToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove student from local state
        setStudents(prevStudents => 
          prevStudents.filter(student => student._id !== studentToDelete._id)
        );
        
        // Close confirmation dialog
        setShowDeleteConfirm(false);
        setStudentToDelete(null);
        
        // Show success message (you can add a toast notification here)
        console.log('Student deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete student:', errorData.message);
        alert('Failed to delete student: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setStudentToDelete(null);
  };

  const handlePaymentStatusUpdate = (studentId: string, paymentId: string, newStatus: string, courseId?: string) => {
    // Check if this is an existing payment or a new one
    const existingPayment = payments.find(p => p.paymentId === paymentId);
    
    if (existingPayment) {
      // Update existing payment in local state immediately for better UX
      setPayments(prevPayments => 
        prevPayments.map(payment => {
          if (payment.paymentId === paymentId) {
            return {
              ...payment,
              confirmationStatus: newStatus
            };
          }
          return payment;
        })
      );
    }

    // Track the pending change
    const changeKey = `${studentId}-${paymentId}`;
    
    console.log('handlePaymentStatusUpdate - studentId:', studentId);
    console.log('handlePaymentStatusUpdate - paymentId:', paymentId);
    console.log('handlePaymentStatusUpdate - newStatus:', newStatus);
    console.log('handlePaymentStatusUpdate - courseId:', courseId);
    console.log('handlePaymentStatusUpdate - isNewPayment:', !existingPayment);

    setPendingPaymentChanges(prev => ({
       ...prev,
       [changeKey]: {
         studentId,
         paymentId,
         newStatus,
         courseId,
         isNewPayment: !existingPayment
       }
     }));
  };

  const refreshStudentData = async () => {
    console.log('Refreshing student data...');
    await fetchStudents();
    await fetchPayments();
    console.log('Student data refreshed');
  };

  const savePaymentStatusChange = async (changeKey: string) => {
    const change = pendingPaymentChanges[changeKey];
    console.log('Save attempt - changeKey:', changeKey);
    console.log('Save attempt - change:', change);
    
    if (!change) {
      console.log('No change found for key:', changeKey);
      return;
    }
    
    if (!change.paymentId) {
      console.log('No paymentId found in change:', change);
      alert('Error: Payment ID not found. Please refresh the page and try again.');
      return;
    }

    setSavingPayments(prev => ({ ...prev, [changeKey]: true }));

    try {
      let response;
      let responseData;

      if (change.isNewPayment) {
        // Create a new payment record first
        const student = students.find(s => s._id === change.studentId);
        const course = student?.enrolledCourses.find(e => {
          const eCourseId = typeof e.courseId === 'object' ? (e.courseId?._id || null) : (typeof e.courseId === 'string' ? e.courseId : null);
          return !!eCourseId && eCourseId === change.courseId;
        })?.courseId;
        
        if (!student || !course) {
          alert('Error: Student or course information not found.');
          setSavingPayments(prev => ({ ...prev, [changeKey]: false }));
          return;
        }

        // Generate a proper transaction ID for the new payment
        const actualTransactionId = `ADMIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Get course price with fallback
        const coursePrice = course.price || 0;
        if (coursePrice === 0) {
          console.warn('Course price is 0 or undefined:', course);
        }
        
        const paymentData = {
          transactionId: actualTransactionId,
          studentId: change.studentId,
          courseId: change.courseId,
          courseName: course.title || 'Unknown Course',
          amount: coursePrice,
          originalAmount: coursePrice,
          studentName: `${student.firstName} ${student.lastName}`,
          studentEmail: student.email,
          paymentMethod: 'admin_manual',
          metadata: { createdByAdmin: true, adminEmail: 'support@blunetitservices.in' }
        };

        console.log('=== PAYMENT DATA DEBUG ===');
        console.log('Student:', student);
        console.log('Course:', course);
        console.log('Payment Data being sent:', paymentData);
        console.log('Required fields check:');
        console.log('- transactionId:', paymentData.transactionId);
        console.log('- studentId:', paymentData.studentId);
        console.log('- courseId:', paymentData.courseId);
        console.log('- courseName:', paymentData.courseName);
        console.log('- amount:', paymentData.amount);
        console.log('- studentName:', paymentData.studentName);
        console.log('- studentEmail:', paymentData.studentEmail);
        console.log('- paymentMethod:', paymentData.paymentMethod);
        console.log('========================');

        console.log('Creating new payment with data:', paymentData);
        
        response = await fetch(`${BASE_URL}/api/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData)
        });

        responseData = await response.json();
        console.log('Create payment response:', responseData);

        if (response.ok && responseData.data) {
          // Now update the confirmation status
          const confirmResponse = await fetch(`${BASE_URL}/api/payments/${responseData.data.paymentId}/confirm`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              confirmationStatus: change.newStatus,
              adminEmail: 'support@blunetitservices.in'
            })
          });

          const confirmData = await confirmResponse.json();
          console.log('Confirm payment response:', confirmData);

          if (confirmResponse.ok) {
            response = confirmResponse;
            responseData = confirmData;
          }
        }
      } else {
        // Update existing payment
        console.log('Making API call to:', `${BASE_URL}/api/payments/${change.paymentId}/confirm`);
        console.log('Request body:', {
          confirmationStatus: change.newStatus,
          adminEmail: 'support@blunetitservices.in'
        });
        
        response = await fetch(`${BASE_URL}/api/payments/${change.paymentId}/confirm`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            confirmationStatus: change.newStatus,
            adminEmail: 'support@blunetitservices.in'
          })
        });

        responseData = await response.json();
      }

      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

      if (response.ok) {
        // Remove from pending changes
        setPendingPaymentChanges(prev => {
          const newChanges = { ...prev };
          delete newChanges[changeKey];
          return newChanges;
        });
        
        // Refresh the payments list
        fetchPayments();
        fetchStudents();
        
        alert(`Payment status ${change.isNewPayment ? 'created and ' : ''}updated to "${change.newStatus}" successfully!`);
      } else {
        console.error('API Error Response:', response.status, responseData);
        alert(`Failed to ${change.isNewPayment ? 'create and ' : ''}save payment status change: ${responseData?.message || 'Unknown error'}`);
        // Refresh data to revert any local changes
        fetchPayments();
      }
    } catch (error) {
      console.error('Error saving payment status:', error);
      alert('Error saving payment status change');
    } finally {
      setSavingPayments(prev => ({ ...prev, [changeKey]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex">
      {/* Side Navigation */}
      <div className="w-64 bg-black/50 backdrop-blur-lg border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/70 text-sm mt-1">Management Portal</p>
            </div>
            <button
              onClick={refreshAllData}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Refresh Data"
            >
              <span className="text-xl">🔄</span>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl">📊</span>
            <span>Projects</span>
          </button>
          
          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl">🎓</span>
            <span>Student Courses</span>
          </button>
          
          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl">💳</span>
            <span>Payments</span>
          </button>
          
          <button
            onClick={() => setActiveTab('referral')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'referral'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl">🤝</span>
            <span>Faculty & Referral</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-black/30 backdrop-blur-lg border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {activeTab === 'projects' && '📊 Projects Management'}
                {activeTab === 'courses' && '🎓 Student Courses'}
                {activeTab === 'payments' && '💳 Payment Records'}
                {activeTab === 'referral' && '🤝 Faculty & Referral System'}
              </h2>
              <p className="text-white/70 mt-1">
                {activeTab === 'projects' && 'Manage and track all client projects'}
                {activeTab === 'courses' && 'Monitor student progress and assignments'}
                {activeTab === 'payments' && 'View payment history and transactions'}
                {activeTab === 'referral' && 'Track referral codes and commission earnings'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'projects' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Project Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Project</h2>
                <button
                  onClick={() => setShowAddProject(!showAddProject)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors duration-200"
                >
                  {showAddProject ? 'Cancel' : 'Add Project'}
                </button>
              </div>

              {showAddProject && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={newProject.businessName}
                        onChange={(e) => setNewProject({...newProject, businessName: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter business name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={newProject.customerName}
                        onChange={(e) => setNewProject({...newProject, customerName: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter customer name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newProject.email}
                        onChange={(e) => setNewProject({...newProject, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newProject.phone}
                        onChange={(e) => setNewProject({...newProject, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Project Type
                      </label>
                      <select
                        value={newProject.projectType}
                        onChange={(e) => setNewProject({...newProject, projectType: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select project type</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Custom Software">Custom Software</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Budget
                      </label>
                      <input
                        type="text"
                        value={newProject.budget}
                        onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter budget"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Starting Date
                      </label>
                      <input
                        type="date"
                        value={newProject.startingDate}
                        onChange={(e) => setNewProject({...newProject, startingDate: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Delivery Date
                      </label>
                      <input
                        type="date"
                        value={newProject.deliveryDate}
                        onChange={(e) => setNewProject({...newProject, deliveryDate: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleAddProject}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors duration-200"
                  >
                    Create Project
                  </button>
                </div>
              )}
            </div>

            {/* Project Status Update Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Update Project Status</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Select Project
                  </label>
                  <select
                    value={selectedProject?.id || ''}
                    onChange={(e) => {
                      const project = projects.find(p => p.id === e.target.value);
                      setSelectedProject(project || null);
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.id} - {project.businessName}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProject && (
                  <>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-2">Project Details:</h3>
                      <p className="text-sm text-white/70">Business: {selectedProject.businessName}</p>
                      <p className="text-sm text-white/70">Customer: {selectedProject.customerName}</p>
                      <p className="text-sm text-white/70">Current Status: {selectedProject.status}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        New Status
                      </label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            updateProjectStatus(selectedProject.id, e.target.value);
                          }
                        }}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select new status...</option>
                        {projectPhases.map(phase => (
                          <option key={phase} value={phase}>
                            {phase}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Status Notes (Optional)
                      </label>
                      <textarea
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add notes about this status update..."
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            </div>

            {/* Project ID Information */}
            <div className="mt-8 bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-blue-400">Project ID - Customer Access Key</h3>
            </div>
            <p className="text-white/80 mb-3">
              The Project ID is the <strong>primary key</strong> that customers use to track their project status. 
              You can create your own custom Project ID format (e.g., PRJ-001, WEB-2024-001, or any format you prefer).
            </p>
            <p className="text-white/60 text-sm">
              💡 <strong>Tip:</strong> Share this Project ID with your customers so they can track their project progress 
              on your website's project tracking page.
            </p>
          </div>



            {/* Projects List */}
          <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">All Projects ({projects.length})</h2>
            
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-white/60 text-lg">No projects yet</p>
                <p className="text-white/40 text-sm">Add your first project to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{project.businessName}</h3>
                        <p className="text-white/60 text-sm">ID: {project.id}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Customer:</span>
                        <p className="text-white font-medium">{project.customerName}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Type:</span>
                        <p className="text-white font-medium">{project.projectType}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Budget:</span>
                        <p className="text-white font-medium">{project.budget}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Start Date:</span>
                        <p className="text-white font-medium">{new Date(project.startingDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Delivery:</span>
                        <p className="text-white font-medium">{new Date(project.deliveryDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Contact:</span>
                        <p className="text-white font-medium">{project.email}</p>
                      </div>
                    </div>
                    
                    {project.description && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <span className="text-white/60 text-sm">Description:</span>
                        <p className="text-white/80 text-sm mt-1">{project.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
        )}

        {/* Student Courses Tab */}
        {activeTab === 'courses' && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Student Enrollments ({filteredStudents.length})</h2>
              <div className="flex items-center space-x-3">
                {/* Search by Student ID */}
                <div className="flex items-center space-x-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2">
                  <span className="text-white/60 text-sm">Search</span>
                  <input
                    value={studentSearchId}
                    onChange={(e) => setStudentSearchId(e.target.value)}
                    placeholder="Student ID"
                    className="bg-transparent border border-white/10 rounded px-2 py-1 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {/* Filter by payment status */}
                <div className="flex items-center space-x-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2">
                  <span className="text-white/60 text-sm">Filter</span>
                  <select
                    value={studentFilter}
                    onChange={(e) => setStudentFilter(e.target.value as 'all' | 'pending' | 'confirmed' | 'error')}
                    className="bg-transparent text-white text-sm focus:outline-none"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setShowSubmissions(!showSubmissions);
                    if (!showSubmissions) {
                      fetchStudentSubmissions();
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    showSubmissions 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  title="View all student project submissions"
                >
                  <span>📋</span>
                  <span>{showSubmissions ? 'Hide Submissions' : 'View All Submissions'}</span>
                </button>
                <button
                  onClick={() => {
                    fetchStudents();
                    fetchPayments();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                  title="Refresh student and payment data"
                >
                  <span>🔄</span>
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Student Courses view toggle */}
            <div className="mb-4 flex items-center space-x-2">
              <button
                onClick={() => setCourseView('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${courseView === 'all' ? 'bg-blue-600 text-white' : 'bg-black/30 text-white/80 border border-white/10'}`}
              >
                All Enrollments
              </button>
              <button
                onClick={() => setCourseView('completed')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${courseView === 'completed' ? 'bg-green-600 text-white' : 'bg-black/30 text-white/80 border border-white/10'}`}
                title="Show students who completed all assignments and projects"
              >
                Completed Students
              </button>
            </div>

            {courseView === 'completed' && (
              <div className="mb-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>✅</span>
                    <span>Completed Students</span>
                  </h3>
                </div>
                <div className="space-y-3">
                  {(() => {
                    const completed = students.flatMap(s => (s.enrolledCourses || [])
                      .filter(enr => isEnrollmentFullyCompleted(enr) || enr.status === 'completed')
                      .map(enr => ({ s, enr })));
                    if (completed.length === 0) {
                      return <p className="text-white/60 text-sm">No students have fully completed a course yet.</p>;
                    }
                    return completed.map(({ s, enr }, i) => (
                      <div key={`${s._id}-${i}`} className="bg-black/30 rounded-lg p-4 border border-white/10">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-white font-medium flex items-center">
                              <span>{s.firstName} {s.lastName}</span>
                              <span className="ml-2 text-white/60 text-xs">{s.email}</span>
                            </div>
                            <div className="text-white/80 text-sm mt-1">
                              Course: <span className="font-semibold">{enr.courseId?.title}</span>
                            </div>
                            <div className="text-white/60 text-xs">Enrolled: {new Date(enr.enrollmentDate).toLocaleDateString()}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-full text-xs bg-emerald-600 text-white">all assignments and projects completed</span>
                            {isRecentlyCompleted(enr) && (
                              <span className="px-2 py-1 rounded-full text-xs bg-yellow-500 text-black">recently</span>
                            )}
                            {enr.certificateIssued
                              ? <span className="px-2 py-1 rounded-full text-xs bg-blue-600 text-white">certificate issued</span>
                              : <span className="px-2 py-1 rounded-full text-xs bg-gray-600 text-white">certificate not issued</span>}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-3 border border-blue-500/30">
                            <h5 className="text-white font-medium mb-2 flex items-center">📝 Assignments</h5>
                            <div className="text-white/80 text-sm">Completed: {enr.assignments?.completed || 0} / {enr.assignments?.total || 0}</div>
                            <div className="mt-2 space-y-1">
                              {((enr.assignments?.list || []).length > 0) ? (
                                (enr.assignments?.list || []).map((a: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between text-xs text-white/80">
                                    <span>{a.title}</span>
                                    <span className="ml-2 px-2 py-0.5 rounded bg-black/30 border border-white/10">
                                      {a.status || 'pending'}{(a.score !== undefined && a.score !== null) ? ` • ${a.score}%` : ''}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-white/60 text-xs">No assignment details available</p>
                              )}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-3 border border-orange-500/30">
                            <h5 className="text-white font-medium mb-2 flex items-center">🚀 Projects</h5>
                            <div className="space-y-2">
                              {(enr.completedModules || []).map((m: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span className="text-white/80">Module {idx + 1}</span>
                                  <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded text-xs">Git URL</a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Certificate Upload */}
                        <div className="mt-4 bg-black/40 rounded-lg p-3 border border-white/10">
                          <div className="text-white text-sm font-medium mb-2">🎓 Certificate</div>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleCertificateFileChange(s.studentId, e.target.files?.[0] || null)}
                              className="text-white/80 text-sm"
                            />
                            <button
                              onClick={() => uploadCertificateForStudent(s.studentId, enr.courseId?._id)}
                              disabled={certificateUploading[s.studentId]}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg text-sm font-medium"
                              title="Upload official certificate for this student"
                            >
                              {certificateUploading[s.studentId] ? 'Uploading...' : 'Upload Certificate'}
                            </button>
                          </div>
                          {certificateMessages[s.studentId] && (
                            <div className="text-white/70 text-xs mt-2">{certificateMessages[s.studentId]}</div>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Student Submissions View */}
            {showSubmissions && (
              <div className="mb-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>📋</span>
                    <span>All Student Project Submissions ({studentSubmissions.length})</span>
                  </h3>
                  <button
                    onClick={fetchStudentSubmissions}
                    disabled={submissionsLoading}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <span>🔄</span>
                    <span>{submissionsLoading ? 'Loading...' : 'Refresh'}</span>
                  </button>
                </div>
                
                {submissionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white/70">Loading submissions...</span>
                    </div>
                  </div>
                ) : studentSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-white/60 text-lg">No project submissions yet</p>
                    <p className="text-white/40 text-sm">Student project submissions will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentSubmissions.map((submission, index) => (
                      <div key={`${submission.studentId}-${submission.moduleId}-${index}`} className="bg-black/30 rounded-lg p-4 border border-white/20">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {submission.studentName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-white font-medium">{submission.studentName}</div>
                                <div className="text-white/60 text-sm">{submission.studentEmail}</div>
                                <div className="text-white/40 text-xs">ID: {submission.studentCode}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                                <div className="text-blue-300 text-sm font-medium mb-1">Course</div>
                                <div className="text-white text-sm">{submission.courseTitle}</div>
                                <div className="text-white/60 text-xs">{submission.courseName}</div>
                              </div>
                              
                              <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                                <div className="text-green-300 text-sm font-medium mb-1">Module</div>
                                <div className="text-white text-sm">{submission.moduleTitle}</div>
                                <div className="text-white/60 text-xs">
                                  Submitted: {new Date(submission.submittedAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: '2-digit', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              submission.status === 'approved' ? 'bg-green-600 text-white' :
                              submission.status === 'reviewed' ? 'bg-blue-600 text-white' :
                              submission.status === 'needs_revision' ? 'bg-yellow-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {submission.status || 'submitted'}
                            </span>
                            
                            <a
                              href={submission.submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              <span>🔗</span>
                              <span>View Submission</span>
                            </a>
                          </div>
                        </div>
                        
                        {submission.feedback && (
                          <div className="mt-3 bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/30">
                            <div className="text-yellow-300 text-sm font-medium mb-1">Feedback</div>
                            <div className="text-white text-sm">{submission.feedback}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {students.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎓</div>
                <p className="text-white/60 text-lg">No student enrollments yet</p>
                <p className="text-white/40 text-sm">Students will appear here after course purchases</p>
              </div>
            ) : (
              <div>
                {/* Empty state for filter */}
                {(activeTab === 'courses' && courseView === 'completed' ? filteredStudents.filter(s => (s.enrolledCourses || []).some(isEnrollmentFullyCompleted)).length === 0 : filteredStudents.length === 0) ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔎</div>
                    <p className="text-white/60 text-lg">No students match this filter</p>
                    <p className="text-white/40 text-sm">Try changing the payment status filter</p>
                  </div>
                ) : null}

                <div className="space-y-6">
                {(activeTab === 'courses' && courseView === 'completed' ? paginatedStudents.filter(s => (s.enrolledCourses || []).some(isEnrollmentFullyCompleted)) : paginatedStudents).map(student => (
                  <div key={student._id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    {/* Student Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {student.firstName ? student.firstName.charAt(0).toUpperCase() : 'S'}
                          </span>
                        </div>
                        <div>
                          <div 
                            className="text-white font-medium cursor-pointer hover:text-blue-400 transition-colors duration-200"
                            onClick={() => handleStudentClick(student)}
                          >
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-white/60 text-sm">{student.email}</div>
                          <div className="text-white/40 text-xs mt-1">
                            Student ID: {student.studentId}
                            {student.referralCode && (
                              <span className="ml-2 px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                                Referral: {student.referralCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white/60 text-sm">Joined</div>
                <div className="text-white text-sm">
                  {new Date(student.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => openStudentCredentials(student)}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                title="Show Student Credentials"
              >
                <span>ℹ️</span>
                <span>Info</span>
              </button>
              <button
                onClick={() => handleDeleteStudent(student)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                title="Delete Student"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </div>
                    </div>

                    {/* Enrolled Courses */}
                    {student.enrolledCourses && student.enrolledCourses.length > 0 && (
                      <div className="mb-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-200"
                          onClick={() => toggleStudentSection(student._id, 'courses')}
                        >
                          <h4 className="text-white font-medium">Enrolled Courses ({student.enrolledCourses.length})</h4>
                          <span className="text-white/60 text-lg">
                            {expandedStudents[student._id]?.courses ? '▼' : '▶'}
                          </span>
                        </div>
                        {expandedStudents[student._id]?.courses && (
                          <div className="space-y-3 mt-3">
                          {(courseView === 'completed' ? student.enrolledCourses.filter(isEnrollmentFullyCompleted) : student.enrolledCourses).map((enrollment, index) => (
                            <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/10">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="text-white font-medium flex items-center">
                                    <span>{enrollment.courseId?.title || 'Course Title N/A'}</span>
                                    {isEnrollmentFullyCompleted(enrollment) && (
                                      <>
                                        <span className="ml-2 px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">
                                          all assignments and projects completed
                                        </span>
                                        {isRecentlyCompleted(enrollment) && (
                                          <span className="ml-2 px-2 py-1 bg-yellow-500 text-black text-xs rounded-full">recently</span>
                                        )}
                                        {enrollment.certificateIssued
                                          ? <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">certificate issued</span>
                                          : <span className="ml-2 px-2 py-1 bg-gray-600 text-white text-xs rounded-full">certificate not issued</span>}
                                      </>
                                    )}
                                  </div>
                                  <div className="text-white/60 text-sm">
                                    Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-white/60 text-sm">Progress</div>
                                  <div className="text-green-400 font-semibold">
                                    {enrollment.progress || 0}%
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    enrollment.status === 'active' ? 'bg-green-500/20 text-green-300' :
                                    enrollment.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                                    enrollment.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-gray-500/20 text-gray-300'
                                  }`}>
                                    {enrollment.status || 'active'}
                                  </span>
                                </div>
                              </div>

                              {/* Assignments Section */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-3 border border-blue-500/30">
                                  <h5 className="text-white font-medium mb-2 flex items-center">
                                    📝 Assignments
                                    <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                                      {enrollment.assignments?.completed || 0}/{enrollment.assignments?.total || 0}
                                    </span>
                                  </h5>
                                  <div className="space-y-2">
                                    {enrollment.assignments?.list?.map((assignment, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-sm">
                                        <span className="text-white/80">{assignment.title}</span>
                                        <div className="flex items-center gap-2">
                                          <span className={`px-2 py-1 rounded-full text-xs ${
                                            assignment.status === 'completed' ? 'bg-green-600 text-white' :
                                            assignment.status === 'submitted' ? 'bg-yellow-600 text-white' :
                                            'bg-gray-600 text-white'
                                          }`}>
                                            {assignment.status || 'pending'}
                                          </span>
                                          {assignment.score && (
                                            <span className="text-green-400 font-medium">
                                              {assignment.score}%
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )) || (
                                      <p className="text-white/60 text-sm">No assignments available</p>
                                    )}
                                  </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-500/30">
                                  <h5 className="text-white font-medium mb-2 flex items-center">
                                    🧪 Test Results
                                    <span className="ml-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                                      {enrollment.tests?.completed || 0}/{enrollment.tests?.total || 0}
                                    </span>
                                  </h5>
                                  <div className="space-y-2">
                                    {enrollment.tests?.list?.map((test, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-sm">
                                        <span className="text-white/80">{test.title}</span>
                                        <div className="flex items-center gap-2">
                                          <span className={`px-2 py-1 rounded-full text-xs ${
                                            test.score >= 80 ? 'bg-green-600 text-white' :
                                            test.score >= 60 ? 'bg-yellow-600 text-white' :
                                            test.score ? 'bg-red-600 text-white' :
                                            'bg-gray-600 text-white'
                                          }`}>
                                            {test.score ? `${test.score}%` : 'pending'}
                                          </span>
                                        </div>
                                      </div>
                                    )) || (
                                      <p className="text-white/60 text-sm">No tests available</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Module Submissions - Enhanced Display */}
                              {enrollment.completedModules && enrollment.completedModules.length > 0 && (
                                <div className="mt-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-500/30">
                                  <h5 className="text-white font-medium mb-2 flex items-center">
                                    🚀 Module Submissions
                                    <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                                      {enrollment.completedModules.length}
                                    </span>
                                  </h5>
                                  <div className="space-y-2">
                                    {enrollment.completedModules.map((module, idx) => (
                                      <div key={idx} className="bg-black/30 rounded-lg p-3 border border-white/10">
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <div className="text-white/80 text-sm font-medium mb-1">
                                              Module {idx + 1}
                                            </div>
                                            <div className="text-white/60 text-xs">
                                              Submitted: {new Date(module.submittedAt).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}
                                            </div>
                                            {module.feedback && (
                                              <div className="text-yellow-300 text-xs mt-1">
                                                Feedback: {module.feedback}
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <a
                                              href={module.submissionUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                            >
                                              🔗 View Link
                                            </a>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              module.status === 'approved' ? 'bg-green-600 text-white' :
                                              module.status === 'reviewed' ? 'bg-blue-600 text-white' :
                                              module.status === 'needs_revision' ? 'bg-yellow-600 text-white' :
                                              'bg-gray-600 text-white'
                                            }`}>
                                              {module.status || 'submitted'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Legacy Project Submissions (if any) */}
                              {enrollment.projects && enrollment.projects.length > 0 && (
                                <div className="mt-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-3 border border-orange-500/30">
                                  <h5 className="text-white font-medium mb-2 flex items-center">
                                    � Legacy Project Submissions
                                    <span className="ml-2 px-2 py-1 bg-orange-600 text-white text-xs rounded-full">
                                      {enrollment.projects.length}
                                    </span>
                                  </h5>
                                  <div className="space-y-2">
                                    {enrollment.projects.map((project, idx) => (
                                      <div key={idx} className="bg-black/30 rounded-lg p-2 border border-white/10">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <span className="text-white/80 text-sm font-medium">{project.title}</span>
                                            <div className="text-white/60 text-xs mt-1">
                                              Submitted: {new Date(project.submittedAt).toLocaleDateString()}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {project.gitUrl && (
                                              <a
                                                href={project.gitUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors duration-200"
                                              >
                                                🔗 GitHub
                                              </a>
                                            )}
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                              project.status === 'approved' ? 'bg-green-600 text-white' :
                                              project.status === 'reviewed' ? 'bg-blue-600 text-white' :
                                              project.status === 'rejected' ? 'bg-red-600 text-white' :
                                              'bg-yellow-600 text-white'
                                            }`}>
                                              {project.status || 'pending'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Payment Status Management */}
                              <div className="mt-4 space-y-3">
                                {(() => {
                                  // Check if there's a confirmed payment for this course using Payment model data
                                  const studentPayments = getStudentPayments(student._id);
                                  const enrollmentCourseIdSafe = typeof enrollment.courseId === 'object' ? (enrollment.courseId?._id || null) : (typeof enrollment.courseId === 'string' ? enrollment.courseId : null);
                                  const coursePayment = studentPayments.find(payment => {
                                    const paymentCourseId = payment.courseId?._id;
                                    return !!paymentCourseId && !!enrollmentCourseIdSafe && paymentCourseId === enrollmentCourseIdSafe;
                                  });
                                  const hasConfirmedPayment = coursePayment?.confirmationStatus === 'confirmed';
                                  
                                  return (
                                    <>
                                      {/* Payment Status Badge */}
                                      <div className="flex justify-center">
                                        <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                          hasConfirmedPayment
                                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        }`}>
                                          {hasConfirmedPayment ? '✅ Payment Confirmed' : '⏳ Payment Pending Review'}
                                        </span>
                                      </div>
                                      
                                      {/* Payment Status Dropdown - Admin Control */}
                                      <div className="flex justify-center items-center space-x-2">
                                        <label className="text-white/60 text-sm">Admin Control:</label>
                                        <select
                                           value={(() => {
                                             const safeCourseId = (typeof enrollment.courseId === 'object' ? (enrollment.courseId?._id || '') : (typeof enrollment.courseId === 'string' ? enrollment.courseId : '')) || 'unknownCourse';
                                             const paymentId = coursePayment?.paymentId || `new_payment_${student._id}_${safeCourseId}`;
                                             const changeKey = `${student._id}-${paymentId}`;
                                             const pendingChange = pendingPaymentChanges[changeKey];
                                             
                                             // If there's a pending change, use that
                                             if (pendingChange) {
                                               return pendingChange.newStatus;
                                             }
                                             
                                             // If there's an existing payment, use its status
                                             if (coursePayment && coursePayment.confirmationStatus) {
                                               return coursePayment.confirmationStatus;
                                             }
                                             
                                             // Default to 'pending' for new enrollments without payments
                                             return 'pending';
                                           })()}
                                           onChange={(e) => {
                                             let paymentId;
                                             const safeCourseId = (typeof enrollment.courseId === 'object' ? (enrollment.courseId?._id || '') : (typeof enrollment.courseId === 'string' ? enrollment.courseId : '')) || 'unknownCourse';
                                             if (coursePayment) {
                                               paymentId = coursePayment.paymentId;
                                             } else {
                                               // Use a consistent paymentId for new payments based on student and course
                                               paymentId = `new_payment_${student._id}_${safeCourseId}`;
                                             }
                                             const updateCourseId = (typeof enrollment.courseId === 'object' ? (enrollment.courseId?._id || '') : (typeof enrollment.courseId === 'string' ? enrollment.courseId : ''));
                                             if (!updateCourseId) {
                                               alert('Course ID missing for this enrollment; please refresh and try again.');
                                               return;
                                             }
                                             handlePaymentStatusUpdate(student._id, paymentId, e.target.value, updateCourseId);
                                           }}
                                          className="bg-black/50 border border-white/20 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="error">Error</option>
                                          <option value="confirmed">Confirmed</option>
                                        </select>
                                        {(() => {
                                          // Find the pending change for this student and payment
                                          const safeCourseId = (typeof enrollment.courseId === 'object' ? (enrollment.courseId?._id || '') : (typeof enrollment.courseId === 'string' ? enrollment.courseId : '')) || 'unknownCourse';
                                          const paymentId = coursePayment?.paymentId || `new_payment_${student._id}_${safeCourseId}`;
                                          const changeKey = `${student._id}-${paymentId}`;
                                          const hasPendingChange = pendingPaymentChanges[changeKey];
                                          const isSaving = savingPayments[changeKey];
                                           
                                          if (!hasPendingChange) return null;
                                           
                                          return (
                                            <button
                                              onClick={() => savePaymentStatusChange(changeKey)}
                                              disabled={isSaving}
                                              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                              title="Save payment status change"
                                            >
                                              {isSaving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                          );
                                        })()}
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payment History */}
                    {(() => {
                      const studentPayments = getStudentPayments(student._id);
                      return studentPayments.length > 0 && (
                        <div>
                          <div 
                            className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-200"
                            onClick={() => toggleStudentSection(student._id, 'payments')}
                          >
                            <h4 className="text-white font-medium">Payment History ({studentPayments.length})</h4>
                            <span className="text-white/60 text-lg">
                              {expandedStudents[student._id]?.payments ? '▼' : '▶'}
                            </span>
                          </div>
                          {expandedStudents[student._id]?.payments && (
                            <div className="space-y-2 mt-3">
                            {studentPayments.map((payment, index) => (
                              <div key={payment.paymentId} className="bg-black/30 rounded-lg p-3 border border-white/10">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-white font-medium">
                                      {payment.courseId?.title || 'Course N/A'}
                                    </div>
                                    <div className="text-white/60 text-sm">
                                      {payment.paymentMethod} • {payment.transactionId}
                                    </div>
                                    <div className="text-white/40 text-xs">
                                      {new Date(payment.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-green-400 font-semibold">
                                      ₹{payment.amount.toLocaleString()}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        payment.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                                        payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                        payment.status === 'failed' ? 'bg-red-500/20 text-red-300' :
                                        'bg-gray-500/20 text-gray-300'
                                      }`}>
                                        {payment.status}
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <select
                                          value={payment.confirmationStatus || 'pending'}
                                          onChange={(e) => handlePaymentStatusUpdate(student._id, payment.paymentId, e.target.value)}
                                          className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="error">Error</option>
                                          <option value="confirmed">Confirmed</option>
                                        </select>
                                        {(() => {
                                          const changeKey = `${student._id}-${payment.paymentId}`;
                                          const hasPendingChange = pendingPaymentChanges[changeKey];
                                          const isSaving = savingPayments[changeKey];
                                          
                                          return hasPendingChange ? (
                                            <button
                                              onClick={() => savePaymentStatusChange(changeKey)}
                                              disabled={isSaving}
                                              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                                            >
                                              {isSaving ? 'Saving...' : 'Save'}
                                            </button>
                                          ) : null;
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* No courses or payments */}
                    {(!student.enrolledCourses || student.enrolledCourses.length === 0) && 
                     (getStudentPayments(student._id).length === 0) && (
                      <div className="text-center py-6">
                        <div className="text-white/40 text-sm">No course enrollments or payments yet</div>
                      </div>
                    )}
                  </div>
                ))}
                </div>

                {/* Pagination controls */}
                {filteredStudents.length > 0 && totalStudentPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentStudentPage(p => Math.max(1, p - 1))}
                      disabled={currentStudentPage === 1}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border border-white/10 transition-colors ${currentStudentPage === 1 ? 'bg-gray-700 text-white/40 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                    >
                      ◀ Prev
                    </button>
                    {Array.from({ length: totalStudentPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentStudentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border ${page === currentStudentPage ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/30 border-white/10 text-white hover:bg-black/40'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentStudentPage(p => Math.min(totalStudentPages, p + 1))}
                      disabled={currentStudentPage === totalStudentPages}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border border-white/10 transition-colors ${currentStudentPage === totalStudentPages ? 'bg-gray-700 text-white/40 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                    >
                      Next ▶
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Credentials Modal */}
        {showCredentialsModal && activeCredentialsStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-xl font-bold">Student Credentials</h3>
                <button
                  onClick={() => setShowCredentialsModal(false)}
                  className="text-white/70 hover:text-white"
                >
                  ✖
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Name</span>
                  <span className="text-white font-medium">{activeCredentialsStudent.firstName} {activeCredentialsStudent.lastName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Email</span>
                  <span className="text-white font-medium">{activeCredentialsStudent.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Student ID</span>
                  <span className="text-white font-medium">{credentialsInfo?.studentId || activeCredentialsStudent.studentId}</span>
                </div>
                {credentialsInfo?.username && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Username</span>
                    <span className="text-white font-medium">{credentialsInfo.username}</span>
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={resetStudentPassword}
                    disabled={credentialsLoading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
                  >
                    {credentialsLoading ? 'Generating...' : 'Generate Temporary Password'}
                  </button>
                </div>
                {credentialsError && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {credentialsError}
                  </div>
                )}
                {credentialsInfo?.tempPassword && (
                  <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="text-white/80 text-sm mb-2">Temporary Password</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={credentialsInfo.tempPassword}
                        className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-2 text-white text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(credentialsInfo.tempPassword || '')}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-white/50 text-xs mt-2">Share this password with the student and advise them to change it after logging in.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Referral Tab */}
        {activeTab === 'referral' && (
          <div className="space-y-8">
            {/* Faculty Management Header */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">👨‍🏫 Faculty Referral Management</h2>
                <button
                  onClick={() => setShowAddFaculty(!showAddFaculty)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors duration-200"
                >
                  {showAddFaculty ? 'Cancel' : '+ Add Faculty'}
                </button>
              </div>

              {/* Add Faculty Form */}
              {showAddFaculty && (
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Add New Faculty</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Faculty Name *</label>
                      <input
                        type="text"
                        value={newFaculty.name}
                        onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter faculty name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Email *</label>
                      <input
                        type="email"
                        value={newFaculty.email}
                        onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Referral Code *</label>
                      <input
                        type="text"
                        value={newFaculty.referralCode}
                        onChange={(e) => setNewFaculty({...newFaculty, referralCode: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter referral code (e.g., JASH)"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Discount Percentage *</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={newFaculty.discountPercentage}
                        onChange={(e) => setNewFaculty({...newFaculty, discountPercentage: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter discount (e.g., 40 for 40%)"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-white/60">
                      📝 Enter a unique referral code for the faculty member (e.g., JASH, ROHAN, etc.)
                    </p>
                    <p className="text-sm text-white/60 mt-1">
                      💰 Set a custom discount percentage for this faculty (e.g., 40% or 50%). Students using their code receive this discount; the same amount is recorded as commission.
                    </p>
                    <p className="text-sm text-yellow-400 mt-1">
                      ⚠️ Students will use this code during course purchase to link their enrollment
                    </p>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleAddFaculty}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors duration-200"
                    >
                      Add Faculty
                    </button>
                    <button
                      onClick={() => setShowAddFaculty(false)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Faculty Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                  <h3 className="text-lg font-bold text-white mb-2">Total Faculty</h3>
                  <p className="text-3xl font-bold text-purple-400">{facultyList.length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                  <h3 className="text-lg font-bold text-white mb-2">Active Faculty</h3>
                  <p className="text-3xl font-bold text-blue-400">{facultyList.filter(faculty => faculty.isActive).length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                  <h3 className="text-lg font-bold text-white mb-2">Total Commissions</h3>
                  <p className="text-3xl font-bold text-green-400">₹{facultyList.reduce((sum, faculty) => sum + (faculty.totalCommissionsEarned || 0), 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Faculty List */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Faculty List</h3>
                {facultyList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👨‍🏫</div>
                    <p className="text-white/60 text-lg">No faculty added yet</p>
                    <p className="text-white/40 text-sm">Add faculty members to start managing referrals</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {facultyList.map((faculty) => (
                      <div key={faculty._id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 
                            className="text-lg font-bold text-white cursor-pointer hover:text-blue-400 transition-colors duration-200"
                            onClick={() => {
                              setSelectedFaculty(faculty);
                              fetchReferredStudents(faculty.referralCode);
                            }}
                          >
                            {faculty.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                              {faculty.referralCode}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              faculty.isActive 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-600 text-white'
                            }`}>
                              {faculty.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-white/70">📧 {faculty.email}</p>
                          <p className="text-white/70">💼 {Math.round((faculty.commissionRate || 0) * 100)}% discount</p>
                          <p className="text-white/70">💰 ₹{(faculty.totalCommissionsEarned || 0).toLocaleString()} earned</p>
                          <p className="text-white/70">📅 Joined {new Date(faculty.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => {
                              setSelectedFaculty(faculty);
                              fetchReferredStudents(faculty.referralCode);
                            }}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteFaculty(faculty._id)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Faculty Details */}
            {selectedFaculty && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    Faculty Details - {selectedFaculty.name}
                  </h3>
                  <button
                    onClick={() => setSelectedFaculty(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                    <h4 className="text-lg font-bold text-white mb-4">Contact Information</h4>
                    <div className="space-y-3">
                      <p className="text-white/80"><span className="font-medium">Email:</span> {selectedFaculty.email}</p>
                      <p className="text-white/80"><span className="font-medium">Referral Code:</span> {selectedFaculty.referralCode}</p>
                      <p className="text-white/80"><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                          selectedFaculty.isActive 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-white'
                        }`}>
                          {selectedFaculty.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                    <h4 className="text-lg font-bold text-white mb-4">Discount & Commission Details</h4>
                    <div className="space-y-3">
                      <p className="text-white/80"><span className="font-medium">Discount Rate:</span> {Math.round((selectedFaculty.commissionRate || 0) * 100)}%</p>
                      <p className="text-white/80"><span className="font-medium">Total Earned:</span> ₹{(selectedFaculty.totalCommissionsEarned || 0).toLocaleString()}</p>
                      <p className="text-white/80"><span className="font-medium">Joined:</span> {new Date(selectedFaculty.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 mb-6">
                  <h4 className="text-lg font-bold text-white mb-4">Referral Information</h4>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔗</div>
                    <p className="text-white/80 mb-2">Share this referral code with students:</p>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-lg text-blue-400 border border-blue-500/30">
                      {selectedFaculty.referralCode}
                    </div>
                    <p className="text-white/60 text-sm mt-2">Students can use this code during registration to link their enrollment to this faculty member.</p>
                  </div>
                </div>

                {/* Referred Students Section */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
                  <h4 className="text-lg font-bold text-white mb-4">
                    Students Using This Referral Code ({referredStudents.length})
                  </h4>
                  {referredStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">👥</div>
                      <p className="text-white/60">No students have used this referral code yet</p>
                      <p className="text-white/40 text-sm mt-1">Students will appear here when they register using the referral code</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {referredStudents.map((student) => (
                        <div key={student._id} className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <h5 
                              className="text-white font-medium cursor-pointer hover:text-blue-400 transition-colors duration-200"
                              onClick={() => handleStudentClick(student)}
                            >
                              {student.name}
                            </h5>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              student.paymentStatus === 'completed' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-yellow-600 text-white'
                            }`}>
                              {student.paymentStatus}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/70">
                            <p>📧 {student.email}</p>
                            <p>📱 {student.phone}</p>
                            <p>📚 {student.selectedCourse}</p>
                            <p>💰 ₹{student.finalPrice.toLocaleString()}</p>
                            <p>📅 Enrolled: {new Date(student.createdAt).toLocaleDateString()}</p>
                            <p>🔗 Used code: {student.referralCode}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Payment Confirmations ({payments.length})</h2>
              <div className="text-white/60 text-sm">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
            
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💳</div>
                <p className="text-white/60 text-lg">No payment records found</p>
                <p className="text-white/40 text-sm">Student payment submissions will appear here for admin confirmation</p>
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    💡 <strong>Note:</strong> When students submit payments via QR code, they will appear here for manual verification and approval.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">All Payments</button>
                  <button className="px-4 py-2 bg-yellow-600/20 text-yellow-300 rounded-lg text-sm hover:bg-yellow-600/30">Waiting for Confirmation</button>
                  <button className="px-4 py-2 bg-green-600/20 text-green-300 rounded-lg text-sm hover:bg-green-600/30">Confirmed</button>
                  <button className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg text-sm hover:bg-red-600/30">Rejected</button>
                </div>

                {payments.map(payment => {
                  const createdDate = new Date(payment.createdAt);
                  const confirmedDate = payment.adminConfirmedAt ? new Date(payment.adminConfirmedAt) : null;
                  const timeSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60)); // minutes
                  
                  const formatTimeAgo = (minutes: number) => {
                    if (minutes < 60) return `${minutes}m ago`;
                    const hours = Math.floor(minutes / 60);
                    if (hours < 24) return `${hours}h ago`;
                    const days = Math.floor(hours / 24);
                    return `${days}d ago`;
                  };

                  return (
                    <div key={payment._id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      {/* Payment Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">💳</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {payment.studentId?.name || 'Unknown Student'}
                            </div>
                            <div className="text-white/60 text-sm">{payment.studentId?.email}</div>
                            <div className="text-white/40 text-xs mt-1">
                              Payment ID: {payment.paymentId}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-lg">
                            ₹{payment.amount.toLocaleString()}
                          </div>
                          <div className="text-white/60 text-sm">
                            {createdDate.toLocaleDateString('en-IN', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="text-white/40 text-xs">
                            {formatTimeAgo(timeSinceCreated)}
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="bg-black/30 rounded-lg p-3">
                          <div className="text-white/60 text-sm">Course</div>
                          <div className="text-white font-medium">{payment.courseId?.title || 'Unknown Course'}</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3">
                          <div className="text-white/60 text-sm">Transaction ID</div>
                          <div className="text-white font-medium font-mono text-xs">{payment.transactionId}</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3">
                          <div className="text-white/60 text-sm">Payment Method</div>
                          <div className="text-white font-medium">{payment.paymentMethod || 'manual_qr'}</div>
                        </div>
                      </div>

                      {/* Timing Information */}
                      <div className="bg-black/20 rounded-lg p-3 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-white/60">Submitted</div>
                            <div className="text-white">
                              {createdDate.toLocaleString('en-IN', {
                                day: '2-digit',
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })} ({formatTimeAgo(timeSinceCreated)})
                            </div>
                          </div>
                          {confirmedDate && (
                            <div>
                              <div className="text-white/60">
                                {payment.confirmationStatus === 'confirmed' ? 'Confirmed' : 'Rejected'}
                              </div>
                              <div className="text-white">
                                {confirmedDate.toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric', 
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Display Only */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <PaymentStatusBadge 
                            status={
                              payment.confirmationStatus === 'confirmed' ? 'confirmed' :
                              payment.confirmationStatus === 'rejected' ? 'rejected' :
                              payment.confirmationStatus === 'waiting_for_confirmation' ? 'pending' :
                              'unknown'
                            }
                            description={true}
                          />
                          
                          {payment.adminConfirmedBy && (
                            <div className="text-white/60 text-sm">
                              by {payment.adminConfirmedBy}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-white/60 text-sm">
                          Payment Details Only
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={showStudentModal}
        onClose={handleCloseStudentModal}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && studentToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Student</h3>
              <p className="text-white/70 mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-white">
                  {studentToDelete.firstName} {studentToDelete.lastName}
                </span>
                ? This action cannot be undone.
              </p>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
                <p className="text-red-300 text-sm">
                  This will permanently delete:
                </p>
                <ul className="text-red-300 text-sm mt-2 space-y-1">
                  <li>• Student profile and account</li>
                  <li>• All course enrollments</li>
                  <li>• Payment history</li>
                  <li>• Progress and assignments</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <span>🗑️</span>
                      <span>Delete Student</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
