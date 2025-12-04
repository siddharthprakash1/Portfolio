import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import IconCloud from './magicui/IconCloud';

const slugs = [
  "python",
  "javascript",
  "typescript",
  "react",
  "nodedotjs",
  "tensorflow",
  "pytorch",
  "openai",
  "docker",
  "kubernetes",
  "amazonaws",
  "googlecloud",
  "mongodb",
  "postgresql",
  "fastapi",
  "flask",
  "nextdotjs",
  "tailwindcss",
  "git",
  "linux",
];

const skills = [
  { name: 'AI/ML & LLM Systems', level: 95, description: 'LangChain, CrewAI, RAG, Agents' },
  { name: 'Backend Development', level: 90, description: 'Python, Node.js, FastAPI, Flask' },
  { name: 'Frontend Development', level: 85, description: 'React, Next.js, TypeScript' },
  { name: 'Cloud & DevOps', level: 82, description: 'AWS, GCP, Docker, Kubernetes' },
  { name: 'Protocol Engineering', level: 88, description: 'Wireshark, Network Analysis' },
];

const TechStack = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="technologies" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="section-label justify-center mb-4">Skills</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Tech <span className="gradient-text">Stack</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Skill Bars */}
              <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
                >
             <h3 className="text-2xl font-bold mb-8">Expertise</h3>
             <div className="space-y-6">
          {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ x: 10 }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-2">
                  <div className="flex-1">
                      <h4 className="text-white font-medium text-lg">{skill.name}</h4>
                      <p className="text-gray-500 text-sm">{skill.description}</p>
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-emerald-400 font-mono text-base"
                  >
                    {skill.level}%
                  </motion.span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1.5, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                  >
                    {/* Animated shine */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
            </div>
          </motion.div>

          {/* Right: 3D Cloud */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center relative"
          >
             <div className="relative w-full max-w-lg aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl" />
                <IconCloud iconSlugs={slugs} />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
