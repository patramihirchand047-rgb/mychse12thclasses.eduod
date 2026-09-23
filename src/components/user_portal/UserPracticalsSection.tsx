import React, { useState } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen,
} from 'lucide-react';
import { CHSE_PRACTICALS } from '../../data/chseExtData';
import { PracticalLabItem } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';

export const UserPracticalsSection: React.FC = () => {
  const { practicals } = useAdminData();
  const labsList = practicals && practicals.length > 0 ? practicals : CHSE_PRACTICALS;

  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physics' | 'Chemistry' | 'Biology'>('All');
  const [expandedLabId, setExpandedLabId] = useState<string | null>(labsList[0]?.id || null);
  const [showVivaOdia, setShowVivaOdia] = useState<boolean>(true);

  const filtered = labsList.filter(
    (item) => selectedSubject === 'All' || item.subject === selectedSubject
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                CHSE Odisha 30-Marks Practical Exam Guide
              </span>
              <span className="text-xs text-amber-300 font-semibold font-serif">
                ପ୍ରାକ୍ଟିକାଲ୍ ରେକର୍ଡ ଓ ଭାଇଭା (Viva-Voce)
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Practical Lab Manuals & External Examiner Viva Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Complete laboratory experiments, apparatus list, standard calculation formulas, precautions, and high-frequency External Examiner Viva questions with Odia explanations to score 30/30.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-xs">
            <FlaskConical className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Full 30 Marks Blueprint</p>
              <p className="text-slate-400 text-[11px]">Experiment + Record + Viva</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Viva Language Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Subject Filters */}
        <div className="flex items-center space-x-2">
          {(['All', 'Physics', 'Chemistry', 'Biology'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSubject === sub
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {sub === 'All' ? 'All Practical Subjects' : `${sub} Lab`}
            </button>
          ))}
        </div>

        {/* Viva Language Toggle */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Viva Answers:</span>
          <button
            onClick={() => setShowVivaOdia(!showVivaOdia)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
              showVivaOdia
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {showVivaOdia ? '🇮🇳 Odia + English (ଦ୍ୱିଭାଷୀ)' : 'English Only'}
          </button>
        </div>
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        {filtered.map((lab) => {
          const isExpanded = expandedLabId === lab.id;

          return (
            <div
              key={lab.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md transition-all"
            >
              {/* Header clickable */}
              <div
                onClick={() => setExpandedLabId(isExpanded ? null : lab.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-extrabold text-sm shrink-0">
                    #{lab.experimentNo}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                        {lab.subject} Practical
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      {lab.title}
                    </h3>
                    {lab.titleOdia && (
                      <p className="text-xs text-amber-300 font-serif mt-0.5">
                        {lab.titleOdia}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
                    {lab.vivaQuestions.length} Viva Qs
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800 space-y-5 animate-fadeIn">
                  {/* Apparatus & Principle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5">
                      <p className="text-xs font-bold text-purple-400 uppercase">
                        Required Apparatus / ଯନ୍ତ୍ରପାତି:
                      </p>
                      <p className="text-xs text-slate-200 leading-relaxed font-mono">
                        {lab.apparatus}
                      </p>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5">
                      <p className="text-xs font-bold text-emerald-400 uppercase">
                        Working Principle & Formula:
                      </p>
                      <p className="text-xs text-slate-200 leading-relaxed font-mono">
                        {lab.principleFormula}
                      </p>
                    </div>
                  </div>

                  {/* Step-by-Step Procedure */}
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Laboratory Procedure (କାର୍ଯ୍ୟପଦ୍ଧତି):
                    </p>
                    <ol className="space-y-1.5 text-xs text-slate-300">
                      {lab.procedureSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Precautions */}
                  <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-1.5">
                    <p className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Key Precautions (ସତର୍କତା):</span>
                    </p>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {lab.precautions.map((p, pIdx) => (
                        <li key={pIdx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* High-Yield External Viva Questions */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-extrabold text-white">
                        External Examiner Viva-Voce Questions (ମୌଖିକ ପ୍ରଶ୍ନୋତ୍ତର)
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {lab.vivaQuestions.map((v, vIdx) => (
                        <div
                          key={vIdx}
                          className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-2"
                        >
                          <div className="flex items-start space-x-2">
                            <span className="w-5 h-5 rounded-md bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              Q{vIdx + 1}
                            </span>
                            <div className="text-xs font-semibold text-white">
                              <p>{v.question}</p>
                              {showVivaOdia && v.questionOdia && (
                                <p className="text-amber-300 font-serif font-normal mt-0.5">
                                  {v.questionOdia}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="pl-7 text-xs text-slate-300 border-l-2 border-purple-500/40 ml-2.5">
                            <p className="font-medium text-emerald-300">
                              Ans: {v.answer}
                            </p>
                            {showVivaOdia && v.answerOdia && (
                              <p className="text-slate-300 font-serif mt-1">
                                {v.answerOdia}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
