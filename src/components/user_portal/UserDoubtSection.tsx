import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  HelpCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { INITIAL_STUDENT_DOUBTS } from '../../data/chseExtData';
import { Student, StreamType, StudentDoubt } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';

interface UserDoubtSectionProps {
  currentStudent: Student | null;
  selectedStream: StreamType;
  onOpenAuth: () => void;
}

export const UserDoubtSection: React.FC<UserDoubtSectionProps> = ({
  currentStudent,
  selectedStream,
  onOpenAuth,
}) => {
  const { studentDoubts, addStudentDoubt } = useAdminData();
  const doubtsList = studentDoubts && studentDoubts.length > 0 ? studentDoubts : INITIAL_STUDENT_DOUBTS;

  const [subject, setSubject] = useState<string>('Physics');
  const [topic, setTopic] = useState<string>('');
  const [doubtText, setDoubtText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim() || !topic.trim()) return;

    if (!currentStudent) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    const newDoubt: StudentDoubt = {
      id: `dbt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      stream: selectedStream,
      subject,
      topic: topic.trim(),
      doubtText: doubtText.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending',
    };

    await addStudentDoubt(newDoubt);

    setDoubtText('');
    setTopic('');
    setIsSubmitting(false);
    setSuccessMsg('ଆପଣଙ୍କ ପ୍ରଶ୍ନ (Doubt) ସଫଳତାର ସହିତ ଶିକ୍ଷକଙ୍କ ନିକଟକୁ ପଠାଗଲା! Live Cloud / Supabase ରେ Save ହୋଇଛି, ଶୀଘ୍ର ଉତ୍ତର ଆସିବ।');
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  const getSubjectOptions = () => {
    if (selectedStream === 'Science') {
      return ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'MIL (Odia)', 'English', 'IT/CS'];
    }
    if (selectedStream === 'Arts') {
      return ['Political Science', 'History', 'Economics', 'Sociology', 'MIL (Odia)', 'English', 'Education'];
    }
    return ['Accountancy', 'Business Studies', 'Business Math & Stats', 'Cost Accounting', 'MIL (Odia)', 'English'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                Ask Faculty / 24x7 Doubt Clearance
              </span>
              <span className="text-xs text-amber-300 font-semibold font-serif">
                ଅଭିଜ୍ଞ ଶିକ୍ଷକଙ୍କଠାରୁ ସନ୍ଦେହ ମୋଚନ
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Ask Senior Faculty & Subject Mentors
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Stuck on a tricky derivation, chemical mechanism, or numerical problem? Post your question below to receive step-by-step verified solutions from CHSE senior lecturers.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-xs shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-bold text-white">Verified Council Faculty</p>
              <p className="text-slate-400 text-[11px]">Personalized Step-by-Step answers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ask Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 h-fit">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-extrabold text-white">
              Ask a New Question
            </h3>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 flex items-start space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Select Subject:
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {getSubjectOptions().map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter / Topic */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Chapter / Topic Name:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Optics Young's Slit or Aldol Condensation"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Doubt Question */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Your Doubt / Problem Statement:
              </label>
              <textarea
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                rows={4}
                placeholder="Type your exact question, formula difficulty, or derivation doubt..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'ପଠାଯାଉଛି...' : 'Submit Doubt to Teacher'}</span>
            </button>

            {!currentStudent && (
              <p className="text-[11px] text-amber-300 text-center font-medium">
                * Please log in or register with your CHSE ID to submit doubts.
              </p>
            )}
          </form>
        </div>

        {/* Right Column: List of Doubts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
              <span>Recently Answered Doubts ({doubtsList.length})</span>
            </h3>
            <span className="text-xs text-slate-400">
              Community Q&A Feed
            </span>
          </div>

          <div className="space-y-4">
            {doubtsList.map((d) => (
              <div
                key={d.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {d.subject}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {d.topic}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1.5">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>Asked by {d.studentName}</span>
                      <span>•</span>
                      <span>{d.createdAt}</span>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                      d.status === 'Answered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {d.status === 'Answered' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Answered</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>Teacher Reviewing</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Doubt Question */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-200">
                  <p className="font-semibold text-slate-300 mb-0.5">Question:</p>
                  <p className="leading-relaxed">{d.doubtText}</p>
                </div>

                {/* Faculty Answer */}
                {d.status === 'Answered' && d.answerText && (
                  <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-xl text-xs sm:text-sm space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                      <span className="flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Faculty Solution ({d.answeredBy})</span>
                      </span>
                      {d.answeredAt && (
                        <span className="text-[11px] text-slate-400 font-normal">
                          {d.answeredAt}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200 leading-relaxed font-serif pt-1">
                      {d.answerText}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
