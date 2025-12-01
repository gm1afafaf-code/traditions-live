import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';

function GoldOrb({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#d4af37"
          metalness={0.9}
          roughness={0.1}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function MarbleFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial
        color="#0a0a0a"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function GoldVeins() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    for (let i = 0; i < 100; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20
      );
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#d4af37"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function CannabisLeaf({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + rotation) * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 + rotation;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={[0, rotation, 0]}>
        <coneGeometry args={[0.3, 1, 7]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.7}
          roughness={0.3}
          emissive="#d4af37"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f4d03f" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#d4af37"
        castShadow
      />
      
      <GoldOrb position={[0, 0, 0]} scale={1.5} />
      <GoldOrb position={[-4, 2, -3]} scale={0.7} />
      <GoldOrb position={[4, -1, -2]} scale={0.5} />
      <GoldOrb position={[3, 3, -4]} scale={0.4} />
      
      <CannabisLeaf position={[-3, 1, 2]} rotation={0} />
      <CannabisLeaf position={[3, 2, 1]} rotation={Math.PI / 3} />
      <CannabisLeaf position={[0, 3, -2]} rotation={Math.PI / 2} />
      <CannabisLeaf position={[-2, -1, 3]} rotation={Math.PI} />
      <CannabisLeaf position={[2, 0, 4]} rotation={Math.PI * 1.5} />
      
      <MarbleFloor />
      <GoldVeins />
      
      <Sparkles
        count={200}
        scale={15}
        size={2}
        speed={0.5}
        color="#d4af37"
        opacity={0.5}
      />
      
      <Environment preset="night" />
      
      <fog attach="fog" args={['#0a0a0a', 5, 30]} />
    </>
  );
}

export function VaultScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
