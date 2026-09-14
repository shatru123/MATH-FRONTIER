import React from 'react';
import { ProblemStatus } from '../../types/math';

interface StatusBadgeProps {
  status: ProblemStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'SOLVED':
        return {
          label: 'Solved Theorem',
          classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'OPEN':
        return {
          label: 'Open Problem',
          classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400'
        };
      case 'UNDECIDABLE':
        return {
          label: 'Proven Undecidable',
          classes: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400'
        };
      case 'INDEPENDENT':
        return {
          label: 'Independent of ZFC',
          classes: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400'
        };
      case 'PHENOMENON':
        return {
          label: 'Mathematical Phenomenon',
          classes: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dot: 'bg-cyan-400'
        };
      case 'PARADOX':
        return {
          label: 'Mathematical Paradox',
          classes: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400'
        };
      case 'THEOREM':
        return {
          label: 'Proven Theorem',
          classes: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
          dot: 'bg-teal-400'
        };
      case 'DISPUTED':
        return {
          label: 'Disputed Claim',
          classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          dot: 'bg-yellow-400'
        };
      default:
        return {
          label: status,
          classes: 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-slate-400'
        };
    }
  };

  const config = getBadgeConfig();
  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2 py-0.5'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5 font-medium'
      : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono ${config.classes} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </span>
  );
};
