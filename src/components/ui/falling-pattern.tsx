'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type FallingPatternProps = React.ComponentProps<'div'> & {
  color?: string;
  backgroundColor?: string;
  duration?: number;
  blurIntensity?: string;
  density?: number;
  variant?: 'mixed' | 'dots';
};

function parsePxPair(pair: string) {
  const [xRaw, yRaw] = pair.trim().split(/\s+/);
  const x = Number.parseFloat((xRaw || '0').replace('px', ''));
  const y = Number.parseFloat((yRaw || '0').replace('px', ''));
  return { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 };
}

function parsePxSize(size: string) {
  const [wRaw, hRaw] = size.trim().split(/\s+/);
  const w = Number.parseFloat((wRaw || '0').replace('px', ''));
  const h = Number.parseFloat((hRaw || '0').replace('px', ''));
  return { w: Number.isFinite(w) ? w : 0, h: Number.isFinite(h) ? h : 0 };
}

export function FallingPattern({
  color = 'var(--primary)',
  backgroundColor = 'var(--background)',
  duration = 150,
  blurIntensity = '1em',
  density = 1,
  variant = 'mixed',
  className,
  style,
  ...props
}: FallingPatternProps) {
  const patterns = [
    `radial-gradient(4px 100px at 0px 235px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 235px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 117.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 252px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 252px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 126px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 150px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 150px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 75px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 253px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 253px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 126.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 204px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 204px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 102px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 134px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 134px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 67px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 179px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 179px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 89.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 299px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 299px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 149.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 215px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 215px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 107.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 281px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 281px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 140.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 158px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 158px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 79px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 210px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 210px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 105px, ${color} 100%, transparent 150%)`,
  ];

  const backgroundImage =
    variant === 'dots' ? patterns.filter((p) => p.includes('1.5px 1.5px')).join(', ') : patterns.join(', ');

  const baseSizes = [
    235, 235, 235, 252, 252, 252, 150, 150, 150, 253, 253, 253, 204, 204, 204, 134, 134, 134, 179, 179, 179,
    299, 299, 299, 215, 215, 215, 281, 281, 281, 158, 158, 158, 210, 210, 210,
  ].map((h) => `300px ${h}px`);

  const baseStartPositions =
    '0px 220px, 3px 220px, 151.5px 337.5px, 25px 24px, 28px 24px, 176.5px 150px, 50px 16px, 53px 16px, 201.5px 91px, 75px 224px, 78px 224px, 226.5px 230.5px, 100px 19px, 103px 19px, 251.5px 121px, 125px 120px, 128px 120px, 276.5px 187px, 150px 31px, 153px 31px, 301.5px 120.5px, 175px 235px, 178px 235px, 326.5px 384.5px, 200px 121px, 203px 121px, 351.5px 228.5px, 225px 224px, 228px 224px, 376.5px 364.5px, 250px 26px, 253px 26px, 401.5px 105px, 275px 75px, 278px 75px, 426.5px 180px';

  const safeDensity = Number.isFinite(density) && density > 0 ? density : 1;
  const scaleFactor = 1 / safeDensity;

  const backgroundSizes = baseSizes
    .map((size) => {
      const { w, h } = parsePxSize(size);
      return `${w * scaleFactor}px ${h * scaleFactor}px`;
    })
    .join(', ');

  const startPositions = baseStartPositions
    .split(',')
    .map((pair) => {
      const { x, y } = parsePxPair(pair);
      return `${x * scaleFactor}px ${y * scaleFactor}px`;
    })
    .join(', ');

  const endPositions = baseStartPositions
    .split(',')
    .map((pair) => {
      const { x, y } = parsePxPair(pair);
      return `${x * scaleFactor}px ${(y * scaleFactor + 7000) * safeDensity}px`;
    })
    .join(', ');

  const blurNumeric = Number.parseFloat(blurIntensity);
  const renderBlurOverlay = Number.isFinite(blurNumeric) ? blurNumeric > 0 : blurIntensity.trim() !== '0';

  return (
    <div
      {...props}
      className={cn('relative overflow-hidden', className)}
      style={{
        backgroundColor,
        ...(style || {}),
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage,
          backgroundSize: backgroundSizes,
          backgroundPosition: startPositions,
          backgroundRepeat: 'repeat',
        }}
        animate={{ backgroundPosition: endPositions }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
      {renderBlurOverlay && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blurIntensity})`,
            WebkitBackdropFilter: `blur(${blurIntensity})`,
          }}
        />
      )}
    </div>
  );
}
