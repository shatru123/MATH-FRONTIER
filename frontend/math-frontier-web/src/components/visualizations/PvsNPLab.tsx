import React, { useState } from 'react';
import { Terminal, ShieldAlert, Sparkles, CheckCircle2, Split } from 'lucide-react';
import { KaTeXMath } from '../common/KaTeXMath';
import { IntuitionVsMath } from '../common/IntuitionVsMath';

export const PvsNPLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classes' | 'reduction' | 'impact'>('classes');
  const [selectedClass, setSelectedClass] = useState<'P' | 'NP' | 'NPC' | 'NPH'>('NPC');

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            P vs NP Complexity Landscape
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Clay Millennium Problem: Does easy verification imply easy computation? (<KaTeXMath math="\text{P} \stackrel{?}{=} \text{NP}" />)
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('classes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'classes' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Complexity Diagram
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reduction')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'reduction' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Karp Reductions
          </button>
        </div>
      </div>

      {activeTab === 'classes' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
          {/* Interactive Euler Diagram of Complexity Classes */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-900/80 rounded-xl border border-slate-800 relative">
            <span className="text-xs font-mono text-slate-400 mb-4 block">
              Hypothesized Universe (<KaTeXMath math="\text{P} \neq \text{NP}" />):
            </span>

            <div className="relative w-full max-w-md h-64 border border-dashed border-emerald-500/40 rounded-3xl p-4 flex flex-col items-center justify-between bg-emerald-950/10">
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                NP (Nondeterministic Polynomial Time)
              </span>

              {/* NP-Complete at the top */}
              <button
                type="button"
                onClick={() => setSelectedClass('NPC')}
                className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold transition-all shadow-lg ${
                  selectedClass === 'NPC'
                    ? 'bg-rose-500 text-slate-950 border-rose-400 ring-2 ring-rose-500/40'
                    : 'bg-rose-950/40 border-rose-800/80 text-rose-300 hover:bg-rose-900/40'
                }`}
              >
                NP-Complete (SAT, TSP, Subset-Sum)
              </button>

              {/* Class P nested inside */}
              <button
                type="button"
                onClick={() => setSelectedClass('P')}
                className={`px-6 py-3 rounded-2xl border text-xs font-mono font-bold transition-all shadow-lg ${
                  selectedClass === 'P'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 ring-2 ring-cyan-500/40'
                    : 'bg-cyan-950/40 border-cyan-800/80 text-cyan-300 hover:bg-cyan-900/40'
                }`}
              >
                P (Sorting, Primality Testing, Shortest Path)
              </button>
            </div>
          </div>

          {/* Description of Selected Class */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
            <span className="font-bold text-emerald-400 block uppercase">
              {selectedClass === 'P' && 'Class P: Polynomial-Time Solvable'}
              {selectedClass === 'NPC' && 'Class NP-Complete: The Hardest Problems in NP'}
              {selectedClass === 'NP' && 'Class NP: Polynomial-Time Verifiable'}
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {selectedClass === 'P' &&
                'Decision problems solvable by a deterministic Turing machine in O(n^k) steps. Examples: 2-SAT, Matrix Multiplication, AKS Primality Test.'}
              {selectedClass === 'NPC' &&
                'If ANY single NP-complete problem admits a polynomial-time algorithm, then P = NP and EVERY problem in NP collapses into P! Cook-Levin proved Boolean Satisfiability (SAT) is NP-complete.'}
              {selectedClass === 'NP' &&
                'Problems where a candidate proof (certificate) of polynomial length can be verified deterministically in polynomial time.'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'reduction' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
          <span className="font-bold text-cyan-400 block uppercase">Polynomial-Time Karp Reduction</span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            A problem A reduces to problem B (<KaTeXMath math="A \le_p B" />) if there exists a polynomial-time computable function <KaTeXMath math="f" /> such that <KaTeXMath math="x \in A \iff f(x) \in B" />.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
            <span className="text-amber-400 font-bold block">Cook & Karp Reductions Web:</span>
            <div className="text-slate-300">
              SAT <KaTeXMath math="\longrightarrow" /> 3-SAT <KaTeXMath math="\longrightarrow" /> Independent Set <KaTeXMath math="\longrightarrow" /> Vertex Cover <KaTeXMath math="\longrightarrow" /> Hamiltonian Cycle
            </div>
          </div>
        </div>
      )}

      <IntuitionVsMath
        intuition="Finding a creative mathematical proof feels vastly harder than reading and verifying someone else's written proof. Therefore, P should not equal NP."
        mathematics="Intuition overwhelmingly suggests P \neq NP, but proving a lower bound requires overcoming three monumental mathematical barriers: Relativization (Baker-Gill-Solovay 1975), Natural Proofs (Razborov-Rudich 1997), and Algebrization (Aaronson-Wigderson 2008)."
        mathLaTeX="\text{P} = \bigcup_{k \ge 1} \text{DTIME}(n^k) \quad \stackrel{?}{=} \quad \text{NP} = \bigcup_{k \ge 1} \text{NTIME}(n^k)"
      />
    </div>
  );
};
