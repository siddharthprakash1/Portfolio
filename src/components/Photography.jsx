import React, { useRef, useState, useEffect, useMemo, Suspense, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaExpand } from 'react-icons/fa';
import { useSound } from '../context/SoundContext';

// Try to import WebP images first, fallback to JPEG
const webpModules = import.meta.glob('../assets/Photography-webp/*.webp', { 
  eager: false,
  import: 'default' 
});
const jpegModules = import.meta.glob('../assets/Photography/*.{jpeg,jpg,png,JPEG,JPG,PNG}', { 
  eager: false,
  import: 'default' 
});

// Use WebP if available, otherwise fallback to JPEG
const imageModules = Object.keys(webpModules).length > 0 ? webpModules : jpegModules;
const imageKeys = Object.keys(imageModules);

// Hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Responsive scene configuration
const getSceneConfig = (isMobile) => ({
  radius: isMobile ? 5 : 8,
  heightSpread: isMobile ? 20 : 25,
  baseSize: isMobile ? 1.8 : 2.5,
  cameraZ: isMobile ? 12 : 15,
  fov: isMobile ? 75 : 60,
  particleCount: isMobile ? 80 : 150,
  ringScales: isMobile ? [8, 6.5, 9.5] : [12, 10, 14],
  tunnelRadius: isMobile ? 4 : 6,
});

// Loading placeholder component
const LoadingPlaceholder = memo(({ position, rotation, size }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group rotation={rotation}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color="#00ff88" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
});

// Component to render a single image with proper aspect ratio - memoized for performance
const PhotoFrame = memo(({ url, index, total, onSelect, isIdle, isVisible, config }) => {
  const meshRef = useRef();
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [imageAspect, setImageAspect] = useState(1);
  const [textureError, setTextureError] = useState(false);
  
  const { radius, heightSpread, baseSize } = config;
  
  // Only load texture if visible
  const texture = useTexture(
    isVisible ? url : '/placeholder.svg',
    (loadedTexture) => {
      // Optimize texture settings
      if (loadedTexture) {
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.generateMipmaps = false;
      }
    },
    undefined,
    (error) => {
      console.warn(`Failed to load texture for image ${index}:`, error);
      setTextureError(true);
    }
  );
  
  // Calculate aspect ratio from the loaded texture
  useEffect(() => {
    if (texture && texture.image && isVisible) {
      const aspect = texture.image.width / texture.image.height;
      setImageAspect(aspect);
    }
  }, [texture, isVisible]);

  // Calculate position in a spiral/helix pattern
  const angle = (index / total) * Math.PI * 4;
  
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
    if (imageAspect > 1) {
      return [baseSize * Math.min(imageAspect, 1.8), baseSize, 0.05];
    } else {
      return [baseSize, baseSize / Math.max(imageAspect, 0.5), 0.05];
    }
  }, [imageAspect, baseSize]);

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
    if (isVisible && !textureError) {
      onSelect(url, imageAspect);
    }
  };

  if (textureError) {
    return <LoadingPlaceholder position={basePosition} rotation={rotation} size={size} />;
  }

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
});

// Lazy loaded photo frame wrapper
const LazyPhotoFrame = memo(({ imageKey, index, total, onSelect, isIdle, scrollProgress, config }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { radius, heightSpread, baseSize } = config;
  
  // Calculate if this image should be visible based on scroll progress
  const normalizedIndex = index / total;
  const viewportRange = 0.3; // Load images within 30% of viewport
  const isVisible = Math.abs(normalizedIndex - scrollProgress) < viewportRange || scrollProgress === 0;
  
  // Lazy load the image URL when visible
  useEffect(() => {
    if (isVisible && !imageUrl) {
      const loadImage = async () => {
        try {
          const module = await imageModules[imageKey]();
          setImageUrl(module);
          setIsLoading(false);
        } catch (error) {
          console.warn(`Failed to load image ${imageKey}:`, error);
          setIsLoading(false);
        }
      };
      loadImage();
    }
  }, [isVisible, imageKey, imageUrl]);

  // Calculate position for placeholder
  const angle = (index / total) * Math.PI * 4;
  const basePosition = useMemo(() => [
    Math.cos(angle) * radius,
    (index / total) * heightSpread - heightSpread / 2,
    Math.sin(angle) * radius
  ], [angle, index, total, radius, heightSpread]);
  const rotation = useMemo(() => [0, -angle + Math.PI / 2, 0], [angle]);
  const size = [baseSize, baseSize, 0.05];

  if (!imageUrl || isLoading) {
    return <LoadingPlaceholder position={basePosition} rotation={rotation} size={size} />;
  }

  return (
    <PhotoFrame 
      url={imageUrl}
      index={index}
      total={total}
      onSelect={onSelect}
      isIdle={isIdle}
      isVisible={isVisible}
      config={config}
    />
  );
});

