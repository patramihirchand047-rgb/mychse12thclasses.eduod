import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  AlertCircle,
  FileCheck,
  QrCode,
  Download,
  DollarSign,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  Sparkles,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { PaymentReceipt, PaymentStatus } from '../types';

interface PaymentApprovalsProps {
  onPreviewReceipt: (receipt: PaymentReceipt) => void;
}

export const PaymentApprovals: React.FC<PaymentApprovalsProps> = ({ onPreviewReceipt }) => {
  const {
    payments,
    approvePayment,
    rejectPayment,
    verifyUtrAndUnlockAccess,
    exportPaymentsToCSV,
    isSupabaseConnected,
    isSyncingSupabase,
    syncWithSupabase,
  } = useAdminData();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        p.studentRegNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.utrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.stream.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [payments, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const totalRevenue = payments
      .filter((p) => p.status === 'Approved')
      .reduce((sum, p) => sum + p.amount, 0);

    const pending = payments.filter((p) => p.status === 'Pending').length;
    const approved = payments.filter((p) => p.status === 'Approved').length;

    // Stream breakdown
    const artsRev = payments
      .filter((p) => p.status === 'Approved' && p.stream === 'Arts')
      .reduce((sum, p) => sum + p.amount, 0);

    const scienceRev = payments
      .filter((p) => p.status === 'Approved' && p.stream === 'Science')
      .reduce((sum, p) => sum + p.amount, 0);

    const commerceRev = payments
      .filter((p) => p.status === 'Approved' && p.stream === 'Commerce')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue,
      pending,
      approved,
      artsRev,
      scienceRev,
      commerceRev,
    };
  }, [payments]);

  const handleVerifyUTR = (payment: PaymentReceipt) => {
    verifyUtrAndUnlockAccess(payment.id);
    setToastMessage(`12-Digit UTR verified for ${payment.studentName} (${payment.studentRegNo}). Chapter 2+ digital access unlocked!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleConfirmReject = () => {
    if (!rejectingPaymentId) return;
    const payment = payments.find((p) => p.id === rejectingPaymentId);
    rejectPayment(rejectingPaymentId, rejectReason.trim() || 'Invalid UTR reference or unverified bank credit');
    setToastMessage(`Transaction UTR flagged as Rejected.`);
    setRejectingPaymentId(null);
    setRejectReason('');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/70 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CHSE Odisha Regional Banking Ledger
              </span>
              <span className="text-xs text-slate-400">UPI QR & Razorpay Gateway</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-400" />
              Payment & 12-Digit UTR Verification Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Audit manual UPI payments (PhonePe, Google Pay, Paytm, BHIM) and Razorpay transactions. 1-Click UTR verification instantly marks courses as PAID and unlocks Chapter 2+ access.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
            <button
              onClick={() => syncWithSupabase()}
              disabled={isSyncingSupabase}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isSupabaseConnected
                  ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-900/60'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700'
              } disabled:opacity-50`}
              title={isSupabaseConnected ? 'Refresh live purchases from Supabase' : 'Supabase is in local offline mode'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Purchases'}</span>
            </button>
            <button
              onClick={exportPaymentsToCSV}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-emerald-200 text-sm flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Financial Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Total Verified Collections</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.approved} students active across Odisha
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Pending Verification</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {stats.pending} Transactions
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            12-digit UTRs submitted by students
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Arts Stream (₹99 Tier)</span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">₹99</span>
          </div>
          <div className="text-2xl font-black text-white">
            ₹{stats.artsRev.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {Math.round(stats.artsRev / 99)} enrolled students
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Science & Comm (₹149 Tier)</span>
            <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">₹149</span>
          </div>
          <div className="text-2xl font-black text-white">
            ₹{(stats.scienceRev + stats.commerceRev).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Science: ₹{stats.scienceRev} • Comm: ₹{stats.commerceRev}
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 12-Digit UTR, Reg No, or Student Name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? status === 'Approved'
                    ? 'bg-emerald-600 text-white'
                    : status === 'Pending'
                    ? 'bg-amber-600 text-white'
                    : status === 'Rejected'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student & Stream</th>
                <th className="py-3.5 px-4">12-Digit Bank UTR / ID</th>
                <th className="py-3.5 px-4">Amount & Tier</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status & Access</th>
                <th className="py-3.5 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((receipt) => {
                  const isPending = receipt.status === 'Pending';
                  const isApproved = receipt.status === 'Approved';
                  const isRejected = receipt.status === 'Rejected';

                  return (
                    <tr
                      key={receipt.id}
                      className="hover:bg-slate-850/50 transition-colors"
                    >
                      {/* Student & Stream */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{receipt.studentName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-xs text-emerald-400 font-semibold">
                            {receipt.studentRegNo}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                              receipt.stream === 'Science'
                                ? 'bg-sky-500/10 text-sky-400'
                                : receipt.stream === 'Arts'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {receipt.stream}
                          </span>
                        </div>
                      </td>

                      {/* 12-Digit Bank UTR */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs font-bold text-white bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block">
                          {receipt.utrNumber}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{receipt.paymentDate}</span>
                        </div>
                      </td>

                      {/* Amount & Tier */}
                      <td className="py-3 px-4">
                        <div className="text-sm font-black text-emerald-400">
                          ₹{receipt.amount}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {receipt.stream === 'Arts' ? 'Arts Standard (₹99)' : 'Science / Comm (₹149)'}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-200">{receipt.paymentMethod}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {receipt.paymentGateway || 'UPI QR Manual'}
                        </span>
                      </td>

                      {/* Status & Access */}
                      <td className="py-3 px-4">
                        {isApproved ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              VERIFIED & UNLOCKED
                            </span>
                            <p className="text-[10px] text-slate-500 mt-0.5">Chapter 2+ Active</p>
                          </div>
                        ) : isRejected ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              REJECTED
                            </span>
                            {receipt.rejectionReason && (
                              <p className="text-[10px] text-rose-400 mt-0.5 truncate max-w-xs" title={receipt.rejectionReason}>
                                {receipt.rejectionReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              AWAITING UTR AUDIT
                            </span>
                            <p className="text-[10px] text-slate-500 mt-0.5">Paywall Active</p>
                          </div>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => onPreviewReceipt(receipt)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="View Official Receipt Voucher"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {isPending && (
                          <>
                            <button
                              onClick={() => handleVerifyUTR(receipt)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                              title="Verify Bank UTR & Unlock Course"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Verify UTR</span>
                            </button>

                            <button
                              onClick={() => {
                                setRejectingPaymentId(receipt.id);
                                setRejectReason('');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 border border-slate-700 hover:border-rose-800 font-medium text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Reject / Flag Suspicious UTR"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingPaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              Reject / Flag Suspicious UTR
            </h3>
            <p className="text-xs text-slate-300">
              Provide an audit remark for rejecting this transaction. The student's course access will remain locked.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Reason / Discrepancy Note
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., UTR not found on HDFC bank portal statement / duplicate UTR entered."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingPaymentId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
