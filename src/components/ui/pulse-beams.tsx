import React from 'react';
import { motion, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BeamPath {
  path: string;
  gradientConfig: {
    initial: { x1: string; x2: string; y1: string; y2: string };
    animate: {
      x1: string | string[];
      x2: string | string[];
      y1: string | string[];
      y2: string | string[];
    };
    transition?: Transition;
  };
  connectionPoints?: Array<{ cx: number; cy: number; r: number }>;
}

export interface PulseBeamsProps {
  children?: React.ReactNode;
  className?: string;
  background?: React.ReactNode;
  beams: BeamPath[];
  width?: number;
  height?: number;
  baseColor?: string;
  accentColor?: string;
  gradientColors?: { start: string; middle: string; end: string };
}

export const PULSE_BEAM_GRADIENT = {
  start: '#18CCFC',
  middle: '#6344F5',
  end: '#AE48FF',
};

/** Full beam paths from Pulse Beams demo — sized for 858×434 viewBox */
export const FREE_TRIAL_BEAMS: BeamPath[] = [
  {
    path: 'M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5',
    gradientConfig: {
      initial: { x1: '0%', x2: '0%', y1: '80%', y2: '100%' },
      animate: {
        x1: ['0%', '0%', '200%'],
        x2: ['0%', '0%', '180%'],
        y1: ['80%', '0%', '0%'],
        y2: ['100%', '20%', '20%'],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 0.3,
      },
    },
    connectionPoints: [
      { cx: 6.5, cy: 398.5, r: 6 },
      { cx: 269, cy: 220.5, r: 6 },
    ],
  },
  {
    path: 'M568 200H841C846.523 200 851 195.523 851 190V40',
    gradientConfig: {
      initial: { x1: '0%', x2: '0%', y1: '80%', y2: '100%' },
      animate: {
        x1: ['20%', '100%', '100%'],
        x2: ['0%', '90%', '90%'],
        y1: ['80%', '80%', '-20%'],
        y2: ['100%', '100%', '0%'],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 0.8,
      },
    },
    connectionPoints: [
      { cx: 851, cy: 34, r: 6.5 },
      { cx: 568, cy: 200, r: 6 },
    ],
  },
  {
    path: 'M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5',
    gradientConfig: {
      initial: { x1: '0%', x2: '0%', y1: '80%', y2: '100%' },
      animate: {
        x1: ['20%', '100%', '100%'],
        x2: ['0%', '90%', '90%'],
        y1: ['80%', '80%', '-20%'],
        y2: ['100%', '100%', '0%'],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 1.2,
      },
    },
    connectionPoints: [
      { cx: 142, cy: 427, r: 6.5 },
      { cx: 425.5, cy: 274, r: 6 },
    ],
  },
  {
    path: 'M493 274V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427',
    gradientConfig: {
      initial: { x1: '40%', x2: '50%', y1: '160%', y2: '180%' },
      animate: { x1: '0%', x2: '10%', y1: '-40%', y2: '-20%' },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 0.5,
      },
    },
    connectionPoints: [
      { cx: 770, cy: 427, r: 6.5 },
      { cx: 493, cy: 274, r: 6 },
    ],
  },
  {
    path: 'M380 168V17C380 11.4772 384.477 7 390 7H414',
    gradientConfig: {
      initial: { x1: '-40%', x2: '-10%', y1: '0%', y2: '20%' },
      animate: {
        x1: ['40%', '0%', '0%'],
        x2: ['10%', '0%', '0%'],
        y1: ['0%', '0%', '180%'],
        y2: ['20%', '20%', '200%'],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 1.6,
      },
    },
    connectionPoints: [
      { cx: 420.5, cy: 6.5, r: 6 },
      { cx: 380, cy: 168, r: 6 },
    ],
  },
];

const GradientColors = ({
  colors = PULSE_BEAM_GRADIENT,
}: {
  colors?: { start: string; middle: string; end: string };
}) => (
  <>
    <stop offset="0%" stopColor={colors.start} stopOpacity="0" />
    <stop offset="20%" stopColor={colors.start} stopOpacity="1" />
    <stop offset="50%" stopColor={colors.middle} stopOpacity="1" />
    <stop offset="100%" stopColor={colors.end} stopOpacity="0" />
  </>
);

function BeamSVG({
  beams,
  width,
  height,
  baseColor,
  accentColor,
  gradientColors,
}: {
  beams: BeamPath[];
  width: number;
  height: number;
  baseColor: string;
  accentColor: string;
  gradientColors?: { start: string; middle: string; end: string };
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex flex-shrink-0"
    >
      {beams.map((beam, index) => (
        <React.Fragment key={index}>
          <path d={beam.path} stroke={baseColor} strokeWidth="1" />
          <path
            d={beam.path}
            stroke={`url(#grad${index})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {beam.connectionPoints?.map((point, pointIndex) => (
            <circle
              key={`${index}-${pointIndex}`}
              cx={point.cx}
              cy={point.cy}
              r={point.r}
              fill={baseColor}
              stroke={accentColor}
            />
          ))}
        </React.Fragment>
      ))}
      <defs>
        {beams.map((beam, index) => (
          <motion.linearGradient
            key={index}
            id={`grad${index}`}
            gradientUnits="userSpaceOnUse"
            initial={beam.gradientConfig.initial}
            animate={beam.gradientConfig.animate}
            transition={beam.gradientConfig.transition}
          >
            <GradientColors colors={gradientColors} />
          </motion.linearGradient>
        ))}
      </defs>
    </svg>
  );
}

export function PulseBeams({
  children,
  className,
  background,
  beams,
  width = 858,
  height = 434,
  baseColor = '#1e293b',
  accentColor = '#475569',
  gradientColors = PULSE_BEAM_GRADIENT,
}: PulseBeamsProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center antialiased overflow-hidden',
        className
      )}
    >
      {background}
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <BeamSVG
          beams={beams}
          width={width}
          height={height}
          baseColor={baseColor}
          accentColor={accentColor}
          gradientColors={gradientColors}
        />
      </div>
    </div>
  );
}
