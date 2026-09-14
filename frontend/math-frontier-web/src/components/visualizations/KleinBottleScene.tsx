import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { kleinBottlePoint } from '../../utils/mathUtils';
import { Sparkles, Layers, Scissors, Info, RotateCcw, Bug, Eye, BookOpen } from 'lucide-react';

interface KleinBottleMeshProps {
  geometry: THREE.BufferGeometry;
  wireframe: boolean;
  transparency: number;
  isPlaying: boolean;
  speed: number;
  traceProgress: number;
  showTrace: boolean;
}

// Inner mesh component that safely uses useFrame inside Canvas
const KleinBottleMesh: React.FC<KleinBottleMeshProps> = ({
  geometry,
  wireframe,
  transparency,
  isPlaying,
  speed,
  traceProgress,
  showTrace
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const tracerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.y += delta * 0.25 * speed;
    }
  });

  // Calculate moving surface tracer coordinates (u in [0, 4pi], v in [0, 2pi])
  const tracerPos = useMemo(() => {
    if (!showTrace) return null;
    const u = traceProgress * 4 * Math.PI;
    const v = (traceProgress * 6 * Math.PI) % (2 * Math.PI);
    const [x, y, z] = kleinBottlePoint(u % (2 * Math.PI), v, 2);
    return new THREE.Vector3(x * 0.7, z * 0.7, y * 0.7);
  }, [showTrace, traceProgress]);

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#8b5cf6"
          roughness={0.25}
          metalness={0.4}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          transparent
          opacity={transparency}
        />
      </mesh>

      {tracerPos && (
        <mesh position={tracerPos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} />
        </mesh>
      )}
    </group>
  );
};

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
  const [showTrace, setShowTrace] = useState(true);
  const [traceProgress, setTraceProgress] = useState(0);
  const [cameraKey, setCameraKey] = useState(0);
  const [guidedStep, setGuidedStep] = useState(0);

  // Animate surface tracer progress in normal React state
  React.useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      if (controls.isPlaying) {
        setTraceProgress((prev) => (prev + delta * 0.08 * controls.speed) % 1);
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [controls.isPlaying, controls.speed]);

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

  const resetCamera = () => {
    setCameraKey((prev) => prev + 1);
  };

  const guidedSteps = [
    {
      title: '1. What is a Klein Bottle?',
      body: 'A closed 2D surface with zero boundary curves that has only one side. Unlike a sphere or doughnut, it has no inside and no outside.'
    },
    {
      title: '2. The 3D Self-Intersection Artifact',
      body: 'The self-intersecting "neck" passing through the wall is an artifact of 3D space! By the Whitney Embedding Theorem, every smooth compact n-manifold smoothly embeds in 2n dimensions. In 4-dimensional Euclidean space, the neck passes around the wall with zero self-intersection.'
    },
    {
      title: '3. Relationship to the Möbius Strip',
      body: 'If you slice a Klein bottle along its plane of symmetry, it does not fall into two bottles. Instead, it unzips into exactly two mirror-image Möbius strips!'
    },
    {
      title: '4. Non-Orientability in Action',
      body: 'Watch the cyan tracer point: traveling smoothly along the surface, it traverses through the neck and around the exterior, completely flipping its perceived orientation without ever passing through a boundary edge.'
    }
  ];

  return (
    <ErrorBoundary fallbackTitle="Klein Bottle 3D Scene Failed">
      <div className="flex flex-col gap-4 w-full">
        {/* 3D Canvas Viewport */}
        <div className="relative w-full h-[480px] md:h-[540px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <Canvas key={cameraKey} camera={{ position: [0, 2.5, 4.5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[8, 12, 8]} intensity={1.2} />
            <pointLight position={[-8, -5, -8]} intensity={0.6} color="#8b5cf6" />
            <pointLight position={[5, 8, -5]} intensity={0.8} color="#ec4899" />

            <KleinBottleMesh
              geometry={geometry}
              wireframe={controls.wireframe}
              transparency={transparency}
              isPlaying={controls.isPlaying}
              speed={controls.speed}
              traceProgress={traceProgress}
              showTrace={showTrace}
            />

            {controls.showGrid && <gridHelper args={[10, 10, 0x334155, 0x1e293b]} />}
            {controls.showAxes && <axesHelper args={[3]} />}

            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              maxDistance={12}
              minDistance={1.8}
            />
          </Canvas>

          {/* Quick HUD controls inside canvas */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={resetCamera}
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-mono backdrop-blur flex items-center gap-1.5 transition-colors shadow-lg"
              title="Reset 3D Camera View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset View
            </button>
            <button
              type="button"
              onClick={() => setShowTrace((prev) => !prev)}
              className={`p-2 rounded-xl border text-xs font-mono backdrop-blur flex items-center gap-1.5 transition-colors shadow-lg ${
                showTrace
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400'
              }`}
              title="Toggle Surface Tracing Bug"
            >
              <Bug className="w-3.5 h-3.5" />
              {showTrace ? 'Tracing Active' : 'Tracer Off'}
            </button>
          </div>

          {/* Topological Insight Box */}
          <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-purple-500/30 text-xs text-slate-300 max-w-md shadow-xl">
            <div className="flex items-center gap-1.5 font-bold text-purple-400 uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              Closed Non-Orientable 2-Manifold
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Euler characteristic <KaTeXMath math="\chi = 0" />. Fundamental group <KaTeXMath math="\pi_1 = \langle a, b \mid aba^{-1}b = 1 \rangle" />. The 3D self-intersection is an immersion artifact; in 4D Euclidean space <KaTeXMath math="\mathbb{R}^4" />, the Klein bottle embeds without self-intersecting!
            </p>
          </div>
        </div>

        {/* Universal Control Toolbar */}
        <UniversalControls
          state={controls}
          onChange={(updates) => setControls((c) => ({ ...c, ...updates }))}
          customButtons={
            <div className="flex items-center gap-4 px-2">
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
                  className="w-16 accent-purple-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
                <span className="font-mono text-slate-300 text-[10px]">{Math.round(crossSection * 100)}%</span>
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
                  className="w-14 accent-purple-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </label>
            </div>
          }
        />

        {/* Guided Mode View */}
        {controls.mode === 'Guided' && (
          <div className="p-6 bg-slate-900/90 backdrop-blur rounded-2xl border border-purple-500/30 text-xs text-slate-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-cinzel text-sm font-bold text-purple-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Guided Topological Walkthrough
              </h4>
              <div className="flex items-center gap-1">
                {guidedSteps.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGuidedStep(idx)}
                    className={`w-6 h-6 rounded-full font-mono text-[10px] font-bold transition-all ${
                      guidedStep === idx
                        ? 'bg-purple-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-100 text-sm">{guidedSteps[guidedStep].title}</h5>
              <p className="text-slate-300 leading-relaxed">{guidedSteps[guidedStep].body}</p>
            </div>
          </div>
        )}

        {/* Mathematical Mode View */}
        {controls.mode === 'Mathematical' && (
          <div className="p-6 bg-slate-900/90 backdrop-blur rounded-2xl border border-purple-500/30 text-xs text-slate-300 shadow-xl space-y-4">
            <h4 className="font-cinzel text-sm font-bold text-purple-300">Figure-8 Parametric Immersion</h4>
            <div className="space-y-2 font-mono text-xs">
              <KaTeXMath
                math="x(u, v) = \left(r + \cos\frac{u}{2}\sin v - \sin\frac{u}{2}\sin 2v\right)\cos u"
                block
              />
              <KaTeXMath
                math="y(u, v) = \left(r + \cos\frac{u}{2}\sin v - \sin\frac{u}{2}\sin 2v\right)\sin u"
                block
              />
              <KaTeXMath
                math="z(u, v) = \sin\frac{u}{2}\sin v + \cos\frac{u}{2}\sin 2v, \quad u, v \in [0, 2\pi]"
                block
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-[11px]">
              <div>
                <span className="font-bold text-slate-200 block mb-1">Homology & Cohomology</span>
                <p className="text-slate-400">
                  <KaTeXMath math="H_0(K) = \mathbb{Z}, \quad H_1(K) = \mathbb{Z} \oplus \mathbb{Z}_2, \quad H_2(K) = 0" />
                  <br />
                  The non-trivial torsion component <KaTeXMath math="\mathbb{Z}_2" /> reflects non-orientability.
                </p>
              </div>
              <div>
                <span className="font-bold text-slate-200 block mb-1">Square Edge Identification</span>
                <p className="text-slate-400">
                  Identifies opposite edges of a unit square: <KaTeXMath math="(x, 0) \sim (x, 1)" /> and <KaTeXMath math="(0, y) \sim (1, 1-y)" /> (reversing orientation on the second pair).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