// Camera rig that follows scroll and has idle animation
const CameraRig = ({ scrollProgress, isIdle, config }) => {
  const { camera } = useThree();
  const idleTime = useRef(0);
  const { heightSpread, cameraZ } = config;
  
  useFrame((state, delta) => {
    // Move camera along the Y axis based on scroll
    const targetY = scrollProgress * heightSpread - heightSpread / 2;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    
    // Idle camera movement - gentle orbit
    if (isIdle) {
      idleTime.current += delta;
      const idleOrbitRadius = 1.5;
      const idleSpeed = 0.15;
      
      camera.position.x = Math.sin(idleTime.current * idleSpeed) * idleOrbitRadius;
      camera.position.z = cameraZ + Math.cos(idleTime.current * idleSpeed) * idleOrbitRadius;
      
      // Look at center
      camera.lookAt(0, camera.position.y, 0);
    } else {
      // Reset to default position when not idle
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraZ, 0.05);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, -0.1, 0.05);
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, 0, 0.05);
    }
  });
  
  return null;
};

// Floating particles with idle animation - reduced count for performance
const Particles = memo(({ isIdle, config }) => {
  const particlesRef = useRef();
  const count = config.particleCount;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
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
});

// Animated rings
const AnimatedRings = memo(({ isIdle, config }) => {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const [r1, r2, r3] = config.ringScales;

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
        <torusGeometry args={[r1, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[r2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[r3, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.15} />
      </mesh>
    </group>
  );
});

// Animated central core - always moving for better UX
const AnimatedCore = memo(({ isIdle }) => {
  const coreRef = useRef();
  const outerRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Inner core - continuous pulsing and floating
    if (coreRef.current) {
      // Breathing scale animation
      const baseScale = isIdle ? 0.7 : 0.5;
      const scaleOffset = Math.sin(time * 2) * 0.15 + Math.sin(time * 3.7) * 0.05;
      coreRef.current.scale.setScalar(baseScale + scaleOffset);
      
      // Subtle position wobble
      coreRef.current.position.x = Math.sin(time * 1.2) * 0.1;
      coreRef.current.position.y = Math.cos(time * 0.8) * 0.15;
      coreRef.current.position.z = Math.sin(time * 1.5) * 0.1;
      
      // Opacity pulse
      coreRef.current.material.opacity = (isIdle ? 0.5 : 0.3) + Math.sin(time * 2.5) * 0.15;
    }
    
    // Outer wireframe - rotation and scale
    if (outerRef.current) {
      const outerBaseScale = isIdle ? 1 : 0.7;
      const outerScaleOffset = Math.sin(time * 1.5 + 1) * 0.1;
      outerRef.current.scale.setScalar(outerBaseScale + outerScaleOffset);
      
      // Continuous rotation
      outerRef.current.rotation.x = time * 0.3;
      outerRef.current.rotation.y = time * 0.2;
      outerRef.current.rotation.z = Math.sin(time * 0.5) * 0.3;
      
      // Follow core position slightly
      outerRef.current.position.x = Math.sin(time * 1.2) * 0.05;
      outerRef.current.position.y = Math.cos(time * 0.8) * 0.08;
    }
    
    // Glow ring
    if (glowRef.current) {
      glowRef.current.rotation.z = time * 0.5;
      glowRef.current.scale.setScalar(1.2 + Math.sin(time * 2) * 0.2);
      glowRef.current.material.opacity = 0.1 + Math.sin(time * 3) * 0.05;
    }
  });

  return (
    <group>
      {/* Inner glowing core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
      </mesh>
      
      {/* Outer wireframe sphere */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.15} wireframe />
      </mesh>
      
      {/* Glow ring */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.02, 16, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.1} />
      </mesh>
    </group>
  );
});

// Error boundary for 3D scene
class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-emerald-400">
          <div className="text-center">
            <p className="text-lg font-mono mb-2">[ SCENE LOADING ERROR ]</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="text-sm underline hover:text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main 3D Scene - with lazy loading
