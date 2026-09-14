import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { torusPoint } from '../../utils/mathUtils';
import { Circle, Compass, Sparkles, RotateCcw } from 'lucide-react';

interface TorusMeshProps {
  geometry: THREE.BufferGeometry;
  wireframe: boolean;
  isPlaying: boolean;
  speed: number;
  tracerPoint: THREE.Vector3 | null;
  activeCycle: 'none' | 'meridian' | 'longitude';
}

const TorusMesh: React.FC<TorusMeshProps> = ({
  geometry,
  wireframe,
  isPlaying,
  speed,
  tracerPoint,
  activeCycle
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && isPlaying && activeCycle === 'none') {
      meshRef.current.rotation.x += delta * 0.1 * speed;
      meshRef.current.rotation.y += delta * 0.15 * speed;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#0ea5e9"
          roughness={0.25}
          metalness={0.4}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          transparent
          opacity={0.9}
        />
      </mesh>

      {tracerPoint && (
        <mesh position={tracerPoint}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1.5} />
        </mesh>
      )}
    </group>
  );
};

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
  const [cameraKey, setCameraKey] = useState(0);

  // Generate torus geometry
  const geometry = useMemo(() => {
    return new THREE.TorusGeometry(majorR, minorR, 32, 64);
  }, [majorR, minorR]);

  // Cycle tracer animation in standard React lifecycle
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      if (activeCycle !== 'none' && controls.isPlaying) {
        setCycleProgress((prev) => (prev + delta * 0.8 * controls.speed) % (2 * Math.PI));
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [activeCycle, controls.isPlaying, controls.speed]);

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

  const resetCamera = () => {
    setCameraKey((prev) => prev + 1);
  };

  return (
    <ErrorBoundary fallbackTitle="Torus 3D Scene Failed">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full h-[460px] md:h-[520px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <Canvas key={cameraKey} camera={{ position: [0, 3, 5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 15, 10]} intensity={1.2} />
            <pointLight position={[-8, -5, -8]} intensity={0.6} color="#06b6d4" />
            <pointLight position={[5, 10, -5]} intensity={0.8} color="#3b82f6" />

            <TorusMesh
              geometry={geometry}
              wireframe={controls.wireframe}
              isPlaying={controls.isPlaying}
              speed={controls.speed}
              tracerPoint={tracerPoint}
              activeCycle={activeCycle}
            />

            {controls.showGrid && <gridHelper args={[10, 10, 0x334155, 0x1e293b]} />}
            {controls.showAxes && <axesHelper args={[3]} />}

            <OrbitControls enableDamping dampingFactor={0.05} maxDistance={10} minDistance={2} />
          </Canvas>

          {/* Reset Camera HUD */}
          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={resetCamera}
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-mono backdrop-blur flex items-center gap-1.5 transition-colors shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset View
            </button>
          </div>

          {/* Active Cycle Tracer Info */}
          {activeCycle !== 'none' && (
            <div className="absolute top-4 left-4 p-3 bg-slate-950/80 backdrop-blur rounded-xl border border-amber-500/30 text-xs text-amber-300 shadow-xl font-mono">
              <span className="font-bold uppercase tracking-wider block mb-0.5">
                {activeCycle === 'meridian' ? 'Meridian Cycle (Tube Wrap)' : 'Longitudinal Cycle (Hole Wrap)'}
              </span>
              Tracing generator loop in fundamental group <KaTeXMath math="\pi_1(T^2) = \mathbb{Z} \times \mathbb{Z}" />
            </div>
          )}
        </div>

        {/* Controls */}
        <UniversalControls
          state={controls}
          onChange={(updates) => setControls((c) => ({ ...c, ...updates }))}
          customButtons={
            <div className="flex flex-wrap items-center gap-3 px-2">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                Major R:
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={majorR}
                  onChange={(e) => setMajorR(parseFloat(e.target.value))}
                  className="w-16 accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
                <span className="font-mono text-slate-300 text-[10px]">{majorR.toFixed(1)}</span>
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
                  className="w-16 accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
                <span className="font-mono text-slate-300 text-[10px]">{minorR.toFixed(2)}</span>
              </label>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveCycle('none')}
                  className={`px-2 py-1 rounded transition-colors ${
                    activeCycle === 'none' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Spin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCycle('meridian')}
                  className={`px-2 py-1 rounded transition-colors ${
                    activeCycle === 'meridian' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Meridian Loop
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCycle('longitude')}
                  className={`px-2 py-1 rounded transition-colors ${
                    activeCycle === 'longitude' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Longitude Loop
                </button>
              </div>
            </div>
          }
        />

        {/* Mathematical Panel */}
        {controls.mode === 'Mathematical' && (
          <div className="p-6 bg-slate-900/90 backdrop-blur rounded-2xl border border-cyan-500/30 text-xs text-slate-300 shadow-xl space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-cyan-300">Parametric Torus Equations</h4>
            <div className="space-y-1 font-mono text-xs">
              <KaTeXMath math="x(u, v) = (R + r \cos v) \cos u" block />
              <KaTeXMath math="y(u, v) = (R + r \cos v) \sin u" block />
              <KaTeXMath math="z(u, v) = r \sin v, \quad u, v \in [0, 2\pi]" block />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              Euler characteristic <KaTeXMath math="\chi = V - E + F = 2 - 2g = 0" /> (for genus <KaTeXMath math="g=1" />). The fundamental group <KaTeXMath math="\pi_1(T^2) \cong \mathbb{Z} \times \mathbb{Z}" /> is abelian with two independent generators: the meridian and longitude loops.
            </p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
