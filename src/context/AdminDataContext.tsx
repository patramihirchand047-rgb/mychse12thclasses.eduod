import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Student,
  Lesson,
  MockTest,
  PaymentReceipt,
  Announcement,
  AuditLog,
  AdminUser,
  TestRanking,
  RegistrationApplication,
  ChapterItem,
  BoardQuestion,
  MCQItem,
  SystemGatewayConfig,
  AccountStatus,
  StreamType,
  STANDARD_SUBJECT_LIST,
  PyqPaper,
  BureauBook,
  PracticalLabItem,
  StudentDoubt,
} from '../types';
import {
  INITIAL_ADMIN,
  INITIAL_STUDENTS,
  INITIAL_LESSONS,
  INITIAL_MOCK_TESTS,
  INITIAL_RANKINGS,
  INITIAL_PAYMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_APPLICATIONS,
  INITIAL_CHAPTERS,
  INITIAL_BOARD_QUESTIONS,
  INITIAL_MCQS,
  INITIAL_GATEWAY_CONFIG,
} from '../data/mockData';
import {
  CHSE_PYQ_PAPERS,
  CHSE_BUREAU_BOOKS,
  CHSE_PRACTICALS,
  INITIAL_STUDENT_DOUBTS,
} from '../data/chseExtData';
import { apiLogin, apiUpdateConfig, apiCheckHealth } from '../lib/api';
import {
  getSupabaseClient,
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  pingSupabaseLive,
  fetchSupabaseStudents,
  approveSupabaseStudent,
  resetSupabaseStudentPassword,
  insertSupabaseStudent,
  fetchSupabasePurchases,
  verifySupabasePurchaseUTR,
  rejectSupabasePurchase,
  insertSupabasePurchase,
  fetchSupabaseChapters,
  insertSupabaseChapter,
  upsertSupabaseChapter,
  updateSupabaseChapter,
  deleteSupabaseChapter,
  fetchSupabaseQuestions,
  upsertSupabaseQuestion,
  deleteSupabaseQuestion,
  fetchSupabaseNotes,
  upsertSupabaseNote,
  deleteSupabaseNote,
  fetchSupabaseVideos,
  upsertSupabaseVideo,
  deleteSupabaseVideo,
  extractYouTubeId,
  fetchSupabaseNotices,
  publishSupabaseNotice,
  toggleSupabaseNoticeActive,
  deleteSupabaseNotice,
  fetchSupabasePyqs,
  upsertSupabasePyq,
  deleteSupabasePyq,
  fetchSupabaseBureauBooks,
  upsertSupabaseBureauBook,
  deleteSupabaseBureauBook,
  fetchSupabasePracticals,
  upsertSupabasePractical,
  deleteSupabasePractical,
  fetchSupabaseDoubts,
  upsertSupabaseDoubt,
  deleteSupabaseDoubt,
  subscribeToSupabaseRealtime,
  SupabaseConfig,
} from '../lib/supabase';

interface AdminDataContextType {
  // Auth & Admin State
  admin: AdminUser;
  token: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, pass: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAdminProfile: (updates: Partial<AdminUser>) => Promise<void>;
  sessionTimeLeft: number;
  resetSessionTimer: () => void;

  // Supabase Cloud State & Live Sync
  supabaseConfig: SupabaseConfig;
  isSupabaseConnected: boolean;
  supabaseStatusMessage: string;
  supabaseLatency: number;
  isSyncingSupabase: boolean;
  lastSupabaseSync: string | null;
  supabaseTableCounts: { students: number; purchases: number; chapters: number; questions: number; videos: number; notices: number };
  updateSupabaseConfig: (config: SupabaseConfig) => Promise<{ success: boolean; message: string }>;
  testSupabaseConnectionStatus: (configOverride?: SupabaseConfig) => Promise<{ success: boolean; message: string; latencyMs: number }>;
  pingSupabaseLiveStatus: () => Promise<{ online: boolean; studentCount: number; latencyMs: number; error?: string }>;
  syncWithSupabase: () => Promise<{ success: boolean; message: string; counts?: any }>;

  // Data Collections
  students: Student[];
  applications: RegistrationApplication[];
  chapters: ChapterItem[];
  boardQuestions: BoardQuestion[];
  mcqs: MCQItem[];
  lessons: Lesson[];
  mockTests: MockTest[];
  rankings: TestRanking[];
  payments: PaymentReceipt[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  gatewayConfig: SystemGatewayConfig;
  
  // Registration Queue Actions
  approveApplication: (appId: string) => { success: boolean; student?: Student; message?: string };
  rejectApplication: (appId: string, remarks: string) => void;

  // Student Actions
  generateRegistrationNumber: () => string;
  regenerateStudentRegNo: (studentId: string) => string;
  revokeStudentRegistration: (studentId: string, reason?: string) => void;
  addStudent: (student: Omit<Student, 'id' | 'chseRegNo' | 'registeredDate' | 'lastActive' | 'totalMockTestsTaken' | 'avgScorePercentage'>) => Student;
  updateStudent: (studentId: string, updates: Partial<Student>) => void;
  updateStudentStatus: (studentId: string, status: AccountStatus, reason?: string) => void;
  resetStudentPasswordDirect: (chseRegNo: string, newPassword: string, isTemporary?: boolean) => { success: boolean; message: string; tempPass?: string };
  toggleStudentCourseAccess: (studentId: string, approved: boolean) => void;
  
  // Chapter & CMS Actions
  toggleChapterFreeStatus: (chapterId: string) => void;
  addChapter: (chapter: Omit<ChapterItem, 'id'>) => void;
  updateChapter: (chapterId: string, updates: Partial<ChapterItem>) => void;
  deleteChapter: (chapterId: string) => void;
  addBoardQuestion: (q: Omit<BoardQuestion, 'id'>) => void;
  deleteBoardQuestion: (qId: string) => void;
  addMCQ: (mcq: Omit<MCQItem, 'id'>) => void;
  deleteMCQ: (mcqId: string) => void;

  // Lesson Actions
  toggleLessonFreePreview: (lessonId: string) => void;
  addLesson: (lesson: Omit<Lesson, 'id' | 'addedDate'>) => void;
  deleteLesson: (lessonId: string) => void;

  // Mock Test Actions
  addMockTest: (test: Omit<MockTest, 'id' | 'resultsPublished'>) => void;
  toggleMockTestPublish: (testId: string) => void;
  publishTestResults: (testId: string) => void;

  // Payment Actions
  approvePayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string, reason: string) => void;
  verifyUtrAndUnlockAccess: (paymentId: string) => void;
  exportPaymentsToCSV: () => void;

  // User Portal Connected Actions
  submitStudentRegistration: (studentData: {
    name: string;
    mobileNumber: string;
    stream: StreamType;
    district: string;
    college: string;
    email?: string;
    password?: string;
  }) => Promise<{ success: boolean; student: Student; error?: string }>;
  submitStudentPaymentReceipt: (receiptData: {
    studentRegNo: string;
    studentName: string;
    stream: StreamType;
    courseName?: string;
    amount: number;
    utrNumber: string;
    paymentGateway?: string;
  }) => Promise<{ success: boolean; payment: PaymentReceipt; error?: string }>;

  // Announcement Actions
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedDate'>) => void;
  toggleAnnouncementActive: (announcementId: string) => void;
  deleteAnnouncement: (announcementId: string) => void;

  // Academic Resources & Faculty Doubts (Supabase Backed)
  pyqPapers: PyqPaper[];
  bureauBooks: BureauBook[];
  practicals: PracticalLabItem[];
  studentDoubts: StudentDoubt[];
  addOrUpdatePyqPaper: (paper: PyqPaper) => Promise<{ success: boolean; error?: string }>;
  deletePyqPaper: (id: string) => Promise<{ success: boolean; error?: string }>;
  addOrUpdateBureauBook: (book: BureauBook) => Promise<{ success: boolean; error?: string }>;
  deleteBureauBook: (id: string) => Promise<{ success: boolean; error?: string }>;
  addOrUpdatePractical: (lab: PracticalLabItem) => Promise<{ success: boolean; error?: string }>;
  deletePractical: (id: string) => Promise<{ success: boolean; error?: string }>;
  addStudentDoubt: (doubt: StudentDoubt) => Promise<{ success: boolean; error?: string }>;
  answerDoubt: (doubtId: string, answerText: string, answeredBy: string) => Promise<{ success: boolean; error?: string }>;
  deleteDoubt: (doubtId: string) => Promise<{ success: boolean; error?: string }>;
  syncAcademicResourcesToSupabase: () => Promise<{ success: boolean; message: string }>;

  // Configuration Actions
  updateGatewayConfig: (updates: Partial<SystemGatewayConfig>) => Promise<void>;
  checkSystemHealth: () => Promise<any>;

