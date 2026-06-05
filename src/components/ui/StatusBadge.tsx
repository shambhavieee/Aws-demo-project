import React from 'react';

type StatusVariant =
  | 'assigned' | 'conducted' | 'upcoming' | 'cancelled'
  | 'paid' | 'pending' | 'processing' | 'rejected'
  | 'open' | 'under_review' | 'resolved' | 'closed'
  | 'approved' | 'waitlisted'
  | 'low' | 'medium' | 'high' | 'critical';

const variantStyles: Record<StatusVariant, string> = {
  // Exam status
  assigned: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  conducted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  upcoming: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  // Payment
  paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  processing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  // Incident status
  open: 'bg-red-500/15 text-red-400 border-red-500/30',
  under_review: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  closed: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  // Application
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  waitlisted: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  // Severity
  low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const labelMap: Partial<Record<StatusVariant, string>> = {
  under_review: 'Under Review',
};

interface StatusBadgeProps {
  status: StatusVariant;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const label = labelMap[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[status]}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
