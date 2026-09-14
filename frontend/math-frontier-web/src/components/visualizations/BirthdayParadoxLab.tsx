import React, { useState, useMemo } from 'react';
import { Sparkles, Users, Compass, ShieldAlert } from 'lucide-react';
import { KaTeXMath } from '../common/KaTeXMath';
import { IntuitionVsMath } from '../common/IntuitionVsMath';

export const BirthdayParadoxLab: React.FC = () => {
  const [numPeople, setNumPeople] = useState(23);

  // Compute exact probability for n people
  const probability = useMemo(() => {
    if (numPeople >= 365) return 1.0;
    let pNone = 1.0;
    for (let k = 0; k < numPeople; k++) {
      pNone *= (365 - k) / 365;
    }
    return 1.0 - pNone;
  }, [numPeople]);

  const numPairs = (numPeople * (numPeople - 1)) / 2;

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            The Birthday Paradox Explorer
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            How many people are needed in a room before there is a 50% chance two share a birthday? Counter-intuitively, only 23!
          </p>
        </div>
      </div>

      {/* Interactive Slider & Live Percentage Gauge */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex flex-col gap-2 flex-grow max-w-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Room Capacity ($n$ people):</span>
              <span className="text-cyan-400 font-bold text-base">{numPeople} people</span>
            </div>
            <input
              type="range"
              min="2"
              max="80"
              value={numPeople}
              onChange={(e) => setNumPeople(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded"
            />
          </label>

          <div className="flex items-center gap-4 text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 min-w-[120px]">
              <span className="text-[10px] text-slate-500 block uppercase">Shared Probability</span>
              <span
                className={`font-black text-xl ${
                  probability >= 0.5 ? 'text-emerald-400' : 'text-cyan-400'
                }`}
              >
                {(probability * 100).toFixed(2)}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 min-w-[120px]">
              <span className="text-[10px] text-slate-500 block uppercase">Pair Comparisons</span>
              <span className="text-amber-400 font-bold text-lg">{numPairs} pairs</span>
            </div>
          </div>
        </div>

        {/* Visual Probability Bar */}
        <div className="space-y-1">
          <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-200 ${
                probability >= 0.5
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                  : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(probability * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>0%</span>
            <span className="text-amber-400">50% Benchmark (n = 23)</span>
            <span>100%</span>
          </div>
        </div>

        {/* Milestone Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
          <button
            type="button"
            onClick={() => setNumPeople(10)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800"
          >
            <span className="text-slate-400 block text-[10px]">n = 10</span>
            <span className="text-slate-200 font-bold">11.7%</span>
          </button>
          <button
            type="button"
            onClick={() => setNumPeople(23)}
            className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300"
          >
            <span className="text-cyan-400 block text-[10px]">n = 23 (Tipping Point)</span>
            <span className="font-bold">50.7%</span>
          </button>
          <button
            type="button"
            onClick={() => setNumPeople(50)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800"
          >
            <span className="text-slate-400 block text-[10px]">n = 50</span>
            <span className="text-emerald-400 font-bold">97.0%</span>
          </button>
          <button
            type="button"
            onClick={() => setNumPeople(70)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800"
          >
            <span className="text-slate-400 block text-[10px]">n = 70</span>
            <span className="text-emerald-400 font-bold">99.9%</span>
          </button>
        </div>
      </div>

      <IntuitionVsMath
        intuition="Since a year has 365 days, you should need around 183 people (half of 365) to reach a 50% probability of finding someone with a matching birthday."
        mathematics="You are not looking for someone sharing YOUR specific birthday. You are looking for ANY pair among all possible combinations. A group of 23 people forms \binom{23}{2} = 253 distinct pairs, each with a 1/365 chance of matching!"
        mathLaTeX="P(n) = 1 - \prod_{k=0}^{n-1} \left(1 - \frac{k}{365}\right) \approx 1 - e^{-\frac{n(n-1)}{2 \times 365}}"
      />
    </div>
  );
};
