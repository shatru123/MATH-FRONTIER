import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Layers, Compass, ArrowRight } from 'lucide-react';
import { MathematicalWonder } from '../types/math';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';

export const WondersPage: React.FC = () => {
  const [wonders, setWonders] = useState<MathematicalWonder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWonders = async () => {
      setLoading(true);
      try {
        const data = await api.getWonders();
        setWonders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWonders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Museum Exhibits
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-100">
          Mathematical Wonders & Phenomena
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light">
          Surfaces, paradoxes, fractals, and geometric constructions that shatter ordinary intuition. These are not unsolved problems, but profound mathematical realities.
        </p>
      </div>

      {/* Wonders Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-cyan-400 animate-pulse">
          Loading mathematical wonders...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wonders.map((wonder) => (
            <Link
              key={wonder.id}
              to={`/wonders/${wonder.slug}`}
              className="p-6 rounded-2xl bg-slate-900/40 hover:bg-slate-850/80 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={wonder.status} size="sm" />
                  {wonder.visualizationSlug && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                      <Layers className="w-3 h-3" /> Interactive 3D
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {wonder.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {wonder.shortDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {wonder.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>Explore Exhibit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
