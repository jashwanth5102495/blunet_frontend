import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Header from './Header';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper to create URL-safe slugs from names/usernames
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Protect by login only
export function ProtectedLoginRoute({ children }: { children: ReactNode }) {
  const currentUserRaw = localStorage.getItem('currentUser');
  if (!currentUserRaw) return <Navigate to="/student-login" replace />;
  const currentUser = JSON.parse(currentUserRaw);
  if (!currentUser?.isAuthenticated || !currentUser?.token) return <Navigate to="/student-login" replace />;
  return children;
}

export function ProtectedCourseGate({ courseId, children }: { courseId: string; children: ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentUserRaw = localStorage.getItem('currentUser');
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
  const token: string | undefined = currentUser?.token;
  const isLoggedIn = Boolean(currentUser?.isAuthenticated && token);

  useEffect(() => {
    if (!isLoggedIn || !token) return;
    setAllowed(null);
    setError(null);

    if (courseId && (
      courseId.includes('cyber-security') || 
      courseId.includes('frontend') || 
      courseId.includes('backend') || 
      courseId.includes('fullstack') ||
      courseId.includes('networking') ||
      courseId.includes('devops')
    )) {
      setAllowed(true);
      return;
    }

    let cancelled = false;
    const checkAccess = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/courses/access/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data?.success) {
          setAllowed(Boolean(data.allowed));
        } else {
          setAllowed(false);
          setError(data?.message || 'Access denied');
        }
      } catch (e: any) {
        if (cancelled) return;
        setAllowed(false);
        setError(e?.message || 'Network error');
      }
    };
    checkAccess();
    return () => {
      cancelled = true;
    };
  }, [courseId, isLoggedIn, token]);

  if (!isLoggedIn) return <Navigate to="/student-login" replace />;

  if (allowed === null) {
    return (<>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900 flex items-center justify-center">
        <p>Checking course access...</p>
      </div>
    </>);
  }
  if (!allowed) {
    return (<>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900 flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Access denied</h2>
        <p className="text-gray-600">{error || 'You must purchase this course to view the study material.'}</p>
        <a href={`/course-enrollment/${courseId}`} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 text-white">Purchase Course</a>
      </div>
    </>);
  }
  return children;
}

// Protect by both login and matching student slug, then verify course purchase
export function ProtectedStudentCourseGate({ requiredCourseId, children }: { requiredCourseId: string; children: ReactNode }) {
  const { studentSlug } = useParams();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentUserRaw = localStorage.getItem('currentUser');
    if (!currentUserRaw) {
      setAllowed(false);
      setError('Please login to access this content.');
      return;
    }
    const currentUser = JSON.parse(currentUserRaw);
    if (!currentUser?.isAuthenticated || !currentUser?.token) {
      setAllowed(false);
      setError('Please login to access this content.');
      return;
    }

    const expectedSlug = slugify(currentUser.username || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`);
    if (!studentSlug || slugify(studentSlug) !== expectedSlug) {
      setAllowed(false);
      setError('This URL does not match your account.');
      return;
    }

    const checkAccess = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/courses/access/${requiredCourseId}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        const data = await res.json();
        if (res.ok && data?.success) {
          setAllowed(Boolean(data.allowed));
        } else {
          setAllowed(false);
          setError(data?.message || 'Access denied');
        }
      } catch (e: any) {
        setAllowed(false);
        setError(e?.message || 'Network error');
      }
    };

    checkAccess();
  }, [studentSlug, requiredCourseId]);

  if (allowed === null) {
    return (<>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900 flex items-center justify-center">
        <p>Checking your access...</p>
      </div>
    </>);
  }
  if (!allowed) {
    return (<>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900 flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Access denied</h2>
        <p className="text-gray-600">{error || 'You must purchase this course to view the content.'}</p>
        <a href={`/course-enrollment/frontend-beginner`} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 text-white">Purchase Course</a>
      </div>
    </>);
  }
  return children;
}
