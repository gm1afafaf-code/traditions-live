import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ProductCard3DProps {
  name: string;
  price: number;
  thc?: number;
  onHover?: (hovered: boolean) => void;
}

function ProductMesh({ name, price, thc, isHovered }: ProductCard3DProps & { isHovered: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = isHovered 
        ? Math.sin(state.clock.elapsedTime * 2) * 0.1
        : state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={meshRef}>
        <RoundedBox args={[2, 2.5, 0.3]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color="#121212"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1}
          />
        </RoundedBox>
        
        <mesh position={[0, 0.5, 0.2]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#2d5a27"
            metalness={0.3}
            roughness={0.7}
            emissive="#1a3d15"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        <Text
          position={[0, -0.3, 0.2]}
          fontSize={0.15}
          color="#d4af37"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          {name.substring(0, 15)}
        </Text>
        
        <Text
          position={[0, -0.6, 0.2]}
          fontSize={0.2}
          color="#f4d03f"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          ${price.toLocaleString()}
        </Text>
        
        {thc && (
          <Text
            position={[0, -0.9, 0.2]}
            fontSize={0.12}
            color="#888888"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.woff"
          >
            THC: {thc}%
          </Text>
        )}
        
        <pointLight position={[0, 0, 1]} intensity={0.5} color="#d4af37" distance={3} />
      </group>
    </Float>
  );
}

export function ProductCard3D({ name, price, thc, onHover }: ProductCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

  return (
    <div 
      className="w-full h-64 cursor-pointer"
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#d4af37" />
        <ProductMesh name={name} price={price} thc={thc} isHovered={isHovered} />
      </Canvas>
    </div>
  );
}
