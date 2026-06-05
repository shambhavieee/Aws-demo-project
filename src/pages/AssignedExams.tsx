import React, { useEffect, useState } from 'react';
import { ClipboardList, MapPin, Clock, User, Filter, Loader2 } from 'lucide-react';
import PageWrapper from '../components/Layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import { examsApi } from '../lib/api';
import type { Exam } from '../types';

type FilterStatus = 'all' | 'assigned' | 'conducted' | 'upcoming';

const AssignedExams: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    examsApi.list(filter === 'all' ? undefined : filter)
      .then(r => setExams(r.data))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <PageWrapper title="Assigned Exams" subtitle="All examination duties assigned to you">
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={16} className="text-slate-400" />
        {(['all', 'assigned', 'upcoming', 'conducted'] as FilterStatus[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f ? 'gradient-brand text-white shadow-md shadow-indigo-500/30' : 'glass-light text-slate-400 hover:text-slate-200'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">{exams.length} result{exams.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-400" /></div>
      ) : exams.length === 0 ? (
        <EmptyState title="No exams found" description="No exams match the selected filter." />
      ) : (
        <div className="grid gap-4">
          {exams.map((exam, idx) => (
            <div key={exam.id} className="glass rounded-2xl p-5 hover-lift animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{exam.id}</span>
                    <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">{exam.board}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 mb-2">{exam.examName}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5"><Clock size={13} className="text-slate-500 shrink-0" /><span>{exam.date} · {exam.time}</span></div>
                    <div className="flex items-center gap-1.5"><User size={13} className="text-slate-500 shrink-0" /><span>{exam.role} · {exam.dutyType}</span></div>
                    <div className="flex items-start gap-1.5 sm:col-span-2"><MapPin size={13} className="text-slate-500 shrink-0 mt-0.5" /><span>{exam.venue} — {exam.venueAddress}</span></div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3">
                  <StatusBadge status={exam.status} />
                  <div className="text-right"><p className="text-xs text-slate-500">Reporting</p><p className="text-sm font-semibold text-slate-300">{exam.reportingTime}</p></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default AssignedExams;
