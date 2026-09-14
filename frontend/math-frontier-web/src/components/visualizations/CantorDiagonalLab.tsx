import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { KaTeXMath } from '../common/KaTeXMath';
import { IntuitionVsMath } from '../common/IntuitionVsMath';

export const CantorDiagonalLab: React.FC = () => {
  const [seed, setSeed] = useState(1);

  // Generate 8 sample real numbers in binary (0.b1 b2 b3 b4 b5 b6 b7 b8...)
  const rows = React.useMemo(() => {
    const list: string[] = [];
    const prng = (s: number) => {
      let v = s;
      return () => {
        v = (v * 9301 + 49297) % 233280;
        return v / 233280;
      };
    };
    const rand = prng(seed * 777 + 42);

    for (let i = 0; i < 8; i++) {
      let bits = '';
      for (let j = 0; j < 8; j++) {
        bits += rand() > 0.5 ? '1' : '0';
      }
      list.push(bits);
    }
    return list;
  }, [seed]);

  // Construct the anti-diagonal number
  const antiDiagonal = React.useMemo(() => {
    return rows.map((row, idx) => (row[idx] === '1' ? '0' : '1')).join('');
  }, [rows]);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Cantor's Diagonal Argument Laboratory
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Georg Cantor (1891) proved that the real numbers cannot be put into one-to-one correspondence with the natural numbers: <KaTeXMath math="|\mathbb{R}| > |\mathbb{N}|" />.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Randomize List
        </button>
      </div>

      {/* Interactive Diagonal Table */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <span className="text-xs font-mono text-slate-400 block uppercase">
          Assumed Enumeration of Reals: <KaTeXMath math="s_1, s_2, s_3, \dots" />
        </span>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full font-mono text-sm">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center py-1 gap-2 border-b border-slate-900">
                <span className="text-slate-500 w-16 text-right text-xs">
                  s_{rowIdx + 1} = 0.
                </span>
                <div className="flex items-center gap-1.5">
                  {row.split('').map((bit, colIdx) => {
                    const isDiagonal = rowIdx === colIdx;
                    return (
                      <span
                        key={colIdx}
                        className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-colors ${
                          isDiagonal
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-md shadow-amber-500/20'
                            : 'bg-slate-900 text-slate-300 border border-slate-800/80'
                        }`}
                      >
                        {bit}
                      </span>
                    );
                  })}
                  <span className="text-slate-600 text-xs pl-2">...</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Missing Number Constructed via Diagonal Inversion */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div>
            <span className="text-xs text-amber-400 font-bold block uppercase tracking-wider mb-1">
              Constructed Missing Number $x^*$ (Flip Each Diagonal Bit):
            </span>
            <div className="flex items-center gap-1.5 pt-1 text-sm">
              <span className="text-emerald-400 font-bold">x* = 0.</span>
              {antiDiagonal.split('').map((bit, idx) => (
                <span
                  key={idx}
                  className="w-7 h-7 rounded bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 font-bold text-xs flex items-center justify-center"
                >
                  {bit}
                </span>
              ))}
              <span className="text-slate-500 text-xs pl-2">...</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-200 max-w-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
            <KaTeXMath math="x^*" /> differs from <KaTeXMath math="s_n" /> at the <KaTeXMath math="n" />-th digit for every <KaTeXMath math="n \in \mathbb{N}" />. Therefore, <KaTeXMath math="x^*" /> is NOT in the list! The real numbers are strictly uncountable.
          </div>
        </div>
      </div>

      <IntuitionVsMath
        intuition="Both natural numbers and real numbers go on forever without bound, so both sets should possess the exact same infinite size."
        mathematics="Cantor proved infinities come in strictly distinct cardinalities. The power set \mathcal{P}(\mathbb{N}) has strictly greater cardinality than \mathbb{N}: 2^{\aleph_0} > \aleph_0. The continuum \mathbb{R} cannot be mapped surjectively from \mathbb{N}."
        mathLaTeX="|\mathbb{R}| = 2^{\aleph_0} > \aleph_0 = |\mathbb{N}|"
      />
    </div>
  );
};
