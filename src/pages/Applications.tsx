import React, { useEffect, useState } from 'react';
import { FileText, CalendarDays, Building2, User, Filter, Clock, CheckCircle2, XCircle, Hourglass, Loader2 } from 'lucide-react';
import PageWrapper from '../components/Layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import { applicationsApi } from '../lib/api';
import type { Application } from '../types';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'waitlisted';

const statusIcon = {
  approved: <CheckCircle2 size={14} className="text-emerald-400" />,
  rejected: <XCircle size={14} className="text-red-400" />,
  pending: <Clock size={14} className="text-amber-400" />,
  waitlisted: <Hourglass size={14} className="text-orange-400" />,
};

const Applications: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [allApps, setAllApps] = useState<Application[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsApi.list().then(r => { setAllApps(r.data); setApps(r.data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setApps(filter === 'all' ? allApps : allApps.filter(a => a.status === filter));
  }, [filter, allApps]);

  return (
    <PageWrapper title="Applications" subtitle="Exams you have applied for and their status">
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={15} className="text-slate-400" />
        {(['all', 'pending', 'approved', 'waitlisted', 'rejected'] as FilterStatus[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? 'gradient-brand text-white' : 'glass-light text-slate-400 hover:text-slate-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">{apps.length} application{apps.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-400" /></div>
      ) : apps.length === 0 ? (
        <EmptyState title="No applications found" description="No applications match the selected filter." icon={<FileText size={32} />} />
      ) : (
        <div className="grid gap-4">
          {apps.map((app, idx) => (
            <div key={app.id} className="glass rounded-2xl p-5 hover-lift animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{app.id}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <h3 className="font-semibold text-slate-100 text-base mb-2">{app.examName}</h3>
                  <div className="grid sm:grid-cols-2 gap-y-1.5 gap-x-6 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5"><Building2 size={13} className="text-slate-500" /><span>Board: <span className="text-slate-300">{app.board}</span></span></div>
                    <div className="flex items-center gap-1.5"><CalendarDays size={13} className="text-slate-500" /><span>Exam Date: <span className="text-slate-300">{app.examDate}</span></span></div>
                    <div className="flex items-center gap-1.5"><User size={13} className="text-slate-500" /><span>Role: <span className="text-slate-300">{app.role}</span></span></div>
                    <div className="flex items-center gap-1.5"><Clock size={13} className="text-slate-500" /><span>Applied: <span className="text-slate-300">{app.appliedOn}</span></span></div>
                    <div className="flex items-center gap-1.5 sm:col-span-2"><FileText size={13} className="text-slate-500" /><span>Venue: <span className="text-slate-300">{app.preferredVenue}</span></span></div>
                  </div>
                </div>
                <div className={`flex flex-col gap-1 text-right shrink-0 sm:min-w-[140px] p-3 rounded-xl border ${
                  app.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20' :
                  app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20' :
                  app.status === 'waitlisted' ? 'bg-orange-500/10 border-orange-500/20' :
                  'bg-amber-500/10 border-amber-500/20'}`}>
                  <div className="flex items-center justify-end gap-1.5">
                    {statusIcon[app.status as keyof typeof statusIcon]}
                    <span className="text-sm font-semibold text-slate-200 capitalize">{app.status}</span>
                  </div>
                  {app.reviewedOn && <p className="text-xs text-slate-500">Reviewed: {app.reviewedOn}</p>}
                </div>
              </div>
              {app.remarks && (
                <div className="mt-3 pt-3 border-t border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-0.5 font-medium">Remarks from Coordinator</p>
                  <p className="text-sm text-slate-400 italic">{app.remarks}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Applications;
