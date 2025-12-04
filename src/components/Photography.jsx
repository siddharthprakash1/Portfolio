import React, { useRef, useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaExpand } from 'react-icons/fa';

// Import all images from Photography folder
const imageModules = import.meta.glob('../assets/Photography/*.{jpeg,jpg,png,JPEG,JPG,PNG}', { eager: true });
const imageUrls = Object.values(imageModules).map(img => img.default);

// Component to render a single image with proper aspect ratio
const PhotoFrame = ({ url, index, total, onSelect, isIdle }) => {
  const meshRef = useRef();
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [imageAspect, setImageAspect] = useState(1);
  
  // Load texture
  const texture = useTexture(url);
  
  // Calculate aspect ratio from the loaded texture
  useEffect(() => {
    if (texture && texture.image) {
      const aspect = texture.image.width / texture.image.height;
      setImageAspect(aspect);
    }
  }, [texture]);

  // Calculate position in a spiral/helix pattern
  const angle = (index / total) * Math.PI * 4;
  const radius = 8;
  const heightSpread = 25;
  
  const basePosition = useMemo(() => {
    const x = Math.cos(angle) * radius;
    const y = (index / total) * heightSpread - heightSpread / 2;
    const z = Math.sin(angle) * radius;
    return [x, y, z];
  }, [angle, radius, index, total, heightSpread]);

  // Rotation to face center
  const rotation = useMemo(() => {
    return [0, -angle + Math.PI / 2, 0];
  }, [angle]);

  // Dynamic size based on aspect ratio
  const size = useMemo(() => {
    const baseSize = 2.5;
    if (imageAspect > 1) {
      return [baseSize * Math.min(imageAspect, 1.8), baseSize, 0.05];
    } else {
      return [baseSize, baseSize / Math.max(imageAspect, 0.5), 0.05];
    }
  }, [imageAspect]);

  useFrame((state) => {
    if (meshRef.current) {
      // Idle floating animation
      const idleOffset = isIdle ? Math.sin(state.clock.elapsedTime * 0.3 + index * 0.5) * 0.3 : 0;
      const hoverOffset = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
      
      meshRef.current.position.x = basePosition[0] + (isIdle ? Math.sin(state.clock.elapsedTime * 0.2 + index) * 0.2 : 0);
      meshRef.current.position.y = basePosition[1] + hoverOffset + idleOffset;
      meshRef.current.position.z = basePosition[2] + (isIdle ? Math.cos(state.clock.elapsedTime * 0.2 + index) * 0.2 : 0);
      
      // Scale on hover
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Subtle rotation when idle
      if (isIdle) {
        meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.1 + index) * 0.05;
      }
    }

    // Frame glow animation
    if (frameRef.current) {
      frameRef.current.material.opacity = hovered 
        ? 0.8 + Math.sin(state.clock.elapsedTime * 5) * 0.2 
        : 0;
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onSelect(url, imageAspect);
  };

  return (
    <group rotation={rotation}>
      <mesh
        ref={meshRef}
        position={basePosition}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial 
          map={texture} 
          emissive={hovered ? "#00ff88" : "#000000"}
          emissiveIntensity={hovered ? 0.4 : 0}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Glowing frame effect */}
      <mesh ref={frameRef} position={[basePosition[0], basePosition[1], basePosition[2] - 0.03]}>
        <boxGeometry args={[size[0] + 0.15, size[1] + 0.15, 0.02]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0} />
      </mesh>
    </group>
  );
};

// Camera rig that follows scroll and has idle animation
const CameraRig = ({ scrollProgress, isIdle }) => {
  const { camera } = useThree();
  const idleTime = useRef(0);
  
  useFrame((state, delta) => {
    // Move camera along the Y axis based on scroll
    const targetY = scrollProgress * 25 - 12.5;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    
    // Idle camera movement - gentle orbit
    if (isIdle) {
      idleTime.current += delta;
      const idleOrbitRadius = 2;
      const idleSpeed = 0.15;
      
      camera.position.x = Math.sin(idleTime.current * idleSpeed) * idleOrbitRadius;
      camera.position.z = 15 + Math.cos(idleTime.current * idleSpeed) * idleOrbitRadius;
      
      // Look at center
      camera.lookAt(0, camera.position.y, 0);
    } else {
      // Reset to default position when not idle
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 15, 0.05);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, -0.1, 0.05);
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, 0, 0.05);
    }
  });
  
  return null;
};

// Floating particles with idle animation
const Particles = ({ isIdle }) => {
  const particlesRef = useRef();
  const count = 300;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      // Faster rotation when idle
      const speed = isIdle ? 0.08 : 0.02;
      particlesRef.current.rotation.y = state.clock.elapsedTime * speed;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={isIdle ? 0.08 : 0.05} 
        color="#00ff88" 
        transparent 
        opacity={isIdle ? 0.8 : 0.6} 
        sizeAttenuation 
      />
    </points>
  );
};

