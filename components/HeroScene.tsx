"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function DistortedForm() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.06 + mouse.current.y * 0.15;
    meshRef.current.rotation.y = t * 0.09 + mouse.current.x * 0.15;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerMove={(e) => {
        mouse.current.x = (e.point.x ?? 0) * 0.1;
        mouse.current.y = (e.point.y ?? 0) * 0.1;
      }}
    >
      <icosahedronGeometry args={[1.6, 4]} />
      <meshBasicMaterial color="#111111" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.6} />
      <DistortedForm />
    </Canvas>
  );
}
