import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  RefreshCw,
  Trash2,
  Plus,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  FileText,
  Eye,
  Edit3,
  Layers,
  Award,
  Send,
  Check,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { StreamType, AIContentType, AILanguage, AIGeneratedMCQ, AIGeneratedBoardQuestion, AIGeneratedNotes } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { insertSupabaseBoardQuestion, insertSupabaseMCQ, updateSupabaseChapter } from '../../lib/supabase';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStream?: StreamType;
  initialSubject?: string;
  initialChapterTitle?: string;
  initialChapterId?: string;
  initialType?: AIContentType;
  onSavedContent?: (result: { type: AIContentType; chapterId?: string; count: number }) => void;
}

const STREAM_SUBJECTS: Record<StreamType, string[]> = {
  Science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Information Technology', 'English', 'MIL Odia'],
  Arts: ['History', 'Political Science', 'Economics', 'Education', 'Logic', 'Sociology', 'English', 'MIL Odia'],
  Commerce: ['Accountancy', 'Business Studies', 'Business Mathematics', 'Banking & Insurance', 'Economics', 'English', 'MIL Odia'],
};

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialStream = 'Science',
  initialSubject = 'Physics',
  initialChapterTitle = '',
  initialChapterId,
  initialType = 'mcq',
  onSavedContent,
}) => {
  const { chapters, addBoardQuestion, addMCQ, updateChapter, addAuditLog } = useAdminData();

  // Inputs
  const [stream, setStream] = useState<StreamType>(initialStream);
  const [subject, setSubject] = useState<string>(initialSubject);
  const [chapterId, setChapterId] = useState<string>(initialChapterId || '');
  const [chapterTitle, setChapterTitle] = useState<string>(initialChapterTitle);
  const [contentType, setContentType] = useState<AIContentType>(initialType);
  const [language, setLanguage] = useState<AILanguage>('bilingual');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [wordLimit, setWordLimit] = useState<string>('Standard Council Scheme');
  const [focusInstructions, setFocusInstructions] = useState<string>('');

  // States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  // Generated outputs
  const [generatedMCQs, setGeneratedMCQs] = useState<AIGeneratedMCQ[]>([]);
  const [generatedBoardQs, setGeneratedBoardQs] = useState<AIGeneratedBoardQuestion[]>([]);
  const [generatedNotes, setGeneratedNotes] = useState<AIGeneratedNotes | null>(null);

  // Sync with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setStream(initialStream);
      setSubject(initialSubject);
      setContentType(initialType);
      setChapterId(initialChapterId || '');
      setChapterTitle(initialChapterTitle || '');
      setError(null);
      setSaveSuccessMsg(null);
    }
  }, [isOpen, initialStream, initialSubject, initialChapterId, initialChapterTitle, initialType]);

  // If chapterId changes, sync chapter title
  const handleChapterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setChapterId(selectedId);
    const found = chapters.find((c) => c.id === selectedId);
    if (found) {
      setChapterTitle(found.title);
      setSubject(found.subject);
      setStream(found.stream);
    }
  };

  // Available subjects for current stream
  const availableSubjects = STREAM_SUBJECTS[stream] || [];

  // Filtered chapters for dropdown
  const matchingChapters = chapters.filter((c) => c.stream === stream && c.subject === subject);

  const handleGenerate = async () => {
    if (!chapterTitle.trim()) {
      setError('Please provide or select a Chapter Title before generating.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSaveSuccessMsg(null);
    setFallbackNotice(null);
    setGenerationStep('Connecting to CHSE Odisha Council AI Model...');

    try {
      setTimeout(() => setGenerationStep('Analyzing Odisha Council Exam Pattern & Syllabus...'), 1200);
      setTimeout(() => setGenerationStep('Formulating Bilingual Content & Odia Unicode Text...'), 2800);

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          stream,
          subject,
          chapterTitle,
          language,
          count: questionCount,
          wordLimit,
          focusInstructions,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'AI generation failed.');
      }

      if (json.notice) {
        setFallbackNotice(json.notice);
      } else {
        setFallbackNotice(null);
      }

      const data = json.data;

      if (contentType === 'mcq') {
        const list: AIGeneratedMCQ[] = (data.questions || []).map((q: any, idx: number) => ({
          id: `mcq-gen-${Date.now()}-${idx}`,
          question: q.question || '',
          questionOdia: q.questionOdia || '',
          options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          optionsOdia: Array.isArray(q.optionsOdia) ? q.optionsOdia : [],
          correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
          explanation: q.explanation || '',
          explanationOdia: q.explanationOdia || '',
        }));
        setGeneratedMCQs(list);
        setGeneratedBoardQs([]);
        setGeneratedNotes(null);
      } else if (contentType === 'notes') {
        setGeneratedNotes({
          title: data.title || chapterTitle,
          titleOdia: data.titleOdia || '',
          notesMarkdown: data.notesMarkdown || '',
          odiaSummary: data.odiaSummary || '',
          keyFormulae: data.keyFormulae || [],
        });
        setGeneratedMCQs([]);
        setGeneratedBoardQs([]);
      } else {
        // Board questions: 2-mark, 3-mark, long
        const list: AIGeneratedBoardQuestion[] = (data.questions || []).map((q: any, idx: number) => ({
          id: `bq-gen-${Date.now()}-${idx}`,
          markType: q.markType || (contentType === '2-mark' ? '2-Mark' : contentType === '3-mark' ? '3-Mark' : '5-Mark'),
          questionText: q.questionText || '',
          questionOdia: q.questionOdia || '',
          answerText: q.answerText || '',
          answerOdia: q.answerOdia || '',
          yearAppeared: q.yearAppeared || 'CHSE Odisha Model Question',
          markingKey: q.markingKey || [],
        }));
        setGeneratedBoardQs(list);
        setGeneratedMCQs([]);
        setGeneratedNotes(null);
      }

      setActiveTab('editor');
    } catch (err: any) {
      console.error('AI Generate Error:', err);
      setError(err.message || 'Error occurred while contacting the AI model. Please retry.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Regenerate single question
  const handleRegenerateSingle = async (index: number) => {
    setRegeneratingIndex(index);
    try {
      const isMCQ = contentType === 'mcq';
      const prevQ = isMCQ ? generatedMCQs[index]?.question : generatedBoardQs[index]?.questionText;
      const markType = !isMCQ ? generatedBoardQs[index]?.markType : undefined;

      const res = await fetch('/api/ai/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          stream,
          subject,
          chapterTitle,
          language,
          markType,
          previousQuestion: prevQ,
          focusInstructions,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Failed to regenerate question.');
      }

      const fresh = json.data;

      if (isMCQ) {
        const updated = [...generatedMCQs];
        updated[index] = {
          id: `mcq-regen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          question: fresh.question || '',
          questionOdia: fresh.questionOdia || '',
          options: fresh.options || ['A', 'B', 'C', 'D'],
          optionsOdia: fresh.optionsOdia || [],
          correctOptionIndex: fresh.correctOptionIndex || 0,
          explanation: fresh.explanation || '',
          explanationOdia: fresh.explanationOdia || '',
        };
        setGeneratedMCQs(updated);
      } else {
        const updated = [...generatedBoardQs];
        updated[index] = {
          id: `bq-regen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          markType: fresh.markType || updated[index].markType,
          questionText: fresh.questionText || '',
          questionOdia: fresh.questionOdia || '',
          answerText: fresh.answerText || '',
          answerOdia: fresh.answerOdia || '',
          yearAppeared: fresh.yearAppeared || 'CHSE Model 2026',
          markingKey: fresh.markingKey || [],
        };
        setGeneratedBoardQs(updated);
      }
    } catch (err: any) {
      alert(`Could not regenerate question: ${err.message}`);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  // Delete question
  const handleDeleteMCQ = (index: number) => {
    setGeneratedMCQs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteBoardQ = (index: number) => {
    setGeneratedBoardQs((prev) => prev.filter((_, i) => i !== index));
  };

  // Save approved content to chapter & Supabase
  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setSaveSuccessMsg(null);
    setError(null);

    try {
      const targetChapterId = chapterId || (matchingChapters[0]?.id ?? 'chap-general');

      if (contentType === 'mcq') {
        if (generatedMCQs.length === 0) {
          throw new Error('No MCQs available to save.');
        }

        // Add to local state
        for (const mcq of generatedMCQs) {
          addMCQ({
            chapterId: targetChapterId,
            question: mcq.question,
            questionOdia: mcq.questionOdia,
            options: mcq.options,
            correctOptionIndex: mcq.correctOptionIndex,
            explanation: mcq.explanation,
            explanationOdia: mcq.explanationOdia,
          });

          // Sync to Supabase mcqs table
          await insertSupabaseMCQ({
            chapterId: targetChapterId,
            question: mcq.question,
            questionOdia: mcq.questionOdia,
            options: mcq.options,
            optionsOdia: mcq.optionsOdia,
            correctOptionIndex: mcq.correctOptionIndex,
            explanation: mcq.explanation,
            explanationOdia: mcq.explanationOdia,
          }).catch((err) => console.warn('Supabase MCQ sync note:', err));
        }

        addAuditLog(
          'AI_MCQS_APPROVED',
          `Approved and saved ${generatedMCQs.length} AI-generated MCQs for ${subject} - "${chapterTitle}" (${stream}).`
        );

        setSaveSuccessMsg(`Successfully saved ${generatedMCQs.length} MCQs to Chapter & Supabase!`);
        if (onSavedContent) {
          onSavedContent({ type: 'mcq', chapterId: targetChapterId, count: generatedMCQs.length });
        }
      } else if (contentType === 'notes') {
        if (!generatedNotes) {
          throw new Error('No Notes available to save.');
        }

        // Update chapter
        updateChapter(targetChapterId, {
          notesMarkdown: generatedNotes.notesMarkdown,
          odiaSummary: generatedNotes.odiaSummary,
          titleOdia: generatedNotes.titleOdia,
        });

        // Sync to Supabase chapters
        await updateSupabaseChapter(targetChapterId, {
          notesMarkdown: generatedNotes.notesMarkdown,
          odiaSummary: generatedNotes.odiaSummary,
          titleOdia: generatedNotes.titleOdia,
        }).catch((err) => console.warn('Supabase Chapter notes sync note:', err));

        addAuditLog(
          'AI_NOTES_APPROVED',
          `Approved and published AI-generated Bilingual Notes & Odia Summary for ${subject} - "${chapterTitle}".`
        );

        setSaveSuccessMsg('Successfully saved Bilingual Notes & Odia Summary to Chapter & Supabase!');
        if (onSavedContent) {
          onSavedContent({ type: 'notes', chapterId: targetChapterId, count: 1 });
        }
      } else {
        // Board questions
        if (generatedBoardQs.length === 0) {
          throw new Error('No Board Questions available to save.');
        }

        for (const bq of generatedBoardQs) {
          addBoardQuestion({
            chapterId: targetChapterId,
            markType: bq.markType,
            questionText: bq.questionText,
            questionOdia: bq.questionOdia,
            answerText: bq.answerText,
            answerOdia: bq.answerOdia,
            yearAppeared: bq.yearAppeared,
          });

          // Sync to Supabase board_questions table
          await insertSupabaseBoardQuestion({
            chapterId: targetChapterId,
            markType: bq.markType,
            questionText: bq.questionText,
            questionOdia: bq.questionOdia,
            answerText: bq.answerText,
            answerOdia: bq.answerOdia,
            yearAppeared: bq.yearAppeared,
          }).catch((err) => console.warn('Supabase Board Q sync note:', err));
        }

        addAuditLog(
          'AI_BOARD_QUESTIONS_APPROVED',
          `Approved and saved ${generatedBoardQs.length} Board Q&As (${contentType}) for ${subject} - "${chapterTitle}".`
        );

        setSaveSuccessMsg(`Successfully saved ${generatedBoardQs.length} Board Questions to Chapter & Supabase!`);
        if (onSavedContent) {
          onSavedContent({ type: contentType, chapterId: targetChapterId, count: generatedBoardQs.length });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save approved content.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasGeneratedData = generatedMCQs.length > 0 || generatedBoardQs.length > 0 || generatedNotes !== null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl my-6 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  AI Question & Answer Generator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CHSE 12th Council Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Syllabus-aligned questions, verified model answers, and authentic Odia script for Odisha +2 2nd Year
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: CONFIGURATION BAR */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                Step 1: Curriculum & Content Specifications
              </span>
              <span className="text-xs text-slate-400">
                Council Scheme 2026 Batch
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stream */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Academic Stream</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-lg border border-slate-700/70">
                  {(['Science', 'Arts', 'Commerce'] as StreamType[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setStream(s);
                        setSubject(STREAM_SUBJECTS[s][0]);
                      }}
                      className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                        stream === s
                          ? 'bg-blue-600 text-white font-semibold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Selection or Manual Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Existing Chapter</label>
                <select
                  value={chapterId}
                  onChange={handleChapterSelect}
                  className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Or enter custom title below --</option>
                  {matchingChapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      Ch.{c.chapterNo}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Title Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Chapter / Topic Title</label>
                <input
                  type="text"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="e.g. Electrostatics, Non-Cooperation Movement"
                  className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Question Type Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Content Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'mcq', label: 'MCQ Mock Creator', desc: '1 Mark • 4 Options', icon: HelpCircle },
                  { id: '2-mark', label: '2 Marks Question', desc: 'Very Short Answer', icon: Award },
                  { id: '3-mark', label: '3 Marks Question', desc: 'Short Answer / Distinguish', icon: Award },
                  { id: 'long', label: 'Long Question', desc: '5 / 7 Marks • Full Derivation', icon: FileText },
                  { id: 'notes', label: 'Bilingual Notes', desc: 'Full Study Notes & Odia', icon: BookOpen },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = contentType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setContentType(item.id as AIContentType)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                          : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <span className="text-xs font-semibold text-white truncate">{item.label}</span>
                      <span className="text-[10px] text-slate-400 truncate">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Parameters: Language, Count, Word Limit, Extra Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Language */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Language Mode</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-lg border border-slate-700/70">
                  {[
                    { id: 'bilingual', label: 'Bilingual' },
                    { id: 'english', label: 'English' },
                    { id: 'odia', label: 'ଓଡ଼ିଆ' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLanguage(l.id as AILanguage)}
                      className={`py-1 text-xs font-medium rounded transition-all ${
                        language === l.id
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions (if not notes) */}
              {contentType !== 'notes' ? (
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                    <span>Number of Questions</span>
                    <span className="text-blue-400 font-bold">{questionCount} Qs</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Notes Detail Level</label>
                  <select
                    value={wordLimit}
                    onChange={(e) => setWordLimit(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Comprehensive (Definitions, Formulas & Summary)">Comprehensive High-Yield</option>
                    <option value="Quick Revision Bullet Points">Quick Exam Revision</option>
                    <option value="In-depth with Solved Examples">In-depth with Equations</option>
                  </select>
                </div>
              )}

              {/* Focus instructions */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Focus Areas / Blueprint Instructions <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={focusInstructions}
                  onChange={(e) => setFocusInstructions(e.target.value)}
                  placeholder="e.g. Previous 5 year repeats, Gauss Law derivations"
                  className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
            </div>

            {/* GENERATE ACTION BUTTON */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                    <span>{generationStep || 'Generating Content with AI...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Generate with AI (CHSE Odisha Standard)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS BANNER */}
          {saveSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* STEP 2: ADMIN REVIEW & INLINE EDITOR */}
          {hasGeneratedData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    Step 2: Admin Review, Edit & Regenerate
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-400">
                    {contentType === 'mcq'
                      ? `${generatedMCQs.length} MCQs Generated`
                      : contentType === 'notes'
                      ? 'Bilingual Notes Drafted'
                      : `${generatedBoardQs.length} Board Questions Drafted`}
                  </span>
                </div>

                {/* Switch between Editor and Preview */}
                <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1.5 ${
                      activeTab === 'editor'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Admin Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1.5 ${
                      activeTab === 'preview'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Student Live Preview</span>
                  </button>
                </div>
              </div>

              {/* CURRICULUM FALLBACK NOTICE IF LIVE AI EXPERIENCED PEAK DEMAND */}
              {fallbackNotice && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{fallbackNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="px-3 py-1 text-[11px] font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-md transition-colors shrink-0 ml-3"
                  >
                    Retry Live AI
                  </button>
                </div>
              )}

              {/* REVIEW VIEW: MCQS */}
              {contentType === 'mcq' && (
                <div className="space-y-4">
                  {activeTab === 'editor' ? (
                    generatedMCQs.map((mcq, idx) => (
                      <div
                        key={mcq.id || idx}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            MCQ #{idx + 1} • 1 Mark
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleRegenerateSingle(idx)}
                              disabled={regeneratingIndex === idx}
                              className="px-2.5 py-1 rounded text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center space-x-1 transition-colors disabled:opacity-50"
                              title="Regenerate this question with AI"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${regeneratingIndex === idx ? 'animate-spin text-blue-400' : ''}`} />
                              <span>Regenerate</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMCQ(idx)}
                              className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                              title="Delete question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Question Inputs (English & Odia) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-400 mb-1">
                              Question (English)
                            </label>
                            <textarea
                              rows={2}
                              value={mcq.question}
                              onChange={(e) => {
                                const list = [...generatedMCQs];
                                list[idx].question = e.target.value;
                                setGeneratedMCQs(list);
                              }}
                              className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-emerald-400 mb-1">
                              Question (ଓଡ଼ିଆ ଅନୁବାଦ)
                            </label>
                            <textarea
                              rows={2}
                              value={mcq.questionOdia || ''}
                              onChange={(e) => {
                                const list = [...generatedMCQs];
                                list[idx].questionOdia = e.target.value;
                                setGeneratedMCQs(list);
                              }}
                              className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-emerald-500 font-sans"
                            />
                          </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-medium text-slate-400">
                            4 Options (Select radio for Correct Answer Key)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mcq.options.map((opt, optIdx) => {
                              const isCorrect = mcq.correctOptionIndex === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  className={`flex items-center space-x-2 p-2 rounded-lg border ${
                                    isCorrect
                                      ? 'bg-emerald-950/30 border-emerald-500/50'
                                      : 'bg-slate-900 border-slate-800'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`correct-opt-${mcq.id}`}
                                    checked={isCorrect}
                                    onChange={() => {
                                      const list = [...generatedMCQs];
                                      list[idx].correctOptionIndex = optIdx;
                                      setGeneratedMCQs(list);
                                    }}
                                    className="accent-emerald-500 cursor-pointer"
                                  />
                                  <span className="text-xs font-bold text-slate-400 w-4">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const list = [...generatedMCQs];
                                      const nextOpts = [...list[idx].options];
                                      nextOpts[optIdx] = e.target.value;
                                      list[idx].options = nextOpts;
                                      setGeneratedMCQs(list);
                                    }}
                                    className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                                  />
                                  {isCorrect && (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                                      CORRECT
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-400 mb-1">
                              Explanation / Reason (English)
                            </label>
                            <input
                              type="text"
                              value={mcq.explanation}
                              onChange={(e) => {
                                const list = [...generatedMCQs];
                                list[idx].explanation = e.target.value;
                                setGeneratedMCQs(list);
                              }}
                              className="w-full px-3 py-1.5 text-xs bg-slate-900 text-slate-300 border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-emerald-400 mb-1">
                              ଓଡ଼ିଆ ସରଳ ବୁଝାମଣା
                            </label>
                            <input
                              type="text"
                              value={mcq.explanationOdia || ''}
                              onChange={(e) => {
                                const list = [...generatedMCQs];
                                list[idx].explanationOdia = e.target.value;
                                setGeneratedMCQs(list);
                              }}
                              className="w-full px-3 py-1.5 text-xs bg-slate-900 text-slate-300 border border-slate-700/70 rounded-lg focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* STUDENT LIVE PREVIEW */
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                      {generatedMCQs.map((mcq, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs font-bold text-blue-400 mr-2">Q{idx + 1}.</span>
                              <span className="text-sm font-semibold text-white">{mcq.question}</span>
                              {mcq.questionOdia && (
                                <p className="text-xs text-emerald-400 mt-1">{mcq.questionOdia}</p>
                              )}
                            </div>
                            <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              1 Mark
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                            {mcq.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className={`p-2.5 rounded-lg text-xs flex items-center space-x-2 ${
                                  mcq.correctOptionIndex === oIdx
                                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-semibold'
                                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className="font-bold text-slate-400">{String.fromCharCode(65 + oIdx)}.</span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>

                          {mcq.explanation && (
                            <div className="mt-2 p-2.5 rounded bg-blue-950/30 border border-blue-900/50 text-xs text-blue-300 space-y-1">
                              <div><strong>Council Answer Explanation:</strong> {mcq.explanation}</div>
                              {mcq.explanationOdia && (
                                <div className="text-emerald-400 font-sans">
                                  <strong>ଓଡ଼ିଆ ବ୍ୟାଖ୍ୟା:</strong> {mcq.explanationOdia}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* REVIEW VIEW: BOARD QUESTIONS (2M, 3M, LONG) */}
              {contentType !== 'mcq' && contentType !== 'notes' && (
                <div className="space-y-4">
                  {activeTab === 'editor' ? (
                    generatedBoardQs.map((bq, idx) => (
                      <div
                        key={bq.id || idx}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {bq.markType} Question #{idx + 1}
                            </span>
                            <span className="text-xs text-slate-400">{bq.yearAppeared}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleRegenerateSingle(idx)}
                              disabled={regeneratingIndex === idx}
                              className="px-2.5 py-1 rounded text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center space-x-1 transition-colors disabled:opacity-50"
                              title="Regenerate this board question"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${regeneratingIndex === idx ? 'animate-spin text-blue-400' : ''}`} />
                              <span>Regenerate</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBoardQ(idx)}
                              className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                              title="Delete question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Question Text in English & Odia */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-400 mb-1">
                              Question (English)
                            </label>
                            <textarea
                              rows={2}
                              value={bq.questionText}
                              onChange={(e) => {
                                const list = [...generatedBoardQs];
                                list[idx].questionText = e.target.value;
                                setGeneratedBoardQs(list);
                              }}
                              className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-emerald-400 mb-1">
                              ପ୍ରଶ୍ନ (ଓଡ଼ିଆ ଅନୁବାଦ)
                            </label>
                            <textarea
                              rows={2}
                              value={bq.questionOdia || ''}
                              onChange={(e) => {
                                const list = [...generatedBoardQs];
                                list[idx].questionOdia = e.target.value;
                                setGeneratedBoardQs(list);
                              }}
                              className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-emerald-500 font-sans"
                            />
                          </div>
                        </div>

                        {/* Model Answers in English & Odia */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-400 mb-1">
                              CHSE Council Solved Model Answer (English)
                            </label>
                            <textarea
                              rows={4}
                              value={bq.answerText}
                              onChange={(e) => {
                                const list = [...generatedBoardQs];
                                list[idx].answerText = e.target.value;
                                setGeneratedBoardQs(list);
                              }}
                              className="w-full px-3 py-2 text-xs bg-slate-900 text-slate-200 border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-emerald-400 mb-1">
                              ଓଡ଼ିଆ ଆଦର୍ଶ ଉତ୍ତର (CHSE ସିଲାବସ ଅନୁସାରେ)
                            </label>
                            <textarea
                              rows={4}
                              value={bq.answerOdia || ''}
                              onChange={(e) => {
                                const list = [...generatedBoardQs];
                                list[idx].answerOdia = e.target.value;
                                setGeneratedBoardQs(list);
                              }}
                              className="w-full px-3 py-2 text-xs bg-slate-900 text-slate-200 border border-slate-700/70 rounded-lg focus:outline-none focus:border-emerald-500 font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* STUDENT LIVE PREVIEW */
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                      {generatedBoardQs.map((bq, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-amber-400">Q{idx + 1}.</span>
                                <span className="text-sm font-semibold text-white">{bq.questionText}</span>
                              </div>
                              {bq.questionOdia && (
                                <p className="text-xs text-emerald-400 mt-1 font-sans">{bq.questionOdia}</p>
                              )}
                            </div>
                            <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                              {bq.markType}
                            </span>
                          </div>

                          <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                              Council Model Answer:
                            </span>
                            <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">{bq.answerText}</p>
                            {bq.answerOdia && (
                              <div className="pt-2 border-t border-slate-800/80">
                                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                                  ଓଡ଼ିଆ ସମାଧାନ:
                                </span>
                                <p className="text-xs text-emerald-200 font-sans whitespace-pre-wrap leading-relaxed mt-1">
                                  {bq.answerOdia}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* REVIEW VIEW: BILINGUAL NOTES */}
              {contentType === 'notes' && generatedNotes && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Chapter Title (English)</label>
                      <input
                        type="text"
                        value={generatedNotes.title}
                        onChange={(e) => setGeneratedNotes({ ...generatedNotes, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-emerald-400 mb-1">ଅଧ୍ୟାୟ ଶୀର୍ଷକ (ଓଡ଼ିଆ)</label>
                      <input
                        type="text"
                        value={generatedNotes.titleOdia || ''}
                        onChange={(e) => setGeneratedNotes({ ...generatedNotes, titleOdia: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700/70 rounded-lg focus:outline-none focus:border-emerald-500 font-sans"
                      />
                    </div>
                  </div>

                  {activeTab === 'editor' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Comprehensive Markdown Study Notes
                        </label>
                        <textarea
                          rows={10}
                          value={generatedNotes.notesMarkdown}
                          onChange={(e) => setGeneratedNotes({ ...generatedNotes, notesMarkdown: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-mono bg-slate-900 text-slate-200 border border-slate-700/70 rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-emerald-400 mb-1">
                          ପରୀକ୍ଷା ଉପଯୋଗୀ ସାରାଂଶ ଓ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପଏଣ୍ଟ (Odia Council Exam Summary)
                        </label>
                        <textarea
                          rows={4}
                          value={generatedNotes.odiaSummary}
                          onChange={(e) => setGeneratedNotes({ ...generatedNotes, odiaSummary: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-sans bg-slate-900 text-slate-200 border border-slate-700/70 rounded-lg focus:outline-none focus:border-emerald-500 leading-relaxed"
                        />
                      </div>
                    </div>
                  ) : (
                    /* STUDENT LIVE PREVIEW FOR NOTES */
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="border-b border-slate-800 pb-2">
                        <h3 className="text-base font-bold text-white">{generatedNotes.title}</h3>
                        {generatedNotes.titleOdia && (
                          <p className="text-xs text-emerald-400 font-sans mt-0.5">{generatedNotes.titleOdia}</p>
                        )}
                      </div>

                      <div className="prose prose-invert max-w-none text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                        {generatedNotes.notesMarkdown}
                      </div>

                      {generatedNotes.odiaSummary && (
                        <div className="mt-4 p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                          <h4 className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wide">
                            ଓଡ଼ିଆ ସାରାଂଶ (Board Exam High-Yield Points):
                          </h4>
                          <p className="text-xs text-emerald-100 font-sans leading-relaxed whitespace-pre-wrap">
                            {generatedNotes.odiaSummary}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SAVE TO CHAPTER & SUPABASE ACTION BAR */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Target Chapter: <strong className="text-white">{chapterTitle}</strong> ({stream} • {subject})
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToDatabase}
                    disabled={isSaving || !hasGeneratedData}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Approved Content to Chapter & Supabase</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
