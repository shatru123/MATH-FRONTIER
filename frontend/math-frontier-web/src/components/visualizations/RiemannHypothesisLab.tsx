import React, { useState } from 'react';
import { ShieldAlert, Compass, Search, Sparkles } from 'lucide-react';
import { KaTeXMath } from '../common/KaTeXMath';

// The first 10 non-trivial zeros on the critical line Re(s) = 1/2
const KNOWN_ZEROS = [
  { n: 1, gamma: 14.134725, notes: 'First non-trivial zero' },
  { n: 2, gamma: 21.022040, notes: 'Second zero' },
  { n: 3, gamma: 25.010858, notes: 'Third zero' },
  { n: 4, gamma: 30.424876, notes: 'Fourth zero' },
  { n: 5, gamma: 32.935062, notes: 'Fifth zero' },
  { n: 6, gamma: 37.586178, notes: 'Sixth zero' },
  { n: 7, gamma: 40.918719, notes: 'Seventh zero' },
  { n: 8, gamma: 43.327073, notes: 'Eighth zero' },
  { n: 9, gamma: 48.005151, notes: 'Ninth zero' },
  { n: 10, gamma: 49.773832, notes: 'Tenth zero' }
];

export const RiemannHypothesisLab: React.FC = () => {
  const [selectedZero, setSelectedZero] = useState(KNOWN_ZEROS[0]);
  const [zoomY, setZoomY] = useState(1.0);

  const width = 640;
  const height = 400;
  const originX = 140; // Re(s) = 0
  const originY = 360; // Im(s) = 0
  const scaleX = 260; // 1 unit in Re
  const scaleY = 6 * zoomY; // 1 unit in Im

  const criticalLineX = originX + 0.5 * scaleX;
  const boundaryX = originX + 1.0 * scaleX;

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      {/* Prominent Mandatory Integrity Alert */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block mb-0.5">
            Mathematical Integrity Principle: Computational Evidence is Not Proof
          </strong>
          Over 10 trillion non-trivial zeros have been calculated by supercomputers, and every single one lies precisely on the critical line <KaTeXMath math="\Re(s) = 1/2" />. However, in analytic number theory, computational evidence is NOT a proof. A single zero off the line anywhere in the infinite complex plane would disprove the hypothesis.
        </div>
      </div>

      {/* Complex Plane SVG */}
      <div className="relative w-full h-[400px] rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Critical Strip (0 < Re(s) < 1) */}
          <rect
            x={originX}
            y="20"
            width={scaleX}
            height={height - 40}
            fill="#38bdf8"
            fillOpacity="0.06"
          />
          <text x={originX + scaleX / 2} y="35" fill="#38bdf8" fillOpacity="0.6" fontSize="10" fontFamily="monospace" textAnchor="middle">
            Critical Strip: 0 &lt; Re(s) &lt; 1
          </text>

          {/* Real Axis */}
          <line x1="20" y1={originY} x2={width - 20} y2={originY} stroke="#475569" strokeWidth="1.5" />
          <text x={width - 40} y={originY - 8} fill="#94a3b8" fontSize="11" fontFamily="monospace">Re(s)</text>

          {/* Imaginary Axis (Re(s) = 0) */}
          <line x1={originX} y1="20" x2={originX} y2={height - 20} stroke="#475569" strokeWidth="1.5" />
          <text x={originX + 8} y="35" fill="#94a3b8" fontSize="11" fontFamily="monospace">Im(s)</text>

          {/* Re(s) = 1 boundary line */}
          <line x1={boundaryX} y1="20" x2={boundaryX} y2={height - 20} stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />
          <text x={boundaryX - 4} y={originY + 16} fill="#64748b" fontSize="10" fontFamily="monospace">1.0</text>

          {/* Critical Line Re(s) = 1/2 */}
          <line
            x1={criticalLineX}
            y1="20"
            x2={criticalLineX}
            y2={height - 20}
            stroke="#06b6d4"
            strokeWidth="2.5"
          />
          <text x={criticalLineX} y={originY + 18} fill="#06b6d4" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            Re(s) = 1/2
          </text>

          {/* Trivial zeros at s = -2, -4... */}
          {[-2, -4].map((k) => {
            const x = originX + k * (scaleX / 2);
            return (
              <g key={k}>
                <circle cx={x} cy={originY} r="3" fill="#64748b" />
                <text x={x} y={originY + 14} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  {k}
                </text>
              </g>
            );
          })}

          {/* Plot Known Non-trivial Zeros */}
          {KNOWN_ZEROS.map((zero) => {
            const y = originY - zero.gamma * scaleY;
            if (y < 20 || y > height) return null;
            const isSelected = selectedZero.n === zero.n;

            return (
              <g
                key={zero.n}
                onClick={() => setSelectedZero(zero)}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                <circle
                  cx={criticalLineX}
                  cy={y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#f59e0b' : '#38bdf8'}
                  className={isSelected ? 'animate-pulse' : ''}
                />
                <text
                  x={criticalLineX + 12}
                  y={y + 4}
                  fill={isSelected ? '#f59e0b' : '#94a3b8'}
                  fontSize={isSelected ? "11" : "9"}
                  fontFamily="monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  ρ_{zero.n} (γ ≈ {zero.gamma.toFixed(2)})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Zero Floating Inspector */}
        <div className="absolute top-3 right-3 p-3.5 rounded-xl bg-slate-950/90 backdrop-blur border border-cyan-500/30 text-xs font-mono shadow-2xl max-w-xs">
          <div className="text-cyan-400 font-bold mb-1">Non-Trivial Zero ρ_{selectedZero.n}</div>
          <div className="text-slate-300">
            s = 1/2 + {selectedZero.gamma.toFixed(6)} i
          </div>
          <div className="text-[10px] text-slate-500 mt-1">{selectedZero.notes}</div>
        </div>
      </div>

      {/* Zeros Quick Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono text-slate-400">Inspect First 10 Non-Trivial Zeros:</span>
        <div className="flex flex-wrap gap-2">
          {KNOWN_ZEROS.map((zero) => (
            <button
              key={zero.n}
              type="button"
              onClick={() => setSelectedZero(zero)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedZero.n === zero.n
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Zero #{zero.n} (γ={zero.gamma.toFixed(1)})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
