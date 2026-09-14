import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Layers, ArrowRight, BookOpen, CheckCircle2, Compass } from 'lucide-react';
import { MathematicalWonder } from '../types/math';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { IntuitionVsMath } from '../components/common/IntuitionVsMath';
import { KaTeXMath } from '../components/common/KaTeXMath';
import { getVisualizationComponent } from '../components/visualizations/registry';

export const WonderDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [wonder, setWonder] = useState<MathematicalWonder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchWonder = async () => {
      setLoading(true);
      try {
        const data = await api.getWonderBySlug(slug);
        setWonder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWonder();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-xs font-mono text-cyan-400 animate-pulse">
        Retrieving mathematical object...
      </div>
    );
  }

  if (!wonder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-slate-100">Exhibit Not Found</h2>
        <p className="text-xs text-slate-400">The requested mathematical phenomenon was not found.</p>
        <Link to="/wonders" className="inline-flex items-center gap-1 text-cyan-400 text-xs font-mono hover:underline">
          Return to Wonders Gallery <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const VizComponent = getVisualizationComponent(wonder.visualizationSlug);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2">
          <StatusBadge status={wonder.status} size="lg" />
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
            Mathematical Museum Exhibit
          </span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
          {wonder.title}
        </h1>

        <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
          {wonder.shortDescription}
        </p>
      </div>

      {/* Intuition vs Mathematics */}
      <section>
        <IntuitionVsMath
          intuition={wonder.intuition}
          mathematics={wonder.mathematics}
          mathLaTeX={wonder.parametricEquations}
        />
      </section>

      {/* 3D or 2D Interactive Scene */}
      {VizComponent && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Interactive 3D Laboratory
            </h2>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Live Model</span>
          </div>

          <VizComponent />
        </section>
      )}

      {/* Properties List */}
      {wonder.properties.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            Topological & Mathematical Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {wonder.properties.map((prop, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                <span className="text-cyan-400 font-mono font-bold">[{i + 1}]</span>
                <span>{prop}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Step-by-Step Construction */}
      {wonder.constructionSteps.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Step-by-Step Construction
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            {wonder.constructionSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono text-xs flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="mt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Parametric Formulas */}
      {wonder.parametricEquations && (
        <section className="space-y-3">
          <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Parametric Equations & Construction
          </h2>
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {wonder.parametricEquations}
          </div>
        </section>
      )}

      {/* Sources */}
      {wonder.sources.length > 0 && (
        <section className="space-y-3 border-t border-slate-800 pt-6">
          <h3 className="font-cinzel text-base font-bold text-slate-300">Authoritative Historical Citations</h3>
          <ul className="space-y-1.5 text-xs font-mono text-slate-400">
            {wonder.sources.map((src, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-slate-600">•</span>
                <span>{src}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
