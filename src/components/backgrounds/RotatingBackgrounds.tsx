import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';

// Lazy load background components
const Threads = lazy(() => import('./Threads'));
const FaultyTerminal = lazy(() => import('./FaultyTerminal'));
const LetterGlitch = lazy(() => import('./LetterGlitch'));
const LightRays = lazy(() => import('./LightRays'));
const LineWaves = lazy(() => import('../ui/LineWaves'));
const Beams = lazy(() => import('../ui/Beams'));
const Grainient = lazy(() => import('./Grainient'));

// Error Boundary Component
class BackgroundErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Background Component Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="absolute inset-0 bg-black" />; // Fallback to black background
    }
    return this.props.children;
  }
}

interface RotatingBackgroundsProps {
  interval?: number; // in milliseconds
}

const RotatingBackgrounds: React.FC<RotatingBackgroundsProps> = ({ 
  interval = 5000 // 5 seconds default
}) => {
  const [currentBackground, setCurrentBackground] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const backgrounds = useMemo(() => [
    {
      name: 'Beams',
      duration: 10000,
      component: (
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      )
    },
    {
      name: 'Grainient',
      component: (
        <Grainient
          color1="#c69191"
          color2="#5227FF"
          color3="#B497CF"
          timeSpeed={1.05}
          colorBalance={0.0}
          warpStrength={1.0}
          warpFrequency={5.0}
          warpSpeed={3.6}
          warpAmplitude={50.0}
          blendAngle={0.0}
          blendSoftness={0.05}
          rotationAmount={500.0}
          noiseScale={2.0}
          grainAmount={0.1}
          grainScale={2.0}
          grainAnimated={false}
          contrast={1.5}
          gamma={1.0}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.9}
        />
      )
    },
    {
      name: 'Line Waves',
      duration: 10000,
      component: (
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1.0}
          rotation={-45}
          edgeFadeWidth={0.0}
          colorCycleSpeed={1.0}
          brightness={0.2}
          color1="#ffffff"
          color2="#ffffff"
          color3="#ffffff"
          enableMouseInteraction={true}
          mouseInfluence={2.0}
        />
      )
    },
    {
      name: 'Threads',
      component: (
        <Threads
          color={[0.2, 0.6, 1.0]} // Vibrant blue color
          amplitude={1.5}
          distance={0.1}
          enableMouseInteraction={true}
        />
      )
    },
    {
      name: 'Light Rays',
      component: (
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      )
    },
    {
      name: 'Faulty Terminal',
      component: (
        <FaultyTerminal
          scale={1}
          gridMul={[2, 1]}
          digitSize={1.5}
          timeScale={0.3}
          pause={false}
          scanlineIntensity={0.3}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.2}
          tint="#ffffff"
          mouseReact={true}
          mouseStrength={0.2}
          pageLoadAnimation={true}
          brightness={1}
        />
      )
    }
  ], []);

  useEffect(() => {
    const currentDuration = backgrounds[currentBackground].duration || interval;
    
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      
      // After a short transition delay, change the background
      setTimeout(() => {
        setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
        setIsTransitioning(false);
      }, 300);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [currentBackground, interval, backgrounds]);

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Current Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <BackgroundErrorBoundary>
          <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
            {backgrounds[currentBackground].component}
          </Suspense>
        </BackgroundErrorBoundary>
      </div>

      {/* Background indicator */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 10,
          opacity: 0.7,
        }}
      >
        {backgrounds[currentBackground].name}
      </div>

      {/* Progress indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.3)',
          width: '100%',
          zIndex: 10,
        }}
      >
        <div 
          style={{
            height: '100%',
            background: '#00ffff',
            width: '0%', // This would need an animation loop to actually show progress
            transition: `width ${backgrounds[currentBackground].duration || interval}ms linear`
          }}
        />
      </div>
    </div>
  );
};

export default RotatingBackgrounds;
