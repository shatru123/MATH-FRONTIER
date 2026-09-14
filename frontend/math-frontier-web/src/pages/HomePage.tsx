import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Compass, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { HeroBackground } from '../components/layout/HeroBackground';
import { MobiusStripScene } from '../components/visualizations/MobiusStripScene';
import { StatusBadge } from '../components/common/StatusBadge';
import { IntuitionVsMath } from '../components/common/IntuitionVsMath';

export const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <HeroBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 flex flex-col gap-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            Digital Mathematics Museum & Interactive Laboratory
          </div>

          <h1 className="font-cinzel text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-[1.15]">
            Explore the questions mathematics <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">hasn't answered</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            And the groundbreaking ideas that transformed how humanity understands space, infinity, computation, and truth.
          </p>

          {/* Philosophy Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md max-w-lg mx-auto shadow-2xl">
            <p className="font-cinzel text-sm sm:text-base font-bold text-slate-200 tracking-wide">
              "Some questions have answers. Some have proofs. Some have neither."
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/problems"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              Explore Open Catalog
            </Link>

            <Link
              to="/wonders/mobius-strip"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all hover:-translate-y-0.5"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              Launch 3D Flagship (Möbius)
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur text-center">
            <span className="font-cinzel text-3xl sm:text-4xl font-black text-amber-400 block mb-1">7</span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Millennium Problems</span>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur text-center">
            <span className="font-cinzel text-3xl sm:text-4xl font-black text-cyan-400 block mb-1">10+</span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Interactive 3D Objects</span>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur text-center">
            <span className="font-cinzel text-3xl sm:text-4xl font-black text-purple-400 block mb-1">100%</span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Peer-Verified Citations</span>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur text-center">
            <span className="font-cinzel text-3xl sm:text-4xl font-black text-emerald-400 block mb-1">1637+</span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Chronological Timeline</span>
          </div>
        </div>

        {/* Signature Feature: Intuition vs Mathematics */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">Signature Principle</span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100">
              Why Mathematics Defies Everyday Intuition
            </h2>
          </div>

          <IntuitionVsMath
            intuition="Every physical sheet of paper has two distinct sides: an inside and an outside, a front and a back."
            mathematics="The Möbius strip is a compact 2-dimensional non-orientable surface with exactly one side and one continuous boundary curve."
            mathLaTeX="x(u,v) = \left(R + v \cos\frac{u}{2}\right)\cos u, \quad y(u,v) = \left(R + v \cos\frac{u}{2}\right)\sin u, \quad z(u,v) = v \sin\frac{u}{2}"
          />
        </div>

        {/* Flagship 3D Exhibit: Möbius Strip */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status="PHENOMENON" size="sm" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Flagship 3D Exhibit</span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100">
                Interactive Möbius Strip Experience
              </h2>
            </div>

            <Link
              to="/wonders/mobius-strip"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
            >
              Open Full Exhibit Page
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <MobiusStripScene initialRadius={2.2} initialWidth={0.75} />
        </div>

        {/* Educational Classification Matrix */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100">
              Critical Epistemological Classification
            </h2>
            <p className="text-xs text-slate-400">
              Not everything is simply an "unsolved problem." Mathematics rigorously distinguishes proof from evidence, and open conjectures from fundamental undecidability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div>
                <StatusBadge status="OPEN" size="sm" />
                <h3 className="font-cinzel text-lg font-bold text-slate-100 mt-3 mb-1">Open Conjectures</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Questions like the <strong className="text-slate-300">Riemann Hypothesis</strong> and <strong className="text-slate-300">Goldbach Conjecture</strong> where overwhelming numerical evidence exists, but no rigorous proof has yet been established.
                </p>
              </div>
              <Link to="/problems?status=open" className="text-xs font-mono text-amber-400 hover:text-amber-300 mt-4 inline-flex items-center gap-1">
                View Open Problems <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div>
                <StatusBadge status="UNDECIDABLE" size="sm" />
                <h3 className="font-cinzel text-lg font-bold text-slate-100 mt-3 mb-1">Undecidable Theorems</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Questions like the <strong className="text-slate-300">Halting Problem</strong> where Alan Turing mathematically proved that no general algorithm can ever answer them. Not an unsolved problem, but a proven boundary of logic.
                </p>
              </div>
              <Link to="/problems/halting-problem" className="text-xs font-mono text-purple-400 hover:text-purple-300 mt-4 inline-flex items-center gap-1">
                Explore Turing's Proof <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div>
                <StatusBadge status="SOLVED" size="sm" />
                <h3 className="font-cinzel text-lg font-bold text-slate-100 mt-3 mb-1">Solved Breakthroughs</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Legendary breakthroughs like the <strong className="text-slate-300">Poincaré Conjecture</strong> (solved by Grigori Perelman) and <strong className="text-slate-300">Fermat's Last Theorem</strong> (solved by Andrew Wiles) after centuries of struggle.
                </p>
              </div>
              <Link to="/solved" className="text-xs font-mono text-emerald-400 hover:text-emerald-300 mt-4 inline-flex items-center gap-1">
                Explore Solved Gallery <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
