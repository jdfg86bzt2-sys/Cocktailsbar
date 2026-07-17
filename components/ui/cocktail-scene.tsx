"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

// Profil du verre (martini), révolu à 360° pour former la géométrie du verre
const GLASS_PROFILE = [
  [0.0, 0.0],
  [0.42, 0.0],
  [0.42, 0.05],
  [0.06, 0.07],
  [0.06, 1.25],
  [1.0, 2.2],
  [0.96, 2.24],
  [0.86, 2.2],
  [0.05, 1.28],
  [0.05, 0.45],
  [0.0, 0.45],
].map(([x, y]) => new THREE.Vector2(x, y));

const LIQUID_PROFILE = [
  [0.0, 1.4],
  [0.62, 1.85],
  [0.0, 1.85],
].map(([x, y]) => new THREE.Vector2(x, y));

function Glass({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const reduce = useReducedMotion();

  useFrame((state, delta) => {
    if (!group.current) return;
    if (reduce) return;
    group.current.rotation.y += delta * 0.15;
    const targetX = state.pointer.y * 0.15;
    const targetZ = -state.pointer.x * 0.15;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetZ, 0.05);
  });

  return (
    <group ref={group} position={[0, -1.1, 0]}>
      <mesh castShadow>
        <latheGeometry args={[GLASS_PROFILE, 64]} />
        <MeshTransmissionMaterial
          color="#ffffff"
          transmission={1}
          roughness={0.04}
          thickness={0.6}
          ior={1.4}
          chromaticAberration={0.02}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh>
        <latheGeometry args={[LIQUID_PROFILE, 64]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.1}
          transparent
          opacity={0.85}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.25, 2.05, 0.15]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#7a1f1a" emissive="#7a1f1a" emissiveIntensity={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function CocktailScene({ accent = "#e2231a" }: { accent?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 5.2], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={40} color={accent} />
      <pointLight position={[-3, 1, -2]} intensity={15} color="#ffffff" />
      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.6}>
          <Glass accent={accent} />
        </Float>
        <Environment preset="city" />
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
