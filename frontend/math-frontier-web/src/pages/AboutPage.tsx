import React from 'react';
import { ShieldCheck, Heart, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12 text-slate-300">
      <div className="text-center space-y-4">
        <h1 className="font-cinzel text-4xl sm:text-5xl font-black text-slate-100">
          About Math Frontier
        </h1>
        <p className="font-cinzel text-lg font-medium text-cyan-400 italic">
          "Some questions have answers. Some have proofs. Some have neither."
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4 leading-relaxed text-sm">
        <h2 className="font-cinzel text-xl font-bold text-slate-100">The Philosophy</h2>
        <p>
          Math Frontier is designed as a <strong>Digital Mathematics Museum + Interactive Laboratory + Mathematical Knowledge Base</strong>. Mathematics is not an accumulation of static textbook rules; it is a dynamic frontier where humanity tests the boundary between what is true, what is provable, and what lies fundamentally beyond formal algorithmic verification.
        </p>
        <p>
          We explicitly do not treat every mathematical topic as an "unsolved problem". We clearly categorize mathematical phenomena (e.g. Möbius Strip), proven breakthroughs (e.g. Poincaré Conjecture), open conjectures (e.g. Riemann Hypothesis), undecidable statements (e.g. Halting Problem), and foundational independence results (e.g. Continuum Hypothesis).
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4 leading-relaxed text-sm">
        <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Status Integrity Guarantee
        </h2>
        <p>
          Mathematical status is of paramount importance. Math Frontier strictly avoids fabricating proofs, attributing unverified claims as solutions, or confusing numerical calculations with mathematical certainty.
        </p>
        <ul className="space-y-2 list-disc list-inside text-xs font-mono text-slate-400">
          <li>Every problem records Last Verified timestamp and official foundation sources.</li>
          <li>New preprint claims are explicitly labeled as requiring peer verification.</li>
          <li>Computational evidence is explicitly demarcated as distinct from general proof.</li>
        </ul>
      </div>

      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-cyan-500/30 space-y-4 leading-relaxed text-sm shadow-xl">
        <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Platform Creator
        </h2>
        <p className="text-slate-300">
          Math Frontier was designed and created by <strong>Shatrughna Ambhore</strong> as a modern digital mathematics museum, interactive 3D laboratory, and rigorous knowledge repository.
        </p>
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Creator</span>
            <span className="text-slate-100 font-bold text-sm">Shatrughna Ambhore</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Email</span>
            <a href="mailto:ambhoreshatrughna@gmail.com" className="text-cyan-400 hover:underline">
              ambhoreshatrughna@gmail.com
            </a>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Phone / Contact</span>
            <a href="tel:+919604466334" className="text-cyan-400 hover:underline">
              +91 9604466334
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
