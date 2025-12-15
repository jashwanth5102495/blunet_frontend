import React from 'react';
import './ThemeSwitch.css';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`theme-wrapper ${isDark ? 'dark' : 'light'}`}>
      <div className="toggle" onClick={toggleTheme}>
        <div className="thumb" />
      </div>
      <span className="label">Theme: {isDark ? 'Dark' : 'Light'}</span>
    </div>
  );
};

export default ThemeSwitch;