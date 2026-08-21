import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showIcon = true,
  size = 'md'
}) => {
  const getBadgeStyle = () => {
    switch (level) {
      case 'low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'critical':
        return 'bg-red-500/15 text-red-400 border-red-500/40 shadow-sm shadow-red-500/20 animate-pulse-slow';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'low':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'medium':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'high':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'critical':
        return <ShieldAlert className="w-3.5 h-3.5" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${sizeClasses[size]} ${getBadgeStyle()}`}
    >
      {showIcon && getIcon()}
      <span className="capitalize">{level} Risk</span>
      {score !== undefined && (
        <span className="opacity-75 font-mono">({score})</span>
      )}
    </span>
  );
};
