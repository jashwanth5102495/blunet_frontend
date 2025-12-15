'use client';

import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion';

interface ResponsiveImage {
  src: string;
  alt?: string;
  srcSet?: string;
}

interface AnimationConfig {
  preview?: boolean;
  scale: number; // 1-100
  speed: number; // 1-100
}

interface NoiseConfig {
  opacity: number; // 0-1
  scale: number; // 1-100
}

interface ShadowOverlayProps {
  type?: 'preset' | 'custom';
  presetIndex?: number;
  customImage?: ResponsiveImage;
  sizing?: 'fill' | 'stretch';
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  blendMode?: CSSProperties['mixBlendMode'];
  style?: CSSProperties;
  className?: string;
  mask?: 'none' | 'radials';
}

function mapRange(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
  if (fromLow === fromHigh) return toLow;
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
  const id = useId();
  const cleanId = (id || '').replace(/:/g, '');
  return `shadowoverlay-${cleanId}`;
};

export default function EtheralShadow({
  sizing = 'fill',
  color = 'rgba(128, 128, 128, 0.25)',
  animation = { scale: 60, speed: 40 },
  noise = { opacity: 0.0, scale: 40 },
  blendMode = 'soft-light',
  style,
  className,
  customImage,
  mask = 'radials',
}: ShadowOverlayProps) {
  const id = useInstanceId();
  const animationEnabled = !!animation && animation.scale > 0;
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const hueRotateMotionValue = useMotionValue(180);
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);

  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

  useEffect(() => {
    if (feColorMatrixRef.current && animationEnabled) {
      if (hueRotateAnimation.current) hueRotateAnimation.current.stop();
      hueRotateMotionValue.set(0);
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        ease: 'linear',
        delay: 0,
        onUpdate: (value: number) => {
          if (feColorMatrixRef.current) {
            feColorMatrixRef.current.setAttribute('values', String(value));
          }
        },
      });
      return () => {
        if (hueRotateAnimation.current) hueRotateAnimation.current.stop();
      };
    }
  }, [animationEnabled, animationDuration, hueRotateMotionValue]);

  const baseFrequencyX = mapRange(animation.scale, 0, 100, 0.001, 0.0005);
  const baseFrequencyY = mapRange(animation.scale, 0, 100, 0.004, 0.002);

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        ...(style || {}),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${id}) blur(4px)` : 'none',
          background: color,
          opacity: 0.55,
          mixBlendMode: blendMode,
          ...(mask === 'none'
            ? {}
            : {
                WebkitMaskImage:
                  customImage?.src ||
                  'radial-gradient(60% 40% at 20% 30%, black 0%, transparent 60%), radial-gradient(40% 60% at 80% 70%, black 0%, transparent 60%)',
                maskImage:
                  customImage?.src ||
                  'radial-gradient(60% 40% at 20% 30%, black 0%, transparent 60%), radial-gradient(40% 60% at 80% 70%, black 0%, transparent 60%)',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskSize: sizing === 'stretch' ? '100% 100%' : 'cover',
                maskSize: sizing === 'stretch' ? '100% 100%' : 'cover',
              }),
        }}
      />

      {animationEnabled && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
          <defs>
            <filter id={id}>
              <feTurbulence
                result="undulation"
                numOctaves={2}
                baseFrequency={`${baseFrequencyX},${baseFrequencyY}`}
                seed={0}
                type="turbulence"
              />
              <feColorMatrix ref={feColorMatrixRef} in="undulation" type="hueRotate" values="180" />
              <feColorMatrix
                in="dist"
                result="circulation"
                type="matrix"
                values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
              />
              <feDisplacementMap in="SourceGraphic" in2="circulation" scale={displacementScale} result="dist" />
              <feDisplacementMap in="dist" in2="undulation" scale={displacementScale} />
            </filter>
          </defs>
        </svg>
      )}
    </div>
  );
}