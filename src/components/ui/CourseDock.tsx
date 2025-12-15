import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSwitch from '../ThemeSwitch';
import { useTheme } from '../../contexts/ThemeContext';

interface CourseDockProps {
  courseSlug: string;
  firstModuleSlug: string;
}

/**
 * Floating Dock with quick actions for the course intro page.
 * - Start Learning
 * - View Syllabus
 * - Theme toggle
 */
export default function CourseDock({ courseSlug, firstModuleSlug }: CourseDockProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerClass = isDark
    ? 'bg-white/10 text-white border border-white/20'
    : 'bg-white/80 text-gray-900 border border-gray-200';

  return (
    <div
      className={`fixed top-12 left-1/2 -translate-x-1/2 z-40 ${containerClass} backdrop-blur-xl shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2`}
      aria-label="Dock"
    >
      <button
        onClick={() => navigate(`/${courseSlug}/module/${firstModuleSlug}`)}
        className={`px-3 py-1.5 rounded-lg text-sm ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition`}
        aria-label="Start Learning"
      >
        Start Learning
      </button>
      <button
        onClick={() => document.getElementById('syllabus')?.scrollIntoView({ behavior: 'smooth' })}
        className={`px-3 py-1.5 rounded-lg text-sm ${isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-100 hover:bg-gray-200'} transition`}
        aria-label="View Syllabus"
      >
        View Syllabus
      </button>
      <div className="mx-1 h-6 w-px bg-gray-300/60 dark:bg-white/20" aria-hidden />
      <div className="px-2 py-1">
        <ThemeSwitch />
      </div>
    </div>
  );
}