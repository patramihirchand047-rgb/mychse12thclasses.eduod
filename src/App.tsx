import React, { useState } from 'react';
import {
  AdminDataProvider,
  useAdminData,
} from './context/AdminDataContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { OverviewDashboard } from './components/OverviewDashboard';
import { StudentVerificationQueue } from './components/StudentVerificationQueue';
import { StudentManagement } from './components/StudentManagement';
import { CourseManagement } from './components/CourseManagement';
import { MockTestManager } from './components/MockTestManager';
import { PaymentApprovals } from './components/PaymentApprovals';
import { AnnouncementHub } from './components/AnnouncementHub';
import { GatewaySystemConfig } from './components/GatewaySystemConfig';
import { AuditLogsSecurity } from './components/AuditLogsSecurity';
import { SupabaseSyncManager } from './components/SupabaseSyncManager';
import { AcademicResourceManager } from './components/AcademicResourceManager';

// Modals
import { DirectPasswordResetModal } from './components/modals/DirectPasswordResetModal';
import { StudentLoginSimulatorModal } from './components/modals/StudentLoginSimulatorModal';
import { StudentDetailModal } from './components/modals/StudentDetailModal';
import { AddStudentModal } from './components/modals/AddStudentModal';
import { AddLessonModal } from './components/modals/AddLessonModal';
import { CreateMockTestModal } from './components/modals/CreateMockTestModal';
import { RankingsModal } from './components/modals/RankingsModal';
import { ReceiptPreviewModal } from './components/modals/ReceiptPreviewModal';
import { CreateNoticeModal } from './components/modals/CreateNoticeModal';
import { LessonPreviewModal } from './components/modals/LessonPreviewModal';
import { ProfileSettingsModal } from './components/modals/ProfileSettingsModal';

import {
  Student,
  Lesson,
  MockTest,
  PaymentReceipt,
  NavigationTab,
  StreamType,
} from './types';
import {
  KeyRound,
  ShieldCheck,
  UserCheck,
  Sparkles,
  AlertTriangle,
  Database,
  GraduationCap,
} from 'lucide-react';
import { UserPanel } from './components/user_portal/UserPanel';

interface AdminPortalContentProps {
  onSwitchToUserPortal: () => void;
}

