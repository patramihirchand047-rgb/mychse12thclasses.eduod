import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  AlertTriangle,
  Calendar,
  Radio,
  FileText,
  Bell,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { Announcement, StreamType } from '../types';

interface AnnouncementHubProps {
  onOpenCreateNotice: () => void;
}

export const AnnouncementHub: React.FC<AnnouncementHubProps> = ({ onOpenCreateNotice }) => {
  const {
    announcements,
    toggleAnnouncementActive,
    deleteAnnouncement,
    isSupabaseConnected,
    isSyncingSupabase,
    syncWithSupabase,
  } = useAdminData();
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredNotices = announcements.filter(
    (a) => filterCategory === 'All' || a.category === filterCategory
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Announcement & Notification Hub</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-950 text-red-400 border border-red-800">
              Student Dashboard Notice Board
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast CHSE exam dates, practical routines, live class schedules, and zero-OTP login advisories directly to student portals.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => syncWithSupabase()}
            disabled={isSyncingSupabase}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isSupabaseConnected
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-900/60'
                : 'bg-slate-800/60 text-slate-400 border-slate-700'
            } disabled:opacity-50`}
            title={isSupabaseConnected ? 'Refresh live notices from Supabase' : 'Supabase is in local offline mode'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Notices'}</span>
          </button>
          <button
            onClick={onOpenCreateNotice}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Post Urgent Notification
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Urgent Notice', 'Exam Routine', 'Live Class', 'Academic Note'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filterCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notice Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between ${
              notice.isHighPriority
                ? 'border-red-900/60 ring-1 ring-red-500/20'
                : 'border-slate-800'
            }`}
          >
            <div>
              {/* Badges Bar */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Priority */}
                  {notice.isHighPriority ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-950 text-red-300 border border-red-800 flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      HIGH PRIORITY
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                      Standard
                    </span>
                  )}

                  {/* Category */}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    notice.category === 'Exam Routine'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : notice.category === 'Live Class'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : notice.category === 'Academic Note'
                      ? 'bg-sky-950 text-sky-300 border border-sky-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {notice.category}
                  </span>

                  {/* Target Stream */}
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                    Stream: <strong className="text-slate-200">{notice.targetStream}</strong>
                  </span>
                </div>

                <span className="text-[11px] text-slate-400">
                  {notice.publishedDate}
                </span>
              </div>

              {/* Title (English) */}
              <h3 className="text-sm font-bold text-white leading-snug">
                {notice.title}
              </h3>

              {/* Title (Odia) */}
              {notice.titleOdia && (
                <h4 className="text-xs font-semibold text-amber-300/90 mt-1 leading-relaxed">
                  {notice.titleOdia}
                </h4>
              )}

              {/* Content */}
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed bg-slate-850 p-3 rounded-xl border border-slate-800/80">
                {notice.content}
              </p>

              {/* Attachment */}
              {notice.pdfAttachmentUrl && (
                <div className="mt-3">
                  <a
                    href={notice.pdfAttachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                    <span>Official Gazette / Routine PDF Attachment</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAnnouncementActive(notice.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    notice.active
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {notice.active ? 'Active on Noticeboard' : 'Archived / Hidden'}
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm(`Delete notice "${notice.title}"?`)) {
                    deleteAnnouncement(notice.id);
                  }
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                title="Delete announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
