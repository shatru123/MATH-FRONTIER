import React, { useState, useMemo } from 'react';
import { Play, TrendingUp, AlertCircle, Sparkles, Layers } from 'lucide-react';
import { generateCollatzSequence, CollatzResult } from '../../utils/mathUtils';
import { KaTeXMath } from '../common/KaTeXMath';

export const CollatzLab: React.FC = () => {
  const [inputVal, setInputVal] = useState('27');
  const [compareVal, setCompareVal] = useState('31');
  const [enableCompare, setEnableCompare] = useState(false);

  const mainResult = useMemo<CollatzResult | null>(() => {
    const n = parseInt(inputVal);
    if (isNaN(n) || n <= 0) return null;
    try {
      return generateCollatzSequence(n);
    } catch {
      return null;
    }
  }, [inputVal]);

  const compareResult = useMemo<CollatzResult | null>(() => {
    if (!enableCompare) return null;
    const n = parseInt(compareVal);
    if (isNaN(n) || n <= 0) return null;
    try {
      return generateCollatzSequence(n);
    } catch {
      return null;
    }
  }, [compareVal, enableCompare]);

  // Generate SVG path for trajectory
  const renderTrajectorySvg = () => {
    if (!mainResult) return null;

    const maxSteps = Math.max(
      mainResult.sequence.length,
      compareResult ? compareResult.sequence.length : 0
    );
    const maxVal = Math.max(
      mainResult.maxExcursion,
      compareResult ? compareResult.maxExcursion : 0
    );

    const width = 600;
    const height = 260;
    const pad = 30;

    const toX = (step: number) => pad + (step / (maxSteps - 1 || 1)) * (width - 2 * pad);
    const toY = (val: number) => height - pad - (Math.log10(val) / Math.log10(maxVal || 1)) * (height - 2 * pad);

    const mainPoints = mainResult.sequence.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
    const comparePoints = compareResult?.sequence.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Horizontal grid lines */}
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#334155" strokeWidth="1" />
        <line x1={pad} y1={pad} x2={width - pad} y2={pad} stroke="#1e293b" strokeDasharray="4 2" />

        {/* Comparison path */}
        {comparePoints && (
          <polyline
            points={comparePoints}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeOpacity="0.8"
          />
        )}

        {/* Main path */}
        <polyline
          points={mainPoints}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
        />

        {/* Start Point */}
        <circle cx={toX(0)} cy={toY(mainResult.sequence[0])} r="4" fill="#38bdf8" />
        {/* End Point (1) */}
        <circle cx={toX(mainResult.sequence.length - 1)} cy={toY(1)} r="5" fill="#10b981" />
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Collatz Conjecture Trajectory Lab (3n + 1)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Test any integer. Verified computationally past <KaTeXMath math="2^{68}" /> — but large numbers never equal proof.
          </p>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400">n =</label>
          <input
            type="number"
            min="1"
            max="1000000"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-24 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500"
          />

          <button
            type="button"
            onClick={() => setEnableCompare(!enableCompare)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              enableCompare
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Compare
          </button>
        </div>
      </div>

      {enableCompare && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300">
          <span>Compare against second starting integer: n₂ =</span>
          <input
            type="number"
            min="1"
            max="1000000"
            value={compareVal}
            onChange={(e) => setCompareVal(e.target.value)}
            className="w-24 px-2 py-1 rounded bg-slate-950 border border-purple-700 text-purple-300 font-mono text-xs focus:outline-none"
          />
        </div>
      )}

      {/* Metrics Row */}
      {mainResult && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Starting Number</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{inputVal}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Stopping Time</span>
            <span className="text-xl font-bold font-mono text-cyan-300">{mainResult.totalStoppingTime} steps</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Peak Excursion</span>
            <span className="text-xl font-bold font-mono text-amber-400">{mainResult.maxExcursion.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Final Convergence</span>
            <span className="text-xl font-bold font-mono text-emerald-400">4 → 2 → 1</span>
          </div>
        </div>
      )}

      {/* Trajectory Graph */}
      <div className="relative w-full h-[280px] rounded-2xl bg-slate-950 border border-slate-800 p-2 overflow-hidden shadow-inner">
        {renderTrajectorySvg()}
        <div className="absolute top-3 left-3 flex items-center gap-3 text-[11px] font-mono">
          <span className="text-cyan-400 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> n = {inputVal}
          </span>
          {enableCompare && compareResult && (
            <span className="text-purple-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> n₂ = {compareVal}
            </span>
          )}
        </div>
      </div>

      {/* Sequence Chips */}
      {mainResult && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-slate-400">Generated Orbit Sequence (first 30 steps):</span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs font-mono text-slate-300">
            {mainResult.sequence.slice(0, 30).map((num, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded ${
                  num === 1
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : num % 2 === 0
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-cyan-950/50 text-cyan-300 border border-cyan-800/40'
                }`}
              >
                {num}
              </span>
            ))}
            {mainResult.sequence.length > 30 && (
              <span className="text-slate-500 px-2 py-0.5">... +{mainResult.sequence.length - 30} more</span>
            )}
          </div>
        </div>
      )}

      {/* Strict Mathematical Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block mb-1">Mathematical Principle: Computational Verification is Not Proof</strong>
          Even if millions of numbers converge to 1 on your screen, in number theory patterns can persist for trillions of values before suddenly failing (e.g. Mertens conjecture, Skewes' number). The Collatz Conjecture remains entirely unproved for the general case.
        </div>
      </div>
    </div>
  );
};
