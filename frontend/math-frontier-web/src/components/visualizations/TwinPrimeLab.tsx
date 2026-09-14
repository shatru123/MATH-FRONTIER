import React, { useState, useMemo } from 'react';
import { Sparkles, Sliders, AlertCircle, Award } from 'lucide-react';
import { isPrime, twinPrimesInRange } from '../../utils/mathUtils';
import { KaTeXMath } from '../common/KaTeXMath';

export const TwinPrimeLab: React.FC = () => {
  const [rangeStart, setRangeStart] = useState(3);
  const [rangeSize, setRangeSize] = useState(60);

  const rangeEnd = rangeStart + rangeSize;

  const numbers = useMemo(() => {
    return Array.from({ length: rangeSize + 1 }, (_, i) => rangeStart + i);
  }, [rangeStart, rangeSize]);

  const twinPairs = useMemo(() => {
    return twinPrimesInRange(rangeStart, rangeEnd);
  }, [rangeStart, rangeEnd]);

  const twinPrimeSet = useMemo(() => {
    const set = new Set<number>();
    twinPairs.forEach(([p, q]) => {
      set.add(p);
      set.add(q);
    });
    return set;
  }, [twinPairs]);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Twin Prime Sieve & Gap Visualizer
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Pairs of primes with difference 2: <KaTeXMath math="(p, p + 2)" />. Are there infinitely many?
          </p>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-3 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono">
          <label className="text-slate-400">Start:</label>
          <input
            type="range"
            min="3"
            max="1000"
            step="10"
            value={rangeStart}
            onChange={(e) => setRangeStart(parseInt(e.target.value))}
            className="w-24 accent-cyan-500"
          />
          <span className="text-cyan-300 w-10 text-right">{rangeStart}</span>
        </div>
      </div>

      {/* Number Line Visualizer */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Viewing integers {rangeStart} to {rangeEnd}</span>
          <span className="text-cyan-400 font-bold">{twinPairs.length} Twin Prime Pairs</span>
        </div>

        <div className="flex flex-wrap gap-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          {numbers.map((n) => {
            const prime = isPrime(n);
            const isTwin = twinPrimeSet.has(n);

            return (
              <div
                key={n}
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-semibold transition-all ${
                  isTwin
                    ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 shadow-md shadow-cyan-500/20 font-bold'
                    : prime
                    ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60'
                    : 'bg-slate-900/40 text-slate-600 border border-slate-900'
                }`}
                title={isTwin ? `Twin Prime: ${n}` : prime ? `Prime: ${n}` : `Composite: ${n}`}
              >
                {n}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono mt-1 text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500 inline-block" /> Twin Prime (p, p+2)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-900 border border-purple-700 inline-block" /> Other Prime
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-900 inline-block" /> Composite
          </span>
        </div>
      </div>

      {/* Verified Mathematical Milestones (Zhang & Maynard) */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
        <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" />
          Verified Mathematical Progress on Prime Gaps:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">1919 • Viggo Brun</span>
            <span className="text-cyan-300 font-bold">Convergent Sum</span>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              Sum of reciprocals of twin primes converges to Brun's constant <KaTeXMath math="B_2 \approx 1.902" />.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">2013 • Yitang Zhang</span>
            <span className="text-amber-300 font-bold">Gap &lt; 70,000,000</span>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              First unconditional finite bound on gaps between infinitely many consecutive primes.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">2014 • Maynard & Polymath8</span>
            <span className="text-emerald-300 font-bold">Gap &le; 246</span>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              Current best unconditional bound. Reducing from 246 to 2 remains open.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
