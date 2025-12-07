import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Helper to generate random points in a sphere
const generateSpherePoints = (count, radius) => {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
};

// Main particle sphere
const ParticleSphere = (props) => {
  const ref = useRef();
  const [sphere] = useState(() => generateSpherePoints(5000, 1.2));
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
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
      const targetRotationX = mouse.current.y * 0.5;
      const targetRotationY = mouse.current.x * 0.5;
      ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * delta * 0.5;
      ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * delta * 0.5;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00ff88"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// Floating geometric shapes
const FloatingGeometry = ({ position, geometry, color, speed = 1 }) => {
  const meshRef = useRef();
  const initialY = position[1];
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = time * 0.5 * speed;
      meshRef.current.rotation.y = time * 0.3 * speed;
      meshRef.current.rotation.z = time * 0.2 * speed;
      meshRef.current.position.y = initialY + Math.sin(time * speed) * 0.1;
    }
  });

  const geometryComponent = useMemo(() => {
    switch (geometry) {
      case 'octahedron':
        return <octahedronGeometry args={[0.08, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.06, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.07, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.05, 0]} />;
      default:
        return <boxGeometry args={[0.05, 0.05, 0.05]} />;
    }
  }, [geometry]);

  return (
    <mesh ref={meshRef} position={position}>
      {geometryComponent}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
    </mesh>
  );
};

