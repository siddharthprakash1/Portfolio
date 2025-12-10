import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import aboutImg from "../assets/p2.webp";

const About = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  const highlights = [
    'AI-as-a-Service',
    'Protocol Engineering', 
    'Agentic Workflows',
    'Lead Photographer'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section ref={sectionRef} id="about" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container-main">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
          {/* Image */}
          <motion.div
            variants={itemVariants}
            className="relative order-2 lg:order-1"
          >
            <motion.div
              style={{ y: imageY, opacity: imageOpacity }}
              className="relative"
            >
              {/* Animated border */}
              <motion.div
                className="absolute -inset-4 border border-emerald-500/30 rounded-2xl"
                animate={{
                  borderColor: [
                    'rgba(16, 185, 129, 0.3)',
                    'rgba(6, 182, 212, 0.3)',
                    'rgba(16, 185, 129, 0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="relative rounded-xl overflow-hidden">
                <motion.img
                  src={aboutImg}
                  alt="About"
                  className="w-full h-auto"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                
                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0 shimmer"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </div>
            </motion.div>
            
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 glass rounded-xl p-3 sm:p-4 float"
            >
              <div className="text-2xl sm:text-3xl font-bold gradient-text">1.5</div>
              <div className="text-xs sm:text-sm text-gray-500">Years Exp</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2"
          >
            <motion.div
              variants={itemVariants}
              className="section-label mb-4"
            >
              About Me
            </motion.div>
            
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            >
              Crafting <span className="gradient-text">Intelligent</span> Systems
            </motion.h2>
            
            <motion.div
              variants={itemVariants}
              className="space-y-4 text-gray-400 text-base sm:text-lg leading-relaxed mb-8"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
              >
                Software Engineer at <span className="text-emerald-400 font-semibold">Couchbase</span> working on AI-as-a-Service. 
                I build scalable agentic workflows and automation pipelines.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
              >
                At Keysight, I <span className="text-emerald-400 font-semibold">filed 2 IPs (both accepted)</span> and automated 471+ protocol attributes. 
                I'm passionate about building systems that think.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                Beyond code, I run <span className="text-emerald-400 font-semibold">SnapSid Photography</span> and have led 
                sponsorship teams procuring 10+ lakhs for events.
              </motion.p>
            </motion.div>

            {/* Highlights grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="glass glass-hover rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
                >
                  <motion.div
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                  <span className="text-xs sm:text-sm text-gray-300">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
