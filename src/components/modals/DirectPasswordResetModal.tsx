import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Copy,
  AlertTriangle,
  UserCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Student } from '../../types';

interface DirectPasswordResetModalProps {
  isOpen: boolean;
  prefillRegNo?: string;
  onClose: () => void;
  onOpenLoginSimulator: (student?: Student) => void;
}

export const DirectPasswordResetModal: React.FC<DirectPasswordResetModalProps> = ({
  isOpen,
  prefillRegNo = '',
  onClose,
  onOpenLoginSimulator,
}) => {
  const { students, resetStudentPasswordDirect } = useAdminData();

  const [regNo, setRegNo] = useState(prefillRegNo);
  const [resetType, setResetType] = useState<'temporary' | 'custom'>('temporary');
  const [customPassword, setCustomPassword] = useState('CHSE@2026');
  const [temporaryPin, setTemporaryPin] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string; tempPass?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRegNo(prefillRegNo || '');
      setResult(null);
      setCopied(false);
      // Generate standard random temporary PIN
      const randomFour = Math.floor(1000 + Math.random() * 9000);
      setTemporaryPin(`CHSE-TEMP-${randomFour}`);
    }
  }, [isOpen, prefillRegNo]);

  if (!isOpen) return null;

  const targetStudent = students.find(
    (s) => s.chseRegNo.toLowerCase() === regNo.trim().toLowerCase()
  );

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim()) return;

    const chosenPassword = resetType === 'temporary' ? temporaryPin : customPassword.trim();
    if (!chosenPassword) return;

    const res = resetStudentPasswordDirect(regNo.trim(), chosenPassword, resetType === 'temporary');
    setResult(res);
  };

  const handleCopyCredentials = () => {
    const pass = result?.tempPass || (resetType === 'temporary' ? temporaryPin : customPassword);
    const text = `CHSE 12TH CLASSES PORTAL CREDENTIALS:\nRegistration No: ${targetStudent?.chseRegNo || regNo}\nNew Password: ${pass}\nDirect Student Login URL: Portal Zero-OTP Gateway\nNote: No mobile OTP required. Sign in directly with this Registration Number.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-850 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Direct Student Password Reset</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero-OTP Direct Reset via verified CHSE Registration Number
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Security Rule Alert */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-emerald-300 leading-relaxed">
            <strong>Mandatory Constraint:</strong> Mobile SMS/OTP verification has been permanently eliminated. The student receives immediate access as soon as the administrator resets their password.
          </div>
        </div>

        {!result ? (
          <form onSubmit={handleReset} className="mt-5 space-y-4">
            
            {/* Registration Number Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Student CHSE Registration Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. MYCHSE-2026-00101"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-amber-400 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {targetStudent ? (
                <div className="mt-1.5 p-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
                  <div>
                    <strong className="text-white">{targetStudent.name}</strong> ({targetStudent.stream} Stream)
                    <div className="text-[10px] text-slate-400">{targetStudent.college}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                    VERIFIED REGISTRY
                  </span>
                </div>
              ) : regNo.trim() ? (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Registration number not found in current repository.
                </p>
              ) : null}
            </div>

            {/* Reset Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reset Credential Type
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setResetType('temporary')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    resetType === 'temporary'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">Auto Temporary PIN</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Quick access for exam hall emergencies</div>
                </button>

                <button
                  type="button"
                  onClick={() => setResetType('custom')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    resetType === 'custom'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">Custom Permanent Pass</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Define standard default password</div>
                </button>
              </div>
            </div>

            {/* Password input / PIN display */}
            {resetType === 'temporary' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assigned Temporary Password
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={temporaryPin}
                    className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const r = Math.floor(1000 + Math.random() * 9000);
                      setTemporaryPin(`CHSE-TEMP-${r}`);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                    title="Generate another PIN"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="text"
                  required
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="Enter new student password..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Submit Action */}
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
                disabled={!targetStudent}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                Assign Password Now
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/40 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Password Updated Successfully!</h4>
              <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                {result.message}
              </p>
            </div>

            {/* Credential summary */}
            <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">CHSE Registration Number:</span>
                <span className="font-mono font-bold text-amber-400">{targetStudent?.chseRegNo || regNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-white">{targetStudent?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Password:</span>
                <span className="font-mono font-extrabold text-emerald-400 select-all">
                  {result.tempPass}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleCopyCredentials}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Copy className="w-4 h-4 text-amber-400" />
                {copied ? 'Copied to Clipboard!' : 'Copy Student Credentials'}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenLoginSimulator(targetStudent);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow"
              >
                <UserCheck className="w-4 h-4" />
                Test Login as {targetStudent?.name?.split(' ')[0]}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white"
              >
                Done / Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
