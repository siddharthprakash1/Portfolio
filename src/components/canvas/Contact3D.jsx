import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Subtle connection lines emanating from center
const ConnectionLines = ({ isMobile }) => {
  const groupRef = useRef();
  const lineCount = isMobile ? 12 : 20;
  
  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 0.8;
      return {
        end: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.5,
          -0.5,
        ],
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, [lineCount]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <ConnectionLine key={i} {...line} index={i} />
      ))}
    </group>
  );
};

const ConnectionLine = ({ end, phase, index }) => {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime;
      const pulse = 0.1 + Math.sin(time * 0.5 + phase) * 0.05;
      lineRef.current.material.opacity = pulse;
    }
  });

  const points = useMemo(() => {
    return [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...end)];
  }, [end]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial 
        color={index % 2 === 0 ? '#00ff88' : '#00f3ff'} 
        transparent 
        opacity={0.1} 
      />
    </line>
  );
};

// Gentle glowing orb at center
const CentralOrb = () => {
  const coreRef = useRef();
  const ringRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (coreRef.current) {
      const scale = 1 + Math.sin(time * 0.8) * 0.08;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.material.opacity = 0.2 + Math.sin(time * 1.2) * 0.05;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.2;
      ringRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <group>
      {/* Core glow */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
      </mesh>
      
      {/* Single orbiting ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.3, 0.005, 16, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.25} />
      </mesh>
    </group>
  );
};

// Ambient floating particles
const Particles = ({ isMobile }) => {
  const particlesRef = useRef();
  const count = isMobile ? 40 : 60;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2 - 1;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
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
        opacity={0.3} 
        sizeAttenuation 
      />
    </points>
  );
};

const Contact3D = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ alpha: true, antialias: !isMobile }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <CentralOrb />
        <ConnectionLines isMobile={isMobile} />
        <Particles isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default Contact3D;
