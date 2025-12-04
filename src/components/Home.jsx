import React from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import About from './About';
import TechStack from './TechStack';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';

const Home = () => {
  return (
    <>
      <Hero />
      
      <div className="container-main">
        <motion.hr
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
        />
      </div>
      
      <About />
      
      <div className="container-main">
        <motion.hr
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        />
      </div>
      
      <TechStack />
      
      <div className="container-main">
        <motion.hr
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
        />
      </div>
      
      <Experience />
      
      <div className="container-main">
        <motion.hr
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        />
      </div>
      
      <Projects />
      
      <div className="container-main">
        <motion.hr
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
        />
      </div>
      
      <Contact />
    </>
  );
};

export default Home;

