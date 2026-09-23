import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  FlaskConical,
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  Lock,
  Unlock,
  CloudUpload,
  AlertCircle,
  Sparkles,
  Send,
  User,
  GraduationCap,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { StreamType, PyqPaper, BureauBook, PracticalLabItem, StudentDoubt } from '../types';

export const AcademicResourceManager: React.FC = () => {
  const {
    pyqPapers,
    bureauBooks,
    practicals,
    studentDoubts,
    addOrUpdatePyqPaper,
    deletePyqPaper,
    addOrUpdateBureauBook,
    deleteBureauBook,
    addOrUpdatePractical,
    deletePractical,
    answerDoubt,
    deleteDoubt,
    syncAcademicResourcesToSupabase,
    isSupabaseConnected,
  } = useAdminData();

  const [activeTab, setActiveTab] = useState<'pyqs' | 'books' | 'practicals' | 'doubts'>('pyqs');
  const [streamFilter, setStreamFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Modals
  const [isPyqModalOpen, setIsPyqModalOpen] = useState(false);
  const [editingPyq, setEditingPyq] = useState<PyqPaper | null>(null);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BureauBook | null>(null);

  const [isPracticalModalOpen, setIsPracticalModalOpen] = useState(false);
  const [editingPractical, setEditingPractical] = useState<PracticalLabItem | null>(null);

  const [answeringDoubt, setAnsweringDoubt] = useState<StudentDoubt | null>(null);
  const [facultyAnswerText, setFacultyAnswerText] = useState('');
  const [facultyName, setFacultyName] = useState('Dr. S. K. Mohapatra (Senior CHSE Lecturer)');

  const pendingDoubtsCount = studentDoubts.filter((d) => d.status === 'Pending').length;

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    setSyncStatusMsg(null);
    try {
      const res = await syncAcademicResourcesToSupabase();
      setSyncStatusMsg(res.message);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    } catch (e: any) {
      setSyncStatusMsg('Error syncing to Supabase: ' + (e?.message || 'Failed'));
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                CHSE Odisha Repository CMS
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isSupabaseConnected
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-600/40'
                }`}
              >
                {isSupabaseConnected ? '● Supabase Cloud Live' : '○ Supabase Connecting'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Academic Resources & Doubts Desk
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Centralized management for 10-Year Question Papers, Odisha State Bureau Textbooks, 30-Marks Lab Practicals, and live 24x7 Student Faculty Q&A. All edits persist to Supabase.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncAll}
              disabled={isSyncingAll}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <CloudUpload className={`w-4 h-4 ${isSyncingAll ? 'animate-bounce' : ''}`} />
              <span>{isSyncingAll ? 'Syncing to Supabase...' : 'Sync All to Supabase'}</span>
            </button>
          </div>
        </div>

        {syncStatusMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">10-Yr PYQ Papers</div>
            <div className="text-xl font-black text-white mt-0.5">{pyqPapers.length}</div>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Bureau Textbooks</div>
            <div className="text-xl font-black text-white mt-0.5">{bureauBooks.length}</div>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Lab Experiments (30M)</div>
            <div className="text-xl font-black text-white mt-0.5">{practicals.length}</div>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Doubts Needing Faculty</div>
            <div className="text-xl font-black text-amber-400 mt-0.5 flex items-center space-x-1.5">
              <span>{pendingDoubtsCount}</span>
              {pendingDoubtsCount > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('pyqs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'pyqs'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PYQ Papers ({pyqPapers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'books'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bureau Books ({bureauBooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('practicals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'practicals'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Practicals & Viva ({practicals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('doubts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 relative ${
              activeTab === 'doubts'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Student Doubts Desk</span>
            {pendingDoubtsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Global stream filter & search */}
        <div className="flex items-center gap-2">
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 outline-hidden focus:border-emerald-500"
          >
            <option value="All">All Streams</option>
            <option value="Science">Science</option>
            <option value="Arts">Arts</option>
            <option value="Commerce">Commerce</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl pl-8 pr-3 py-2 w-40 sm:w-52 outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. PYQ PAPERS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'pyqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>CHSE 10-Year Board Exam Question Papers (2016-2025)</span>
              <span className="text-xs text-slate-500 font-normal">
                ({pyqPapers.filter((p) => (streamFilter === 'All' || p.stream === streamFilter)).length} available)
              </span>
            </h3>
            <button
              onClick={() => {
                setEditingPyq({
                  id: `pyq-new-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                  title: 'CHSE Board Examination 2025',
                  year: 2025,
                  stream: (streamFilter === 'All' ? 'Science' : streamFilter) as StreamType,
                  subject: 'Physics',
                  totalMarks: 70,
                  duration: '3 Hours',
                  questionPattern: 'Group A: MCQs (14M) | Group B: Short Qs (21M) | Group C: Long Qs (35M)',
                  downloadUrl: '#',
                  hasSolutions: true,
                  highlights: ['Full Solved Paper', 'Council Step-Marking Rubric'],
                  keyTopics: ['Core Topics'],
                  isLocked: false,
                });
                setIsPyqModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New PYQ Paper</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pyqPapers
              .filter((p) => {
                const matchesStream = streamFilter === 'All' || p.stream === streamFilter;
                const titleStr = p.title || `${p.subject} Question Paper`;
                const matchesSearch =
                  titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  String(p.year).includes(searchQuery);
                return matchesStream && matchesSearch;
              })
              .map((paper) => (
                <div
                  key={paper.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {paper.stream} • {paper.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-black bg-slate-800 text-white border border-slate-700">
                        {paper.year}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">
                      {paper.title || `${paper.subject} Board Paper (${paper.year})`}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{paper.questionPattern}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                      <span>Marks: <strong className="text-white">{paper.totalMarks}</strong></span>
                      <span>•</span>
                      <span>Time: <strong className="text-white">{paper.duration}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        {paper.hasSolutions ? '✓ Solved' : 'Question Only'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <button
                      onClick={async () => {
                        const updated = { ...paper, isLocked: !paper.isLocked };
                        await addOrUpdatePyqPaper(updated);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1 font-semibold transition-all ${
                        paper.isLocked
                          ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                      }`}
                    >
                      {paper.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{paper.isLocked ? 'Locked (Paid)' : 'Free Access'}</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingPyq(paper);
                          setIsPyqModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                        title="Edit Paper"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete PYQ paper "${paper.title} (${paper.year})"?`)) {
                            await deletePyqPaper(paper.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                        title="Delete Paper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. BUREAU BOOKS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Odisha State Bureau Textbooks & Formula Sheets</span>
              <span className="text-xs text-slate-500 font-normal">
                ({bureauBooks.filter((b) => (streamFilter === 'All' || b.stream === streamFilter)).length} books)
              </span>
            </h3>
            <button
              onClick={() => {
                setEditingBook({
                  id: `book-new-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                  title: '+2 Bureau Coursebook 2026',
                  titleOdia: 'ବ୍ୟୁରୋ ପାଠ୍ୟପୁସ୍ତକ',
                  stream: (streamFilter === 'All' ? 'Science' : streamFilter) as StreamType,
                  subject: 'Physics',
                  volume: 'Part 1',
                  publisher: 'Odisha State Bureau of Textbook Preparation and Production',
                  downloadUrl: '#',
                  formulaSheetUrl: '#',
                  chaptersCount: 10,
                  pageCount: 280,
                });
                setIsBookModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Bureau Book</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bureauBooks
              .filter((b) => {
                const matchesStream = streamFilter === 'All' || b.stream === streamFilter;
                const matchesSearch =
                  b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  b.subject.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesStream && matchesSearch;
              })
              .map((book) => (
                <div
                  key={book.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        {book.stream} • {book.subject}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {book.volume}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{book.title}</h4>
                    {book.titleOdia && (
                      <div className="text-xs text-emerald-400 font-medium">{book.titleOdia}</div>
                    )}
                    <p className="text-xs text-slate-400 text-ellipsis line-clamp-1">{book.publisher}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                      <span>Chapters: <strong className="text-white">{book.chaptersCount}</strong></span>
                      <span>•</span>
                      <span>Pages: <strong className="text-white">{book.pageCount}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {book.formulaSheetUrl ? '✓ Formula Cheatsheet Included' : 'No Cheatsheet'}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingBook(book);
                          setIsBookModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                        title="Edit Book"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete Bureau Book "${book.title}"?`)) {
                            await deleteBureauBook(book.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. PRACTICALS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'practicals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>30-Marks CHSE Practical Lab Manuals & Viva Guide</span>
              <span className="text-xs text-slate-500 font-normal">
                ({practicals.length} experiments)
              </span>
            </h3>
            <button
              onClick={() => {
                setEditingPractical({
                  id: `prac-new-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                  stream: 'Science',
                  subject: 'Physics',
                  experimentNo: practicals.length + 1,
                  title: 'New Laboratory Experiment',
                  titleOdia: 'ପ୍ରୟୋଗଶାଳା ପରୀକ୍ଷଣ',
                  apparatus: 'Standard Laboratory Setup',
                  principleFormula: 'Formula equation',
                  procedureSteps: ['Step 1: Setup apparatus', 'Step 2: Record observations'],
                  precautions: ['Avoid parallax error'],
                  vivaQuestions: [
                    {
                      question: 'What is the working principle?',
                      answer: 'Explain basic council theory.',
                      answerOdia: 'ଏହାର ମୁଖ୍ୟ ନୀତି ବ୍ୟାଖ୍ୟା କରନ୍ତୁ।',
                    },
                  ],
                });
                setIsPracticalModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lab Experiment</span>
            </button>
          </div>

          <div className="space-y-3">
            {practicals
              .filter((p) => {
                const matchesSearch =
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.subject.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesSearch;
              })
              .map((lab) => (
                <div
                  key={lab.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs border border-purple-500/30 shrink-0">
                        #{lab.experimentNo}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {lab.subject}
                          </span>
                          <span className="text-xs text-slate-400">
                            {lab.vivaQuestions.length} Viva Questions
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-0.5">{lab.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingPractical(lab);
                          setIsPracticalModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete Experiment #${lab.experimentNo} "${lab.title}"?`)) {
                            await deletePractical(lab.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Apparatus:</span>
                      <p className="text-slate-300 mt-0.5">{lab.apparatus}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Principle Formula:</span>
                      <p className="text-emerald-400 font-mono mt-0.5">{lab.principleFormula}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. STUDENT DOUBTS DESK (FACULTY Q&A) */}
      {/* ============================================================ */}
      {activeTab === 'doubts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Student Doubts Resolution Desk</span>
                {pendingDoubtsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {pendingDoubtsCount} Pending Resolution
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Students ask doubts from the User Panel. Senior faculty review, solve, and reply here; answers sync to Supabase and show immediately on students' screens.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {studentDoubts
              .filter((d) => {
                const matchesStream = streamFilter === 'All' || d.stream === streamFilter;
                const matchesSearch =
                  d.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.doubtText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.topic.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesStream && matchesSearch;
              })
              .map((doubt) => (
                <div
                  key={doubt.id}
                  className={`p-5 rounded-2xl bg-slate-900 border transition-all space-y-3 ${
                    doubt.status === 'Pending'
                      ? 'border-amber-500/40 bg-slate-900/90 shadow-lg shadow-amber-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white">{doubt.studentName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {doubt.stream} • {doubt.subject}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Topic: <strong className="text-slate-200">{doubt.topic}</strong> • {doubt.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                          doubt.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {doubt.status === 'Pending' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        <span>{doubt.status === 'Pending' ? 'Pending Faculty Answer' : 'Resolved'}</span>
                      </span>

                      <button
                        onClick={() => {
                          setAnsweringDoubt(doubt);
                          setFacultyAnswerText(doubt.answerText || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>{doubt.status === 'Pending' ? 'Answer Doubt' : 'Edit Answer'}</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm('Delete this doubt entry?')) {
                            await deleteDoubt(doubt.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Student Question:</span>
                    <p className="text-sm text-slate-200 mt-1 font-medium leading-relaxed">{doubt.doubtText}</p>
                  </div>

                  {doubt.answerText && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                        <span className="flex items-center space-x-1.5">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>Official Faculty Solution by {doubt.answeredBy}</span>
                        </span>
                        <span className="text-[10px] text-emerald-500/80">{doubt.answeredAt}</span>
                      </div>
                      <p className="text-xs text-emerald-100 whitespace-pre-line leading-relaxed pt-1">
                        {doubt.answerText}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ANSWER DOUBT */}
      {/* ============================================================ */}
      {answeringDoubt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>Provide Official Faculty Answer</span>
              </h3>
              <button
                onClick={() => setAnsweringDoubt(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <div className="font-bold text-white mb-1">
                Student: {answeringDoubt.studentName} ({answeringDoubt.subject} • {answeringDoubt.topic})
              </div>
              <div className="italic text-slate-400">"{answeringDoubt.doubtText}"</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Faculty Name & Designation:
                </label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Step-by-Step Verified Solution (English / Odia):
                </label>
                <textarea
                  rows={6}
                  value={facultyAnswerText}
                  onChange={(e) => setFacultyAnswerText(e.target.value)}
                  placeholder="Type full step-by-step conceptual answer, mathematical derivations, or Odia council tips..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-hidden focus:border-emerald-500 resize-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setAnsweringDoubt(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!facultyAnswerText.trim()) return alert('Please type an answer.');
                  await answerDoubt(answeringDoubt.id, facultyAnswerText.trim(), facultyName.trim());
                  setAnsweringDoubt(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Answer & Sync Supabase</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT PYQ PAPER */}
      {/* ============================================================ */}
      {isPyqModalOpen && editingPyq && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingPyq.id.includes('new') ? 'Add New PYQ Paper' : 'Edit PYQ Paper'}
              </h3>
              <button onClick={() => setIsPyqModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-slate-400 font-semibold block mb-1">Paper Title</label>
                <input
                  type="text"
                  value={editingPyq.title}
                  onChange={(e) => setEditingPyq({ ...editingPyq, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Year</label>
                <input
                  type="number"
                  value={editingPyq.year}
                  onChange={(e) => setEditingPyq({ ...editingPyq, year: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Stream</label>
                <select
                  value={editingPyq.stream}
                  onChange={(e) => setEditingPyq({ ...editingPyq, stream: e.target.value as StreamType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                >
                  <option value="Science">Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  value={editingPyq.subject}
                  onChange={(e) => setEditingPyq({ ...editingPyq, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Total Marks</label>
                <input
                  type="number"
                  value={editingPyq.totalMarks}
                  onChange={(e) => setEditingPyq({ ...editingPyq, totalMarks: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 font-semibold block mb-1">Blueprint / Pattern</label>
                <input
                  type="text"
                  value={editingPyq.questionPattern}
                  onChange={(e) => setEditingPyq({ ...editingPyq, questionPattern: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 font-semibold block mb-1">Download PDF URL</label>
                <input
                  type="text"
                  value={editingPyq.downloadUrl}
                  onChange={(e) => setEditingPyq({ ...editingPyq, downloadUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="hasSol"
                  checked={editingPyq.hasSolutions}
                  onChange={(e) => setEditingPyq({ ...editingPyq, hasSolutions: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="hasSol" className="text-slate-300 font-semibold">Has Solved Answer Key</label>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isLock"
                  checked={editingPyq.isLocked}
                  onChange={(e) => setEditingPyq({ ...editingPyq, isLocked: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isLock" className="text-slate-300 font-semibold">Requires Batch Unlock</label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsPyqModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await addOrUpdatePyqPaper(editingPyq);
                  setIsPyqModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Save & Sync to Supabase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT BUREAU BOOK */}
      {/* ============================================================ */}
      {isBookModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingBook.id.includes('new') ? 'Add Bureau Book' : 'Edit Bureau Book'}
              </h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-slate-400 font-semibold block mb-1">Book Title (English)</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 font-semibold block mb-1">Title (Odia)</label>
                <input
                  type="text"
                  value={editingBook.titleOdia || ''}
                  onChange={(e) => setEditingBook({ ...editingBook, titleOdia: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Stream</label>
                <select
                  value={editingBook.stream}
                  onChange={(e) => setEditingBook({ ...editingBook, stream: e.target.value as StreamType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                >
                  <option value="Science">Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  value={editingBook.subject}
                  onChange={(e) => setEditingBook({ ...editingBook, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Volume</label>
                <input
                  type="text"
                  value={editingBook.volume}
                  onChange={(e) => setEditingBook({ ...editingBook, volume: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Chapters Count</label>
                <input
                  type="number"
                  value={editingBook.chaptersCount}
                  onChange={(e) => setEditingBook({ ...editingBook, chaptersCount: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 font-semibold block mb-1">Download Book URL</label>
                <input
                  type="text"
                  value={editingBook.downloadUrl}
                  onChange={(e) => setEditingBook({ ...editingBook, downloadUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 font-semibold block mb-1">Formula Cheatsheet PDF URL</label>
                <input
                  type="text"
                  value={editingBook.formulaSheetUrl || ''}
                  onChange={(e) => setEditingBook({ ...editingBook, formulaSheetUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await addOrUpdateBureauBook(editingBook);
                  setIsBookModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Save & Sync to Supabase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT PRACTICAL EXPERIMENT */}
      {/* ============================================================ */}
      {isPracticalModalOpen && editingPractical && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingPractical.id.includes('new') ? 'Add Lab Experiment' : 'Edit Lab Experiment'}
              </h3>
              <button onClick={() => setIsPracticalModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                  <select
                    value={editingPractical.subject}
                    onChange={(e) => setEditingPractical({ ...editingPractical, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Experiment No</label>
                  <input
                    type="number"
                    value={editingPractical.experimentNo}
                    onChange={(e) => setEditingPractical({ ...editingPractical, experimentNo: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Experiment Title</label>
                <input
                  type="text"
                  value={editingPractical.title}
                  onChange={(e) => setEditingPractical({ ...editingPractical, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Apparatus Required</label>
                <input
                  type="text"
                  value={editingPractical.apparatus}
                  onChange={(e) => setEditingPractical({ ...editingPractical, apparatus: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Principle Formula</label>
                <input
                  type="text"
                  value={editingPractical.principleFormula}
                  onChange={(e) => setEditingPractical({ ...editingPractical, principleFormula: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsPracticalModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await addOrUpdatePractical(editingPractical);
                  setIsPracticalModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Save & Sync to Supabase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
