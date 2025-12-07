import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating envelope/message effect
const FloatingMessages = () => {
  const groupRef = useRef();
  const messageCount = 8;
  
  const messages = useMemo(() => {
    return Array.from({ length: messageCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2 - 1,
      ],
      rotation: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      scale: 0.15 + Math.random() * 0.1,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {messages.map((msg, i) => (
        <FloatingMessage key={i} {...msg} index={i} />
      ))}
    </group>
  );
};

const FloatingMessage = ({ position, rotation, speed, phase, scale, index }) => {
  const meshRef = useRef();
  const initialPos = useRef(position);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.x = initialPos.current[0] + Math.sin(time * speed + phase) * 0.3;
      meshRef.current.position.y = initialPos.current[1] + Math.sin(time * speed * 0.7 + phase) * 0.2;
      meshRef.current.rotation.z = rotation + Math.sin(time * 0.5 + phase) * 0.1;
      meshRef.current.rotation.y = Math.sin(time * 0.3 + phase) * 0.2;
      
      // Pulsing opacity
      meshRef.current.material.opacity = 0.3 + Math.sin(time * 2 + index) * 0.1;
    }
  });

  // Create envelope shape
  const envelopeShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -0.6);
    shape.lineTo(1, -0.6);
    shape.lineTo(1, 0.6);
    shape.lineTo(-1, 0.6);
    shape.lineTo(-1, -0.6);
    // Flap
    shape.moveTo(-1, 0.6);
    shape.lineTo(0, 0);
    shape.lineTo(1, 0.6);
    return shape;
  }, []);

  return (
    <mesh ref={meshRef} position={position} rotation={[0, 0, rotation]} scale={scale}>
      <shapeGeometry args={[envelopeShape]} />
      <meshBasicMaterial 
        color={index % 2 === 0 ? '#00ff88' : '#00f3ff'} 
        transparent 
        opacity={0.3} 
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
};

// Connection lines emanating from center
const ConnectionLines = () => {
  const groupRef = useRef();
  const lineCount = 20;
  
  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 1;
      return {
        end: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.6,
          -1 + Math.random() * 0.5,
        ],
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
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

const ConnectionLine = ({ end, speed, phase, index }) => {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime;
      const pulse = 0.2 + Math.sin(time * speed + phase) * 0.15;
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
        color={index % 3 === 0 ? '#00ff88' : index % 3 === 1 ? '#00f3ff' : '#ffffff'} 
        transparent 
        opacity={0.2} 
      />
    </line>
  );
};

// Glowing orb at center
const CentralOrb = () => {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (coreRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.15;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.material.opacity = 0.4 + Math.sin(time * 3) * 0.1;
    }
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.5;
      ring1Ref.current.rotation.y = time * 0.3;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -time * 0.4;
      ring2Ref.current.rotation.z = time * 0.2;
    }
  });

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.4} />
      </mesh>
      
      {/* Orbiting rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.4, 0.01, 16, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>
      
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.5, 0.008, 16, 64]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// Floating particles
const Particles = () => {
  const particlesRef = useRef();
  const count = 100;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        size={0.03} 
        color="#00ff88" 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
      />
    </points>
  );
};

// Social icons orbit
const SocialOrbit = () => {
  const groupRef = useRef();
  const iconCount = 4;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  const icons = useMemo(() => {
    return Array.from({ length: iconCount }, (_, i) => {
      const angle = (i / iconCount) * Math.PI * 2;
      return {
        position: [Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0],
        color: i % 2 === 0 ? '#00ff88' : '#00f3ff',
      };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {icons.map((icon, i) => (
        <OrbitingIcon key={i} {...icon} index={i} />
      ))}
    </group>
  );
};

const OrbitingIcon = ({ position, color, index }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.1);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} wireframe />
    </mesh>
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
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ alpha: true, antialias: !isMobile }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <CentralOrb />
        <ConnectionLines />
        <Particles />
        {!isMobile && (
          <>
            <FloatingMessages />
            <SocialOrbit />
          </>
        )}
      </Canvas>
    </div>
  );
};

export default Contact3D;

