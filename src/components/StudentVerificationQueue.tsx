import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Check,
  X,
  Search,
  Filter,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  Clock,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { StreamType, RegistrationApplication } from '../types';

export const StudentVerificationQueue: React.FC = () => {
  const {
    applications,
    approveApplication,
    rejectApplication,
    gatewayConfig,
    syncWithSupabase,
    isSyncingSupabase,
    isSupabaseConnected,
  } = useAdminData();

  const [streamFilter, setStreamFilter] = useState<'All' | StreamType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending Review' | 'Approved' | 'Rejected'>('Pending Review');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModalApp, setRejectModalApp] = useState<RegistrationApplication | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (streamFilter !== 'All' && app.stream !== streamFilter) return false;
      if (statusFilter !== 'All' && app.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = app.applicantName.toLowerCase().includes(q);
        const matchesFather = app.fatherName.toLowerCase().includes(q);
        const matchesPhone = app.mobileNumber.includes(q);
        const matchesCollege = app.college.toLowerCase().includes(q);
        const matchesDistrict = app.district.toLowerCase().includes(q);
        const matchesReg = app.assignedRegNo?.toLowerCase().includes(q);
        return matchesName || matchesFather || matchesPhone || matchesCollege || matchesDistrict || matchesReg;
      }
      return true;
    });
  }, [applications, streamFilter, statusFilter, searchQuery]);

  const pendingCount = useMemo(() => applications.filter((a) => a.status === 'Pending Review').length, [applications]);

  const handleApprove = (app: RegistrationApplication) => {
    const res = approveApplication(app.id);
    if (res.success && res.student) {
      setSuccessToast(`Application Approved for ${app.applicantName}! Assigned Reg No: ${res.student.chseRegNo}. Student can now sign in.`);
      setTimeout(() => setSuccessToast(null), 6000);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectModalApp) return;
    rejectApplication(rejectModalApp.id, rejectionRemarks || 'Documents or mobile verification discrepancy');
    setRejectModalApp(null);
    setRejectionRemarks('');
    setSuccessToast(`Registration for ${rejectModalApp.applicantName} marked as Rejected.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/70 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Incoming SAMIS Portal Sync
              </span>
              <a
                href="https://mychse12thclassesedu.netlify.app"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 font-mono transition-colors"
                title="Open Live Student Learning Portal in new tab"
              >
                <ExternalLink className="w-3 h-3 text-sky-400" />
                mychse12thclassesedu.netlify.app
              </a>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-emerald-400" />
              Student Registration Verification Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time approval desk for applicants across Odisha. 1-Click Approval assigns official format{' '}
              <code className="text-emerald-300 font-mono font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                MYCHSE-2026-XXXXX
              </code>{' '}
              and enables zero-OTP password access.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => syncWithSupabase()}
              disabled={isSyncingSupabase}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isSupabaseConnected
                  ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-900/60'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700'
              } disabled:opacity-50`}
              title="Sync live registrations from Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingSupabase ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Supabase'}</span>
            </button>
            <div className="px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-center">
              <span className="block text-2xl font-black text-emerald-400">{pendingCount}</span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Pending Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-emerald-200 text-sm flex items-center justify-between shadow-lg shadow-emerald-950/40">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, father, phone, college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Stream and Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            {(['All', 'Arts', 'Science', 'Commerce'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStreamFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  streamFilter === s ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            {(['Pending Review', 'Approved', 'Rejected', 'All'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-400 mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-base font-semibold text-white">All Caught Up!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            No registration applications match the current filter criteria. Check back for submissions from the student portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => {
            const isArts = app.stream === 'Arts';
            const fee = isArts ? gatewayConfig.pricing.arts : gatewayConfig.pricing.science;

            return (
              <div
                key={app.id}
                className="bg-slate-900/95 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Student & Academic Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white">{app.applicantName}</h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          app.stream === 'Science'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : app.stream === 'Arts'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {app.stream} Stream (+2 2nd Year)
                      </span>

                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          app.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : app.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300 animate-pulse'
                        }`}
                      >
                        {app.status}
                      </span>

                      {app.assignedRegNo && (
                        <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-emerald-800">
                          {app.assignedRegNo}
                        </span>
                      )}
                    </div>

                    {/* Metadata items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Father:</span>
                        <span className="font-medium text-slate-200">{app.fatherName}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-medium text-slate-200">{app.mobileNumber}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="font-medium text-slate-200">{app.district} District</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-400">{app.appliedDate}</span>
                      </div>
                    </div>

                    {/* College name & Batch */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-slate-300">{app.college}</span>
                      </div>

                      {app.preferredBatch && (
                        <span className="text-slate-400">
                          • Enrolling: <strong className="text-slate-300">{app.preferredBatch}</strong>
                        </span>
                      )}

                      {app.submittedUtr && (
                        <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80 font-mono">
                          Submitted UTR: {app.submittedUtr} (₹{fee})
                        </span>
                      )}
                    </div>

                    {app.rejectionRemarks && (
                      <div className="p-2 bg-rose-950/50 border border-rose-800/60 rounded-lg text-xs text-rose-300">
                        <strong>Rejection Reason:</strong> {app.rejectionRemarks}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                    {app.status === 'Pending Review' ? (
                      <>
                        <button
                          onClick={() => handleApprove(app)}
                          className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>1-Click Approve</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectModalApp(app);
                            setRejectionRemarks('');
                          }}
                          className="flex-1 sm:flex-initial px-3 py-2 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 rounded-xl text-xs font-medium border border-slate-700 hover:border-rose-800 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 inline mr-1" />
                          Reject with Remarks
                        </button>
                      </>
                    ) : app.status === 'Approved' ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Officially Enrolled
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">Ready for Zero-OTP Sign In</p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Application Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                Reject Registration Application
              </h3>
              <button
                onClick={() => setRejectModalApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Rejecting registration for <strong>{rejectModalApp.applicantName}</strong> (
              {rejectModalApp.stream} Stream, {rejectModalApp.college}). Please provide audit remarks:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Rejection Remarks / Reason
              </label>
              <textarea
                rows={3}
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                placeholder="e.g., Mobile number not matching SAMIS admission registry / invalid Stream chosen."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-colors"
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
