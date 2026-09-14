import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { kleinBottlePoint } from '../../utils/mathUtils';
import { Sparkles, Layers, Scissors, Info } from 'lucide-react';

export const KleinBottleScene: React.FC = () => {
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

  const [crossSection, setCrossSection] = useState(1.0); // 1.0 = full, <1.0 slices u
  const [transparency, setTransparency] = useState(0.85);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const uSteps = 80;
    const vSteps = 40;
    const maxU = 2 * Math.PI * crossSection;

    for (let i = 0; i <= uSteps; i++) {
      const uFrac = i / uSteps;
      const u = uFrac * maxU;

      for (let j = 0; j <= vSteps; j++) {
        const vFrac = j / vSteps;
        const v = vFrac * 2 * Math.PI;

        const [x, y, z] = kleinBottlePoint(u, v, 2);
        // Scale to pleasant scene bounds
        positions.push(x * 0.7, z * 0.7, y * 0.7);
        uvs.push(uFrac, vFrac);
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
  }, [crossSection]);

  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current && controls.isPlaying) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <ErrorBoundary fallbackTitle="Klein Bottle 3D Scene Failed">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full h-[460px] md:h-[520px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <Canvas camera={{ position: [0, 3, 5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[8, 12, 8]} intensity={1.2} />
            <pointLight position={[-8, -5, -8]} intensity={0.6} color="#8b5cf6" />
            <pointLight position={[5, 8, -5]} intensity={0.8} color="#ec4899" />

            <mesh ref={meshRef} geometry={geometry}>
              <meshStandardMaterial
                color="#8b5cf6"
                roughness={0.2}
                metalness={0.5}
                side={THREE.DoubleSide}
                wireframe={controls.wireframe}
                transparent
                opacity={transparency}
              />
            </mesh>

            {controls.showGrid && <gridHelper args={[10, 10, 0x334155, 0x1e293b]} />}
            {controls.showAxes && <axesHelper args={[3]} />}

            <OrbitControls enableDamping dampingFactor={0.05} maxDistance={10} minDistance={2} />
          </Canvas>

          {/* Slicing / Self-intersection Notice */}
          <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-purple-500/30 text-xs text-slate-300 max-w-md shadow-xl">
            <div className="flex items-center gap-1.5 font-bold text-purple-400 uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              Topological 4D Immersion Note
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              In 3-dimensional space, the Klein bottle appears to intersect itself. This self-intersection is an artifact of forcing a 4-dimensional surface into 3 dimensions. In 4D, it passes smoothly without collision!
            </p>
          </div>
        </div>

        {/* Controls */}
        <UniversalControls
          state={controls}
          onChange={(updates) => setControls((c) => ({ ...c, ...updates }))}
          customButtons={
            <div className="flex items-center gap-3 px-2">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Scissors className="w-3 h-3 text-purple-400" />
                Cross-Section:
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.02"
                  value={crossSection}
                  onChange={(e) => setCrossSection(parseFloat(e.target.value))}
                  className="w-16 accent-purple-500 h-1 bg-slate-800 rounded"
                />
              </label>
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                Opacity:
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={transparency}
                  onChange={(e) => setTransparency(parseFloat(e.target.value))}
                  className="w-14 accent-purple-500 h-1 bg-slate-800 rounded"
                />
              </label>
            </div>
          }
        />

        {controls.mode === 'Mathematical' && (
          <div className="p-6 bg-slate-900/90 backdrop-blur rounded-2xl border border-purple-500/30 text-xs text-slate-300 shadow-xl">
            <h4 className="font-cinzel text-sm font-bold text-purple-300 mb-2">Figure-8 Parametric Immersion</h4>
            <KaTeXMath
              math="x(u, v) = \left(r + \cos\frac{u}{2}\sin v - \sin\frac{u}{2}\sin 2v\right)\cos u, \quad y(u, v) = \left(r + \cos\frac{u}{2}\sin v - \sin\frac{u}{2}\sin 2v\right)\sin u"
              block
            />
            <KaTeXMath
              math="z(u, v) = \sin\frac{u}{2}\sin v + \cos\frac{u}{2}\sin 2v, \quad u, v \in [0, 2\pi]"
              block
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
