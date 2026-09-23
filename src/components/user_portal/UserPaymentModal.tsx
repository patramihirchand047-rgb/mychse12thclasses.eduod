import React, { useState } from 'react';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ExternalLink,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Student } from '../../types';

interface UserPaymentModalProps {
  isOpen: boolean;
  student: Student | null;
  initialStream?: 'Science' | 'Commerce' | 'Arts';
  onClose: () => void;
  onOpenAuth: () => void;
}

interface UpiProvider {
  id: 'navi' | 'hdfc';
  badgeTitle: string;
  upiId: string;
  payeeName: string;
  subtitle: string;
  tag?: string;
  themeColor: string;
}

export const UserPaymentModal: React.FC<UserPaymentModalProps> = ({
  isOpen,
  student,
  initialStream,
  onClose,
  onOpenAuth,
}) => {
  const { submitStudentPaymentReceipt, payments, gatewayConfig } = useAdminData();

  const [selectedProvider, setSelectedProvider] = useState<'navi' | 'hdfc'>('navi');
  const [selectedStream, setSelectedStream] = useState<'Science' | 'Commerce' | 'Arts'>(
    student?.stream || initialStream || 'Science'
  );

  React.useEffect(() => {
    if (student?.stream) {
      setSelectedStream(student.stream);
    } else if (initialStream) {
      setSelectedStream(initialStream);
    }
  }, [student, initialStream]);

  const [utrNumber, setUtrNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUtr, setSubmittedUtr] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Exact 2026-27 Official Batch Stream Pricing
  const STREAM_PRICING: Record<'Arts' | 'Science' | 'Commerce', { price: number; original: number; discount: string }> = {
    Arts: { price: 99, original: 499, discount: '80% OFF' },
    Science: { price: 149, original: 799, discount: '81% OFF' },
    Commerce: { price: 149, original: 799, discount: '81% OFF' },
  };

  const currentPricing = STREAM_PRICING[selectedStream];
  const AMOUNT = currentPricing.price;

  const upiProviders: Record<'navi' | 'hdfc', UpiProvider> = {
    navi: {
      id: 'navi',
      badgeTitle: 'Navi UPI (Axis Bank)',
      upiId: 'mychseclasses@naviaxis',
      payeeName: 'MIHIRCHAND PATRA',
      subtitle: 'Pay using Google Pay, PhonePe, Paytm, Navi & BHIM',
      tag: 'Recommended / ଅଧିକ ପସନ୍ଦ',
      themeColor: '#00D09C',
    },
    hdfc: {
      id: 'hdfc',
      badgeTitle: 'HDFC Bank UPI',
      upiId: gatewayConfig?.upiVpa && gatewayConfig.upiVpa !== 'mychseclasses@naviaxis' 
        ? gatewayConfig.upiVpa 
        : 'patramihirchand394@okhdfcbank',
      payeeName: 'Mihir Chand Patra',
      subtitle: 'Official Council HDFC Direct UPI Account',
      tag: 'Alternative UPI',
      themeColor: '#004c8f',
    },
  };

  const activeProvider = upiProviders[selectedProvider];

  // Check if student already has a pending or approved payment
  const studentPayment = student
    ? payments.find((p) => p.studentRegNo.toUpperCase() === student.chseRegNo.toUpperCase())
    : null;

  const handleCopyUpi = (upiString: string) => {
    navigator.clipboard.writeText(upiString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // UPI Intent URL with stream and 2026-27 session note
  const upiIntentUrl = `upi://pay?pa=${activeProvider.upiId}&pn=${encodeURIComponent(activeProvider.payeeName)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(`CHSE 2026-27 ${selectedStream} Pass - ${student?.name || 'Student'}`)}`;

  // Dynamic high-res QR code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=2&data=${encodeURIComponent(upiIntentUrl)}`;

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!student) {
      setErrorMsg('Please sign in or register as a student first before submitting payment.');
      return;
    }

    const cleanUtr = utrNumber.trim().replace(/\s+/g, '');
    if (cleanUtr.length < 8) {
      setErrorMsg('Please enter a valid 12-digit UPI Reference / UTR Number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitStudentPaymentReceipt({
        studentRegNo: student.chseRegNo,
        studentName: student.name,
        stream: selectedStream,
        courseName: `CHSE +2 2nd Year 2026-27 ${selectedStream} Master Pass`,
        amount: AMOUNT,
        utrNumber: cleanUtr,
        paymentGateway: activeProvider.id === 'navi' ? 'UPI_QR_Navi_mychseclasses' : 'UPI_QR_HDFC',
      });

      if (res.success) {
        setSubmittedUtr(cleanUtr);
      } else {
        setErrorMsg(res.error || 'Failed to submit payment receipt.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error recording transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center space-x-2">
                <span>Unlock Course Pass</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 uppercase">
                  Verified UPI
                </span>
              </h3>
              <p className="text-xs text-emerald-100 font-medium">CHSE Odisha E-Learning Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* 2026-27 Batch & Stream Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black text-[10px]">
                  SESSION 2026-27
                </span>
                <span>Select Course Stream:</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">Special Council Subsidy</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedStream('Arts')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedStream === 'Arts'
                    ? 'bg-amber-950/50 border-amber-500 shadow-md shadow-amber-950/50 ring-1 ring-amber-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80'
                }`}
              >
                <div className="text-xs font-bold text-white">Arts (କଳା)</div>
                <div className="text-sm font-black text-amber-400 mt-0.5">₹99</div>
                <span className="text-[9px] text-slate-400 line-through">₹499</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStream('Science')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedStream === 'Science'
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80'
                }`}
              >
                <div className="text-xs font-bold text-white">Science (ବିଜ୍ଞାନ)</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">₹149</div>
                <span className="text-[9px] text-slate-400 line-through">₹799</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStream('Commerce')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedStream === 'Commerce'
                    ? 'bg-sky-950/50 border-sky-500 shadow-md shadow-sky-950/50 ring-1 ring-sky-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80'
                }`}
              >
                <div className="text-xs font-bold text-white">Commerce (ବାଣିଜ୍ୟ)</div>
                <div className="text-sm font-black text-sky-400 mt-0.5">₹149</div>
                <span className="text-[9px] text-slate-400 line-through">₹799</span>
              </button>
            </div>
          </div>

          {/* Plan Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  2026-27 BATCH
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {currentPricing.discount}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">
                +2 2nd Year {selectedStream} All-Subject Master Pass
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                All {selectedStream} Chapters, Video Lectures, Odia/Eng Notes, Bureau PYQs & Model Tests
              </p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <span className="text-xs text-slate-500 line-through block">₹{currentPricing.original}</span>
              <span className="text-2xl font-black text-emerald-400">₹{AMOUNT}</span>
            </div>
          </div>

          {!student ? (
            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">
                Please verify your student registration with your Registration Number to submit payment.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Verify Student Registration First</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : submittedUtr || (studentPayment && studentPayment.status === 'Pending') ? (
            <div className="p-6 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Payment Receipt Submitted!</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Your 12-digit UTR <strong>{submittedUtr || studentPayment?.utrNumber}</strong> has been submitted to the Admin Verification Queue.
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Student:</span>
                  <span className="text-white font-bold">{student.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reg No:</span>
                  <span className="text-amber-400">{student.chseRegNo}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Paid UPI:</span>
                  <span className="text-emerald-400">{activeProvider.upiId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-amber-400 font-bold">Pending Admin Approval</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Verification typically completes within 10-30 minutes.</span>
              </p>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Close & Return to Courses
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* UPI Option Selector Tabs */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Select UPI Payment Method (UPI ବିକଳ୍ପ ଚୟନ କରନ୍ତୁ):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* Navi UPI Tab */}
                  <button
                    type="button"
                    onClick={() => setSelectedProvider('navi')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      selectedProvider === 'navi'
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Navi UPI</span>
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Primary
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-emerald-300 font-bold truncate">
                      mychseclasses@naviaxis
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      MIHIRCHAND PATRA
                    </p>
                  </button>

                  {/* HDFC UPI Tab */}
                  <button
                    type="button"
                    onClick={() => setSelectedProvider('hdfc')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      selectedProvider === 'hdfc'
                        ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>HDFC Bank UPI</span>
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Alternative
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-blue-300 font-bold truncate">
                      {upiProviders.hdfc.upiId}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      Mihir Chand Patra
                    </p>
                  </button>
                </div>
              </div>

              {/* Step 1: Exact Card Display for Selected UPI */}
              {selectedProvider === 'navi' ? (
                /* AUTHENTIC NAVI UPI QR POSTER CARD */
                <div className="bg-white rounded-3xl p-5 sm:p-6 text-slate-950 shadow-2xl border border-slate-200 text-center relative overflow-hidden">
                  {/* Subtle top background accent */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

                  {/* Navi Brand Header */}
                  <div className="flex items-center justify-center space-x-2 pt-1 mb-2">
                    {/* Navi Green Block Logo */}
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                        <path
                          d="M12 28V12H20V20H28V28H20V20H12V28Z"
                          fill="#00D09C"
                        />
                        <rect x="6" y="22" width="6" height="6" rx="1.5" fill="#00D09C" />
                        <rect x="22" y="6" width="6" height="6" rx="1.5" fill="#00D09C" />
                      </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-900 lowercase font-sans">
                      navi
                    </span>
                  </div>

                  {/* Tagline */}
                  <h4 className="text-sm font-bold text-slate-700 tracking-tight mb-2">
                    Pay using any UPI app
                  </h4>

                  {/* UPI Apps Icons row */}
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    {/* GPay */}
                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-bold">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">P</span>
                      <span className="text-[#FBBC05]">a</span>
                      <span className="text-[#34A853]">y</span>
                    </div>

                    {/* PhonePe */}
                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-[11px] font-bold text-[#5f259f]">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#5f259f] text-white flex items-center justify-center text-[9px] font-black">
                        पे
                      </span>
                      <span>PhonePe</span>
                    </div>

                    {/* Paytm */}
                    <div className="flex items-center space-x-0.5 px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-200 text-[11px] font-bold">
                      <span className="text-[#002e6e]">Pay</span>
                      <span className="text-[#00b9f5]">tm</span>
                    </div>

                    {/* navi */}
                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-extrabold text-[#00a87a]">
                      <span>navi</span>
                    </div>
                  </div>

                  {/* QR Code Container with Center Navi Monogram */}
                  <div className="relative w-52 h-52 sm:w-56 sm:h-56 mx-auto p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-xl flex items-center justify-center">
                    <img
                      src={qrCodeUrl}
                      alt="Navi UPI QR Code - mychseclasses@naviaxis"
                      className="w-full h-full object-contain"
                    />
                    {/* Centered Navi Logo Mark inside QR */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-lg border border-slate-200 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-lg bg-[#00D09C] flex items-center justify-center shadow-inner">
                          <span className="text-white font-black text-xs lowercase">n</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payee Info */}
                  <div className="mt-4 space-y-1">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
                      MIHIRCHAND PATRA
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 font-mono">
                      UPI ID : <span className="text-slate-950 font-black">mychseclasses@naviaxis</span>
                    </p>
                  </div>

                  {/* Action buttons on card */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => handleCopyUpi('mychseclasses@naviaxis')}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-slate-300"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'UPI ID Copied!' : 'Copy mychseclasses@naviaxis'}</span>
                    </button>

                    <a
                      href={upiIntentUrl}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Open in UPI App (₹{AMOUNT})</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* HDFC BANK ALTERNATIVE CARD */
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      HDFC Bank Direct UPI Gateway
                    </span>
                  </div>

                  {/* QR Visual */}
                  <div className="w-48 h-48 mx-auto p-2 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-blue-500/30">
                    <img
                      src={qrCodeUrl}
                      alt="HDFC Bank UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">Mihir Chand Patra</h4>
                    <p className="text-xs font-mono text-blue-400 font-bold mt-0.5">
                      {activeProvider.upiId}
                    </p>
                  </div>

                  {/* Copy UPI ID */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="text-left truncate mr-2">
                      <span className="text-[10px] text-slate-400 block">UPI VPA</span>
                      <span className="font-mono font-bold text-white truncate">{activeProvider.upiId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyUpi(activeProvider.upiId)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold text-xs flex items-center space-x-1 transition-colors shrink-0 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Enter UTR */}
              <form onSubmit={handleSubmitUtr} className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Step 2: Submit 12-Digit Bank UTR / Ref Number</span>
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Paying to: {activeProvider.id === 'navi' ? 'Navi Axis' : 'HDFC'}
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="Enter 12-digit UTR (e.g. 423456789012)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Pay ₹{AMOUNT} via Google Pay / PhonePe / Paytm to <strong>{activeProvider.upiId}</strong>, then enter the 12-digit UPI Ref/UTR above.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting to Verification Queue...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Payment for Instant Verification</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
