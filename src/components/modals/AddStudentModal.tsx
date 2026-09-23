import React, { useState } from 'react';
import {
  UserPlus,
  School,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { StreamType } from '../../types';
import { ODISHA_DISTRICTS, ODISHA_COLLEGES } from '../../data/mockData';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { generateRegistrationNumber, addStudent } = useAdminData();

  const [nextRegNo] = useState(generateRegistrationNumber());
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [stream, setStream] = useState<StreamType>('Science');
  const [district, setDistrict] = useState(ODISHA_DISTRICTS[0]);
  const [college, setCollege] = useState(ODISHA_COLLEGES[0]);
  const [password, setPassword] = useState('Odisha@2026');
  const [autoApproveAccess, setAutoApproveAccess] = useState(true);
  const [enrolledPackage, setEnrolledPackage] = useState('Annual 12th Complete Syllabus');
  const [createdStudentReg, setCreatedStudentReg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) return;

    const newStudent = addStudent({
      name: name.trim(),
      rollNo: rollNo.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}${Math.floor(10 + Math.random() * 90)}@gmail.com`,
      stream,
      district,
      college,
      accountStatus: 'Active',
      passwordHash: password.trim(),
      courseAccessApproved: autoApproveAccess,
      enrolledPackage,
    });

    setCreatedStudentReg(newStudent.chseRegNo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-850 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generate Official CHSE Registration</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                SAMIS Admission Synchronizer (Zero Mobile OTP Mode)
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

        {createdStudentReg ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/40 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Student Registered Successfully!</h4>
              <p className="text-xs text-emerald-200 mt-1">
                Official CHSE Registration Number issued:
              </p>
              <div className="mt-2 text-base font-mono font-black text-amber-400 bg-slate-900 py-1.5 px-3 rounded-lg inline-block border border-slate-700">
                {createdStudentReg}
              </div>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
              <div>Student Name: <strong className="text-white">{name}</strong></div>
              <div>Stream: <strong className="text-amber-400">{stream}</strong></div>
              <div>College: <strong className="text-slate-200">{college}</strong></div>
              <div>Initial Password: <strong className="text-emerald-400 font-mono">{password}</strong></div>
              <div className="text-[11px] text-slate-400 mt-1">
                Zero SMS/OTP requirement: Student can authenticate immediately with this Registration Number and password.
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
              >
                Close / Return to Registry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            
            {/* Auto Generated Reg No */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">AUTOMATICALLY GENERATED CHSE REG NO:</span>
                <span className="text-sm font-mono font-black text-amber-400">{nextRegNo}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                VALIDATED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Student Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Manas Ranjan Jena"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  College Roll Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g. 12-SCI-190"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Stream</label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value as StreamType)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Science">Science Stream</option>
                  <option value="Arts">Arts Stream</option>
                  <option value="Commerce">Commerce Stream</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {ODISHA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Higher Secondary College</label>
              <select
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {ODISHA_COLLEGES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Password</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApproveAccess}
                  onChange={(e) => setAutoApproveAccess(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                />
                <span className="text-slate-300 text-xs font-medium">
                  Approve Immediate Full Digital Classroom Access
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
                <UserPlus className="w-4 h-4" />
                Generate & Approve Registration
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
