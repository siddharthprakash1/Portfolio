import React, { useEffect } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

export default function Cursor() {
  const cursorSize = 20;
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  const manageMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouse.x.set(clientX - cursorSize / 2);
    mouse.y.set(clientY - cursorSize / 2);
  };

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove);
    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
    };
  }, []);

  return (
    <motion.div
      style={{
        left: smoothMouse.x,
        top: smoothMouse.y,
        pointerEvents: "none",
        position: "fixed",
        zIndex: 9999,
      }}
      className="fixed w-5 h-5 bg-emerald-400 rounded-full mix-blend-difference pointer-events-none z-50"
    />
  );
}


