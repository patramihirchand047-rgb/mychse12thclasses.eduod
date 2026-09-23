import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Printer,
  GraduationCap,
  ShieldCheck,
  Calendar,
  School,
  MapPin,
  QrCode,
} from 'lucide-react';
import { Student } from '../../types';

interface UserDigitalIdCardModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
}

export const UserDigitalIdCardModal: React.FC<UserDigitalIdCardModalProps> = ({
  isOpen,
  student,
  onClose,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-white text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Official Student E-Card</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Print ID Card"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable ID Card */}
        <div className="p-6">
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950 border-2 border-blue-500/40 p-6 shadow-2xl overflow-hidden">
            {/* Hologram / Background Watermark */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
              <GraduationCap className="w-64 h-64 text-white" />
            </div>

            {/* Header */}
            <div className="relative border-b border-blue-500/30 pb-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md border border-white/20 mb-2">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-black text-white tracking-wide uppercase">
                Council of Higher Secondary Education, Odisha
              </h3>
              <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-widest mt-0.5">
                +2 2nd Year Digital Learning Pass (SAMIS Integrated)
              </p>
            </div>

            {/* Student Photo & Details */}
            <div className="relative pt-4 flex space-x-4">
              {/* Photo Box */}
              <div className="w-20 h-24 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-800 border-2 border-amber-400/40 flex flex-col items-center justify-center text-white shrink-0 shadow-inner">
                <span className="text-2xl font-black">{student.name.charAt(0).toUpperCase()}</span>
                <span className="text-[8px] uppercase tracking-tighter text-blue-200 mt-1">CHSE ID</span>
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-base font-extrabold text-white truncate">{student.name}</h4>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    {student.chseRegNo}
                  </span>
                </div>
                <p className="text-xs font-semibold text-blue-300">{student.stream} Stream</p>
                <p className="text-[11px] text-slate-300 truncate flex items-center space-x-1">
                  <School className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{student.college}</span>
                </p>
                <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{student.district}, Odisha</span>
                </p>
              </div>
            </div>

            {/* Footer QR & Verification */}
            <div className="relative mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-white rounded-lg shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=CHSE-ODISHA-VERIFIED:${student.chseRegNo}`}
                    alt="ID QR"
                    className="w-10 h-10"
                  />
                </div>
                <div className="text-[10px]">
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>VERIFIED RECORD</span>
                  </span>
                  <span className="text-slate-400 font-mono block">Enrolled: {student.registeredDate}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    student.courseAccessApproved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {student.courseAccessApproved ? 'PRO PASS' : 'STANDARD'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Student Card</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
