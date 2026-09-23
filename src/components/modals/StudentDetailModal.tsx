import React, { useState } from 'react';
import {
  Student,
} from '../../types';
import {
  School,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  UserCheck,
  Clock,
  BookOpen,
  Award,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { STREAM_SUBJECTS } from '../../data/mockData';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onOpenPasswordReset: (regNo?: string) => void;
  onOpenLoginSimulator: (student?: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onOpenPasswordReset,
  onOpenLoginSimulator,
}) => {
  const {
    students,
    toggleStudentCourseAccess,
    updateStudentStatus,
    regenerateStudentRegNo,
    revokeStudentRegistration,
    auditLogs,
  } = useAdminData();

  const [notification, setNotification] = useState<string | null>(null);

  if (!student) return null;

  // Track latest student state from context
  const currentStudent = students.find((s) => s.id === student.id) || student;

  const enrolledSubjects = currentStudent.subjects && currentStudent.subjects.length > 0
    ? currentStudent.subjects
    : (STREAM_SUBJECTS[currentStudent.stream] || []);
  const studentLogs = auditLogs.filter(
    (l) => l.targetRegNo && l.targetRegNo.toLowerCase() === currentStudent.chseRegNo.toLowerCase()
  );

  const handleRegenerate = () => {
    const newReg = regenerateStudentRegNo(currentStudent.id);
    setNotification(`New CHSE Reg No generated: ${newReg}`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRevoke = () => {
    revokeStudentRegistration(currentStudent.id, 'Administrative revocation by Super Admin');
    setNotification(`Registration revoked and access blocked for ${currentStudent.name}`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = () => {
    updateStudentStatus(currentStudent.id, 'Active', 'Approved by Admin in Student Dossier');
    setNotification(`Registration approved for ${currentStudent.name}`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-850 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-black text-lg flex items-center justify-center border border-amber-500/30">
              {currentStudent.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{currentStudent.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  currentStudent.stream === 'Science'
                    ? 'bg-sky-950 text-sky-300'
                    : currentStudent.stream === 'Arts'
                    ? 'bg-emerald-950 text-emerald-300'
                    : 'bg-purple-950 text-purple-300'
                }`}>
                  {currentStudent.stream} Stream
                </span>
              </div>
              <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                Reg No: {currentStudent.chseRegNo} • Roll: {currentStudent.rollNo}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        {notification && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        <div className="mt-4 space-y-4 text-xs">
          
          {/* SAMIS College & District */}
          <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-amber-400" />
              SAMIS College Details
            </div>
            <div className="text-white font-bold text-xs">{currentStudent.college}</div>
            <div className="text-slate-400">
              District: <span className="text-slate-200 font-semibold">{currentStudent.district}</span>
              {currentStudent.block && <> • Block: <span className="text-slate-200 font-semibold">{currentStudent.block}</span></>}
              {currentStudent.state && <> • State: <span className="text-slate-200 font-semibold">{currentStudent.state}</span></>}
              {' • Registered On: ' + currentStudent.registeredDate}
            </div>
            <div className="text-slate-400">
              Email: <span className="text-slate-200">{currentStudent.email}</span>
              {currentStudent.mobileNumber && <> • Mobile: <span className="text-slate-200 font-mono">{currentStudent.mobileNumber}</span></>}
            </div>
            {currentStudent.address && (
              <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-700/60">
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Permanent Address:</span>
                <span className="text-slate-300 font-mono text-[11px] whitespace-pre-line">{currentStudent.address}</span>
              </div>
            )}
          </div>

          {/* CHSE Official Registration Actions (Generate, Approve, Revoke) */}
          <div className="p-3.5 bg-slate-800/90 rounded-xl border border-amber-500/30 space-y-2.5">
            <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                CHSE Registry Actions
              </span>
              <span className="text-slate-400 font-mono text-[10px]">Status: {currentStudent.accountStatus}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <button
                onClick={handleRegenerate}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-amber-300 border border-slate-600 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Generate and reassign a new official MYCHSE-2026-XXXXX registration number"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate Reg No
              </button>

              {currentStudent.accountStatus !== 'Active' ? (
                <button
                  onClick={handleApprove}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Approve student registration and activate portal account"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Registration
                </button>
              ) : (
                <button
                  onClick={handleRevoke}
                  className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Revoke registration number and block account access"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Revoke Registration
                </button>
              )}
            </div>
          </div>

          {/* Authentication & Security Details */}
          <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero-OTP Authentication Status
              </span>
              <span className="text-emerald-400 font-bold">VERIFIED REGISTRATION</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-400 block">Current Password Hash / State:</span>
                <span className="font-mono text-slate-200 font-bold">
                  {currentStudent.temporaryPassword ? (
                    <span className="text-amber-400">Temporary: {currentStudent.temporaryPassword}</span>
                  ) : (
                    'Secured / Set by Student'
                  )}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Account Status:</span>
                <span className={`font-bold ${
                  currentStudent.accountStatus === 'Active'
                    ? 'text-emerald-400'
                    : currentStudent.accountStatus === 'Pending'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {currentStudent.accountStatus}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-700/80">
              <button
                onClick={() => {
                  onClose();
                  onOpenPasswordReset(currentStudent.chseRegNo);
                }}
                className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Direct Reset Password (Zero-OTP)
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenLoginSimulator(currentStudent);
                }}
                className="py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Test Auth
              </button>
            </div>
          </div>

          {/* Enrolled Subjects */}
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              CHSE Prescribed Curriculum ({enrolledSubjects.length} Subjects)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {enrolledSubjects.map((sub) => (
                <span
                  key={sub}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-medium text-[11px]"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Academic & Mock Performance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Mock Tests Attempted</span>
              <span className="text-lg font-bold text-white">{student.totalMockTestsTaken}</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Average Score</span>
              <span className="text-lg font-bold text-emerald-400">{student.avgScorePercentage}%</span>
            </div>
          </div>

          {/* Audit History for this student */}
          {studentLogs.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Audit Trail for {student.chseRegNo} ({studentLogs.length})
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {studentLogs.map((log, index) => (
                  <div
                    key={`${log.id}-${index}`}
                    className="p-2 rounded-lg bg-slate-800/80 border border-slate-750 text-[11px]"
                  >
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span className="font-mono text-amber-400 font-bold">{log.action}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={() => toggleStudentCourseAccess(currentStudent.id, !currentStudent.courseAccessApproved)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              currentStudent.courseAccessApproved
                ? 'bg-rose-950/70 text-rose-300 border-rose-800 hover:bg-rose-900'
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
            }`}
          >
            {currentStudent.courseAccessApproved ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {currentStudent.courseAccessApproved ? 'Revoke Course Access' : 'Approve Immediate Course Access'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
