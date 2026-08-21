import React from 'react';
import { RiskLevel } from '../../types';
import { RiskBadge } from './RiskBadge';

interface RiskScoreCardProps {
  score: number;
  level: RiskLevel;
  explanation?: string;
  className?: string;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  score,
  level,
  explanation,
  className = ''
}) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-red-400 border-red-500/30 bg-red-500/10';
    if (score >= 60) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    if (score >= 30) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  };

  const getMeterColor = () => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 30) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={`bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Assessed Threat Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${getScoreColor().split(' ')[0]}`}>
              {score}
            </span>
            <span className="text-sm font-semibold text-slate-500">/ 100</span>
          </div>
        </div>
        <RiskBadge level={level} size="lg" />
      </div>

      {/* Visual Risk Meter */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>0 (LOW)</span>
          <span>30 (MEDIUM)</span>
          <span>60 (HIGH)</span>
          <span>80-100 (CRITICAL)</span>
        </div>
        <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden border border-navy-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${getMeterColor()}`}
            style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
          />
        </div>
      </div>

      {explanation && (
        <div className="mt-3.5 pt-3 border-t border-navy-800 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-200">Risk Rationale: </span>
          {explanation}
        </div>
      )}
    </div>
  );
};