const Scene = memo(({ scrollProgress, isIdle, onSelectImage, config }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={1} color="#00f3ff" />
      <pointLight position={[0, 0, 0]} intensity={isIdle ? 2 : 0.5} color="#00ff88" distance={20} />
      
      <CameraRig scrollProgress={scrollProgress} isIdle={isIdle} config={config} />
      <Particles isIdle={isIdle} config={config} />
      <AnimatedRings isIdle={isIdle} config={config} />
      
      <Suspense fallback={null}>
        {imageKeys.map((imageKey, index) => (
          <LazyPhotoFrame 
            key={imageKey} 
            imageKey={imageKey}
            index={index} 
            total={imageKeys.length}
            onSelect={onSelectImage}
            isIdle={isIdle}
            scrollProgress={scrollProgress}
            config={config}
          />
        ))}
      </Suspense>
      
      {/* Animated central core - always moving */}
      <AnimatedCore isIdle={isIdle} />
      
      {/* Wireframe tunnel effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[config.tunnelRadius, config.tunnelRadius, 40, 32, 1, true]} />
        <meshBasicMaterial color="#00ff88" wireframe transparent opacity={isIdle ? 0.1 : 0.05} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
});

// Lightbox Modal Component with lazy image loading
const Lightbox = ({ imageUrl, onClose, playClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClose = () => {
    playClick();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl cursor-pointer"
      onClick={handleClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={handleClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-emerald-500/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors z-10"
      >
        <FaTimes size={16} className="sm:hidden" />
        <FaTimes size={20} className="hidden sm:block" />
      </motion.button>

      {/* Loading indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Image container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
        animate={{ scale: 1, opacity: imageLoaded ? 1 : 0, rotateY: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative max-w-[95vw] max-h-[80vh] sm:max-w-[90vw] sm:max-h-[85vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing border */}
        <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-lg opacity-50 blur-sm animate-pulse" />
        
        {/* Image */}
        <img
          src={imageUrl}
          alt="Full view"
          className="relative rounded-lg shadow-2xl object-contain max-w-[95vw] max-h-[80vh] sm:max-w-[90vw] sm:max-h-[85vh]"
          style={{
            boxShadow: '0 0 60px rgba(0, 255, 136, 0.3)',
          }}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Corner accents - hidden on very small screens */}
        <div className="hidden sm:block absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500 rounded-tl-lg" />
        <div className="hidden sm:block absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500 rounded-tr-lg" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500 rounded-bl-lg" />
        <div className="hidden sm:block absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500 rounded-br-lg" />
      </motion.div>

      {/* Instructions */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-xs sm:text-sm font-mono"
      >
        [ TAP TO CLOSE ]
      </motion.p>
    </motion.div>
  );
};

