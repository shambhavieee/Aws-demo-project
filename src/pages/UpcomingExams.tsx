import React, { useEffect, useState } from 'react';
import { CalendarClock, MapPin, Clock, Bell, User, Loader2 } from 'lucide-react';
import PageWrapper from '../components/Layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import { examsApi } from '../lib/api';
import type { Exam } from '../types';

function daysUntil(dateStr: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const UpcomingExams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both "upcoming" and "assigned" status exams
    Promise.all([examsApi.list('upcoming'), examsApi.list('assigned')])
      .then(([u, a]) => setExams([...u.data, ...a.data]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper title="Upcoming Exams" subtitle="Your scheduled examination duties">
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-400" /></div>
      ) : exams.length === 0 ? (
        <EmptyState title="No upcoming exams" description="You have no upcoming exam duties scheduled." icon={<CalendarClock size={32} />} />
      ) : (
        <div className="grid gap-5">
          {exams.map((exam, idx) => {
            const days = daysUntil(exam.date);
            const urgency = days <= 3 ? 'text-red-400 bg-red-500/10 border-red-500/20'
              : days <= 7 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
            return (
              <div key={exam.id} className="glass rounded-2xl overflow-hidden hover-lift animate-slide-up" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="h-1 gradient-brand"></div>
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{exam.id}</span>
                        <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">{exam.board}</span>
                        <StatusBadge status={exam.status} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">{exam.examName}</h3>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
                        <div className="flex items-center gap-2"><Clock size={14} className="text-slate-500" /><span><span className="text-slate-300">{exam.date}</span> at {exam.time}</span></div>
                        <div className="flex items-center gap-2"><Bell size={14} className="text-slate-500" /><span>Report by <span className="text-slate-300">{exam.reportingTime}</span></span></div>
                        <div className="flex items-center gap-2"><User size={14} className="text-slate-500" /><span>{exam.role} · {exam.dutyType}</span></div>
                        <div className="flex items-start gap-2"><MapPin size={14} className="text-slate-500 mt-0.5 shrink-0" /><span className="text-xs">{exam.venue}</span></div>
                      </div>
                    </div>
                    <div className={`flex flex-col items-center justify-center border rounded-2xl px-5 py-4 min-w-[90px] ${urgency}`}>
                      <span className="text-3xl font-black">{days}</span>
                      <span className="text-xs font-medium mt-0.5">days away</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={11} />{exam.venueAddress}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
};

export default UpcomingExams;
