import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { VISUALIZATION_REGISTRY, getVisualEntityRoute } from '../components/visualizations/registry';

export const Gallery3DPage: React.FC = () => {
  const items = Object.entries(VISUALIZATION_REGISTRY);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
          <Layers className="w-3.5 h-3.5" />
          Virtual Mathematical Objects
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-100">
          3D Mathematical Gallery & Laboratories
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light">
          Manipulate non-orientable topological manifolds, explore curved non-Euclidean spaces, and interact with complex dynamic fractals.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(([slug, item]) => (
          <div
            key={slug}
            className="p-6 rounded-2xl bg-slate-900/40 hover:bg-slate-850/80 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1"
          >
            <div className="space-y-3">
              {/* Category & 3D badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                  {item.category}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  item.isThreeD ? 'bg-purple-950/60 text-purple-300 border border-purple-800' : 'bg-slate-950 text-slate-400'
                }`}>
                  {item.isThreeD ? '3D WebGL Mesh' : '2D Interactive Lab'}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-cinzel text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                to={getVisualEntityRoute(slug)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold transition-all"
              >
                <Compass className="w-3.5 h-3.5" />
                Launch Experience
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
