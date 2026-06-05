import React, { useEffect, useState } from 'react';
import { Wallet, IndianRupee, Clock, CheckCircle2, AlertCircle, Filter, Loader2 } from 'lucide-react';
import PageWrapper from '../components/Layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import { paymentsApi } from '../lib/api';
import type { Payment } from '../types';

type FilterStatus = 'all' | 'paid' | 'pending' | 'processing' | 'rejected';

const Payments: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentsApi.list().then(r => { setAllPayments(r.data); setPayments(r.data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (filter === 'all') { setPayments(allPayments); return; }
    setPayments(allPayments.filter(p => p.status === filter));
  }, [filter, allPayments]);

  const totalPaid = allPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = allPayments.filter(p => p.status === 'pending' || p.status === 'processing').reduce((s, p) => s + p.amount, 0);

  return (
    <PageWrapper title="Payments" subtitle="Duty honorarium and payment status">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Received" value={`₹${totalPaid.toLocaleString('en-IN')}`} icon={IndianRupee} color="success" subtitle="Credited to bank" />
        <StatCard label="Awaiting Payment" value={`₹${totalPending.toLocaleString('en-IN')}`} icon={Clock} color="warning" subtitle="Pending / Processing" />
        <StatCard label="Total Duties" value={allPayments.length} icon={Wallet} color="brand" subtitle="Payment records" />
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <Filter size={15} className="text-slate-400" />
        {(['all', 'paid', 'processing', 'pending', 'rejected'] as FilterStatus[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? 'gradient-brand text-white' : 'glass-light text-slate-400 hover:text-slate-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-400" /></div>
      ) : payments.length === 0 ? (
        <EmptyState title="No payments found" description="No payment records match this filter." />
      ) : (
        <div className="grid gap-4">
          {payments.map((pay, idx) => (
            <div key={pay.id} className="glass rounded-2xl p-5 hover-lift animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">{pay.id}</span>
                    <StatusBadge status={pay.status} />
                  </div>
                  <h3 className="font-semibold text-slate-200 mb-1">{pay.examName}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Exam Date: <span className="text-slate-300">{pay.examDate}</span></span>
                    <span>Duty: <span className="text-slate-300">{pay.dutyType}</span></span>
                    <span>Bank: <span className="text-slate-300">{pay.bankAccount}</span></span>
                    {pay.transactionId && <span>Txn ID: <span className="text-slate-300 font-mono">{pay.transactionId}</span></span>}
                    {pay.paymentDate && <span>Paid on: <span className="text-slate-300">{pay.paymentDate}</span></span>}
                  </div>
                  {pay.remarks && <p className="text-xs text-slate-500 mt-1.5 italic">{pay.remarks}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-100">₹{pay.amount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Honorarium</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/30 flex items-center gap-2 text-xs">
                {pay.status === 'paid' && <CheckCircle2 size={13} className="text-emerald-400" />}
                {(pay.status === 'processing' || pay.status === 'pending') && <Clock size={13} className="text-amber-400" />}
                {pay.status === 'rejected' && <AlertCircle size={13} className="text-red-400" />}
                <span className="text-slate-400">{pay.remarks}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Payments;
