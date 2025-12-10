import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import profilePic from "../assets/Sid.jpg";
import resumeFile from "../assets/resume.pdf";
import { useSound } from '../context/SoundContext';

import Hero3D from './canvas/Hero3D';

const Hero = () => {
  const containerRef = useRef(null);
  const { playClick, playHover } = useSound();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToProjects = () => {
    playClick();
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  const name = "Siddharth";
  const nameArray = name.split("");

  return (
    <section ref={containerRef} id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <Hero3D />

      <motion.div
        style={{ y, opacity }}
        className="container-main w-full relative z-10"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Text */}
          <motion.div
            variants={itemVariants}
            className="order-2 lg:order-1"
          >
            <motion.div
              variants={itemVariants}
              className="section-label mb-6"
            >
              Software Engineer
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="block mb-2">Hi, I'm</span>
              <span className="flex flex-wrap gap-2">
                {nameArray.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="gradient-text"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </span>
            </h1>
            
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-400 max-w-lg leading-relaxed mb-8"
            >
              Building next-gen <span className="text-emerald-400 font-semibold">AI systems</span> at Couchbase. 
              2 IPs accepted at Keysight. I craft intelligent systems that push boundaries.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 sm:gap-4 mb-10"
            >
              <motion.button
                onClick={scrollToProjects}
                onMouseEnter={playHover}
                className="btn-primary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View Projects</span>
                <FaArrowDown className="text-xs" />
              </motion.button>
              
              <motion.a
                href={resumeFile}
                download="Siddharth_Prakash_Resume.pdf"
                onClick={playClick}
                onMouseEnter={playHover}
                className="btn-outline"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiDownload className="text-lg" />
                <span className="hidden sm:inline">Download CV</span>
                <span className="sm:hidden">CV</span>
              </motion.a>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6 sm:gap-10 pt-8 border-t border-white/10"
            >
              {[
                { value: '80+', label: 'Projects' },
                { value: '2', label: 'IPs Accepted' },
                { value: '471+', label: 'Automations' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <motion.div
                    className="text-2xl sm:text-3xl font-bold gradient-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Image */}
          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Animated glow rings */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              <motion.div
                className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={profilePic}
                  alt="Siddharth Prakash"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                
                {/* Animated scan line */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent"
                  animate={{
                    y: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 glass rounded-xl px-3 py-2 sm:px-4 sm:py-3 float"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="text-xs sm:text-sm text-gray-400">@ Couchbase</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={scrollToProjects}
          >
            <span className="text-xs text-gray-500 uppercase tracking-wider">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-emerald-500/50 flex justify-center pt-2">
              <motion.div
                className="w-1 h-2 bg-emerald-500 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
