import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  Filter,
  Eye,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CHSE_PYQ_PAPERS } from '../../data/chseExtData';
import { StreamType, PyqPaper } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';

interface UserPyqSectionProps {
  selectedStream: StreamType;
  onOpenPayment: () => void;
  isUnlocked: boolean;
}

export const UserPyqSection: React.FC<UserPyqSectionProps> = ({
  selectedStream,
  onOpenPayment,
  isUnlocked,
}) => {
  const { pyqPapers } = useAdminData();
  const papersList = pyqPapers && pyqPapers.length > 0 ? pyqPapers : CHSE_PYQ_PAPERS;

  const [filterStream, setFilterStream] = useState<StreamType>(selectedStream);
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterYear, setFilterYear] = useState<string>('All');
  const [expandedPaperId, setExpandedPaperId] = useState<string | null>(null);

  // Available subjects for the stream in PYQs
  const subjects = useMemo(() => {
    const subs = new Set<string>();
    papersList.filter((p) => p.stream === filterStream).forEach((p) => subs.add(p.subject));
    return Array.from(subs);
  }, [filterStream, papersList]);

  // Available years
  const years = [2025, 2024, 2023, 2022, 2021, 2020];

  // Filtered papers
  const filteredPapers = useMemo(() => {
    return papersList.filter((p) => {
      const matchStream = p.stream === filterStream;
      const matchSub = filterSubject === 'All' || p.subject === filterSubject;
      const matchYear = filterYear === 'All' || p.year.toString() === filterYear;
      return matchStream && matchSub && matchYear;
    });
  }, [filterStream, filterSubject, filterYear, papersList]);

  const handleDownload = (paper: PyqPaper) => {
    if (!isUnlocked && paper.year > 2023) {
      onOpenPayment();
      return;
    }
    // Simulate direct download
    alert(`Downloading official CHSE Odisha ${paper.year} ${paper.subject} Question Paper & Solution Key (PDF)...`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-950 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                CHSE Odisha 10-Year Question Bank
              </span>
              <span className="text-xs text-amber-300 font-semibold font-serif">
                ପୂର୍ବ ବର୍ଷ ବୋର୍ଡ ପରୀକ୍ଷା ପ୍ରଶ୍ନପତ୍ର ଓ ସମାଧାନ
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Previous Years Question Papers (2016 – 2025)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real council question papers with official scoring rubrics, 2-mark & 3-mark model answers, and unit-wise marks weightage for Science, Arts & Commerce streams.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-xs">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Council Standard Answers</p>
              <p className="text-slate-400 text-[11px]">85%+ questions repeat in pattern</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Stream Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Stream:</span>
            {(['Science', 'Arts', 'Commerce'] as StreamType[]).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setFilterStream(st);
                  setFilterSubject('All');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterStream === st
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Year Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Year:</span>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Years (2019-2025)</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  {y} Board Exam
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterSubject('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterSubject === 'All'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All Subjects ({filteredPapers.length})
          </button>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setFilterSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterSubject === sub
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPapers.map((paper) => {
          const isExpanded = expandedPaperId === paper.id;
          const isPaperLocked = !isUnlocked && paper.year > 2023;

          return (
            <div
              key={paper.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {paper.year} AHSE Board
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {paper.duration} • {paper.totalMarks} Marks
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-1">
                      {paper.subject}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      paper.hasSolutions
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {paper.hasSolutions ? 'Solved + Marking Key' : 'Question Only'}
                  </span>
                </div>

                {/* Pattern info */}
                <p className="text-xs text-blue-200/90 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-slate-400 block text-[10px] uppercase">
                    Council Blueprint Pattern:
                  </span>
                  {paper.questionPattern}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {paper.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>

                {/* Expandable Key Topics */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800 space-y-2 animate-fadeIn">
                    <p className="text-xs font-bold text-amber-400">
                      Frequently Repeated Topics in This Paper:
                    </p>
                    <ul className="grid grid-cols-2 gap-1 text-xs text-slate-300">
                      {paper.keyTopics.map((kt, idx) => (
                        <li key={idx} className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{kt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setExpandedPaperId(isExpanded ? null : paper.id)}
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <span>{isExpanded ? 'Less Details' : 'Key Topics & Weightage'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(paper)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
                      isPaperLocked
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isPaperLocked ? 'Unlock Pass (From ₹99)' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
