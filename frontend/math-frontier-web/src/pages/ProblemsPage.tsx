import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Layers, Compass, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';
import { Problem, ProblemStatus, DifficultyLevel } from '../types/math';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';

export const ProblemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const statusParam = searchParams.get('status') as ProblemStatus | null;
  const categoryParam = searchParams.get('category');
  const [selectedStatus, setSelectedStatus] = useState<string>(statusParam || 'ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedField, setSelectedField] = useState<string>('ALL');
  const [only3D, setOnly3D] = useState(false);
  const [onlyLab, setOnlyLab] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const data = await api.getProblems();
        setProblems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Update status when URL searchParams change
  useEffect(() => {
    if (statusParam) {
      setSelectedStatus(statusParam.toUpperCase());
    }
  }, [statusParam]);

  // Extract unique fields
  const fields = useMemo(() => {
    const set = new Set<string>();
    problems.forEach((p) => set.add(p.field));
    return Array.from(set).sort();
  }, [problems]);

  // Filtered list
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;
      if (selectedField !== 'ALL' && p.field !== selectedField) return false;
      if (only3D && !p.visualizationSlug) return false;
      if (onlyLab && !p.hasExperiment) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      return true;
    });
  }, [problems, selectedStatus, selectedDifficulty, selectedField, only3D, onlyLab, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-100">
          Mathematical Problems Catalog
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light">
          A rigorous classification of open questions, proven theorems, and fundamental undecidability.
        </p>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col gap-4 shadow-xl">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by name, statement, or tag (e.g. Riemann, Navier-Stokes, primes, logic)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Dropdown Filters & Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="SOLVED">Solved</option>
              <option value="UNDECIDABLE">Undecidable</option>
              <option value="INDEPENDENT">Independent</option>
              <option value="PARTIALLY_SOLVED">Partially Solved</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Extreme">Extreme</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Introductory">Introductory</option>
            </select>
          </div>

          {/* Field Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Field:</span>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Fields</option>
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* 3D Only toggle */}
          <button
            type="button"
            onClick={() => setOnly3D(!only3D)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              only3D
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3D Available
          </button>

          {/* Lab Only toggle */}
          <button
            type="button"
            onClick={() => setOnlyLab(!onlyLab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              onlyLab
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Interactive Lab
          </button>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('ALL');
              setSelectedDifficulty('ALL');
              setSelectedField('ALL');
              setOnly3D(false);
              setOnlyLab(false);
              setSearchQuery('');
            }}
            className="text-slate-500 hover:text-slate-300 underline ml-auto text-[11px]"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Problems Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-cyan-400 animate-pulse">
          Loading mathematical catalog...
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm font-mono p-8 rounded-2xl bg-slate-900/40 border border-slate-800">
          No mathematical problems match the selected filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problems/${problem.slug}`}
              className="p-6 rounded-2xl bg-slate-900/40 hover:bg-slate-850/80 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={problem.status} size="sm" />
                  {problem.yearIntroduced && (
                    <span className="text-[11px] font-mono text-slate-500">
                      {problem.yearIntroduced}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {problem.title}
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400/80 block mt-0.5">
                    {problem.field}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {problem.shortDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {problem.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  {problem.visualizationSlug && (
                    <span className="flex items-center gap-1 text-cyan-400 text-[11px]">
                      <Layers className="w-3 h-3" /> 3D
                    </span>
                  )}
                  {problem.hasExperiment && (
                    <span className="flex items-center gap-1 text-purple-400 text-[11px]">
                      <Compass className="w-3 h-3" /> Lab
                    </span>
                  )}
                </div>

                <span className="group-hover:text-cyan-400 flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-all">
                  Explore Problem <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
