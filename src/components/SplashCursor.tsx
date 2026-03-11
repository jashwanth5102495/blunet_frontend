'use client';
import { useEffect, useRef, useState } from 'react';

interface SplashCursorProps {
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  COLOR_UPDATE_SPEED?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

function SplashCursor({
  SPLAT_RADIUS = 50,
  SPLAT_FORCE = 0.5,
  COLOR_UPDATE_SPEED = 10,
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update cursor position
    const updateCursorPosition = (x: number, y: number) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = x + 'px';
        cursorRef.current.style.top = y + 'px';
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = x + 'px';
        cursorDotRef.current.style.top = y + 'px';
      }
    };

    // Check if mouse is over technology stack section
    const checkIfInTechSection = (e: MouseEvent) => {
      const techSection = document.querySelector('.splash-cursor');
      if (techSection) {
        const rect = techSection.getBoundingClientRect();
        const isInSection = e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        setIsActive(isInSection);

        // Update mouse position
        mouseRef.current.prevX = mouseRef.current.x;
        mouseRef.current.prevY = mouseRef.current.y;
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;

        // Update cursor position
        updateCursorPosition(e.clientX, e.clientY);
      }
    };

    // Add global mouse move listener
    document.addEventListener('mousemove', checkIfInTechSection);

    if (!isActive) {
      return () => {
        document.removeEventListener('mousemove', checkIfInTechSection);
      };
    }

    // Resize canvas to match display size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    // Generate random color
    const generateColor = () => {
      const colors = [
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#06B6D4', // Cyan
        '#10B981', // Emerald
        '#F59E0B', // Amber
        '#EF4444', // Red
        '#EC4899', // Pink
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Create particles
    const createParticles = (x: number, y: number, count: number = 15) => {
      const rect = canvas.getBoundingClientRect();
      const canvasX = x - rect.left;
      const canvasY = y - rect.top;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const velocity = Math.random() * SPLAT_FORCE + 1;

        particlesRef.current.push({
          x: canvasX,
          y: canvasY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          maxLife: Math.random() * 60 + 30,
          color: generateColor(),
          size: Math.random() * SPLAT_RADIUS + 10
        });
      }
    };

    // Update particles
    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98; // Friction
        particle.vy *= 0.98;
        particle.life -= 1 / particle.maxLife;
        particle.size *= 0.99;

        return particle.life > 0 && particle.size > 0.5;
      });
    };

    // Render particles
    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        const alpha = particle.life;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = particle.color;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      updateParticles();
      renderParticles();
      animationId = requestAnimationFrame(animate);
    };

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return;

      const deltaX = e.clientX - mouseRef.current.prevX;
      const deltaY = e.clientY - mouseRef.current.prevY;
      const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Add hover class to cursor when moving over tech cards
      const target = e.target as HTMLElement;
      const isOverTechCard = target.closest('.tech-card');

      if (cursorRef.current) {
        if (isOverTechCard) {
          cursorRef.current.classList.add('hover');
        } else {
          cursorRef.current.classList.remove('hover');
        }
      }

      if (speed > 2) { // Only create particles when moving fast enough
        createParticles(e.clientX, e.clientY, Math.min(Math.floor(speed / 3), 8));
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (!isActive) return;
      createParticles(e.clientX, e.clientY, 20);
    };

    const handleClick = (e: MouseEvent) => {
      if (!isActive) return;
      createParticles(e.clientX, e.clientY, 30);
    };

    // Initialize
    resizeCanvas();
    animate();

    // Add event listeners
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    // Add enter event to tech section specifically
    const techSection = document.querySelector('.splash-cursor') as HTMLElement | null;
    if (techSection) {
      techSection.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      document.removeEventListener('mousemove', checkIfInTechSection);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
      if (techSection) {
        techSection.removeEventListener('mouseenter', handleMouseEnter);
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, SPLAT_RADIUS, SPLAT_FORCE, COLOR_UPDATE_SPEED]);

  return (
    <>
      {/* Custom cursor elements */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isActive ? 'active' : ''}`}
      />
      <div
        ref={cursorDotRef}
        className={`custom-cursor-dot ${isActive ? 'active' : ''}`}
      />

      {/* Particle canvas */}
      <div className={`fixed top-0 left-0 z-50 w-full h-full transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{
            mixBlendMode: 'screen'
          }}
        />
      </div>
    </>
  );
}

export default SplashCursor;
