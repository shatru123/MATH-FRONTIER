import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalControls, UniversalControlState } from './UniversalControls';
import { KaTeXMath } from '../common/KaTeXMath';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { IntuitionVsMath } from '../common/IntuitionVsMath';
import { RotateCcw, Eye, Sparkles, Compass, AlertCircle, Layers } from 'lucide-react';

interface TribarMeshProps {
  wireframe: boolean;
  isPlaying: boolean;
  speed: number;
  colorTheme: 'shutterstock' | 'monochrome' | 'neon';
  showGapIndicator: boolean;
}

// Tribar constructed in 3D with a calibrated depth gap
const TribarMesh: React.FC<TribarMeshProps> = ({
  wireframe,
  isPlaying,
  speed,
  colorTheme,
  showGapIndicator
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && isPlaying) {
      groupRef.current.rotation.y += delta * 0.3 * speed;
    }
  });

  // Material colors based on selected theme
  const colors = useMemo(() => {
    if (colorTheme === 'shutterstock') {
      return {
        top: '#06b6d4',     // Cyan
        right: '#f59e0b',   // Amber
        left: '#8b5cf6',    // Violet
        gap: '#ef4444'      // Red gap indicator
      };
    }
    if (colorTheme === 'neon') {
      return {
        top: '#10b981',     // Emerald
        right: '#ec4899',   // Pink
        left: '#3b82f6',    // Blue
        gap: '#e11d48'      // Rose
      };
    }
    return {
      top: '#e2e8f0',
      right: '#94a3b8',
      left: '#64748b',
      gap: '#ef4444'
    };
  }, [colorTheme]);

  // Construct the 3 arms of the Penrose Triangle
  // Arm dimensions
  const beamWidth = 0.8;
  const armLength = 4.2;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Arm 1: Bottom horizontal beam along X-axis */}
      <mesh position={[armLength / 2 - beamWidth / 2, -armLength / 2, 0]}>
        <boxGeometry args={[armLength, beamWidth, beamWidth]} />
        <meshStandardMaterial
          color={colors.top}
          wireframe={wireframe}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Arm 2: Left vertical/slanted beam along Y-axis */}
      <mesh position={[-beamWidth / 2, 0, 0]}>
        <boxGeometry args={[beamWidth, armLength - beamWidth, beamWidth]} />
        <meshStandardMaterial
          color={colors.left}
          wireframe={wireframe}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Arm 3A: Top arm extending forward in Z toward viewer */}
      <mesh position={[-beamWidth / 2, armLength / 2 - beamWidth / 2, armLength / 4]}>
        <boxGeometry args={[beamWidth, beamWidth, armLength / 2]} />
        <meshStandardMaterial
          color={colors.right}
          wireframe={wireframe}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Arm 3B: Slanted downward arm connecting toward bottom-right but ending with a depth gap */}
      {/* Rotated beam positioned in 3D so its projection lines up from isometric angle */}
      <mesh
        position={[armLength / 2 - 0.2, -armLength / 4 + 0.3, armLength / 2 - 0.4]}
        rotation={[0.615, 0.523, -0.785]}
      >
        <boxGeometry args={[beamWidth * 0.95, armLength * 1.05, beamWidth * 0.95]} />
        <meshStandardMaterial
          color={colors.right}
          wireframe={wireframe}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Visual Gap Indicator if enabled */}
      {showGapIndicator && (
        <mesh position={[armLength - beamWidth, -armLength / 2, armLength / 2 - 0.4]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color={colors.gap} wireframe={true} />
        </mesh>
      )}
    </group>
  );
};

// Camera Controller for Illusion Alignment vs Free Orbit
const CameraAligner: React.FC<{ targetPosition: [number, number, number] | null }> = ({
  targetPosition
}) => {
  const { camera } = useThree();

  useFrame(() => {
    if (targetPosition) {
      camera.position.lerp(new THREE.Vector3(...targetPosition), 0.08);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

export const PenroseTriangleScene: React.FC = () => {
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

  const [colorTheme, setColorTheme] = useState<'shutterstock' | 'monochrome' | 'neon'>('shutterstock');
  const [showGapIndicator, setShowGapIndicator] = useState<boolean>(false);
  const [targetCamPos, setTargetCamPos] = useState<[number, number, number] | null>([5.5, 5.5, 5.5]);
  const [isIllusionAligned, setIsIllusionAligned] = useState<boolean>(true);

  const snapToIllusion = () => {
    setTargetCamPos([5.5, 5.5, 5.5]);
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
          camera={{ position: [5.5, 5.5, 5.5], fov: 40 }}
          onPointerDown={unlockFreeOrbit}
        >
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 15, 10]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <pointLight position={[0, 5, 5]} intensity={0.8} />

          <ErrorBoundary fallbackTitle="Could not render 3D Penrose Triangle.">
            <TribarMesh
              wireframe={controls.wireframe}
              isPlaying={controls.isPlaying}
              speed={controls.speed}
              colorTheme={colorTheme}
              showGapIndicator={showGapIndicator}
            />
          </ErrorBoundary>

          <CameraAligner targetPosition={targetCamPos} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            onStart={unlockFreeOrbit}
          />

          {controls.showAxes && <axesHelper args={[5]} />}
          {controls.showGrid && (
            <gridHelper args={[16, 16, '#334155', '#1e293b']} position={[0, -3.2, 0]} />
          )}
        </Canvas>

        {/* Top Control Overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <button
            onClick={snapToIllusion}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg ${
              isIllusionAligned
                ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400'
                : 'bg-slate-900/90 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/20'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {isIllusionAligned ? '✓ Aligned to Impossible Tribar' : 'Snap to Illusion Vantage'}
          </button>

          <button
            onClick={() => setShowGapIndicator((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
              showGapIndicator
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {showGapIndicator ? 'Hide Physical Gap Marker' : 'Reveal Physical 3D Gap'}
          </button>
        </div>

        {/* Palette Selector */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 px-1.5">Theme:</span>
          {(['shutterstock', 'neon', 'monochrome'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setColorTheme(t)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded-lg capitalize transition-all ${
                colorTheme === t
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Bottom Status Info Banner */}
        <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-cyan-500/30 text-xs text-slate-300 max-w-md shadow-xl">
          <div className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            {isIllusionAligned ? 'Impossible 2D Projection Mode' : '3D Spatial Reality Mode'}
          </div>
          <p className="text-[11px] text-slate-300 leading-normal">
            {isIllusionAligned
              ? 'From this precise isometric vantage point, the disjoint 3D beams overlap seamlessly. Your brain synthesizes three 90° corners into an impossible triangle of 270°.'
              : 'Rotate freely to inspect the geometry! The 3D model reveals an open spatial gap in the third dimension that only closes from the illusion angle.'}
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
        intuition="The object looks like a solid physical triangle made of three identical wooden beams meeting at 90-degree right angles. It feels like you could hold it in your hand!"
        mathematics="In flat Euclidean space R³, the interior angle sum of any triangle must equal 180 degrees. Three 90-degree corners total 270 degrees, proving such a closed object cannot exist. Roger Penrose proved in 1992 using sheaf cohomology that the first cohomology group H¹(X, F) is non-trivial, proving a topological obstruction to embedding."
        mathLaTeX="\sum_{i=1}^3 \theta_i = 90^\circ + 90^\circ + 90^\circ = 270^\circ \neq 180^\circ, \quad H^1(X, \mathcal{F}) \neq 0"
      />
    </div>
  );
};
