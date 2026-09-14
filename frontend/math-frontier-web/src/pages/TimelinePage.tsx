import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Calendar, ArrowRight, Tag } from 'lucide-react';
import { TimelineEvent } from '../types/math';
import { api } from '../services/api';

export const TimelinePage: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const data = await api.getTimeline();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const categories = Array.from(new Set(events.map((e) => e.category))).sort();

  const filteredEvents = selectedCategory === 'ALL'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
          <History className="w-3.5 h-3.5" />
          Chronological Record
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-100">
          Timeline of Mathematical Breakthroughs
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light">
          Major milestones spanning four centuries from Fermat's marginal notes in 1637 to 21st-century Millennium Problem solutions.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All Eras ({events.length})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedCategory === c
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="relative group">
            {/* Timeline node dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:scale-125 transition-all shadow-[0_0_12px_#22d3ee]" />

            <div className="p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-850/80 border border-slate-800 hover:border-cyan-500/40 backdrop-blur transition-all flex flex-col gap-2 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded">
                  {evt.dateDisplay}
                </span>
                <span className="text-[11px] font-mono text-slate-500 uppercase">{evt.category}</span>
              </div>

              <h3 className="font-cinzel text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {evt.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {evt.description}
              </p>

              <div className="pt-3 mt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                <span className="italic">"{evt.significance}"</span>

                {(evt.relatedProblemSlug || evt.relatedWonderSlug) && (
                  <Link
                    to={evt.relatedProblemSlug ? `/problems/${evt.relatedProblemSlug}` : `/wonders/${evt.relatedWonderSlug}`}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-mono font-medium ml-4 shrink-0"
                  >
                    Open Exhibit <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
