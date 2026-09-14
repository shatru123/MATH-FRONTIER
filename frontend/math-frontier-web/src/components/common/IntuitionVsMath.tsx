import React from 'react';
import { Eye, BookOpen } from 'lucide-react';
import { KaTeXMath } from './KaTeXMath';

interface IntuitionVsMathProps {
  intuition: string;
  mathematics: string;
  title?: string;
  mathLaTeX?: string;
}

export const IntuitionVsMath: React.FC<IntuitionVsMathProps> = ({
  intuition,
  mathematics,
  title = "Intuition vs. Mathematical Reality",
  mathLaTeX
}) => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
        <h3 className="font-cinzel text-lg font-bold text-slate-100 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          {title}
        </h3>
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Core Dualism</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
        {/* Intuition side */}
        <div className="p-6 bg-gradient-to-br from-amber-500/5 to-transparent relative">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-widest uppercase mb-3">
            <Eye className="w-4 h-4" />
            Human Intuition
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed italic">
            "{intuition}"
          </p>
        </div>

        {/* Mathematics side */}
        <div className="p-6 bg-gradient-to-br from-cyan-500/5 to-transparent relative">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-widest uppercase mb-3">
            <BookOpen className="w-4 h-4" />
            Mathematical Reality
          </div>
          <p className="text-slate-200 text-sm md:text-base leading-relaxed">
            {mathematics}
          </p>
          {mathLaTeX && (
            <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-cyan-500/20 text-cyan-200">
              <KaTeXMath math={mathLaTeX} block />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
