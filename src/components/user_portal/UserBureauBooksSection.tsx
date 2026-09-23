import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  FileText,
  Sparkles,
  Award,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { CHSE_BUREAU_BOOKS } from '../../data/chseExtData';
import { StreamType, BureauBook } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';

interface UserBureauBooksSectionProps {
  selectedStream: StreamType;
  onOpenPayment: () => void;
  isUnlocked: boolean;
}

export const UserBureauBooksSection: React.FC<UserBureauBooksSectionProps> = ({
  selectedStream,
  onOpenPayment,
  isUnlocked,
}) => {
  const { bureauBooks } = useAdminData();
  const booksList = bureauBooks && bureauBooks.length > 0 ? bureauBooks : CHSE_BUREAU_BOOKS;

  const [filterStream, setFilterStream] = useState<StreamType>(selectedStream);

  const books = booksList.filter(
    (b) => b.stream === filterStream || (b.stream === 'Science' && ['MIL (Odia)'].includes(b.subject))
  );

  const handleDownloadBook = (book: BureauBook) => {
    alert(`Downloading ${book.title} (Official Bureau Textbook PDF)...`);
  };

  const handleDownloadFormula = (book: BureauBook) => {
    alert(`Downloading ${book.subject} Quick Revision Formula Sheet & Named Reactions (PDF)...`);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Odisha State Bureau Official Textbooks
              </span>
              <span className="text-xs text-amber-300 font-semibold font-serif">
                ସରକାରୀ ପାଠ୍ୟପୁସ୍ତକ ଓ ସୂତ୍ରାବଳୀ (Formula Hub)
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Bureau's Higher Secondary Textbooks & Formula Cheatsheets
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official textbook PDFs authorized by the Department of School and Mass Education, Government of Odisha, complete with solved end-chapter exercises and high-yield formula sheets.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-xs shrink-0">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-bold text-white">100% Board Aligned</p>
              <p className="text-slate-400 text-[11px]">Strictly as per CHSE syllabus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 w-fit">
        {(['Science', 'Arts', 'Commerce'] as StreamType[]).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStream(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStream === st
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {st} Stream Books
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {books.map((b) => (
          <div
            key={b.id}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Top tag */}
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {b.subject}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {b.chaptersCount} Chapters • {b.pageCount} Pages
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs text-amber-300 font-serif mt-0.5">
                  {b.titleOdia}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Volume:</span>
                  <span className="font-semibold text-slate-200">{b.volume}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Publisher:</span>
                  <span className="font-semibold text-slate-200 truncate max-w-[150px]">
                    {b.publisher}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400 font-medium pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Includes Solved Bureau Exercises</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => handleDownloadBook(b)}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Bureau Book PDF</span>
              </button>

              {b.formulaSheetUrl && (
                <button
                  onClick={() => handleDownloadFormula(b)}
                  className="w-full py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Formula / Revision Sheet</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
