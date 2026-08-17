import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import SplitTextReveal from './SplitTextReveal';
import { GraduationCap, Bot, Layers, Cloud, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const StudentProgramsSection: React.FC = () => {
  const { t, dir } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isInView = useInView(containerRef, { margin: "-10%" });

  const curriculumData = [
    {
      id: 1,
      stageTitle: t('studentPrograms.curriculum.foundation.stageTitle'),
      title: t('studentPrograms.curriculum.foundation.title'),
      description: t('studentPrograms.curriculum.foundation.description'),
      icon: GraduationCap,
      bullets: (t('studentPrograms.curriculum.foundation.bullets') as any) || [],
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-cyan-500/50"
    },
    {
      id: 2,
      stageTitle: t('studentPrograms.curriculum.aiWorkflow.stageTitle'),
      title: t('studentPrograms.curriculum.aiWorkflow.title'),
      description: t('studentPrograms.curriculum.aiWorkflow.description'),
      icon: Bot,
      bullets: (t('studentPrograms.curriculum.aiWorkflow.bullets') as any) || [],
      color: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/50"
    },
    {
      id: 3,
      stageTitle: t('studentPrograms.curriculum.modernStack.stageTitle'),
      title: t('studentPrograms.curriculum.modernStack.title'),
      description: t('studentPrograms.curriculum.modernStack.description'),
      icon: Layers,
      bullets: (t('studentPrograms.curriculum.modernStack.bullets') as any) || [],
      color: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-500/50"
    },
    {
      id: 4,
      stageTitle: t('studentPrograms.curriculum.cloudOps.stageTitle'),
      title: t('studentPrograms.curriculum.cloudOps.title'),
      description: t('studentPrograms.curriculum.cloudOps.description'),
      icon: Cloud,
      bullets: (t('studentPrograms.curriculum.cloudOps.bullets') as any) || [],
      color: "from-orange-500/20 to-red-500/20",
      border: "border-orange-500/50"
    },
    {
      id: 5,
      stageTitle: t('studentPrograms.curriculum.automation.stageTitle'),
      title: t('studentPrograms.curriculum.automation.title'),
      description: t('studentPrograms.curriculum.automation.description'),
      icon: Shield,
      bullets: (t('studentPrograms.curriculum.automation.bullets') as any) || [],
      color: "from-yellow-500/20 to-amber-500/20",
      border: "border-yellow-500/50"
    }
  ];

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      setActiveIndex(Math.min(Math.max(Math.round(v * 4), 0), 4));
    });
  }, [scrollYProgress]);

  const [direction, setDirection] = useState(1);
  useEffect(() => {
    return scrollY.onChange((current) => {
      const previous = scrollY.getPrevious() || 0;
      if (current > previous) setDirection(1);
      else setDirection(-1);
    });
  }, [scrollY]);

  const [phase, setPhase] = useState<1 | 2>(2);

  useEffect(() => {
    if (isInView && direction === 1) {
      setPhase(1);
      const timer = setTimeout(() => {
        setPhase(2);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (!isInView) {
      setPhase(2);
    }
  }, [isInView]);

  const smoothProgress = scrollYProgress;

  // Mirror x scroll translation in RTL mode
  const translateXVal = dir === 'rtl' ? ["0%", "80%"] : ["0%", "-80%"];
  const carouselX = useTransform(smoothProgress, [0, 1], translateXVal);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[500vh] bg-black" 
      dir={dir}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row">
        
        {/* PHASE 1: SPLIT TEXT INTRO OVERLAY */}
        <AnimatePresence>
          {phase === 1 && (
            <motion.div 
              key="intro-overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center bg-black z-[100] pointer-events-none"
            >
              <SplitTextReveal 
                text={t('studentPrograms.badge')}
                className="text-[14vw] md:text-[10vw] font-medium tracking-[-0.05em] leading-[0.9] text-center text-[#E1E0CC]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Background & Overlays */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover z-0 opacity-100"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none z-0"></div>
        <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>

        {/* LEFT COLUMN: True Horizontal Scrolling Cards */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden z-10">
          <motion.div 
            className="flex h-full w-[500%] items-center -mt-8 md:-mt-16"
            style={{ x: carouselX }}
          >
            {curriculumData.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="w-[20%] h-full flex items-center justify-center p-4 md:p-10 relative">
                  <div className="w-full max-w-[550px] aspect-square md:aspect-[4/5] rounded-[2rem] p-8 md:p-12 flex flex-col justify-between shadow-2xl overflow-hidden border bg-black/60 border-white/10">
                    <div className="relative z-10 text-left">
                      <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-6 backdrop-blur-md bg-black/50 border-white/10">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black tracking-widest leading-tight drop-shadow-lg uppercase font-mono text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                        {item.stageTitle}
                      </h3>
                    </div>

                    <div className="relative z-10 text-6xl md:text-8xl font-black leading-none opacity-40 text-white/50 Ltr:self-end rtl:self-start">
                      0{item.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Dynamic Content with Bottom-to-Top fade */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-start p-6 md:px-16 z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${curriculumData[activeIndex]?.id}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`absolute w-[90%] max-w-[600px] p-6 rounded-3xl backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] -mt-24 md:-mt-48 border bg-black/20 border-white/5 ${
                dir === 'rtl' ? 'text-right' : 'text-left'
              }`}
            >
              <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight font-poppins uppercase text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                {curriculumData[activeIndex]?.title}
              </h2>
              <p className="text-base md:text-lg mb-6 md:mb-8 leading-relaxed font-medium font-sora text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {curriculumData[activeIndex]?.description}
              </p>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {curriculumData[activeIndex]?.bullets.map((bullet: string, i: number) => (
                  <li key={i} className="flex items-center text-sm md:text-base font-semibold font-sora text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <div className={`w-2 h-2 rounded-full bg-cyan-400 ${dir === 'rtl' ? 'ml-4' : 'mr-4'} shadow-[0_0_8px_rgba(0,245,255,0.8)] flex-shrink-0`}></div>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                {curriculumData.map((_, i) => (
                  <div 
                    key={`dot-${i}`} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === activeIndex 
                        ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(0,245,255,0.5)]' 
                        : 'w-2 bg-white/30'
                    }`}
                  ></div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={`absolute bottom-6 z-50 pointer-events-auto max-w-[280px] md:max-w-[340px] group ${
          dir === 'rtl' ? 'left-6 md:left-10' : 'right-6 md:right-10'
        }`}>
          
          {/* External Animated Bloom Layer */}
          <div 
            className="absolute inset-0 rounded-[16px] blur-[12px] opacity-70 p-[2px]"
            style={{ 
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[600px] h-[600px] flex-shrink-0 bg-[conic-gradient(from_0deg_at_50%_50%,#00f5ff_0deg,#3b82f6_90deg,#00f5ff_160deg,transparent_200deg)] animate-[spin_4s_linear_infinite]" />
            </div>
          </div>

          {/* Actual Card Layer with Animated Border */}
          <div className="relative p-[2px] rounded-[16px]">
            <div 
              className="absolute inset-0 rounded-[16px] p-[2px]"
              style={{ 
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[600px] h-[600px] flex-shrink-0 bg-[conic-gradient(from_0deg_at_50%_50%,#00f5ff_0deg,#3b82f6_90deg,#00f5ff_160deg,transparent_200deg)] animate-[spin_4s_linear_infinite]" />
              </div>
            </div>
            
            {/* Inner Glassmorphism Content */}
            <div className={`relative z-10 w-full h-full backdrop-blur-xl rounded-[14px] p-5 md:p-6 shadow-2xl text-left ${
              dir === 'rtl' ? 'text-right' : 'text-left'
            } bg-[#12111a]/60 text-white`}>
              <p className="m-0 text-[14px] md:text-[15px] leading-[1.7] font-sora text-[#e2e0f0]">
                <a 
                  href="/student-page"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/student-page');
                  }}
                  className="text-cyan-400 no-underline font-bold border-b border-cyan-400/40 transition-colors duration-200 hover:text-cyan-300 hover:border-cyan-300/80"
                >
                  {t('studentPrograms.learnMore')}
                </a>{' '}
                {t('studentPrograms.learnMoreText')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProgramsSection;
