import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  CreditCard,
  Bell,
  User,
  Shield,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  Award,
  FileText,
  Library,
  FlaskConical,
  MessageSquare,
  Phone,
  Smartphone,
  MoreVertical,
  ExternalLink,
  HelpCircle,
  X,
  Send,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Student, StreamType } from '../../types';

export type UserPortalSection =
  | 'syllabus'
  | 'pyqs'
  | 'bureau_books'
  | 'practicals'
  | 'tests'
  | 'doubts'
  | 'payment'
  | 'notices'
  | 'idcard';

// Crisp Official WhatsApp SVG Icon
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface UserNavbarProps {
  currentStudent: Student | null;
  activeSection: UserPortalSection;
  setActiveSection: (sec: UserPortalSection) => void;
  selectedStream: StreamType;
  setSelectedStream: (st: StreamType) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchToAdmin: () => void;
  unreadNoticesCount: number;
}

export const UserNavbar: React.FC<UserNavbarProps> = ({
  currentStudent,
  activeSection,
  setActiveSection,
  selectedStream,
  setSelectedStream,
  onOpenAuth,
  onLogout,
  onSwitchToAdmin,
  unreadNoticesCount,
}) => {
  const { gatewayConfig, admin } = useAdminData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Clean phone number for WhatsApp API
  const rawMobile = gatewayConfig?.adminMobile || '+91 89174 08498';
  const digitsOnly = rawMobile.replace(/[^0-9]/g, '');
  const waPhone = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly || '918917408498';

  const generateWhatsAppUrl = (messageText?: string) => {
    let text = messageText;
    if (!text) {
      text = currentStudent
        ? `Namaskar Sir! I am ${currentStudent.name} (CHSE Reg: ${currentStudent.chseRegNo || 'Pending'}, Stream: ${selectedStream}). I need help regarding CHSE +2 2nd Year study materials & portal.`
        : `Namaskar Sir! I am a +2 2nd Year student (${selectedStream} Stream). I want to inquire about MY CHSE 12TH CLASSES study materials, PYQs & pass admission.`;
    }
    return `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(text)}`;
  };

  const directWhatsAppUrl = generateWhatsAppUrl();
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      {/* Top Notification Strip */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 text-white text-[11px] font-medium py-1 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider">CHSE Odisha 2026</span>
          <span className="truncate">Council of Higher Secondary Education, Odisha • +2 2nd Year Student Portal (SAMIS Integrated)</span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all border border-emerald-400/50 shadow-sm"
            title="Chat with CHSE Academic Help Desk on WhatsApp"
          >
            <WhatsAppIcon className="w-3 h-3 fill-current text-white" />
            <span>WhatsApp Help Desk: {rawMobile}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveSection('syllabus')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xl border border-blue-400/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">MY CHSE 12TH CLASSES</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  +2 2nd Year
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Odisha Board Student Learning & Examination Hub</p>
            </div>
          </div>

          {/* Stream Quick Selector */}
          <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            {(['Science', 'Arts', 'Commerce'] as StreamType[]).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStream(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedStream === st
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st} Stream
              </button>
            ))}
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden xl:flex items-center space-x-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSection('syllabus')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSection === 'syllabus'
                  ? 'bg-blue-600/25 text-blue-400 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Syllabus & Notes</span>
            </button>

            <button
              onClick={() => setActiveSection('pyqs')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSection === 'pyqs'
                  ? 'bg-blue-600/25 text-blue-400 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>10-Yr PYQs</span>
            </button>

            <button
              onClick={() => setActiveSection('bureau_books')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSection === 'bureau_books'
                  ? 'bg-emerald-600/25 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Library className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bureau Books</span>
            </button>

            <button
              onClick={() => setActiveSection('practicals')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSection === 'practicals'
                  ? 'bg-purple-600/25 text-purple-400 font-bold border border-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              <span>Practicals (30M)</span>
            </button>

            <button
              onClick={() => setActiveSection('tests')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSection === 'tests'
                  ? 'bg-blue-600/25 text-blue-400 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Mock Tests</span>
            </button>

            <button
              onClick={() => setActiveSection('doubts')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSection === 'doubts'
                  ? 'bg-indigo-600/25 text-indigo-300 font-bold border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask Faculty</span>
            </button>

            <button
              onClick={() => setActiveSection('payment')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSection === 'payment'
                  ? 'bg-amber-600/25 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>2026-27 Pass (From ₹99)</span>
            </button>

            <button
              onClick={() => setActiveSection('notices')}
              className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSection === 'notices'
                  ? 'bg-blue-600/25 text-blue-400 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notices</span>
              {unreadNoticesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {currentStudent && (
              <button
                onClick={() => setActiveSection('idcard')}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                  activeSection === 'idcard'
                    ? 'bg-emerald-600/25 text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>ID Card</span>
              </button>
            )}
          </nav>

          {/* Action Area: Student Profile / 3-Dot Options Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Student Profile (if logged in) */}
            {currentStudent ? (
              <div className="flex items-center space-x-2">
                <div
                  onClick={() => setActiveSection('idcard')}
                  className="cursor-pointer flex items-center space-x-2.5 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                    {currentStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-white truncate max-w-[120px]">{currentStudent.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{currentStudent.chseRegNo}</p>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      currentStudent.courseAccessApproved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {currentStudent.courseAccessApproved ? 'PRO' : 'FREE'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {/* Prominent Large 3-Dot Options Menu */}
            <div className="relative" ref={menuDropdownRef}>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-200 hover:text-amber-300 border-2 border-slate-700 hover:border-amber-400/80 shadow-lg shadow-black/50 transition-all cursor-pointer flex items-center justify-center group active:scale-95"
                title="Options Menu (3 Dots)"
                aria-label="Options Menu"
              >
                <MoreVertical className="w-7 h-7 sm:w-8 sm:h-8 text-slate-200 group-hover:text-amber-300 transition-colors" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-3xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl shadow-black/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                    <p className="text-xs uppercase font-black tracking-wider text-slate-400">
                      CHSE Portal Options
                    </p>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="p-2.5 space-y-2">
                    {/* OPTION 1: Students Login */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-left bg-slate-950 hover:bg-emerald-950/70 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                        <User className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors">
                          Students Login
                        </p>
                        <p className="text-[11px] text-slate-400">Registration No & OTP</p>
                      </div>
                    </button>

                    {/* OPTION 2: Mychse login */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSwitchToAdmin();
                      }}
                      className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-left bg-slate-950 hover:bg-amber-950/70 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 group-hover:scale-105 transition-transform">
                        <Shield className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                          Mychse login
                        </p>
                        <p className="text-[11px] text-slate-400">Council Admin Panel</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="xl:hidden flex items-center space-x-2 overflow-x-auto py-2 border-t border-slate-800/80 text-xs no-scrollbar">
          <button
            onClick={() => setActiveSection('syllabus')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${activeSection === 'syllabus' ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Syllabus</span>
          </button>
          <button
            onClick={() => setActiveSection('pyqs')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${activeSection === 'pyqs' ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>10-Yr PYQs</span>
          </button>
          <button
            onClick={() => setActiveSection('bureau_books')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${activeSection === 'bureau_books' ? 'bg-emerald-600/30 text-emerald-400 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <Library className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bureau Books</span>
          </button>
          <button
            onClick={() => setActiveSection('practicals')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${activeSection === 'practicals' ? 'bg-purple-600/30 text-purple-400 font-bold border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
            <span>Practicals</span>
          </button>
          <button
            onClick={() => setActiveSection('tests')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${activeSection === 'tests' ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Mock Tests</span>
          </button>
          <button
            onClick={() => setActiveSection('doubts')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${activeSection === 'doubts' ? 'bg-indigo-600/30 text-indigo-400 font-bold border border-indigo-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ask Doubts</span>
          </button>
          <button
            onClick={() => setActiveSection('payment')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${activeSection === 'payment' ? 'bg-amber-600/30 text-amber-400 font-bold border border-amber-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Pass (From ₹99)</span>
          </button>
          <button
            onClick={() => setActiveSection('notices')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${activeSection === 'notices' ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notices</span>
          </button>
          {currentStudent && (
            <button
              onClick={() => setActiveSection('idcard')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${activeSection === 'idcard' ? 'bg-emerald-600/30 text-emerald-400 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>ID Card</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
