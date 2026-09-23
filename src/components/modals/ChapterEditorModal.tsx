import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Lock,
  Unlock,
  Plus,
  Trash2,
  HelpCircle,
  CheckCircle2,
  FileText,
  Sparkles,
  Save,
  Languages,
} from 'lucide-react';
import { ChapterItem, BoardQuestion, MCQItem, AIContentType } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { AIGeneratorModal } from './AIGeneratorModal';

interface ChapterEditorModalProps {
  chapter: ChapterItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ODIA_KEY_TERMS = [
  { label: 'ସ୍ଥିର ବିଦ୍ୟୁତ୍', translation: 'Electrostatics' },
  { label: 'କୁଲମ୍ବ୍ଙ୍କ ନିୟମ', translation: 'Coulomb’s Law' },
  { label: 'ଗାଉସ୍ଙ୍କ ପ୍ରମେୟ', translation: 'Gauss’s Theorem' },
  { label: 'ବିଦ୍ୟୁତ୍ ଫ୍ଲକ୍ସ', translation: 'Electric Flux' },
  { label: 'କିର୍କଫ୍ଙ୍କ ନିୟମ', translation: 'Kirchhoff’s Laws' },
  { label: 'ହ୍ୱିଟଷ୍ଟୋନ୍ ବ୍ରିଜ୍', translation: 'Wheatstone Bridge' },
  { label: 'ଗଣତନ୍ତ୍ର', translation: 'Democracy' },
  { label: 'ପଞ୍ଚଶୀଳ ନୀତି', translation: 'Panchasheel' },
  { label: 'ଅଂଶୀଦାରୀ ଚୁକ୍ତିପତ୍ର', translation: 'Partnership Deed' },
  { label: 'ଅଂଶଧନ ବାଜ୍ୟାପ୍ତି', translation: 'Forfeiture of Shares' },
];

export const ChapterEditorModal: React.FC<ChapterEditorModalProps> = ({ chapter, isOpen, onClose }) => {
  const {
    chapters,
    updateChapter,
    boardQuestions,
    mcqs,
    addBoardQuestion,
    deleteBoardQuestion,
    addMCQ,
    deleteMCQ,
  } = useAdminData();

  if (!isOpen || !chapter) return null;

  const [activeTab, setActiveTab] = useState<'notes' | 'boardQA' | 'mcqs'>('notes');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiContentType, setAiContentType] = useState<AIContentType>('notes');

  const openAIGenerator = (type: AIContentType) => {
    setAiContentType(type);
    setShowAIGenerator(true);
  };
  const [title, setTitle] = useState(chapter.title);
  const [titleOdia, setTitleOdia] = useState(chapter.titleOdia || '');
  const [isFree, setIsFree] = useState(chapter.isFree);
  const [notesMarkdown, setNotesMarkdown] = useState(chapter.notesMarkdown);
  const [odiaSummary, setOdiaSummary] = useState(chapter.odiaSummary || '');

  // New Board Question Form state
  const [showAddBQ, setShowAddBQ] = useState(false);
  const [newBQMark, setNewBQMark] = useState<'2-Mark' | '3-Mark' | '5-Mark'>('2-Mark');
  const [newBQQText, setNewBQQText] = useState('');
  const [newBQQOdia, setNewBQQOdia] = useState('');
  const [newBQAText, setNewBQAText] = useState('');
  const [newBQAOdia, setNewBQAOdia] = useState('');
  const [newBQYear, setNewBQYear] = useState('CHSE Odisha 2024 Annual');

  // New MCQ Form state
  const [showAddMCQ, setShowAddMCQ] = useState(false);
  const [newMCQText, setNewMCQText] = useState('');
  const [newMCQOdia, setNewMCQOdia] = useState('');
  const [newMCQOptions, setNewMCQOptions] = useState(['', '', '', '']);
  const [newMCQCorrectIdx, setNewMCQCorrectIdx] = useState(0);
  const [newMCQExpl, setNewMCQExpl] = useState('');
  const [newMCQExplOdia, setNewMCQExplOdia] = useState('');

  const currentBoardQuestions = boardQuestions.filter((b) => b.chapterId === chapter.id);
  const currentMCQs = mcqs.filter((m) => m.chapterId === chapter.id);