const Photography = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const idleTimeoutRef = useRef(null);
  const touchStartY = useRef(0);
  const lastTouchY = useRef(0);
  
  const isMobile = useIsMobile();
  const sceneConfig = useMemo(() => getSceneConfig(isMobile), [isMobile]);
  const { playClick, playHover } = useSound();

  // Preload first batch of images during loading screen
  useEffect(() => {
    const preloadImages = async () => {
      const imagesToPreload = imageKeys.slice(0, 6); // Preload first 6 images
      let loaded = 0;
      
      for (const key of imagesToPreload) {
        try {
          const module = await imageModules[key]();
          // Create an image element to actually load the image
          const img = new Image();
          img.src = module;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if one fails
          });
          loaded++;
          setLoadingProgress(Math.round((loaded / imagesToPreload.length) * 100));
        } catch (e) {
          loaded++;
          setLoadingProgress(Math.round((loaded / imagesToPreload.length) * 100));
        }
      }
      
      // Minimum loading time for the cool animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      setIsCanvasReady(true);
    };

    preloadImages();
  }, []);

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

  // Handle wheel scroll and touch events
  useEffect(() => {
    const handleWheel = (e) => {
      resetIdleTimer();
      setScrollProgress(prev => {
        const delta = e.deltaY * 0.0005;
        return Math.max(0, Math.min(1, prev + delta));
      });
    };

    // Touch events for mobile
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      lastTouchY.current = e.touches[0].clientY;
      resetIdleTimer();
    };

    const handleTouchMove = (e) => {
      e.preventDefault(); // Prevent default scroll behavior
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      lastTouchY.current = currentY;
      
      resetIdleTimer();
      setScrollProgress(prev => {
        // More sensitive on mobile for better control
        const delta = deltaY * 0.003;
        return Math.max(0, Math.min(1, prev + delta));
      });
    };

    const handleTouchEnd = () => {
      resetIdleTimer();
    };

    const handleMouseMove = () => {
      resetIdleTimer();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Start idle timer
    resetIdleTimer();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [resetIdleTimer]);

  const handleSelectImage = useCallback((url, aspect) => {
    playClick();
    setSelectedImage({ url, aspect });
  }, [playClick]);

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Animated camera icon */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute -inset-6 sm:-inset-8 border-2 border-emerald-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            {/* Middle ring */}
            <motion.div
              className="absolute -inset-3 sm:-inset-4 border border-cyan-500/40 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Camera lens effect */}
            <motion.div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(16, 185, 129, 0.3)',
                  '0 0 40px rgba(16, 185, 129, 0.5)',
                  '0 0 20px rgba(16, 185, 129, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div 
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500/50"
                  animate={{ 
                    scale: [1, 0.8, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>

            {/* Aperture blades effect */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 sm:w-1 h-10 sm:h-12 bg-gradient-to-b from-emerald-500/50 to-transparent"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: '50% 0%',
                }}
                initial={{ rotate: i * 45, x: '-50%' }}
                animate={{ 
                  rotate: [i * 45, i * 45 + 360],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                  opacity: { duration: 2, repeat: Infinity, delay: i * 0.1 }
                }}
              />
            ))}
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text">Visual</span> Chronicles
          </motion.h2>

          {/* Loading text */}
          <motion.p
            className="text-gray-500 font-mono text-xs sm:text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            [ PREPARING GALLERY ]
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="w-40 sm:w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Progress percentage */}
          <motion.p
            className="text-emerald-400 font-mono text-xs mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {loadingProgress}%
          </motion.p>

          {/* Floating photo frames - fewer on mobile */}
          {[...Array(isMobile ? 4 : 6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-6 h-8 sm:w-8 sm:h-10 border border-emerald-500/30 rounded"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [0.5, 1, 0.5],
                x: [0, (Math.random() - 0.5) * 50],
                y: [0, (Math.random() - 0.5) * 50],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        {/* Background grid */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden touch-none">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox 
            imageUrl={selectedImage.url} 
            onClose={handleCloseLightbox}
            playClick={playClick}
          />
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-20 sm:top-24 left-4 sm:left-6 z-50"
      >
        <Link 
          to="/" 
          onClick={playClick}
          onMouseEnter={playHover}
          className="flex items-center gap-2 text-emerald-400 hover:text-white transition-colors group"
        >
          <motion.div
            whileHover={{ x: -5 }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-emerald-500/50 flex items-center justify-center group-hover:bg-emerald-500/20"
          >
            <FaArrowLeft size={14} />
          </motion.div>
          <span className="hidden sm:inline font-mono text-sm">BACK</span>
        </Link>
      </motion.div>

      {/* Header */}
      <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-10 text-center w-full pointer-events-none px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold">
            <span className="gradient-text">Visual</span> <span className="text-white">Chronicles</span>
          </h1>
          <p className="text-gray-400 mt-2 sm:mt-4 max-w-lg mx-auto text-xs sm:text-sm md:text-base font-mono">
            [ SWIPE TO EXPLORE • TAP TO VIEW ]
          </p>
        </motion.div>
      </div>

      {/* Scroll Progress Indicator - Desktop */}
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

      {/* Mobile Scroll Indicator */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 md:hidden pointer-events-none">
        <div className="h-20 w-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="w-full bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <p className="text-emerald-400 text-[10px] font-mono mt-1 text-center">
          {Math.round(scrollProgress * 100)}%
        </p>
      </div>

      {/* Image Counter */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-50 pointer-events-none">
        <p className="text-gray-500 font-mono text-[10px] sm:text-xs">
          <span className="text-emerald-400">{imageKeys.length}</span> FRAMES
        </p>
      </div>

      {/* Click hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-1 sm:gap-2 text-gray-500 pointer-events-none"
      >
        <FaExpand className="text-emerald-400 text-xs sm:text-sm" />
        <span className="font-mono text-[10px] sm:text-xs">TAP FOR FULL</span>
      </motion.div>

      {/* 3D Canvas with error boundary */}
      <div className="absolute inset-0 z-0">
        {isCanvasReady ? (
          <SceneErrorBoundary>
            <Canvas
              camera={{ 
                position: [0, -sceneConfig.heightSpread / 2, sceneConfig.cameraZ], 
                fov: sceneConfig.fov 
              }}
              gl={{ 
                antialias: !isMobile, // Disable antialiasing on mobile for performance
                alpha: true,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false
              }}
              dpr={isMobile ? [1, 1] : [1, 1.5]} // Lower DPR on mobile
              performance={{ min: 0.5 }}
            >
              <Scene 
                scrollProgress={scrollProgress} 
                isIdle={isIdle}
                onSelectImage={handleSelectImage}
                config={sceneConfig}
              />
            </Canvas>
          </SceneErrorBoundary>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-60" />
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 scanline opacity-20" />
    </div>
  );
};

export default Photography;
