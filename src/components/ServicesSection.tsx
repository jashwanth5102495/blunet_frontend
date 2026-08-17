import React, { Suspense, lazy } from 'react';
import InfiniteGallery from './ui/3d-gallery-photography';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';

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
  const { t, dir } = useTranslation();
  const { theme } = useTheme();

  return (
    <section 
      dir={dir}
      className={`relative flex items-center justify-center w-full min-h-screen overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'
      }`}
    >
      {/* 3D Gallery Background */}
      <div className="absolute inset-0 z-0">
        <InfiniteGallery
          images={sampleImages}
          speed={1.2}
          zSpacing={3}
          visibleCount={8}
          className={`h-full w-full transition-opacity duration-300 ${
            theme === 'dark' ? 'opacity-70' : 'opacity-40'
          }`}
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
            <div className={theme === 'dark' ? 'text-white' : 'text-black'}>
              <TrueFocus 
                sentence={t('services.title')}
                manualMode={false}
                blurAmount={5}
                borderColor={theme === 'dark' ? 'white' : 'black'}
                glowColor="rgba(0, 245, 255, 0.6)"
              />
            </div>
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
