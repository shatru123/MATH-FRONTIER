import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { IntuitionVsMath } from '../common/IntuitionVsMath';
import { RotateCcw, Info, CheckCircle2 } from 'lucide-react';

interface SphereMeshProps {
  wireframe: boolean;
  isPlaying: boolean;
  speed: number;
  deformation: number;
}

const SphereMesh: React.FC<SphereMeshProps> = ({ wireframe, isPlaying, speed, deformation }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.y += delta * 0.2 * speed;
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(1.8, 64, 32);
    const pos = geom.attributes.position;
    // Apply Ricci flow smoothing deformation
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Deformed dumbbell or pinched sphere relaxing under Ricci flow
      const factor = 1 + deformation * 0.4 * Math.sin(x * 2) * Math.cos(y * 2);
      pos.setXYZ(i, x * factor, y * factor, z * factor);
    }
    geom.computeVertexNormals();
    return geom;
  }, [deformation]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#8b5cf6"
        roughness={0.25}
        metalness={0.5}
        wireframe={wireframe}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const PoincareConjectureScene: React.FC = () => {
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

  const [deformation, setDeformation] = useState(0.5); // 0 = perfectly round 3-sphere, >0 = pinched manifold
  const [cameraKey, setCameraKey] = useState(0);

  return (
    <ErrorBoundary fallbackTitle="Poincaré Conjecture 3D Scene Failed">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full h-[460px] md:h-[520px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <Canvas key={cameraKey} camera={{ position: [0, 2, 4.5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[8, 12, 8]} intensity={1.2} />
            <pointLight position={[-8, -5, -8]} intensity={0.6} color="#8b5cf6" />
            <pointLight position={[5, 8, -5]} intensity={0.8} color="#06b6d4" />

            <SphereMesh
              wireframe={controls.wireframe}
              isPlaying={controls.isPlaying}
              speed={controls.speed}
              deformation={deformation}
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

          <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-purple-500/30 text-xs text-slate-300 max-w-md shadow-xl">
            <div className="flex items-center gap-1.5 font-bold text-purple-400 uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              SOLVED by Grigori Perelman (2002–2003)
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Every simply connected, closed 3-manifold is homeomorphic to the 3-sphere <KaTeXMath math="S^3" />. Solved using Hamilton's Ricci flow equation with surgery to extinguish finite-time neckpinch singularities.
            </p>
          </div>
        </div>

        <UniversalControls
          state={controls}
          onChange={(updates) => setControls((c) => ({ ...c, ...updates }))}
          customButtons={
            <div className="flex items-center gap-3 px-2">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                Ricci Flow Smoothing:
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={deformation}
                  onChange={(e) => setDeformation(parseFloat(e.target.value))}
                  className="w-20 accent-purple-500 cursor-pointer"
                />
                <span className="text-purple-300 font-bold">{deformation === 0 ? 'Round S³' : 'Deformed'}</span>
              </label>
            </div>
          }
        />

        {controls.mode === 'Mathematical' && (
          <div className="p-6 bg-slate-900/90 backdrop-blur rounded-2xl border border-purple-500/30 text-xs text-slate-300 shadow-xl space-y-3 font-mono">
            <h4 className="font-cinzel text-sm font-bold text-purple-300">Hamilton-Perelman Ricci Flow Equation</h4>
            <KaTeXMath math="\frac{\partial g_{ij}}{\partial t} = -2 R_{ij}" block />
            <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              Ricci flow acts as a heat equation on the Riemannian metric tensor <KaTeXMath math="g_{ij}" />, smoothing regions of high positive Ricci curvature <KaTeXMath math="R_{ij}" />. Perelman introduced reduced volume monotonic entropy to control and perform surgery on neck-pinch singularities.
            </p>
          </div>
        )}

        <IntuitionVsMath
          intuition="If you tie a closed rubber band around any 3D universe and can always shrink it down to a single point without getting snagged, that universe must be shaped like a 3-sphere."
          mathematics="A compact, connected 3-manifold M without boundary satisfying \pi_1(M) = 0 is homeomorphic to the 3-sphere S^3. Higher-dimensional analogues were proved by Smale (n \ge 5) and Freedman (n = 4); the 3D case required geometric analysis via Ricci flow with surgery."
          mathLaTeX="\pi_1(M) = 0 \implies M \cong S^3"
        />
      </div>
    </ErrorBoundary>
  );
};
