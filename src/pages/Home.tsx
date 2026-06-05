import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, CheckCircle2, CalendarClock, Wallet,
  AlertTriangle, FileText, ArrowRight, TrendingUp, IndianRupee, Loader2,
} from 'lucide-react';
import PageWrapper from '../components/Layout/PageWrapper';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { dashboardApi, examsApi, paymentsApi } from '../lib/api';
import type { DashboardStats, Exam, Payment } from '../types';
import { useAuth } from '../context/AuthContext';

const quickLinks = [
  { to: '/assigned', icon: ClipboardList, label: 'Assigned Exams', color: 'bg-sky-500/10 border-sky-500/20 text-sky-400' },
  { to: '/conducted', icon: CheckCircle2, label: 'Conducted Exams', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  { to: '/upcoming', icon: CalendarClock, label: 'Upcoming Exams', color: 'bg-violet-500/10 border-violet-500/20 text-violet-400' },
  { to: '/payments', icon: Wallet, label: 'Payments', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  { to: '/incidents', icon: AlertTriangle, label: 'Incidents', color: 'bg-red-500/10 border-red-500/20 text-red-400' },
  { to: '/applications', icon: FileText, label: 'Applications', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.stats(),
      examsApi.list(),
      paymentsApi.list(),
    ]).then(([s, e, p]) => {
      setStats(s);
      setRecentExams(e.data.slice(0, 3));
      setRecentPayments(p.data.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageWrapper title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-indigo-400" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Dashboard" subtitle={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Assigned" value={stats?.totalAssigned ?? 0} icon={ClipboardList} color="brand" subtitle="All time" delay={0} />
        <StatCard label="Exams Conducted" value={stats?.totalConducted ?? 0} icon={CheckCircle2} color="success" subtitle="Duty completed" delay={80} />
        <StatCard label="Upcoming Duties" value={stats?.upcomingExams ?? 0} icon={CalendarClock} color="info" subtitle="Scheduled" delay={160} />
        <StatCard label="Total Earnings" value={`₹${(stats?.totalEarnings ?? 0).toLocaleString('en-IN')}`} icon={IndianRupee} color="warning" subtitle="Received so far" delay={240} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Pending Payments" value={stats?.pendingPayments ?? 0} icon={Wallet} color="warning" subtitle="Awaiting clearance" delay={300} />
        <StatCard label="Open Incidents" value={stats?.openIncidents ?? 0} icon={AlertTriangle} color="danger" subtitle="Needs attention" delay={360} />
        <StatCard label="Pending Applications" value={stats?.pendingApplications ?? 0} icon={FileText} color="info" subtitle="Awaiting decision" delay={420} />
      </div>

      {/* Quick Navigation */}
      <div className="glass rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-indigo-400" />
          <h2 className="font-semibold text-slate-200">Quick Navigation</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map(({ to, icon: Icon, label, color }) => (
            <button key={to} onClick={() => navigate(to)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border hover:scale-105 transition-transform duration-200 ${color}`}>
              <Icon size={22} />
              <span className="text-xs font-medium text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exams */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-200 flex items-center gap-2">
              <ClipboardList size={16} className="text-indigo-400" /> Recent Exams
            </h2>
            <button onClick={() => navigate('/assigned')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentExams.map((exam) => (
              <div key={exam.id} className="glass-light rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{exam.examName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{exam.venue} · {exam.date}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{exam.role}</p>
                  </div>
                  <StatusBadge status={exam.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-200 flex items-center gap-2">
              <Wallet size={16} className="text-amber-400" /> Payment Status
            </h2>
            <button onClick={() => navigate('/payments')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentPayments.map((pay) => (
              <div key={pay.id} className="glass-light rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{pay.examName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{pay.examDate} · {pay.dutyType}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-100">₹{pay.amount.toLocaleString('en-IN')}</p>
                    <StatusBadge status={pay.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
