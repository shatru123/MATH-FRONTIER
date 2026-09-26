import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { IntuitionVsMath } from '../common/IntuitionVsMath';
import { Eye, RotateCcw, Sparkles, Box, Info } from 'lucide-react';

interface ImpossibleCubeMeshProps {
  wireframe: boolean;
  isPlaying: boolean;
  speed: number;
  highlightCrossings: boolean;
}

const ImpossibleCubeMesh: React.FC<ImpossibleCubeMeshProps> = ({
  wireframe,
  isPlaying,
  speed,
  highlightCrossings
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && isPlaying) {
      groupRef.current.rotation.y += delta * 0.3 * speed;
    }
  });

  const beamRadius = 0.16;
  const size = 2.4;
  const half = size / 2;

  // Build the 12 beams of the impossible cube
  // We offset the vertical front-left and front-right beams so they skew from front to back
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 4 Bottom Beams (Normal Square Base) */}
      <mesh position={[0, -half, -half]}>
        <boxGeometry args={[size, beamRadius * 2, beamRadius * 2]} />
        <meshStandardMaterial color="#06b6d4" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, -half, half]}>
        <boxGeometry args={[size, beamRadius * 2, beamRadius * 2]} />
        <meshStandardMaterial color="#06b6d4" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-half, -half, 0]}>
        <boxGeometry args={[beamRadius * 2, beamRadius * 2, size]} />
        <meshStandardMaterial color="#06b6d4" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[half, -half, 0]}>
        <boxGeometry args={[beamRadius * 2, beamRadius * 2, size]} />
        <meshStandardMaterial color="#06b6d4" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* 4 Top Beams (Normal Square Roof) */}
      <mesh position={[0, half, -half]}>
        <boxGeometry args={[size, beamRadius * 2, beamRadius * 2]} />
        <meshStandardMaterial color="#8b5cf6" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, half, half]}>
        <boxGeometry args={[size, beamRadius * 2, beamRadius * 2]} />
        <meshStandardMaterial color="#8b5cf6" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-half, half, 0]}>
        <boxGeometry args={[beamRadius * 2, beamRadius * 2, size]} />
        <meshStandardMaterial color="#8b5cf6" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[half, half, 0]}>
        <boxGeometry args={[beamRadius * 2, beamRadius * 2, size]} />
        <meshStandardMaterial color="#8b5cf6" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* 2 Normal Back Vertical Beams */}
      <mesh position={[-half, 0, -half]}>
        <boxGeometry args={[beamRadius * 2, size, beamRadius * 2]} />
        <meshStandardMaterial color="#3b82f6" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[half, 0, -half]}>
        <boxGeometry args={[beamRadius * 2, size, beamRadius * 2]} />
        <meshStandardMaterial color="#3b82f6" wireframe={wireframe} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Impossible Front Pillars: Crossing from front-bottom to back-top */}
      {/* Pillar A: Front-Left (starts at [-half, -half, half] but ends at [-half, half, -half * 0.4]) */}
      <mesh
        position={[-half, 0, half * 0.35]}
        rotation={[-0.32, 0, 0]}
      >
        <boxGeometry args={[beamRadius * 2, size * 1.05, beamRadius * 2]} />
        <meshStandardMaterial
          color={highlightCrossings ? '#f43f5e' : '#f59e0b'}
          wireframe={wireframe}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Pillar B: Front-Right (starts at [half, -half, half] but ends with contradictory depth) */}
      <mesh
        position={[half, 0, half * 0.35]}
        rotation={[-0.32, 0, 0]}
      >
        <boxGeometry args={[beamRadius * 2, size * 1.05, beamRadius * 2]} />
        <meshStandardMaterial
          color={highlightCrossings ? '#f43f5e' : '#f59e0b'}
          wireframe={wireframe}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Crossing Joint Spheres */}
      {highlightCrossings && (
        <>
          <mesh position={[-half, half, half]}>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshBasicMaterial color="#ef4444" wireframe={true} />
          </mesh>
          <mesh position={[half, half, half]}>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshBasicMaterial color="#ef4444" wireframe={true} />
          </mesh>
        </>
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

export const ImpossibleCubeScene: React.FC = () => {
  const [controls, setControls] = useState<UniversalControlState>({
    mode: 'Explore',
    wireframe: false,
    isPlaying: false,
    showAxes: true,
    showGrid: true,
    showTrail: false,
    isFullscreen: false,
    speed: 1
  });

  const [highlightCrossings, setHighlightCrossings] = useState<boolean>(false);
  const [targetCamPos, setTargetCamPos] = useState<[number, number, number] | null>([4.2, 3.2, 5.2]);
  const [isIllusionAligned, setIsIllusionAligned] = useState<boolean>(true);

  const snapToBelvedere = () => {
    setTargetCamPos([4.2, 3.2, 5.2]);
    setIsIllusionAligned(true);
    setControls((prev) => ({ ...prev, isPlaying: false }));
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
          camera={{ position: [4.2, 3.2, 5.2], fov: 38 }}
          onPointerDown={unlockFreeOrbit}
        >
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 15, 10]} intensity={1.5} />
          <directionalLight position={[-10, -5, -8]} intensity={0.6} />
          <pointLight position={[0, 4, 4]} intensity={0.8} />

          <ErrorBoundary fallbackTitle="Could not render 3D Impossible Cube.">
            <ImpossibleCubeMesh
              wireframe={controls.wireframe}
              isPlaying={controls.isPlaying}
              speed={controls.speed}
              highlightCrossings={highlightCrossings}
            />
          </ErrorBoundary>

          <CameraController targetPos={targetCamPos} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            onStart={unlockFreeOrbit}
          />

          {controls.showAxes && <axesHelper args={[4]} />}
          {controls.showGrid && (
            <gridHelper args={[14, 14, '#334155', '#1e293b']} position={[0, -2.5, 0]} />
          )}
        </Canvas>

        {/* Top Control Overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <button
            onClick={snapToBelvedere}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg ${
              isIllusionAligned
                ? 'bg-purple-500 text-slate-950 ring-2 ring-purple-400'
                : 'bg-slate-900/90 text-purple-400 border border-purple-500/40 hover:bg-purple-500/20'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {isIllusionAligned ? '✓ Aligned to Belvedere View' : 'Snap to Belvedere Angle'}
          </button>

          <button
            onClick={() => setHighlightCrossings((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all ${
              highlightCrossings
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            {highlightCrossings ? 'Normal Shading' : 'Highlight Paradox Struts'}
          </button>
        </div>

        {/* Bottom Status Info Banner */}
        <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-purple-500/30 text-xs text-slate-300 max-w-md shadow-xl">
          <div className="flex items-center gap-1.5 font-bold text-purple-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            {isIllusionAligned ? 'Escher Belvedere Projection' : '3D Spatial Distortion'}
          </div>
          <p className="text-[11px] text-slate-300 leading-normal">
            {isIllusionAligned
              ? 'Notice the vertical front struts: at the bottom they anchor in front of the base, but at the top they slip behind the roof frame and anchor in the rear! The 2D retina sees a coherent cube with impossible depth topology.'
              : 'Rotate the camera to unmask the illusion. The front struts are skewed backward in the Z-axis, creating the optical illusion only when viewed along the singular line of sight.'}
          </p>
        </div>
      </div>

      {/* Universal Controls Bar */}
      <UniversalControls
        state={controls}
        onChange={(updates) => setControls((prev) => ({ ...prev, ...updates }))}
        onResetCamera={snapToBelvedere}
        availableModes={['Explore', 'Guided', 'Mathematical']}
      />

      {/* Intuition vs Mathematical Reality */}
      <IntuitionVsMath
        intuition="In everyday space, if Beam A is in front of Beam B, and Beam B is in front of Beam C, then Beam A must be in front of Beam C. Depth is a natural ordering."
        mathematics="The impossible cube constructs an intransitive depth cycle: vertex 1 is in front of vertex 2, vertex 2 is in front of vertex 3, and vertex 3 is in front of vertex 1. Because the depth relation fails the axiom of transitivity, no consistent coordinate function z(x,y) can embed the figure in 3D Euclidean space."
        mathLaTeX="v_1 \prec v_2 \land v_2 \prec v_3 \land v_3 \prec v_1 \implies \text{Intransitive Depth Ordering Violation}"
      />
    </div>
  );
};
