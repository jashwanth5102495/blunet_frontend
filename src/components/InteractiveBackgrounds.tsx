import { useState, useEffect } from 'react';

const InteractiveBackgrounds = () => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % 10);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const backgrounds = [
    // 1. Grid Distortion
    <div key="grid" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridDistort 8s ease-in-out infinite'
      }}></div>
    </div>,

    // 2. Floating Particles
    <div key="particles" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-blue-900/20"></div>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        ></div>
      ))}
    </div>,

    // 3. Wave Animation
    <div key="waves" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-purple-900/20"></div>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
        <path
          d="M0,400 Q300,200 600,400 T1200,400 V800 H0 Z"
          fill="rgba(99, 102, 241, 0.1)"
          className="animate-wave"
        />
        <path
          d="M0,450 Q300,250 600,450 T1200,450 V800 H0 Z"
          fill="rgba(139, 92, 246, 0.08)"
          className="animate-wave-reverse"
        />
      </svg>
    </div>,

    // 4. Hexagon Pattern
    <div key="hexagon" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-bl from-emerald-900/20 to-teal-900/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        animation: 'hexagonMove 12s linear infinite'
      }}></div>
    </div>,

    // 5. Spiral Galaxy
    <div key="spiral" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 border border-purple-400/20 rounded-full animate-spin-slow"></div>
        <div className="absolute w-72 h-72 border border-pink-400/20 rounded-full animate-spin-reverse"></div>
        <div className="absolute w-48 h-48 border border-violet-400/20 rounded-full animate-spin-slow"></div>
      </div>
    </div>,

    // 6. Matrix Rain
    <div key="matrix" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black/40"></div>
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-px bg-gradient-to-b from-green-400/60 to-transparent"
          style={{
            left: `${i * 7}%`,
            height: '100%',
            animation: `matrixRain ${2 + Math.random() * 3}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        ></div>
      ))}
    </div>,

    // 7. Geometric Shapes
    <div key="geometric" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/20 to-red-900/20"></div>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute border border-orange-400/20"
          style={{
            width: `${50 + Math.random() * 100}px`,
            height: `${50 + Math.random() * 100}px`,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `geometricFloat ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        ></div>
      ))}
    </div>,

    // 8. Neural Network
    <div key="neural" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20"></div>
      <svg className="absolute inset-0 w-full h-full">
        {[...Array(12)].map((_, i) => (
          <g key={i}>
            <circle
              cx={`${20 + (i % 4) * 25}%`}
              cy={`${20 + Math.floor(i / 4) * 30}%`}
              r="3"
              fill="rgba(34, 211, 238, 0.4)"
              className="animate-pulse"
            />
            {i < 8 && (
              <line
                x1={`${20 + (i % 4) * 25}%`}
                y1={`${20 + Math.floor(i / 4) * 30}%`}
                x2={`${20 + ((i + 1) % 4) * 25}%`}
                y2={`${20 + Math.floor((i + 1) / 4) * 30}%`}
                stroke="rgba(34, 211, 238, 0.2)"
                strokeWidth="1"
                className="animate-pulse"
              />
            )}
          </g>
        ))}
      </svg>
    </div>,

    // 9. Liquid Morphing
    <div key="liquid" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-bl from-violet-900/20 to-fuchsia-900/20"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 bg-violet-400/10 rounded-full animate-morph"></div>
        <div className="absolute w-60 h-60 bg-fuchsia-400/10 rounded-full animate-morph-reverse"></div>
      </div>
    </div>,

    // 10. Code Stream
    <div key="code" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-gray-900/20"></div>
      <div className="absolute inset-0 font-mono text-xs text-blue-400/20 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute whitespace-nowrap"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${i * 5}%`,
              animation: `codeStream ${8 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            {`const ${['data', 'user', 'api', 'config'][Math.floor(Math.random() * 4)]} = {}`}
          </div>
        ))}
      </div>
    </div>
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {backgrounds[currentBg]}
    </div>
  );
};

export default InteractiveBackgrounds;
