import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, Flame, ArrowRight, RotateCcw, HelpCircle, Trophy } from 'lucide-react';
import { DAILY_PRACTICE_MCQS } from '../../data/chseExtData';

export const UserDailyPracticeWidget: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak] = useState(5); // 5-day active study streak
  const [showLanguage, setShowLanguage] = useState<'english' | 'odia'>('odia');

  const currentQ = DAILY_PRACTICE_MCQS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.correctOptionIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < DAILY_PRACTICE_MCQS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  };

  const isLast = currentIndex === DAILY_PRACTICE_MCQS.length - 1;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/30">
            <Flame className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-white">Daily Practice Question (DPQ)</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {streak} Day Streak 🔥
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ଦୈନିକ ୫ଟି ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ କାଉନ୍ସିଲ୍ ପରୀକ୍ଷା ପ୍ରଶ୍ନୋତ୍ତର ଅଭ୍ୟାସ
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {/* Language Toggle */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-0.5 flex text-xs font-semibold">
            <button
              onClick={() => setShowLanguage('odia')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                showLanguage === 'odia' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ଓଡ଼ିଆ
            </button>
            <button
              onClick={() => setShowLanguage('english')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                showLanguage === 'english' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            Q {currentIndex + 1} / {DAILY_PRACTICE_MCQS.length} • Score: <span className="text-emerald-400 font-bold">{score}</span>
          </div>
        </div>
      </div>

      {/* Question Body */}
      <div className="mt-4 space-y-4">
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
            Question #{currentIndex + 1}
          </p>
          <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {showLanguage === 'odia' && currentQ.questionOdia
              ? currentQ.questionOdia
              : currentQ.question}
          </p>
          {showLanguage === 'odia' && currentQ.question && (
            <p className="text-xs text-slate-400 mt-1 italic">
              EN: {currentQ.question}
            </p>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentQ.options.map((opt, optIdx) => {
            const optOdia = currentQ.optionsOdia?.[optIdx];
            const isCorrect = optIdx === currentQ.correctOptionIndex;
            const isChosen = optIdx === selectedOption;

            let btnStyle = 'bg-slate-950/90 border-slate-800 hover:border-blue-500/50 text-slate-200';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-500/10';
              } else if (isChosen) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-100 shadow-md shadow-rose-500/10';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${btnStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isAnswered && isCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : isAnswered && isChosen
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                  <div>{showLanguage === 'odia' && optOdia ? optOdia : opt}</div>
                  {showLanguage === 'odia' && optOdia && (
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{opt}</div>
                  )}
                </div>
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 self-center" />
                )}
                {isAnswered && isChosen && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 self-center" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-500/40 text-xs sm:text-sm space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 font-bold text-blue-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {selectedOption === currentQ.correctOptionIndex
                  ? 'ସଠିକ୍ ଉତ୍ତର! (Correct Answer)'
                  : 'ଭୁଲ୍ ଉତ୍ତର - ବ୍ୟାଖ୍ୟା ଦେଖନ୍ତୁ (Explanation)'}
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-serif">
              {showLanguage === 'odia' && currentQ.explanationOdia
                ? currentQ.explanationOdia
                : currentQ.explanation}
            </p>
            {showLanguage === 'odia' && (
              <p className="text-[11px] text-slate-400 border-t border-blue-900/60 pt-1.5">
                EN: {currentQ.explanation}
              </p>
            )}

            {/* Next or Finish Button */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              {!isLast ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>ପରବର୍ତ୍ତୀ ପ୍ରଶ୍ନ (Next Question)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-amber-300 font-bold flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>ସମସ୍ତ ୫ଟି ପ୍ରଶ୍ନ ସମ୍ପୂର୍ଣ୍ଣ! Score: {score}/5</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>ପୁନର୍ବାର ଅଭ୍ୟାସ (Restart)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
