import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../context/SoundContext';

// Konami Code sequence: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

// Confetti particle component
const ConfettiParticle = ({ delay, color, startX }) => {
  const randomX = startX + (Math.random() - 0.5) * 200;
  const randomRotation = Math.random() * 720 - 360;
  const duration = 2 + Math.random() * 2;
  
  return (
    <motion.div
      initial={{ 
        x: startX, 
        y: -20, 
        rotate: 0,
        opacity: 1,
        scale: 1
      }}
      animate={{ 
        x: randomX, 
        y: window.innerHeight + 100,
        rotate: randomRotation,
        opacity: [1, 1, 0],
        scale: [1, 1.2, 0.5]
      }}
      transition={{ 
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="fixed pointer-events-none z-[10000]"
      style={{
        width: Math.random() * 10 + 8,
        height: Math.random() * 10 + 8,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  );
};

// Star burst effect
const StarBurst = ({ x, y }) => {
  const stars = Array.from({ length: 8 }, (_, i) => ({
    angle: (i * 45) * (Math.PI / 180),
    id: i
  }));

  return (
    <>
      {stars.map(star => (
        <motion.div
          key={star.id}
          initial={{ x, y, scale: 0, opacity: 1 }}
          animate={{ 
            x: x + Math.cos(star.angle) * 100,
            y: y + Math.sin(star.angle) * 100,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed pointer-events-none z-[10000]"
          style={{
            width: 20,
            height: 20,
          }}
        >
          <svg viewBox="0 0 24 24" fill="#fbbf24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      ))}
    </>
  );
};

const KonamiCode = () => {
  const [inputSequence, setInputSequence] = useState([]);
  const [isActivated, setIsActivated] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [starBurst, setStarBurst] = useState(null);
  const { playClick } = useSound();

  // Colors for confetti
  const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6'];

  const triggerCelebration = useCallback(() => {
    setIsActivated(true);
    setShowMessage(true);
    playClick?.();

    // Create star burst at center
    setStarBurst({ 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2,
      id: Date.now()
    });

    // Create confetti particles
    const newConfetti = [];
    for (let i = 0; i < 150; i++) {
      newConfetti.push({
        id: i,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        startX: Math.random() * window.innerWidth,
      });
    }
    setConfetti(newConfetti);

    // Play celebration sounds
    if (playClick) {
      setTimeout(() => playClick(), 100);
      setTimeout(() => playClick(), 200);
      setTimeout(() => playClick(), 300);
    }

    // Clear after animation
    setTimeout(() => {
      setConfetti([]);
      setStarBurst(null);
    }, 4000);

    setTimeout(() => {
      setShowMessage(false);
      setIsActivated(false);
    }, 5000);
  }, [playClick, colors]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.code;
      
      setInputSequence(prev => {
        const newSequence = [...prev, key].slice(-KONAMI_CODE.length);
        
        // Check if sequence matches
        if (newSequence.length === KONAMI_CODE.length) {
          const isMatch = newSequence.every((k, i) => k === KONAMI_CODE[i]);
          if (isMatch && !isActivated) {
            setTimeout(triggerCelebration, 0);
            return [];
          }
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActivated, triggerCelebration]);

  return (
    <>
      {/* Confetti */}
      <AnimatePresence>
        {confetti.map(particle => (
          <ConfettiParticle
            key={particle.id}
            delay={particle.delay}
            color={particle.color}
            startX={particle.startX}
          />
        ))}
      </AnimatePresence>

      {/* Star burst */}
      <AnimatePresence>
        {starBurst && <StarBurst key={starBurst.id} x={starBurst.x} y={starBurst.y} />}
      </AnimatePresence>

      {/* Secret message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center pointer-events-none"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full scale-150" />
              
              {/* Message card */}
              <motion.div
                initial={{ rotateY: -90 }}
                animate={{ rotateY: 0 }}
                transition={{ delay: 0.2, type: 'spring', damping: 20 }}
                className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-8 sm:p-12 text-center shadow-2xl"
                style={{
                  boxShadow: '0 0 60px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-[-50%] bg-gradient-conic from-emerald-500 via-transparent to-emerald-500 opacity-20"
                  />
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', damping: 10 }}
                  className="text-6xl sm:text-7xl mb-4"
                >
                  🎮
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-2"
                >
                  <span className="gradient-text">Achievement Unlocked!</span>
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-emerald-400 font-mono text-sm sm:text-base mb-4"
                >
                  ↑ ↑ ↓ ↓ ← → ← → B A
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-400 text-sm"
                >
                  You found the secret! You're a true gamer 🕹️
                </motion.p>

                {/* Floating particles around the card */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.sin(i) * 10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                    style={{
                      left: `${10 + i * 15}%`,
                      top: i % 2 === 0 ? '-10px' : 'auto',
                      bottom: i % 2 === 1 ? '-10px' : 'auto',
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint in corner with tooltip - hidden on mobile (no keyboard) */}
      <div className="hidden md:block fixed bottom-4 left-4 z-50 group">
        {/* Tooltip */}
        <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
          <div className="bg-gray-900/95 backdrop-blur-sm border border-emerald-500/30 rounded-lg px-3 py-2 whitespace-nowrap">
            <p className="text-emerald-400 text-xs font-medium flex items-center gap-2">
              <span className="text-base">🎮</span>
              Type this on your keyboard!
            </p>
            <p className="text-gray-500 text-[10px] mt-1">Secret easter egg</p>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute left-4 -bottom-1 w-2 h-2 bg-gray-900/95 border-r border-b border-emerald-500/30 transform rotate-45" />
        </div>
        
        {/* The code hint */}
        <motion.div
          className="cursor-pointer flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">⌨️</span>
          <span className="text-gray-600 group-hover:text-emerald-400 text-xs font-mono select-none transition-all duration-300 opacity-40 group-hover:opacity-100">
            ↑↑↓↓←→←→BA
          </span>
        </motion.div>
      </div>
    </>
  );
};

export default KonamiCode;

