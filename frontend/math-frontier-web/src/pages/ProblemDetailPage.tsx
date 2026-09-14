import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  Layers,
  Compass,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { Problem } from '../types/math';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { KaTeXMath } from '../components/common/KaTeXMath';
import { IntuitionVsMath } from '../components/common/IntuitionVsMath';
import { getVisualizationComponent } from '../components/visualizations/registry';

export const ProblemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [related, setRelated] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const data = await api.getProblemBySlug(slug);
        setProblem(data);
        if (data) {
          const rel = await api.getRelatedProblems(slug);
          setRelated(rel);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-xs font-mono text-cyan-400 animate-pulse">
        Retrieving mathematical formulation...
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-slate-100">Problem Not Found</h2>
        <p className="text-xs text-slate-400">The requested mathematical question could not be found in the catalog.</p>
        <Link to="/problems" className="inline-flex items-center gap-1 text-cyan-400 text-xs font-mono hover:underline">
          Return to Catalog <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Get active 3D visualization or lab component from registry
  const VizComponent = getVisualizationComponent(problem.visualizationSlug);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
      {/* 1. HEADER SECTION */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={problem.status} size="lg" />
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
            {problem.field}
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400">
            Difficulty: {problem.difficulty}
          </span>
          {problem.yearIntroduced && (
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
              Introduced: {problem.yearIntroduced}
            </span>
          )}
        </div>

        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
          {problem.title}
        </h1>

        <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
          {problem.shortDescription}
        </p>

        {/* Status Verification Metadata Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Last Verified: <strong className="text-slate-200">{problem.lastVerified}</strong></span>
            <span className="text-slate-600">•</span>
            <span>Source: <strong className="text-slate-200">{problem.statusSource}</strong></span>
          </div>
          <span className="text-slate-500 italic">{problem.sourceType}</span>
        </div>
      </div>

      {/* 2. THE QUESTION */}
      <section className="space-y-3">
        <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400">§ 1</span> The Question
        </h2>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-slate-300 leading-relaxed text-sm sm:text-base">
          {problem.fullDescription}
        </div>
      </section>

      {/* 3. WHY SHOULD I CARE? */}
      <section className="space-y-3">
        <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400">§ 2</span> Why Does It Matter?
        </h2>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-slate-300 leading-relaxed text-sm sm:text-base">
          {problem.whyItMatters}
        </div>
      </section>

      {/* 4. INTUITION VS MATHEMATICAL REALITY */}
      <section className="space-y-3">
        <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400">§ 3</span> Intuition vs. Formal Mathematics
        </h2>
        <IntuitionVsMath
          intuition={problem.intuition}
          mathematics="Formal mathematical formulation requires precise operational criteria that eliminate human sensory bias."
          mathLaTeX={problem.mathematicalStatement}
        />
      </section>

      {/* 5. VISUAL EXPLANATION & TRY IT LAB */}
      {VizComponent && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="text-cyan-400">§ 4</span> Interactive Laboratory & Visual Explanation
            </h2>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Live Simulator
            </span>
          </div>

          <VizComponent />
        </section>
      )}

      {/* 6. MATHEMATICAL FORMULATION (KaTeX) */}
      <section className="space-y-3">
        <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400">§ 5</span> Mathematical Formulation
        </h2>
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-cyan-300 overflow-x-auto">
          <KaTeXMath math={problem.mathematicalStatement} block />
        </div>
      </section>

      {/* 7. WHAT WE KNOW vs WHAT WE DON'T KNOW */}
      <section className="space-y-4">
        <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400">§ 6</span> Established Facts vs. Remaining Unknowns
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What we know */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
              <CheckCircle2 className="w-4 h-4" />
              What Mathematics Already Knows
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {problem.whatWeKnow.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What we don't know */}
          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              <AlertTriangle className="w-4 h-4" />
              What Remains Unknown
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {problem.whatWeDontKnow.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 8. PARTIAL RESULTS */}
      {problem.partialResults.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="text-cyan-400">§ 7</span> Major Partial Results & Milestones
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {problem.partialResults.map((res, i) => (
                <li key={i} className="flex items-start gap-2.5 font-mono">
                  <span className="text-cyan-400 shrink-0 font-bold">[{i + 1}]</span>
                  <span className="font-sans">{res}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 9. COMMON MISCONCEPTIONS */}
      {problem.commonMisconceptions.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="text-cyan-400">§ 8</span> Common Misconceptions
          </h2>
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2.5">
            {problem.commonMisconceptions.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-200/90 leading-relaxed">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. HISTORY TIMELINE */}
      <section className="space-y-3">
        <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400">§ 9</span> Historical Milestones
        </h2>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{problem.history}</p>
          <div className="space-y-2 border-t border-slate-800 pt-3">
            {problem.historicalStatuses.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. RELATED PROBLEMS */}
      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="text-cyan-400">§ 10</span> Related Mathematical Inquiries
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/problems/${rel.slug}`}
                className="p-4 rounded-xl bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-medium text-slate-100 group-hover:text-cyan-300 text-sm">
                    {rel.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">{rel.field}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
