import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  TrendingUp,
  CreditCard,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Calendar,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { Student } from '../types';

interface OverviewDashboardProps {
  onSelectTab: (tab: any) => void;
  onSelectStudent: (student: Student) => void;
  onOpenPasswordReset: (regNo?: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onSelectTab,
  onSelectStudent,
  onOpenPasswordReset,
}) => {
  const { students, lessons, mockTests, payments, announcements, auditLogs } = useAdminData();
  const [quickSearch, setQuickSearch] = useState('');

  // Computations
  const totalStudents = students.length;
  const scienceCount = students.filter((s) => s.stream === 'Science').length;
  const artsCount = students.filter((s) => s.stream === 'Arts').length;
  const commerceCount = students.filter((s) => s.stream === 'Commerce').length;

  const activeStudents = students.filter((s) => s.accountStatus === 'Active').length;
  const approvedPaidStudents = students.filter((s) => s.courseAccessApproved).length;
  const conversionRate = totalStudents > 0 ? ((approvedPaidStudents / totalStudents) * 100).toFixed(1) : '0';

  const totalRevenue = payments
    .filter((p) => p.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === 'Pending');
  const pendingRegistrations = students.filter((s) => s.accountStatus === 'Pending');

  // Quick search results
  const searchResults = quickSearch.trim()
    ? students.filter(
        (s) =>
          s.chseRegNo.toLowerCase().includes(quickSearch.toLowerCase()) ||
          s.name.toLowerCase().includes(quickSearch.toLowerCase()) ||
          s.rollNo.toLowerCase().includes(quickSearch.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & System Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                CHSE Odisha Portal 2026
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero-OTP Engine Online
              </span>
              <a
                href="https://mychse12thclassesedu.netlify.app"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono transition-colors bg-sky-950/50 px-2 py-0.5 rounded border border-sky-800/50"
                title="Open Live Student Learning Portal in new tab"
              >
                <ExternalLink className="w-3 h-3 text-sky-400" />
                mychse12thclassesedu.netlify.app
              </a>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
              Higher Secondary Education Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live monitoring of Science, Arts, and Commerce students, study materials, and examination blueprints across 30 Odisha districts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://mychse12thclassesedu.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-700/60 text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
              title="Open Live Student Learning Portal in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>User Panel</span>
            </a>
            <button
              onClick={() => onSelectTab('students')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow"
            >
              <Users className="w-4 h-4" />
              Manage SAMIS Students
            </button>
            <button
              onClick={() => onSelectTab('payments')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Review Fee Slips ({pendingPayments.length})
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Student Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Instant Student & Registration Lookup</h2>
              <p className="text-xs text-slate-400">Search by official CHSE Reg No (MYCHSE-2026-XXXXX), Roll No, or Student Name</p>
            </div>
          </div>
          {searchResults.length > 0 && (
            <span className="text-xs text-amber-400 font-semibold bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/30">
              Found {searchResults.length} student record{searchResults.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            id="overview-instant-search"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Type 'MYCHSE-2026-00101', 'Aurobinda', '12-SCI-042', or college name..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
          {quickSearch && (
            <button
              onClick={() => setQuickSearch('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Search Instant Card List */}
        {searchResults.length > 0 && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map((student) => (
              <div
                key={student.id}
                className="bg-slate-850 border border-slate-700/80 hover:border-amber-500/50 rounded-xl p-3.5 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {student.chseRegNo}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      student.stream === 'Science'
                        ? 'bg-sky-900/60 text-sky-200 border border-sky-700'
                        : student.stream === 'Arts'
                        ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700'
                        : 'bg-purple-900/60 text-purple-200 border border-purple-700'
                    }`}>
                      {student.stream}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{student.name}</h4>
                  <p className="text-xs text-slate-300">Roll: {student.rollNo}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-1">{student.college}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    student.accountStatus === 'Active'
                      ? 'bg-emerald-950 text-emerald-400'
                      : student.accountStatus === 'Pending'
                      ? 'bg-amber-950 text-amber-400'
                      : 'bg-rose-950 text-rose-400'
                  }`}>
                    {student.accountStatus}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenPasswordReset(student.chseRegNo)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-medium border border-slate-700 flex items-center gap-1"
                      title="Direct zero-OTP password reset"
                    >
                      <KeyRound className="w-3 h-3" /> Reset Pass
                    </button>
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Registered Students</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalStudents}
            </span>
            <span className="text-xs text-emerald-400 font-semibold ml-2 inline-flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +100% Zero-OTP
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Active: <strong className="text-slate-200">{activeStudents}</strong></span>
            <span>Pending: <strong className="text-amber-400">{pendingRegistrations.length}</strong></span>
          </div>
        </div>

        {/* Stream Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Stream Breakdown</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Science:</span>
              <span className="font-bold text-white">{scienceCount} ({totalStudents ? Math.round((scienceCount/totalStudents)*100) : 0}%)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-medium">Arts:</span>
              <span className="font-bold text-white">{artsCount} ({totalStudents ? Math.round((artsCount/totalStudents)*100) : 0}%)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300 font-medium">Commerce:</span>
              <span className="font-bold text-white">{commerceCount} ({totalStudents ? Math.round((commerceCount/totalStudents)*100) : 0}%)</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 flex overflow-hidden">
            <div style={{ width: `${totalStudents ? (scienceCount/totalStudents)*100 : 33}%` }} className="bg-sky-500" />
            <div style={{ width: `${totalStudents ? (artsCount/totalStudents)*100 : 33}%` }} className="bg-emerald-500" />
            <div style={{ width: `${totalStudents ? (commerceCount/totalStudents)*100 : 33}%` }} className="bg-purple-500" />
          </div>
        </div>

        {/* Purchase Conversion Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Paid Conversion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {conversionRate}%
            </span>
            <span className="text-xs text-slate-400 ml-2">
              ({approvedPaidStudents} Enrolled)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Pending Approvals:</span>
            <strong className="text-amber-400 font-semibold">{pendingPayments.length} slips</strong>
          </div>
        </div>

        {/* Total Verified Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Verified Revenue</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 ml-2">
              via UPI & QR
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Avg Order Value:</span>
            <span className="text-slate-200 font-semibold">₹1,149</span>
          </div>
        </div>

      </div>

      {/* Two-column layout: Left (Stream Curriculum & Mock Tests), Right (Pending Approvals & Audit Trail) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Content & Blueprints overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Lessons & Curricula Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Course Content & Study Materials
                </h3>
                <p className="text-xs text-slate-400">
                  Video lectures (YouTube/Vimeo) and bilingual Odia & English PDF notes
                </p>
              </div>
              <button
                onClick={() => onSelectTab('courses')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                Manage Syllabi →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs font-bold text-sky-400 flex items-center justify-between">
                  <span>Science Stream</span>
                  <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded">7 Subjects</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Physics, Chemistry, Math, Biology, IT, Odia, English</p>
                <div className="mt-2 text-xs text-slate-300 flex items-center justify-between">
                  <span>Uploaded Lectures:</span>
                  <strong className="text-white">{lessons.filter((l) => l.stream === 'Science').length}</strong>
                </div>
              </div>

              <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>Arts Stream</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">7 Subjects</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Pol Sci, History, Econ, Education, Logic, Odia, English</p>
                <div className="mt-2 text-xs text-slate-300 flex items-center justify-between">
                  <span>Uploaded Lectures:</span>
                  <strong className="text-white">{lessons.filter((l) => l.stream === 'Arts').length}</strong>
                </div>
              </div>

              <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs font-bold text-purple-400 flex items-center justify-between">
                  <span>Commerce Stream</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded">6 Subjects</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Accountancy, BST, Management, Econ, Odia, English</p>
                <div className="mt-2 text-xs text-slate-300 flex items-center justify-between">
                  <span>Uploaded Lectures:</span>
                  <strong className="text-white">{lessons.filter((l) => l.stream === 'Commerce').length}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* CHSE Mock Tests & Blueprints */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  CHSE Mock Tests & State Rank Publishing
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-board exams matching Group A (MCQs), Group B (Short), Group C (Long) blueprints
                </p>
              </div>
              <button
                onClick={() => onSelectTab('mocktests')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                View Question Bank →
              </button>
            </div>

            <div className="space-y-2.5">
              {mockTests.slice(0, 3).map((test) => (
                <div
                  key={test.id}
                  className="bg-slate-850 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        test.stream === 'Science'
                          ? 'bg-sky-950 text-sky-300'
                          : test.stream === 'Arts'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-purple-950 text-purple-300'
                      }`}>
                        {test.stream}
                      </span>
                      <span className="text-xs font-semibold text-white">{test.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {test.subject} • {test.totalMarks} Marks ({test.passingMarks} to pass) • {test.durationMinutes} mins
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      test.status === 'published'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {test.status.toUpperCase()}
                    </span>
                    {test.resultsPublished && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        Rankings Published
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Urgent Pending Approvals & Security Audit */}
        <div className="space-y-6">
          
          {/* Pending Manual UPI Approvals */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Pending UPI Approvals
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                {pendingPayments.length} Pending
              </span>
            </div>

            {pendingPayments.length > 0 ? (
              <div className="space-y-3">
                {pendingPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-850 border border-slate-800 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{p.studentName}</span>
                      <span className="text-xs font-extrabold text-emerald-400">₹{p.amount}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Ref: {p.utrNumber}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{p.paymentMethod}</span>
                      <button
                        onClick={() => onSelectTab('payments')}
                        className="text-[11px] px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs"
                      >
                        1-Click Approve Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1 opacity-70" />
                All UPI & manual slips are verified!
              </div>
            )}
          </div>

          {/* Recent Audit Log Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Admin Audit Trail
              </h3>
              <button
                onClick={() => onSelectTab('security')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                Full Log →
              </button>
            </div>

            <div className="space-y-2.5">
              {auditLogs.slice(0, 4).map((log, index) => (
                <div
                  key={`${log.id}-${index}`}
                  className="p-2.5 rounded-lg bg-slate-850 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-mono text-amber-400 font-semibold">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-tight line-clamp-2">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
