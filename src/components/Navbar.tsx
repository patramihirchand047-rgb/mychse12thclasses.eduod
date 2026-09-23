import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  KeyRound,
  RotateCcw,
  UserCheck,
  Bell,
  School,
  LogOut,
  Sparkles,
  Menu,
  Clock,
  Settings,
  Shield,
  User,
  Database,
  GraduationCap,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { Student } from '../types';

interface NavbarProps {
  onOpenPasswordReset: (prefillRegNo?: string) => void;
  onOpenLoginSimulator: (student?: Student) => void;
  onSelectStudent: (student: Student) => void;
  onOpenProfileSettings: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenSupabaseSync?: () => void;
  onSwitchToUserPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPasswordReset,
  onOpenLoginSimulator,
  onSelectStudent,
  onOpenProfileSettings,
  onToggleMobileSidebar,
  onOpenSupabaseSync,
  onSwitchToUserPortal,
}) => {
  const {
    admin,
    students,
    announcements,
    resetAllData,
    sessionTimeLeft,
    resetSessionTimer,
    logout,
    isSupabaseConnected,
    supabaseLatency,
    supabaseStatusMessage,
    pingSupabaseLiveStatus,
    isSyncingSupabase,
  } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isPingingDb, setIsPingingDb] = useState(false);
  const [lastPingTime, setLastPingTime] = useState<string | null>(null);

  // Auto-ping live Supabase status periodically
  React.useEffect(() => {
    let mounted = true;
    const checkLive = async () => {
      try {
        const res = await pingSupabaseLiveStatus();
        if (mounted && res) {
          setLastPingTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (e) {
        console.warn('Initial Supabase ping check error:', e);
      }
    };
    checkLive();

    const interval = setInterval(checkLive, 45000); // 45s heartbeat
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pingSupabaseLiveStatus]);

  const handleManualPing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPingingDb(true);
    try {
      await pingSupabaseLiveStatus();
      setLastPingTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } finally {
      setIsPingingDb(false);
    }
  };

  const pendingNoticesCount = announcements.filter((a) => a.active && a.isHighPriority).length;

  const minutes = Math.floor(sessionTimeLeft / 60);
  const seconds = sessionTimeLeft % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const filteredSearchResults = searchQuery.trim()
    ? students.filter(
        (s) =>
          s.chseRegNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.college.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3 min-w-max">
            {onToggleMobileSidebar && (
              <button
                onClick={onToggleMobileSidebar}
                className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                aria-label="Toggle navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/30 ring-2 ring-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  MY CHSE 12<sup className="text-xs">TH</sup> ADMIN
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-600/40 uppercase tracking-wider">
                  Odisha Central Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                CHSE Odisha +2 2nd Year Digital Classroom Gateway
              </p>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                id="global-student-search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search Reg No (e.g. MYCHSE-2026-00101), Name, College..."
                className="block w-full pl-9 pr-3 py-1.5 border border-slate-700 rounded-xl bg-slate-800/90 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Quick search drop-down */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-1.5 bg-slate-850 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-3 py-2 bg-slate-900 border-b border-slate-700 text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>SEARCH RESULTS ({filteredSearchResults.length})</span>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                {filteredSearchResults.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-700/60">
                    {filteredSearchResults.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => {
                          onSelectStudent(student);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="px-3 py-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">
                              {student.chseRegNo}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              student.stream === 'Science'
                                ? 'bg-sky-900/80 text-sky-200'
                                : student.stream === 'Arts'
                                ? 'bg-emerald-900/80 text-emerald-200'
                                : 'bg-purple-900/80 text-purple-200'
                            }`}>
                              {student.stream}
                            </span>
                            <span className="text-xs text-white">{student.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{student.college}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No students found matching "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Supabase connection badge */}
            <div className="hidden md:flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 rounded-lg p-0.5 shadow-sm">
              <button
                type="button"
                onClick={onOpenSupabaseSync}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs cursor-pointer hover:bg-slate-700/60 transition-colors"
                title={`${supabaseStatusMessage || (isSupabaseConnected ? 'Live Supabase Cloud Connected' : 'Supabase Disconnected')} • Latency: ${supabaseLatency}ms (Click to open Sync Manager)`}
              >
                <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span className="text-slate-400 text-[11px] font-medium">Supabase:</span>
                <span className={`text-[11px] font-bold flex items-center gap-1 ${
                  isSupabaseConnected ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isPingingDb ? 'bg-amber-400 animate-ping' : isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                  }`} />
                  {isPingingDb ? 'Checking...' : isSupabaseConnected ? 'Live Cloud' : 'Offline (Click)'}
                </span>
                {isSupabaseConnected && supabaseLatency > 0 && !isPingingDb && (
                  <span className="text-[10px] text-slate-400 font-mono hidden xl:inline">
                    ({supabaseLatency}ms)
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={handleManualPing}
                disabled={isPingingDb || isSyncingSupabase}
                className="p-1 text-slate-400 hover:text-emerald-300 hover:bg-slate-700/70 rounded transition-colors disabled:opacity-50 cursor-pointer"
                title={`Ping Supabase directly${lastPingTime ? ` (Last checked: ${lastPingTime})` : ''}`}
                aria-label="Ping Supabase Live"
              >
                <RotateCcw className={`w-3 h-3 ${isPingingDb || isSyncingSupabase ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>

            {/* Session timer badge */}
            <button
              onClick={resetSessionTimer}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 cursor-pointer transition-colors"
              title="Click to refresh administrative session"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-emerald-400 font-semibold">{timeFormatted}</span>
              <span className="text-[10px] text-slate-500">Auto-Logout</span>
            </button>

            {/* Switch to Live Student Panel */}
            {onSwitchToUserPortal && (
              <button
                onClick={onSwitchToUserPortal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer border border-blue-400/30"
                title="Switch to Live CHSE Student User Panel"
              >
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>Student Panel</span>
              </button>
            )}

            {/* Zero-OTP Password Reset shortcut */}
            <button
              id="btn-quick-password-reset"
              onClick={() => onOpenPasswordReset()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Direct Reset by CHSE Registration Number without SMS OTP"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">Direct Password Reset</span>
            </button>

            {/* Student Login Simulator */}
            <button
              onClick={() => onOpenLoginSimulator()}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer"
              title="Simulate Zero-OTP Student Experience"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Student Portal Simulator</span>
            </button>

            {/* Admin Avatar & Menu */}
            <div className="relative">
              <button
                id="btn-admin-profile"
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-slate-700 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
                  {admin.avatarInitials}
                </div>
                <div className="hidden xl:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {admin.name}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium leading-tight">
                    {admin.role}
                  </div>
                </div>
              </button>

              {/* Admin dropdown */}
              {showAdminMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{admin.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{admin.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-600/30">
                      {admin.role}
                    </span>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        setShowAdminMenu(false);
                        onOpenProfileSettings();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-200 flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-sky-400" />
                      Admin Profile & Security PIN
                    </button>

                    <button
                      onClick={() => {
                        setShowAdminMenu(false);
                        setShowResetConfirm(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 text-amber-300 flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore Default CHSE Data
                    </button>

                    <button
                      onClick={() => {
                        setShowAdminMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-950 text-rose-300 flex items-center gap-2 cursor-pointer border-t border-slate-800 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Secure Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Reset All CHSE Database Records?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will re-initialize the Odisha CHSE administrative database with official curriculum chapters, board model question papers, mock tests, payment ledger entries, and gateway configurations.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
