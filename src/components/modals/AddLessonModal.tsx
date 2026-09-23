import React, { useState } from 'react';
import {
  Video,
  FileText,
  Lock,
  Unlock,
  Plus,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { StreamType } from '../../types';
import { STREAM_SUBJECTS } from '../../data/mockData';

interface AddLessonModalProps {
  isOpen: boolean;
  defaultStream?: StreamType;
  defaultSubject?: string;
  onClose: () => void;
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  isOpen,
  defaultStream = 'Science',
  defaultSubject,
  onClose,
}) => {
  const { addLesson } = useAdminData();

  const [stream, setStream] = useState<StreamType>(defaultStream);
  const subjects = STREAM_SUBJECTS[stream] || [];
  const [subject, setSubject] = useState(defaultSubject || subjects[0] || 'Physics');
  const [chapterNo, setChapterNo] = useState(1);
  const [chapterTitle, setChapterTitle] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [duration, setDuration] = useState('45 mins');
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'stream'>('youtube');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [odiaNotesUrl, setOdiaNotesUrl] = useState('');
  const [englishNotesUrl, setEnglishNotesUrl] = useState('');
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [instructor, setInstructor] = useState('Prof. CHSE Senior Faculty');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !chapterTitle.trim()) return;

    addLesson({
      stream,
      subject,
      chapterNo: Number(chapterNo),
      chapterTitle: chapterTitle.trim(),
      lessonTitle: lessonTitle.trim(),
      duration: duration.trim() || '45 mins',
      videoType,
      videoUrl: videoUrl.trim(),
      odiaNotesUrl: odiaNotesUrl.trim() || undefined,
      englishNotesUrl: englishNotesUrl.trim() || undefined,
      isFreePreview,
      instructor: instructor.trim(),
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
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Video Lecture & Notes</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Embed lectures with Odia & English PDF study materials
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

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-slate-300 font-semibold mb-1">Chapter No.</label>
              <input
                type="number"
                min={1}
                max={30}
                required
                value={chapterNo}
                onChange={(e) => setChapterNo(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Chapter Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="e.g. Electromagnetic Waves"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Lesson / Topic Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="e.g. Displacement Current & Maxwell's Equations"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Video Platform</label>
              <select
                value={videoType}
                onChange={(e) => setVideoType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="youtube">YouTube Embed</option>
                <option value="vimeo">Vimeo Player</option>
                <option value="stream">Direct MP4 / CDN Stream</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 48 mins"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Video Lecture Embed / Stream URL</label>
            <input
              type="text"
              required
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Odia PDF Notes URL</label>
              <input
                type="text"
                value={odiaNotesUrl}
                onChange={(e) => setOdiaNotesUrl(e.target.value)}
                placeholder="https://chse.gov.in/odia-notes.pdf"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">English PDF Notes URL</label>
              <input
                type="text"
                value={englishNotesUrl}
                onChange={(e) => setEnglishNotesUrl(e.target.value)}
                placeholder="https://chse.gov.in/eng-notes.pdf"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Instructor / Faculty Name</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Radhakanta Mishra"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-900 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                checked={isFreePreview}
                onChange={(e) => setIsFreePreview(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
              />
              <span className="text-slate-200 font-semibold text-xs">
                Mark as Free Preview (Accessible to all registered students)
              </span>
            </label>
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
              Publish Lecture & Notes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
