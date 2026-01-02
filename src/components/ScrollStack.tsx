import React, { ReactNode, useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number; // px between cards
  itemScale?: number; // scale delta per card depth
  itemStackDistance?: number; // px vertical offset per card depth
  stackPosition?: string; // e.g., '20%'
  scaleEndPosition?: string; // e.g., '10%'
  baseScale?: number; // base scale for top card
  scaleDuration?: number; // not used, reserved
  rotationAmount?: number; // degrees per depth
  blurAmount?: number; // px blur per depth
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, string>());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current!;
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-end') as HTMLElement)
      : (scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement);
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    let topCardIndex = 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      // Determine which card is currently at the top of the stack
      if (scrollTop >= triggerStart) {
        topCardIndex = i;
      }

      // Blur cards deeper in stack if configured
      let blur = 0;
      if (blurAmount && i < topCardIndex) {
        const depthInStack = topCardIndex - i;
        blur = Math.max(0, depthInStack * blurAmount);
      }

      // Pin cards between start and end, otherwise let them flow
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      const translateY = isPinned ? 0 : Math.max(0, triggerStart - scrollTop);

      const transform = `translateY(${translateY}px) scale(${scale.toFixed(3)}) rotate(${rotation.toFixed(3)}deg)`;
      const last = lastTransformsRef.current.get(i);
      if (last !== transform) {
        card.style.transform = transform;
        card.style.filter = blur ? `blur(${blur}px)` : 'none';
        card.style.zIndex = String(cardsRef.current.length - i); // top card higher z-index
        lastTransformsRef.current.set(i, transform);
      }
    });

    // Call stack complete once last card reaches end
    if (!stackCompletedRef.current && cardsRef.current.length) {
      const lastCard = cardsRef.current[cardsRef.current.length - 1];
      if (lastCard) {
        const lastTop = getElementOffset(lastCard);
        if (scrollTop > lastTop) {
          stackCompletedRef.current = true;
          if (onStackComplete) onStackComplete();
        }
      }
    }

    isUpdatingRef.current = false;
  }, [calculateProgress, getScrollData, getElementOffset, parsePercentage, stackPosition, scaleEndPosition, baseScale, itemScale, itemStackDistance, rotationAmount, blurAmount, onStackComplete, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current!;

    // Collect card elements
    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    cardsRef.current = cards;

    // Optional: initialize Lenis for smooth scrolling (window scroll only)
    if (useWindowScroll) {
      try {
        lenisRef.current = new Lenis({});
        const raf = (time: number) => {
          lenisRef.current?.raf(time);
          animationFrameRef.current = requestAnimationFrame(raf);
        };
        animationFrameRef.current = requestAnimationFrame(raf);
      } catch {
        // Lenis is optional
      }
    }

    const onScroll = () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
    };

    const onResize = () => {
      lastTransformsRef.current.clear();
      updateCardTransforms();
    };

    if (useWindowScroll) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
    } else {
      scroller.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
    }

    // Initial layout
    updateCardTransforms();

    return () => {
      if (useWindowScroll) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      } else {
        scroller.removeEventListener('scroll', onScroll as any);
        window.removeEventListener('resize', onResize);
      }
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lenisRef.current?.destroy();
    };
  }, [updateCardTransforms, useWindowScroll]);

  return (
    <div
      ref={scrollerRef}
      className={`scroll-stack ${className}`.trim()}
      style={{
        // Allow cards to define sticky top using CSS var
        // Cards use position: sticky; top: var(--stack-position);
        // Container controls scrolling context
        overflowY: useWindowScroll ? 'visible' : 'auto',
        maxHeight: useWindowScroll ? 'none' : '100vh'
      }}
    >
      {/* Spacing before first card */}
      <div style={{ height: itemDistance / 2 }} />
      {children}
      {/* End sentinel for stack calculations */}
      <div className="scroll-stack-end" style={{ height: itemDistance }} />
    </div>
  );
};

export default ScrollStack;