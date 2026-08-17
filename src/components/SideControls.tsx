import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, ArrowUp } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const SideControls: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { dir } = useTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Calculate progress percentage
      if (docHeight > 0) {
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(progress);
      }

      // Show scroll-to-top button after 200px of scrolling
      if (scrollTop > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // SVG progress values
  const radius = 20;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Side Theme Switching Tab (Right side) */}
      <div 
        className={`fixed top-1/2 -translate-y-1/2 z-[999] transition-all duration-300 ${
          dir === 'rtl' ? 'left-0' : 'right-0'
        }`}
      >
        <button
          onClick={toggleTheme}
          className={`bg-zinc-700 hover:bg-zinc-600 text-white w-12 h-16 flex items-center justify-center shadow-lg transition-colors cursor-pointer border-white/10 border-l ${
            dir === 'rtl' 
              ? 'rounded-r-2xl border-r border-y' 
              : 'rounded-l-2xl border-l border-y'
          }`}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Auto Scroll-To-Top Circular Button with Progress Ring */}
      <div 
        className={`fixed bottom-28 z-[999] transition-all duration-500 transform ${
          showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        } ${
          dir === 'rtl' ? 'left-6' : 'right-6'
        }`}
      >
        <button
          onClick={handleScrollTop}
          className="relative w-12 h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all outline-none focus:outline-none"
          title="Scroll to Top"
        >
          {/* Circular Progress Ring */}
          <svg
            className="absolute -rotate-90 w-12 h-12"
            width="48"
            height="48"
          >
            <circle
              className="text-gray-200/50 dark:text-zinc-800/50"
              stroke="currentColor"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx="24"
              cy="24"
            />
            <circle
              className="text-cyan-500 transition-all duration-100"
              stroke="currentColor"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx="24"
              cy="24"
            />
          </svg>

          {/* Centered Arrow */}
          <ArrowUp className="w-5 h-5 text-black dark:text-white relative z-10" />
        </button>
      </div>
    </>
  );
};

export default SideControls;
