import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { torusPoint } from '../../utils/mathUtils';
import { Circle, Compass, Sparkles } from 'lucide-react';

export const TorusScene: React.FC = () => {
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

  const [majorR, setMajorR] = useState(2.0);
  const [minorR, setMinorR] = useState(0.7);
  const [activeCycle, setActiveCycle] = useState<'none' | 'meridian' | 'longitude'>('none');
  const [cycleProgress, setCycleProgress] = useState(0);

  // Generate torus geometry
  const geometry = useMemo(() => {
    return new THREE.TorusGeometry(majorR, minorR, 32, 64);
  }, [majorR, minorR]);

  // Cycle tracer animation
  useFrame((_, delta) => {
    if (activeCycle !== 'none' && controls.isPlaying) {
      setCycleProgress((prev) => (prev + delta * 0.4 * controls.speed) % (2 * Math.PI));
    }
  });

  // Calculate tracer point
  const tracerPoint = useMemo(() => {
    if (activeCycle === 'none') return null;
    if (activeCycle === 'meridian') {
      // Loops around the minor tube at fixed u = 0
      const [x, y, z] = torusPoint(0, cycleProgress, majorR, minorR);
      return new THREE.Vector3(x, z, y);
    } else {
      // Longitudinal loop around central hole at fixed v = 0
      const [x, y, z] = torusPoint(cycleProgress, 0, majorR, minorR);
      return new THREE.Vector3(x, z, y);
    }
  }, [activeCycle, cycleProgress, majorR, minorR]);

  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current && controls.isPlaying && activeCycle === 'none') {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <ErrorBoundary fallbackTitle="Torus 3D Scene Failed">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full h-[460px] md:h-[520px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <Canvas camera={{ position: [0, 3, 5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 15, 10]} intensity={1.2} />
            <pointLight position={[-8, -5, -8]} intensity={0.6} color="#06b6d4" />
            <pointLight position={[5, 10, -5]} intensity={0.8} color="#3b82f6" />

            <mesh ref={meshRef} geometry={geometry}>
              <meshStandardMaterial
                color="#0ea5e9"
                roughness={0.25}
                metalness={0.4}
                side={THREE.DoubleSide}
                wireframe={controls.wireframe}
                transparent
                opacity={0.9}
              />
            </mesh>

            {tracerPoint && (
              <mesh position={tracerPoint}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshBasicMaterial color="#f59e0b" />
              </mesh>
            )}

            {controls.showGrid && <gridHelper args={[10, 10, 0x334155, 0x1e293b]} />}
            {controls.showAxes && <axesHelper args={[3]} />}

            <OrbitControls enableDamping dampingFactor={0.05} maxDistance={10} minDistance={2} />
          </Canvas>

          {/* Cycle Selection Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCycle(activeCycle === 'meridian' ? 'none' : 'meridian')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                activeCycle === 'meridian'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {activeCycle === 'meridian' ? 'Stop Loop' : 'Meridian Loop (a)'}
            </button>

            <button
              type="button"
              onClick={() => setActiveCycle(activeCycle === 'longitude' ? 'none' : 'longitude')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                activeCycle === 'longitude'
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {activeCycle === 'longitude' ? 'Stop Loop' : 'Longitudinal Loop (b)'}
            </button>
          </div>
        </div>

        {/* Universal Controls */}
        <UniversalControls
          state={controls}
          onChange={(updates) => setControls((c) => ({ ...c, ...updates }))}
          customButtons={
            <div className="flex items-center gap-3 px-2">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                Major R:
                <input
                  type="range"
                  min="1.2"
                  max="3.0"
                  step="0.1"
                  value={majorR}
                  onChange={(e) => setMajorR(parseFloat(e.target.value))}
                  className="w-14 accent-cyan-500 h-1 bg-slate-800 rounded"
                />
              </label>
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                Minor r:
                <input
                  type="range"
                  min="0.2"
                  max="1.2"
                  step="0.05"
                  value={minorR}
                  onChange={(e) => setMinorR(parseFloat(e.target.value))}
                  className="w-14 accent-cyan-500 h-1 bg-slate-800 rounded"
                />
              </label>
            </div>
          }
        />

        {controls.mode === 'Mathematical' && (
          <div className="p-6 bg-slate-900/90 backdrop-blur rounded-2xl border border-cyan-500/30 text-xs text-slate-300 shadow-xl">
            <h4 className="font-cinzel text-sm font-bold text-cyan-300 mb-2">Torus Topology & Homotopy Group</h4>
            <p className="mb-2 leading-relaxed">
              Topologically, the torus is the Cartesian product of two circles <KaTeXMath math="T^2 = S^1 \times S^1" />. Its fundamental group has two independent non-contractible generators:
            </p>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-center my-2">
              <KaTeXMath math="\pi_1(T^2) \cong \mathbb{Z} \times \mathbb{Z}, \quad \chi(T^2) = 2 - 2g = 0" block />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
