import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Play,
  FileText,
  FileCheck2,
  CreditCard,
  Bell,
  Search,
  Lock,
  Unlock,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Award,
  Filter,
  Library,
  FlaskConical,
  MessageSquare,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Student, StreamType, ChapterItem, MockTest } from '../../types';
import { UserNavbar, UserPortalSection, WhatsAppIcon } from './UserNavbar';
import { StudentVerificationModal } from './StudentVerificationModal';
import { UserChapterDetailModal } from './UserChapterDetailModal';
import { UserPaymentModal } from './UserPaymentModal';
import { UserDigitalIdCardModal } from './UserDigitalIdCardModal';
import { UserMockTestRunnerModal } from './UserMockTestRunnerModal';
import { UserDailyPracticeWidget } from './UserDailyPracticeWidget';
import { UserPyqSection } from './UserPyqSection';
import { UserBureauBooksSection } from './UserBureauBooksSection';
import { UserPracticalsSection } from './UserPracticalsSection';
import { UserDoubtSection } from './UserDoubtSection';
import { AiHelpModal } from './AiHelpModal';

interface UserPanelProps {
  onSwitchToAdmin: () => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({ onSwitchToAdmin }) => {
  const {
    students,
    chapters,
    mcqs,
    boardQuestions,
    mockTests,
    announcements,
    gatewayConfig,
  } = useAdminData();

  // Active student in session (persisted in localStorage only upon authentic student login)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    const isVerified = localStorage.getItem('CHSE_STUDENT_AUTH_VERIFIED') === 'true';
    if (!isVerified) {
      localStorage.removeItem('CHSE_CURRENT_STUDENT_ID');
      localStorage.removeItem('CHSE_CURRENT_STUDENT_RECORD');
      return null;
    }
    const savedRecord = localStorage.getItem('CHSE_CURRENT_STUDENT_RECORD');
    if (savedRecord) {
      try {
        const parsed = JSON.parse(savedRecord);
        if (parsed && (parsed.id || parsed.chseRegNo)) return parsed;
      } catch {}
    }
    const savedId = localStorage.getItem('CHSE_CURRENT_STUDENT_ID');
    if (savedId) {
      const found = students.find((s) => s.id === savedId || s.chseRegNo === savedId);
      if (found) return found;
    }
    return null;
  });

  // Keep current student in sync with live admin data updates (approval, payment verification, course access)
  useEffect(() => {
    if (currentStudent) {
      const live = students.find((s) => s.id === currentStudent.id || s.chseRegNo === currentStudent.chseRegNo);
      if (live && (
        live.courseAccessApproved !== currentStudent.courseAccessApproved ||
        live.accountStatus !== currentStudent.accountStatus ||
        live.admission_status !== currentStudent.admission_status ||
        live.name !== currentStudent.name ||
        live.stream !== currentStudent.stream
      )) {
        setCurrentStudent(live);
        localStorage.setItem('CHSE_CURRENT_STUDENT_RECORD', JSON.stringify(live));
      }
    }
  }, [students, currentStudent]);

  // Navigation State
  const [activeSection, setActiveSection] = useState<UserPortalSection>('syllabus');
  const [selectedStream, setSelectedStream] = useState<StreamType>(
    currentStudent ? currentStudent.stream : 'Science'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [isAiHelpOpen, setIsAiHelpOpen] = useState(false);
  const [activeChapterModal, setActiveChapterModal] = useState<ChapterItem | null>(null);
  const [activeTestModal, setActiveTestModal] = useState<MockTest | null>(null);

  const handleLoginSuccess = (student: Student) => {
    setCurrentStudent(student);
    setSelectedStream(student.stream);
    localStorage.setItem('CHSE_CURRENT_STUDENT_ID', student.id);
    localStorage.setItem('CHSE_CURRENT_STUDENT_RECORD', JSON.stringify(student));
    localStorage.setItem('CHSE_STUDENT_AUTH_VERIFIED', 'true');
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    localStorage.removeItem('CHSE_CURRENT_STUDENT_ID');
    localStorage.removeItem('CHSE_CURRENT_STUDENT_RECORD');
    localStorage.removeItem('CHSE_STUDENT_AUTH_VERIFIED');
  };

  // Filter subjects for the selected stream
  const availableSubjects = useMemo(() => {
    const subs = new Set<string>();
    chapters.forEach((c) => {
      if (c.stream === selectedStream) {
        subs.add(c.subject);
      }
    });
    return Array.from(subs);
  }, [chapters, selectedStream]);

  // Filter chapters
  const filteredChapters = useMemo(() => {
    return chapters.filter((c) => {
      const matchStream = c.stream === selectedStream;
      const matchSub = selectedSubject === 'All' || c.subject === selectedSubject;
      const matchSearch =
        !searchQuery.trim() ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.titleOdia && c.titleOdia.includes(searchQuery)) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStream && matchSub && matchSearch;
    });
  }, [chapters, selectedStream, selectedSubject, searchQuery]);

  // Is full access unlocked for this student?
  const isUnlocked = Boolean(currentStudent?.courseAccessApproved);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <UserNavbar
        currentStudent={currentStudent}
        activeSection={activeSection}
        setActiveSection={(sec) => {
          if (sec === 'idcard') {
            setIsIdCardOpen(true);
          } else {
            setActiveSection(sec);
          }
        }}
        selectedStream={selectedStream}
        setSelectedStream={(st) => {
          setSelectedStream(st);
          setSelectedSubject('All');
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSwitchToAdmin={onSwitchToAdmin}
        unreadNoticesCount={announcements.filter((a) => a.active).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Ticker / Live Announcement Marquee */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-slate-950 border border-blue-500/30 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2.5 truncate mr-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              COUNCIL NOTICE
            </span>
            <span className="text-xs text-blue-200 truncate font-medium">
              {announcements.length > 0
                ? announcements[0].title
                : 'CHSE Odisha 2026: Official All-Stream Study Material & Question Bank Live'}
            </span>
          </div>

          <button
            onClick={() => setActiveSection('notices')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold shrink-0 flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Banner with Course Unlock Status */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center space-x-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  <span>Odisha Council Blueprint 2026</span>
                </span>
                <span className="text-xs font-semibold text-blue-200 font-serif">
                  +୨ ଦ୍ୱିତୀୟ ବର୍ଷ ଡିଜିଟାଲ୍ ଶିକ୍ଷା ପୋର୍ଟାଲ୍
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Master Your CHSE +2 Board Exam with Confidence
              </h2>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Video classes, bilingual English & Odia notes, interactive MCQ quizzes, and council-solved 2, 3 & 5 mark questions curated by top junior college lecturers.
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shrink-0 space-y-3 min-w-[260px] shadow-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Course Access:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold ${
                    isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isUnlocked ? 'All Chapters Unlocked' : 'Free Preview Mode'}
                </span>
              </div>

              {!isUnlocked ? (
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-emerald-400">
                      ₹{selectedStream === 'Arts' ? 99 : 149}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ₹{selectedStream === 'Arts' ? 499 : 799}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      {selectedStream === 'Arts' ? '80% OFF' : '81% OFF'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Batch:</span>
                    <span className="font-bold text-amber-400">2026-27 Session</span>
                  </div>
                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    className="w-full mt-2.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Get {selectedStream} Pass (₹{selectedStream === 'Arts' ? 99 : 149})</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-xs text-emerald-300 font-medium flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Active PRO Student Pass</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {currentStudent?.chseRegNo}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: SYLLABUS & CHAPTERS */}
        {/* ============================================================ */}
        {activeSection === 'syllabus' && (
          <div className="space-y-6">
            {/* Quick Access Feature Hub */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => setActiveSection('pyqs')}
                className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/80 to-slate-900 border border-blue-500/30 hover:border-blue-400 text-left transition-all group shadow-md cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-amber-300" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-black text-white group-hover:text-blue-300">10-Yr PYQs (2016-25)</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">ସମସ୍ତ ପୂର୍ବ ବୋର୍ଡ ପରୀକ୍ଷା ପ୍ରଶ୍ନୋତ୍ତର</p>
              </button>

              <button
                onClick={() => setActiveSection('bureau_books')}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group shadow-md cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Library className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-black text-white group-hover:text-emerald-300">Bureau Books & Formulas</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">ସରକାରୀ ପାଠ୍ୟପୁସ୍ତକ ଓ ସୂତ୍ରାବଳୀ</p>
              </button>

              <button
                onClick={() => setActiveSection('practicals')}
                className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/80 to-slate-900 border border-purple-500/30 hover:border-purple-400 text-left transition-all group shadow-md cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-black text-white group-hover:text-purple-300">Practicals & Viva (30M)</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">ଲ୍ୟାବ୍ ରେକର୍ଡ ଓ ମୌଖିକ ପ୍ରଶ୍ନ</p>
              </button>

              <button
                onClick={() => setActiveSection('doubts')}
                className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 text-left transition-all group shadow-md cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-black text-white group-hover:text-indigo-300">Ask Faculty Doubts</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">ଶିକ୍ଷକଙ୍କଠାରୁ ସନ୍ଦେହ ମୋଚନ</p>
              </button>
            </div>

            {/* Daily Practice Question (DPQ) Widget */}
            <UserDailyPracticeWidget />

            {/* Syllabus & Revision Progress Tracker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">
                    CHSE +2 2nd Year Syllabus Preparation Progress
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Target: 90%+ in 2026 AHSE Board Examination
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {selectedStream === 'Science' && (
                  <>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Physics</span>
                        <span className="text-blue-400">75%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Chemistry</span>
                        <span className="text-emerald-400">80%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Mathematics</span>
                        <span className="text-amber-400">65%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>MIL (Odia) / Eng</span>
                        <span className="text-purple-400">85%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </>
                )}

                {selectedStream === 'Arts' && (
                  <>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Political Science</span>
                        <span className="text-blue-400">80%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>History</span>
                        <span className="text-emerald-400">70%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '70%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Economics</span>
                        <span className="text-amber-400">65%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Sahitya Jyoti (Odia)</span>
                        <span className="text-purple-400">90%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>
                  </>
                )}

                {selectedStream === 'Commerce' && (
                  <>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Accountancy</span>
                        <span className="text-blue-400">78%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Business Studies (BSM)</span>
                        <span className="text-emerald-400">82%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Business Math & Stats</span>
                        <span className="text-amber-400">60%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>MIL (Odia) / Eng</span>
                        <span className="text-purple-400">88%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stream & Subject Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Stream Pills */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Stream:</span>
                  {(['Science', 'Arts', 'Commerce'] as StreamType[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setSelectedStream(st);
                        setSelectedSubject('All');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedStream === st
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st} Stream
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chapter, topic or Odia..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Subject Chips */}
              {availableSubjects.length > 0 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setSelectedSubject('All')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedSubject === 'All'
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                        : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    All Subjects ({filteredChapters.length})
                  </button>
                  {availableSubjects.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubject(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedSubject === sub
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                          : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chapters Grid */}
            {filteredChapters.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No chapters found for this filter.</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try switching the stream or subject above, or clear the search query to view all lessons.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredChapters.map((chap) => {
                  const chapMcqs = mcqs.filter((m) => m.chapterId === chap.id);
                  const chapBqs = boardQuestions.filter((b) => b.chapterId === chap.id);
                  const canAccess = chap.isFree || isUnlocked;

                  return (
                    <div
                      key={chap.id}
                      className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all duration-200 overflow-hidden flex flex-col shadow-lg hover:shadow-blue-500/10"
                    >
                      {/* Card Top */}
                      <div className="p-5 flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {chap.subject} • Chapter {chap.chapterNo}
                          </span>
                          {chap.isFree ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                              <Unlock className="w-3 h-3" />
                              <span>FREE PREVIEW</span>
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>UNLOCKED</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>PRO PASS</span>
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                            {chap.title}
                          </h4>
                          {chap.titleOdia && (
                            <p className="text-xs text-amber-400 font-serif mt-0.5">
                              {chap.titleOdia}
                            </p>
                          )}
                        </div>

                        {/* Content Badges */}
                        <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-400">
                          <span className="flex items-center space-x-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            <Play className="w-3 h-3 text-blue-400" />
                            <span>Video Lecture</span>
                          </span>
                          <span className="flex items-center space-x-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            <FileText className="w-3 h-3 text-emerald-400" />
                            <span>Bilingual Notes</span>
                          </span>
                          <span className="flex items-center space-x-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{chapMcqs.length || 5}+ MCQs</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Action Button */}
                      <div className="p-3 bg-slate-950/70 border-t border-slate-800/80">
                        <button
                          onClick={() => setActiveChapterModal(chap)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                            canAccess
                              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25'
                              : 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {canAccess ? (
                            <>
                              <span>Start Studying Chapter</span>
                              <ChevronRight className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Unlock Chapter ({chap.title})</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW: PREVIOUS YEARS QUESTION PAPERS (PYQs) */}
        {/* ============================================================ */}
        {activeSection === 'pyqs' && (
          <UserPyqSection
            selectedStream={selectedStream}
            onOpenPayment={() => setIsPaymentOpen(true)}
            isUnlocked={isUnlocked}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW: BUREAU BOOKS & FORMULA HUB */}
        {/* ============================================================ */}
        {activeSection === 'bureau_books' && (
          <UserBureauBooksSection
            selectedStream={selectedStream}
            onOpenPayment={() => setIsPaymentOpen(true)}
            isUnlocked={isUnlocked}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW: PRACTICAL LAB MANUALS & VIVA-VOCE (30 MARKS) */}
        {/* ============================================================ */}
        {activeSection === 'practicals' && (
          <UserPracticalsSection />
        )}

        {/* ============================================================ */}
        {/* VIEW: ASK SENIOR FACULTY / DOUBTS CLEARANCE */}
        {/* ============================================================ */}
        {activeSection === 'doubts' && (
          <UserDoubtSection
            currentStudent={currentStudent}
            selectedStream={selectedStream}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 2: MOCK TESTS */}
        {/* ============================================================ */}
        {activeSection === 'tests' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">All-Odisha CHSE Model Mock Test Series 2026</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real exam environment with timed assessments and instantaneous council percentiles.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mockTests.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
                        {t.stream} • {t.subject}
                      </span>
                      <span className="text-xs text-amber-400 font-bold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t.durationMinutes} Mins</span>
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white leading-snug">{t.title}</h4>
                    <p className="text-xs text-slate-400">
                      Total Marks: {t.totalMarks} • Total Questions: {t.totalQuestions}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTestModal(t)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Mock Exam Now</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: COURSE PASS & FEES (2026-27 BATCH) */}
        {/* ============================================================ */}
        {activeSection === 'payment' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border-2 border-emerald-500/40 shadow-2xl text-center space-y-5">
              <div className="flex items-center justify-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 inline-block shadow-md">
                  SESSION 2026-27 BATCH
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SPECIAL COUNCIL SUBSIDY
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                CHSE Odisha +2 2nd Year Course Pass (2026-27)
              </h3>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                Official access pass for CHSE Odisha 2nd Year annual board examination (2026-27). Unlimited chapter notes, video lectures, Bureau solved questions & model test series.
              </p>

              {/* 3 Streams Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
                {/* Arts Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/40 relative overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all shadow-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        ARTS (କଳା)
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">2026-27</span>
                    </div>
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-amber-400">₹99</span>
                        <span className="text-sm text-slate-500 line-through">₹499</span>
                        <span className="text-xs text-emerald-400 font-bold">80% OFF</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Full +2 Arts Syllabus Pass</p>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>History, Pol Science & Economics</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Odia, English & Logic/Education</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Bureau Question Bank Solutions</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStream('Arts');
                      setIsPaymentOpen(true);
                    }}
                    className="w-full mt-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Get Arts Pass (₹99)</span>
                  </button>
                </div>

                {/* Science Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 relative overflow-hidden flex flex-col justify-between hover:border-emerald-400 transition-all shadow-xl ring-1 ring-emerald-500/30">
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-slate-950 uppercase">
                    MOST POPULAR
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        SCIENCE (ବିଜ୍ଞାନ)
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">2026-27</span>
                    </div>
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-emerald-400">₹149</span>
                        <span className="text-sm text-slate-500 line-through">₹799</span>
                        <span className="text-xs text-emerald-400 font-bold">81% OFF</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Physics, Chem, Math, Bio & IT</p>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>All Chapters + 30-Marks Lab Manuals</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Previous 10 Years Solved Papers</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>CHSE Official Digital ID Pass</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStream('Science');
                      setIsPaymentOpen(true);
                    }}
                    className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Get Science Pass (₹149)</span>
                  </button>
                </div>

                {/* Commerce Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-sky-500/40 relative overflow-hidden flex flex-col justify-between hover:border-sky-400 transition-all shadow-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        COMMERCE (ବାଣିଜ୍ୟ)
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">2026-27</span>
                    </div>
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-sky-400">₹149</span>
                        <span className="text-sm text-slate-500 line-through">₹799</span>
                        <span className="text-xs text-emerald-400 font-bold">81% OFF</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Accounting, BMS, BST & Costing</p>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Accountancy & Business Math PYQs</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Step-by-step Numerical Solutions</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>State-level Mock Exams</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStream('Commerce');
                      setIsPaymentOpen(true);
                    }}
                    className="w-full mt-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Get Commerce Pass (₹149)</span>
                  </button>
                </div>
              </div>

              {/* General CTA */}
              <div className="pt-2">
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all inline-flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay via Navi UPI (mychseclasses@naviaxis) / HDFC & Submit UTR</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: NOTICES */}
        {/* ============================================================ */}
        {activeSection === 'notices' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
              <Bell className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white">Council Notices & Circulars</h3>
                <p className="text-xs text-slate-400">Official updates from CHSE Odisha Examination Directorate</p>
              </div>
            </div>

            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {a.category} • {a.targetStream}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{a.publishedDate}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{a.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {a.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">
          MY CHSE 12TH CLASSES • Council of Higher Secondary Education, Odisha
        </p>
        <p>SAMIS Odisha Integrated • Bhubaneswar, Odisha, India • Support: patramihirchand047@gmail.com</p>
      </footer>

      {/* Floating Action Buttons: AI Help positioned above WhatsApp */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center space-y-3">
        {/* AI Help Floating Icon Button (Above WhatsApp) */}
        <button
          type="button"
          onClick={() => setIsAiHelpOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white flex items-center justify-center shadow-2xl shadow-indigo-950/80 border-2 border-indigo-400/80 hover:scale-110 active:scale-95 transition-all group cursor-pointer relative"
          title="CHSE AI Study Help (AI ସହାୟକ)"
          aria-label="AI Help"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 group-hover:rotate-12 transition-transform drop-shadow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-purple-200"></span>
            </span>
          </div>
          {/* Tooltip to the left */}
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-500/50 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AI Help
          </span>
        </button>

        {/* Floating WhatsApp Quick Action Icon for student assistance */}
        <a
          href={`https://api.whatsapp.com/send?phone=${
            gatewayConfig?.adminMobile
              ? gatewayConfig.adminMobile.replace(/[^0-9]/g, '').length === 10
                ? '91' + gatewayConfig.adminMobile.replace(/[^0-9]/g, '')
                : gatewayConfig.adminMobile.replace(/[^0-9]/g, '')
              : '918917408498'
          }&text=${encodeURIComponent(
            currentStudent
              ? `Namaskar Sir! I am ${currentStudent.name} (CHSE Reg: ${currentStudent.chseRegNo || 'Pending'}, ${selectedStream} Stream). I need assistance with MY CHSE Classes.`
              : `Namaskar Sir! I am a CHSE +2 student (${selectedStream} Stream). I need help regarding syllabus notes and course admission.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-950/80 border-2 border-emerald-400 hover:scale-110 active:scale-95 transition-all group cursor-pointer relative"
          title="Chat with Faculty & Help Desk on WhatsApp"
          aria-label="WhatsApp"
        >
          <div className="relative flex items-center justify-center">
            <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-white group-hover:rotate-12 transition-transform drop-shadow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-200"></span>
            </span>
          </div>
          {/* Tooltip to the left */}
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/50 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            WhatsApp
          </span>
        </a>
      </div>

      {/* MODALS */}
      <AiHelpModal
        isOpen={isAiHelpOpen}
        onClose={() => setIsAiHelpOpen(false)}
        selectedStream={selectedStream}
        studentName={currentStudent?.name}
        adminMobile={gatewayConfig?.adminMobile}
        onOpenAuth={() => {
          setIsAiHelpOpen(false);
          setIsAuthOpen(true);
        }}
        onOpenPayment={() => {
          setIsAiHelpOpen(false);
          setIsPaymentOpen(true);
        }}
        onNavigate={(section: string) => {
          setIsAiHelpOpen(false);
          setActiveSection(section as UserPortalSection);
        }}
      />
      <StudentVerificationModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onVerificationSuccess={handleLoginSuccess}
      />

      <UserChapterDetailModal
        isOpen={Boolean(activeChapterModal)}
        chapter={activeChapterModal}
        mcqs={activeChapterModal ? mcqs.filter((m) => m.chapterId === activeChapterModal.id) : []}
        boardQuestions={activeChapterModal ? boardQuestions.filter((b) => b.chapterId === activeChapterModal.id) : []}
        isUnlocked={isUnlocked}
        onClose={() => setActiveChapterModal(null)}
        onOpenPayment={() => {
          setActiveChapterModal(null);
          setIsPaymentOpen(true);
        }}
      />

      <UserPaymentModal
        isOpen={isPaymentOpen}
        student={currentStudent}
        initialStream={selectedStream}
        onClose={() => setIsPaymentOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <UserDigitalIdCardModal
        isOpen={isIdCardOpen}
        student={currentStudent}
        onClose={() => setIsIdCardOpen(false)}
      />

      <UserMockTestRunnerModal
        isOpen={Boolean(activeTestModal)}
        test={activeTestModal}
        student={currentStudent}
        onClose={() => setActiveTestModal(null)}
      />
    </div>
  );
};
