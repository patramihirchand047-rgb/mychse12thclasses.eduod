import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  FileText,
  Lock,
  Unlock,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  Video,
  Eye,
  CheckCircle2,
  Languages,
  HelpCircle,
  Edit3,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { Lesson, StreamType, ChapterItem } from '../types';
import { STREAM_SUBJECTS } from '../data/mockData';
import { ChapterEditorModal } from './modals/ChapterEditorModal';
import { AIGeneratorModal } from './modals/AIGeneratorModal';

interface CourseManagementProps {
  onOpenAddLesson: (defaultStream?: StreamType, defaultSubject?: string) => void;
  onPreviewLesson: (lesson: Lesson) => void;
}

export const CourseManagement: React.FC<CourseManagementProps> = ({
  onOpenAddLesson,
  onPreviewLesson,
}) => {
  const {
    lessons,
    chapters,
    toggleLessonFreePreview,
    deleteLesson,
    toggleChapterFreeStatus,
    addChapter,
    deleteChapter,
    boardQuestions,
    mcqs,
    syncWithSupabase,
    isSyncingSupabase,
    isSupabaseConnected,
  } = useAdminData();

  const [activeStream, setActiveStream] = useState<StreamType>('Science');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [contentView, setContentView] = useState<'chapters' | 'lessons'>('chapters');
  const [searchFilter, setSearchFilter] = useState('');

  // Chapter Editor Modal State
  const [editingChapter, setEditingChapter] = useState<ChapterItem | null>(null);
  const [showNewChapterModal, setShowNewChapterModal] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [newChapTitle, setNewChapTitle] = useState('');
  const [newChapTitleOdia, setNewChapTitleOdia] = useState('');
  const [newChapSubject, setNewChapSubject] = useState('');
  const [newChapNo, setNewChapNo] = useState(1);
  const [newChapIsFree, setNewChapIsFree] = useState(false);

  const subjectsForStream = STREAM_SUBJECTS[activeStream] || [];

  // Filtered Chapters
  const filteredChapters = chapters.filter((c) => {
    const matchesStream = c.stream === activeStream;
    const matchesSubject = selectedSubject === 'All' || c.subject === selectedSubject;
    const matchesSearch =
      !searchFilter ||
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (c.titleOdia && c.titleOdia.toLowerCase().includes(searchFilter.toLowerCase())) ||
      c.subject.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesStream && matchesSubject && matchesSearch;
  });

  // Filtered Lessons
  const filteredLessons = lessons.filter((l) => {
    const matchesStream = l.stream === activeStream;
    const matchesSubject = selectedSubject === 'All' || l.subject === selectedSubject;
    const matchesSearch =
      !searchFilter ||
      l.lessonTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.chapterTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.instructor.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesStream && matchesSubject && matchesSearch;
  });

  const handleCreateNewChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapTitle.trim()) return;

    const targetSub = newChapSubject || (selectedSubject !== 'All' ? selectedSubject : subjectsForStream[0]);
    addChapter({
      stream: activeStream,
      subject: targetSub,
      chapterNo: Number(newChapNo),
      title: newChapTitle.trim(),
      titleOdia: newChapTitleOdia.trim() || undefined,
      isFree: newChapIsFree,
      notesMarkdown: `# Chapter ${newChapNo}: ${newChapTitle}\n\nComprehensive CHSE +2 2nd Year Syllabus Notes.\n\n### Key Formulas & Principles\n- Write formulas here...`,
      boardQuestionsCount: 0,
      mcqCount: 0,
    });

    setNewChapTitle('');
    setNewChapTitleOdia('');
    setShowNewChapterModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/70 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CHSE Odisha +2 2nd Year Syllabus (2025-2026)
              </span>
              <span className="text-xs text-slate-400">Official Curriculum CMS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              Curriculum & Content Management System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Manage chapters, bilingual notes (English & Odia summaries), Board Model Q&A bank (2, 3, 5-Marks), MCQ mock tests, and video lectures with paywall switches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => syncWithSupabase()}
              disabled={isSyncingSupabase}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isSupabaseConnected
                  ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-900/60'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700'
              } disabled:opacity-50`}
              title="Pull latest chapters, questions, and videos from Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Live DB'}</span>
            </button>

            <button
              onClick={() => setShowAIGenerator(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Generate with AI</span>
            </button>

            <button
              onClick={() => {
                setNewChapSubject(selectedSubject !== 'All' ? selectedSubject : subjectsForStream[0]);
                setNewChapNo(filteredChapters.length + 1);
                setShowNewChapterModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chapter</span>
            </button>

            <button
              onClick={() => onOpenAddLesson(activeStream, selectedSubject !== 'All' ? selectedSubject : subjectsForStream[0])}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Add Video Lecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stream Tabs (Science, Arts, Commerce) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {(['Science', 'Arts', 'Commerce'] as StreamType[]).map((stream) => {
          const streamChapters = chapters.filter((c) => c.stream === stream).length;
          const isActive = activeStream === stream;
          return (
            <button
              key={stream}
              onClick={() => {
                setActiveStream(stream);
                setSelectedSubject('All');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? stream === 'Science'
                    ? 'bg-sky-600 text-white shadow-md'
                    : stream === 'Arts'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{stream} Stream</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-black/20 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {streamChapters} Chapters
              </span>
            </button>
          );
        })}
      </div>

      {/* Subject Filter Pills & View Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Subjects */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedSubject('All')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
                selectedSubject === 'All'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Subjects
            </button>
            {subjectsForStream.map((sub) => {
              const count = chapters.filter(
                (c) => c.stream === activeStream && c.subject === sub
              ).length;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{sub}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="w-full md:w-64 shrink-0">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search chapters, topics, notes..."
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* View Toggle Bar (Chapters vs Video Lectures) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setContentView('chapters')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                contentView === 'chapters'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Chapter Syllabus & Notes ({filteredChapters.length})</span>
            </button>

            <button
              onClick={() => setContentView('lessons')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                contentView === 'lessons'
                  ? 'bg-slate-800 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Recorded Video Lectures ({filteredLessons.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Paywall Rule: <strong>Chapter 1 is 100% Free</strong>. Chapter 2+ locked until UTR approval.
          </div>
        </div>
      </div>

      {/* VIEW 1: CHAPTERS & CMS */}
      {contentView === 'chapters' && (
        <div className="space-y-3">
          {filteredChapters.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
              <p className="text-sm font-semibold text-slate-300">No chapters found for this selection.</p>
              <p className="text-xs text-slate-500 mt-1">Click "Add Chapter" above to create curriculum topics.</p>
            </div>
          ) : (
            filteredChapters.map((chapter) => {
              const bqCount = boardQuestions.filter((b) => b.chapterId === chapter.id).length;
              const mcqCount = mcqs.filter((m) => m.chapterId === chapter.id).length;
              const chapLessons = lessons.filter((l) => l.stream === chapter.stream && l.subject === chapter.subject && l.chapterNo === chapter.chapterNo);

              return (
                <div
                  key={chapter.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all shadow-md space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Left details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                          {chapter.subject}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          Chapter {chapter.chapterNo}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {chapter.title}
                        </h3>
                        {chapter.titleOdia && (
                          <span className="text-xs font-semibold text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                            {chapter.titleOdia}
                          </span>
                        )}
                      </div>

                      {/* Counts and Badges */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-slate-300">
                          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                          <span>{bqCount} Board Q&A (2, 3, 5 Marks)</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                          <span>{mcqCount} MCQs</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Video className="w-3.5 h-3.5 text-amber-400" />
                          <span>{chapLessons.length} Video Lectures</span>
                        </span>
                        {chapter.odiaSummary && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Languages className="w-3.5 h-3.5" />
                              <span>Odia Summary Available</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                      {/* Chapter Free / Locked Switch */}
                      <button
                        onClick={() => toggleChapterFreeStatus(chapter.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                          chapter.isFree
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900'
                            : 'bg-amber-950/80 text-amber-300 border-amber-600/50 hover:bg-amber-900'
                        }`}
                        title="Chapter 1 has open access preview, chapter 2+ requires course verification"
                      >
                        {chapter.isFree ? (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>CH 1 FREE PREVIEW</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>LOCKED (PAID)</span>
                          </>
                        )}
                      </button>

                      {/* Edit Chapter Notes, Model Q&A, and MCQs */}
                      <button
                        onClick={() => setEditingChapter(chapter)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Edit Content & Q&A</span>
                      </button>

                      <button
                        onClick={() => deleteChapter(chapter.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: RECORDED VIDEO LECTURES & PDF NOTES */}
      {contentView === 'lessons' && (
        <div className="space-y-3">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    onClick={() => onPreviewLesson(lesson)}
                    className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 flex items-center justify-center shrink-0 cursor-pointer transition-colors shadow-inner group"
                    title="Click to preview video lecture"
                  >
                    <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                        {lesson.subject}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        Chapter {lesson.chapterNo}: {lesson.chapterTitle}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Video className="w-3 h-3 text-slate-400" />
                        {lesson.duration} ({lesson.videoType.toUpperCase()})
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate">
                      {lesson.lessonTitle}
                    </h3>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
                      <span>Instructor: <strong className="text-slate-300">{lesson.instructor}</strong></span>
                      <span>•</span>

                      {/* Odia PDF Badge */}
                      {lesson.odiaNotesUrl ? (
                        <a
                          href={lesson.odiaNotesUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:underline bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60"
                        >
                          <FileText className="w-3 h-3" />
                          <span>ଓଡ଼ିଆ PDF Notes</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-500">No Odia Note</span>
                      )}

                      {/* English PDF Badge */}
                      {lesson.englishNotesUrl ? (
                        <a
                          href={lesson.englishNotesUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:underline bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60"
                        >
                          <FileText className="w-3 h-3" />
                          <span>English PDF Notes</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-500">No Eng Note</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => toggleLessonFreePreview(lesson.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      lesson.isFreePreview
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900'
                        : 'bg-amber-950/80 text-amber-300 border-amber-600/50 hover:bg-amber-900'
                    }`}
                  >
                    {lesson.isFreePreview ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>FREE PREVIEW</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>LOCKED (PAID)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onPreviewLesson(lesson)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Open Video Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteLesson(lesson.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Delete Lesson"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
              <p className="text-sm font-semibold text-slate-300">No video lectures found for this criteria.</p>
              <p className="text-xs text-slate-500 mt-1">Click "Add Video Lecture" above to upload content.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Chapter Editor */}
      {editingChapter && (
        <ChapterEditorModal
          chapter={editingChapter}
          isOpen={!!editingChapter}
          onClose={() => setEditingChapter(null)}
        />
      )}

      {/* MODAL: Quick Add Chapter */}
      {showNewChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Add New Chapter ({activeStream})
            </h3>

            <form onSubmit={handleCreateNewChapter} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={newChapSubject}
                    onChange={(e) => setNewChapSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    {subjectsForStream.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Chapter Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newChapNo}
                    onChange={(e) => setNewChapNo(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Chapter Title (English)
                </label>
                <input
                  type="text"
                  required
                  value={newChapTitle}
                  onChange={(e) => setNewChapTitle(e.target.value)}
                  placeholder="e.g., Electrostatics"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Chapter Title (ଓଡ଼ିଆ ଅନୁବାଦ - Optional)
                </label>
                <input
                  type="text"
                  value={newChapTitleOdia}
                  onChange={(e) => setNewChapTitleOdia(e.target.value)}
                  placeholder="e.g., ସ୍ଥିର ବିଦ୍ୟୁତ୍"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFreeCheck"
                  checked={newChapIsFree}
                  onChange={(e) => setNewChapIsFree(e.target.checked)}
                  className="text-emerald-500 focus:ring-emerald-500 w-4 h-4 rounded"
                />
                <label htmlFor="isFreeCheck" className="text-xs text-slate-300 cursor-pointer">
                  Mark as Chapter 1 Free Preview (Open to public before login)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewChapterModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* AI CONTENT GENERATOR MODAL */}
      <AIGeneratorModal
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        initialStream={activeStream}
        initialSubject={selectedSubject !== 'All' ? selectedSubject : subjectsForStream[0]}
        initialType="mcq"
      />
    </div>
  );
};
