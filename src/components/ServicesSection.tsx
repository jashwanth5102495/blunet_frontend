import React, { Suspense, lazy } from 'react';
import FeatureCarousel from './ui/feature-carousel';

const PrismaticBurst = lazy(() => import('./ui/PrismaticBurst'));
const TrueFocus = lazy(() => import('./ui/TrueFocus'));

const ServicesSection = () => {
  return (
    <section className="relative flex items-center justify-center w-full min-h-screen p-8 overflow-hidden">
      {/* Absolute Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <PrismaticBurst
            animationType="rotate3d"
            intensity={2}
            speed={0.5}
            distort={1.0}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.25}
            rayCount={24}
            mixBlendMode="lighten"
            colors={['#004466', '#0099cc', '#ffffff']}
          />
        </Suspense>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full pointer-events-none flex flex-col items-center gap-4 pt-6 md:pt-8">
        <div className="pointer-events-auto">
          <Suspense fallback={<div className="h-16" />}>
            <div className="text-white">
              <TrueFocus 
                sentence="OUR SERVICES"
                manualMode={false}
                blurAmount={5}
                borderColor="white"
                glowColor="rgba(255, 255, 255, 0.3)"
                animationDuration={1}
                pauseBetweenAnimations={1.5}
              />
            </div>
          </Suspense>
        </div>
        <div className="pointer-events-auto w-full">
          <FeatureCarousel />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
