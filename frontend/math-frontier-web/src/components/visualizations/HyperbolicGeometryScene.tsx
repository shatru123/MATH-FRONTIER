import React, { useState } from 'react';
import { Compass, Split, Sparkles } from 'lucide-react';
import { KaTeXMath } from '../common/KaTeXMath';

export const HyperbolicGeometryScene: React.FC = () => {
  const [modelType, setModelType] = useState<'hyperbolic' | 'euclidean'>('hyperbolic');
  const [numParallelLines, setNumParallelLines] = useState(5);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            Poincaré Disk & Parallel Postulate Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Comparing Euclidean flat geometry against Hyperbolic constant negative curvature (<KaTeXMath math="K = -1" />).
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setModelType('hyperbolic')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              modelType === 'hyperbolic'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hyperbolic (Poincaré Disk)
          </button>
          <button
            type="button"
            onClick={() => setModelType('euclidean')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              modelType === 'euclidean'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Euclidean (Flat Plane)
          </button>
        </div>
      </div>

      {/* SVG Canvas Model */}
      <div className="relative w-full h-[360px] rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
        <svg viewBox="-200 -200 400 400" className="w-full h-full max-w-[340px]">
          {modelType === 'hyperbolic' ? (
            <>
              {/* Poincaré Boundary Circle */}
              <circle cx="0" cy="0" r="160" fill="#020617" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 2" />
              <text x="0" y="-170" fill="#38bdf8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                Boundary at Infinity (|z| = 1)
              </text>

              {/* Central Geodesic Line L */}
              <line x1="-160" y1="0" x2="160" y2="0" stroke="#f59e0b" strokeWidth="3" />
              <text x="140" y="-8" fill="#f59e0b" fontSize="10" fontFamily="monospace">Line L</text>

              {/* Given Point P outside Line L */}
              <circle cx="0" cy="60" r="4.5" fill="#ec4899" />
              <text x="12" y="64" fill="#ec4899" fontSize="11" fontWeight="bold" fontFamily="monospace">Point P</text>

              {/* Infinitely many hyperbolic parallel lines through P that NEVER meet L */}
              {Array.from({ length: numParallelLines }).map((_, idx) => {
                const angle = -35 + idx * 18;
                const r = 160;
                // Circular arcs meeting boundary at right angles
                return (
                  <path
                    key={idx}
                    d={`M -140,${-30 + idx * 15} Q 0,${60 + (idx - 2) * 8} 140,${-30 + idx * 15}`}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    strokeOpacity={0.7}
                  />
                );
              })}
            </>
          ) : (
            <>
              {/* Euclidean Plane Grid */}
              <line x1="-180" y1="0" x2="180" y2="0" stroke="#f59e0b" strokeWidth="3" />
              <text x="140" y="-8" fill="#f59e0b" fontSize="10" fontFamily="monospace">Line L</text>

              <circle cx="0" cy="60" r="4.5" fill="#ec4899" />
              <text x="12" y="64" fill="#ec4899" fontSize="11" fontWeight="bold" fontFamily="monospace">Point P</text>

              {/* Exactly ONE parallel line through P */}
              <line x1="-180" y1="60" x2="180" y2="60" stroke="#22d3ee" strokeWidth="2.5" />
              <text x="130" y="52" fill="#22d3ee" fontSize="10" fontFamily="monospace">Unique Parallel</text>
            </>
          )}
        </svg>

        {/* Badge Overlay */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300">
          {modelType === 'hyperbolic'
            ? 'Hyperbolic: Infinitely Many Parallel Lines through P'
            : 'Euclid\'s 5th Postulate: Exactly ONE Parallel Line through P'}
        </div>
      </div>

      {/* Comparison Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="font-bold text-cyan-400 block mb-1">Hyperbolic Geometry Properties:</span>
          <ul className="space-y-1 text-slate-300 list-disc list-inside">
            <li>Constant negative Gaussian curvature <KaTeXMath math="K = -1" />.</li>
            <li>Triangle angles sum to strictly <KaTeXMath math="< 180^\circ" />.</li>
            <li>Area of triangle is proportional to angle defect: <KaTeXMath math="\text{Area} = \pi - (\alpha + \beta + \gamma)" />.</li>
            <li>Through a point not on a line, infinitely many lines never intersect it.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="font-bold text-amber-400 block mb-1">Euclidean Geometry Properties:</span>
          <ul className="space-y-1 text-slate-300 list-disc list-inside">
            <li>Zero Gaussian curvature <KaTeXMath math="K = 0" /> (flat plane).</li>
            <li>Triangle angles sum to exactly <KaTeXMath math="180^\circ" />.</li>
            <li>Parallel lines maintain constant distance everywhere.</li>
            <li>Through a point not on a line, exactly ONE parallel line exists.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
