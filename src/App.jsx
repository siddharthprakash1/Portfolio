import React, { useState, useEffect } from 'react';
import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Technologies from "./components/Technologies";
import LoadingScreen from './components/LoadingScreen';

export const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a delay for demonstration purposes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-x-hidden text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="fixed top-0 -z-10 h-full w-full">
            <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
            </div>
          </div>
          <div className="container mx-auto px-8">
            <Navbar />
            <Hero />
            <About />
            <Technologies />
            <Experience />
            <Projects />
            <Contact />
            
          </div>
        </>
      )}
    </div>
  );
};

export default App;