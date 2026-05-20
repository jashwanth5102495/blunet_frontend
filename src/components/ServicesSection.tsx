import React, { Suspense, lazy } from 'react';
import InfiniteGallery from './ui/3d-gallery-photography';

const TrueFocus = lazy(() => import('./ui/TrueFocus'));

const sampleImages = [
  { src: "/our-services/0.png", alt: "Service 0" },
  { src: "/our-services/1.png", alt: "Service 1" },
  { src: "/our-services/2.png", alt: "Service 2" },
  { src: "/our-services/3.png", alt: "Service 3" },
  { src: "/our-services/4.png", alt: "Service 4" },
  { src: "/our-services/5.png", alt: "Service 5" },
  { src: "/our-services/6.png", alt: "Service 6" },
  { src: "/our-services/7.png", alt: "Service 7" },
  { src: "/our-services/8.png", alt: "Service 8" },
  { src: "/our-services/9.png", alt: "Service 9" },
  { src: "/our-services/10.png", alt: "Service 10" },
  { src: "/our-services/11.png", alt: "Service 11" },
];

const ServicesSection = () => {
  return (
    <section 
      className="relative flex items-center justify-center w-full min-h-screen overflow-hidden" 
      style={{ backgroundColor: '#000000' }}
    >
      {/* 3D Gallery Background */}
      <div className="absolute inset-0 z-0">
        <InfiniteGallery
          images={sampleImages}
          speed={1.2}
          zSpacing={3}
          visibleCount={8}
          className="h-full w-full opacity-70"
          fadeSettings={{
            fadeIn: { start: 0, end: 0.2 },
            fadeOut: { start: 0.8, end: 1.0 }
          }}
          blurSettings={{
            blurIn: { start: 0, end: 0.1 },
            blurOut: { start: 0.8, end: 1.0 },
            maxBlur: 4
          }}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full pointer-events-none flex flex-col items-center justify-center min-h-screen px-3">
        <div className="pointer-events-auto mb-8">
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
        
        <h1 className="font-serif text-4xl md:text-7xl tracking-tight text-white mt-8 drop-shadow-2xl">
          <span className="italic font-light">Modern Solutions.</span> Real Impact
        </h1>
      </div>

      {/* Helper text overlay */}
      <div className="pointer-events-none text-center absolute bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold text-white/80 z-20">
        <p className="tracking-widest">Use mouse wheel, arrow keys, or touch to navigate</p>
        <p className="opacity-50 mt-1 tracking-widest">Auto-play resumes after 3 seconds of inactivity</p>
      </div>
    </section>
  );
};

export default ServicesSection;
