import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiOutlineMail, HiArrowRight } from 'react-icons/hi';
import Contact3D from './canvas/Contact3D';

const Contact = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const socials = [
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com/siddharthprakash1', color: '#6e5494' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/in/siddharth-prakash-771596241/', color: '#0077B5' },
    { name: 'Twitter', icon: FaXTwitter, href: 'https://x.com/_siddharth11_', color: '#1DA1F2' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/snapsidphotography/', color: '#E1306C' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <section ref={sectionRef} id="contact" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* 3D Background */}
      <Contact3D />
      
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      
      <div className="container-main">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div variants={itemVariants} className="section-label justify-center mb-4">
            Contact
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
          >
            Let's <span className="gradient-text">Connect</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto"
          >
            Interested in AI, open-source, or just want to chat? Let's talk!
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex justify-center mb-8 sm:mb-12"
        >
          <motion.a
            href="mailto:iamsid0011@gmail.com"
            className="group relative block w-full max-w-md"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-30 blur-lg"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <div className="relative glass rounded-2xl px-6 sm:px-8 py-5 sm:py-6 flex items-center gap-3 sm:gap-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <HiOutlineMail className="text-xl sm:text-2xl text-emerald-400" />
              </motion.div>
              <span className="text-base sm:text-xl font-semibold flex-1 text-center sm:text-left">
                iamsid0011@gmail.com
              </span>
              <motion.div
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <HiArrowRight className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </div>
          </motion.a>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex justify-center gap-3 sm:gap-4"
        >
          {socials.map((social, i) => (
            <motion.a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative group"
            >
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"
                style={{ backgroundColor: social.color }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 glass glass-hover rounded-xl flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                <social.icon size={20} className="sm:w-6 sm:h-6" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 sm:mt-24 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500"
        >
          <p>© {new Date().getFullYear()} Siddharth Prakash</p>
          <p>Built with React + Framer Motion</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