  const handleSaveNotes = () => {
    updateChapter(chapter.id, {
      title,
      titleOdia,
      isFree,
      notesMarkdown,
      odiaSummary,
    });
    onClose();
  };

  const handleCreateBoardQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBQQText.trim() || !newBQAText.trim()) return;

    addBoardQuestion({
      chapterId: chapter.id,
      markType: newBQMark,
      questionText: newBQQText.trim(),
      questionOdia: newBQQOdia.trim() || undefined,
      answerText: newBQAText.trim(),
      answerOdia: newBQAOdia.trim() || undefined,
      yearAppeared: newBQYear.trim() || 'CHSE Odisha Model Exam',
    });

    setNewBQQText('');
    setNewBQQOdia('');
    setNewBQAText('');
    setNewBQAOdia('');
    setShowAddBQ(false);
  };

  const handleCreateMCQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMCQText.trim() || newMCQOptions.some((opt) => !opt.trim())) return;

    addMCQ({
      chapterId: chapter.id,
      question: newMCQText.trim(),
      questionOdia: newMCQOdia.trim() || undefined,
      options: newMCQOptions.map((o) => o.trim()),
      correctOptionIndex: newMCQCorrectIdx,
      explanation: newMCQExpl.trim(),
      explanationOdia: newMCQExplOdia.trim() || undefined,
    });

    setNewMCQText('');
    setNewMCQOdia('');
    setNewMCQOptions(['', '', '', '']);
    setNewMCQCorrectIdx(0);
    setNewMCQExpl('');
    setNewMCQExplOdia('');
    setShowAddMCQ(false);
  };

  const insertOdiaTerm = (term: string) => {
    setNotesMarkdown((prev) => prev + `\n- **${term}**: `);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                {chapter.stream} • {chapter.subject}
              </span>
              <span className="text-xs font-semibold text-emerald-400">Chapter {chapter.chapterNo}</span>
              {isFree ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Unlock className="w-3 h-3" /> Free Preview
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Lock className="w-3 h-3" /> Premium Locked
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{chapter.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'notes'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bilingual Notes & Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('boardQA')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'boardQA'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Board Model Q&A Bank ({currentBoardQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mcqs')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'mcqs'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>MCQ Mock Creator ({currentMCQs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: NOTES & BILINGUAL CONTENT */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Access status toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-xl">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    Access Permission (Paywall Rule)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toggle Chapter 1 as 100% Free Access vs Chapter 2+ Locked until UPI verification (₹99 / ₹149)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFree(!isFree)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isFree
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900'
                      : 'bg-amber-600 text-white shadow-sm shadow-amber-900'
                  }`}
                >
                  {isFree ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isFree ? 'Chapter 1 = FREE' : 'Chapter 2+ = LOCKED'}</span>
                </button>
              </div>

              {/* AI Content Generation Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-800/50 rounded-xl gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      AI Bilingual Notes & Odia Summary Generator
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        CHSE Council Model
                      </span>
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Auto-generate high-yield Markdown notes with theorems, derivations, and authentic Odia summary
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAIGenerator('notes')}
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Generate with AI</span>
                </button>
              </div>

              {/* Title & Odia Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Chapter Title (English)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Chapter Title (ଓଡ଼ିଆ ଅନୁବାଦ)
                  </label>
                  <input
                    type="text"
                    value={titleOdia}
                    onChange={(e) => setTitleOdia(e.target.value)}
                    placeholder="ଓଡ଼ିଆ ଶୀର୍ଷକ"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Odia Pedagogical Terms */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-sky-400" />
                  Quick-Insert Odia Concept Keywords
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ODIA_KEY_TERMS.map((term) => (
                    <button
                      key={term.label}
                      type="button"
                      onClick={() => insertOdiaTerm(term.label)}
                      title={term.translation}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-sky-300 transition-colors cursor-pointer"
                    >
                      + {term.label} ({term.translation})
                    </button>
                  ))}
                </div>
              </div>

              {/* Odia High-Yield Exam Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Odia High-Yield Exam Summary (ଓଡ଼ିଆରେ ସାରାଂଶ)
                </label>
                <textarea
                  rows={2}
                  value={odiaSummary}
                  onChange={(e) => setOdiaSummary(e.target.value)}
                  placeholder="ମୁଖ୍ୟ ପରୀକ୍ଷା ଉପଯୋଗୀ ପଏଣ୍ଟ ଏଠାରେ ଲେଖନ୍ତୁ..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Markdown Notes Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Comprehensive Chapter Notes (Markdown & Formulas)
                  </label>
                  <span className="text-[11px] text-slate-400">Supports LaTeX formulas & Odia Unicode</span>
                </div>
                <textarea
                  rows={10}
                  value={notesMarkdown}
                  onChange={(e) => setNotesMarkdown(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Notes & Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BOARD MODEL Q&A BANK */}
          {activeTab === 'boardQA' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    CHSE Board Solved Exam Questions
                  </h4>
                  <p className="text-xs text-slate-400">
                    2-Mark, 3-Mark, and 5-Mark solved model answers for Odisha Board examinations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAIGenerator('2-mark')}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Generate with AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddBQ(!showAddBQ)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddBQ ? 'Close Form' : 'Add Board Question'}</span>
                  </button>
                </div>
              </div>

              {/* Add Board Question Form */}
              {showAddBQ && (
                <form
                  onSubmit={handleCreateBoardQuestion}
                  className="p-4 bg-slate-950 border border-slate-700 rounded-xl space-y-3"
                >
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    New Board Solved Question
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Question Category / Marks
                      </label>
                      <select
                        value={newBQMark}
                        onChange={(e) => setNewBQMark(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="2-Mark">2-Mark (Very Short Answer)</option>
                        <option value="3-Mark">3-Mark (Short Answer)</option>
                        <option value="5-Mark">5-Mark (Long Descriptive Question)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Year / Board Exam Reference
                      </label>
                      <input
                        type="text"
                        value={newBQYear}
                        onChange={(e) => setNewBQYear(e.target.value)}
                        placeholder="e.g., CHSE Odisha 2024 Annual"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Question Text (English)
                    </label>
                    <input
                      type="text"
                      required
                      value={newBQQText}
                      onChange={(e) => setNewBQQText(e.target.value)}
                      placeholder="State Coulomb's law and write its vector form..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Question Text (ଓଡ଼ିଆ ପ୍ରଶ୍ନ - Optional)
                    </label>
                    <input
                      type="text"
                      value={newBQQOdia}
                      onChange={(e) => setNewBQQOdia(e.target.value)}
                      placeholder="କୁଲମ୍ବଙ୍କ ନିୟମ ବର୍ଣ୍ଣନା କର..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Model Solved Answer (English)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newBQAText}
                      onChange={(e) => setNewBQAText(e.target.value)}
                      placeholder="Step-by-step full mark answer according to CHSE marking scheme..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Model Solved Answer (ଓଡ଼ିଆ ଉତ୍ତର - Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={newBQAOdia}
                      onChange={(e) => setNewBQAOdia(e.target.value)}
                      placeholder="ଓଡ଼ିଆରେ ସରଳ ବୁଝାମଣା..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddBQ(false)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
                    >
                      Save Question
                    </button>
                  </div>
                </form>
              )}

              {/* Questions List */}
              <div className="space-y-3">
                {currentBoardQuestions.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                    No board questions added to this chapter yet. Click "Add Board Question" above.
                  </div>
                ) : (
                  currentBoardQuestions.map((bq) => (
                    <div
                      key={bq.id}
                      className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                              bq.markType === '5-Mark'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : bq.markType === '3-Mark'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {bq.markType}
                          </span>
                          {bq.yearAppeared && (
                            <span className="text-[11px] text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
                              {bq.yearAppeared}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteBoardQuestion(bq.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-white">Q: {bq.questionText}</p>
                      {bq.questionOdia && (
                        <p className="text-xs text-sky-300">ପ୍ରଶ୍ନ: {bq.questionOdia}</p>
                      )}

                      <div className="p-2.5 bg-slate-900 rounded-lg text-xs text-slate-300 space-y-1">
                        <p>
                          <strong className="text-emerald-400">Answer:</strong> {bq.answerText}
                        </p>
                        {bq.answerOdia && (
                          <p className="text-slate-400">
                            <strong>ଓଡ଼ିଆ:</strong> {bq.answerOdia}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MCQ MOCK TEST CREATOR */}
          {activeTab === 'mcqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Multiple Choice Questions (MCQ Bank)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Add 4-option MCQs with correct answer key and bilingual explanations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAIGenerator('mcq')}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Generate with AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMCQ(!showAddMCQ)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddMCQ ? 'Close Form' : 'Add MCQ Item'}</span>
                  </button>
                </div>
              </div>

              {/* Add MCQ Form */}
              {showAddMCQ && (
                <form
                  onSubmit={handleCreateMCQ}
                  className="p-4 bg-slate-950 border border-slate-700 rounded-xl space-y-3"
                >
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    New Multiple Choice Item
                  </h5>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      MCQ Question Text (English)
                    </label>
                    <input
                      type="text"
                      required
                      value={newMCQText}
                      onChange={(e) => setNewMCQText(e.target.value)}
                      placeholder="The SI unit of electric permittivity is..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      MCQ Question Text (ଓଡ଼ିଆ ପ୍ରଶ୍ନ - Optional)
                    </label>
                    <input
                      type="text"
                      value={newMCQOdia}
                      onChange={(e) => setNewMCQOdia(e.target.value)}
                      placeholder="ଓଡ଼ିଆ ପ୍ରଶ୍ନ..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-300">
                      4 Options (Select Radio for Correct Key)
                    </label>
                    {newMCQOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={newMCQCorrectIdx === idx}
                          onChange={() => setNewMCQCorrectIdx(idx)}
                          className="text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-400 w-6">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const copy = [...newMCQOptions];
                            copy[idx] = e.target.value;
                            setNewMCQOptions(copy);
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Explanation / Solution Logic (English)
                    </label>
                    <input
                      type="text"
                      value={newMCQExpl}
                      onChange={(e) => setNewMCQExpl(e.target.value)}
                      placeholder="From Coulomb's Law F = 1/(4πε₀) (q₁q₂/r²)..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Explanation (ଓଡ଼ିଆ ବ୍ୟାଖ୍ୟା - Optional)
                    </label>
                    <input
                      type="text"
                      value={newMCQExplOdia}
                      onChange={(e) => setNewMCQExplOdia(e.target.value)}
                      placeholder="ଓଡ଼ିଆରେ କାରଣ..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddMCQ(false)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
                    >
                      Save MCQ
                    </button>
                  </div>
                </form>
              )}

              {/* MCQ List */}
              <div className="space-y-3">
                {currentMCQs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                    No MCQs configured for this chapter yet. Click "Add MCQ Item" to create one.
                  </div>
                ) : (
                  currentMCQs.map((mcq, idx) => (
                    <div
                      key={mcq.id}
                      className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">MCQ #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => deleteMCQ(mcq.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-white">{mcq.question}</p>
                      {mcq.questionOdia && (
                        <p className="text-xs text-sky-300">ଓଡ଼ିଆ: {mcq.questionOdia}</p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {mcq.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === mcq.correctOptionIndex;
                          return (
                            <div
                              key={optIdx}
                              className={`p-2 rounded-lg text-xs flex items-center gap-2 border ${
                                isCorrect
                                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-semibold'
                                  : 'bg-slate-900 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                              {isCorrect && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {mcq.explanation && (
                        <div className="p-2 bg-slate-900/90 rounded text-[11px] text-slate-400">
                          <strong className="text-emerald-400">Key Explanation:</strong>{' '}
                          {mcq.explanation}
                          {mcq.explanationOdia && ` (${mcq.explanationOdia})`}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI GENERATOR MODAL */}
        <AIGeneratorModal
          isOpen={showAIGenerator}
          onClose={() => setShowAIGenerator(false)}
          initialStream={chapter.stream}
          initialSubject={chapter.subject}
          initialChapterTitle={chapter.title}
          initialChapterId={chapter.id}
          initialType={aiContentType}
          onSavedContent={(result) => {
            if (result.type === 'notes') {
              const latest = chapters.find((c) => c.id === chapter.id);
              if (latest) {
                setNotesMarkdown(latest.notesMarkdown);
                setOdiaSummary(latest.odiaSummary || '');
                if (latest.titleOdia) setTitleOdia(latest.titleOdia);
              }
            }
          }}
        />

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Odisha CHSE +2 2nd Year Digital Classroom Content Repository
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};
