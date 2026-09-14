import React, { useState, useMemo } from 'react';
import { Binary, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { goldbachPairs } from '../../utils/mathUtils';
import { KaTeXMath } from '../common/KaTeXMath';

export const GoldbachLab: React.FC = () => {
  const [inputVal, setInputVal] = useState('100');

  const pairs = useMemo(() => {
    const n = parseInt(inputVal);
    if (isNaN(n) || n <= 2 || n % 2 !== 0) return [];
    return goldbachPairs(n);
  }, [inputVal]);

  const numVal = parseInt(inputVal);
  const isValidEven = !isNaN(numVal) && numVal > 2 && numVal % 2 === 0;

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      {/* Header & Input */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <Binary className="w-5 h-5 text-cyan-400" />
            Goldbach Decomposition Explorer
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Every even integer <KaTeXMath math="n > 2" /> is conjectured to be the sum of two primes: <KaTeXMath math="n = p + q" />.
          </p>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400">Even integer n =</label>
          <input
            type="number"
            min="4"
            step="2"
            max="10000"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-24 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {!isValidEven ? (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300">
          Please enter an EVEN integer greater than 2 (e.g., 4, 10, 28, 100, 256).
        </div>
      ) : (
        <>
          {/* Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Even Target Number</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">{numVal}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Prime Partitions Found</span>
              <span className="text-2xl font-bold font-mono text-amber-400">{pairs.length} pairs</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Conjecture Status for n</span>
                <span className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-4 h-4" /> Verified for {numVal}
                </span>
              </div>
            </div>
          </div>

          {/* Prime Pairs Visualizer */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-slate-300">
              Discovered Prime Pairs <KaTeXMath math={`p + q = ${numVal}`} />:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              {pairs.map(([p, q], idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-cyan-400 font-bold">{p}</span>
                  <span className="text-slate-500">+</span>
                  <span className="text-purple-400 font-bold">{q}</span>
                  <span className="text-slate-500">=</span>
                  <span className="text-slate-100 font-bold">{numVal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Goldbach Comet Explainer */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">The Goldbach Comet:</strong> As even integers grow larger, the number of primes smaller than them increases, meaning the number of ways to express <KaTeXMath math="n = p + q" /> generally grows (forming a plot known as Goldbach's comet). While verified computationally for all numbers up to <KaTeXMath math="4 \times 10^{18}" />, a rigorous mathematical proof that no even number ever produces zero prime pairs remains completely unsolved.
          </div>
        </>
      )}
    </div>
  );
};
