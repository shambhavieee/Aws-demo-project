import React, { useEffect, useState } from 'react';
import { CheckCircle2, MapPin, Clock, User, Award, Loader2 } from 'lucide-react';
import PageWrapper from '../components/Layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import { examsApi } from '../lib/api';
import type { Exam } from '../types';

const ConductedExams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examsApi.list('conducted').then(r => setExams(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper title="Conducted Exams" subtitle="Examination duties you have successfully performed">
      {!loading && (
        <div className="flex items-center gap-3 glass rounded-2xl p-4 mb-6">
          <div className="bg-emerald-500/20 rounded-xl p-2.5 text-emerald-400"><Award size={20} /></div>
          <div>
            <p className="text-slate-200 font-medium">You have conducted <span className="text-emerald-400 font-bold">{exams.length} exams</span> successfully.</p>
            <p className="text-slate-400 text-sm">Your duty performance record is maintained below.</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-400" /></div>
      ) : exams.length === 0 ? (
        <EmptyState title="No conducted exams" description="No exams marked as conducted yet." icon={<CheckCircle2 size={32} />} />
      ) : (
        <div className="overflow-hidden glass rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Exam</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Venue</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, idx) => (
                <tr key={exam.id} className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-800/20'}`}>
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-medium text-slate-200">{exam.examName}</p>
                      <p className="text-xs text-slate-500 mt-0.5"><span className="text-indigo-400">{exam.board}</span> · {exam.subject}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <div className="flex items-start gap-1.5 text-slate-400"><MapPin size={12} className="mt-0.5 shrink-0 text-slate-500" /><span className="text-xs">{exam.venue}</span></div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs"><Clock size={12} className="text-slate-500" /><span>{exam.date} {exam.time}</span></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs"><User size={12} className="text-slate-500" /><span>{exam.role}</span></div>
                  </td>
                  <td className="py-4 px-4"><StatusBadge status={exam.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
};

export default ConductedExams;
