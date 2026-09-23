import React from 'react';
import {
  Trophy,
  Award,
  Download,
  Share2,
  CheckCircle2,
  School,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { MockTest } from '../../types';

interface RankingsModalProps {
  test: MockTest | null;
  onClose: () => void;
}

export const RankingsModal: React.FC<RankingsModalProps> = ({ test, onClose }) => {
  const { rankings, publishTestResults } = useAdminData();

  if (!test) return null;

  const testRankings = rankings
    .filter((r) => r.testId === test.id)
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-850 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">All-Odisha Mock Test State Rankings</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  test.stream === 'Science'
                    ? 'bg-sky-950 text-sky-300'
                    : test.stream === 'Arts'
                    ? 'bg-emerald-950 text-emerald-300'
                    : 'bg-purple-950 text-purple-300'
                }`}>
                  {test.stream}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {test.title} • Max Marks: {test.totalMarks}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Results Status Banner */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">Live Status:</span>
            {test.resultsPublished ? (
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Published to Student Portals
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                Draft / Unreleased
              </span>
            )}
          </div>

          {!test.resultsPublished && (
            <button
              onClick={() => publishTestResults(test.id)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow transition-colors"
            >
              Publish Results Now
            </button>
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="mt-4 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th scope="col" className="px-4 py-2.5">State Rank</th>
                <th scope="col" className="px-4 py-2.5">Student & Reg No</th>
                <th scope="col" className="px-4 py-2.5">College</th>
                <th scope="col" className="px-4 py-2.5 text-right">Score & %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {testRankings.length > 0 ? (
                testRankings.map((rnk) => (
                  <tr key={rnk.id} className="hover:bg-slate-850/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 font-bold">
                        {rnk.rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow">
                            1
                          </span>
                        ) : rnk.rank === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black text-xs">
                            2
                          </span>
                        ) : rnk.rank === 3 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-xs">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono ml-2">#{rnk.rank}</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{rnk.studentName}</div>
                      <div className="text-[11px] font-mono text-amber-400">{rnk.studentRegNo}</div>
                    </td>

                    <td className="px-4 py-3 text-slate-300 truncate max-w-xs text-[11px]">
                      {rnk.college}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="font-extrabold text-sm text-emerald-400">
                        {rnk.score} / {rnk.totalMarks}
                      </div>
                      <div className="text-[10px] text-slate-400">{rnk.percentage}%</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No submitted papers recorded yet for this mock test.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
