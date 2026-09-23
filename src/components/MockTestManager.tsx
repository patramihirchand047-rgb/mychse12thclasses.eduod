import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Trophy,
  Award,
  Clock,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  BarChart2,
  Share2,
  Eye,
  FileText,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { MockTest, StreamType } from '../types';
import { AIGeneratorModal } from './modals/AIGeneratorModal';

interface MockTestManagerProps {
  onOpenCreateTest: () => void;
  onViewRankings: (test: MockTest) => void;
}

export const MockTestManager: React.FC<MockTestManagerProps> = ({
  onOpenCreateTest,
  onViewRankings,
}) => {
  const { mockTests, toggleMockTestPublish, publishTestResults, rankings } = useAdminData();
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const filteredTests = mockTests.filter(
    (t) => selectedStream === 'All' || t.stream === selectedStream
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Question Bank & Mock Test Manager</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
              CHSE Blueprint Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard examination blueprints for Odisha 12th Board: Group A (1-Mark MCQs), Group B (2 & 3-Mark Short Answers), and Group C (7-Mark Long Model Questions).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAIGenerator(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>Generate with AI</span>
          </button>
          <button
            onClick={onOpenCreateTest}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Mock Test
          </button>
        </div>
      </div>

      {/* Blueprint Guide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Official CHSE Odisha Higher Secondary Blueprint Structure
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-850 border border-slate-800 rounded-xl">
            <div className="font-bold text-amber-400 flex items-center justify-between">
              <span>Group A: Objective & MCQs</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded">1 Mark Each</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              20 to 30 multiple choice questions, one-word definitions, and fill-in-the-blanks covering fundamental concepts.
            </p>
          </div>

          <div className="p-3 bg-slate-850 border border-slate-800 rounded-xl">
            <div className="font-bold text-sky-400 flex items-center justify-between">
              <span>Group B: Short Answer</span>
              <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.2 rounded">2 & 3 Marks</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Scientific definitions, distinguishing between terms, mathematical derivations, and 50-word concise explanations.
            </p>
          </div>

          <div className="p-3 bg-slate-850 border border-slate-800 rounded-xl">
            <div className="font-bold text-emerald-400 flex items-center justify-between">
              <span>Group C: Long Questions</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded">7 Marks Each</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Comprehensive derivations, chemical mechanisms, accounting balance sheets, and essay questions with internal choices.
            </p>
          </div>
        </div>
      </div>

      {/* Stream Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold mr-1">Filter Stream:</span>
        {['All', 'Science', 'Arts', 'Commerce'].map((str) => (
          <button
            key={str}
            onClick={() => setSelectedStream(str)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedStream === str
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            {str}
          </button>
        ))}
      </div>

      {/* Mock Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map((test) => {
          const testRankings = rankings.filter((r) => r.testId === test.id);
          const topRanker = testRankings.find((r) => r.rank === 1);

          return (
            <div
              key={test.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        test.stream === 'Science'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800'
                          : test.stream === 'Arts'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}
                    >
                      {test.stream}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {test.subject}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      test.status === 'published'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {test.status === 'published' ? 'LIVE TO STUDENTS' : 'DRAFT IN REVIEW'}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">
                  {test.title}
                </h3>

                <p className="text-[11px] text-slate-400 bg-slate-850 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                  <strong className="text-slate-300 font-semibold">Blueprint:</strong> {test.blueprintPattern}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-800/80 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Marks</span>
                    <strong className="text-white font-bold">{test.totalMarks}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <strong className="text-amber-400 font-bold">{test.durationMinutes} mins</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pass Cutoff</span>
                    <strong className="text-emerald-400 font-bold">{test.passingMarks} Marks</strong>
                  </div>
                </div>

                {/* Top Ranker Pill */}
                {topRanker && (
                  <div className="mb-3 flex items-center justify-between text-xs bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-[10px] text-amber-300 font-semibold block leading-tight">STATE RANK #1</span>
                        <span className="text-xs font-bold text-white">{topRanker.studentName} ({topRanker.score}/{topRanker.totalMarks})</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{topRanker.percentage}%</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <button
                  onClick={() => toggleMockTestPublish(test.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    test.status === 'published'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {test.status === 'published' ? 'Unpublish to Draft' : 'Publish Live'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewRankings(test)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Rankings ({testRankings.length})
                  </button>

                  {!test.resultsPublished && (
                    <button
                      onClick={() => publishTestResults(test.id)}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
                      title="Publish scores and state rank sheet to student portal"
                    >
                      Publish Results
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI GENERATOR MODAL */}
      <AIGeneratorModal
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        initialType="mcq"
        initialStream={selectedStream !== 'All' ? (selectedStream as StreamType) : 'Science'}
      />
    </div>
  );
};
