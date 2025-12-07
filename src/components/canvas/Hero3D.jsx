import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Helper to generate random points in a sphere
const generateSpherePoints = (count, radius) => {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    
    points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    points[i * 3 + 2] = r * Math.cos(phi);
  }
  return points;
};

// Main particle sphere - subtle and elegant
const ParticleSphere = ({ isMobile }) => {
  const ref = useRef();
  const particleCount = isMobile ? 3000 : 5000;
  const [sphere] = useState(() => generateSpherePoints(particleCount, 1.5));
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Very slow, subtle rotation
      ref.current.rotation.x -= delta / 25;
      ref.current.rotation.y -= delta / 30;

      // Gentle mouse influence
      const targetRotationX = mouse.current.y * 0.2;
      const targetRotationY = mouse.current.x * 0.2;
      ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * delta * 0.3;
      ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * delta * 0.3;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00ff88"
          size={isMobile ? 0.004 : 0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};

// Subtle orbiting ring - single elegant ring
const OrbitRing = ({ radius, speed, tilt, color, opacity = 0.15 }) => {
  const ringRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <group rotation={tilt}>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.003, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
};

// Gentle floating particles in the background
const AmbientParticles = ({ isMobile }) => {
  const particlesRef = useRef();
  const count = isMobile ? 30 : 50;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2 - 1;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      // Very slow drift
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        size={0.02} 
        color="#00ff88" 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
      />
    </points>
  );
};

// Subtle pulsing glow at center
const CenterGlow = () => {
  const glowRef = useRef();
  
  useFrame((state) => {
    if (glowRef.current) {
      const time = state.clock.elapsedTime;
      // Gentle breathing effect
      const scale = 1 + Math.sin(time * 0.8) * 0.05;
      glowRef.current.scale.setScalar(scale);
      glowRef.current.material.opacity = 0.08 + Math.sin(time * 1.2) * 0.03;
    }
  });

  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0.08} />
    </mesh>
  );
};

// Single floating geometric accent
const FloatingAccent = ({ position, delay = 0 }) => {
  const meshRef = useRef();
  const initialY = position[1];
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      // Gentle float
      meshRef.current.position.y = initialY + Math.sin(time * 0.5) * 0.08;
      // Slow rotation
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.04, 0]} />
      <meshBasicMaterial color="#00ff88" wireframe transparent opacity={0.3} />
    </mesh>
  );
};

const Hero3D = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none"> 
      <Canvas 
        camera={{ position: [0, 0, 2.5], fov: 50 }} 
        gl={{ alpha: true, antialias: !isMobile }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        style={{ background: 'transparent' }}
      >
        {/* Main particle sphere - the hero element */}
        <ParticleSphere isMobile={isMobile} />
        
        {/* Subtle center glow */}
        <CenterGlow />
        
        {/* Just 2 elegant orbiting rings */}
        <OrbitRing 
          radius={1.1} 
          speed={0.08} 
          tilt={[Math.PI / 5, 0, 0]} 
          color="#00ff88" 
          opacity={0.12}
        />
        <OrbitRing 
          radius={1.3} 
          speed={-0.05} 
          tilt={[Math.PI / 3, Math.PI / 6, 0]} 
          color="#00f3ff" 
          opacity={0.08}
        />
        
        {/* Ambient floating particles */}
        <AmbientParticles isMobile={isMobile} />
        
        {/* Just a few subtle geometric accents */}
        {!isMobile && (
          <>
            <FloatingAccent position={[-1.2, 0.5, -0.5]} delay={0} />
            <FloatingAccent position={[1.3, -0.3, -0.3]} delay={2} />
            <FloatingAccent position={[-0.8, -0.6, 0.2]} delay={4} />
          </>
        )}
      </Canvas>
    </div>
  );
};

export default Hero3D;
