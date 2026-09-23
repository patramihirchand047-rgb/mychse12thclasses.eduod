import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Layers,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { StreamType } from '../../types';
import { STREAM_SUBJECTS } from '../../data/mockData';
import { AIGeneratorModal } from './AIGeneratorModal';

interface CreateMockTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMockTestModal: React.FC<CreateMockTestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addMockTest } = useAdminData();

  const [stream, setStream] = useState<StreamType>('Science');
  const subjects = STREAM_SUBJECTS[stream] || [];
  const [subject, setSubject] = useState(subjects[0] || 'Physics');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [totalMarks, setTotalMarks] = useState(70);
  const [passingMarks, setPassingMarks] = useState(24);
  const [blueprintPattern, setBlueprintPattern] = useState(
    'CHSE Odisha Standard 70-Mark Pattern: Group A (20 MCQs/1M), Group B (10 Short/2-3M), Group C (3 Long/7M)'
  );
  const [scheduledDate, setScheduledDate] = useState('2026-03-05');
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMockTest({
      title: title.trim(),
      stream,
      subject,
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
      passingMarks: Number(passingMarks),
      blueprintPattern: blueprintPattern.trim(),
      status: publishImmediately ? 'published' : 'draft',
      questionsCount: totalMarks === 70 ? 33 : 45,
      scheduledDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-850 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create CHSE Blueprint Mock Test</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Odisha Higher Secondary blueprint with objective and descriptive groups
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Stream</label>
              <select
                value={stream}
                onChange={(e) => {
                  const s = e.target.value as StreamType;
                  setStream(s);
                  setSubject(STREAM_SUBJECTS[s][0]);
                  if (s === 'Arts' || s === 'Commerce') {
                    setTotalMarks(100);
                    setPassingMarks(33);
                    setBlueprintPattern('CHSE Odisha 100-Mark Pattern: Group A (30 MCQs/1M), Group B (14 Short/2-3M), Group C (4 Long/7M)');
                  } else {
                    setTotalMarks(70);
                    setPassingMarks(24);
                    setBlueprintPattern('CHSE Odisha Standard 70-Mark Pattern: Group A (20 MCQs/1M), Group B (10 Short/2-3M), Group C (3 Long/7M)');
                  }
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Science">Science Stream</option>
                <option value="Arts">Arts Stream</option>
                <option value="Commerce">Commerce Stream</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mock Test Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CHSE 2026 All-Odisha Grand Pre-Board: Mathematics"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Total Marks</label>
              <input
                type="number"
                min={10}
                max={100}
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Passing Marks</label>
              <input
                type="number"
                min={5}
                max={50}
                value={passingMarks}
                onChange={(e) => setPassingMarks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Duration (mins)</label>
              <input
                type="number"
                min={15}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">CHSE Blueprint Pattern Formula</label>
            <input
              type="text"
              required
              value={blueprintPattern}
              onChange={(e) => setBlueprintPattern(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Scheduled Examination Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-900 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
              />
              <span className="text-slate-200 font-semibold text-xs">
                Publish immediately to student test dashboard
              </span>
            </label>
          </div>

          <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300">Need AI to generate Questions for this Test?</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAIGenerator(true)}
              className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <span>Generate with AI</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create & Setup Blueprint
            </button>
          </div>
        </form>

        <AIGeneratorModal
          isOpen={showAIGenerator}
          onClose={() => setShowAIGenerator(false)}
          initialStream={stream}
          initialSubject={subject}
          initialChapterTitle={title || 'Mock Test Questions'}
          initialType="mcq"
        />
      </div>
    </div>
  );
};
