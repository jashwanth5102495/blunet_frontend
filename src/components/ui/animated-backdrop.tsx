import React from 'react';

type AnimatedBackdropProps = {
  src?: string;
  className?: string;
  dark?: boolean;
  opacity?: number; // base opacity for the first layer
};

/**
 * AnimatedBackdrop renders three drifting layers of a background image using Tailwind keyframes.
 * It relies on Tailwind animations: animate-flow, animate-flowRev, animate-flow-slow.
 */
export default function AnimatedBackdrop({
  src = '/img/bg.png',
  className = '',
  dark = true,
  opacity = 0.25,
}: AnimatedBackdropProps) {
  const blend = dark ? 'mix-blend-screen' : 'mix-blend-multiply';

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* Layer 1 */}
      <div
        className={`absolute inset-0 bg-center bg-cover ${blend} animate-flow`}
        style={{ backgroundImage: `url('${src}')`, opacity: opacity }}
      />
      {/* Layer 2 (reverse drift) */}
      <div
        className={`absolute inset-0 bg-center bg-cover ${blend} animate-flowRev`}
        style={{ backgroundImage: `url('${src}')`, opacity: opacity * 0.7 }}
      />
      {/* Layer 3 (slow drift for depth) */}
      <div
        className={`absolute inset-0 bg-center bg-cover ${blend} animate-flow-slow`}
        style={{ backgroundImage: `url('${src}')`, opacity: opacity * 0.5 }}
      />
    </div>
  );
}