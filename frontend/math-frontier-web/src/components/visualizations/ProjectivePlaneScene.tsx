import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { Compass, RotateCcw, Info } from 'lucide-react';

interface CrossCapMeshProps {
  wireframe: boolean;
  isPlaying: boolean;
  speed: number;
}

const CrossCapMesh: React.FC<CrossCapMeshProps> = ({ wireframe, isPlaying, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.y += delta * 0.2 * speed;
      meshRef.current.rotation.x += delta * 0.1 * speed;
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const uSteps = 60;
    const vSteps = 60;

    for (let i = 0; i <= uSteps; i++) {
      const u = (i / uSteps) * Math.PI;
      for (let j = 0; j <= vSteps; j++) {
        const v = (j / vSteps) * Math.PI;

        // Cross-cap parametric surface in 3D
        const x = 0.5 * Math.sin(2 * u) * Math.pow(Math.sin(v), 2);
        const y = 0.5 * Math.sin(u) * Math.sin(2 * v);
        const z = 0.5 * (Math.pow(Math.cos(u), 2) * Math.pow(Math.sin(v), 2) + Math.SQRT2 * Math.cos(v));

        // Scale to scene
        positions.push(x * 2.8, z * 2.8, y * 2.8);
        uvs.push(i / uSteps, j / vSteps);
      }
    }

    for (let i = 0; i < uSteps; i++) {
      for (let j = 0; j < vSteps; j++) {
        const a = i * (vSteps + 1) + j;
        const b = (i + 1) * (vSteps + 1) + j;
        const c = (i + 1) * (vSteps + 1) + (j + 1);
        const d = i * (vSteps + 1) + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    return geom;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#ec4899"
        roughness={0.25}
        metalness={0.4}
        side={THREE.DoubleSide}
        wireframe={wireframe}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

export const ProjectivePlaneScene: React.FC = () => {
  const [controls, setControls] = useState<UniversalControlState>({
    mode: 'Explore',
    wireframe: false,
    isPlaying: true,
    showAxes: false,
    showGrid: false,
    showTrail: false,
    isFullscreen: false,
    speed: 1
  });

  const [cameraKey, setCameraKey] = useState(0);

  return (
    <ErrorBoundary fallbackTitle="Projective Plane 3D Scene Failed">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full h-[460px] md:h-[520px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <Canvas key={cameraKey} camera={{ position: [0, 2.5, 4.5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[8, 12, 8]} intensity={1.2} />
            <pointLight position={[-8, -5, -8]} intensity={0.6} color="#ec4899" />
            <pointLight position={[5, 8, -5]} intensity={0.8} color="#8b5cf6" />

            <CrossCapMesh
              wireframe={controls.wireframe}
              isPlaying={controls.isPlaying}
              speed={controls.speed}
            />

            {controls.showGrid && <gridHelper args={[10, 10, 0x334155, 0x1e293b]} />}
            {controls.showAxes && <axesHelper args={[3]} />}

            <OrbitControls enableDamping dampingFactor={0.05} maxDistance={10} minDistance={2} />
          </Canvas>

          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={() => setCameraKey((k) => k + 1)}
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-mono backdrop-blur flex items-center gap-1.5 transition-colors shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset View
            </button>
          </div>

          <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-pink-500/30 text-xs text-slate-300 max-w-md shadow-xl">
            <div className="flex items-center gap-1.5 font-bold text-pink-400 uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Real Projective Plane <KaTeXMath math="\mathbb{RP}^2" /> Cross-Cap</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              A non-orientable 2-manifold with Euler characteristic <KaTeXMath math="\chi = 1" />. Formed by identifying antipodal points on the 2-sphere <KaTeXMath math="S^2" />. Its 3D immersion contains a line segment of self-intersection ending at two Whitney pinch points.
            </p>
          </div>
        </div>

        <UniversalControls
          state={controls}
          onChange={(updates) => setControls((c) => ({ ...c, ...updates }))}
        />

        {controls.mode === 'Mathematical' && (
          <div className="p-6 bg-slate-900/90 backdrop-blur rounded-2xl border border-pink-500/30 text-xs text-slate-300 shadow-xl space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-pink-300">Cross-Cap Parametric Equations</h4>
            <div className="space-y-1 font-mono text-xs">
              <KaTeXMath math="x(u, v) = \frac{1}{2}\sin 2u \sin^2 v" block />
              <KaTeXMath math="y(u, v) = \frac{1}{2}\sin u \sin 2v" block />
              <KaTeXMath math="z(u, v) = \frac{1}{2}\left(\cos^2 u \sin^2 v + \sqrt{2}\cos v\right), \quad u, v \in [0, \pi]" block />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
