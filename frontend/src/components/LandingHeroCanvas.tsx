import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function NodeGraph({ count = 36 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const rand = (n: number) => Math.sin(n * 999.1) * 0.5 + 0.5;
    for (let i = 0; i < count; i++) {
      const x = (rand(i + 1) - 0.5) * 3.2;
      const y = (rand(i + 2) - 0.5) * 2.0;
      const z = (rand(i + 3) - 0.5) * 2.8;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [count]);

  const lineGeo = useMemo(() => {
    const pairs: number[] = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i * 7 + 11) % points.length];
      pairs.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pairs, 3));
    return geo;
  }, [points]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.12;
      group.current.rotation.x = Math.sin(t * 0.15) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#ff6b35" transparent opacity={0.25} />
      </lineSegments>
      {points.map((p, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
          <mesh position={p}>
            <sphereGeometry args={[0.06, 20, 20]} />
            <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.8} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function LandingHeroCanvas({ reducedMotion }: { reducedMotion?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.6, 5], fov: 45 }}>
      <color attach="background" args={["#070a12"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#ff6b35" />
      <NodeGraph />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!reducedMotion}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.8}
      />
    </Canvas>
  );
}