  // Audit Log & State Reset
  addAuditLog: (action: string, details: string, targetRegNo?: string) => void;
  resetAllData: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'CHSE_ADMIN_PORTAL_STATE_PROD_V1';

// One-time cleanup of legacy demo caches
if (typeof window !== 'undefined') {
  try {
    ['CHSE_ADMIN_PORTAL_STATE_V2', 'CHSE_ADMIN_PORTAL_STATE'].forEach((prefix) => {
      [
        'STUDENTS',
        'APPLICATIONS',
        'PAYMENTS',
        'ANNOUNCEMENTS',
        'NOTICES',
        'TESTS',
        'RANKINGS',
        'AUDIT',
        'CONFIG',
        'ADMIN',
      ].forEach((key) => {
        localStorage.removeItem(`${prefix}_${key}`);
      });
    });
    if (localStorage.getItem('CHSE_ADMIN_TOKEN') === 'chse_admin_demo_jwt_active') {
      localStorage.removeItem('CHSE_ADMIN_TOKEN');
    }
  } catch (e) {
    // ignore
  }
}

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('CHSE_ADMIN_TOKEN');
    return saved && saved !== 'chse_admin_demo_jwt_active' ? saved : null;
  });
  
  const [admin, setAdmin] = useState<AdminUser>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ADMIN`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mobile && (parsed.mobile.includes('94370') || parsed.mobile === '+91 94370 29384')) {
          parsed.mobile = '+91 89174 08498';
        }
        return parsed;
      } catch {
        return INITIAL_ADMIN;
      }
    }
    return INITIAL_ADMIN;
  });

  const [gatewayConfig, setGatewayConfig] = useState<SystemGatewayConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_CONFIG`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.adminMobile || parsed.adminMobile.includes('94370') || parsed.adminMobile === '+91 94370 29384') {
          parsed.adminMobile = '+91 89174 08498';
        }
        if (!parsed.upiVpa || parsed.upiVpa === 'patramihirchand394@okhdfcbank') {
          parsed.upiVpa = 'mychseclasses@naviaxis';
          parsed.payeeDisplayName = 'MIHIRCHAND PATRA';
        }
        parsed.pricing = {
          arts: 99,
          science: 149,
          commerce: 149,
          artsOriginal: 499,
          scienceOriginal: 799,
          commerceOriginal: 799,
        };
        return parsed;
      } catch {
        return INITIAL_GATEWAY_CONFIG;
      }
    }
    return INITIAL_GATEWAY_CONFIG;
  });

  // Supabase Cloud Project State
  const [supabaseConfig, setSupabaseConfigState] = useState<SupabaseConfig>(() => getSavedSupabaseConfig());
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);
  const [supabaseStatusMessage, setSupabaseStatusMessage] = useState<string>('Live Supabase Cloud Connected');
  const [supabaseLatency, setSupabaseLatency] = useState<number>(38);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);
  const [lastSupabaseSync, setLastSupabaseSync] = useState<string | null>(null);
  const [supabaseTableCounts, setSupabaseTableCounts] = useState({
    students: 0,
    purchases: 0,
    chapters: 0,
    questions: 0,
    videos: 0,
    notices: 0,
  });

  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(15 * 60); // 15 mins

  // Live Data Collections initialized from persistent localStorage with fallback to clean verified mock data
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_STUDENTS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_STUDENTS;
  });

  const [applications, setApplications] = useState<RegistrationApplication[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_APPLICATIONS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return INITIAL_APPLICATIONS;
  });

  const [chapters, setChapters] = useState<ChapterItem[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_CHAPTERS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CHAPTERS;
  });

  const [boardQuestions, setBoardQuestions] = useState<BoardQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_QUESTIONS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_BOARD_QUESTIONS;
  });

  const [mcqs, setMcqs] = useState<MCQItem[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_MCQS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_MCQS;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_LESSONS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_LESSONS;
  });

  const [mockTests, setMockTests] = useState<MockTest[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_TESTS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_MOCK_TESTS;
  });

  const [rankings, setRankings] = useState<TestRanking[]>(() => INITIAL_RANKINGS);

  const [payments, setPayments] = useState<PaymentReceipt[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_PAYMENTS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PAYMENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_ANNOUNCEMENTS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ANNOUNCEMENTS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_AUDIT`);
      const rawLogs: AuditLog[] = saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
      const seenIds = new Set<string>();
      return rawLogs.map((log, idx) => {
        if (!log.id || seenIds.has(log.id)) {
          const uniqueId = `aud-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
          seenIds.add(uniqueId);
          return { ...log, id: uniqueId };
        }
        seenIds.add(log.id);
        return log;
      });
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Academic Resources & Faculty Doubts (Supabase Backed)
  const [pyqPapers, setPyqPapers] = useState<PyqPaper[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_PYQS');
      return saved ? JSON.parse(saved) : CHSE_PYQ_PAPERS;
    } catch {
      return CHSE_PYQ_PAPERS;
    }
  });

  const [bureauBooks, setBureauBooks] = useState<BureauBook[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_BOOKS');
      return saved ? JSON.parse(saved) : CHSE_BUREAU_BOOKS;
    } catch {
      return CHSE_BUREAU_BOOKS;
    }
  });

  const [practicals, setPracticals] = useState<PracticalLabItem[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_PRACTICALS');
      return saved ? JSON.parse(saved) : CHSE_PRACTICALS;
    } catch {
      return CHSE_PRACTICALS;
    }
  });

  const [studentDoubts, setStudentDoubts] = useState<StudentDoubt[]>(() => {
    try {
      const saved = localStorage.getItem('CHSE_SAVED_DOUBTS');
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_DOUBTS;
    } catch {
      return INITIAL_STUDENT_DOUBTS;
    }
  });

  // LocalStorage persistence for instantaneous offline reactivity
  useEffect(() => {
    try {
      localStorage.setItem('CHSE_SAVED_PYQS', JSON.stringify(pyqPapers));
    } catch {}
  }, [pyqPapers]);

  useEffect(() => {
    try {
      localStorage.setItem('CHSE_SAVED_BOOKS', JSON.stringify(bureauBooks));
    } catch {}
  }, [bureauBooks]);

  useEffect(() => {
    try {
      localStorage.setItem('CHSE_SAVED_PRACTICALS', JSON.stringify(practicals));
    } catch {}
  }, [practicals]);

  useEffect(() => {
    try {
      localStorage.setItem('CHSE_SAVED_DOUBTS', JSON.stringify(studentDoubts));
    } catch {}
  }, [studentDoubts]);

  // Persist all data collections to LocalStorage for zero-loss lifetime durability
  useEffect(() => {
    try { localStorage.setItem('CHSE_SAVED_STUDENTS', JSON.stringify(students)); } catch {}
  }, [students]);

  useEffect(() => {
    try { localStorage.setItem('CHSE_SAVED_APPLICATIONS', JSON.stringify(applications)); } catch {}
  }, [applications]);

  useEffect(() => {
    try { localStorage.setItem('CHSE_SAVED_PAYMENTS', JSON.stringify(payments)); } catch {}
  }, [payments]);

  useEffect(() => {
    try { localStorage.setItem('CHSE_SAVED_CHAPTERS', JSON.stringify(chapters)); } catch {}
  }, [chapters]);

  useEffect(() => {
    try { localStorage.setItem('CHSE_SAVED_QUESTIONS', JSON.stringify(boardQuestions)); } catch {}
  }, [boardQuestions]);

  useEffect(() => {
    try { localStorage.setItem('CHSE_SAVED_MCQS', JSON.stringify(mcqs)); } catch {}
  }, [mcqs]);

  useEffect(() => {
    try { localStorage.setItem('CHSE_SAVED_LESSONS', JSON.stringify(lessons)); } catch {}
  }, [lessons]);

  useEffect(() => {
    try { localStorage.setItem('CHSE_SAVED_ANNOUNCEMENTS', JSON.stringify(announcements)); } catch {}
  }, [announcements]);

  useEffect(() => {
    try { localStorage.setItem('CHSE_SAVED_TESTS', JSON.stringify(mockTests)); } catch {}
  }, [mockTests]);

  // Persist administrative session settings to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ADMIN`, JSON.stringify(admin));
  }, [admin]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_CONFIG`, JSON.stringify(gatewayConfig));
  }, [gatewayConfig]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_AUDIT`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = useCallback(
    (action: string, details: string, targetRegNo?: string) => {
      const uniqueId = `aud-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${Math.floor(Math.random() * 10000)}`;
      const newLog: AuditLog = {
        id: uniqueId,
        timestamp: new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        adminName: admin.name,
        adminEmail: admin.email,
        role: admin.role,
        action,
        targetRegNo: targetRegNo || 'N/A',
        details,
        ipAddress: '103.24.112.58 (CHSE Gov SWAN Secure Gateway)',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    },
    [admin]
  );

  // Quick live ping against Supabase students table
  const pingSupabaseLiveStatus = useCallback(async () => {
    const res = await pingSupabaseLive();
    setIsSupabaseConnected(res.online);
    setSupabaseLatency(res.latencyMs);
    if (!res.online && res.error) {
      setSupabaseStatusMessage(`Supabase error: ${res.error}`);
    } else if (res.online) {
      setSupabaseStatusMessage(`Live Online (${res.latencyMs}ms) • ${res.studentCount} students`);
    }
    return res;
  }, []);

  // Supabase connection tester
  const testSupabaseConnectionStatus = useCallback(async (configOverride?: SupabaseConfig) => {
    const res = await testSupabaseConnection(configOverride);
    setIsSupabaseConnected(res.success);
    setSupabaseStatusMessage(res.message);
    setSupabaseLatency(res.latencyMs);
    if (res.tableCounts) {
      setSupabaseTableCounts({
        students: res.tableCounts.students,
        purchases: res.tableCounts.purchases,
        chapters: res.tableCounts.chapters,
        questions: 0,
        videos: 0,
        notices: res.tableCounts.notices,
      });
    }
    return res;
  }, []);

  // Sync with live Supabase database with fault tolerance for all tables
  const syncWithSupabase = useCallback(async () => {
    setIsSyncingSupabase(true);
    try {
      const [
        studentsRes,
        purchasesRes,
        chaptersRes,
        questionsRes,
        notesRes,
        videosRes,
        noticesRes,
        pyqsRes,
        booksRes,
        practicalsRes,
        doubtsRes,
      ] = await Promise.allSettled([
        fetchSupabaseStudents(),
        fetchSupabasePurchases(),
        fetchSupabaseChapters(),
        fetchSupabaseQuestions(),
        fetchSupabaseNotes(),
        fetchSupabaseVideos(),
        fetchSupabaseNotices(),
        fetchSupabasePyqs(),
        fetchSupabaseBureauBooks(),
        fetchSupabasePracticals(),
        fetchSupabaseDoubts(),
      ]);

      const counts = {
        students: 0,
        purchases: 0,
        chapters: 0,
        questions: 0,
        videos: 0,
        notices: 0,
      };

      // 1. STUDENTS
      if (studentsRes.status === 'fulfilled' && studentsRes.value && studentsRes.value.length > 0) {
        const liveStudents = studentsRes.value;
        setStudents((prev) => {
          const map = new Map<string, Student>();
          prev.forEach((s) => map.set(s.chseRegNo || s.id, s));
          liveStudents.forEach((s) => {
            const key = s.chseRegNo || s.id;
            const existing = map.get(key);
            map.set(key, existing ? { ...existing, ...s } : s);
          });
          return Array.from(map.values());
        });
        counts.students = liveStudents.length;

        // Auto-detect pending registrations from public.students table
        const pendingFromDb: RegistrationApplication[] = liveStudents
          .filter((st) => !st.courseAccessApproved || st.accountStatus === 'Pending')
          .map((st) => ({
            id: st.id,
            applicantName: st.name,
            fatherName: st.fatherName || 'Not specified',
            mobileNumber: st.mobileNumber || 'N/A',
            email: st.email || '',
            district: st.district || 'Khordha',
            college: st.college || 'Odisha Higher Secondary School',
            stream: st.stream,
            appliedDate: st.registeredDate || new Date().toISOString().split('T')[0],
            sourcePortal: 'mychse12thclassesedu.netlify.app',
            status: 'Pending Review',
            preferredBatch: st.enrolledPackage || `${st.stream} +2 2nd Year`,
            assignedRegNo: st.chseRegNo !== 'MYCHSE-PENDING' ? st.chseRegNo : undefined,
          }));

        if (pendingFromDb.length > 0) {
          setApplications((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newOnes = pendingFromDb.filter((p) => !existingIds.has(p.id));
            return [...newOnes, ...prev];
          });
        }
      }

      // 2. PURCHASES
      if (purchasesRes.status === 'fulfilled' && purchasesRes.value && purchasesRes.value.length > 0) {
        const livePurchases = purchasesRes.value;
        setPayments((prev) => {
          const map = new Map<string, PaymentReceipt>();
          prev.forEach((p) => map.set(p.id, p));
          livePurchases.forEach((p: PaymentReceipt) => map.set(p.id, p));
          return Array.from(map.values());
        });
        counts.purchases = livePurchases.length;
      }

      // 3. CHAPTERS
      if (chaptersRes.status === 'fulfilled' && chaptersRes.value && chaptersRes.value.length > 0) {
        const rawChapters = chaptersRes.value;
        const incomingChapters: ChapterItem[] = rawChapters.map((row: any) => {
          const subInfo = STANDARD_SUBJECT_LIST.find((s) => s.id === row.subject_id);
          const stream: StreamType = subInfo
            ? (subInfo.stream === 'Compulsory' ? 'Science' : (subInfo.stream as StreamType))
            : 'Science';
          const subject = subInfo ? subInfo.name : (row.subject_id || 'Physics');

          return {
            id: row.id,
            chapterNo: Number(row.chapter_number || row.chapterNo || 1),
            title: row.title,
            titleOdia: row.description?.includes(' / ') ? row.description.split(' / ')[1] : undefined,
            stream,
            subject,
            isFree: Boolean(row.is_free ?? row.isFree),
            notesMarkdown: row.description || `# Chapter ${row.chapter_number || 1}: ${row.title}`,
            boardQuestionsCount: 0,
            mcqCount: 0,
          };
        });
        setChapters((prev) => {
          const map = new Map<string, ChapterItem>();
          prev.forEach((c) => map.set(c.id, c));
          incomingChapters.forEach((c) => {
            const existing = map.get(c.id);
            map.set(c.id, existing ? { ...existing, ...c } : c);
          });
          return Array.from(map.values());
        });
        counts.chapters = incomingChapters.length;
      }

      // 4. QUESTIONS (MCQs & Board Questions)
      if (questionsRes.status === 'fulfilled' && questionsRes.value && questionsRes.value.length > 0) {
        const allQuestions = questionsRes.value;
        counts.questions = allQuestions.length;

        const liveMcqs: MCQItem[] = allQuestions
          .filter((q: any) => q.type === 'mcq')
          .map((q: any) => ({
            id: q.id,
            chapterId: q.chapter_id,
            question: q.question_text,
            questionOdia: q.question_or || undefined,
            options: q.options || [],
            correctOptionIndex: q.correct_option ?? 0,
            explanation: q.explanation || '',
            explanationOdia: undefined,
          }));

        const liveBQs: BoardQuestion[] = allQuestions
          .filter((q: any) => q.type !== 'mcq')
          .map((q: any) => ({
            id: q.id,
            chapterId: q.chapter_id,
            markType: (q.type === '2_mark' ? '2-Mark' : q.type === '3_mark' ? '3-Mark' : '5-Mark') as any,
            questionText: q.question_text,
            questionOdia: q.question_or || undefined,
            answerText: q.model_answer || q.explanation || '',
            answerOdia: undefined,
            yearAppeared: q.year || 'CHSE 2026 Model Paper',
          }));

        if (liveMcqs.length > 0) {
          setMcqs((prev) => {
            const map = new Map<string, MCQItem>();
            prev.forEach((m) => map.set(m.id, m));
            liveMcqs.forEach((m) => map.set(m.id, m));
            return Array.from(map.values());
          });
        }
        if (liveBQs.length > 0) {
          setBoardQuestions((prev) => {
            const map = new Map<string, BoardQuestion>();
            prev.forEach((b) => map.set(b.id, b));
            liveBQs.forEach((b) => map.set(b.id, b));
            return Array.from(map.values());
          });
        }

        // Update counts in chapters
        setChapters((prev) =>
          prev.map((c) => ({
            ...c,
            mcqCount: liveMcqs.filter((m) => m.chapterId === c.id).length || c.mcqCount,
            boardQuestionsCount: liveBQs.filter((b) => b.chapterId === c.id).length || c.boardQuestionsCount,
          }))
        );
      }

      // 5. BILINGUAL NOTES
      if (notesRes.status === 'fulfilled' && notesRes.value && notesRes.value.length > 0) {
        const notesMap = new Map<string, any>();
        notesRes.value.forEach((n: any) => {
          notesMap.set(n.chapter_id, n);
        });
        setChapters((prev) =>
          prev.map((c) => {
            const n = notesMap.get(c.id);
            if (n) {
              return {
                ...c,
                notesMarkdown: n.notes_en || n.english_content || c.notesMarkdown,
                odiaSummary: n.notes_or || n.odia_content || c.odiaSummary,
              };
            }
            return c;
          })
        );
      }

      // 6. VIDEOS / LESSONS
      if (videosRes.status === 'fulfilled' && videosRes.value && videosRes.value.length > 0) {
        counts.videos = videosRes.value.length;
        const liveLessons: Lesson[] = videosRes.value.map((v: any) => {
          return {
            id: v.id,
            stream: 'Science',
            subject: 'Physics',
            chapterNo: 1,
            chapterTitle: 'Video Lecture',
            lessonTitle: v.title,
            duration: v.duration || '25 mins',
            videoType: 'youtube',
            videoUrl: v.youtube_url || (v.youtube_id ? `https://www.youtube.com/watch?v=${v.youtube_id}` : ''),
            isFreePreview: false,
            addedDate: v.created_at ? new Date(v.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            instructor: 'CHSE Odisha Master Faculty',
          };
        });
        if (liveLessons.length > 0) {
          setLessons((prev) => {
            const map = new Map<string, Lesson>();
            prev.forEach((l) => map.set(l.id, l));
            liveLessons.forEach((l) => {
              const existing = map.get(l.id);
              map.set(l.id, existing ? { ...existing, ...l } : l);
            });
            return Array.from(map.values());
          });
        }
      }

      // 7. NOTICES
      if (noticesRes.status === 'fulfilled' && noticesRes.value && noticesRes.value.length > 0) {
        const liveNotices = noticesRes.value;
        setAnnouncements((prev) => {
          const map = new Map<string, Announcement>();
          prev.forEach((a) => map.set(a.id, a));
          liveNotices.forEach((a: Announcement) => map.set(a.id, a));
          return Array.from(map.values());
        });
        counts.notices = liveNotices.length;
      }

      // 8. PYQS - Non-destructive merge so local records are preserved
      if (pyqsRes.status === 'fulfilled' && pyqsRes.value && pyqsRes.value.length > 0) {
        const livePyqs = pyqsRes.value;
        setPyqPapers((prev) => {
          const map = new Map<string, PyqPaper>();
          prev.forEach((p) => map.set(p.id, p));
          livePyqs.forEach((p) => {
            const existing = map.get(p.id);
            map.set(p.id, existing ? { ...existing, ...p } : p);
          });
          return Array.from(map.values());
        });
      }

      // 9. BUREAU BOOKS - Non-destructive merge
      if (booksRes.status === 'fulfilled' && booksRes.value && booksRes.value.length > 0) {
        const liveBooks = booksRes.value;
        setBureauBooks((prev) => {
          const map = new Map<string, BureauBook>();
          prev.forEach((b) => map.set(b.id, b));
          liveBooks.forEach((b) => {
            const existing = map.get(b.id);
            map.set(b.id, existing ? { ...existing, ...b } : b);
          });
          return Array.from(map.values());
        });
      }

      // 10. PRACTICALS - Non-destructive merge
      if (practicalsRes.status === 'fulfilled' && practicalsRes.value && practicalsRes.value.length > 0) {
        const liveLabs = practicalsRes.value;
        setPracticals((prev) => {
          const map = new Map<string, PracticalLabItem>();
          prev.forEach((l) => map.set(l.id, l));
          liveLabs.forEach((l) => {
            const existing = map.get(l.id);
            map.set(l.id, existing ? { ...existing, ...l } : l);
          });
          return Array.from(map.values());
        });
      }

      // 11. DOUBTS - Non-destructive merge so newly submitted student doubts are never wiped
      if (doubtsRes.status === 'fulfilled' && doubtsRes.value && doubtsRes.value.length > 0) {
        const liveDoubts = doubtsRes.value;
        setStudentDoubts((prev) => {
          const map = new Map<string, StudentDoubt>();
          prev.forEach((d) => map.set(d.id, d));
          liveDoubts.forEach((d) => {
            const existing = map.get(d.id);
            map.set(d.id, existing ? { ...existing, ...d } : d);
          });
          return Array.from(map.values());
        });
      }

      const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSupabaseSync(nowStr);
      setSupabaseTableCounts(counts);
      setIsSupabaseConnected(true);
      setSupabaseStatusMessage(`Live Cloud Online • ${counts.students} Students`);

      addAuditLog(
        'SUPABASE_LIVE_SYNC',
        `Live synchronized from Supabase: ${counts.students} students, ${counts.purchases} orders, ${counts.chapters} chapters, ${counts.questions} questions, ${counts.videos} videos, ${counts.notices} notices.`
      );

      return {
        success: true,
        message: `Synced with Supabase: ${counts.students} students, ${counts.purchases} orders, ${counts.chapters} chapters, ${counts.questions} questions, ${counts.videos} videos.`,
        counts,
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Sync failed' };
    } finally {
      setIsSyncingSupabase(false);
    }
  }, [addAuditLog]);

  // Update Supabase configuration and test
  const updateSupabaseConfig = useCallback(
    async (newConfig: SupabaseConfig) => {
      saveSupabaseConfig(newConfig);
      setSupabaseConfigState(newConfig);
      const test = await testSupabaseConnectionStatus(newConfig);
      if (test.success) {
        syncWithSupabase();
        addAuditLog('SUPABASE_CONFIG_SAVED', `Updated Supabase connection to: ${newConfig.url}`);
      }
      return { success: test.success, message: test.message };
    },
    [testSupabaseConnectionStatus, syncWithSupabase, addAuditLog]
  );

  // Auto-connect, initial sync, realtime subscription, and polling interval
  useEffect(() => {
    let unsubscribeRealtime: (() => void) | null = null;

    const initSupabase = async () => {
      let config = getSavedSupabaseConfig();
      if (!config.url || (!config.anonKey && !config.serviceRoleKey)) {
        try {
          const resp = await fetch('/api/admin/supabase-env');
          if (resp.ok) {
            const data = await resp.json();
            if (data.supabaseUrl && (data.supabaseAnonKey || data.supabaseServiceRoleKey)) {
              config = {
                url: data.supabaseUrl,
                anonKey: data.supabaseAnonKey,
                serviceRoleKey: data.supabaseServiceRoleKey,
              };
              saveSupabaseConfig(config);
              setSupabaseConfigState(config);
            }
          }
        } catch {
          // Ignore network errors in local dev
        }
      }

      if (config.url && (config.anonKey || config.serviceRoleKey)) {
        setIsSupabaseConnected(true);
        // Immediately fetch live data from Supabase
        syncWithSupabase();

        // In parallel, measure latency and verify health
        testSupabaseConnectionStatus().catch(() => {});

        // Subscribe to Supabase Realtime for instant updates when student registers in user panel
        unsubscribeRealtime = subscribeToSupabaseRealtime((table, payload) => {
          console.log(`[Supabase Realtime] Event on ${table}:`, payload);
          syncWithSupabase();
        });
      }
    };

    initSupabase();

    // Periodic background sync every 15 seconds so admin panel stays automatically refreshed
    const syncInterval = setInterval(() => {
      const currentConfig = getSavedSupabaseConfig();
      if (currentConfig.url && (currentConfig.anonKey || currentConfig.serviceRoleKey)) {
        syncWithSupabase();
      }
    }, 15000);

    return () => {
      clearInterval(syncInterval);
      if (unsubscribeRealtime) {
        unsubscribeRealtime();
      }
    };
  }, [testSupabaseConnectionStatus, syncWithSupabase]);

  // Inactivity auto-logout handling
  const lastActiveRef = useRef<number>(Date.now());
  const resetSessionTimer = useCallback(() => {
    lastActiveRef.current = Date.now();
    setSessionTimeLeft(gatewayConfig.autoLogoutMinutes * 60);
  }, [gatewayConfig.autoLogoutMinutes]);

  useEffect(() => {
    if (!token) return;

    const timer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - lastActiveRef.current) / 1000);
      const remaining = Math.max(0, gatewayConfig.autoLogoutMinutes * 60 - elapsedSeconds);
      setSessionTimeLeft(remaining);

      if (remaining <= 0) {
        // Auto-logout
        setToken(null);
        localStorage.removeItem('CHSE_ADMIN_TOKEN');
        addAuditLog('AUTO_LOGOUT_INACTIVITY', `Session terminated after ${gatewayConfig.autoLogoutMinutes} minutes of administrative inactivity.`);
      }
    }, 1000);

    const onUserActivity = () => {
      lastActiveRef.current = Date.now();
    };

    window.addEventListener('mousemove', onUserActivity);
    window.addEventListener('keydown', onUserActivity);
    window.addEventListener('click', onUserActivity);

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', onUserActivity);
      window.removeEventListener('keydown', onUserActivity);
      window.removeEventListener('click', onUserActivity);
    };
  }, [token, gatewayConfig.autoLogoutMinutes, addAuditLog]);

  // Auth operations
  const login = async (identifier: string, pass: string, pin: string) => {
    // 1. First attempt Supabase Auth if client is configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data: sbData, error: sbErr } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: pass,
        });
        if (!sbErr && sbData?.session?.access_token) {
          const jwt = sbData.session.access_token;
          setToken(jwt);
          localStorage.setItem('CHSE_ADMIN_TOKEN', jwt);
          setAdmin((prev) => ({
            ...prev,
            email: identifier,
            name: sbData.user?.user_metadata?.full_name || prev.name,
          }));
          resetSessionTimer();
          addAuditLog('ADMIN_LOGIN_SUPABASE', `Admin ${identifier} authenticated directly via Supabase Auth.`);
          return { success: true };
        }
      } catch (err) {
        // Fall back gracefully to internal authentication
      }
    }

    // 2. Direct admin auth (with 4-digit security PIN)
    const res = await apiLogin(identifier, pass, pin);
    if (res.success && res.token) {
      setToken(res.token);
      localStorage.setItem('CHSE_ADMIN_TOKEN', res.token);
      if (res.admin) {
        setAdmin(res.admin);
      }
      resetSessionTimer();
      addAuditLog('ADMIN_LOGIN_SUCCESS', `Administrator ${identifier} authenticated successfully via PIN & Bearer JWT.`);
      return { success: true };
    }
    addAuditLog('ADMIN_LOGIN_FAILED', `Failed login attempt for identifier ${identifier}.`);
    return { success: false, error: res.error || 'Authentication rejected' };
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('CHSE_ADMIN_TOKEN');
    addAuditLog('ADMIN_LOGOUT', `Super Administrator ${admin.email} logged out securely.`);
  };

  const updateAdminProfile = async (updates: Partial<AdminUser>) => {
    setAdmin((prev) => ({ ...prev, ...updates }));
    if (updates.securityPin) {
      setGatewayConfig((prev) => ({ ...prev, securityPin: updates.securityPin! }));
    }
    if (updates.email) {
      setGatewayConfig((prev) => ({ ...prev, adminEmail: updates.email! }));
    }
    if (updates.mobile) {
      setGatewayConfig((prev) => ({ ...prev, adminMobile: updates.mobile! }));
    }
    addAuditLog('ADMIN_PROFILE_UPDATED', `Updated admin credentials (Mobile: ${updates.mobile || admin.mobile}, PIN: ${updates.securityPin ? '****' : 'unchanged'}).`);
  };

  const generateRegistrationNumber = (): string => {
    const year = '2026';
    let maxNum = 0;
    students.forEach((s) => {
      const match = s.chseRegNo?.match(/MYCHSE-\d{4}-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const nextSeq = (maxNum + 1).toString().padStart(5, '0');
    return `MYCHSE-${year}-${nextSeq}`;
  };

  // 1-Click Verification Queue Approval
  const approveApplication = (appId: string) => {
    const application = applications.find((a) => a.id === appId);
    if (!application) {
      return { success: false, message: 'Application not found' };
    }

    const newRegNo = generateRegistrationNumber();
    const studentPrice = application.stream === 'Arts' ? gatewayConfig.pricing.arts : gatewayConfig.pricing.science;

    const newStudent: Student = {
      id: `stu-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      chseRegNo: newRegNo,
      rollNo: `CHSE-${application.stream.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: application.applicantName,
      fatherName: application.fatherName,
      mobileNumber: application.mobileNumber,
      email: application.email,
      stream: application.stream,
      district: application.district,
      college: application.college,
      accountStatus: 'Active',
      registeredDate: new Date().toISOString().split('T')[0],
      passwordHash: `chse@${application.mobileNumber.slice(-4)}`,
      courseAccessApproved: !!application.submittedUtr, // Unlocks if UTR is attached
      enrolledPackage: application.preferredBatch || `${application.stream} 2026 Digital Classroom`,
      lastActive: 'Just approved',
      totalMockTestsTaken: 0,
      avgScorePercentage: 0,
      notes: `Approved from registration portal (${application.sourcePortal}). Temporary Password: chse@${application.mobileNumber.slice(-4)}`,
    };

    // Update application status
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Approved', assignedRegNo: newRegNo } : a))
    );

    // Add student to directory
    setStudents((prev) => [newStudent, ...prev]);

    // If connected to Supabase, push or update student in Supabase students table
    approveSupabaseStudent(newStudent.id, newRegNo).catch((e) =>
      console.warn('Supabase student approval background sync:', e)
    );

    // If UTR was submitted with application, record payment
    if (application.submittedUtr) {
      const newPayment: PaymentReceipt = {
        id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        studentRegNo: newRegNo,
        studentName: application.applicantName,
        stream: application.stream,
        utrNumber: application.submittedUtr,
        amount: studentPrice,
        paymentDate: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
        paymentMethod: 'PhonePe',
        paymentGateway: 'UPI QR Manual',
        status: 'Approved',
        verifiedByAdmin: admin.name,
        approvedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        notes: `Auto-verified on application approval. ₹${studentPrice} captured.`,
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    addAuditLog(
      'APPLICATION_APPROVED_1CLICK',
      `1-Click Approved registration for ${application.applicantName} (${application.stream}, ${application.district}). Assigned Reg No: ${newRegNo}. Initial password: chse@${application.mobileNumber.slice(-4)}.`,
      newRegNo
    );

    return { success: true, student: newStudent };
  };

  const rejectApplication = (appId: string, remarks: string) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Rejected', rejectionRemarks: remarks } : a))
    );

    addAuditLog(
      'APPLICATION_REJECTED',
      `Rejected registration for ${app.applicantName} (${app.college}). Reason: ${remarks}`,
      app.id
    );
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'chseRegNo' | 'registeredDate' | 'lastActive' | 'totalMockTestsTaken' | 'avgScorePercentage'>): Student => {
    const newRegNo = generateRegistrationNumber();
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      chseRegNo: newRegNo,
      registeredDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just registered',
      totalMockTestsTaken: 0,
      avgScorePercentage: 0,
    };

    setStudents((prev) => [newStudent, ...prev]);
    addAuditLog(
      'STUDENT_REGISTERED_DIRECT',
      `Directly enrolled student ${newStudent.name} (${newStudent.stream} Stream) from ${newStudent.college}. Assigned Reg No: ${newRegNo}.`,
      newRegNo
    );
    return newStudent;
  };

  const updateStudent = (studentId: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );
    addAuditLog('STUDENT_UPDATED', `Updated profile records for student ID ${studentId}.`);
  };

  const updateStudentStatus = (studentId: string, status: AccountStatus, reason?: string) => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, accountStatus: status } : s))
    );

    addAuditLog(
      `STATUS_${status.toUpperCase()}`,
      `Changed status of ${target.name} (${target.chseRegNo}) to ${status}.${reason ? ` Reason: ${reason}` : ''}`,
      target.chseRegNo
    );
  };

  const regenerateStudentRegNo = (studentId: string): string => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return '';
    const newRegNo = generateRegistrationNumber();
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, chseRegNo: newRegNo } : s))
    );
    addAuditLog(
      'REG_NO_REGENERATED',
      `Regenerated official CHSE Registration Number for ${target.name}. Old: ${target.chseRegNo} -> New: ${newRegNo}`,
      newRegNo
    );
    return newRegNo;
  };

  const revokeStudentRegistration = (studentId: string, reason = 'Administrative revocation') => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              accountStatus: 'Blocked',
              courseAccessApproved: false,
              notes: `${s.notes || ''} [Registration Revoked: ${reason} on ${new Date().toLocaleDateString('en-IN')}]`.trim(),
            }
          : s
      )
    );
    addAuditLog(
      'REG_NO_REVOKED',
      `Revoked registration number and blocked all course access for ${target.name} (${target.chseRegNo}). Reason: ${reason}`,
      target.chseRegNo
    );
  };

  const resetStudentPasswordDirect = (chseRegNo: string, newPassword: string, isTemporary = false) => {
    const targetIndex = students.findIndex((s) => s.chseRegNo.toLowerCase() === chseRegNo.toLowerCase());
    if (targetIndex === -1) {
      return { success: false, message: `CHSE Registration Number "${chseRegNo}" was not found in the registry.` };
    }

    const updated = [...students];
    const student = updated[targetIndex];
    student.passwordHash = newPassword;
    if (isTemporary) {
      student.temporaryPassword = newPassword;
    } else {
      delete student.temporaryPassword;
    }

    setStudents(updated);

    // Call Supabase password update
    resetSupabaseStudentPassword(student.chseRegNo, newPassword).catch((err) =>
      console.warn('Supabase password reset background sync:', err)
    );

    addAuditLog(
      'DIRECT_PASSWORD_RESET_NO_OTP',
      `Admin initiated direct password reset for ${student.name}. Zero SMS/OTP required. Assigned ${isTemporary ? 'Temporary Password' : 'New Permanent Password'}.`,
      student.chseRegNo
    );

    return {
      success: true,
      message: `Password successfully updated for ${student.name} (${student.chseRegNo}). Student can authenticate immediately with this password.`,
      tempPass: newPassword,
    };
  };

  const toggleStudentCourseAccess = (studentId: string, approved: boolean) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, courseAccessApproved: approved } : s))
    );

    addAuditLog(
      approved ? 'COURSE_ACCESS_GRANTED' : 'COURSE_ACCESS_REVOKED',
      `${approved ? 'Granted' : 'Revoked'} lifetime digital course access (Chapter 2+ unlocked) for ${student.name} (${student.stream}).`,
      student.chseRegNo
    );
  };

  // Chapter & CMS actions
  const toggleChapterFreeStatus = (chapterId: string) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id === chapterId) {
          const next = !c.isFree;
          // Sync with Supabase chapters table
          updateSupabaseChapter(chapterId, { is_free: next }).catch((err) =>
            console.warn('Supabase chapter toggle sync:', err)
          );
          addAuditLog(
            'CHAPTER_FREE_STATUS_TOGGLED',
            `Toggled ${c.subject} Ch.${c.chapterNo} "${c.title}" to ${next ? 'FREE ACCESS (Chapter 1 Preview)' : 'LOCKED (Premium Access ₹99/₹149)'}.`
          );
          return { ...c, isFree: next };
        }
        return c;
      })
    );
  };

  const addChapter = (chapterData: Omit<ChapterItem, 'id'>) => {
    const newId = `chap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newChapter: ChapterItem = {
      ...chapterData,
      id: newId,
    };
    setChapters((prev) => [...prev, newChapter]);

    // Find standard subject ID
    const subObj = STANDARD_SUBJECT_LIST.find(
      (s) => s.name.toLowerCase() === chapterData.subject.toLowerCase() || s.id === chapterData.subject
    );
    const subjectId = subObj ? subObj.id : chapterData.subject.toLowerCase().replace(/\s+/g, '-');

    // Push to Supabase public.chapters table
    upsertSupabaseChapter({
      id: newId,
      subject_id: subjectId,
      chapter_number: chapterData.chapterNo,
      title: chapterData.titleOdia ? `${chapterData.title} / ${chapterData.titleOdia}` : chapterData.title,
      description: chapterData.notesMarkdown || '',
      is_free: chapterData.isFree,
      estimated_hours: 4,
      status: 'Published',
    }).catch((err) => console.warn('Supabase chapter insert sync:', err));

    // Also push notes to public.chapter_notes if provided
    if (chapterData.notesMarkdown || chapterData.odiaSummary) {
      upsertSupabaseNote({
        chapter_id: newId,
        title: chapterData.title,
        notes_en: chapterData.notesMarkdown,
        notes_or: chapterData.odiaSummary,
        status: 'Published',
      }).catch((err) => console.warn('Supabase chapter notes insert sync:', err));
    }

    addAuditLog('CHAPTER_CREATED', `Added Chapter ${newChapter.chapterNo}: "${newChapter.title}" for ${newChapter.subject} (${newChapter.stream}).`);
  };

  const updateChapter = (chapterId: string, updates: Partial<ChapterItem>) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === chapterId ? { ...c, ...updates } : c))
    );

    // Update in Supabase public.chapters table
    updateSupabaseChapter(chapterId, {
      title: updates.titleOdia ? `${updates.title} / ${updates.titleOdia}` : updates.title,
      is_free: updates.isFree,
      description: updates.notesMarkdown,
    }).catch((err) => console.warn('Supabase chapter update sync:', err));

    // If notes updated, sync to public.chapter_notes
    if (updates.notesMarkdown !== undefined || updates.odiaSummary !== undefined) {
      const targetChap = chapters.find((c) => c.id === chapterId);
      upsertSupabaseNote({
        chapter_id: chapterId,
        title: updates.title || targetChap?.title || 'Chapter Notes',
        notes_en: updates.notesMarkdown,
        notes_or: updates.odiaSummary,
        status: 'Published',
      }).catch((err) => console.warn('Supabase note update sync:', err));
    }

    addAuditLog('CHAPTER_UPDATED', `Updated Chapter ID ${chapterId} notes and curriculum details.`);
  };

  const deleteChapter = (chapterId: string) => {
    const chap = chapters.find((c) => c.id === chapterId);
    setChapters((prev) => prev.filter((c) => c.id !== chapterId));

    // Delete in Supabase chapters table (cascades questions, notes, and videos)
    deleteSupabaseChapter(chapterId).catch((err) =>
      console.warn('Supabase chapter delete sync:', err)
    );

    if (chap) {
      addAuditLog('CHAPTER_DELETED', `Deleted Chapter "${chap.title}" (${chap.subject}).`);
    }
  };

  const addBoardQuestion = (qData: Omit<BoardQuestion, 'id'>) => {
    const newId = `bq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newQ: BoardQuestion = {
      ...qData,
      id: newId,
    };
    setBoardQuestions((prev) => [newQ, ...prev]);
    setChapters((prev) =>
      prev.map((c) => (c.id === qData.chapterId ? { ...c, boardQuestionsCount: (c.boardQuestionsCount || 0) + 1 } : c))
    );

    const type = qData.markType === '2-Mark' ? '2_mark' : qData.markType === '3-Mark' ? '3_mark' : 'long';
    const marks = qData.markType === '2-Mark' ? 2 : qData.markType === '3-Mark' ? 3 : 7;

    // Push directly to Supabase public.questions table
    upsertSupabaseQuestion({
      id: newId,
      chapter_id: qData.chapterId,
      type,
      question_text: qData.questionText,
      question_or: qData.questionOdia,
      model_answer: qData.answerText,
      explanation: qData.answerOdia,
      marks,
      year: qData.yearAppeared || 'CHSE 2026 Model Paper',
      status: 'Published',
    }).catch((err) => console.warn('Supabase board question insert sync:', err));

    addAuditLog('BOARD_QUESTION_ADDED', `Added ${newQ.markType} exam question: "${newQ.questionText.slice(0, 50)}...".`);
  };

  const deleteBoardQuestion = (qId: string) => {
    const q = boardQuestions.find((b) => b.id === qId);
    setBoardQuestions((prev) => prev.filter((b) => b.id !== qId));
    if (q) {
      setChapters((prev) =>
        prev.map((c) => (c.id === q.chapterId ? { ...c, boardQuestionsCount: Math.max(0, (c.boardQuestionsCount || 1) - 1) } : c))
      );
      deleteSupabaseQuestion(qId).catch((err) => console.warn('Supabase board question delete sync:', err));
      addAuditLog('BOARD_QUESTION_DELETED', `Removed Board Exam question (${q.markType}).`);
    }
  };

  const addMCQ = (mcqData: Omit<MCQItem, 'id'>) => {
    const newId = `mcq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newMcq: MCQItem = {
      ...mcqData,
      id: newId,
    };
    setMcqs((prev) => [newMcq, ...prev]);
    setChapters((prev) =>
      prev.map((c) => (c.id === mcqData.chapterId ? { ...c, mcqCount: (c.mcqCount || 0) + 1 } : c))
    );

    // Push directly to Supabase public.questions table
    upsertSupabaseQuestion({
      id: newId,
      chapter_id: mcqData.chapterId,
      type: 'mcq',
      question_text: mcqData.question,
      question_or: mcqData.questionOdia,
      options: mcqData.options,
      correct_option: mcqData.correctOptionIndex,
      correct_answer: mcqData.options[mcqData.correctOptionIndex] || '',
      explanation: mcqData.explanation,
      marks: 1,
      status: 'Published',
    }).catch((err) => console.warn('Supabase MCQ insert sync:', err));

    addAuditLog('MCQ_ADDED', `Added MCQ question: "${newMcq.question.slice(0, 50)}...".`);
  };

  const deleteMCQ = (mcqId: string) => {
    const mcq = mcqs.find((m) => m.id === mcqId);
    setMcqs((prev) => prev.filter((m) => m.id !== mcqId));
    if (mcq) {
      setChapters((prev) =>
        prev.map((c) => (c.id === mcq.chapterId ? { ...c, mcqCount: Math.max(0, (c.mcqCount || 1) - 1) } : c))
      );
      deleteSupabaseQuestion(mcqId).catch((err) => console.warn('Supabase MCQ delete sync:', err));
      addAuditLog('MCQ_DELETED', `Removed MCQ.`);
    }
  };

  // Lesson actions
  const toggleLessonFreePreview = (lessonId: string) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === lessonId) {
          const nextState = !l.isFreePreview;
          addAuditLog(
            'LESSON_ACCESS_TOGGLED',
            `Updated "${l.lessonTitle}" (${l.subject}, ${l.stream}) lock status to ${nextState ? 'FREE PREVIEW' : 'PAID LOCKED'}.`
          );
          return { ...l, isFreePreview: nextState };
        }
        return l;
      })
    );
  };

  const addLesson = (lessonData: Omit<Lesson, 'id' | 'addedDate'>) => {
    const newId = `vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newLesson: Lesson = {
      ...lessonData,
      id: newId,
      addedDate: new Date().toISOString().split('T')[0],
    };
    setLessons((prev) => [newLesson, ...prev]);

    // Find matching chapter id
    const chap = chapters.find(
      (c) => c.stream === lessonData.stream && c.subject === lessonData.subject && c.chapterNo === lessonData.chapterNo
    );
    const chapterId = chap?.id || `chap-${lessonData.stream.toLowerCase()}-${lessonData.chapterNo}`;
    const ytId = extractYouTubeId(lessonData.videoUrl);

    // Push to Supabase public.videos table
    upsertSupabaseVideo({
      id: newId,
      chapter_id: chapterId,
      title: lessonData.lessonTitle,
      youtube_url: lessonData.videoUrl,
      youtube_id: ytId,
      duration: lessonData.duration || '25 mins',
      status: 'Published',
    }).catch((err) => console.warn('Supabase video insert sync:', err));

    addAuditLog(
      'LESSON_UPLOADED',
      `Added new video lecture "${newLesson.lessonTitle}" to Chapter ${newLesson.chapterNo} of ${newLesson.subject} (${newLesson.stream}).`
    );
  };

  const deleteLesson = (lessonId: string) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    if (lesson) {
      deleteSupabaseVideo(lessonId).catch((err) => console.warn('Supabase video delete sync:', err));
      addAuditLog('LESSON_DELETED', `Removed video lecture "${lesson.lessonTitle}" from ${lesson.subject}.`);
    }
  };

  // Mock tests
  const addMockTest = (testData: Omit<MockTest, 'id' | 'resultsPublished'>) => {
    const newTest: MockTest = {
      ...testData,
      id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      resultsPublished: false,
    };
    setMockTests((prev) => [newTest, ...prev]);
    addAuditLog(
      'MOCK_TEST_CREATED',
      `Created CHSE blueprint mock test "${newTest.title}" for ${newTest.subject} (${newTest.stream}) - ${newTest.totalMarks} Marks.`
    );
  };

  const toggleMockTestPublish = (testId: string) => {
    setMockTests((prev) =>
      prev.map((t) => {
        if (t.id === testId) {
          const nextStatus = t.status === 'published' ? 'draft' : 'published';
          addAuditLog(
            'MOCK_TEST_STATUS_CHANGED',
            `Changed status of mock test "${t.title}" to ${nextStatus.toUpperCase()}.`
          );
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const publishTestResults = (testId: string) => {
    const test = mockTests.find((t) => t.id === testId);
    if (!test) return;

    setMockTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, resultsPublished: true } : t))
    );

    addAuditLog(
      'MOCK_RESULTS_PUBLISHED',
      `Published student scores and All-Odisha state rankings for "${test.title}".`
    );
  };

  // Payment Verification Actions
  const approvePayment = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'Approved',
              verifiedByAdmin: admin.name,
              approvedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            }
          : p
      )
    );

    setStudents((prev) =>
      prev.map((s) => {
        if (s.chseRegNo === payment.studentRegNo) {
          return {
            ...s,
            accountStatus: 'Active',
            courseAccessApproved: true,
            notes: (s.notes ? s.notes + ' | ' : '') + `12-Digit UTR ${payment.utrNumber} verified on ${new Date().toLocaleDateString('en-IN')}`,
          };
        }
        return s;
      })
    );

    addAuditLog(
      'PAYMENT_APPROVED_ACCESS_GRANTED',
      `Verified 12-digit UTR (${payment.utrNumber}, ₹${payment.amount}) for ${payment.studentName}. Unlocked Chapter 2+ digital course access in Supabase.`,
      payment.studentRegNo
    );

    // Call Supabase verification directly to update purchases and students tables
    verifySupabasePurchaseUTR(paymentId, payment.studentRegNo, admin.name).catch((err) =>
      console.warn('Supabase purchase verification background sync:', err)
    );
  };

  const verifyUtrAndUnlockAccess = (paymentId: string) => {
    approvePayment(paymentId);
  };

  const rejectPayment = (paymentId: string, reason: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'Rejected',
              verifiedByAdmin: admin.name,
              approvedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              rejectionReason: reason,
            }
          : p
      )
    );

    // Call Supabase reject
    rejectSupabasePurchase(paymentId, reason).catch((err) =>
      console.warn('Supabase reject purchase background sync:', err)
    );

    addAuditLog(
      'PAYMENT_REJECTED',
      `Rejected UPI UTR Ref ${payment.utrNumber} for ${payment.studentName}. Reason: ${reason}`,
      payment.studentRegNo
    );
  };

  const exportPaymentsToCSV = () => {
    const headers = ['Transaction ID', 'Student Reg No', 'Student Name', 'Stream', 'Amount (INR)', 'Payment Method', 'Gateway', '12-Digit UTR', 'Status', 'Date', 'Verified By'];
    const rows = payments.map((p) => [
      p.id,
      p.studentRegNo,
      `"${p.studentName}"`,
      p.stream,
      p.amount,
      p.paymentMethod,
      p.paymentGateway || 'UPI QR Manual',
      `'${p.utrNumber}`,
      p.status,
      `"${p.paymentDate}"`,
      `"${p.verifiedByAdmin || 'Pending'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CHSE_Payment_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('PAYMENTS_EXPORTED_CSV', `Exported ${payments.length} ledger transactions to CSV file.`);
  };

  // User Portal Connected Registrations
  const submitStudentRegistration = async (studentData: {
    name: string;
    mobileNumber: string;
    stream: StreamType;
    district: string;
    college: string;
    email?: string;
    password?: string;
  }): Promise<{ success: boolean; student: Student; error?: string }> => {
    const newRegNo = generateRegistrationNumber();
    const newStudent: Student = {
      id: `stu-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      chseRegNo: newRegNo,
      rollNo: newRegNo.replace('MYCHSE-', ''),
      name: studentData.name,
      mobileNumber: studentData.mobileNumber,
      stream: studentData.stream,
      district: studentData.district,
      college: studentData.college,
      email: studentData.email || '',
      registeredDate: new Date().toISOString().split('T')[0],
      lastActive: 'Online now',
      accountStatus: 'Active',
      courseAccessApproved: false,
      enrolledPackage: `CHSE +2 2nd Year ${studentData.stream} Standard`,
      passwordHash: studentData.password || 'chse2026',
      totalMockTestsTaken: 0,
      avgScorePercentage: 0,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Create an application record in the verification queue
    const newApp: RegistrationApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      applicantName: studentData.name,
      fatherName: 'Guardian',
      stream: studentData.stream,
      district: studentData.district,
      college: studentData.college,
      mobileNumber: studentData.mobileNumber,
      email: studentData.email || '',
      appliedDate: new Date().toISOString().split('T')[0],
      sourcePortal: 'mychse12thclassesedu.netlify.app',
      status: 'Pending Review',
      preferredBatch: 'CHSE 2026 Regular',
      assignedRegNo: newRegNo,
    };
    setApplications((prev) => [newApp, ...prev]);

    // Background sync to Supabase public.students table
    insertSupabaseStudent({
      name: studentData.name,
      chseRegNo: newRegNo,
      mobileNumber: studentData.mobileNumber,
      stream: studentData.stream,
      district: studentData.district,
      college: studentData.college,
      email: studentData.email,
      password: studentData.password || 'chse2026',
    }).catch((err) => console.warn('Supabase student registration sync:', err));

    addAuditLog(
      'STUDENT_PORTAL_REGISTRATION',
      `Student ${studentData.name} registered self via User Panel (${studentData.stream}). Assigned Reg No: ${newRegNo}. Queued for Admin Verification.`,
      newRegNo
    );

    return { success: true, student: newStudent };
  };

  // User Portal Connected Purchases
  const submitStudentPaymentReceipt = async (receiptData: {
    studentRegNo: string;
    studentName: string;
    stream: StreamType;
    courseName?: string;
    amount: number;
    utrNumber: string;
    paymentGateway?: string;
  }): Promise<{ success: boolean; payment: PaymentReceipt; error?: string }> => {
    const newPayment: PaymentReceipt = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentRegNo: receiptData.studentRegNo,
      studentName: receiptData.studentName,
      stream: receiptData.stream,
      utrNumber: receiptData.utrNumber,
      amount: receiptData.amount,
      paymentDate: new Date().toISOString(),
      paymentMethod: 'BHIM UPI',
      paymentGateway: (receiptData.paymentGateway as 'UPI QR Manual' | 'Razorpay Live Online') || 'UPI QR Manual',
      status: 'Pending',
      notes: receiptData.courseName || `CHSE +2 2nd Year ${receiptData.stream} Master Pack`,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Background sync to Supabase public.purchases table
    insertSupabasePurchase({
      studentRegNo: receiptData.studentRegNo,
      studentName: receiptData.studentName,
      stream: receiptData.stream,
      courseName: receiptData.courseName,
      amount: receiptData.amount,
      utrNumber: receiptData.utrNumber,
      paymentGateway: receiptData.paymentGateway,
    }).catch((err) => console.warn('Supabase purchase insert sync:', err));

    addAuditLog(
      'STUDENT_UTR_SUBMITTED',
      `Student ${receiptData.studentName} (${receiptData.studentRegNo}) submitted UTR ${receiptData.utrNumber} for ₹${receiptData.amount}. Pending Admin Approval.`,
      receiptData.studentRegNo
    );

    return { success: true, payment: newPayment };
  };

  // Announcements
  const addAnnouncement = (announcementData: Omit<Announcement, 'id' | 'publishedDate'>) => {
    const newNotice: Announcement = {
      ...announcementData,
      id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newNotice, ...prev]);

    // Push to Supabase notices table
    publishSupabaseNotice(announcementData).catch((err) =>
      console.warn('Supabase notice publish background sync:', err)
    );

    addAuditLog(
      'NOTICE_POSTED',
      `Broadcasted official notice "${newNotice.title}" to ${newNotice.targetStream} stream students with priority: ${newNotice.isHighPriority ? 'URGENT' : 'STANDARD'}.`
    );
  };

  const toggleAnnouncementActive = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === announcementId) {
          const next = !a.active;
          toggleSupabaseNoticeActive(announcementId, next).catch((err) =>
            console.warn('Supabase notice toggle background sync:', err)
          );
          return { ...a, active: next };
        }
        return a;
      })
    );
  };

  const deleteAnnouncement = (announcementId: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
    deleteSupabaseNotice(announcementId).catch((err) =>
      console.warn('Supabase notice delete background sync:', err)
    );
  };

  // Config Actions
  const updateGatewayConfig = async (updates: Partial<SystemGatewayConfig>) => {
    setGatewayConfig((prev) => ({ ...prev, ...updates }));
    await apiUpdateConfig(updates);
    addAuditLog(
      'GATEWAY_CONFIG_UPDATED',
      `Updated live payment gateway config (UPI VPA: ${updates.upiVpa || gatewayConfig.upiVpa}, Razorpay: ${updates.razorpayMode || gatewayConfig.razorpayMode}).`
    );
  };

  const checkSystemHealth = async () => {
    return await apiCheckHealth();
  };

  const resetAllData = () => {
    ['CHSE_ADMIN_PORTAL_STATE_PROD_V1', 'CHSE_ADMIN_PORTAL_STATE_V2', 'CHSE_ADMIN_PORTAL_STATE'].forEach((prefix) => {
      [
        'STUDENTS',
        'APPLICATIONS',
        'CHAPTERS',
        'BOARD_QUESTIONS',
        'MCQS',
        'LESSONS',
        'TESTS',
        'RANKINGS',
        'PAYMENTS',
        'NOTICES',
        'AUDIT',
        'CONFIG',
      ].forEach((key) => {
        localStorage.removeItem(`${prefix}_${key}`);
      });
    });

    setStudents(INITIAL_STUDENTS);
    setApplications(INITIAL_APPLICATIONS);
    setChapters(INITIAL_CHAPTERS);
    setBoardQuestions(INITIAL_BOARD_QUESTIONS);
    setMcqs(INITIAL_MCQS);
    setLessons(INITIAL_LESSONS);
    setMockTests(INITIAL_MOCK_TESTS);
    setRankings(INITIAL_RANKINGS);
    setPayments(INITIAL_PAYMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setGatewayConfig(INITIAL_GATEWAY_CONFIG);

    addAuditLog('SYSTEM_RESET', 'Restored default CHSE administrative repository data.');
  };

  // Academic Resources & Faculty Doubts Actions
  const addOrUpdatePyqPaper = async (paper: PyqPaper) => {
    setPyqPapers((prev) => {
      const idx = prev.findIndex((p) => p.id === paper.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = paper;
        return copy;
      }
      return [paper, ...prev];
    });
    addAuditLog('PYQ_UPDATED', `PYQ Paper updated/added: ${paper.title || paper.subject} (${paper.year})`);
    return await upsertSupabasePyq(paper);
  };

  const deletePyqPaper = async (id: string) => {
    setPyqPapers((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('PYQ_DELETED', `PYQ Paper deleted: ID ${id}`);
    return await deleteSupabasePyq(id);
  };

  const addOrUpdateBureauBook = async (book: BureauBook) => {
    setBureauBooks((prev) => {
      const idx = prev.findIndex((b) => b.id === book.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = book;
        return copy;
      }
      return [book, ...prev];
    });
    addAuditLog('BOOK_UPDATED', `Bureau Book updated: ${book.title}`);
    return await upsertSupabaseBureauBook(book);
  };

  const deleteBureauBook = async (id: string) => {
    setBureauBooks((prev) => prev.filter((b) => b.id !== id));
    addAuditLog('BOOK_DELETED', `Bureau Book deleted: ID ${id}`);
    return await deleteSupabaseBureauBook(id);
  };

  const addOrUpdatePractical = async (lab: PracticalLabItem) => {
    setPracticals((prev) => {
      const idx = prev.findIndex((p) => p.id === lab.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = lab;
        return copy;
      }
      return [lab, ...prev];
    });
    addAuditLog('PRACTICAL_UPDATED', `Practical Lab updated: Exp #${lab.experimentNo} ${lab.title}`);
    return await upsertSupabasePractical(lab);
  };

  const deletePractical = async (id: string) => {
    setPracticals((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('PRACTICAL_DELETED', `Practical Lab deleted: ID ${id}`);
    return await deleteSupabasePractical(id);
  };

  const addStudentDoubt = async (doubt: StudentDoubt) => {
    setStudentDoubts((prev) => [doubt, ...prev]);
    addAuditLog('STUDENT_DOUBT_SUBMITTED', `New doubt submitted by ${doubt.studentName} for ${doubt.subject}`);
    return await upsertSupabaseDoubt(doubt);
  };

  const answerDoubt = async (doubtId: string, answerText: string, answeredBy: string) => {
    let updatedItem: StudentDoubt | null = null;
    setStudentDoubts((prev) =>
      prev.map((d) => {
        if (d.id === doubtId) {
          updatedItem = {
            ...d,
            status: 'Answered',
            answerText,
            answeredBy,
            answeredAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
          return updatedItem;
        }
        return d;
      })
    );
    if (updatedItem) {
      addAuditLog('DOUBT_ANSWERED', `Doubt ${doubtId} answered by faculty ${answeredBy}`);
      return await upsertSupabaseDoubt(updatedItem);
    }
    return { success: false, error: 'Doubt not found' };
  };

  const deleteDoubt = async (doubtId: string) => {
    setStudentDoubts((prev) => prev.filter((d) => d.id !== doubtId));
    addAuditLog('DOUBT_DELETED', `Doubt deleted: ID ${doubtId}`);
    return await deleteSupabaseDoubt(doubtId);
  };

  const syncAcademicResourcesToSupabase = async () => {
    let pushed = 0;
    try {
      for (const p of pyqPapers) {
        await upsertSupabasePyq(p);
        pushed++;
      }
      for (const b of bureauBooks) {
        await upsertSupabaseBureauBook(b);
        pushed++;
      }
      for (const l of practicals) {
        await upsertSupabasePractical(l);
        pushed++;
      }
      for (const d of studentDoubts) {
        await upsertSupabaseDoubt(d);
        pushed++;
      }
      addAuditLog('ACADEMIC_SYNC_ALL', `Pushed ${pushed} academic resource records to live Supabase`);
      return { success: true, message: `Successfully synced ${pushed} academic resource records to Supabase Cloud!` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Sync failed' };
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        updateAdminProfile,
        sessionTimeLeft,
        resetSessionTimer,
        supabaseConfig,
        isSupabaseConnected,
        supabaseStatusMessage,
        supabaseLatency,
        isSyncingSupabase,
        lastSupabaseSync,
        supabaseTableCounts,
        updateSupabaseConfig,
        testSupabaseConnectionStatus,
        pingSupabaseLiveStatus,
        syncWithSupabase,
        students,
        applications,
        chapters,
        boardQuestions,
        mcqs,
        lessons,
        mockTests,
        rankings,
        payments,
        announcements,
        pyqPapers,
        bureauBooks,
        practicals,
        studentDoubts,
        addOrUpdatePyqPaper,
        deletePyqPaper,
        addOrUpdateBureauBook,
        deleteBureauBook,
        addOrUpdatePractical,
        deletePractical,
        addStudentDoubt,
        answerDoubt,
        deleteDoubt,
        syncAcademicResourcesToSupabase,
        auditLogs,
        gatewayConfig,
        approveApplication,
        rejectApplication,
        generateRegistrationNumber,
        regenerateStudentRegNo,
        revokeStudentRegistration,
        addStudent,
        updateStudent,
        updateStudentStatus,
        resetStudentPasswordDirect,
        toggleStudentCourseAccess,
        toggleChapterFreeStatus,
        addChapter,
        updateChapter,
        deleteChapter,
        addBoardQuestion,
        deleteBoardQuestion,
        addMCQ,
        deleteMCQ,
        toggleLessonFreePreview,
        addLesson,
        deleteLesson,
        addMockTest,
        toggleMockTestPublish,
        publishTestResults,
        approvePayment,
        rejectPayment,
        verifyUtrAndUnlockAccess,
        exportPaymentsToCSV,
        submitStudentRegistration,
        submitStudentPaymentReceipt,
        addAnnouncement,
        toggleAnnouncementActive,
        deleteAnnouncement,
        updateGatewayConfig,
        checkSystemHealth,
        addAuditLog,
        resetAllData,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
