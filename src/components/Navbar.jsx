import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaBars, FaTimes } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'hero', name: 'Home', path: '/' },
  { id: 'about', name: 'About', path: '/#about' },
  { id: 'technologies', name: 'Skills', path: '/#technologies' },
  { id: 'experience', name: 'Experience', path: '/#experience' },
  { id: 'projects', name: 'Projects', path: '/#projects' },
  { id: 'photography', name: 'Photography', path: '/photography' },
  { id: 'contact', name: 'Contact', path: '/#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Only update active section on home page
      if (location.pathname === '/') {
        const sections = navItems.filter(item => item.path.startsWith('/#')).map(item => item.id);
        const scrollPosition = window.scrollY + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section && section.offsetTop <= scrollPosition) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const scrollTo = (id, path) => {
    setMobileMenuOpen(false);
    
    // If it's a hash link and we are on home page, scroll
    if (path.startsWith('/#') && location.pathname === '/') {
      const elementId = path.replace('/#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(elementId);
      }
    } else if (path === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Otherwise the Link component handles navigation, we just wait for route change
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="container-main">
          <div className={`flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl transition-all duration-300 ${
            scrolled ? 'glass' : ''
          }`}>
            {/* Logo */}
            <Link
              to="/"
              onClick={() => scrollTo('hero', '/')}
              className="text-xl sm:text-2xl font-bold gradient-text"
            >
              SP
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => scrollTo(item.id, item.path)}
                  className={`relative text-sm transition-colors uppercase tracking-wider ${
                    (location.pathname === item.path || (location.pathname === '/' && activeSection === item.id)) 
                    ? 'text-emerald-400' 
                    : 'text-gray-400 hover:text-emerald-400'
                  }`}
                >
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.name}
                  </motion.span>
                  {(location.pathname === item.path || (location.pathname === '/' && activeSection === item.id)) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              {[
                { icon: FaGithub, href: 'https://github.com/siddharthprakash1', color: '#6e5494' },
                { icon: FaLinkedin, href: 'https://www.linkedin.com/in/siddharth-prakash-771596241/', color: '#0077B5' },
                { icon: FaXTwitter, href: 'https://x.com/_siddharth11_', color: '#1DA1F2' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-emerald-400 transition-colors"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.2, rotate: 5, color: social.color }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <FaTimes size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <FaBars size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-[#0a0a0a] border-l border-white/10 z-50 md:hidden overflow-y-auto"
            >
              <div className="flex flex-col items-center gap-8 py-24 px-6">
                {navItems.map((item, i) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => scrollTo(item.id, item.path)}
                    className={`text-2xl font-bold transition-colors ${
                      (location.pathname === item.path || (location.pathname === '/' && activeSection === item.id)) 
                      ? 'text-emerald-400' 
                      : 'text-white'
                    }`}
                  >
                    <motion.span
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                ))}
                
                <div className="flex items-center gap-6 mt-8">
                  {[
                    { icon: FaGithub, href: 'https://github.com/siddharthprakash1' },
                    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/siddharth-prakash-771596241/' },
                    { icon: FaXTwitter, href: 'https://x.com/_siddharth11_' },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon size={24} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
