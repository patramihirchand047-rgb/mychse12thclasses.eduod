export type StreamType = 'Science' | 'Arts' | 'Commerce';
export type AccountStatus = 'Active' | 'Pending' | 'Blocked';
export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected';

export interface StandardSubject {
  id: string;
  name: string;
  stream: 'Commerce' | 'Science' | 'Arts' | 'Compulsory';
  code: string;
}

export const STANDARD_SUBJECT_LIST: StandardSubject[] = [
  // Commerce
  { id: 'subj-comm-fa', name: 'Financial Accounting', stream: 'Commerce', code: 'FA' },
  { id: 'subj-comm-bms', name: 'Business Math & Statistics', stream: 'Commerce', code: 'BMS' },
  { id: 'subj-comm-cost', name: 'Cost Accounting', stream: 'Commerce', code: 'COST' },
  { id: 'subj-comm-eco', name: 'Economics', stream: 'Commerce', code: 'ECO' },
  // Science
  { id: 'subj-sci-phy', name: 'Physics', stream: 'Science', code: 'PHY' },
  { id: 'subj-sci-chem', name: 'Chemistry', stream: 'Science', code: 'CHEM' },
  { id: 'subj-sci-math', name: 'Mathematics', stream: 'Science', code: 'MATH' },
  { id: 'subj-sci-bio', name: 'Biology (Botany & Zoology)', stream: 'Science', code: 'BIO' },
  { id: 'subj-sci-it', name: 'Information Technology', stream: 'Science', code: 'IT' },
  // Arts
  { id: 'subj-art-hist', name: 'History', stream: 'Arts', code: 'HIST' },
  { id: 'subj-art-pol', name: 'Political Science', stream: 'Arts', code: 'POL' },
  { id: 'subj-art-eco', name: 'Economics', stream: 'Arts', code: 'ECO' },
  { id: 'subj-art-sans', name: 'Sanskrit', stream: 'Arts', code: 'SANS' },
  { id: 'subj-art-edu', name: 'Education', stream: 'Arts', code: 'EDU' },
  { id: 'subj-art-logic', name: 'Logic', stream: 'Arts', code: 'LOGIC' },
  // Compulsory
  { id: 'subj-comp-odia', name: 'MIL Odia', stream: 'Compulsory', code: 'ODIA' },
  { id: 'subj-comp-eng', name: 'English', stream: 'Compulsory', code: 'ENG' },
];

/**
 * Exact schema for public.students table
 */
