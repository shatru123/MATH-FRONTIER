import React from 'react';
import {
  Compass,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Grid,
  Layers,
  Sparkles,
  BookOpen,
  Code2
} from 'lucide-react';
import { VisualizationMode } from '../../types/math';

export interface UniversalControlState {
  mode: VisualizationMode;
  wireframe: boolean;
  isPlaying: boolean;
  showAxes: boolean;
  showGrid: boolean;
  showTrail: boolean;
  isFullscreen: boolean;
  speed: number;
}

interface UniversalControlsProps {
  state: UniversalControlState;
  onChange: (updates: Partial<UniversalControlState>) => void;
  onResetCamera?: () => void;
  onToggleFullscreen?: () => void;
  availableModes?: VisualizationMode[];
  customButtons?: React.ReactNode;
}

export const UniversalControls: React.FC<UniversalControlsProps> = ({
  state,
  onChange,
  onResetCamera,
  onToggleFullscreen,
  availableModes = ['Explore', 'Guided', 'Mathematical'],
  customButtons
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 shadow-xl">
      {/* Mode Selectors */}
      <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
        {availableModes.includes('Explore') && (
          <button
            type="button"
            onClick={() => onChange({ mode: 'Explore' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              state.mode === 'Explore'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'hover:text-cyan-400 text-slate-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>
        )}

        {availableModes.includes('Guided') && (
          <button
            type="button"
            onClick={() => onChange({ mode: 'Guided' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              state.mode === 'Guided'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'hover:text-purple-400 text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guided</span>
          </button>
        )}

        {availableModes.includes('Mathematical') && (
          <button
            type="button"
            onClick={() => onChange({ mode: 'Mathematical' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              state.mode === 'Mathematical'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'hover:text-amber-400 text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Formulas</span>
          </button>
        )}
      </div>

      {/* Toggles & Custom buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        {customButtons}

        {/* Play/Pause */}
        <button
          type="button"
          onClick={() => onChange({ isPlaying: !state.isPlaying })}
          className={`p-2 rounded-lg border transition-all ${
            state.isPlaying
              ? 'bg-slate-800 border-slate-700 text-cyan-400'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title={state.isPlaying ? 'Pause Animation' : 'Play Animation'}
        >
          {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Wireframe toggle */}
        <button
          type="button"
          onClick={() => onChange({ wireframe: !state.wireframe })}
          className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
            state.wireframe
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Wireframe Mesh"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Wireframe</span>
        </button>

        {/* Grid toggle */}
        <button
          type="button"
          onClick={() => onChange({ showGrid: !state.showGrid })}
          className={`p-2 rounded-lg border transition-all ${
            state.showGrid
              ? 'bg-slate-800 border-slate-700 text-cyan-400'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Spatial Grid"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Reset Camera */}
        {onResetCamera && (
          <button
            type="button"
            onClick={onResetCamera}
            className="p-2 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="Reset View Orientation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Fullscreen */}
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title={state.isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {state.isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
