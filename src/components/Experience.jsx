import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GlitchText } from './ui/GlitchText';
import { Magnetic } from './ui/Magnetic';

const experiences = [
  {
    year: 'Oct 2024 — Present',
    role: 'Software Engineer',
    company: 'Couchbase',
    team: 'AI-as-a-Service Team',
    description: 'Building scalable agentic workflows and AI systems. Developing internal tools and automation pipelines.',
    technologies: ['LangChain', 'Python', 'Agentic AI', 'NoSQL'],
    current: true,
  },
  {
    year: 'Aug 2024 — Oct 2024',
    role: 'Software Engineer',
    company: 'Keysight Technologies',
    description: 'Converted from intern to full-time. Continued AI-driven analysis systems and protocol automation.',
    technologies: ['Python', 'Protocol Analysis', 'AI Systems'],
  },
  {
    year: 'Feb 2024 — Jun 2024',
    role: 'R&D Intern',
    company: 'Keysight Technologies',
    description: 'Built AI-powered analysis systems. Filed 2 IPs (both accepted). Automated 471+ protocol attributes.',
    technologies: ['Python', 'Wireshark', 'AI/ML', 'IP Filing'],
    highlight: '2 IPs Accepted',
  },
  {
    year: 'Jun 2023 — Aug 2023',
    role: 'Research Associate',
    company: 'STARC',
    description: 'Combined Monte Carlo simulations with ML to predict football outcomes. Analyzed 25,000+ matches.',
    technologies: ['Python', 'Machine Learning', 'Data Analysis'],
  },
];

const Experience = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="experience" className="py-16 sm:py-20 lg:py-24 relative">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <div className="section-label mb-4">Career</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <GlitchText text="Work" /> <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Animated timeline line */}
          <motion.div
            className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-cyan-500 to-transparent"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          <div className="space-y-6 sm:space-y-8">
            {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="relative pl-8 sm:pl-12 md:pl-24"
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-0 md:left-8 top-6 w-3 h-3 sm:w-4 sm:h-4 -translate-x-1/2 rounded-full bg-[#050505] border-2 border-emerald-500 z-10"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                  >
                    <motion.div
                      className="absolute inset-1 bg-emerald-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                  </motion.div>

                  <Magnetic>
                  <motion.div
                    whileHover={{ x: 10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="card p-5 sm:p-6 md:p-8 relative overflow-hidden group cursor-pointer"
                  >
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white"><GlitchText text={exp.role} /></h3>
                            {exp.current && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ delay: index * 0.15 + 0.2, type: 'spring' }}
                                className="text-xs bg-emerald-500 text-black px-2 py-1 rounded-full font-semibold"
                              >
                                Current
                              </motion.span>
                            )}
                            {exp.highlight && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ delay: index * 0.15 + 0.25, type: 'spring' }}
                                className="text-xs bg-cyan-500 text-black px-2 py-1 rounded-full font-semibold"
                              >
                                {exp.highlight}
                              </motion.span>
                            )}
                          </div>
                          <p className="text-emerald-400 text-sm sm:text-base font-mono">{exp.company}</p>
                          {exp.team && <p className="text-gray-500 text-xs sm:text-sm">{exp.team}</p>}
                        </div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : {}}
                          transition={{ delay: index * 0.15 + 0.1 }}
                          className="text-xs sm:text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full whitespace-nowrap font-mono"
                        >
                          {exp.year}
                        </motion.span>
                      </div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: index * 0.15 + 0.2 }}
                        className="text-gray-400 text-sm sm:text-base mb-4"
                      >
                        {exp.description}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: index * 0.15 + 0.3 }}
                        className="flex flex-wrap gap-2"
                      >
                        {exp.technologies.map((tech, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: index * 0.15 + 0.4 + i * 0.05 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="tag text-xs font-mono"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                  </Magnetic>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
