
import { useState, useEffect } from 'react';
import { Course, INITIAL_COURSES } from '../data/courses';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = () => {
      try {
        const storedCourses = localStorage.getItem('blunet_courses');
        if (storedCourses) {
          setCourses(JSON.parse(storedCourses));
        } else {
          setCourses(INITIAL_COURSES);
          localStorage.setItem('blunet_courses', JSON.stringify(INITIAL_COURSES));
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
        setCourses(INITIAL_COURSES);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();

    const fetchAuthoringOverrides = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/courses/authoring`, { cache: 'no-store' });
        if (!response.ok) return;
        const result = await response.json();
        if (!result?.success || !Array.isArray(result.data)) return;

        const normalize = (value: string | undefined) => (value ?? '').trim().toLowerCase();
        const overrides: Course[] = result.data;

        setCourses((prev) => {
          const map = new Map<string, Course>();
          for (const course of prev.length ? prev : INITIAL_COURSES) {
            const key = normalize(course.id || (course as any).courseId);
            if (!key) continue;
            map.set(key, course);
          }
          for (const course of overrides) {
            const key = normalize(course.id || (course as any).courseId);
            if (!key) continue;
            map.set(key, course);
          }
          const merged = Array.from(map.values());
          localStorage.setItem('blunet_courses', JSON.stringify(merged));
          window.dispatchEvent(new Event('coursesUpdated'));
          return merged;
        });
      } catch (error) {
        console.error('Failed to fetch authoring overrides:', error);
      }
    };

    fetchAuthoringOverrides();

    // Listen for storage events to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'blunet_courses' && e.newValue) {
        setCourses(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem('blunet_courses', JSON.stringify(newCourses));
    // Dispatch a custom event for same-tab synchronization
    window.dispatchEvent(new Event('coursesUpdated'));
  };

  const getAdminToken = () => {
    try {
      return sessionStorage.getItem('admin_auth_token');
    } catch {
      return null;
    }
  };

  const persistAuthoringCourse = async (updatedCourse: Course) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await fetch(`${BASE_URL}/api/courses/authoring/${encodeURIComponent(updatedCourse.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedCourse)
      });
    } catch (error) {
      console.error('Failed to persist authoring course:', error);
    }
  };

  const createAuthoringCourse = async (newCourse: Course) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await fetch(`${BASE_URL}/api/courses/authoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
    } catch (error) {
      console.error('Failed to create authoring course:', error);
    }
  };

  const removeAuthoringCourse = async (courseId: string) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await fetch(`${BASE_URL}/api/courses/authoring/${encodeURIComponent(courseId)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Failed to delete authoring course:', error);
    }
  };

  const addCourse = (newCourse: Course) => {
    const updatedCourses = [...courses, newCourse];
    saveCourses(updatedCourses);
    void createAuthoringCourse(newCourse);
  };

  const deleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    saveCourses(updatedCourses);
    void removeAuthoringCourse(courseId);
  };

  const updateCourse = (updatedCourse: Course) => {
    const updatedCourses = courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    );
    saveCourses(updatedCourses);
    void persistAuthoringCourse(updatedCourse);
  };

  // Listen for custom event 'coursesUpdated' to sync within the same tab/window
  useEffect(() => {
    const handleLocalUpdate = () => {
      const storedCourses = localStorage.getItem('blunet_courses');
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }
    };

    window.addEventListener('coursesUpdated', handleLocalUpdate);
    return () => window.removeEventListener('coursesUpdated', handleLocalUpdate);
  }, []);

  return { courses, loading, addCourse, deleteCourse, updateCourse };
};
