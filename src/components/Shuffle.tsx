import { useRef, useEffect, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import './Shuffle.css';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface ShuffleProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  shuffleDirection?: 'left' | 'right';
  duration?: number;
  maxDelay?: number;
  ease?: string | ((t: number) => number);
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: CSSProperties['textAlign'];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: 'random' | 'evenodd';
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
}

const Shuffle = ({
  text,
  className = '',
  style = {},
  shuffleDirection = 'right',
  duration = 0.35,
  maxDelay = 0,
  ease = 'power3.out',
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  textAlign = 'center',
  onShuffleComplete,
  shuffleTimes = 1,
  animationMode = 'evenodd',
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = '',
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true
}: ShuffleProps) => {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const splitRef = useRef<GSAPSplitText | null>(null);
  const wrappersRef = useRef<HTMLElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const playingRef = useRef(false);
  const hoverHandlerRef = useRef<((e: Event) => void) | null>(null);

  useEffect(() => {
    if ('fonts' in document) {
      if (document.fonts.status === 'loaded') setFontsLoaded(true);
      else document.fonts.ready.then(() => setFontsLoaded(true));
    } else setFontsLoaded(true);
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (respectReducedMotion && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        onShuffleComplete?.();
        return;
      }

      const el = ref.current as HTMLElement;

      const startPct = (1 - threshold) * 100;
      const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || '');
      const mv = mm ? parseFloat(mm[1]) : 0;
      const mu = mm ? mm[2] || 'px' : 'px';
      const sign = mv === 0 ? '' : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
      const start = `top ${startPct}%${sign}`;

      const removeHover = () => {
        if (hoverHandlerRef.current && ref.current) {
          ref.current.removeEventListener('mouseenter', hoverHandlerRef.current);
          hoverHandlerRef.current = null;
        }
      };

      const teardown = () => {
        if (tlRef.current) {
          tlRef.current.kill();
          tlRef.current = null;
        }
        if (wrappersRef.current.length) {
          wrappersRef.current.forEach(wrap => {
            const inner = wrap.firstElementChild as HTMLElement | null;
            if (inner) {
              wrap.parentNode?.replaceChild(inner, wrap);
            }
          });
          wrappersRef.current = [];
        }
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
        removeHover();
      };

      const createAnimation = () => {
        if (playingRef.current) return;
        
        teardown();
        
        // Split text into characters
        splitRef.current = new GSAPSplitText(el, { type: 'chars' });
        const chars = splitRef.current.chars;
        
        if (!chars || chars.length === 0) return;

        // Create wrapper elements for each character
        wrappersRef.current = chars.map((char) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'shuffle-char-wrapper';
          wrapper.style.cssText = `
            position: relative;
            display: inline-block;
            overflow: hidden;
            vertical-align: top;
          `;
          
          const inner = document.createElement('div');
          inner.className = 'shuffle-char-inner';
          inner.textContent = char.textContent;
          inner.style.cssText = `
            position: relative;
            display: inline-block;
            transform: translateX(${shuffleDirection === 'right' ? '100%' : '-100%'});
          `;
          
          wrapper.appendChild(inner);
          char.parentNode?.replaceChild(wrapper, char);
          
          return wrapper;
        });

        // Create timeline
        tlRef.current = gsap.timeline({
          onComplete: () => {
            playingRef.current = false;
            onShuffleComplete?.();
            
            if (triggerOnHover && !loop) {
              hoverHandlerRef.current = () => {
                if (!playingRef.current) {
                  createAnimation();
                }
              };
              el.addEventListener('mouseenter', hoverHandlerRef.current);
            }
            
            if (loop) {
              gsap.delayedCall(loopDelay, createAnimation);
            }
          }
        });

        playingRef.current = true;

        // Animate each character
        wrappersRef.current.forEach((wrapper, i) => {
          const inner = wrapper.firstElementChild as HTMLElement;
          const originalChar = chars[i].textContent || '';
          
          let delay = 0;
          if (animationMode === 'evenodd') {
            delay = (i % 2) * stagger;
          } else if (animationMode === 'random') {
            delay = Math.random() * maxDelay;
          }

          // Scramble animation
          if (shuffleTimes > 0 && scrambleCharset) {
            for (let j = 0; j < shuffleTimes; j++) {
              const scrambleDelay = delay + (j * duration / shuffleTimes);
              const randomChar = scrambleCharset[Math.floor(Math.random() * scrambleCharset.length)];
              
              tlRef.current?.set(inner, {
                textContent: randomChar,
                delay: scrambleDelay
              });
            }
          }

          // Final reveal animation
          tlRef.current?.to(inner, {
            x: 0,
            duration: duration,
            ease: ease,
            delay: delay + (shuffleTimes * duration / shuffleTimes),
            onStart: () => {
              inner.textContent = originalChar;
            }
          }, 0);

          // Color animation if specified
          if (colorFrom && colorTo) {
            tlRef.current?.fromTo(inner, 
              { color: colorFrom },
              { 
                color: colorTo, 
                duration: duration,
                ease: ease,
                delay: delay + (shuffleTimes * duration / shuffleTimes)
              }, 
              0
            );
          }
        });
      };

      // Set up ScrollTrigger
      ScrollTrigger.create({
        trigger: el,
        start: start,
        onEnter: createAnimation,
        onEnterBack: !triggerOnce ? createAnimation : undefined
      });

      return teardown;
    },
    { dependencies: [text, fontsLoaded], scope: ref }
  );

  const commonProps = {
    ref: ref as any,
    className: `shuffle-component ${className}`,
    style: {
      textAlign,
      ...style,
    },
    children: text,
  };

  if (tag === 'h1') return <h1 {...commonProps} />;
  if (tag === 'h2') return <h2 {...commonProps} />;
  if (tag === 'h3') return <h3 {...commonProps} />;
  if (tag === 'h4') return <h4 {...commonProps} />;
  if (tag === 'h5') return <h5 {...commonProps} />;
  if (tag === 'h6') return <h6 {...commonProps} />;
  if (tag === 'span') return <span {...commonProps} />;
  return <p {...commonProps} />;
};

export default Shuffle;
