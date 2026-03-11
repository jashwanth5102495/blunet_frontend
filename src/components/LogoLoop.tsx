import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import './LogoLoop.css';

export interface LogoItem {
  node?: ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number | string;
  height?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const LogoLoop = ({
  logos,
  speed = 120,
  direction = 'up',
  width = '100%',
  height = '400px',
  logoHeight = 48,
  gap = 32,
  pauseOnHover = true,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  ariaLabel = 'AI Tools logos',
  className = '',
  style = {},
}: LogoLoopProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const isVertical = direction === 'up' || direction === 'down';
  const isReverse = direction === 'right' || direction === 'down';

  const animationDuration = logos.length * (logoHeight + gap) / Math.abs(speed);

  const handleLogoClick = (href?: string) => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const renderLogo = (logo: LogoItem, index: number) => {
    const logoElement = logo.node ? (
      <div className="logo-node" style={{ height: logoHeight }}>
        {logo.node}
      </div>
    ) : (
      <img
        src={logo.src}
        alt={logo.alt || `Logo ${index + 1}`}
        style={{ height: logoHeight }}
        className="logo-image"
      />
    );

    return (
      <div
        key={index}
        className={`logo-item ${scaleOnHover ? 'scale-on-hover' : ''} ${logo.href ? 'clickable' : ''}`}
        style={{
          marginBottom: isVertical ? gap : 0,
          marginRight: !isVertical ? gap : 0,
        }}
        onClick={() => handleLogoClick(logo.href)}
        title={logo.title}
      >
        {logoElement}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`logo-loop-container ${isVertical ? 'vertical' : 'horizontal'} ${className}`}
      style={{
        width,
        height: isVertical ? height : logoHeight,
        ...style,
      }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      aria-label={ariaLabel}
    >
      {fadeOut && (
        <>
          <div
            className={`fade-overlay fade-${isVertical ? 'top' : 'left'}`}
            style={{
              background: fadeOutColor
                ? `linear-gradient(${isVertical ? 'to bottom' : 'to right'}, ${fadeOutColor}, transparent)`
                : undefined,
            }}
          />
          <div
            className={`fade-overlay fade-${isVertical ? 'bottom' : 'right'}`}
            style={{
              background: fadeOutColor
                ? `linear-gradient(${isVertical ? 'to top' : 'to left'}, ${fadeOutColor}, transparent)`
                : undefined,
            }}
          />
        </>
      )}
      
      <div
        className={`logo-track ${isVertical ? 'vertical-track' : 'horizontal-track'}`}
        style={{
          animationDuration: `${animationDuration}s`,
          animationDirection: isReverse ? 'reverse' : 'normal',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {/* First set of logos */}
        {logos.map((logo, index) => renderLogo(logo, index))}
        {/* Duplicate set for seamless loop */}
        {logos.map((logo, index) => renderLogo(logo, index + logos.length))}
      </div>
    </div>
  );
};

export default LogoLoop;
