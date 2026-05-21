"use client";

import React, { Suspense, lazy, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassFilter } from "@/components/ui/liquid-radio";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FlowHoverButton } from "@/components/ui/flow-hover-button";

const Spline = lazy(() => import("@splinetool/react-spline"));

const SentinelHero: React.FC = () => {
  const [environment, setEnvironment] = useState('online')
  const navigate = useNavigate();

  const handleAuthChange = (value: string) => {
    setEnvironment(value);
    navigate('/student-login');
  };

  return (
    <section id="blunet-academy" className="relative min-h-screen flex items-end bg-hero-bg overflow-hidden font-sora antialiased">
      {/* Top Right Liquid Radio Button */}
      <div className="absolute top-6 right-6 z-[100] scale-100 sm:scale-110">
        <div className="inline-flex h-11 rounded-lg bg-input/50 p-0.5">
          <RadioGroup 
            value={environment} 
            onValueChange={handleAuthChange} 
            className="group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-background/80 after:shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 has-[:focus-visible]:after:outline-ring/70 data-[state=offline]:after:translate-x-0 data-[state=online]:after:translate-x-full dark:after:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" 
            data-state={environment} 
          > 
            <div 
              className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md" 
              style={{ filter: 'url("#radio-glass")' }} 
            /> 
            <label 
              onClick={() => navigate('/student-login')}
              className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors text-muted-foreground/70 group-data-[state=online]:text-muted-foreground/70 group-data-[state=offline]:text-foreground"
            > 
              Sign-up 
              <RadioGroupItem id="env-offline" value="offline" className="sr-only" /> 
            </label> 
            <label 
              onClick={() => navigate('/student-login')}
              className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors text-muted-foreground/70 group-data-[state=offline]:text-muted-foreground/70 group-data-[state=online]:text-foreground"
            > 
              Login 
              <RadioGroupItem id="env-online" value="online" className="sr-only" /> 
            </label> 
            <GlassFilter /> 
          </RadioGroup> 
        </div>
      </div>
      {/* Spline 3D Background */}
      <div 
        className="absolute inset-0"
        onWheelCapture={(e) => e.stopPropagation()}
        onTouchMoveCapture={(e) => e.stopPropagation()}
      >
        <Suspense fallback={<div className="absolute inset-0 bg-hero-bg" />}>
          <Spline
            scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none" />

      {/* Content container */}
      <div className="relative z-10 pointer-events-none w-full max-w-[90%] sm:max-w-md lg:max-w-2xl px-6 md:px-10 pb-10 md:pb-10 pt-32">
        <div className="flex flex-col">
          {/* Heading */}
          <h1 
            className="opacity-0 animate-fade-up text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-2 md:mb-4 uppercase"
            style={{ animationDelay: "0.2s" }}
          >
            BluNet <span className="text-primary">Academy</span>
          </h1>

          {/* Subheading */}
          <p 
            className="opacity-0 animate-fade-up text-foreground/80 text-[clamp(1.125rem,2.5vw,1.875rem)] font-light mb-3 md:mb-6"
            style={{ animationDelay: "0.4s" }}
          >
            Modern training for future engineers.
          </p>

          {/* Description */}
          <p 
            className="opacity-0 animate-fade-up text-muted-foreground text-[clamp(0.875rem,1.5vw,1.25rem)] font-light mb-4 md:mb-8"
            style={{ animationDelay: "0.55s" }}
          >
            Hands-on student upskilling programs focused on software development, AI workflows, cloud technologies, automation, and real-world engineering practices built for today’s tech industry.
          </p>

          {/* Maintenance Notice */}
          <div 
            className="opacity-0 animate-fade-up pointer-events-auto mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md max-w-xl"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-yellow-200 text-sm md:text-base leading-relaxed flex items-start gap-3">
              <span className="flex-shrink-0 text-xl">⚠️</span>
              <span>Updates are being installed — login issues or small interruptions may occur. We appreciate your patience.</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div 
            className="opacity-0 animate-fade-up flex flex-wrap gap-4 font-bold"
            style={{ animationDelay: "0.7s" }}
          >
            <button 
              onClick={() => navigate('/student-login')}
              className="pointer-events-auto bg-primary text-primary-foreground px-6 py-3 md:px-8 md:py-4 text-sm md:text-base rounded-sm cursor-pointer hover:brightness-110 transition-all active:scale-[0.97] border border-primary/40 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            >
              Start Learning
            </button>
            <FlowHoverButton 
              onClick={() => navigate('/courses')}
              className="pointer-events-auto rounded-sm px-6 py-3 md:px-8 md:py-4 text-sm md:text-base"
            >
              Explore Programs
            </FlowHoverButton>
          </div>

          {/* Trust line */}
          <p 
            className="opacity-0 animate-fade-up text-muted-foreground/60 text-xs font-light mt-4 md:mt-6"
            style={{ animationDelay: "0.85s" }}
          >
            
          </p>
        </div>
      </div>
    </section>
  );
};

export default SentinelHero;
