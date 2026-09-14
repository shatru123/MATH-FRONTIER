import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

interface SolvedEntry {
  slug: string;
  title: string;
  yearPosed: string;
  yearSolved: string;
  solver: string;
  field: string;
  problem: string;
  whyDifficult: string;
  proofIdea: string;
  impact: string;
}

const SOLVED_ENTRIES: SolvedEntry[] = [
  {
    slug: 'poincare-conjecture',
    title: 'Poincaré Conjecture',
    yearPosed: '1904 (Henri Poincaré)',
    yearSolved: '2002–2003 (Grigori Perelman)',
    solver: 'Grigori Perelman (utilizing Richard Hamilton\'s program)',
    field: 'Differential Geometry & 3-Manifold Topology',
    problem: 'Is every simply connected, closed 3-dimensional manifold homeomorphic to the 3-sphere?',
    whyDifficult: 'In 3 dimensions, unlike higher dimensions (n >= 5 proved by Smale, n = 4 by Freedman), there was no extra spatial dimension to untangle self-intersections or apply Morse theory surgery easily.',
    proofIdea: 'Perelman proved Thurston\'s Geometrization Conjecture by running Hamilton\'s Ricci flow with surgery. He introduced a monotonic entropy functional that prevented "cigar" finite-time singularities and permitted topological surgery.',
    impact: 'Completed the foundational classification of all compact 3-manifolds and earned the only solved Clay Millennium Prize Problem to date.'
  },
  {
    slug: 'fermats-last-theorem',
    title: 'Fermat\'s Last Theorem',
    yearPosed: '1637 (Pierre de Fermat)',
    yearSolved: '1994 (Andrew Wiles & Richard Taylor)',
    solver: 'Sir Andrew Wiles (with assistance from Richard Taylor)',
    field: 'Algebraic Number Theory & Arithmetic Geometry',
    problem: 'No three positive integers a, b, c can satisfy aⁿ + bⁿ = cⁿ for any integer exponent n > 2.',
    whyDifficult: 'Elementary algebraic factoring breaks down because unique factorization fails in general cyclotomic fields (discovered by Ernst Kummer).',
    proofIdea: 'Gerhard Frey connected a hypothetical Fermat solution to a non-modular elliptic curve. Ken Ribet proved the epsilon conjecture, and Andrew Wiles proved the Taniyama–Shimura–Weil Modularity Conjecture for semistable elliptic curves using deformation theory of Galois representations.',
    impact: 'Catalyzed modern arithmetic geometry and established the modularity theorem, anchoring the Langlands program.'
  },
  {
    slug: 'four-color-theorem',
    title: 'Four-Color Theorem',
    yearPosed: '1852 (Francis Guthrie)',
    yearSolved: '1976 (Kenneth Appel & Wolfgang Haken)',
    solver: 'Kenneth Appel & Wolfgang Haken (formalized in Coq by Georges Gonthier in 2005)',
    field: 'Graph Theory & Combinatorics',
    problem: 'No more than four colors are required to color the regions of any planar map so that no adjacent regions have the same color.',
    whyDifficult: 'An astronomical number of combinatorial planar graph configurations could potentially require a fifth color.',
    proofIdea: 'Reduced all planar graphs to an "unavoidable set" of 1,936 (later 1,476) reducible configurations, each systematically verified by computer calculations.',
    impact: 'First major mathematical theorem verified by computer calculation, initiating modern computer-assisted and formally verified mathematics.'
  },
  {
    slug: 'kepler-conjecture',
    title: 'Kepler Conjecture',
    yearPosed: '1611 (Johannes Kepler)',
    yearSolved: '1998 / 2014 (Thomas Hales)',
    solver: 'Thomas Hales (Flyspeck Project completed 2014)',
    field: 'Discrete Geometry & Sphere Packing',
    problem: 'No packing of equally sized spheres in 3D Euclidean space has a density greater than the face-centered cubic lattice (density ≈ 74.048%).',
    whyDifficult: 'Irregular non-periodic packings could theoretically yield microscopic pockets of higher local density.',
    proofIdea: 'Minimizing a non-linear objective function over 5,000 planar graphs using linear programming and interval arithmetic, fully formalized in Isabelle and HOL Light in 2014.',
    impact: 'Led to Maryna Viazovska\'s Fields Medal-winning sphere packing solutions in dimensions 8 (2016) and 24 (with collaborators).'
  }
];

export const SolvedProblemsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-widest">
          <Award className="w-3.5 h-3.5" />
          Monumental Triumphs
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-100">
          Solved Historical Breakthroughs
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light">
          Centuries of mathematical deadlock overcome by revolutionary insights, new theories, and rigorous formal proof.
        </p>
      </div>

      {/* Solved List */}
      <div className="flex flex-col gap-8">
        {SOLVED_ENTRIES.map((entry, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 backdrop-blur transition-all flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status="SOLVED" size="sm" />
                  <span className="text-xs font-mono text-slate-400">{entry.field}</span>
                </div>
                <h2 className="font-cinzel text-2xl font-bold text-slate-100">{entry.title}</h2>
              </div>

              <div className="text-right text-xs font-mono">
                <span className="text-slate-500 block">Posed: {entry.yearPosed}</span>
                <span className="text-emerald-400 font-bold block">Solved: {entry.yearSolved}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-3">
                <div>
                  <strong className="text-slate-200 block text-xs font-mono uppercase tracking-wider mb-1">The Problem:</strong>
                  <p className="text-slate-400 leading-relaxed">{entry.problem}</p>
                </div>
                <div>
                  <strong className="text-slate-200 block text-xs font-mono uppercase tracking-wider mb-1">Why It Was Difficult:</strong>
                  <p className="text-slate-400 leading-relaxed">{entry.whyDifficult}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <strong className="text-emerald-300 block text-xs font-mono uppercase tracking-wider mb-1">The Breakthrough Proof Idea:</strong>
                  <p className="text-slate-300 leading-relaxed">{entry.proofIdea}</p>
                </div>
                <div>
                  <strong className="text-cyan-300 block text-xs font-mono uppercase tracking-wider mb-1">Mathematical Impact:</strong>
                  <p className="text-slate-400 leading-relaxed">{entry.impact}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Solver: <strong className="text-slate-200">{entry.solver}</strong></span>
              <Link
                to={`/problems/${entry.slug}`}
                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 group font-bold"
              >
                View Full Problem Analysis
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
