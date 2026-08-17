import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingBackgroundsProps {
  interval?: number; // in milliseconds
  onIndexChange?: (index: number) => void;
}

const backgroundImages = [
  '/hero/Digital Product Development.webp',
  '/hero/AI & Business Automation.webp',
  '/hero/Cloud & Infrastructure.webp',
  '/hero/247 IT Support.webp',
  '/hero/Digital Business analyst.webp',
  '/hero/E-Commerce.webp',
  '/hero/Education & Career.webp',
  '/hero/e learning.webp',
  '/hero/Interior & Space Design.webp',
  '/hero/Logistics & Fleet.webp'
];

const RotatingBackgrounds: React.FC<RotatingBackgroundsProps> = ({ 
  interval = 5000,
  onIndexChange
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => {
        const next = (prev + 1) % backgroundImages.length;
        if (onIndexChange) onIndexChange(next);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval, onIndexChange]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none z-0">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIdx}
          src={backgroundImages[currentIdx]}
          alt="background"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
};

export default RotatingBackgrounds;
