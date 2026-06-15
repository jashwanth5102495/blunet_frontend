import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import SplitTextReveal from './SplitTextReveal';
import { GraduationCap, Bot, Layers, Cloud, Shield, Code, Brain, Target, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SpotlightCard from './ui/SpotlightCard';

const curriculumData = [
  {
    id: 1,
    stageTitle: "FOUNDATION",
    title: "Learn Fundamentals",
    description: "Build a strong technical foundation with core programming concepts, logic building, and syntax mastery. Students learn how software actually works before moving into advanced development.",
    icon: GraduationCap,
    bullets: [
      "Core programming concepts",
      "Logic building & problem solving",
      "Programming language syntax",
      "Clean coding practices",
      "Theory + practical understanding"
    ],
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-cyan-500/50"
  },
  {
    id: 2,
    stageTitle: "AI WORKFLOW",
    title: "AI-Powered Development",
    description: "Learn how modern developers use AI tools and LLMs to increase productivity, accelerate learning, and build smarter applications efficiently.",
    icon: Bot,
    bullets: [
      "Prompt engineering basics",
      "Using LLMs effectively",
      "AI-assisted coding workflows",
      "Modern developer productivity",
      "Coding with AI collaboration"
    ],
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/50"
  },
  {
    id: 3,
    stageTitle: "MODERN STACK",
    title: "Build With Modern Tools",
    description: "Get hands-on experience with industry-leading development tools and modern workflows used by startups and tech companies worldwide.",
    icon: Layers,
    bullets: [
      "Vibe coding tools",
      "Frontend & backend integration",
      "MongoDB & NoSQL databases",
      "API handling",
      "Real-world project workflows"
    ],
    color: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-500/50"
  },
  {
    id: 4,
    stageTitle: "CLOUD OPS",
    title: "Cloud & DevOps",
    description: "Understand how applications are deployed, managed, and scaled using modern cloud platforms and DevOps practices.",
    icon: Cloud,
    bullets: [
      "AWS EC2 fundamentals",
      "Google Cloud Platform basics",
      "Deployment workflows",
      "DevOps introduction",
      "CI/CD concepts & tools"
    ],
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/50"
  },
  {
    id: 5,
    stageTitle: "AUTOMATION",
    title: "AI Agents & Security",
    description: "Explore the future of automation by building AI agents while learning essential cybersecurity and networking fundamentals.",
    icon: Shield,
    bullets: [
      "AI agents using n8n",
      "Workflow automations",
      "Basic cybersecurity tools",
      "Networking fundamentals",
      "Secure application practices"
    ],
    color: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/50"
  }
];

const StudentProgramsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isInView = useInView(containerRef, { margin: "-10%" });

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

  // Use raw scrollYProgress for absolute smoothness
  const smoothProgress = scrollYProgress;

  // A true horizontal scrolling carousel for the left column (moves from 0% to -80%)
  const carouselX = useTransform(smoothProgress, [0, 1], ["0%", "-80%"]);

  return (
    <div ref={containerRef} className="relative w-full bg-black h-[500vh]">
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
                text="Students Development"
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
          className="absolute inset-0 h-full w-full object-cover z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none z-0"></div>

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
                  <div className={`w-full max-w-[550px] aspect-square md:aspect-[4/5] rounded-[2rem] bg-black/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 flex flex-col justify-between shadow-2xl overflow-hidden`}>
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 text-3xl md:text-4xl font-black tracking-widest leading-tight drop-shadow-lg uppercase">
                        {item.stageTitle}
                      </h3>
                    </div>

                    <div className="relative z-10 text-white/50 text-6xl md:text-8xl font-black self-end leading-none opacity-40">
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
              className="absolute w-[90%] max-w-[600px] p-6 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] -mt-24 md:-mt-48"
            >
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                {curriculumData[activeIndex]?.title}
              </h2>
              <p className="text-lg md:text-2xl text-white mb-6 md:mb-8 leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {curriculumData[activeIndex]?.description}
              </p>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {curriculumData[activeIndex]?.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center text-white text-base md:text-xl font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <div className="w-2 h-2 rounded-full bg-white mr-4 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    {bullet}
                  </li>
                ))}
              </ul>
              
              <div className="flex items-center space-x-2">
                {curriculumData.map((_, i) => (
                  <div 
                    key={`dot-${i}`} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/30'}`}
                  ></div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-50 pointer-events-auto max-w-[280px] md:max-w-[340px] group">
          
          {/* External Animated Bloom Layer (Masked to border) */}
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
              <div className="w-[600px] h-[600px] flex-shrink-0 bg-[conic-gradient(from_0deg_at_50%_50%,#7c3aed_0deg,#2563eb_90deg,#7c3aed_160deg,transparent_200deg)] animate-[spin_4s_linear_infinite]" />
            </div>
          </div>

          {/* Actual Card Layer with Animated Border */}
          <div className="relative p-[2px] rounded-[16px]">
            {/* Masked spinning border */}
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
                <div className="w-[600px] h-[600px] flex-shrink-0 bg-[conic-gradient(from_0deg_at_50%_50%,#7c3aed_0deg,#2563eb_90deg,#7c3aed_160deg,transparent_200deg)] animate-[spin_4s_linear_infinite]" />
              </div>
            </div>
            
            {/* Inner Glassmorphism Content */}
            <div className="relative z-10 w-full h-full bg-[#12111a]/60 backdrop-blur-xl rounded-[14px] p-5 md:p-6 shadow-2xl">
              <p className="m-0 text-[14px] md:text-[15px] leading-[1.7] text-[#e2e0f0]">
                <a 
                  href="/collaboration"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/student-page');
                  }}
                  className="text-[#a78bfa] no-underline font-medium border-b border-[#a78bfa]/40 transition-colors duration-200 hover:text-[#c4b5fd] hover:border-[#c4b5fd]/80"
                >
                  Learn more
                </a>{' '}
                about our Students Development programs and institutional collaboration opportunities.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProgramsSection;
