import { useRef } from 'react';
import { motion } from 'framer-motion';
import RotatingBackgrounds from './backgrounds/RotatingBackgrounds';
import VariableProximity from './VariableProximity';
import RotatingText from './RotatingText';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="hero-section" className="bg-black min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Backgrounds (rotates one at a time every 7s) */}
      <RotatingBackgrounds interval={7000} />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 hero-overlay"></div>

      <div ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top badge - End-to-End Project Monitoring */}
        <motion.button 
          onClick={() => window.location.href = '/project-tracking'}
          className="inline-flex items-center space-x-2 bg-gray-900/50 border border-gray-700 rounded-full px-4 py-2 mb-8 group relative cursor-pointer"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            borderColor: 'rgba(107, 114, 128, 0.8)'
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 17 
          }}
        >
          {/* Popup Effect Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ 
              opacity: 1, 
              scale: 1.1,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          />
          
          {/* Glowing Border Effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            whileHover={{
              borderColor: 'rgba(59, 130, 246, 0.5)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(147, 51, 234, 0.2)'
            }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.div 
            className="w-2 h-2 bg-green-500 rounded-full group-hover:bg-green-400 transition-colors relative z-10"
            whileHover={{ scale: 1.2, boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)' }}
          />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors relative z-10">End-to-end project monitoring</span>
          <motion.svg 
            className="w-4 h-4 text-gray-400 group-hover:text-gray-200 transition-colors relative z-10" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </motion.button>

        {/* Main heading with Company Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          <VariableProximity
            label="BluNet IT Services"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 800, 'opsz' 40"
            containerRef={containerRef as unknown as React.RefObject<HTMLElement>}
            radius={80}
            falloff="gaussian"
            style={{ color: 'white' }}
          />
        </h1>

        {/* Creative Text with Rotating Words */}
        <div className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight flex items-center justify-center gap-3">
          <span>Creative</span>
          <RotatingText
            texts={['thinking', 'design', 'development', 'solutions', 'innovation']}
            mainClassName="px-3 py-1 bg-purple-600 text-white overflow-hidden rounded-lg text-lg md:text-xl"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>

        {/* Subtitle with Variable Proximity */}
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          <VariableProximity
            label="Create a clear roadmap, track progress, and smoothly guide your project from idea to successful launch."
            fromFontVariationSettings="'wght' 300, 'opsz' 8"
            toFontVariationSettings="'wght' 600, 'opsz' 20"
            containerRef={containerRef as unknown as React.RefObject<HTMLElement>}
            radius={60}
            falloff="exponential"
            style={{ color: '#9ca3af' }}
          />
        </p>



        {/* Trust indicators */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="text-green-500">Excellent</span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span>4.9 reviews on</span>
            <span className="text-green-500 font-semibold">Trustpilot</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;