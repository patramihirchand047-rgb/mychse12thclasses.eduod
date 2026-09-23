import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  ShieldCheck,
  KeyRound,
  Lock,
  Unlock,
  BookOpen,
  School,
  AlertTriangle,
  CheckCircle2,
  Play,
  FileText,
  LogOut,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Student } from '../../types';

interface StudentLoginSimulatorModalProps {
  isOpen: boolean;
  initialStudent?: Student;
  onClose: () => void;
}

export const StudentLoginSimulatorModal: React.FC<StudentLoginSimulatorModalProps> = ({
  isOpen,
  initialStudent,
  onClose,
}) => {
  const { students, lessons, announcements, resetStudentPasswordDirect } = useAdminData();

  // Login form state
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [authenticatedStudent, setAuthenticatedStudent] = useState<Student | null>(null);

  // Forgot password mode inside student simulator
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotRegNo, setForgotRegNo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');
  const [forgotErrorMessage, setForgotErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialStudent) {
        setRegNo(initialStudent.chseRegNo);
        setPassword(initialStudent.temporaryPassword || initialStudent.passwordHash);
      } else {
        setRegNo('');
        setPassword('');
      }
      setErrorMessage('');
      setAuthenticatedStudent(null);
      setIsForgotPasswordMode(false);
      setForgotSuccessMessage('');
      setForgotErrorMessage('');
    }
  }, [isOpen, initialStudent]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedReg = regNo.trim().toUpperCase();
    const student = students.find((s) => s.chseRegNo.toUpperCase() === trimmedReg);

    if (!student) {
      setErrorMessage(`Registration Number "${regNo}" was not found in the CHSE database. Please check and retry.`);
      return;
    }

    if (student.accountStatus === 'Blocked') {
      setErrorMessage(`Account for "${student.name}" is currently blocked by administration. Please contact your college authority.`);
      return;
    }

    // Check password (plain or temporary)
    const validPass =
      password === student.passwordHash ||
      (student.temporaryPassword && password === student.temporaryPassword);

    if (!validPass) {
      setErrorMessage('Invalid Password. If you forgot your password, click "Forgot Password" below to reset using your CHSE Registration Number directly without OTP.');
      return;
    }

    // Successful authentication
    setAuthenticatedStudent(student);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotErrorMessage('');
    setForgotSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setForgotErrorMessage('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    const trimmedReg = forgotRegNo.trim().toUpperCase();
    const res = resetStudentPasswordDirect(trimmedReg, newPassword, false);

    if (res.success) {
      setForgotSuccessMessage(`Password reset successfully for ${trimmedReg}. No SMS/OTP was required! You can now log in immediately.`);
      setRegNo(trimmedReg);
      setPassword(newPassword);
    } else {
      setForgotErrorMessage(res.message);
    }
  };

  // Lessons relevant to authenticated student's stream
  const studentStreamLessons = authenticatedStudent
    ? lessons.filter((l) => l.stream === authenticatedStudent.stream)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto">
        
        {/* Top Simulation Banner */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Student Portal Auth Simulator (CHSE 12th Odisha)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded hover:bg-slate-800"
          >
            Close ✕
          </button>
        </div>

        {/* View 1: Student is Logged in */}
        {authenticatedStudent ? (
          <div className="p-6 space-y-5">
            {/* Student Profile Header */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{authenticatedStudent.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    authenticatedStudent.stream === 'Science'
                      ? 'bg-sky-950 text-sky-300'
                      : authenticatedStudent.stream === 'Arts'
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-purple-950 text-purple-300'
                  }`}>
                    {authenticatedStudent.stream} Stream
                  </span>
                </div>
                <div className="text-xs font-mono text-amber-400 mt-0.5 font-bold">
                  {authenticatedStudent.chseRegNo} • Roll: {authenticatedStudent.rollNo}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {authenticatedStudent.college} ({authenticatedStudent.district} Dist.)
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                  authenticatedStudent.courseAccessApproved
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {authenticatedStudent.courseAccessApproved ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {authenticatedStudent.courseAccessApproved ? 'Full Digital Access' : 'Free Preview Mode'}
                </span>

                <button
                  onClick={() => setAuthenticatedStudent(null)}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>

            {/* Verification Success Tag */}
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs flex items-center gap-2.5 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Zero-OTP Success:</strong> Student authenticated strictly with official Registration Number & Password without requiring an SMS/OTP.
              </span>
            </div>

            {/* Enrolled Course Syllabus View */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Available {authenticatedStudent.stream} Video Lectures ({studentStreamLessons.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {studentStreamLessons.map((lesson) => {
                  const isAccessible = authenticatedStudent.courseAccessApproved || lesson.isFreePreview;
                  return (
                    <div
                      key={lesson.id}
                      className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-amber-400">
                            {lesson.subject}
                          </span>
                          <span className="text-white font-bold truncate">{lesson.lessonTitle}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Ch {lesson.chapterNo}: {lesson.chapterTitle} • {lesson.duration}
                        </p>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                        isAccessible
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {isAccessible ? 'WATCH AVAILABLE' : 'LOCKED (REQUIRES COURSE APPROVAL)'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : !isForgotPasswordMode ? (
          /* View 2: Student Login Form (NO OTP) */
          <div className="p-6">
            <div className="text-center max-w-sm mx-auto mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <School className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">CHSE 12th Student Sign-In</h3>
              <p className="text-xs text-slate-400 mt-1">
                Council of Higher Secondary Education, Odisha (Digital Classroom)
              </p>
            </div>

            {/* Explicit Notice: No Mobile OTP */}
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-emerald-300 leading-relaxed text-[11px]">
                <strong>Notice:</strong> Mobile OTP verification has been deactivated. You only need your official 
                <span className="text-amber-300 font-mono font-bold ml-1">Registration Number</span> and password to sign in.
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-600/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Official CHSE Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. MYCHSE-2026-00101"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-amber-400 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordMode(true);
                      setForgotRegNo(regNo);
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline font-medium"
                  >
                    Forgot Password? (Direct Reset)
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Authenticate as Student (Zero-OTP)
              </button>
            </form>
          </div>
        ) : (
          /* View 3: Student Forgot Password Flow (DIRECT RESET USING CHSE REG NO - NO OTP) */
          <div className="p-6 max-w-md mx-auto">
            <button
              onClick={() => setIsForgotPasswordMode(false)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign-In
            </button>

            <div className="mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Direct Password Reset (Zero-OTP)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your verified CHSE Registration Number to reset your password directly. No mobile SMS or OTP is required.
              </p>
            </div>

            {forgotSuccessMessage ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/40 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white">Password Reset Successful!</h4>
                  <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                    {forgotSuccessMessage}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordMode(false)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Return to Login & Sign In Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                {forgotErrorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600/40 text-rose-300 text-xs">
                    {forgotErrorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your CHSE Registration Number
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotRegNo}
                    onChange={(e) => setForgotRegNo(e.target.value)}
                    placeholder="e.g. MYCHSE-2026-00101"
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-amber-400 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters..."
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow mt-2"
                >
                  Reset Password Directly (Zero-OTP)
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
