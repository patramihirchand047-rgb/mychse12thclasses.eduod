import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  AlertTriangle,
  Bell,
  Eye,
  FileText,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { StreamType } from '../../types';

interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addAnnouncement } = useAdminData();

  const [title, setTitle] = useState('');
  const [titleOdia, setTitleOdia] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<
    'CHSE Exam Alert' | 'Practical Schedule' | 'Admit Card Update' | 'General Notice' | 'Exam Routine' | 'Live Class' | 'Academic Note' | 'Urgent Notice'
  >('CHSE Exam Alert');
  const [targetStream, setTargetStream] = useState<'All' | StreamType>('All');
  const [isHighPriority, setIsHighPriority] = useState(true);
  const [pdfAttachmentUrl, setPdfAttachmentUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title: title.trim(),
      titleOdia: titleOdia.trim() || undefined,
      content: content.trim(),
      category,
      targetStream,
      isHighPriority,
      active: true,
      pdfAttachmentUrl: pdfAttachmentUrl.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Broadcast Official CHSE Notice</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Odisha students across Science, Arts, and Commerce with bilingual bulletins.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Priority Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="CHSE Exam Alert">CHSE Exam Alert</option>
                <option value="Practical Schedule">Practical Schedule</option>
                <option value="Admit Card Update">Admit Card Update</option>
                <option value="General Notice">General Notice</option>
                <option value="Exam Routine">Exam Routine</option>
                <option value="Live Class">Live Class</option>
                <option value="Academic Note">Academic Note</option>
                <option value="Urgent Notice">Urgent Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Stream Audience</label>
              <select
                value={targetStream}
                onChange={(e) => setTargetStream(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Streams (Science, Arts, Commerce)</option>
                <option value="Science">Science Only (+2 2nd Year)</option>
                <option value="Arts">Arts Only (+2 2nd Year)</option>
                <option value="Commerce">Commerce Only (+2 2nd Year)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Notice Headline (English) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., CHSE 2026 Board Practical Examination Schedule Out"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Headline in Odia Script (ଓଡ଼ିଆ ବିଜ୍ଞପ୍ତି)
            </label>
            <input
              type="text"
              value={titleOdia}
              onChange={(e) => setTitleOdia(e.target.value)}
              placeholder="e.g., CHSE ୨୦୨୬ ବୋର୍ଡ଼ ପ୍ରାକ୍ଟିକାଲ୍ ପରୀକ୍ଷା ସୂଚୀ ପ୍ରକାଶିତ"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Detailed Notice Body <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide exact guidelines, timings, lab reporting requirements, and zero-OTP registration advisories..."
              rows={3}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Official PDF Circular URL (Optional)
            </label>
            <input
              type="text"
              value={pdfAttachmentUrl}
              onChange={(e) => setPdfAttachmentUrl(e.target.value)}
              placeholder="https://chseodisha.nic.in/pdf/circular-2026.pdf"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-950 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                checked={isHighPriority}
                onChange={(e) => setIsHighPriority(e.target.checked)}
                className="rounded text-rose-500 focus:ring-rose-500 bg-slate-800 border-slate-700 cursor-pointer"
              />
              <span className="text-slate-200 font-semibold text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Mark as High Priority Flash Alert (Pops top banner on student application)
              </span>
            </label>
          </div>

          {/* Live Preview Card */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                Live Student Portal Banner Preview
              </span>
              <span className="text-emerald-400">Audience: {targetStream}</span>
            </div>

            <div className={`p-3 rounded-xl border ${
              isHighPriority ? 'bg-rose-950/40 border-rose-600/50' : 'bg-slate-900 border-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                  {category}
                </span>
                <span className="text-xs font-bold text-white">
                  {title || 'Headline will appear here...'}
                </span>
              </div>
              {titleOdia && (
                <div className="text-xs text-amber-300 font-medium mt-1">
                  {titleOdia}
                </div>
              )}
              <p className="text-xs text-slate-300 mt-1.5 line-clamp-2">
                {content || 'Detailed announcement description body...'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Broadcast Notice
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
