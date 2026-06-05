import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  subtitle?: string;
  delay?: number;
}

const colorMap = {
  brand: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-400',
  success: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
  warning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
  danger: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400',
  info: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400',
};

const iconBgMap = {
  brand: 'bg-indigo-500/20 text-indigo-400',
  success: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/20 text-amber-400',
  danger: 'bg-red-500/20 text-red-400',
  info: 'bg-sky-500/20 text-sky-400',
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, subtitle, delay = 0 }) => {
  return (
    <div
      className={`glass rounded-2xl p-5 hover-lift bg-gradient-to-br ${colorMap[color]} animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-100">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`rounded-xl p-3 ${iconBgMap[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
