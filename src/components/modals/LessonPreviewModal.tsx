import React from 'react';
import {
  Video,
  FileText,
  ExternalLink,
  Lock,
  Unlock,
  User,
} from 'lucide-react';
import { Lesson } from '../../types';

interface LessonPreviewModalProps {
  lesson: Lesson | null;
  onClose: () => void;
}

export const LessonPreviewModal: React.FC<LessonPreviewModalProps> = ({
  lesson,
  onClose,
}) => {
  if (!lesson) return null;

  // Extract youtube video ID if youtube URL
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const id = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=0`;
      } else if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=0`;
      }
    } catch (e) {
      // fallback
    }
    return url;
  };

  const isYouTube = lesson.videoType === 'youtube' || lesson.videoUrl.includes('youtube') || lesson.videoUrl.includes('youtu.be');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-850 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  lesson.stream === 'Science'
                    ? 'bg-sky-950 text-sky-300'
                    : lesson.stream === 'Arts'
                    ? 'bg-emerald-950 text-emerald-300'
                    : 'bg-purple-950 text-purple-300'
                }`}>
                  {lesson.stream}
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {lesson.subject} • Ch {lesson.chapterNo}: {lesson.chapterTitle}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{lesson.lessonTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Video Player Box */}
        <div className="mt-4 aspect-video bg-black rounded-xl overflow-hidden border border-slate-750 flex items-center justify-center relative">
          {isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(lesson.videoUrl)}
              title={lesson.lessonTitle}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="p-6 text-center text-slate-400 space-y-2">
              <Video className="w-12 h-12 mx-auto text-amber-400 opacity-60" />
              <p className="text-xs font-medium text-slate-300">Custom Stream: {lesson.videoUrl}</p>
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline"
              >
                Open Stream Source <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Metadata & Study Materials */}
        <div className="mt-4 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-800 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-semibold">{lesson.instructor}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{lesson.duration}</span>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
              lesson.isFreePreview
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {lesson.isFreePreview ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {lesson.isFreePreview ? 'Free Preview Lesson' : 'Course Access Required'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {lesson.odiaNotesUrl ? (
              <a
                href={lesson.odiaNotesUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-bold text-white">ଓଡ଼ିଆ ମାଧ୍ୟମ ନୋଟ୍ସ (Odia Notes)</div>
                    <div className="text-[10px] text-slate-400">PDF Document • Chapter {lesson.chapterNo}</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            ) : (
              <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-slate-500 text-[11px] flex items-center gap-2">
                <FileText className="w-4 h-4" /> Odia Notes not attached
              </div>
            )}

            {lesson.englishNotesUrl ? (
              <a
                href={lesson.englishNotesUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="font-bold text-white">English Medium Notes (CBSE/CHSE)</div>
                    <div className="text-[10px] text-slate-400">PDF Document • Chapter {lesson.chapterNo}</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            ) : (
              <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-slate-500 text-[11px] flex items-center gap-2">
                <FileText className="w-4 h-4" /> English Notes not attached
              </div>
            )}
          </div>
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
