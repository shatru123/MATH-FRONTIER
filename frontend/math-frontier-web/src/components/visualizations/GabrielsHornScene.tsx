import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { IntuitionVsMath } from '../common/IntuitionVsMath';
import { RotateCcw, Info, Sparkles } from 'lucide-react';

interface HornMeshProps {
  wireframe: boolean;
  isPlaying: boolean;
  speed: number;
}

const HornMesh: React.FC<HornMeshProps> = ({ wireframe, isPlaying, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.x += delta * 0.25 * speed;
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const xSteps = 80;
    const thetaSteps = 40;
    const xMin = 1.0;
    const xMax = 12.0;

    for (let i = 0; i <= xSteps; i++) {
      const u = i / xSteps;
      const x = xMin + u * (xMax - xMin);
      const r = 1.0 / x;

      for (let j = 0; j <= thetaSteps; j++) {
        const v = j / thetaSteps;
        const theta = v * 2 * Math.PI;

        const y = r * Math.cos(theta);
        const z = r * Math.sin(theta);

        // Center along x-axis in scene
        positions.push((x - 4.5) * 0.7, y * 1.5, z * 1.5);
        uvs.push(u, v);
      }
    }

    for (let i = 0; i < xSteps; i++) {
      for (let j = 0; j < thetaSteps; j++) {
        const a = i * (thetaSteps + 1) + j;
        const b = (i + 1) * (thetaSteps + 1) + j;
        const c = (i + 1) * (thetaSteps + 1) + (j + 1);
        const d = i * (thetaSteps + 1) + (j + 1);

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
        color="#f59e0b"
        roughness={0.2}
        metalness={0.6}
        side={THREE.DoubleSide}
        wireframe={wireframe}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
};

export const GabrielsHornScene: React.FC = () => {
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
    <ErrorBoundary fallbackTitle="Gabriel's Horn 3D Scene Failed">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full h-[460px] md:h-[520px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <Canvas key={cameraKey} camera={{ position: [3, 2, 5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[8, 12, 8]} intensity={1.2} />
            <pointLight position={[-8, -5, -8]} intensity={0.6} color="#f59e0b" />
            <pointLight position={[5, 8, -5]} intensity={0.8} color="#06b6d4" />

            <HornMesh
              wireframe={controls.wireframe}
              isPlaying={controls.isPlaying}
              speed={controls.speed}
            />

            {controls.showGrid && <gridHelper args={[10, 10, 0x334155, 0x1e293b]} />}
            {controls.showAxes && <axesHelper args={[3]} />}

            <OrbitControls enableDamping dampingFactor={0.05} maxDistance={12} minDistance={2} />
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

          <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-amber-500/30 text-xs text-slate-300 max-w-md shadow-xl">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              Torricelli's Trumpet (The Painter's Paradox)
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Rotating <KaTeXMath math="y = 1/x" /> (<KaTeXMath math="x \ge 1" />) yields a horn of finite volume <KaTeXMath math="V = \pi" />, but infinitely large surface area <KaTeXMath math="A = \infty" />!
            </p>
          </div>
        </div>

        <UniversalControls
          state={controls}
          onChange={(updates) => setControls((c) => ({ ...c, ...updates }))}
        />

        {controls.mode === 'Mathematical' && (
          <div className="p-6 bg-slate-900/90 backdrop-blur rounded-2xl border border-amber-500/30 text-xs text-slate-300 shadow-xl space-y-4 font-mono">
            <h4 className="font-cinzel text-sm font-bold text-amber-300">Definite Integral Calculations</h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-emerald-400 font-bold block">1. Finite Volume:</span>
                <KaTeXMath math="V = \pi \int_1^\infty \left(\frac{1}{x}\right)^2 dx = \pi \left[ -\frac{1}{x} \right]_1^\infty = \pi(0 - (-1)) = \pi" block />
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-amber-400 font-bold block">2. Infinite Surface Area:</span>
                <KaTeXMath math="A = 2\pi \int_1^\infty \frac{1}{x}\sqrt{1 + \left(-\frac{1}{x^2}\right)^2} dx > 2\pi \int_1^\infty \frac{1}{x} dx = \infty" block />
              </div>
            </div>
          </div>
        )}

        <IntuitionVsMath
          intuition="If an object holds a finite amount of paint, it should take a finite amount of paint to coat its surface."
          mathematics="The interior volume tapers so rapidly (at rate 1/x^2) that the total volume converges to \pi. However, the surface perimeter shrinks at rate 1/x, which corresponds to the divergent harmonic series!"
          mathLaTeX="V = \pi < \infty, \qquad A = \infty"
        />
      </div>
    </ErrorBoundary>
  );
};
