import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

export type MagicBentoProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string; // "132, 0, 255"
  clickEffect?: boolean;
  enableMagnetism?: boolean;
};

const defaultProps: Required<Pick<MagicBentoProps,
  'textAutoHide' | 'enableStars' | 'enableSpotlight' | 'enableBorderGlow' | 'disableAnimations' | 'spotlightRadius' | 'particleCount' | 'enableTilt' | 'glowColor' | 'clickEffect' | 'enableMagnetism'
>> = {
  textAutoHide: true,
  enableStars: true,
  enableSpotlight: true,
  enableBorderGlow: true,
  disableAnimations: false,
  spotlightRadius: 300,
  particleCount: 12,
  enableTilt: false,
  glowColor: '132, 0, 255',
  clickEffect: true,
  enableMagnetism: true,
};

export default function MagicBento(props: MagicBentoProps) {
  const {
    children,
    className,
    style,
    textAutoHide = defaultProps.textAutoHide,
    enableStars = defaultProps.enableStars,
    enableBorderGlow = defaultProps.enableBorderGlow,
    disableAnimations = defaultProps.disableAnimations,
    spotlightRadius = defaultProps.spotlightRadius,
    particleCount = defaultProps.particleCount,
    enableTilt = defaultProps.enableTilt,
    glowColor = defaultProps.glowColor,
    clickEffect = defaultProps.clickEffect,
    enableMagnetism = defaultProps.enableMagnetism,
  } = props;

  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = Math.max(0, Math.min(1, x / rect.width));
    const py = Math.max(0, Math.min(1, y / rect.height));

    el.style.setProperty('--glow-x', `${x}px`);
    el.style.setProperty('--glow-y', `${y}px`);
    el.style.setProperty('--glow-intensity', disableAnimations ? '0' : '1');
    el.style.setProperty('--glow-radius', `${spotlightRadius}px`);
    el.style.setProperty('--glow-color', glowColor);

    if (enableTilt && !disableAnimations) {
      const tiltX = (py - 0.5) * -6; // rotateX
      const tiltY = (px - 0.5) * 6;  // rotateY
      gsap.to(el, { rotateX: tiltX, rotateY: tiltY, duration: 0.2, ease: 'power2.out' });
    }

    if (enableMagnetism && !disableAnimations) {
      const tx = (px - 0.5) * 6;
      const ty = (py - 0.5) * 6;
      gsap.to(el, { x: tx, y: ty, duration: 0.2, ease: 'power2.out' });
    }
  }, [disableAnimations, spotlightRadius, glowColor, enableTilt, enableMagnetism]);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--glow-intensity', '0');
    if (!disableAnimations) {
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [disableAnimations]);

  const onClick = useCallback((e: React.MouseEvent) => {
    if (!clickEffect || disableAnimations) return;
    const el = cardRef.current;
    if (!el) return;
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.inset = '0';
    ripple.style.borderRadius = 'inherit';
    ripple.style.pointerEvents = 'none';
    ripple.style.background = `radial-gradient(${spotlightRadius}px circle at ${e.nativeEvent.offsetX}px ${e.nativeEvent.offsetY}px, rgba(${glowColor}, 0.25), transparent 60%)`;
    el.appendChild(ripple);
    gsap.to(ripple, { opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => ripple.remove() });
  }, [clickEffect, disableAnimations, spotlightRadius, glowColor]);

  return (
    <div
      ref={cardRef}
      className={[
        'card',
        textAutoHide ? 'card--text-autohide' : '',
        enableBorderGlow ? 'card--border-glow' : '',
        enableStars ? 'particle-container' : '',
        className || '',
      ].join(' ')}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* optional decorative particles */}
      {mounted && enableStars && !disableAnimations && Array.from({ length: particleCount }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            borderRadius: '50%',
            background: `rgba(${glowColor}, 0.35)`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}

      <div className="card__content">
        {children}
      </div>
    </div>
  );
}
