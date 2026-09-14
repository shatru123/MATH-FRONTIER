import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, BookOpen, Sparkles, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchResult } from '../../types/math';
import { api } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.search(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchResult) => {
    onClose();
    if (item.type === 'Problem') {
      navigate(`/problems/${item.slug}`);
    } else if (item.type === 'Wonder') {
      navigate(`/wonders/${item.slug}`);
    } else {
      navigate(`/timeline`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems, wonders, concepts (e.g. Riemann, Möbius, prime, infinity)..."
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none font-mono"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-2 py-1 text-xs font-mono text-slate-400 bg-slate-800 rounded border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 flex flex-col gap-2">
          {loading && (
            <div className="text-center py-8 text-xs font-mono text-slate-400 animate-pulse">
              Searching mathematical corpus...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 text-xs font-mono text-slate-400">
              No mathematical entities found matching "{query}".
            </div>
          )}

          {!loading && results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 mt-0.5">
                  {item.type === 'Problem' && <BookOpen className="w-4 h-4" />}
                  {item.type === 'Wonder' && <Sparkles className="w-4 h-4" />}
                  {item.type === 'Mathematician' && <User className="w-4 h-4" />}
                  {item.type === 'Timeline' && <Calendar className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-slate-100 group-hover:text-cyan-300 text-sm">
                      {item.title}
                    </h4>
                    {item.status && <StatusBadge status={item.status} size="sm" />}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 mt-2 transition-transform group-hover:translate-x-1" />
            </div>
          ))}

          {!query && (
            <div className="py-6 px-4 text-center">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-3">Suggested Explorations</span>
              <div className="flex flex-wrap justify-center gap-2 text-xs font-mono">
                {['Riemann Hypothesis', 'Möbius Strip', 'P vs NP', 'Klein Bottle', 'Collatz', 'Banach-Tarski', 'Hilbert Hotel', 'Poincaré'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
