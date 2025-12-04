import { useRef, useState, useEffect } from 'react';
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

const ParticleSphere = (props) => {
  const ref = useRef();
  const [sphere] = useState(() => generateSpherePoints(5000, 1.2));
  
  // Mouse interaction state
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse coordinates to -1 to 1
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Automatic constant rotation
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;

      // Mouse interaction: rotate based on mouse position
      // We interpolate (lerp) for smooth movement
      const targetRotationX = mouse.current.y * 0.5; // Influence X rotation with Y mouse
      const targetRotationY = mouse.current.x * 0.5; // Influence Y rotation with X mouse
      
      // Apply mouse influence on top of base rotation or as an added offset
      // Here we add a subtle influence to the rotation speed or orientation
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

const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none"> 
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
        <group rotation={[0, 0, Math.PI / 4]}>
            <ParticleSphere />
        </group>
      </Canvas>
    </div>
  );
};

export default Hero3D;