export interface StudentRecord {
  id: string;
  registration_id: string;
  full_name: string;
  gmail: string;
  age?: number;
  stream: string;
  subject_1?: string;
  subject_2?: string;
  subject_3?: string;
  subject_4?: string;
  subject_5?: string;
  subject_6?: string;
  district?: string;
  block?: string;
  address?: string;
  state?: string;
  admission_status: 'Approval' | 'Approved' | 'Pending' | 'Rejected' | string;
  registration_date?: string;
  admission_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Exact schema for public.purchases table
 */
export interface PurchaseRecord {
  id: string;
  student_id: string;
  registration_id: string;
  course_id: string;
  course_name: string;
  stream: string;
  amount: number;
  currency?: string;
  payment_gateway: 'Razorpay' | 'UPI_QR_DIRECT' | 'UPI QR Manual' | string;
  gateway_payment_id: string; // 12-Digit UTR or Razorpay Payment ID
  status: 'SUCCESS' | 'PENDING' | 'Approved' | 'Rejected' | string;
  purchased_at?: string;
}

/**
 * Exact schema for public.chapters table
 */
export interface ChapterRecord {
  id: string; // e.g. 'chap-fa-1' or 'chap-[timestamp]'
  subject_id: string; // matches standard subject ID (e.g. 'subj-sci-phy')
  chapter_number: number; // 1, 2, 3...
  title: string; // Bilingual title e.g. 'Accounting for Partnership / ଅଂଶୀଦାରୀ ହିସାବ'
  description?: string;
  is_free: boolean; // true = Chapter 1 Free Preview, false = Chapter 2+ Premium
  estimated_hours?: number;
  status: 'Published' | 'Draft' | string;
  created_at?: string;
}

/**
 * Exact schema for public.questions table
 */
export interface QuestionRecord {
  id: string;
  chapter_id: string;
  type: 'mcq' | '2_mark' | '3_mark' | 'long' | 'pyq';
  question_text: string;
  question_or?: string;
  options?: string[];
  correct_answer?: string;
  correct_option?: number; // 0, 1, 2, 3 for MCQ
  explanation?: string;
  model_answer?: string;
  marks: number; // 1 for MCQ, 2, 3, 7 for long
  year?: string;
  status: 'Published' | 'Draft' | string;
  created_at?: string;
}

/**
 * Exact schema for public.chapter_notes table
 */
export interface ChapterNoteRecord {
  id: string;
  chapter_id: string;
  title: string;
  notes_en?: string;
  notes_or?: string;
  english_content?: string;
  odia_content?: string;
  important_points?: string[];
  summary_points?: string[];
  exam_tips?: string;
  status: 'Published' | 'Draft' | string;
  created_at?: string;
}

/**
 * Exact schema for public.videos table
 */
export interface VideoRecord {
  id: string;
  chapter_id: string;
  title: string;
  youtube_url: string;
  youtube_id: string; // 11-char ID
  duration?: string;
  thumbnail?: string;
  status: 'Published' | 'Draft' | string;
  created_at?: string;
}

export interface Student {
  id: string;
  chseRegNo: string; // e.g. MYCHSE-2026-00001
  rollNo: string;
  name: string;
  fatherName?: string;
  mobileNumber?: string;
  email: string;
  gmail?: string;
  age?: number;
  classYear?: string; // e.g. '+2 2nd Year'
  batchYear?: string; // e.g. '2026-27'
  stream: StreamType;
  district: string;
  college: string;
  accountStatus: AccountStatus;
  admission_status?: 'Approval' | 'Approved' | 'Pending' | 'Rejected' | string;
  registeredDate: string;
  passwordHash: string; // Plain/stored for simulated zero-OTP verification
  temporaryPassword?: string;
  courseAccessApproved: boolean; // Lifetime course access
  enrolledPackage: string;
  lastActive: string;
  totalMockTestsTaken: number;
  avgScorePercentage: number;
  notes?: string;
  subjects?: string[];
  subject_1?: string;
  subject_2?: string;
  subject_3?: string;
  subject_4?: string;
  subject_5?: string;
  subject_6?: string;
  block?: string;
  state?: string;
  address?: string;
  admissionDate?: string;
}

export interface RegistrationApplication {
  id: string;
  applicantName: string;
  fatherName: string;
  mobileNumber: string;
  email: string;
  district: string;
  college: string;
  stream: StreamType;
  appliedDate: string;
  sourcePortal: string; // 'mychse12thclassesedu.netlify.app'
  status: 'Pending Review' | 'Approved' | 'Rejected';
  preferredBatch: string;
  assignedRegNo?: string;
  rejectionRemarks?: string;
  submittedUtr?: string;
}

export interface BoardQuestion {
  id: string;
  chapterId: string;
  markType: '2-Mark' | '3-Mark' | '5-Mark';
  questionText: string;
  questionOdia?: string;
  answerText: string;
  answerOdia?: string;
  yearAppeared?: string;
}

export interface MCQItem {
  id: string;
  chapterId: string;
  question: string;
  questionOdia?: string;
  options: string[];
  optionsOdia?: string[];
  correctOptionIndex: number;
  explanation: string;
  explanationOdia?: string;
}

export interface ChapterItem {
  id: string;
  chapterNo: number;
  title: string;
  titleOdia?: string;
  stream: StreamType;
  subject: string;
  isFree: boolean; // Chapter 1 = Free, Chapter 2+ = Premium Locked
  videoUrl?: string;
  notesMarkdown: string;
  notesPdfUrl?: string;
  odiaSummary?: string;
  boardQuestionsCount?: number;
  mcqCount?: number;
}

export interface Lesson {
  id: string;
  stream: StreamType;
  subject: string;
  chapterNo: number;
  chapterTitle: string;
  lessonTitle: string;
  duration: string;
  videoType: 'youtube' | 'vimeo' | 'stream';
  videoUrl: string;
  odiaNotesUrl?: string;
  englishNotesUrl?: string;
  isFreePreview: boolean;
  addedDate: string;
  instructor: string;
}

export interface Question {
  id: string;
  testId: string;
  type: 'mcq' | 'short_answer' | 'long_answer';
  group: 'Group A (1 Mark)' | 'Group B (2-3 Marks)' | 'Group C (7 Marks Long)';
  marks: number;
  questionText: string;
  questionOdia?: string;
  options?: string[];
  correctOptionIndex?: number;
  modelAnswer?: string;
}

export interface MockTest {
  id: string;
  title: string;
  stream: StreamType;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  blueprintPattern: string; // e.g., "CHSE Odisha Standard 70 Marks (20 MCQs, 10 Short, 4 Long)"
  status: 'draft' | 'published' | 'closed';
  questionsCount: number;
  totalQuestions?: number;
  resultsPublished: boolean;
  scheduledDate: string;
  questions?: Question[];
}

export interface TestRanking {
  id: string;
  testId: string;
  studentRegNo: string;
  studentName: string;
  stream: StreamType;
  college: string;
  score: number;
  totalMarks: number;
  percentage: number;
  rank: number;
  submittedAt: string;
}

export interface PaymentReceipt {
  id: string;
  studentRegNo: string;
  studentName: string;
  stream: StreamType;
  utrNumber: string; // 12-Digit Bank UTR / Transaction ID
  amount: number; // ₹99 for Arts / ₹149 for Science / Commerce
  paymentDate: string;
  paymentMethod: 'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM UPI' | 'Direct Bank Transfer' | 'Razorpay Live Online';
  paymentGateway?: 'UPI QR Manual' | 'Razorpay Live Online';
  receiptImageUrl?: string;
  status: PaymentStatus;
  verifiedByAdmin?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

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

export type NavigationTab = TabType;

export interface Announcement {
  id: string;
  title: string;
  titleOdia?: string;
  content: string;
  category: 'CHSE Exam Alert' | 'Practical Schedule' | 'Admit Card Update' | 'General Notice' | 'Exam Routine' | 'Live Class' | 'Academic Note' | 'Urgent Notice';
  targetStream: 'All' | StreamType;
  isHighPriority: boolean;
  publishedDate: string;
  active: boolean;
  pdfAttachmentUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  role: string;
  action: string;
  targetRegNo?: string;
  details: string;
  ipAddress: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'Super Administrator' | 'Exam Controller' | 'Academic Dean' | 'Support Specialist';
  avatarInitials: string;
  lastLogin: string;
  securityPin: string; // 4-digit security PIN
}

export interface SystemGatewayConfig {
  upiVpa: string; // e.g. patramihirchand394@okhdfcbank
  payeeDisplayName: string; // e.g. MY CHSE 12TH CLASSES
  razorpayMode: 'test' | 'live';
  razorpayKeyId: string;
  razorpayKeySecret: string;
  pricing: {
    arts: number; // ₹99
    science: number; // ₹149
    commerce: number; // ₹149
    artsOriginal: number; // ₹499
    scienceOriginal: number; // ₹799
    commerceOriginal: number; // ₹799
  };
  adminMobile: string;
  adminEmail: string;
  securityPin: string;
  autoLogoutMinutes: number;
}

export type AIContentType = 'mcq' | '2-mark' | '3-mark' | 'long' | 'notes';
export type AILanguage = 'english' | 'odia' | 'bilingual';

export interface AIGeneratedMCQ {
  id: string;
  question: string;
  questionOdia?: string;
  options: string[];
  optionsOdia?: string[];
  correctOptionIndex: number;
  explanation: string;
  explanationOdia?: string;
}

export interface AIGeneratedBoardQuestion {
  id: string;
  markType: '2-Mark' | '3-Mark' | '5-Mark';
  questionText: string;
  questionOdia?: string;
  answerText: string;
  answerOdia?: string;
  yearAppeared?: string;
  markingKey?: string[];
}

export interface AIGeneratedNotes {
  title: string;
  titleOdia?: string;
  notesMarkdown: string;
  odiaSummary: string;
  keyFormulae?: string[];
}

export interface PyqPaper {
  id: string;
  title?: string;
  year: number;
  stream: StreamType;
  subject: string;
  totalMarks: number;
  duration: string;
  pdfUrl?: string;
  downloadUrl?: string;
  hasSolutions: boolean;
  questionPattern: string;
  highlights: string[];
  keyTopics: string[];
  isLocked?: boolean;
}

export interface BureauBook {
  id: string;
  title: string;
  titleOdia: string;
  subject: string;
  stream: StreamType;
  volume: string;
  publisher: string;
  pageCount: number;
  chaptersCount: number;
  pdfUrl?: string;
  downloadUrl?: string;
  formulaSheetUrl?: string;
  hasExercisesSolutions?: boolean;
}

export interface PracticalVivaItem {
  question: string;
  answer: string;
  questionOdia?: string;
  answerOdia?: string;
}

export interface PracticalLabItem {
  id: string;
  stream: StreamType;
  subject: string;
  experimentNo: number;
  title: string;
  titleOdia?: string;
  apparatus: string;
  principleFormula: string;
  procedureSteps: string[];
  precautions: string[];
  vivaQuestions: PracticalVivaItem[];
}

export interface StudentDoubt {
  id: string;
  studentId: string;
  studentName: string;
  stream: StreamType;
  subject: string;
  topic: string;
  doubtText: string;
  createdAt: string;
  status: 'Pending' | 'Answered';
  answerText?: string;
  answeredBy?: string;
  answeredAt?: string;
}