// Animated rings
const AnimatedRings = ({ isIdle }) => {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((state) => {
    const speed = isIdle ? 1 : 0.3;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      ring1Ref.current.rotation.y = state.clock.elapsedTime * speed * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -state.clock.elapsedTime * speed * 0.15;
      ring2Ref.current.rotation.z = state.clock.elapsedTime * speed * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = state.clock.elapsedTime * speed * 0.25;
      ring3Ref.current.rotation.z = -state.clock.elapsedTime * speed * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[12, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[10, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[14, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

// Main 3D Scene
const Scene = ({ scrollProgress, isIdle, onSelectImage }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={1} color="#00f3ff" />
      <pointLight position={[0, 0, 0]} intensity={isIdle ? 2 : 0.5} color="#00ff88" distance={20} />
      
      <CameraRig scrollProgress={scrollProgress} isIdle={isIdle} />
      <Particles isIdle={isIdle} />
      <AnimatedRings isIdle={isIdle} />
      
      <Suspense fallback={null}>
        {imageUrls.map((url, index) => (
          <PhotoFrame 
            key={index} 
            url={url} 
            index={index} 
            total={imageUrls.length}
            onSelect={onSelectImage}
            isIdle={isIdle}
          />
        ))}
      </Suspense>
      
      {/* Central glowing core - pulses when idle */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[isIdle ? 0.7 : 0.5, 32, 32]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={isIdle ? 0.5 : 0.3} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[isIdle ? 1 : 0.7, 32, 32]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} wireframe />
      </mesh>
      
      {/* Wireframe tunnel effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6, 6, 50, 32, 1, true]} />
        <meshBasicMaterial color="#00ff88" wireframe transparent opacity={isIdle ? 0.1 : 0.05} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};

// Lightbox Modal Component
const Lightbox = ({ imageUrl, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl cursor-pointer"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full border border-emerald-500/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors z-10"
      >
        <FaTimes size={20} />
      </motion.button>

      {/* Image container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative max-w-[90vw] max-h-[85vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing border */}
        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-lg opacity-50 blur-sm animate-pulse" />
        
        {/* Image */}
        <img
          src={imageUrl}
          alt="Full view"
          className="relative rounded-lg shadow-2xl object-contain max-w-[90vw] max-h-[85vh]"
          style={{
            boxShadow: '0 0 60px rgba(0, 255, 136, 0.3)',
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500 rounded-br-lg" />
      </motion.div>

      {/* Instructions */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-sm font-mono"
      >
        [ CLICK ANYWHERE TO CLOSE ]
      </motion.p>
    </motion.div>
  );
};

const Photography = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const idleTimeoutRef = useRef(null);

  // Idle detection
  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 3000); // 3 seconds of inactivity
  }, []);

  // Handle wheel scroll directly
  useEffect(() => {
    const handleWheel = (e) => {
      resetIdleTimer();
      setScrollProgress(prev => {
        const delta = e.deltaY * 0.0005;
        return Math.max(0, Math.min(1, prev + delta));
      });
    };

    const handleMouseMove = () => {
      resetIdleTimer();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start idle timer
    resetIdleTimer();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [resetIdleTimer]);

  const handleSelectImage = useCallback((url, aspect) => {
    setSelectedImage({ url, aspect });
  }, []);

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox 
            imageUrl={selectedImage.url} 
            onClose={handleCloseLightbox}
          />
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-24 left-6 z-50"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-emerald-400 hover:text-white transition-colors group"
        >
          <motion.div
            whileHover={{ x: -5 }}
            className="w-10 h-10 rounded-full border border-emerald-500/50 flex items-center justify-center group-hover:bg-emerald-500/20"
          >
            <FaArrowLeft />
          </motion.div>
          <span className="hidden sm:inline font-mono text-sm">BACK</span>
        </Link>
      </motion.div>

      {/* Header */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center w-full pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            <span className="gradient-text">Visual</span> <span className="text-white">Chronicles</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto px-4 text-sm md:text-base font-mono">
            [ SCROLL TO EXPLORE • CLICK TO VIEW FULL ]
          </p>
        </motion.div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block pointer-events-none">
        <div className="h-40 w-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="w-full bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <p className="text-emerald-400 text-xs font-mono mt-2 text-center">
          {Math.round(scrollProgress * 100)}%
        </p>
      </div>

      {/* Image Counter */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
        <p className="text-gray-500 font-mono text-xs">
          <span className="text-emerald-400">{imageUrls.length}</span> FRAMES
        </p>
      </div>

      {/* Click hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 text-gray-500 pointer-events-none"
      >
        <FaExpand className="text-emerald-400" />
        <span className="font-mono text-xs">CLICK IMAGE FOR FULL VIEW</span>
      </motion.div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, -12.5, 15], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene 
            scrollProgress={scrollProgress} 
            isIdle={isIdle}
            onSelectImage={handleSelectImage}
          />
        </Canvas>
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-60" />
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 scanline opacity-20" />
    </div>
  );
};

export default Photography;
