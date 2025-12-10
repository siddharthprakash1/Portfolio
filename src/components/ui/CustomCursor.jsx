import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

// Particle component for trail effect
const Particle = ({ x, y, id, onComplete }) => {
  return (
    <motion.div
      initial={{ scale: 1, opacity: 0.6 }}
      animate={{ scale: 0, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-[9998]"
      style={{
        left: x,
        top: y,
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

// Click ripple effect
const ClickRipple = ({ x, y, onComplete }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-[9997]"
      style={{
        left: x,
        top: y,
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: '2px solid rgba(16, 185, 129, 0.6)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring animation for outer ring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);
  
  const particleIdRef = useRef(0);
  const lastParticleTime = useRef(0);
  const rippleIdRef = useRef(0);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setIsVisible(true);
    
    // Add particle trail (throttled)
    const now = Date.now();
    if (now - lastParticleTime.current > 30) {
      lastParticleTime.current = now;
      const id = particleIdRef.current++;
      setParticles(prev => [...prev.slice(-15), { id, x: e.clientX, y: e.clientY }]);
    }
  }, [cursorX, cursorY]);

  // Remove particle
  const removeParticle = useCallback((id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  // Remove ripple
  const removeRipple = useCallback((id) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  }, []);

  // Click handler
  const handleClick = useCallback((e) => {
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 150);
    
    // Add ripple effect
    const id = rippleIdRef.current++;
    setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
  }, []);

  // Mouse leave/enter
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);

  // Hover detection for interactive elements
  useEffect(() => {
    const handleElementHover = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, .card, .btn, .btn-primary, .btn-outline, [data-cursor="pointer"]'
      );
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    // Run after a short delay to catch dynamically rendered elements
    const timeout = setTimeout(handleElementHover, 100);
    
    // Re-run on DOM changes
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  // Event listeners
  useEffect(() => {
    if (isMobile) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = 'auto';
    };
  }, [isMobile, handleMouseMove, handleClick, handleMouseLeave, handleMouseEnter]);

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Particle trail */}
      <AnimatePresence>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            id={particle.id}
            onComplete={() => removeParticle(particle.id)}
          />
        ))}
      </AnimatePresence>

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <ClickRipple
            key={ripple.id}
            x={ripple.x}
            y={ripple.y}
            onComplete={() => removeRipple(ripple.id)}
          />
        ))}
      </AnimatePresence>

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          width: isHovering ? 50 : 40,
          height: isHovering ? 50 : 40,
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div 
          className="absolute rounded-full border-2"
          style={{
            width: '100%',
            height: '100%',
            borderColor: isHovering ? '#10b981' : 'rgba(255, 255, 255, 0.5)',
            transform: 'translate(-50%, -50%)',
            transition: 'border-color 0.2s ease',
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          width: isHovering ? 8 : 6,
          height: isHovering ? 8 : 6,
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 1.5 : 1,
        }}
        transition={{ duration: 0.1 }}
      >
        <div 
          className="absolute rounded-full"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: isHovering ? '#10b981' : '#ffffff',
            transform: 'translate(-50%, -50%)',
            boxShadow: isHovering ? '0 0 15px rgba(16, 185, 129, 0.8)' : 'none',
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;