const AdminPortalContent: React.FC<AdminPortalContentProps> = ({ onSwitchToUserPortal }) => {
  const { isAuthenticated } = useAdminData();

  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [passwordResetRegNo, setPasswordResetRegNo] = useState<string>('');

  const [isLoginSimulatorOpen, setIsLoginSimulatorOpen] = useState(false);
  const [simulatorStudent, setSimulatorStudent] = useState<Student | undefined>(undefined);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [addLessonDefaultStream, setAddLessonDefaultStream] = useState<StreamType>('Science');
  const [addLessonDefaultSubject, setAddLessonDefaultSubject] = useState<string | undefined>(undefined);
  const [previewingLesson, setPreviewingLesson] = useState<Lesson | null>(null);

  const [isCreateMockTestOpen, setIsCreateMockTestOpen] = useState(false);
  const [rankingsTest, setRankingsTest] = useState<MockTest | null>(null);

  const [previewingReceipt, setPreviewingReceipt] = useState<PaymentReceipt | null>(null);
  const [isCreateNoticeOpen, setIsCreateNoticeOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

  // Handlers for modal interactions
  const handleOpenPasswordReset = (regNo?: string) => {
    setPasswordResetRegNo(regNo || '');
    setIsPasswordResetOpen(true);
  };

  const handleOpenLoginSimulator = (student?: Student) => {
    setSimulatorStudent(student);
    setIsLoginSimulatorOpen(true);
  };

  const handleAddLessonWithDefaults = (stream: StreamType, subject?: string) => {
    setAddLessonDefaultStream(stream);
    setAddLessonDefaultSubject(subject);
    setIsAddLessonOpen(true);
  };

  // If unauthenticated, show dedicated Admin Sign-In screen
  if (!isAuthenticated) {
    return <AdminLoginScreen onSwitchToUserPortal={onSwitchToUserPortal} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Zero-OTP Operational Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-1.5 px-4 text-xs font-bold flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-x-auto whitespace-nowrap">
          <span className="bg-slate-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
            CRITICAL SYSTEM POLICY
          </span>
          <span className="text-emerald-50">
            Zero-OTP Enforced: Student login & direct password resets strictly use official CHSE Registration Number (e.g., <code className="font-mono bg-emerald-900/80 text-emerald-200 px-1 py-0.2 rounded font-bold border border-emerald-500/40">MYCHSE-2026-XXXXX</code>). SMS OTP dependencies eliminated.
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            onClick={onSwitchToUserPortal}
            className="hover:underline text-[11px] font-black flex items-center gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-0.5 rounded border border-blue-400/40 shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Open Student User Portal</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveTab('supabase')}
            className="hover:underline text-[11px] font-black flex items-center gap-1 cursor-pointer bg-slate-900/80 px-2 py-0.5 rounded border border-emerald-400/30 text-emerald-200"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Supabase Cloud DB
          </button>
          <span>•</span>
          <button
            onClick={() => handleOpenLoginSimulator()}
            className="hover:underline text-[11px] font-black flex items-center gap-1 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Test Student Login
          </button>
        </div>
      </div>

      {/* Global Top Navbar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenPasswordReset={() => handleOpenPasswordReset()}
        onOpenLoginSimulator={() => handleOpenLoginSimulator()}
        onSelectStudent={(st) => setSelectedStudent(st)}
        onOpenProfileSettings={() => setIsProfileSettingsOpen(true)}
        onOpenSupabaseSync={() => setActiveTab('supabase')}
        onSwitchToUserPortal={onSwitchToUserPortal}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Center Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {activeTab === 'overview' && (
              <OverviewDashboard
                onSelectTab={(tab: NavigationTab) => setActiveTab(tab)}
                onOpenPasswordReset={handleOpenPasswordReset}
                onSelectStudent={(st) => setSelectedStudent(st)}
              />
            )}

            {activeTab === 'supabase' && (
              <SupabaseSyncManager
                onSelectStudent={(st) => setSelectedStudent(st)}
                onOpenPasswordReset={handleOpenPasswordReset}
              />
            )}

            {activeTab === 'queue' && (
              <StudentVerificationQueue />
            )}

            {activeTab === 'students' && (
              <StudentManagement
                onSelectStudent={(st) => setSelectedStudent(st)}
                onOpenPasswordReset={handleOpenPasswordReset}
                onOpenAddStudent={() => setIsAddStudentOpen(true)}
                onOpenLoginSimulator={handleOpenLoginSimulator}
              />
            )}

            {activeTab === 'courses' && (
              <CourseManagement
                onOpenAddLesson={(stream, subject) => handleAddLessonWithDefaults(stream || 'Science', subject)}
                onPreviewLesson={(lesson) => setPreviewingLesson(lesson)}
              />
            )}

            {activeTab === 'resources' && (
              <AcademicResourceManager />
            )}

            {activeTab === 'mocktests' && (
              <MockTestManager
                onOpenCreateTest={() => setIsCreateMockTestOpen(true)}
                onViewRankings={(test) => setRankingsTest(test)}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentApprovals
                onPreviewReceipt={(receipt) => setPreviewingReceipt(receipt)}
              />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementHub
                onOpenCreateNotice={() => setIsCreateNoticeOpen(true)}
              />
            )}

            {activeTab === 'gateway' && (
              <GatewaySystemConfig />
            )}

            {activeTab === 'security' && (
              <AuditLogsSecurity />
            )}

          </div>
        </main>
      </div>

      {/* Modals */}
      <DirectPasswordResetModal
        isOpen={isPasswordResetOpen}
        prefillRegNo={passwordResetRegNo}
        onClose={() => setIsPasswordResetOpen(false)}
        onOpenLoginSimulator={handleOpenLoginSimulator}
      />

      <StudentLoginSimulatorModal
        isOpen={isLoginSimulatorOpen}
        initialStudent={simulatorStudent}
        onClose={() => setIsLoginSimulatorOpen(false)}
      />

      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onOpenPasswordReset={handleOpenPasswordReset}
        onOpenLoginSimulator={handleOpenLoginSimulator}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />

      <AddLessonModal
        isOpen={isAddLessonOpen}
        defaultStream={addLessonDefaultStream}
        defaultSubject={addLessonDefaultSubject}
        onClose={() => setIsAddLessonOpen(false)}
      />

      <CreateMockTestModal
        isOpen={isCreateMockTestOpen}
        onClose={() => setIsCreateMockTestOpen(false)}
      />

      <RankingsModal
        test={rankingsTest}
        onClose={() => setRankingsTest(null)}
      />

      <ReceiptPreviewModal
        receipt={previewingReceipt}
        onClose={() => setPreviewingReceipt(null)}
      />

      <CreateNoticeModal
        isOpen={isCreateNoticeOpen}
        onClose={() => setIsCreateNoticeOpen(false)}
      />

      <LessonPreviewModal
        lesson={previewingLesson}
        onClose={() => setPreviewingLesson(null)}
      />

      <ProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
      />

    </div>
  );
};

const MainAppContainer: React.FC = () => {
  const [portalMode, setPortalMode] = useState<'user' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mode') === 'admin' || window.location.hash.includes('admin')) {
        return 'admin';
      }
      const saved = localStorage.getItem('CHSE_ACTIVE_PORTAL_MODE');
      if (saved === 'admin' || saved === 'user') {
        return saved;
      }
    }
    // Default to 'user' so student portal is primary, but easy to toggle
    return 'user';
  });

  const handleSwitchMode = (mode: 'user' | 'admin') => {
    setPortalMode(mode);
    localStorage.setItem('CHSE_ACTIVE_PORTAL_MODE', mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (portalMode === 'admin') {
    return <AdminPortalContent onSwitchToUserPortal={() => handleSwitchMode('user')} />;
  }

  return <UserPanel onSwitchToAdmin={() => handleSwitchMode('admin')} />;
};

export default function App() {
  return (
    <AdminDataProvider>
      <MainAppContainer />
    </AdminDataProvider>
  );
}
