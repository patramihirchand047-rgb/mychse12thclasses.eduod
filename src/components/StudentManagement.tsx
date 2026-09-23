import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Unlock,
  Lock,
  UserCheck,
  Eye,
  ChevronDown,
  Sparkles,
  School,
  AlertTriangle,
  Database,
  RefreshCw,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { Student, StreamType, AccountStatus } from '../types';
import { ODISHA_DISTRICTS, ODISHA_COLLEGES } from '../data/mockData';

interface StudentManagementProps {
  onSelectStudent: (student: Student) => void;
  onOpenPasswordReset: (regNo?: string) => void;
  onOpenLoginSimulator: (student?: Student) => void;
  onOpenAddStudent: () => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  onSelectStudent,
  onOpenPasswordReset,
  onOpenLoginSimulator,
  onOpenAddStudent,
}) => {
  const {
    students,
    updateStudentStatus,
    toggleStudentCourseAccess,
    isSupabaseConnected,
    isSyncingSupabase,
    syncWithSupabase,
  } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.chseRegNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStream = selectedStream === 'All' || s.stream === selectedStream;
      const matchesDistrict = selectedDistrict === 'All' || s.district === selectedDistrict;
      const matchesCollege = selectedCollege === 'All' || s.college === selectedCollege;
      const matchesStatus = selectedStatus === 'All' || s.accountStatus === selectedStatus;

      return matchesSearch && matchesStream && matchesDistrict && matchesCollege && matchesStatus;
    });
  }, [students, searchQuery, selectedStream, selectedDistrict, selectedCollege, selectedStatus]);

  // Export to CSV for SAMIS reporting
  const handleExportCSV = () => {
    const headers = [
      'CHSE Reg No',
      'Student Name',
      'Roll No',
      'Stream',
      'District',
      'College',
      'Account Status',
      'Course Access',
      'Registered Date',
      'Email',
    ];
    const rows = filteredStudents.map((s) => [
      `"${s.chseRegNo}"`,
      `"${s.name}"`,
      `"${s.rollNo}"`,
      `"${s.stream}"`,
      `"${s.district}"`,
      `"${s.college}"`,
      `"${s.accountStatus}"`,
      `"${s.courseAccessApproved ? 'Approved' : 'Locked'}"`,
      `"${s.registeredDate}"`,
      `"${s.email}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CHSE_SAMIS_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Student Management (SAMIS / CHSE Registry)</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              Synced Database
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official Higher Secondary registry for Class 12th Odisha students. Enforcing zero-OTP registration format (MYCHSE-2026-XXXXX).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => syncWithSupabase()}
            disabled={isSyncingSupabase}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isSupabaseConnected
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-900/60'
                : 'bg-slate-800/60 text-slate-400 border-slate-700'
            } disabled:opacity-50`}
            title={isSupabaseConnected ? 'Refresh live students from Supabase' : 'Supabase is in local offline mode'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Supabase'}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
            title="Download CSV for SAMIS College Roster"
          >
            <Download className="w-4 h-4 text-slate-400" />
            Export SAMIS CSV
          </button>
          <button
            id="btn-add-student-modal"
            onClick={onOpenAddStudent}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            Register New Student
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              id="student-filter-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Reg No, Name, Roll No..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Stream Filter */}
          <div>
            <select
              id="student-filter-stream"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Streams</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              id="student-filter-district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Districts</option>
              {ODISHA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>
          </div>

          {/* College Filter */}
          <div>
            <select
              id="student-filter-college"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white truncate focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Colleges</option>
              {ODISHA_COLLEGES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Account Status Filter */}
          <div>
            <select
              id="student-filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

        </div>

        {/* Quick Filter Counts bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div>
            Showing <strong className="text-white">{filteredStudents.length}</strong> of{' '}
            <strong className="text-white">{students.length}</strong> enrolled students
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active: {students.filter((s) => s.accountStatus === 'Active').length}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending: {students.filter((s) => s.accountStatus === 'Pending').length}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Blocked: {students.filter((s) => s.accountStatus === 'Blocked').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3">CHSE Reg No & Roll</th>
                <th scope="col" className="px-4 py-3">Student Details</th>
                <th scope="col" className="px-4 py-3">Stream & College</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Digital Access</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isPending = student.accountStatus === 'Pending';
                  const isBlocked = student.accountStatus === 'Blocked';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-850/70 transition-colors group"
                    >
                      {/* Reg No & Roll */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-bold text-amber-400 text-xs">
                          {student.chseRegNo}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Roll: <span className="font-medium text-slate-300">{student.rollNo}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Reg: {student.registeredDate}
                        </div>
                      </td>

                      {/* Student Details */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white text-xs flex items-center gap-1.5">
                          {student.name}
                          {student.temporaryPassword && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800" title="Temporary Password active">
                              Temp PIN
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                        <div className="text-[10px] text-slate-400">
                          Last active: {student.lastActive}
                        </div>
                      </td>

                      {/* Stream & College */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              student.stream === 'Science'
                                ? 'bg-sky-950 text-sky-300 border border-sky-800'
                                : student.stream === 'Arts'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-purple-950 text-purple-300 border border-purple-800'
                            }`}
                          >
                            {student.stream}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {student.district} Dist.
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 truncate" title={student.college}>
                          {student.college}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            student.accountStatus === 'Active'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : student.accountStatus === 'Pending'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {student.accountStatus === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                          {student.accountStatus === 'Pending' && <Clock className="w-3 h-3" />}
                          {student.accountStatus === 'Blocked' && <XCircle className="w-3 h-3" />}
                          {student.accountStatus}
                        </span>
                      </td>

                      {/* Course Access */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              toggleStudentCourseAccess(student.id, !student.courseAccessApproved)
                            }
                            className={`px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 border transition-colors ${
                              student.courseAccessApproved
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                            }`}
                            title="Click to grant/revoke immediate access to digital video lectures & PDF materials"
                          >
                            {student.courseAccessApproved ? (
                              <>
                                <Unlock className="w-3 h-3 text-emerald-400" />
                                <span>UNLOCKED</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>LOCKED</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Action Menu */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          
                          {/* 1-Click Direct Password Reset */}
                          <button
                            onClick={() => onOpenPasswordReset(student.chseRegNo)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-[11px] font-bold border border-slate-700 transition-all flex items-center gap-1"
                            title="Reset password directly without requiring OTP/SMS"
                          >
                            <KeyRound className="w-3 h-3" />
                            <span>Reset Pass</span>
                          </button>

                          {/* Quick Student Login Tester */}
                          <button
                            onClick={() => onOpenLoginSimulator(student)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-all flex items-center gap-1"
                            title="Verify student login with CHSE Reg No & Password"
                          >
                            <UserCheck className="w-3 h-3 text-emerald-400" />
                            <span>Test Auth</span>
                          </button>

                          {/* Approve / Revoke Status Toggle */}
                          {isPending ? (
                            <button
                              onClick={() => updateStudentStatus(student.id, 'Active', 'Approved by Admin')}
                              className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold transition-colors"
                              title="Approve student registration"
                            >
                              Approve
                            </button>
                          ) : isBlocked ? (
                            <button
                              onClick={() => updateStudentStatus(student.id, 'Active', 'Unblocked by Admin')}
                              className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-amber-300 text-[11px] font-medium"
                              title="Unblock student"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStudentStatus(student.id, 'Blocked', 'Admin administrative block')}
                              className="p-1 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
                              title="Revoke / Block Account"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* View Full Student Dossier */}
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                            title="View Full Profile & Performance"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <School className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No student records match the active criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or search by a different registration number.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
