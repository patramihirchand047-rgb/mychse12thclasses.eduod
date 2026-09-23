import React, { useState } from 'react';
import {
  X,
  Play,
  BookOpen,
  FileQuestion,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Printer,
  ChevronRight,
  Clock,
  Unlock,
  Lock,
} from 'lucide-react';
import { ChapterItem, MCQItem, BoardQuestion } from '../../types';

interface UserChapterDetailModalProps {
  isOpen: boolean;
  chapter: ChapterItem | null;
  mcqs: MCQItem[];
  boardQuestions: BoardQuestion[];
  isUnlocked: boolean;
  onClose: () => void;
  onOpenPayment: () => void;
}

export const UserChapterDetailModal: React.FC<UserChapterDetailModalProps> = ({
  isOpen,
  chapter,
  mcqs,
  boardQuestions,
  isUnlocked,
  onClose,
  onOpenPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'mcq' | 'board'>('video');

  // MCQ Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  if (!isOpen || !chapter) return null;

  const handleSelectOption = (mcqId: string, optionIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [mcqId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((m) => {
      if (selectedAnswers[m.id] === m.correctOptionIndex) {
        score++;
      }
    });
    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  const videoEmbedUrl = chapter.videoUrl
    ? chapter.videoUrl.includes('embed')
      ? chapter.videoUrl
      : chapter.videoUrl.includes('v=')
      ? `https://www.youtube.com/embed/${chapter.videoUrl.split('v=')[1]?.split('&')[0]}`
      : chapter.videoUrl.includes('youtu.be/')
      ? `https://www.youtube.com/embed/${chapter.videoUrl.split('youtu.be/')[1]}`
      : 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    : 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Chapter {chapter.chapterNo} • {chapter.subject}
              </span>
              {chapter.isFree ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FREE PREVIEW
                </span>
              ) : isUnlocked ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  UNLOCKED (PRO)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  COURSE PASS REQUIRED
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              {chapter.title}
              {chapter.titleOdia && (
                <span className="text-amber-400 text-sm sm:text-base font-medium ml-2 font-serif">
                  ({chapter.titleOdia})
                </span>
              )}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('video')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'video'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Video Class (ଭିଡିଓ)</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Notes & Odia Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('mcq')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'mcq'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileQuestion className="w-4 h-4" />
            <span>MCQ Practice ({mcqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'board'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Board Q&A ({boardQuestions.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* If Chapter is locked and student has not unlocked */}
          {!chapter.isFree && !isUnlocked ? (
            <div className="p-8 text-center rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4 my-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-lg">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white">
                  Chapter {chapter.chapterNo} is Locked
                </h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-1.5">
                  Unlock all chapters, video classes, bilingual study notes, and CHSE Odisha model test series with our 2026-27 Course Pass (Arts ₹99 | Science & Commerce ₹149).
                </p>
              </div>
              <button
                onClick={onOpenPayment}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all inline-flex items-center space-x-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock 2026-27 Course Pass (From ₹99)</span>
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: VIDEO */}
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl">
                    <iframe
                      src={videoEmbedUrl}
                      title={chapter.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-white">{chapter.title} - Official Video Class</h5>
                      <p className="text-xs text-slate-400 mt-0.5">CHSE Odisha Council Curriculum • Duration: ~45 mins</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('notes')}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Read Chapter Notes</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: NOTES & ODIA SUMMARY */}
              {activeTab === 'notes' && (
                <div className="space-y-6">
                  {/* Odia Summary Card */}
                  {chapter.odiaSummary && (
                    <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                          ଓଡ଼ିଆ ସାରାଂଶ (Odia Unicode Summary)
                        </h4>
                      </div>
                      <p className="text-sm text-amber-100 leading-relaxed font-serif whitespace-pre-wrap">
                        {chapter.odiaSummary}
                      </p>
                    </div>
                  )}

                  {/* Comprehensive English Notes */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span>Chapter Syllabus Notes & Key Concepts</span>
                      </h4>
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Print Notes</span>
                      </button>
                    </div>
                    <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {chapter.notesMarkdown || 'Detailed notes and formulas for this chapter are available in the lecture.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MCQ PRACTICE */}
              {activeTab === 'mcq' && (
                <div className="space-y-5">
                  {mcqs.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800">
                      <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No MCQs added for this chapter yet.</p>
                    </div>
                  ) : (
                    <>
                      {/* Score Banner if submitted */}
                      {submittedQuiz && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/40 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Test Completed</span>
                            <h4 className="text-xl font-black text-white">
                              Score: {calculateScore()} / {mcqs.length} (
                              {Math.round((calculateScore() / mcqs.length) * 100)}%)
                            </h4>
                          </div>
                          <button
                            onClick={resetQuiz}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
                          >
                            Retake Quiz
                          </button>
                        </div>
                      )}

                      {/* Question List */}
                      <div className="space-y-4">
                        {mcqs.map((mcq, idx) => {
                          const selected = selectedAnswers[mcq.id];
                          const isCorrect = selected === mcq.correctOptionIndex;

                          return (
                            <div
                              key={mcq.id}
                              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
                                    Q{idx + 1}
                                  </span>
                                  <p className="text-sm font-semibold text-white mt-1">{mcq.question}</p>
                                  {mcq.questionOdia && (
                                    <p className="text-xs text-amber-300/90 font-serif mt-0.5">
                                      {mcq.questionOdia}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Options */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {mcq.options.map((opt, optIdx) => {
                                  const optOdia = mcq.optionsOdia?.[optIdx];
                                  const isSelected = selected === optIdx;
                                  const isThisCorrect = optIdx === mcq.correctOptionIndex;

                                  let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                                  if (submittedQuiz) {
                                    if (isThisCorrect) {
                                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                                    } else if (isSelected && !isThisCorrect) {
                                      btnStyle = 'bg-red-950/60 border-red-500 text-red-200';
                                    }
                                  } else if (isSelected) {
                                    btnStyle = 'bg-blue-900/60 border-blue-500 text-white font-semibold';
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      type="button"
                                      onClick={() => handleSelectOption(mcq.id, optIdx)}
                                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                                    >
                                      <div>
                                        <span>{opt}</span>
                                        {optOdia && (
                                          <span className="block text-[11px] text-amber-300/80 font-serif mt-0.5">
                                            {optOdia}
                                          </span>
                                        )}
                                      </div>
                                      {submittedQuiz && isThisCorrect && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                      )}
                                      {submittedQuiz && isSelected && !isThisCorrect && (
                                        <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanation if submitted */}
                              {submittedQuiz && (mcq.explanation || mcq.explanationOdia) && (
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                                  {mcq.explanation && (
                                    <p>
                                      <strong>Explanation:</strong> {mcq.explanation}
                                    </p>
                                  )}
                                  {mcq.explanationOdia && (
                                    <p className="text-amber-300/90 font-serif">
                                      <strong>ଓଡ଼ିଆ ବ୍ୟାଖ୍ୟା:</strong> {mcq.explanationOdia}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {!submittedQuiz && (
                        <button
                          type="button"
                          onClick={() => setSubmittedQuiz(true)}
                          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all"
                        >
                          Submit Quiz & Check Score
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* TAB 4: BOARD SOLVED QUESTIONS */}
              {activeTab === 'board' && (
                <div className="space-y-4">
                  {boardQuestions.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800">
                      <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No board questions published for this chapter yet.</p>
                    </div>
                  ) : (
                    boardQuestions.map((bq, idx) => (
                      <div
                        key={bq.id || idx}
                        className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {bq.markType} • {bq.yearAppeared || 'CHSE Odisha Board'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Q#{idx + 1}</span>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-white">{bq.questionText}</p>
                          {bq.questionOdia && (
                            <p className="text-xs text-amber-300/90 font-serif mt-1">
                              {bq.questionOdia}
                            </p>
                          )}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                          <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                            Model Answer & Step Solution:
                          </span>
                          <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {bq.answerText}
                          </p>
                          {bq.answerOdia && (
                            <p className="text-amber-200/90 font-serif leading-relaxed pt-2 border-t border-slate-800">
                              {bq.answerOdia}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
