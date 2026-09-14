import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { mobiusPoint } from '../../utils/mathUtils';
import { Play, Sparkles, Compass, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MobiusStripProps {
  initialRadius?: number;
  initialWidth?: number;
}

// 3D Inner Mesh Component
const MobiusMesh: React.FC<{
  radius: number;
  width: number;
  uSegments: number;
  vSegments: number;
  wireframe: boolean;
  twistFactor: number; // 0 for cylinder/flat strip, 1 for 180-deg mobius
  joinFactor: number; // 0 for open ribbon, 1 for closed ring
  traceType: 'none' | 'surface' | 'edge' | 'normal';
  traceProgress: number;
  isPlaying: boolean;
}> = ({
  radius,
  width,
  uSegments,
  vSegments,
  wireframe,
  twistFactor,
  joinFactor,
  traceType,
  traceProgress,
  isPlaying
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailLineRef = useRef<THREE.Line>(null);

  // Generate parametric geometry based on twistFactor & joinFactor
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const uSteps = uSegments;
    const vSteps = vSegments;

    for (let i = 0; i <= uSteps; i++) {
      const uFrac = i / uSteps;
      // When joinFactor < 1, ribbon length stretches from 0 to 2pi * joinFactor
      const u = uFrac * 2 * Math.PI * joinFactor;
      const twist = uFrac * Math.PI * twistFactor;

      for (let j = 0; j <= vSteps; j++) {
        const vFrac = j / vSteps;
        const v = (vFrac - 0.5) * 2 * width;

        let x: number, y: number, z: number;

        if (joinFactor < 0.1) {
          // Flat or unrolled strip
          x = (uFrac - 0.5) * 2 * Math.PI * radius;
          y = v * Math.cos(twist);
          z = v * Math.sin(twist);
        } else {
          // Curved strip curling into Möbius
          const currentRadius = radius;
          const cosTwist = Math.cos(twist);
          const sinTwist = Math.sin(twist);

          x = (currentRadius + v * cosTwist) * Math.cos(u);
          y = (currentRadius + v * cosTwist) * Math.sin(u);
          z = v * sinTwist;
        }

        positions.push(x, y, z);
        uvs.push(uFrac, vFrac);
      }
    }

    // Generate face indices
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
  }, [radius, width, uSegments, vSegments, twistFactor, joinFactor]);

  // Animated slow rotation
  useFrame((_, delta) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  // Calculate moving tracer point & normal
  const tracer = useMemo(() => {
    if (traceType === 'none') return null;

    if (traceType === 'surface') {
      // Travels along centerline, then loops onto opposite "side" (requires 4pi for full cycle!)
      const u = traceProgress * 4 * Math.PI;
      const [x, y, z] = mobiusPoint(u, 0, radius, 1);
      return { pos: new THREE.Vector3(x, y, z), normal: null };
    }

    if (traceType === 'edge') {
      // Travels along the single boundary curve (from v = +w to v = -w continuously over 4pi)
      const u = traceProgress * 4 * Math.PI;
      const v = width; // Boundary edge
      const [x, y, z] = mobiusPoint(u, v, radius, 1);
      return { pos: new THREE.Vector3(x, y, z), normal: null };
    }

    if (traceType === 'normal') {
      // Visualizes orientation normal vector flip over 2pi
      const u = traceProgress * 2 * Math.PI;
      const [x, y, z] = mobiusPoint(u, 0, radius, 1);
      const halfTwist = u / 2;
      // Normal vector to surface at centerline
      const nx = -Math.sin(halfTwist) * Math.cos(u);
      const ny = -Math.sin(halfTwist) * Math.sin(u);
      const nz = Math.cos(halfTwist);
      const normalVec = new THREE.Vector3(nx, ny, nz).normalize().multiplyScalar(0.8);
      return { pos: new THREE.Vector3(x, y, z), normal: normalVec };
    }

    return null;
  }, [traceType, traceProgress, radius, width]);

  return (
    <group ref={meshRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#06b6d4"
          roughness={0.25}
          metalness={0.4}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          transparent
          opacity={wireframe ? 0.7 : 0.9}
        />
      </mesh>

      {/* Tracer Sphere */}
      {tracer && (
        <mesh position={tracer.pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      )}

      {/* Normal Vector Arrow */}
      {tracer?.normal && (
        <arrowHelper
          args={[
            tracer.normal.clone().normalize(),
            tracer.pos,
            tracer.normal.length(),
            0xec4899,
            0.2,
            0.1
          ]}
        />
      )}
    </group>
  );
};

export const MobiusStripScene: React.FC<MobiusStripProps> = ({
  initialRadius = 2.2,
  initialWidth = 0.75
}) => {
  const [controls, setControls] = useState<UniversalControlState>({
    mode: 'Explore',
    wireframe: false,
    isPlaying: true,
    showAxes: false,
    showGrid: false,
    showTrail: true,
    isFullscreen: false,
    speed: 1
  });

  const [radius, setRadius] = useState(initialRadius);
  const [width, setWidth] = useState(initialWidth);
  const [uSegments, setUSegments] = useState(120);

  // Construction mode steps (1 to 5)
  const [constructionStep, setConstructionStep] = useState(5);

  // Trace features: 'none' | 'surface' | 'edge' | 'normal'
  const [traceType, setTraceType] = useState<'none' | 'surface' | 'edge' | 'normal'>('none');
  const [traceProgress, setTraceProgress] = useState(0);

  // Animate tracer
  useEffect(() => {
    if (traceType === 'none' || !controls.isPlaying) return;

    const interval = setInterval(() => {
      setTraceProgress((prev) => (prev + 0.005 * controls.speed) % 1);
    }, 16);

    return () => clearInterval(interval);
  }, [traceType, controls.isPlaying, controls.speed]);

  // Determine twist & join based on construction step
  const { twistFactor, joinFactor } = useMemo(() => {
    if (controls.mode !== 'Guided') {
      return { twistFactor: 1, joinFactor: 1 };
    }
    switch (constructionStep) {
      case 1: // Flat strip
        return { twistFactor: 0, joinFactor: 0.01 };
      case 2: // Start rotating one end (45 deg)
        return { twistFactor: 0.25, joinFactor: 0.01 };
      case 3: // Full 180 deg half-twist
        return { twistFactor: 1, joinFactor: 0.01 };
      case 4: // Bending into circle
        return { twistFactor: 1, joinFactor: 0.6 };
      case 5: // Closed completed surface
      default:
        return { twistFactor: 1, joinFactor: 1 };
    }
  }, [controls.mode, constructionStep]);

  return (
    <ErrorBoundary fallbackTitle="Möbius Strip 3D Scene Failed">
      <div className="flex flex-col gap-4 w-full">
        {/* 3D Canvas Box */}
        <div className="relative w-full h-[460px] md:h-[540px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <Canvas camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 15, 10]} intensity={1.2} />
            <pointLight position={[-10, -5, -10]} intensity={0.5} color="#38bdf8" />
            <pointLight position={[5, 10, -5]} intensity={0.8} color="#a855f7" />

            <MobiusMesh
              radius={radius}
              width={width}
              uSegments={uSegments}
              vSegments={16}
              wireframe={controls.wireframe}
              twistFactor={twistFactor}
              joinFactor={joinFactor}
              traceType={traceType}
              traceProgress={traceProgress}
              isPlaying={controls.isPlaying}
            />

            {controls.showGrid && <gridHelper args={[10, 10, 0x334155, 0x1e293b]} />}
            {controls.showAxes && <axesHelper args={[3]} />}

            <OrbitControls enableDamping dampingFactor={0.05} maxDistance={10} minDistance={1.5} />
          </Canvas>

          {/* Interactive Mode Overlays */}
          {controls.mode === 'Guided' && (
            <div className="absolute top-4 left-4 right-4 md:right-auto md:max-w-md p-4 bg-slate-950/85 backdrop-blur-md rounded-xl border border-purple-500/30 text-xs shadow-xl">
              <div className="flex items-center justify-between text-purple-400 font-bold uppercase tracking-wider mb-2">
                <span>Construction Step {constructionStep} of 5</span>
                <span className="text-[10px] text-slate-400">Animated Sequence</span>
              </div>
              <p className="text-slate-200 mb-3 leading-relaxed">
                {constructionStep === 1 && "Step 1: Start with an ordinary flat rectangular strip with length and width."}
                {constructionStep === 2 && "Step 2: Keep the left end fixed and begin rotating the right end in 3D space."}
                {constructionStep === 3 && "Step 3: Rotate the right end smoothly by exactly 180° (π radians) — one half-twist."}
                {constructionStep === 4 && "Step 4: Curve the strip into a ring, bringing the two ends toward each other."}
                {constructionStep === 5 && "Step 5: Join the ends! The strip has now become a single continuous, one-sided Möbius surface."}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={constructionStep === 1}
                  onClick={() => setConstructionStep((s) => Math.max(1, s - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 text-slate-300 hover:bg-slate-700"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={constructionStep === 5}
                  onClick={() => setConstructionStep((s) => Math.min(5, s + 1))}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 disabled:opacity-40 text-white font-semibold hover:bg-purple-500 flex items-center gap-1.5"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Active Tracer Info Overlay */}
          {traceType !== 'none' && (
            <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-amber-500/30 text-xs text-slate-300 max-w-sm shadow-xl">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                {traceType === 'surface' && 'Surface Traversal'}
                {traceType === 'edge' && 'Single Edge Traversal'}
                {traceType === 'normal' && 'Non-Orientability Vector Inversion'}
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                {traceType === 'surface' &&
                  'The point travels along the strip. After 1 loop, it appears on the "opposite" side. After 2 loops, it returns to the starting position without ever crossing an edge!'}
                {traceType === 'edge' &&
                  'Notice the tracer covers the entire perimeter in one unbroken loop. The Möbius strip has only ONE boundary curve.'}
                {traceType === 'normal' &&
                  'Watch the arrow (surface normal). When it travels around the strip once (u = 2π), it returns pointing in the OPPOSITE direction. The surface has no global orientation.'}
              </p>
            </div>
          )}

          {/* Action Tracing Bar */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTraceType(traceType === 'surface' ? 'none' : 'surface')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                traceType === 'surface'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {traceType === 'surface' ? 'Stop Trace' : 'Trace Surface'}
            </button>

            <button
              type="button"
              onClick={() => setTraceType(traceType === 'edge' ? 'none' : 'edge')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                traceType === 'edge'
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {traceType === 'edge' ? 'Stop Trace' : 'Trace Edge'}
            </button>

            <button
              type="button"
              onClick={() => setTraceType(traceType === 'normal' ? 'none' : 'normal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                traceType === 'normal'
                  ? 'bg-pink-500 text-white font-bold border-pink-400 shadow-lg shadow-pink-500/20'
                  : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {traceType === 'normal' ? 'Hide Normal' : 'Show Orientation'}
            </button>
          </div>
        </div>

        {/* Universal Controls */}
        <UniversalControls
          state={controls}
          onChange={(updates) => setControls((c) => ({ ...c, ...updates }))}
          onResetCamera={() => {
            setRadius(initialRadius);
            setWidth(initialWidth);
          }}
          customButtons={
            <div className="flex items-center gap-3 px-2">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                Radius:
                <input
                  type="range"
                  min="1.5"
                  max="3.5"
                  step="0.1"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-16 accent-cyan-500 h-1 bg-slate-800 rounded"
                />
              </label>
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                Width:
                <input
                  type="range"
                  min="0.3"
                  max="1.2"
                  step="0.05"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value))}
                  className="w-16 accent-cyan-500 h-1 bg-slate-800 rounded"
                />
              </label>
            </div>
          }
        />

        {/* Mathematical Formulation Panel (when Mathematical mode is active) */}
        {controls.mode === 'Mathematical' && (
          <div className="p-6 bg-slate-900/90 backdrop-blur rounded-2xl border border-amber-500/30 font-sans text-sm text-slate-300 shadow-2xl">
            <h4 className="font-cinzel text-base font-bold text-amber-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Parametric Construction & Topological Invariants
            </h4>
            <p className="text-slate-300 leading-relaxed mb-4">
              The standard embedding of the Möbius strip in <KaTeXMath math="\mathbb{R}^3" /> is parameterized by coordinates <KaTeXMath math="u \in [0, 2\pi]" /> and <KaTeXMath math="v \in [-w, w]" />, where <KaTeXMath math="R" /> is the major radius and <KaTeXMath math="w" /> is the strip half-width:
            </p>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-cyan-300 text-center my-3">
              <KaTeXMath
                math="x(u, v) = \left(R + v \cos\frac{u}{2}\right)\cos u, \quad y(u, v) = \left(R + v \cos\frac{u}{2}\right)\sin u, \quad z(u, v) = v \sin\frac{u}{2}"
                block
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs text-slate-400">
              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                <span className="font-bold text-slate-200">Angle parameter u:</span> Traverses around the central circle. Notice the <KaTeXMath math="u/2" /> term in the trigonometric arguments: as <KaTeXMath math="u" /> goes from <KaTeXMath math="0" /> to <KaTeXMath math="2\pi" />, the angle rotated is only <KaTeXMath math="\pi" /> (180°), producing the half-twist.
              </div>
              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                <span className="font-bold text-slate-200">Transverse parameter v:</span> Ranges across the width of the ribbon. At <KaTeXMath math="u = 2\pi" />, the point <KaTeXMath math="(u, v)" /> is glued to <KaTeXMath math="(0, -v)" />, formalizing non-orientability.
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
