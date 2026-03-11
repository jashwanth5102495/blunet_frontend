
import { useState, useEffect } from 'react';
import { Course, INITIAL_COURSES } from '../data/courses';

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

  const addCourse = (newCourse: Course) => {
    const updatedCourses = [...courses, newCourse];
    saveCourses(updatedCourses);
  };

  const deleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    saveCourses(updatedCourses);
  };

  const updateCourse = (updatedCourse: Course) => {
    const updatedCourses = courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    );
    saveCourses(updatedCourses);
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
