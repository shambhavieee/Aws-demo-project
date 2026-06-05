import React, { useEffect, useState } from 'react';
import { AlertTriangle, MapPin, Clock, ShieldAlert, Loader2 } from 'lucide-react';
import PageWrapper from '../components/Layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import { incidentsApi } from '../lib/api';
import type { Incident } from '../types';

const severityIcon: Record<string, string> = { low: '🟢', medium: '🟡', high: '🟠', critical: '🔴' };

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    incidentsApi.list().then(r => setIncidents(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper title="Incidents" subtitle="Incidents reported during examination duties">
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6">
        <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-300 font-medium text-sm">Incident Records</p>
          <p className="text-amber-400/70 text-xs mt-0.5">All incidents are reviewed by the Examination Monitoring Cell. Maintain professional conduct and report accurately.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-400" /></div>
      ) : incidents.length === 0 ? (
        <EmptyState title="No incidents reported" description="You have not reported any incidents during your examination duties." icon={<AlertTriangle size={32} />} />
      ) : (
        <div className="grid gap-5">
          {incidents.map((inc, idx) => (
            <div key={inc.id} className="glass rounded-2xl overflow-hidden hover-lift animate-slide-up" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className={`h-1 ${inc.severity === 'critical' ? 'bg-red-500' : inc.severity === 'high' ? 'bg-orange-500' : inc.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">{inc.id}</span>
                      <span className="text-sm">{severityIcon[inc.severity]}</span>
                      <StatusBadge status={inc.severity as any} />
                      <StatusBadge status={inc.status as any} />
                    </div>
                    <h3 className="font-semibold text-slate-100 text-base">{inc.incidentType}</h3>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-400 mb-4">
                  <div><p className="text-slate-500 mb-0.5">Exam</p><p className="text-slate-300">{inc.examName}</p></div>
                  <div className="flex items-start gap-1.5"><MapPin size={11} className="text-slate-500 mt-0.5 shrink-0" /><div><p className="text-slate-500 mb-0.5">Venue</p><p className="text-slate-300">{inc.venue}</p></div></div>
                  <div className="flex items-start gap-1.5"><Clock size={11} className="text-slate-500 mt-0.5 shrink-0" /><div><p className="text-slate-500 mb-0.5">Reported At</p><p className="text-slate-300">{new Date(inc.reportedAt).toLocaleString('en-IN')}</p></div></div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 mb-3">
                  <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Incident Description</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{inc.description}</p>
                </div>
                {inc.actionTaken && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                    <p className="text-xs text-emerald-400 font-medium mb-1 uppercase tracking-wide">Action Taken</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{inc.actionTaken}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Incidents;
