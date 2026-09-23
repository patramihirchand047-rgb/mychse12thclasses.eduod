import React from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Building,
  QrCode,
  AlertCircle,
} from 'lucide-react';
import { PaymentReceipt } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';

interface ReceiptPreviewModalProps {
  receipt: PaymentReceipt | null;
  onClose: () => void;
}

export const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({
  receipt,
  onClose,
}) => {
  const { approvePayment, rejectPayment } = useAdminData();

  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-850 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">UPI / Bank Transaction Proof</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ref: {receipt.utrNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Digital Simulated Receipt Card */}
        <div className="mt-4 bg-slate-900 border border-slate-750 rounded-xl p-5 shadow-inner space-y-4 text-xs">
          
          <div className="text-center pb-3 border-b border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
              PAYMENT BENEFICIARY ACCOUNT
            </span>
            <h4 className="font-extrabold text-white text-sm mt-0.5">
              MY CHSE 12TH CLASSES (Odisha Digital Learning)
            </h4>
            <p className="text-[11px] text-slate-400">HDFC Bank • A/C No: 50200084920194 • IFSC: HDFC0001294</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Student Name:</span>
              <strong className="text-white">{receipt.studentName}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">CHSE Registration Number:</span>
              <strong className="font-mono text-amber-400 font-bold">{receipt.studentRegNo}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Stream:</span>
              <span className="text-slate-200 font-semibold">{receipt.stream}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Transaction Date & Time:</span>
              <span className="text-slate-200">{receipt.paymentDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Payment App / Channel:</span>
              <span className="text-slate-200 font-medium">{receipt.paymentMethod}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">12-Digit UPI UTR Reference:</span>
              <span className="font-mono font-bold text-amber-300 select-all">{receipt.utrNumber}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-300">Amount Paid:</span>
              <span className="text-xl font-black text-emerald-400">₹{receipt.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Verification Status */}
          <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Audit Status:</span>
            <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
              receipt.status === 'Approved'
                ? 'bg-emerald-950 text-emerald-300'
                : receipt.status === 'Pending'
                ? 'bg-amber-950 text-amber-300'
                : 'bg-rose-950 text-rose-300'
            }`}>
              {receipt.status}
            </span>
          </div>

          {receipt.notes && (
            <p className="text-[11px] text-slate-400 italic">
              Student Note: "{receipt.notes}"
            </p>
          )}

        </div>

        {/* Action buttons */}
        <div className="mt-5 pt-3 border-t border-slate-700 flex items-center justify-between gap-2">
          {receipt.status === 'Pending' ? (
            <>
              <button
                onClick={() => {
                  rejectPayment(receipt.id, 'Transaction details unverified with bank statement');
                  onClose();
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-slate-800 hover:bg-rose-900 rounded-xl transition-colors"
              >
                Reject Slip
              </button>

              <button
                onClick={() => {
                  approvePayment(receipt.id);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                1-Click Approve Course Access
              </button>
            </>
          ) : (
            <div className="w-full text-right">
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
