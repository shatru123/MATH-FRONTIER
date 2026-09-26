import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { IntuitionVsMath } from '../common/IntuitionVsMath';
import { RotateCcw, Eye, Play, Pause, AlertTriangle, Layers, Footprints } from 'lucide-react';

interface StairsMeshProps {
  wireframe: boolean;
  isPlaying: boolean;
  speed: number;
  ballStepProgress: number;
  showElevationDrop: boolean;
}

const PenroseStairsGeometry: React.FC<StairsMeshProps> = ({
  wireframe,
  ballStepProgress,
  showElevationDrop
}) => {
  const stepsPerFlight = 4;
  const stepWidth = 1.0;
  const stepDepth = 0.8;
  const stepHeight = 0.35;

  // Build the 4 flights of stairs
  // Flight 1: along +X (starts at [-1.5, 0, -1.5])
  // Flight 2: along +Z
  // Flight 3: along -X
  // Flight 4: along -Z
  const stepBoxes = useMemo(() => {
    const list: Array<{ position: [number, number, number]; size: [number, number, number]; flight: number; index: number }> = [];

    // Total 16 steps
    let currentX = -1.6;
    let currentY = 0;
    let currentZ = -1.6;

    // Flight 1: 4 steps going +X
    for (let i = 0; i < stepsPerFlight; i++) {
      list.push({
        position: [currentX + i * stepDepth, currentY + i * stepHeight, currentZ],
        size: [stepDepth * 0.98, (currentY + i * stepHeight + stepHeight) * 2, stepWidth],
        flight: 1,
        index: i
      });
    }

    // Flight 2: 4 steps going +Z
    const endF1X = currentX + (stepsPerFlight - 1) * stepDepth;
    const endF1Y = currentY + (stepsPerFlight - 1) * stepHeight;
    for (let i = 1; i <= stepsPerFlight; i++) {
      list.push({
        position: [endF1X, endF1Y + i * stepHeight, currentZ + i * stepDepth],
        size: [stepWidth, (endF1Y + i * stepHeight + stepHeight) * 2, stepDepth * 0.98],
        flight: 2,
        index: stepsPerFlight - 1 + i
      });
    }

    // Flight 3: 4 steps going -X
    const endF2Z = currentZ + stepsPerFlight * stepDepth;
    const endF2Y = endF1Y + stepsPerFlight * stepHeight;
    for (let i = 1; i <= stepsPerFlight; i++) {
      list.push({
        position: [endF1X - i * stepDepth, endF2Y + i * stepHeight, endF2Z],
        size: [stepDepth * 0.98, (endF2Y + i * stepHeight + stepHeight) * 2, stepWidth],
        flight: 3,
        index: 2 * stepsPerFlight - 1 + i
      });
    }

    // Flight 4: 4 steps going -Z
    const endF3X = endF1X - stepsPerFlight * stepDepth;
    const endF3Y = endF2Y + stepsPerFlight * stepHeight;
    for (let i = 1; i <= stepsPerFlight; i++) {
      list.push({
        position: [endF3X, endF3Y + i * stepHeight, endF2Z - i * stepDepth],
        size: [stepWidth, (endF3Y + i * stepHeight + stepHeight) * 2, stepDepth * 0.98],
        flight: 4,
        index: 3 * stepsPerFlight - 1 + i
      });
    }

    return list;
  }, []);

  // Compute marble position from perpetual progress (0 to 16)
  const marblePos = useMemo(() => {
    const totalSteps = stepBoxes.length;
    const idx = Math.floor(ballStepProgress) % totalSteps;
    const nextIdx = (idx + 1) % totalSteps;
    const frac = ballStepProgress - Math.floor(ballStepProgress);

    const b1 = stepBoxes[idx];
    const b2 = stepBoxes[nextIdx];

    const yOffset = b1.size[1] / 2 + 0.25;
    const x = THREE.MathUtils.lerp(b1.position[0], b2.position[0], frac);
    const y = THREE.MathUtils.lerp(b1.position[1] + yOffset, b2.position[1] + (b2.size[1] / 2 + 0.25), frac);
    const z = THREE.MathUtils.lerp(b1.position[2], b2.position[2], frac);

    return [x, y, z] as [number, number, number];
  }, [ballStepProgress, stepBoxes]);

  return (
    <group position={[0, -2.5, 0]}>
      {/* Individual steps */}
      {stepBoxes.map((step, idx) => {
        // Flight colors: Escher-like architectural gradient
        const flightColors = ['#0284c7', '#0d9488', '#d97706', '#9333ea'];
        const color = flightColors[step.flight - 1];

        return (
          <mesh key={idx} position={step.position}>
            <boxGeometry args={step.size} />
            <meshStandardMaterial
              color={color}
              wireframe={wireframe}
              roughness={0.3}
              metalness={0.15}
            />
          </mesh>
        );
      })}

      {/* Perpetual Climbing Marble */}
      <mesh position={marblePos}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#e11d48"
          emissiveIntensity={0.6}
          roughness={0.1}
        />
      </mesh>

      {/* Elevation Drop Pillar Indicator */}
      {showElevationDrop && (
        <mesh position={[-1.6, 2.5, -1.6]}>
          <cylinderGeometry args={[0.08, 0.08, 5.0, 16]} />
          <meshBasicMaterial color="#ef4444" wireframe={true} />
        </mesh>
      )}
    </group>
  );
};

