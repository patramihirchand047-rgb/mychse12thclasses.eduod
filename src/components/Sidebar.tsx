import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  GraduationCap,
  FileCheck2,
  CreditCard,
  Megaphone,
  ShieldAlert,
  Settings,
  ChevronRight,
  ShieldCheck,
  Award,
  Database,
  BookOpenCheck,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

export type TabType =
  | 'overview'
  | 'supabase'
  | 'queue'
  | 'students'
  | 'courses'
  | 'resources'
  | 'mocktests'
  | 'payments'
  | 'announcements'
  | 'gateway'
  | 'security';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen = false,
  setIsMobileOpen,
}) => {
  const {
    students,
    applications,
    payments,
    mockTests,
    announcements,
    studentDoubts,
    isSupabaseConnected,
    isSyncingSupabase,
    supabaseLatency,
  } = useAdminData();

  const pendingAppsCount = applications.filter((a) => a.status === 'Pending Review').length;
  const pendingPaymentsCount = payments.filter((p) => p.status === 'Pending').length;
  const publishedTestsCount = mockTests.filter((t) => t.status === 'published').length;
  const activeAnnouncementsCount = announcements.filter((a) => a.active).length;
  const pendingDoubtsCount = studentDoubts ? studentDoubts.filter((d) => d.status === 'Pending').length : 0;

  const navItems = [
    {
      id: 'overview' as TabType,
      label: 'Overview & Analytics',
      icon: LayoutDashboard,
      badge: null,
      description: 'Stream KPIs & financial health',
    },
    {
      id: 'supabase' as TabType,
      label: 'Supabase Cloud DB',
      icon: Database,
      badge: isSupabaseConnected ? 'Live' : (isSyncingSupabase ? 'Syncing...' : 'Offline'),
      badgeColor: isSupabaseConnected
        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40'
        : isSyncingSupabase
        ? 'bg-amber-950/80 text-amber-300 border-amber-600/40'
        : 'bg-rose-950/80 text-rose-300 border-rose-600/40',
      description: 'Direct tables & 12-digit UTR sync',
    },
    {
      id: 'queue' as TabType,
      label: 'Student Verification Queue',
      icon: UserCheck,
      badge: pendingAppsCount > 0 ? `${pendingAppsCount} Review` : null,
      badgeColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-600/40',
      description: 'mychse12thclassesedu.netlify.app sync',
    },
    {
      id: 'students' as TabType,
      label: 'Student Management',
      icon: Users,
      badge: `${students.length} Total`,
      badgeColor: 'bg-sky-900/60 text-sky-300 border-sky-600/40',
      description: 'SAMIS / CHSE Registry & Passwords',
    },
    {
      id: 'courses' as TabType,
      label: 'Curriculum & CMS',
      icon: GraduationCap,
      badge: null,
      description: 'Chapters, Odia notes & Board Q&A',
    },
    {
      id: 'resources' as TabType,
      label: 'Academic Resources & Doubts',
      icon: BookOpenCheck,
      badge: pendingDoubtsCount > 0 ? `${pendingDoubtsCount} Doubts` : null,
      badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-600/40',
      description: 'PYQs, Bureau Books & Doubts Desk',
    },
    {
      id: 'mocktests' as TabType,
      label: 'Question Bank & Mocks',
      icon: FileCheck2,
      badge: `${publishedTestsCount} Live`,
      badgeColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-600/40',
      description: 'CHSE Blueprints & Leaderboards',
    },
    {
      id: 'payments' as TabType,
      label: 'Payment & UTR Desk',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} Review` : null,
      badgeColor: 'bg-rose-900/60 text-rose-300 border-rose-600/40',
      description: '12-Digit UTR audit & Access unlock',
    },
    {
      id: 'announcements' as TabType,
      label: 'Announcement Hub',
      icon: Megaphone,
      badge: `${activeAnnouncementsCount} Active`,
      badgeColor: 'bg-sky-900/60 text-sky-300 border-sky-600/40',
      description: 'Exam routines & urgent alerts',
    },
    {
      id: 'gateway' as TabType,
      label: 'Gateway & System Config',
      icon: Settings,
      badge: null,
      description: 'UPI VPA, Razorpay & Pricing tiers',
    },
    {
      id: 'security' as TabType,
      label: 'Security & Audit Logs',
      icon: ShieldAlert,
      badge: null,
      description: 'Zero-OTP audit & admin logs',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-35 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Stream Quick Indicator */}
          <div className="bg-slate-850 border border-slate-800 rounded-xl p-3 shadow-inner">
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2 flex items-center justify-between">
              <span>ODISHA +2 2ND YEAR</span>
              <Award className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-semibold">
              <div className="bg-sky-950/80 border border-sky-600/30 text-sky-300 rounded py-1">
                Science (₹149)
              </div>
              <div className="bg-emerald-950/80 border border-emerald-600/30 text-emerald-300 rounded py-1">
                Arts (₹99)
              </div>
              <div className="bg-amber-950/80 border border-amber-600/30 text-amber-300 rounded py-1">
                Comm (₹149)
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase px-2 mb-2">
              Central Administration
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileOpen?.(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                      }`}
                    />
                    <div className="truncate">
                      <div className="text-xs truncate">{item.label}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isActive ? 'text-emerald-100' : 'text-slate-500'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          isActive
                            ? 'bg-slate-950 text-emerald-300 border-slate-900'
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? 'text-white translate-x-0.5' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer System Policy Box */}
        <div className="p-3 m-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Cloud</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
              isSupabaseConnected
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : isSyncingSupabase
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isSupabaseConnected
                  ? 'bg-emerald-400 animate-pulse'
                  : isSyncingSupabase
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-400'
              }`} />
              {isSupabaseConnected ? 'Connected' : isSyncingSupabase ? 'Connecting...' : 'Offline'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-900 flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px]">CHSE Security Protocol</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Zero-OTP direct authentication. Registrations auto-generate{' '}
            <code className="text-emerald-300 font-mono bg-slate-900 px-1 py-0.2 rounded text-[9px]">MYCHSE-2026-XXXXX</code>.
          </p>
        </div>
      </aside>
    </>
  );
};
