import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function NodeGraph({ count = 36 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const rand = (n: number) => (Math.sin(n * 999.1) * 0.5 + 0.5);
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

export function LandingHeroScene({ reducedMotion }: { reducedMotion?: boolean }) {
  return (
    <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-2xl">
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

      <div className="absolute inset-0 bg-gradient-to-t from-primary-container/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-6 right-6 glass-panel p-6 rounded-xl border border-white/20 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" data-icon="bolt">
              bolt
            </span>
          </div>
          <div>
            <div className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Processing Speed</div>
            <div className="text-2xl font-headline font-bold text-primary">0.04ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}

