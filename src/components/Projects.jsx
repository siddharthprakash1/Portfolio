import { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { Magnetic } from './ui/Magnetic';
import { useSound } from '../context/SoundContext';
import project2 from "../assets/projects/compressed.gif";
import project5 from "../assets/projects/gifmaker_me.gif";
import project6 from "../assets/projects/dcgan.gif";
import project8 from "../assets/projects/gif2.gif";

// Using Unsplash images with appropriate themes for each project
const projectImages = {
  llama: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80',
  tournament: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80',
  gmail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&q=80',
  crypto: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&q=80',
};

const projects = [
  {
    title: 'LLaMA3.1-70B AI Content Curator for X',
    image: projectImages.llama,
    description: 'Advanced AI content curation system with 3 specialized CrewAI agents. Auto-discovers, analyzes, and shares GenAI content on Twitter/X.',
    technologies: ['LLaMA3-70B', 'Groq API', 'CrewAI', 'LangChain', 'Serper'],
    color: '#10b981',
    github: 'https://github.com/siddharthprakash1/TwitterBot_Newsletter',
  },
  {
    title: 'Neural Nexus: LLM Tournament Framework',
    image: projectImages.tournament,
    description: 'Strategic battle system pitting LLMs against each other in Othello. 95% uptime across 1,000+ test games with 8 model configs.',
    technologies: ['Groq', 'Google AI', 'Claude', 'Game Engine', 'Prompt Engineering'],
    color: '#06b6d4',
    github: 'https://github.com/siddharthprakash1/TransformerTournament',
  },
  {
    title: 'Project Gemini-Inbox: Intelligent Gmail Assistant',
    image: projectImages.gmail,
    description: 'AI-powered Gmail assistant using LangChain and Gemini Pro. Automated email management with web search via Serper API.',
    technologies: ['LangChain', 'Gemini Pro', 'Gmail API', 'Google Serper'],
    color: '#8b5cf6',
    github: 'https://github.com/siddharthprakash1/Project-Gemini-Inbox',
  },
  {
    title: 'Crypto Insights Dashboard',
    image: projectImages.crypto,
    description: 'Real-time crypto platform integrating 3 major APIs. AI sentiment analysis processing 1000+ daily news articles with 85% accuracy.',
    technologies: ['Flask', 'CryptoCompare', 'Gemini Pro', 'Sentiment Analysis'],
    color: '#f59e0b',
    github: 'https://github.com/siddharthprakash1/Crypto-Assisstant',
  },
  {
    title: 'MLTrader Pro: Intelligent Trading Bot',
    image: project5,
    description: 'Automated SPY ETF trading using FinBERT sentiment analysis of financial news. Improved trading accuracy by 40%.',
    technologies: ['FinBERT', 'Alpaca API', 'TensorFlow', 'Yahoo Finance'],
    color: '#ef4444',
    github: 'https://github.com/siddharthprakash1/TradingBot_',
  },
  {
    title: 'AlgoNavigator: Pathfinding Visualizer',
    image: project2,
    description: 'Interactive visualization tool for Dijkstra\'s and A* algorithms. Real-time grid-based animation for learning DSA.',
    technologies: ['React', 'Algorithms', 'CSS Animations', 'JavaScript'],
    color: '#3b82f6',
    github: 'https://github.com/siddharthprakash1/PathFinderVisualization',
  },
  {
    title: 'NumGen DCGAN: Digit Synthesis',
    image: project6,
    description: 'Generates realistic handwritten digits using Deep Convolutional GANs on MNIST dataset with visualization.',
    technologies: ['Python', 'TensorFlow', 'DCGAN', 'NumPy'],
    color: '#ec4899',
    github: 'https://github.com/siddharthprakash1/mnist_gan_project',
  },
  {
    title: 'GymGenie: Equipment Identifier',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&q=80',
    description: 'Identifies gym equipment with 92% accuracy using CNN and provides personalized exercise recommendations.',
    technologies: ['TensorFlow', 'Computer Vision', 'CNN', 'Manim'],
    color: '#14b8a6',
    github: 'https://github.com/siddharthprakash1/GymGenie',
  },
  {
    title: 'ShadowSpeak: Anonymous Chat Platform',
    image: project8,
    description: 'Real-time anonymous messaging app with Socket.IO. Supports both anonymous and named chat modes.',
    technologies: ['Socket.IO', 'JavaScript', 'WebSockets', 'Express'],
    color: '#6366f1',
    github: 'https://github.com/siddharthprakash1/ShadowSpeak',
  },
];

const ProjectCard = ({ project, index, isInView }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { playClick, playHover } = useSound();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleCardClick = () => {
    playClick();
    window.open(project.github, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setIsHovered(true); playHover(); }}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        cursor: 'pointer',
      }}
      className="card overflow-hidden group"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${project.color}, transparent)`,
            opacity: isHovered ? 0.6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Number badge */}
        <motion.div
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: project.color, color: '#050505' }}
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.2, rotate: 360 }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        {/* GitHub link on hover */}
        <motion.a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { e.stopPropagation(); playClick(); }}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaGithub size={16} />
        </motion.a>
      </div>

      <div className="p-4 sm:p-6" style={{ transform: "translateZ(20px)" }}>
        <motion.h3
          className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1"
          whileHover={{ x: 5 }}
        >
          {project.title}
        </motion.h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.technologies.slice(0, 4).map((tech, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 + 0.3 + i * 0.05 }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="tag text-xs"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { playClick, playHover } = useSound();

  return (
    <section ref={sectionRef} id="projects" className="py-16 sm:py-20 lg:py-24 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />
      
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          <div>
            <div className="section-label mb-4">Portfolio</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Featured <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-sm sm:text-base">
            Curated selection from <span className="text-emerald-400">80+ projects</span> showcasing AI, ML, and full-stack expertise.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <Magnetic key={index}>
            <ProjectCard
              project={project}
              index={index}
              isInView={isInView}
            />
            </Magnetic>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-10 sm:mt-12"
        >
          <motion.a
            href="https://github.com/siddharthprakash1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            onMouseEnter={playHover}
            className="btn-outline inline-flex"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All 80+ Projects</span>
            <FaExternalLinkAlt className="text-sm" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