// Camera Controller
const CameraController: React.FC<{ targetPos: [number, number, number] | null }> = ({ targetPos }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (targetPos) {
      camera.position.lerp(new THREE.Vector3(...targetPos), 0.08);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

export const PenroseStairsScene: React.FC = () => {
  const [controls, setControls] = useState<UniversalControlState>({
    mode: 'Explore',
    wireframe: false,
    isPlaying: true,
    showAxes: true,
    showGrid: true,
    showTrail: false,
    isFullscreen: false,
    speed: 1
  });

  const [ballStepProgress, setBallStepProgress] = useState<number>(0);
  const [showElevationDrop, setShowElevationDrop] = useState<boolean>(false);
  const [targetCamPos, setTargetCamPos] = useState<[number, number, number] | null>([7.5, 8.5, 7.5]);
  const [isIllusionAligned, setIsIllusionAligned] = useState<boolean>(true);

  // Perpetual climbing animation
  const animRef = useRef<number | null>(null);
  React.useEffect(() => {
    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (controls.isPlaying) {
        setBallStepProgress((prev) => (prev + dt * 2.2 * controls.speed) % 16);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [controls.isPlaying, controls.speed]);

  const snapToIllusion = () => {
    setTargetCamPos([7.5, 8.5, 7.5]);
    setIsIllusionAligned(true);
  };

  const showSideProfile = () => {
    setTargetCamPos([11, 2, 0]);
    setIsIllusionAligned(false);
    setShowElevationDrop(true);
  };

  const unlockFreeOrbit = () => {
    setTargetCamPos(null);
    setIsIllusionAligned(false);
  };

  return (
    <div className="space-y-4">
      {/* 3D Viewport Card */}
      <div className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
        <Canvas
          camera={{ position: [7.5, 8.5, 7.5], fov: 38 }}
          onPointerDown={unlockFreeOrbit}
        >
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[12, 20, 10]} intensity={1.6} />
          <directionalLight position={[-10, -5, -8]} intensity={0.5} />
          <pointLight position={[0, 6, 0]} intensity={0.8} />

          <ErrorBoundary fallbackTitle="Could not render 3D Penrose Stairs.">
            <PenroseStairsGeometry
              wireframe={controls.wireframe}
              isPlaying={controls.isPlaying}
              speed={controls.speed}
              ballStepProgress={ballStepProgress}
              showElevationDrop={showElevationDrop}
            />
          </ErrorBoundary>

          <CameraController targetPos={targetCamPos} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            onStart={unlockFreeOrbit}
          />

          {controls.showAxes && <axesHelper args={[5]} />}
          {controls.showGrid && (
            <gridHelper args={[16, 16, '#334155', '#1e293b']} position={[0, -2.8, 0]} />
          )}
        </Canvas>

        {/* Top Control Overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <button
            onClick={snapToIllusion}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg ${
              isIllusionAligned
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                : 'bg-slate-900/90 text-amber-400 border border-amber-500/40 hover:bg-amber-500/20'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {isIllusionAligned ? '✓ Aligned to Endless Loop' : 'Snap to Endless Illusion'}
          </button>

          <button
            onClick={showSideProfile}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs bg-slate-900/80 border border-slate-700 text-rose-300 hover:bg-rose-500/20 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Reveal 3D Elevation Drop
          </button>
        </div>

        {/* Step Tracker Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-950/85 p-2 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
          <Footprints className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Step {Math.floor(ballStepProgress) + 1} / 16</span>
          <span className="text-[10px] text-amber-400 uppercase">
            Flight {Math.floor(ballStepProgress / 4) + 1}
          </span>
        </div>

        {/* Bottom Status Info Banner */}
        <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-amber-500/30 text-xs text-slate-300 max-w-md shadow-xl">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            {isIllusionAligned ? 'Endless Loop Perspective' : 'True 3D Spatial Cliff'}
          </div>
          <p className="text-[11px] text-slate-300 leading-normal">
            {isIllusionAligned
              ? 'Every flight ascends upward, yet the red marble completes an infinite loop without ever reaching the sky. The perspective projection tricks the eye by concealing the elevation gap between the 16th and 1st step.'
              : 'From the side, the reality is obvious: each flight gains height, resulting in a large vertical cliff. In 3D space, no physical staircase can climb forever and return to its origin.'}
          </p>
        </div>
      </div>

      {/* Universal Controls Bar */}
      <UniversalControls
        state={controls}
        onChange={(updates) => setControls((prev) => ({ ...prev, ...updates }))}
        onResetCamera={snapToIllusion}
        availableModes={['Explore', 'Guided', 'Mathematical']}
      />

      {/* Intuition vs Mathematical Reality */}
      <IntuitionVsMath
        intuition="If you step upward 16 consecutive times, you must be 16 steps higher than where you started. Yet here, you return to the exact same step! Could a perpetual motion machine extract limitless energy by walking down forever?"
        mathematics="In vector calculus, conservative force fields like Newtonian gravity satisfy the fundamental theorem for line integrals: the line integral around any closed loop must equal zero. A true Penrose staircase would imply a non-zero circulation of gravity, which violates the second law of thermodynamics and Stokes' theorem."
        mathLaTeX="\oint_C \nabla \Phi \cdot d\mathbf{r} = 0 \quad \text{(Physics)}, \quad \sum_{k=1}^{16} \Delta h_k = 16 \Delta h > 0 \quad \text{(Impossible Loop)}"
      />
    </div>
  );
};
