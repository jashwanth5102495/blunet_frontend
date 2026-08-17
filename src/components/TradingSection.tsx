import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TradingSection = () => {
  const { theme } = useTheme();

  return (
    <section className={`py-20 relative overflow-hidden z-10 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-white'
    }`}>
      {/* Glowing line effect */}
      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
        <div className={`w-full h-px bg-gradient-to-r from-transparent to-transparent opacity-60 ${
          theme === 'dark' ? 'via-white' : 'via-zinc-300'
        }`}></div>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent blur-sm opacity-40 ${
          theme === 'dark' ? 'via-white' : 'via-zinc-300'
        }`}></div>
      </div>

      {/* Bottom gradient effect */}
      <div className={`absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t to-transparent ${
        theme === 'dark' ? 'from-gray-900/20' : 'from-gray-100/20'
      }`}></div>
    </section>
  );
};

export default TradingSection;
