'use client';
import { useEffect, useRef, useState } from 'react';

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

function HeroSplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update custom cursor position
    const updateCursorPosition = (x: number, y: number) => {
      const heroSection = document.querySelector('#hero-section') as HTMLElement;
      if (heroSection) {
        heroSection.style.setProperty('--cursor-x', x + 'px');
        heroSection.style.setProperty('--cursor-y', y + 'px');
      }
    };

    // Check if mouse is over Hero section
    const checkIfInHeroSection = (e: MouseEvent) => {
      const heroSection = document.querySelector('#hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
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
        if (isInSection) {
          updateCursorPosition(e.clientX, e.clientY);
        }
      }
    };

    // Add global mouse move listener
    document.addEventListener('mousemove', checkIfInHeroSection);

    if (!isActive) {
      return () => {
        document.removeEventListener('mousemove', checkIfInHeroSection);
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

    // Generate colors that work well with dithered background
    const generateColor = () => {
      const colors = [
        '#ffffff', // White
        '#00ff41', // Matrix green
        '#61dca3', // Mint green
        '#61b3dc', // Light blue
        '#ff6b6b', // Coral red
        '#4ecdc4', // Teal
        '#45b7d1', // Sky blue
        '#96ceb4', // Sage green
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Create particles with enhanced effects
    const createParticles = (x: number, y: number, count: number = 20) => {
      const rect = canvas.getBoundingClientRect();
      const canvasX = x - rect.left;
      const canvasY = y - rect.top;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const velocity = Math.random() * 3 + 1;
        
        particlesRef.current.push({
          x: canvasX,
          y: canvasY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          maxLife: Math.random() * 80 + 40,
          color: generateColor(),
          size: Math.random() * 8 + 4
        });
      }
    };

    // Update particles
    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99; // Friction
        particle.vy *= 0.99;
        particle.life -= 1 / particle.maxLife;
        particle.size *= 0.98;
        
        return particle.life > 0 && particle.size > 0.5;
      });
    };

    // Render particles with enhanced effects
    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        const alpha = particle.life;
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Create glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        
        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add inner bright core
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
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
      
      if (speed > 3) { // Only create particles when moving fast enough
        createParticles(e.clientX, e.clientY, Math.min(Math.floor(speed / 4), 12));
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (!isActive) return;
      createParticles(e.clientX, e.clientY, 25);
    };

    const handleClick = (e: MouseEvent) => {
      if (!isActive) return;
      createParticles(e.clientX, e.clientY, 40);
    };

    // Initialize
    resizeCanvas();
    animate();

    // Add event listeners
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    
    // Add enter event to hero section specifically
    const heroSection = document.querySelector('#hero-section') as HTMLElement | null;
    if (heroSection) {
      heroSection.addEventListener('mouseenter', handleMouseEnter as EventListener);
    }

    return () => {
      document.removeEventListener('mousemove', checkIfInHeroSection);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
      if (heroSection) {
        heroSection.removeEventListener('mouseenter', handleMouseEnter as EventListener);
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive]);

  return (
    <div className={`fixed top-0 left-0 z-50 w-full h-full transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
        style={{ 
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}

export default HeroSplashCursor;
