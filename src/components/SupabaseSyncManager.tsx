import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  UserCheck,
  CreditCard,
  GraduationCap,
  Megaphone,
  Check,
  X,
  ExternalLink,
  Copy,
  Code,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  FileText,
  BookOpen,
  FlaskConical,
  HelpCircle,
  CloudUpload,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { StreamType, Student, ChapterItem } from '../types';
import { SUPABASE_SCHEMA_SQL, SupabaseConfig } from '../lib/supabase';

interface SupabaseSyncManagerProps {
  onSelectStudent?: (student: Student) => void;
  onOpenPasswordReset?: (regNo?: string) => void;
}

export const SupabaseSyncManager: React.FC<SupabaseSyncManagerProps> = ({
  onSelectStudent,
  onOpenPasswordReset,
}) => {
  const {
    supabaseConfig,
    isSupabaseConnected,
    supabaseStatusMessage,
    supabaseLatency,
    isSyncingSupabase,
    lastSupabaseSync,
    supabaseTableCounts,
    updateSupabaseConfig,
    testSupabaseConnectionStatus,
    syncWithSupabase,
    resetAllData,
    students,
    payments,
    chapters,
    announcements,
    pyqPapers,
    bureauBooks,
    practicals,
    studentDoubts,
    syncAcademicResourcesToSupabase,
    approvePayment,
    rejectPayment,
    approveApplication,
    updateStudentStatus,
    toggleChapterFreeStatus,
    addChapter,
    deleteChapter,
    addAnnouncement,
    toggleAnnouncementActive,
    deleteAnnouncement,
  } = useAdminData();

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'students' | 'purchases' | 'chapters' | 'notices' | 'sql'>('overview');

  // Config Form State
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [projectUrl, setProjectUrl] = useState(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey || '');
  const [serviceRoleKey, setServiceRoleKey] = useState(supabaseConfig.serviceRoleKey || '');
  const [showKeys, setShowKeys] = useState(false);
  const [configSaveMsg, setConfigSaveMsg] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (supabaseConfig.url) setProjectUrl(supabaseConfig.url);
    if (supabaseConfig.anonKey) setAnonKey(supabaseConfig.anonKey);
    if (supabaseConfig.serviceRoleKey) setServiceRoleKey(supabaseConfig.serviceRoleKey);
  }, [supabaseConfig]);

  // Student filter & search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE'>('ALL');

  // Purchase filter & search
  const [purchaseSearch, setPurchaseSearch] = useState('');
  const [purchaseFilter, setPurchaseFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [rejectionModalPaymentId, setRejectionModalPaymentId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Chapter Modal
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [newChapSubject, setNewChapSubject] = useState('Physics');
  const [newChapStream, setNewChapStream] = useState<StreamType>('Science');
  const [newChapNo, setNewChapNo] = useState(1);
  const [newChapTitle, setNewChapTitle] = useState('');
  const [newChapNotesUrl, setNewChapNotesUrl] = useState('');
  const [newChapIsFree, setNewChapIsFree] = useState(false);

  // Notice Form
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeTargetStream, setNoticeTargetStream] = useState<'All' | 'Science' | 'Arts' | 'Commerce'>('All');
  const [noticeCategory, setNoticeCategory] = useState<
    'CHSE Exam Alert' | 'Practical Schedule' | 'Admit Card Update' | 'General Notice' | 'Exam Routine'
  >('Exam Routine');
  const [noticeHighPriority, setNoticeHighPriority] = useState(false);

  // Copy feedback
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setConfigSaveMsg(null);
    const newCfg: SupabaseConfig = {
      url: projectUrl.trim(),
      anonKey: anonKey.trim(),
      serviceRoleKey: serviceRoleKey.trim(),
    };
    const res = await updateSupabaseConfig(newCfg);
    setIsTesting(false);
    setConfigSaveMsg(res.message);
    if (res.success) {
      setTimeout(() => setShowConfigEditor(false), 2000);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    const res = await testSupabaseConnectionStatus();
    setIsTesting(false);
    setConfigSaveMsg(res.message);
  };

  const handleManualSync = async () => {
    await syncWithSupabase();
  };

  const handleResetLocalData = () => {
    if (confirm('This will purge all locally cached records and reset to clean production state. Continue?')) {
      resetAllData();
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapTitle.trim()) return;
    addChapter({
      chapterNo: Number(newChapNo),
      title: newChapTitle.trim(),
      subject: newChapSubject,
      stream: newChapStream,
      isFree: newChapIsFree,
      notesMarkdown: `# ${newChapTitle.trim()}\n\nChapter notes for Odisha CHSE +2 2nd Year`,
      notesPdfUrl: newChapNotesUrl.trim() || undefined,
      boardQuestionsCount: 0,
      mcqCount: 0,
    });
    setIsAddChapterOpen(false);
    setNewChapTitle('');
    setNewChapNotesUrl('');
  };

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    addAnnouncement({
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      targetStream: noticeTargetStream,
      category: noticeCategory,
      isHighPriority: noticeHighPriority,
      active: true,
    });
    setIsAddNoticeOpen(false);
    setNoticeTitle('');
    setNoticeContent('');
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.chseRegNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.mobileNumber ? s.mobileNumber.includes(studentSearch) : false) ||
      s.college.toLowerCase().includes(studentSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (studentFilter === 'PENDING') return s.accountStatus === 'Pending' || !s.courseAccessApproved;
    if (studentFilter === 'ACTIVE') return s.accountStatus === 'Active' && s.courseAccessApproved;
    return true;
  });

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
      p.studentRegNo.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
      p.utrNumber.toLowerCase().includes(purchaseSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (purchaseFilter === 'PENDING') return p.status === 'Pending';
    if (purchaseFilter === 'APPROVED') return p.status === 'Approved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Cloud Hub Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Direct Integration Console</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                Supabase Cloud Database & Tables
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time synchronization with <code className="font-mono text-emerald-300">students</code>, <code className="font-mono text-sky-300">purchases</code>, <code className="font-mono text-purple-300">chapters</code>, and <code className="font-mono text-amber-300">notices</code> tables via <code className="font-mono text-slate-200">@supabase/supabase-js</code>.
            </p>
          </div>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-supabase-sync"
              onClick={handleManualSync}
              disabled={isSyncingSupabase}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-900/40 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
              <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Tables'}</span>
            </button>

            <button
              id="btn-supabase-test-conn"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTesting ? 'Testing...' : 'Test Ping'}</span>
            </button>

            <button
              id="btn-supabase-toggle-config"
              onClick={() => setShowConfigEditor(!showConfigEditor)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-sky-400" />
              <span>{showConfigEditor ? 'Hide Keys' : 'API Credentials'}</span>
            </button>
          </div>
        </div>

        {/* Live Status Pill & Metadata */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-rose-500 ring-4 ring-rose-500/20'}`} />
              <span className="font-semibold text-white">
                {isSupabaseConnected ? 'Supabase Live Connected' : 'Supabase Disconnected'}
              </span>
            </div>

            {supabaseLatency > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-mono text-emerald-400 border border-slate-700">
                {supabaseLatency}ms latency
              </span>
            )}

            <span className="text-slate-400 text-[11px] truncate max-w-xs">
              {supabaseStatusMessage}
            </span>
          </div>

          {lastSupabaseSync && (
            <span className="text-slate-400 text-[11px]">
              Last sync: <span className="text-slate-200 font-medium">{lastSupabaseSync}</span>
            </span>
          )}
        </div>
      </div>

      {/* Credentials Editor Drawer */}
      {showConfigEditor && (
        <form onSubmit={handleSaveConfig} className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Supabase Project Authentication & Keys</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowKeys(!showKeys)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showKeys ? 'Mask Keys' : 'Reveal Keys'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                required
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type={showKeys ? 'text' : 'password'}
                required
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Service Role Key (Optional / Admin Bypass)
              </label>
              <input
                type={showKeys ? 'text' : 'password'}
                value={serviceRoleKey}
                onChange={(e) => setServiceRoleKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {configSaveMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              configSaveMsg.includes('Successful') || configSaveMsg.includes('Connected')
                ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-700 text-rose-300'
            }`}>
              {configSaveMsg.includes('Successful') || configSaveMsg.includes('Connected') ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{configSaveMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-400">
              Keys are stored securely in localStorage and automatically used by the Supabase client.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfigEditor(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-md"
              >
                {isTesting ? 'Verifying...' : 'Save & Connect to Supabase'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Tables Telemetry</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'students'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>students table ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('purchases')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'purchases'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>purchases table ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chapters')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'chapters'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>chapters table ({chapters.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notices')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'notices'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>notices table ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sql')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ml-auto ${
            activeSubTab === 'sql'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-purple-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Supabase SQL Schema</span>
        </button>
      </div>

      {/* SUBTAB 1: TELEMETRY OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Table Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* students table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  public.students
                </span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {students.length}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>Active Accounts</span>
                  <span className="font-semibold text-emerald-400">
                    {students.filter((s) => s.courseAccessApproved).length} unlocked
                  </span>
                </div>
              </div>
            </div>

            {/* purchases table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-sky-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  public.purchases
                </span>
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                  <CreditCard className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {payments.length}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>12-Digit UTRs Verified</span>
                  <span className="font-semibold text-sky-400">
                    {payments.filter((p) => p.status === 'Approved').length} approved
                  </span>
                </div>
              </div>
            </div>

            {/* chapters table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  public.chapters
                </span>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {chapters.length}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>Free Ch.1 Previews</span>
                  <span className="font-semibold text-purple-400">
                    {chapters.filter((c) => c.isFree).length} unlocked
                  </span>
                </div>
              </div>
            </div>

            {/* notices table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  public.notices
                </span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Megaphone className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {announcements.length}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>Active Broadcasts</span>
                  <span className="font-semibold text-amber-400">
                    {announcements.filter((a) => a.active).length} live
                  </span>
                </div>
              </div>
            </div>

            {/* pyq_papers table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  public.pyq_papers
                </span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FileText className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {pyqPapers.length}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>10-Yr Question Papers</span>
                  <span className="font-semibold text-emerald-400">
                    {pyqPapers.filter((p) => p.hasSolutions).length} solved
                  </span>
                </div>
              </div>
            </div>

            {/* bureau_books table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-sky-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  public.bureau_books
                </span>
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                  <BookOpen className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {bureauBooks.length}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>Bureau Coursebooks</span>
                  <span className="font-semibold text-sky-400">
                    Science & MIL
                  </span>
                </div>
              </div>
            </div>

            {/* practicals table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  public.practicals
                </span>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <FlaskConical className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {practicals.length}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>30-Marks Lab Guides</span>
                  <span className="font-semibold text-purple-400">
                    + Viva-Voce
                  </span>
                </div>
              </div>
            </div>

            {/* student_doubts table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  public.student_doubts
                </span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {studentDoubts.length}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>Student Faculty Q&A</span>
                  <span className="font-semibold text-amber-400">
                    {studentDoubts.filter((d) => d.status === 'Pending').length} pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Supabase Operations Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Supabase Cloud Database Tools</h3>
                  <p className="text-xs text-slate-400">Instant seed, schema copy, and sync actions for CHSE administration</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Push Academic Data</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bulk synchronize all PYQs, Bureau books, Practicals, and Doubts into your live Supabase database.
                </p>
                <button
                  onClick={async () => {
                    const res = await syncAcademicResourcesToSupabase();
                    alert(res.message);
                  }}
                  disabled={isSyncingSupabase}
                  className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer w-full text-center flex items-center justify-center gap-1.5"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>Sync to Supabase</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Reset Local Cache</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Purge all locally stored administrative data and re-initialize with clean records.
                </p>
                <button
                  onClick={handleResetLocalData}
                  disabled={isSyncingSupabase}
                  className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer w-full text-center"
                >
                  Purge Local Cache
                </button>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">Live Force Refresh</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Queries your live Supabase project directly to fetch latest students, payments, and resources.
                </p>
                <button
                  onClick={handleManualSync}
                  disabled={isSyncingSupabase}
                  className="mt-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer w-full text-center"
                >
                  {isSyncingSupabase ? 'Fetching tables...' : 'Fetch Live Data'}
                </button>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">SQL Schema Generator</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Copy the production PostgreSQL schema containing the four required tables with indexes, types, and RLS policies for Supabase SQL Editor.
                </p>
                <button
                  onClick={() => setActiveSubTab('sql')}
                  className="mt-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer w-full text-center"
                >
                  View / Copy SQL Schema
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: STUDENTS TABLE */}
      {activeSubTab === 'students' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>Supabase Table: <code className="font-mono text-emerald-300">students</code></span>
              </h3>
              <p className="text-xs text-slate-400">
                Approve pending applications, manage zero-OTP credentials, and unlock course access.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search name, Reg No, phone..."
                  className="pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
                {(['ALL', 'PENDING', 'ACTIVE'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setStudentFilter(f)}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      studentFilter === f ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">CHSE Reg No & Name</th>
                  <th className="py-3 px-4">Stream & Batch</th>
                  <th className="py-3 px-4">Mobile (Zero-OTP)</th>
                  <th className="py-3 px-4">District / College</th>
                  <th className="py-3 px-4">Course Access</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-emerald-400">{st.chseRegNo}</div>
                      <div className="font-semibold text-white">{st.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.stream === 'Science' ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {st.stream} +2 2nd Year
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {st.mobileNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white truncate max-w-[160px]">{st.college}</div>
                      <div className="text-slate-500 text-[11px]">{st.district}</div>
                    </td>
                    <td className="py-3 px-4">
                      {st.courseAccessApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded">
                          <Unlock className="w-3 h-3" /> Unlocked (Ch. 2+)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3" /> Locked (Ch. 1 Only)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onOpenPasswordReset && (
                          <button
                            onClick={() => onOpenPasswordReset(st.chseRegNo)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold cursor-pointer"
                            title="Direct Password Reset without SMS OTP"
                          >
                            Reset Pass
                          </button>
                        )}
                        {onSelectStudent && (
                          <button
                            onClick={() => onSelectStudent(st)}
                            className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold cursor-pointer"
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PURCHASES TABLE (12-DIGIT UPI UTR VERIFICATION) */}
      {activeSubTab === 'purchases' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-400" />
                <span>Supabase Table: <code className="font-mono text-sky-300">purchases</code></span>
              </h3>
              <p className="text-xs text-slate-400">
                Audit 12-digit Bank UPI UTR numbers submitted by students to unlock digital classroom access.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={purchaseSearch}
                  onChange={(e) => setPurchaseSearch(e.target.value)}
                  placeholder="Search student or UTR..."
                  className="pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
                {(['ALL', 'PENDING', 'APPROVED'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setPurchaseFilter(f)}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      purchaseFilter === f ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student & Reg No</th>
                  <th className="py-3 px-4">Amount & Stream</th>
                  <th className="py-3 px-4">12-Digit Bank UTR</th>
                  <th className="py-3 px-4">Method / App</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPayments.map((p) => {
                  const is12Digits = /^\d{12}$/.test(p.utrNumber.trim());
                  return (
                    <tr key={p.id} className="hover:bg-slate-850 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{p.studentName}</div>
                        <div className="font-mono text-emerald-400 text-[11px]">{p.studentRegNo}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">₹{p.amount}</div>
                        <div className="text-slate-400 text-[11px]">{p.stream} 2nd Year</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sky-400 text-sm tracking-wider">{p.utrNumber}</span>
                          {is12Digits ? (
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1 rounded font-semibold border border-emerald-800">
                              Valid 12-Digit
                            </span>
                          ) : (
                            <span className="text-[10px] bg-rose-950 text-rose-300 px-1 rounded font-semibold border border-rose-800">
                              Format Flag
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                          {p.paymentMethod || 'UPI QR'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                            <Check className="w-3 h-3" /> Verified & Access Granted
                          </span>
                        ) : p.status === 'Rejected' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded">
                            <X className="w-3 h-3" /> Rejected ({p.rejectionReason})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
                            Pending Admin Audit
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {p.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => approvePayment(p.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-[11px] transition-colors cursor-pointer"
                            >
                              Verify UTR
                            </button>
                            <button
                              onClick={() => {
                                setRejectionModalPaymentId(p.id);
                                setRejectionReason('Invalid / Unmatched Bank UTR');
                              }}
                              className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            Audited by {p.verifiedByAdmin || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: CHAPTERS TABLE */}
      {activeSubTab === 'chapters' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span>Supabase Table: <code className="font-mono text-purple-300">chapters</code></span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage CHSE syllabus units, Odia notes PDF links, and Free Chapter 1 previews.
              </p>
            </div>

            <button
              onClick={() => setIsAddChapterOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chapter Notes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    {ch.subject} (Ch. {ch.chapterNo})
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    ch.stream === 'Science' ? 'bg-sky-950 text-sky-300' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {ch.stream}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{ch.title}</h4>
                  {ch.notesPdfUrl && (
                    <a
                      href={ch.notesPdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 mt-1 underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Notes PDF</span>
                    </a>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleChapterFreeStatus(ch.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      ch.isFree
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {ch.isFree ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3" />}
                    <span>{ch.isFree ? 'Free Preview (Ch.1)' : 'Locked Premium'}</span>
                  </button>

                  <button
                    onClick={() => deleteChapter(ch.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 cursor-pointer"
                    title="Delete Chapter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: NOTICES TABLE */}
      {activeSubTab === 'notices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <span>Supabase Table: <code className="font-mono text-amber-300">notices</code></span>
              </h3>
              <p className="text-xs text-slate-400">
                Publish live exam routines, admission deadlines, and official announcements to the learning portal.
              </p>
            </div>

            <button
              onClick={() => setIsAddNoticeOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((an) => (
              <div
                key={an.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {an.isHighPriority && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 uppercase">
                        URGENT
                      </span>
                    )}
                    <span className="text-xs font-semibold text-amber-400">
                      [{an.targetStream} Stream]
                    </span>
                    <h4 className="font-bold text-white text-sm">{an.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 max-w-3xl">{an.content}</p>
                  <div className="text-[11px] text-slate-500">Published: {an.publishedDate}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAnnouncementActive(an.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      an.active
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {an.active ? '● LIVE BROADCAST' : '◌ HIDDEN'}
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(an.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: SQL SCHEMA SCRIPT */}
      {activeSubTab === 'sql' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                <span>Supabase PostgreSQL DDL Schema Script</span>
              </h3>
              <p className="text-xs text-slate-400">
                Execute this SQL in your Supabase SQL Editor to initialize all 4 tables with correct columns and RLS policies.
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              {copiedSql ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy Schema SQL'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed">
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>
        </div>
      )}

      {/* Modal: Add Chapter */}
      {isAddChapterOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Chapter & Odia Notes to Supabase</h3>
              <button
                onClick={() => setIsAddChapterOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChapterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Stream</label>
                  <select
                    value={newChapStream}
                    onChange={(e) => setNewChapStream(e.target.value as StreamType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newChapSubject}
                    onChange={(e) => setNewChapSubject(e.target.value)}
                    placeholder="e.g. Physics, Odia, History"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Chapter No</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newChapNo}
                    onChange={(e) => setNewChapNo(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Chapter Title</label>
                  <input
                    type="text"
                    required
                    value={newChapTitle}
                    onChange={(e) => setNewChapTitle(e.target.value)}
                    placeholder="e.g. Electrostatics & Capacitance"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Notes PDF / Drive Link</label>
                <input
                  type="url"
                  value={newChapNotesUrl}
                  onChange={(e) => setNewChapNotesUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-purple-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chap-is-free"
                  checked={newChapIsFree}
                  onChange={(e) => setNewChapIsFree(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="chap-is-free" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Free Preview (Unlock for all registered students without payment)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddChapterOpen(false)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow cursor-pointer"
                >
                  Save Chapter to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publish Notice */}
      {isAddNoticeOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Publish Live Notice to Supabase</h3>
              <button
                onClick={() => setIsAddNoticeOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNoticeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. CHSE Class 12th Board Practical Exam Timetable Released"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Details for students..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Target Stream</label>
                  <select
                    value={noticeTargetStream}
                    onChange={(e) => setNoticeTargetStream(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="All">All Streams (+2 2nd Year)</option>
                    <option value="Science">Science Only</option>
                    <option value="Arts">Arts Only</option>
                    <option value="Commerce">Commerce Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Exam Routine">Exam Routine</option>
                    <option value="CHSE Exam Alert">CHSE Exam Alert</option>
                    <option value="Practical Schedule">Practical Schedule</option>
                    <option value="Admit Card Update">Admit Card Update</option>
                    <option value="General Notice">General Notice</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="notice-urgent"
                  checked={noticeHighPriority}
                  onChange={(e) => setNoticeHighPriority(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500"
                />
                <label htmlFor="notice-urgent" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Mark as High Priority Alert (Pops up immediately on student login)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddNoticeOpen(false)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow cursor-pointer"
                >
                  Publish Notice to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Payment Rejection */}
      {rejectionModalPaymentId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Reject UPI Payment & UTR</h3>
            <p className="text-xs text-slate-400">
              Specify the reason why this 12-digit UTR could not be reconciled.
            </p>
            <input
              type="text"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Bank statement mismatch, Duplicate UTR"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalPaymentId(null)}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectPayment(rejectionModalPaymentId, rejectionReason);
                  setRejectionModalPaymentId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl cursor-pointer"
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
