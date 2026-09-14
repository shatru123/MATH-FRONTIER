import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, TrendingUp, Binary, Sparkles, Infinity as InfinityIcon, ShieldAlert } from 'lucide-react';
import { CollatzLab } from '../components/visualizations/CollatzLab';
import { GoldbachLab } from '../components/visualizations/GoldbachLab';
import { TwinPrimeLab } from '../components/visualizations/TwinPrimeLab';
import { FractalLab } from '../components/visualizations/FractalLab';
import { HilbertsHotelLab } from '../components/visualizations/HilbertsHotelLab';
import { RiemannHypothesisLab } from '../components/visualizations/RiemannHypothesisLab';

type LabTab = 'collatz' | 'goldbach' | 'twin-primes' | 'fractals' | 'hilbert-hotel' | 'riemann';

export const LabPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tool') as LabTab) || 'collatz';
  const [activeTab, setActiveTab] = useState<LabTab>(initialTab);

  const setTab = (tab: LabTab) => {
    setActiveTab(tab);
    setSearchParams({ tool: tab });
  };

  const tabs = [
    { id: 'collatz', name: 'Collatz 3n+1', icon: TrendingUp },
    { id: 'goldbach', name: 'Goldbach Comet', icon: Binary },
    { id: 'twin-primes', name: 'Twin Primes', icon: Sparkles },
    { id: 'fractals', name: 'Fractal Lab', icon: Compass },
    { id: 'hilbert-hotel', name: 'Hilbert\'s Hotel', icon: InfinityIcon },
    { id: 'riemann', name: 'Riemann Zeros', icon: ShieldAlert }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5" />
          Interactive Mathematical Sandbox
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-100">
          The Frontier Laboratory
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light">
          Run real-time experiments on famous number-theoretic sequences, prime distributions, countable infinities, and complex dynamical systems.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id as LabTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Lab Component */}
      <div className="w-full">
        {activeTab === 'collatz' && <CollatzLab />}
        {activeTab === 'goldbach' && <GoldbachLab />}
        {activeTab === 'twin-primes' && <TwinPrimeLab />}
        {activeTab === 'fractals' && <FractalLab />}
        {activeTab === 'hilbert-hotel' && <HilbertsHotelLab />}
        {activeTab === 'riemann' && <RiemannHypothesisLab />}
      </div>
    </div>
  );
};