// DNA Helix structure
const DNAHelix = () => {
  const groupRef = useRef();
  const particleCount = 40;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const particles = useMemo(() => {
    const items = [];
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 4;
      const y = (i / particleCount) * 2 - 1;
      
      // Strand 1
      items.push({
        position: [Math.cos(t) * 0.3, y, Math.sin(t) * 0.3],
        color: '#00ff88',
        size: 0.015,
      });
      
      // Strand 2
      items.push({
        position: [Math.cos(t + Math.PI) * 0.3, y, Math.sin(t + Math.PI) * 0.3],
        color: '#00f3ff',
        size: 0.015,
      });
      
      // Connection every 4th particle
      if (i % 4 === 0) {
        items.push({
          position: [0, y, 0],
          color: '#ffffff',
          size: 0.008,
          isConnection: true,
        });
      }
    }
    return items;
  }, []);

  return (
    <group ref={groupRef} position={[1.5, 0, -0.5]}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// Orbiting rings with particles
const OrbitRing = ({ radius, speed, color, particleCount = 20 }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
    });
  }, [radius, particleCount]);

  return (
    <group ref={groupRef}>
      {/* Ring line */}
      <mesh>
        <torusGeometry args={[radius, 0.002, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Particles on ring */}
      {particles.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// Energy field effect
const EnergyField = () => {
  const linesRef = useRef();
  const lineCount = 30;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(lineCount * 6);
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const r1 = 0.8;
      const r2 = 1.4;
      
      pos[i * 6] = Math.cos(angle) * r1;
      pos[i * 6 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 6 + 2] = Math.sin(angle) * r1;
      
      pos[i * 6 + 3] = Math.cos(angle) * r2;
      pos[i * 6 + 4] = (Math.random() - 0.5) * 0.5;
      pos[i * 6 + 5] = Math.sin(angle) * r2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={linesRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lineCount * 2}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00ff88" transparent opacity={0.2} />
      </lineSegments>
    </group>
  );
};

// Floating code brackets
const FloatingBrackets = () => {
  const group1Ref = useRef();
  const group2Ref = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (group1Ref.current) {
      group1Ref.current.position.x = -1.2 + Math.sin(time * 0.5) * 0.05;
      group1Ref.current.position.y = Math.sin(time * 0.8) * 0.1;
      group1Ref.current.rotation.z = Math.sin(time * 0.3) * 0.1;
    }
    if (group2Ref.current) {
      group2Ref.current.position.x = 1.2 + Math.sin(time * 0.5 + 1) * 0.05;
      group2Ref.current.position.y = Math.sin(time * 0.8 + 1) * 0.1;
      group2Ref.current.rotation.z = Math.sin(time * 0.3 + 1) * -0.1;
    }
  });

  // Create bracket shape
  const bracketShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.15);
    shape.lineTo(-0.05, 0.12);
    shape.lineTo(-0.05, -0.12);
    shape.lineTo(0, -0.15);
    return shape;
  }, []);

  return (
    <>
      <group ref={group1Ref} position={[-1.2, 0, 0]}>
        <mesh>
          <shapeGeometry args={[bracketShape]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={group2Ref} position={[1.2, 0, 0]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <shapeGeometry args={[bracketShape]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
};

// Pulsing core
const PulsingCore = () => {
  const coreRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (coreRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.material.opacity = 0.3 + Math.sin(time * 3) * 0.1;
    }
    if (glowRef.current) {
      const glowScale = 1.5 + Math.sin(time * 1.5) * 0.2;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = 0.1 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

// Neural network connections
const NeuralNetwork = () => {
  const groupRef = useRef();
  const nodeCount = 12;
  
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, () => [
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1,
    ]);
  }, []);

  const connections = useMemo(() => {
    const conns = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodes[i][0] - nodes[j][0], 2) +
          Math.pow(nodes[i][1] - nodes[j][1], 2) +
          Math.pow(nodes[i][2] - nodes[j][2], 2)
        );
        if (dist < 1) {
          conns.push([nodes[i], nodes[j]]);
        }
      }
    }
    return conns;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[-1.3, 0.3, -0.5]}>
      {/* Nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#00ff88' : '#00f3ff'} transparent opacity={0.8} />
        </mesh>
      ))}
      {/* Connections */}
      {connections.map((conn, i) => {
        const start = new THREE.Vector3(...conn[0]);
        const end = new THREE.Vector3(...conn[1]);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const length = start.distanceTo(end);
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        
        return (
          <mesh key={i} position={mid}>
            <cylinderGeometry args={[0.002, 0.002, length, 4]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
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
        camera={{ position: [0, 0, 2], fov: 60 }} 
        gl={{ alpha: true, antialias: !isMobile }}
        dpr={isMobile ? [1, 1] : [1, 2]}
        style={{ background: 'transparent' }}
      >
        {/* Main particle sphere */}
        <ParticleSphere />
        
        {/* Pulsing core at center */}
        <PulsingCore />
        
        {/* Orbiting rings */}
        <group rotation={[Math.PI / 6, 0, 0]}>
          <OrbitRing radius={0.6} speed={0.3} color="#00ff88" particleCount={15} />
        </group>
        <group rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <OrbitRing radius={0.8} speed={-0.2} color="#00f3ff" particleCount={20} />
        </group>
        <group rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <OrbitRing radius={1} speed={0.15} color="#00ff88" particleCount={25} />
        </group>
        
        {/* DNA Helix - only on desktop */}
        {!isMobile && <DNAHelix />}
        
        {/* Energy field */}
        <EnergyField />
        
        {/* Floating brackets */}
        {!isMobile && <FloatingBrackets />}
        
        {/* Neural network - only on desktop */}
        {!isMobile && <NeuralNetwork />}
        
        {/* Floating geometric shapes */}
        <FloatingGeometry position={[-0.8, 0.5, -0.3]} geometry="octahedron" color="#00ff88" speed={1.2} />
        <FloatingGeometry position={[0.9, -0.4, -0.2]} geometry="icosahedron" color="#00f3ff" speed={0.8} />
        <FloatingGeometry position={[-0.6, -0.6, 0.2]} geometry="tetrahedron" color="#00ff88" speed={1} />
        <FloatingGeometry position={[0.7, 0.6, 0.1]} geometry="dodecahedron" color="#00f3ff" speed={0.9} />
        {!isMobile && (
          <>
            <FloatingGeometry position={[-1, 0, -0.5]} geometry="octahedron" color="#ffffff" speed={0.7} />
            <FloatingGeometry position={[1.1, 0.2, -0.4]} geometry="icosahedron" color="#ffffff" speed={1.1} />
          </>
        )}
      </Canvas>
    </div>
  );
};

export default Hero3D;
