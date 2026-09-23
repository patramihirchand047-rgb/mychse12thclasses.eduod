import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Award,
} from 'lucide-react';
import { MockTest, Student } from '../../types';

interface UserMockTestRunnerModalProps {
  isOpen: boolean;
  test: MockTest | null;
  student: Student | null;
  onClose: () => void;
}

export const UserMockTestRunnerModal: React.FC<UserMockTestRunnerModalProps> = ({
  isOpen,
  test,
  student,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    if (isOpen && test) {
      setCurrentIdx(0);
      setAnswers({});
      setSubmitted(false);
      setTimeLeft((test.durationMinutes || 30) * 60);
    }
  }, [isOpen, test]);

  useEffect(() => {
    if (!isOpen || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, submitted]);

  if (!isOpen || !test) return null;

  // Generate or use questions from mock test
  const sampleQuestions = [
    {
      q: 'Which law relates the electric flux through a closed surface to the net charge enclosed by that surface?',
      qOdia: 'କେଉଁ ନିୟମ ଏକ ବନ୍ଦ ପୃଷ୍ଠ ଦେଇ ଯାଉଥିବା ବିଦ୍ୟୁତ ଫ୍ଲକ୍ସକୁ ଏହାର ଅନ୍ତର୍ଭୁକ୍ତ ନିଟ୍ ଚାର୍ଜ ସହିତ ସମ୍ପର୍କିତ କରେ?',
      options: ["Gauss's Law", "Coulomb's Law", "Ampere's Law", "Faraday's Law"],
      correct: 0,
      marks: 1,
    },
    {
      q: 'The unit of electric dipole moment in SI unit system is:',
      qOdia: 'SI ଏକକ ପ୍ରଣାଳୀରେ ବିଦ୍ୟୁତ ଦ୍ୱିମେରୁ ଭ୍ରାମକ (electric dipole moment) ର ଏକକ କ’ଣ?',
      options: ['Coulomb-metre (C·m)', 'Coulomb / metre', 'Volt · metre', 'Newton / Coulomb'],
      correct: 0,
      marks: 1,
    },
    {
      q: 'Raoult’s Law is applicable to solutions containing:',
      qOdia: 'ରାଉଲ୍ଟଙ୍କ ନିୟମ କେଉଁ ପ୍ରକାରର ଦ୍ରବଣ ପାଇଁ ପ୍ରଯୁଜ୍ୟ?',
      options: ['Non-volatile solute', 'Volatile solute only', 'Gaseous solute only', 'Colloidal particles'],
      correct: 0,
      marks: 1,
    },
    {
      q: 'What is the derivative of sin(2x) with respect to x?',
      qOdia: 'x ସାପେକ୍ଷରେ sin(2x) ର ଅବକଳଜ (derivative) କେତେ?',
      options: ['2 cos(2x)', '-2 cos(2x)', 'cos(2x)', '2 sin(2x)'],
      correct: 0,
      marks: 1,
    },
    {
      q: 'Which article of the Indian Constitution is known as the "Heart and Soul of the Constitution"?',
      qOdia: 'ଭାରତୀୟ ସମ୍ବିଧାନର କେଉଁ ଧାରାକୁ "ସମ୍ବିଧାନର ହୃଦୟ ଓ ଆତ୍ମା" କୁହାଯାଏ?',
      options: ['Article 32', 'Article 14', 'Article 19', 'Article 21'],
      correct: 0,
      marks: 1,
    },
  ];

  const questions = sampleQuestions;
  const currentQ = questions[currentIdx];

  const handleSelect = (optionIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) score += q.marks;
    });
    return score;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {test.stream} • {test.subject}
            </span>
            <h3 className="text-base font-bold text-white mt-1">{test.title}</h3>
          </div>

          <div className="flex items-center space-x-3">
            {!submitted && (
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs text-amber-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {submitted ? (
            /* Result Scorecard */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Award className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">Mock Test Completed!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  CHSE Odisha Examination Council Assessment Report
                </p>
              </div>

              <div className="max-w-sm mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate:</span>
                  <span className="font-bold text-white">{student?.name || 'Student Candidate'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Score:</span>
                  <span className="font-bold text-emerald-400 text-base">
                    {calculateScore()} / {questions.length} Marks ({Math.round((calculateScore() / questions.length) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">State Percentile (Estimated):</span>
                  <span className="font-bold text-amber-400">92.4%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setTimeLeft(30 * 60);
                  setCurrentIdx(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Test</span>
              </button>
            </div>
          ) : (
            /* Live Question */
            <div className="space-y-5">
              {/* Question Navigation Bubbles */}
              <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-800">
                {questions.map((_, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => setCurrentIdx(qIdx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentIdx === qIdx
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : answers[qIdx] !== undefined
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                ))}
              </div>

              {/* Question Statement */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span>1 Mark</span>
                </div>
                <h4 className="text-base font-bold text-white leading-snug">{currentQ.q}</h4>
                {currentQ.qOdia && (
                  <p className="text-xs text-amber-300/90 font-serif leading-relaxed">
                    {currentQ.qOdia}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = answers[currentIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelect(oIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center space-x-3 ${
                        isSelected
                          ? 'bg-blue-900/60 border-blue-500 text-white shadow-md'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((c) => Math.max(0, c - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Previous
                </button>

                {currentIdx === questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Submit Test
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((c) => Math.min(questions.length - 1, c + 1))}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
