import { useState } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Photography from './components/Photography';
import Cursor from './components/ui/Cursor';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Loading screen logic could be enhanced to detect route changes if needed
  // For now, keeping the initial load
  
  if (loading) {
    return (
      <motion.div
        className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated rings */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          <motion.div
            className="absolute inset-0 border-2 border-emerald-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 border-2 border-cyan-500/30 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-4 border-2 border-emerald-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          >
            <motion.span
              className="text-2xl sm:text-3xl font-bold gradient-text"
              animate={{
                textShadow: [
                  '0 0 20px rgba(16, 185, 129, 0.5)',
                  '0 0 40px rgba(16, 185, 129, 0.8)',
                  '0 0 20px rgba(16, 185, 129, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SP
            </motion.span>
          </motion.div>
        </div>

        <motion.div
          className="mt-6 sm:mt-8 w-40 sm:w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            onAnimationComplete={() => setTimeout(() => setLoading(false), 300)}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-500 text-xs sm:text-sm tracking-widest uppercase"
        >
          Loading
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative cursor-none">
      <Cursor />
      <div className="scanline" />
      <div className="gradient-mesh" />
      
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-40 -right-40 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/3 -left-40 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-[120px]"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/5 rounded-full blur-[120px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>
      
      <Navbar />
      
      <main className="relative z-10">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/photography" element={<Photography />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
