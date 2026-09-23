import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Student,
  PaymentReceipt,
  ChapterItem,
  Announcement,
  RegistrationApplication,
  StreamType,
  AccountStatus,
  PyqPaper,
  BureauBook,
  PracticalLabItem,
  StudentDoubt,
} from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  isConnected?: boolean;
}

const STORAGE_KEY = 'MYCHSE_SUPABASE_CONFIG';

// Helper to get active configuration
export function getSavedSupabaseConfig(): SupabaseConfig {
  const activeLiveUrl =
    (import.meta.env.VITE_SUPABASE_URL as string) ||
    (import.meta.env.SUPABASE_URL as string) ||
    'https://ozvjfrpnqcciupluuppc.supabase.co';

  const activeLiveAnonKey =
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
    (import.meta.env.SUPABASE_ANON_KEY as string) ||
    'sb_publishable_oQk1hTI2WzzARMf7sq9KrA_syp3IuAt';

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && (parsed.anonKey || parsed.serviceRoleKey)) {
        // If the saved URL is the live project or outdated, ensure verified key is present
        if (parsed.url === activeLiveUrl && (!parsed.anonKey || parsed.anonKey !== activeLiveAnonKey) && !parsed.serviceRoleKey) {
          parsed.anonKey = activeLiveAnonKey;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved supabase config', e);
  }

  // Active verified live Supabase credentials
  return {
    url: activeLiveUrl,
    anonKey: activeLiveAnonKey,
    serviceRoleKey: (import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string) || '',
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  // Invalidate cached client
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;
let cachedKeyUsed: string = '';
let cachedUrlUsed: string = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSavedSupabaseConfig();
  const activeKey = config.serviceRoleKey?.trim() || config.anonKey?.trim();

  if (!config.url?.trim() || !activeKey) {
    return null;
  }

  if (cachedClient && cachedUrlUsed === config.url && cachedKeyUsed === activeKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url.trim(), activeKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    cachedUrlUsed = config.url;
    cachedKeyUsed = activeKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Check connection and test access to all tables: students, purchases, chapters, questions, chapter_notes, videos, notices
export async function testSupabaseConnection(customConfig?: SupabaseConfig): Promise<{
  success: boolean;
  message: string;
  latencyMs: number;
  tableCounts?: {
    students: number;
    purchases: number;
    chapters: number;
    questions: number;
    chapterNotes: number;
    videos: number;
    notices: number;
  };
  missingTables?: string[];
}> {
  const start = performance.now();
  let client: SupabaseClient | null = null;

  if (customConfig && customConfig.url && (customConfig.serviceRoleKey || customConfig.anonKey)) {
    const key = customConfig.serviceRoleKey?.trim() || customConfig.anonKey?.trim();
    client = createClient(customConfig.url.trim(), key);
  } else {
    client = getSupabaseClient();
  }

  if (!client) {
    return {
      success: false,
      message: 'Supabase URL and Anon/Service Key are not configured.',
      latencyMs: 0,
    };
  }

  try {
    const missingTables: string[] = [];
    const counts = { students: 0, purchases: 0, chapters: 0, questions: 0, chapterNotes: 0, videos: 0, notices: 0 };

    // 1. Ping students table
    const { data: stData, error: stErr, count: stCount } = await client
      .from('students')
      .select('*', { count: 'exact', head: true });
    if (stErr) {
      missingTables.push('students');
    } else {
      counts.students = stCount || 0;
    }

    // 2. Test purchases table
    const { data: pData, error: pErr, count: pCount } = await client
      .from('purchases')
      .select('*', { count: 'exact', head: true });
    if (pErr) {
      missingTables.push('purchases');
    } else {
      counts.purchases = pCount || 0;
    }

    // 3. Test chapters table
    const { data: cData, error: cErr, count: cCount } = await client
      .from('chapters')
      .select('*', { count: 'exact', head: true });
    if (cErr) {
      missingTables.push('chapters');
    } else {
      counts.chapters = cCount || 0;
    }

    // 4. Test questions table
    const { data: qData, error: qErr, count: qCount } = await client
      .from('questions')
      .select('*', { count: 'exact', head: true });
    if (qErr) {
      missingTables.push('questions');
    } else {
      counts.questions = qCount || 0;
    }

    // 5. Test chapter_notes table
    const { data: nData, error: nErr, count: nCount } = await client
      .from('chapter_notes')
      .select('*', { count: 'exact', head: true });
    if (nErr) {
      missingTables.push('chapter_notes');
    } else {
      counts.chapterNotes = nCount || 0;
    }

    // 6. Test videos table
    const { data: vData, error: vErr, count: vCount } = await client
      .from('videos')
      .select('*', { count: 'exact', head: true });
    if (vErr) {
      missingTables.push('videos');
    } else {
      counts.videos = vCount || 0;
    }

    // 7. Test notices table
    const { error: notErr, count: notCount } = await client
      .from('notices')
      .select('*', { count: 'exact', head: true });
    if (notErr) {
      missingTables.push('notices');
    } else {
      counts.notices = notCount || 0;
    }

    const latencyMs = Math.round(performance.now() - start);

    if (missingTables.length >= 6) {
      return {
        success: false,
        message: `Connected to Supabase endpoint (${latencyMs}ms), but core tables are missing: ${missingTables.join(', ')}.`,
        latencyMs,
        tableCounts: counts,
        missingTables,
      };
    }

    return {
      success: true,
      message: `Successfully connected to live Supabase (${latencyMs}ms latency). ${counts.students} Students, ${counts.purchases} Orders, ${counts.chapters} Chapters online.`,
      latencyMs,
      tableCounts: counts,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Connection test failed. Verify URL and API Key.',
      latencyMs: Math.round(performance.now() - start),
    };
  }
}

/**
 * Direct quick ping query against students table:
 * supabase.from('students').select('*', { count: 'exact', head: true })
 */
export async function pingSupabaseLive(): Promise<{
  online: boolean;
  studentCount: number;
  latencyMs: number;
  error?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { online: false, studentCount: 0, latencyMs: 0, error: 'Supabase client credentials missing' };
  }
  const start = performance.now();
  try {
    const { count, error } = await client
      .from('students')
      .select('*', { count: 'exact', head: true });

    const latencyMs = Math.round(performance.now() - start);
    if (error) {
      return { online: false, studentCount: 0, latencyMs, error: error.message };
    }
    return { online: true, studentCount: count || 0, latencyMs };
  } catch (e: any) {
    return { online: false, studentCount: 0, latencyMs: Math.round(performance.now() - start), error: e?.message };
  }
}

// ----------------------------------------------------
// 1. STUDENTS & REGISTRATIONS (students table)
// ----------------------------------------------------

export async function fetchSupabaseStudents(): Promise<Student[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    let { data, error } = await client
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback without specific ordering column
      const fallback = await client.from('students').select('*');
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.warn('Error fetching students from Supabase:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row: any) => {
      const isApproved =
        row.admission_status === 'Approval' ||
        row.admission_status === 'Approved' ||
        row.account_status === 'Active';

      const subjects = [
        row.subject_1,
        row.subject_2,
        row.subject_3,
        row.subject_4,
        row.subject_5,
        row.subject_6,
      ].filter(Boolean);

      return {
        id: row.id || `st-${Date.now()}`,
        chseRegNo: row.registration_id || row.chse_reg_no || row.chseRegNo || 'MYCHSE-PENDING',
        rollNo: row.roll_no || row.rollNo || (row.registration_id ? row.registration_id.replace('MYCHSE-', '') : ''),
        name: row.full_name || row.name || 'Student',
        fatherName: row.father_name || row.fatherName || '',
        mobileNumber: row.mobile_number || row.mobileNumber || row.mobile || row.phone || '',
        email: row.gmail || row.email || '',
        gmail: row.gmail || row.email || '',
        age: row.age ? Number(row.age) : 17,
        classYear: '+2 2nd Year',
        batchYear: '2026-27',
        stream: (row.stream as StreamType) || 'Science',
        district: row.district || 'Khordha',
        college: row.college || (row.block ? `${row.block} Jr College, ${row.district || 'Odisha'}` : 'Odisha Higher Secondary School'),
        block: row.block || '',
        state: row.state || 'Odisha',
        address: row.address || '',
        subjects: subjects.length > 0 ? subjects : undefined,
        subject_1: row.subject_1 || subjects[0] || undefined,
        subject_2: row.subject_2 || subjects[1] || undefined,
        subject_3: row.subject_3 || subjects[2] || undefined,
        subject_4: row.subject_4 || subjects[3] || undefined,
        subject_5: row.subject_5 || subjects[4] || undefined,
        subject_6: row.subject_6 || subjects[5] || undefined,
        admissionDate: row.admission_date || undefined,
        admission_status: row.admission_status || (isApproved ? 'Approved' : 'Pending'),
        accountStatus: (isApproved ? 'Active' : (row.account_status || 'Active')) as AccountStatus,
        registeredDate: row.registration_date
          ? new Date(row.registration_date).toLocaleDateString('en-GB')
          : (row.registered_date || row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')),
        passwordHash: row.password_hash || row.passwordHash || 'chse2026',
        temporaryPassword: row.temporary_password || row.temporaryPassword,
        courseAccessApproved: isApproved,
        enrolledPackage: row.enrolled_package || (row.course_name ? String(row.course_name) : `Full CHSE 2nd Year ${row.stream || 'Arts'} Suite`),
        lastActive: row.last_active || row.lastActive || 'Today',
        totalMockTestsTaken: row.total_mock_tests_taken ?? row.totalMockTestsTaken ?? 0,
        avgScorePercentage: row.avg_score_percentage ?? row.avgScorePercentage ?? 0,
        notes: row.address || row.notes || '',
      };
    });
  } catch (err) {
    console.error('Supabase fetch students exception:', err);
    return null;
  }
}

// Approve pending student registration in Supabase
export async function approveSupabaseStudent(
  studentId: string,
  officialRegNo: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    let { error } = await client
      .from('students')
      .update({
        registration_id: officialRegNo,
        chse_reg_no: officialRegNo,
        admission_status: 'Approval',
        account_status: 'Active',
        course_access_approved: true,
      })
      .eq('id', studentId);

    if (error) {
      const fb = await client
        .from('students')
        .update({
          admission_status: 'Approval',
          account_status: 'Active',
          course_access_approved: true,
        })
        .or(`registration_id.eq.${officialRegNo},chse_reg_no.eq.${officialRegNo}`);
      error = fb.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to approve student in Supabase' };
  }
}

// Reset student password directly in Supabase (Zero-OTP)
export async function resetSupabaseStudentPassword(
  chseRegNo: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    // Try matching either registration_id or chse_reg_no
    let { error } = await client
      .from('students')
      .update({
        password_hash: newPassword,
        temporary_password: newPassword,
      })
      .eq('registration_id', chseRegNo);

    if (error) {
      const fallback = await client
        .from('students')
        .update({
          password_hash: newPassword,
          temporary_password: newPassword,
        })
        .eq('chse_reg_no', chseRegNo);
      error = fallback.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Password update failed' };
  }
}

// ----------------------------------------------------
// 2. PURCHASES & 12-DIGIT UTR VERIFICATION (purchases table)
// ----------------------------------------------------

export async function fetchSupabasePurchases(): Promise<PaymentReceipt[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    let { data, error } = await client
      .from('purchases')
      .select('*')
      .order('purchased_at', { ascending: false });

    if (error) {
      const fallback = await client.from('purchases').select('*');
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.warn('Error fetching purchases from Supabase:', error.message);
      return null;
    }

    if (!data) return [];

    // Also fetch students to match student names if not stored on purchases
    let studentMap: Record<string, string> = {};
    try {
      const { data: stList } = await client.from('students').select('id, registration_id, full_name, name');
      if (stList) {
        stList.forEach((st: any) => {
          const sName = st.full_name || st.name;
          if (st.id && sName) studentMap[st.id] = sName;
          if (st.registration_id && sName) studentMap[st.registration_id] = sName;
        });
      }
    } catch {
      // Non-blocking
    }

    return data.map((row: any) => {
      const isApproved = row.status === 'SUCCESS' || row.status === 'Approved';
      const regNo = row.registration_id || row.student_reg_no || row.studentRegNo || '';
      const stName = row.student_name || row.studentName || (regNo ? studentMap[regNo] : '') || (row.student_id ? studentMap[row.student_id] : '') || 'Enrolled Student';

      return {
        id: row.id,
        studentRegNo: regNo,
        studentName: stName,
        stream: (row.stream as StreamType) || 'Arts',
        utrNumber: row.gateway_payment_id || row.utr_number || row.utrNumber || '',
        amount: Number(row.amount || 99),
        paymentDate: row.purchased_at || row.payment_date || row.paymentDate || new Date().toISOString(),
        paymentMethod: row.payment_gateway || row.payment_method || 'UPI QR Manual',
        paymentGateway: row.payment_gateway || row.paymentGateway || 'UPI QR Manual',
        receiptImageUrl: row.receipt_image_url || row.receiptImageUrl,
        status: isApproved ? 'Approved' : (row.status || 'Pending'),
        verifiedByAdmin: row.verified_by || row.verifiedByAdmin || (isApproved ? 'Live Gateway/Admin' : undefined),
        approvedAt: row.verified_at || row.approvedAt || (isApproved ? (row.purchased_at || new Date().toISOString()) : undefined),
        rejectionReason: row.rejection_reason || row.rejectionReason,
        notes: row.notes || (row.course_name ? `Course: ${row.course_name}` : ''),
      };
    });
  } catch (err) {
    console.error('Supabase fetch purchases exception:', err);
    return null;
  }
}

// Verify 12-digit UTR in purchases table and unlock student access in students table
export async function verifySupabasePurchaseUTR(
  purchaseId: string,
  studentRegNo: string,
  adminName: string = 'CHSE Super Admin'
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const nowIso = new Date().toISOString();
    // 1. Update purchase status - support both SUCCESS (User panel) and Approved
    const { error: pErr } = await client
      .from('purchases')
      .update({
        status: 'SUCCESS',
      })
      .eq('id', purchaseId);

    if (pErr) return { success: false, error: pErr.message };

    // 2. Unlock student digital course access in students table (admission_status: 'Approval')
    if (studentRegNo) {
      await client
        .from('students')
        .update({
          admission_status: 'Approval',
          updated_at: nowIso,
        })
        .eq('registration_id', studentRegNo);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to verify UTR in Supabase' };
  }
}

// Reject purchase with reason
export async function rejectSupabasePurchase(
  purchaseId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const { error } = await client
      .from('purchases')
      .update({
        status: 'FAILED',
      })
      .eq('id', purchaseId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to reject purchase' };
  }
}

// ----------------------------------------------------
// 2.1 STUDENT REGISTRATION (from User Panel into public.students)
// ----------------------------------------------------
export async function insertSupabaseStudent(student: {
  name: string;
  chseRegNo: string;
  mobileNumber?: string;
  email?: string;
  stream: StreamType;
  district?: string;
  college?: string;
  password?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const payload = {
      id: `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      full_name: student.name,
      registration_id: student.chseRegNo,
      mobile_number: student.mobileNumber || '',
      gmail: student.email || '',
      stream: student.stream,
      district: student.district || 'Khordha',
      college: student.college || 'Odisha Higher Secondary School',
      admission_status: 'Pending',
      account_status: 'Active',
      password_hash: student.password || 'chse2026',
      temporary_password: student.password || 'chse2026',
      registration_source: 'https://mychse12thclassesedu.netlify.app',
      registration_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    let { data, error } = await client
      .from('students')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) {
      // Fallback to upsert on registration_id so re-registration or updates don't throw constraint error
      const upsertRes = await client
        .from('students')
        .upsert([payload], { onConflict: 'registration_id' })
        .select()
        .maybeSingle();
      data = upsertRes.data;
      error = upsertRes.error;
    }

    if (error) {
      console.warn('Error saving student to Supabase:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to insert student' };
  }
}

// ----------------------------------------------------
// 2.2 PURCHASE / UTR SUBMISSION (from User Panel into public.purchases)
// ----------------------------------------------------
export async function insertSupabasePurchase(purchase: {
  studentRegNo: string;
  studentName?: string;
  stream?: StreamType;
  courseName?: string;
  amount: number;
  utrNumber: string;
  paymentGateway?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const payload = {
      id: `purch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      registration_id: purchase.studentRegNo,
      course_name: purchase.courseName || `CHSE +2 2nd Year ${purchase.stream || 'Master'} Pack`,
      amount: purchase.amount,
      status: 'PENDING',
      gateway_payment_id: purchase.utrNumber,
      payment_gateway: purchase.paymentGateway || 'UPI QR Manual',
      purchased_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('purchases')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Error inserting purchase to Supabase:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to insert purchase' };
  }
}

// ----------------------------------------------------
// 3. CHAPTERS & CURRICULUM (public.chapters table)
// ----------------------------------------------------

export async function fetchSupabaseChapters(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('chapters')
      .select('*')
      .order('chapter_number', { ascending: true });

    if (error) {
      // Fallback try order by chapter_no if legacy column exists
      const fb = await client.from('chapters').select('*');
      if (fb.error) {
        console.warn('Error fetching chapters from Supabase:', fb.error.message);
        return null;
      }
      return fb.data;
    }

    return data || [];
  } catch (err) {
    console.error('Supabase fetch chapters exception:', err);
    return null;
  }
}

export async function upsertSupabaseChapter(chapter: {
  id: string;
  subject_id: string;
  chapter_number: number;
  title: string;
  description?: string;
  is_free: boolean;
  estimated_hours?: number;
  status?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const payload: any = {
      id: chapter.id,
      subject_id: chapter.subject_id,
      chapter_number: Number(chapter.chapter_number),
      title: chapter.title,
      description: chapter.description || '',
      is_free: Boolean(chapter.is_free),
      estimated_hours: Number(chapter.estimated_hours || 4),
      status: chapter.status || 'Published',
    };

    const { data, error } = await client
      .from('chapters')
      .upsert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Supabase chapter upsert error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to upsert chapter' };
  }
}

// Legacy adapter for insertSupabaseChapter
export async function insertSupabaseChapter(chapter: any): Promise<{ success: boolean; data?: any; error?: string }> {
  const id = chapter.id || `chap-${Date.now()}`;
  return upsertSupabaseChapter({
    id,
    subject_id: chapter.subjectId || chapter.subject_id || 'subj-sci-phy',
    chapter_number: chapter.chapterNo || chapter.chapter_number || 1,
    title: chapter.title,
    description: chapter.description || chapter.titleOdia || '',
    is_free: Boolean(chapter.isFree ?? chapter.is_free),
    estimated_hours: chapter.estimatedHours || 4,
    status: chapter.status || 'Published',
  });
}

// Update chapter
export async function updateSupabaseChapter(chapterId: string, updates: any): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.subjectId !== undefined) payload.subject_id = updates.subjectId;
    if (updates.subject_id !== undefined) payload.subject_id = updates.subject_id;
    if (updates.chapterNo !== undefined) payload.chapter_number = updates.chapterNo;
    if (updates.chapter_number !== undefined) payload.chapter_number = updates.chapter_number;
    if (updates.isFree !== undefined) payload.is_free = updates.isFree;
    if (updates.is_free !== undefined) payload.is_free = updates.is_free;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.estimatedHours !== undefined) payload.estimated_hours = updates.estimatedHours;
    if (updates.status !== undefined) payload.status = updates.status;

    const { error } = await client.from('chapters').update(payload).eq('id', chapterId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update chapter' };
  }
}

// Delete chapter
export async function deleteSupabaseChapter(chapterId: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    // Delete cascading references first if needed
    await client.from('questions').delete().eq('chapter_id', chapterId);
    await client.from('chapter_notes').delete().eq('chapter_id', chapterId);
    await client.from('videos').delete().eq('chapter_id', chapterId);

    const { error } = await client.from('chapters').delete().eq('id', chapterId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete chapter' };
  }
}

// ----------------------------------------------------
// 4. QUESTIONS TABLE (MCQs, 2-Mark, 3-Mark, Long Q&A)
// ----------------------------------------------------

export async function fetchSupabaseQuestions(chapterId?: string): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    let query = client.from('questions').select('*');
    if (chapterId) {
      query = query.eq('chapter_id', chapterId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching questions from Supabase:', error.message);
      return null;
    }
    return data || [];
  } catch (err) {
    console.error('Supabase fetch questions exception:', err);
    return null;
  }
}

export async function upsertSupabaseQuestion(q: {
  id?: string;
  chapter_id: string;
  type: 'mcq' | '2_mark' | '3_mark' | 'long' | 'pyq';
  question_text: string;
  question_or?: string;
  options?: string[];
  correct_answer?: string;
  correct_option?: number;
  explanation?: string;
  model_answer?: string;
  marks: number;
  year?: string;
  status?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const payload = {
      id: q.id || `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      chapter_id: q.chapter_id,
      type: q.type,
      question_text: q.question_text,
      question_or: q.question_or || null,
      options: q.options || null,
      correct_answer: q.correct_answer || null,
      correct_option: q.correct_option !== undefined ? q.correct_option : null,
      explanation: q.explanation || null,
      model_answer: q.model_answer || null,
      marks: q.marks || (q.type === 'mcq' ? 1 : 2),
      year: q.year || 'CHSE 2026 Model',
      status: q.status || 'Published',
    };

    const { data, error } = await client
      .from('questions')
      .upsert([payload])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to upsert question' };
  }
}

export async function deleteSupabaseQuestion(questionId: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const { error } = await client.from('questions').delete().eq('id', questionId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete question' };
  }
}

// Convenience adapters for AIGeneratorModal and legacy callers
export async function insertSupabaseMCQ(mcq: {
  chapterId: string;
  question: string;
  questionOdia?: string;
  options: string[];
  optionsOdia?: string[];
  correctOptionIndex: number;
  explanation?: string;
  explanationOdia?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  return upsertSupabaseQuestion({
    chapter_id: mcq.chapterId,
    type: 'mcq',
    question_text: mcq.question,
    question_or: mcq.questionOdia,
    options: mcq.options,
    correct_option: mcq.correctOptionIndex,
    correct_answer: mcq.options[mcq.correctOptionIndex] || '',
    explanation: mcq.explanationOdia ? `${mcq.explanation || ''} | ${mcq.explanationOdia}` : mcq.explanation,
    marks: 1,
    status: 'Published',
  });
}

export async function insertSupabaseBoardQuestion(bq: {
  chapterId: string;
  markType: '2-Mark' | '3-Mark' | '5-Mark' | 'Long Question' | string;
  questionText: string;
  questionOdia?: string;
  answerText: string;
  answerOdia?: string;
  yearAppeared?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const type = bq.markType === '2-Mark' ? '2_mark' : bq.markType === '3-Mark' ? '3_mark' : 'long';
  const marks = bq.markType === '2-Mark' ? 2 : bq.markType === '3-Mark' ? 3 : 7;
  return upsertSupabaseQuestion({
    chapter_id: bq.chapterId,
    type,
    question_text: bq.questionText,
    question_or: bq.questionOdia,
    model_answer: bq.answerText,
    explanation: bq.answerOdia,
    marks,
    year: bq.yearAppeared || 'CHSE 2026 Model Paper',
    status: 'Published',
  });
}

// ----------------------------------------------------
// 5. BILINGUAL CHAPTER NOTES (public.chapter_notes table)
// ----------------------------------------------------

export async function fetchSupabaseNotes(chapterId?: string): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    let query = client.from('chapter_notes').select('*');
    if (chapterId) {
      query = query.eq('chapter_id', chapterId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching chapter_notes from Supabase:', error.message);
      return null;
    }
    return data || [];
  } catch (err) {
    console.error('Supabase fetch notes exception:', err);
    return null;
  }
}

export async function upsertSupabaseNote(note: {
  id?: string;
  chapter_id: string;
  title: string;
  notes_en?: string;
  notes_or?: string;
  english_content?: string;
  odia_content?: string;
  important_points?: string[];
  summary_points?: string[];
  exam_tips?: string;
  status?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const payload = {
      id: note.id || `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      chapter_id: note.chapter_id,
      title: note.title,
      notes_en: note.notes_en || note.english_content || '',
      notes_or: note.notes_or || note.odia_content || null,
      english_content: note.english_content || note.notes_en || null,
      odia_content: note.odia_content || note.notes_or || null,
      important_points: note.important_points || [],
      summary_points: note.summary_points || [],
      exam_tips: note.exam_tips || null,
      status: note.status || 'Published',
    };

    const { data, error } = await client
      .from('chapter_notes')
      .upsert([payload])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to upsert note' };
  }
}

export async function deleteSupabaseNote(noteId: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const { error } = await client.from('chapter_notes').delete().eq('id', noteId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete note' };
  }
}

// ----------------------------------------------------
// 6. VIDEOS TABLE (public.videos table)
// ----------------------------------------------------

export async function fetchSupabaseVideos(chapterId?: string): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    let query = client.from('videos').select('*');
    if (chapterId) {
      query = query.eq('chapter_id', chapterId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching videos from Supabase:', error.message);
      return null;
    }
    return data || [];
  } catch (err) {
    console.error('Supabase fetch videos exception:', err);
    return null;
  }
}

export async function upsertSupabaseVideo(video: {
  id?: string;
  chapter_id: string;
  title: string;
  youtube_url: string;
  youtube_id: string;
  duration?: string;
  thumbnail?: string;
  status?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const payload = {
      id: video.id || `vid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      chapter_id: video.chapter_id,
      title: video.title,
      youtube_url: video.youtube_url,
      youtube_id: video.youtube_id,
      duration: video.duration || '25 mins',
      thumbnail: video.thumbnail || null,
      status: video.status || 'Published',
    };

    const { data, error } = await client
      .from('videos')
      .upsert([payload])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to upsert video' };
  }
}

export async function deleteSupabaseVideo(videoId: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const { error } = await client.from('videos').delete().eq('id', videoId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete video' };
  }
}

// Helper to extract 11-char YouTube ID from any YouTube URL
export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('?')) {
    return cleanUrl;
  }
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = cleanUrl.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return '';
}

// ----------------------------------------------------
// 4. NOTICES (notices table)
// ----------------------------------------------------

export async function fetchSupabaseNotices(): Promise<Announcement[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    let { data, error } = await client
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const fb = await client.from('notices').select('*');
      data = fb.data;
      error = fb.error;
    }

    if (error) {
      console.warn('Error fetching notices from Supabase:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      title: row.title || 'Official Notice',
      titleOdia: row.title_odia || row.titleOdia,
      content: row.description || row.content || '',
      category: row.category || 'CHSE Exam Alert',
      targetStream: row.target_stream || row.targetStream || 'All',
      isHighPriority: Boolean(row.is_high_priority ?? row.isHighPriority ?? true),
      publishedDate: row.published_date || (row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
      active: Boolean(row.active ?? true),
      pdfAttachmentUrl: row.pdf_attachment_url || row.pdfAttachmentUrl,
    }));
  } catch (err) {
    console.error('Supabase fetch notices exception:', err);
    return null;
  }
}

// Publish new notice
export async function publishSupabaseNotice(
  notice: Omit<Announcement, 'id' | 'publishedDate'>
): Promise<{ success: boolean; data?: Announcement; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const nowStr = new Date().toISOString().split('T')[0];
    
    // First try user-panel schema: { title, description }
    let { data, error } = await client
      .from('notices')
      .insert([{
        title: notice.title,
        description: notice.content,
      }])
      .select()
      .single();

    if (error) {
      // Fallback to full schema if user added columns
      const fullPayload = {
        title: notice.title,
        title_odia: notice.titleOdia || null,
        content: notice.content,
        category: notice.category,
        target_stream: notice.targetStream,
        is_high_priority: notice.isHighPriority,
        active: notice.active,
        published_date: nowStr,
        pdf_attachment_url: notice.pdfAttachmentUrl || null,
      };

      const retry = await client
        .from('notices')
        .insert([fullPayload])
        .select()
        .single();
      
      data = retry.data;
      error = retry.error;
    }

    if (error) return { success: false, error: error.message };

    return {
      success: true,
      data: {
        id: data.id,
        title: data.title,
        titleOdia: data.title_odia || notice.titleOdia,
        content: data.description || data.content || notice.content,
        category: data.category || notice.category,
        targetStream: data.target_stream || notice.targetStream,
        isHighPriority: Boolean(data.is_high_priority ?? notice.isHighPriority),
        publishedDate: data.published_date || nowStr,
        active: Boolean(data.active ?? true),
        pdfAttachmentUrl: data.pdf_attachment_url || notice.pdfAttachmentUrl,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to publish notice' };
  }
}

// Toggle notice active status
export async function toggleSupabaseNoticeActive(
  noticeId: string,
  newActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const { error } = await client
      .from('notices')
      .update({ active: newActive })
      .eq('id', noticeId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to toggle notice active' };
  }
}

// Delete notice
export async function deleteSupabaseNotice(noticeId: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const { error } = await client.from('notices').delete().eq('id', noticeId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete notice' };
  }
}

// ----------------------------------------------------
// 5. REALTIME SYNC LISTENER
// ----------------------------------------------------
export function subscribeToSupabaseRealtime(onTableChange: (table: string, payload: any) => void): (() => void) | null {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const channelName = `mychse-realtime-${Date.now()}`;
    const channel = client
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        (payload) => onTableChange('students', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'purchases' },
        (payload) => onTableChange('purchases', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notices' },
        (payload) => onTableChange('notices', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_doubts' },
        (payload) => onTableChange('student_doubts', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pyq_papers' },
        (payload) => onTableChange('pyq_papers', payload)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Supabase Realtime] Subscribed to live database changes');
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[Supabase Realtime] Error establishing subscription:', err);
    return null;
  }
}

// ----------------------------------------------------
// 6. PYQ PAPERS (pyq_papers table)
// ----------------------------------------------------
export async function fetchSupabasePyqs(): Promise<PyqPaper[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('pyq_papers')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.warn('Supabase fetch pyq_papers error:', error.message);
      return null;
    }
    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      year: Number(row.year),
      stream: row.stream,
      subject: row.subject,
      totalMarks: Number(row.total_marks || 100),
      duration: row.duration || '3 Hours',
      questionPattern: row.question_pattern || '',
      downloadUrl: row.download_url || '#',
      hasSolutions: Boolean(row.has_solutions),
      highlights: Array.isArray(row.highlights) ? row.highlights : [],
      keyTopics: Array.isArray(row.key_topics) ? row.key_topics : [],
      isLocked: Boolean(row.is_locked),
    }));
  } catch (e) {
    console.error('fetchSupabasePyqs exception:', e);
    return null;
  }
}

export async function upsertSupabasePyq(paper: PyqPaper): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };
  try {
    const payload = {
      id: paper.id,
      title: paper.title,
      year: paper.year,
      stream: paper.stream,
      subject: paper.subject,
      total_marks: paper.totalMarks,
      duration: paper.duration,
      question_pattern: paper.questionPattern,
      download_url: paper.downloadUrl,
      has_solutions: paper.hasSolutions,
      highlights: paper.highlights,
      key_topics: paper.keyTopics,
      is_locked: paper.isLocked ?? false,
      updated_at: new Date().toISOString(),
    };
    const { error } = await client.from('pyq_papers').upsert(payload);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save PYQ paper to Supabase' };
  }
}

export async function deleteSupabasePyq(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };
  try {
    const { error } = await client.from('pyq_papers').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete PYQ paper from Supabase' };
  }
}

// ----------------------------------------------------
// 7. BUREAU BOOKS (bureau_books table)
// ----------------------------------------------------
export async function fetchSupabaseBureauBooks(): Promise<BureauBook[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from('bureau_books').select('*').order('subject', { ascending: true });
    if (error) {
      console.warn('Supabase fetch bureau_books error:', error.message);
      return null;
    }
    if (!data) return [];
    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      titleOdia: row.title_odia || '',
      stream: row.stream,
      subject: row.subject,
      volume: row.volume || 'Part 1',
      publisher: row.publisher || 'Odisha State Bureau of Textbook Preparation and Production',
      pdfUrl: row.pdf_url || row.download_url || '#',
      downloadUrl: row.download_url || row.pdf_url || '#',
      formulaSheetUrl: row.formula_sheet_url || undefined,
      chaptersCount: Number(row.chapters_count || 10),
      pageCount: Number(row.page_count || 250),
      hasExercisesSolutions: row.has_exercises_solutions ?? true,
    }));
  } catch (e) {
    console.error('fetchSupabaseBureauBooks exception:', e);
    return null;
  }
}

export async function upsertSupabaseBureauBook(book: BureauBook): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };
  try {
    const payload = {
      id: book.id,
      title: book.title,
      title_odia: book.titleOdia,
      stream: book.stream,
      subject: book.subject,
      volume: book.volume,
      publisher: book.publisher,
      download_url: book.downloadUrl || book.pdfUrl || '#',
      formula_sheet_url: book.formulaSheetUrl || null,
      chapters_count: book.chaptersCount,
      page_count: book.pageCount,
      has_exercises_solutions: book.hasExercisesSolutions ?? true,
      updated_at: new Date().toISOString(),
    };
    const { error } = await client.from('bureau_books').upsert(payload);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save Bureau book to Supabase' };
  }
}

export async function deleteSupabaseBureauBook(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };
  try {
    const { error } = await client.from('bureau_books').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete Bureau book from Supabase' };
  }
}

// ----------------------------------------------------
// 8. PRACTICALS & VIVA (practicals table)
// ----------------------------------------------------
export async function fetchSupabasePracticals(): Promise<PracticalLabItem[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from('practicals').select('*').order('experiment_no', { ascending: true });
    if (error) {
      console.warn('Supabase fetch practicals error:', error.message);
      return null;
    }
    if (!data) return [];
    return data.map((row: any) => ({
      id: row.id,
      stream: (row.stream || 'Science') as StreamType,
      subject: row.subject,
      experimentNo: Number(row.experiment_no || 1),
      title: row.title,
      titleOdia: row.title_odia || '',
      apparatus: row.apparatus || '',
      principleFormula: row.principle_formula || '',
      procedureSteps: Array.isArray(row.procedure_steps) ? row.procedure_steps : [],
      precautions: Array.isArray(row.precautions) ? row.precautions : [],
      vivaQuestions: Array.isArray(row.viva_questions) ? row.viva_questions : [],
    }));
  } catch (e) {
    console.error('fetchSupabasePracticals exception:', e);
    return null;
  }
}

export async function upsertSupabasePractical(lab: PracticalLabItem): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };
  try {
    const payload = {
      id: lab.id,
      stream: lab.stream || 'Science',
      subject: lab.subject,
      experiment_no: lab.experimentNo,
      title: lab.title,
      title_odia: lab.titleOdia || null,
      apparatus: lab.apparatus,
      principle_formula: lab.principleFormula,
      procedure_steps: lab.procedureSteps,
      precautions: lab.precautions,
      viva_questions: lab.vivaQuestions,
      updated_at: new Date().toISOString(),
    };
    const { error } = await client.from('practicals').upsert(payload);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save Practical lab to Supabase' };
  }
}

export async function deleteSupabasePractical(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };
  try {
    const { error } = await client.from('practicals').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete Practical from Supabase' };
  }
}

// ----------------------------------------------------
// 9. STUDENT DOUBTS RESOLUTION (student_doubts table)
// ----------------------------------------------------
export async function fetchSupabaseDoubts(): Promise<StudentDoubt[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('student_doubts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch student_doubts error:', error.message);
      return null;
    }
    if (!data) return [];
    return data.map((row: any) => ({
      id: row.id,
      studentId: row.student_id || '',
      studentName: row.student_name || 'Student',
      stream: row.stream || 'Science',
      subject: row.subject || 'Physics',
      topic: row.topic || '',
      doubtText: row.doubt_text || '',
      answerText: row.answer_text || undefined,
      answeredBy: row.answered_by || undefined,
      answeredAt: row.answered_at || undefined,
      createdAt: row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').slice(0, 16) : new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: row.status || 'Pending',
    }));
  } catch (e) {
    console.error('fetchSupabaseDoubts exception:', e);
    return null;
  }
}

export async function upsertSupabaseDoubt(doubt: StudentDoubt): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };
  try {
    const payload = {
      id: doubt.id,
      student_id: doubt.studentId,
      student_name: doubt.studentName,
      stream: doubt.stream,
      subject: doubt.subject,
      topic: doubt.topic,
      doubt_text: doubt.doubtText,
      answer_text: doubt.answerText || null,
      answered_by: doubt.answeredBy || null,
      answered_at: doubt.answeredAt || null,
      status: doubt.status,
      updated_at: new Date().toISOString(),
    };
    const { error } = await client.from('student_doubts').upsert(payload);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save student doubt to Supabase' };
  }
}

export async function deleteSupabaseDoubt(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };
  try {
    const { error } = await client.from('student_doubts').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete doubt from Supabase' };
  }
}

// ----------------------------------------------------
// SQL SETUP SCRIPT GENERATOR
// ----------------------------------------------------
export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- MY CHSE 12TH CLASSES - SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase Project SQL Editor
-- ============================================================

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chse_reg_no TEXT UNIQUE NOT NULL,
    roll_no TEXT,
    name TEXT NOT NULL,
    father_name TEXT,
    mobile_number TEXT,
    email TEXT,
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Arts', 'Commerce')),
    district TEXT DEFAULT 'Khordha',
    college TEXT,
    account_status TEXT DEFAULT 'Pending' CHECK (account_status IN ('Active', 'Pending', 'Blocked')),
    registered_date TEXT DEFAULT to_char(CURRENT_DATE, 'YYYY-MM-DD'),
    password_hash TEXT NOT NULL DEFAULT 'chse2026',
    temporary_password TEXT,
    course_access_approved BOOLEAN DEFAULT FALSE,
    enrolled_package TEXT DEFAULT 'CHSE 12th Complete 2026 Batch',
    last_active TEXT DEFAULT 'Today',
    total_mock_tests_taken INTEGER DEFAULT 0,
    avg_score_percentage NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PURCHASES TABLE (12-Digit UPI UTR Audits)
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    student_reg_no TEXT NOT NULL,
    student_name TEXT NOT NULL,
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Arts', 'Commerce')),
    utr_number TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    payment_method TEXT DEFAULT 'Google Pay',
    payment_gateway TEXT DEFAULT 'UPI QR Manual',
    receipt_image_url TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHAPTERS TABLE (Curriculum & Odia Notes CMS)
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_no INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_odia TEXT,
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Arts', 'Commerce')),
    subject TEXT NOT NULL,
    is_free BOOLEAN DEFAULT FALSE,
    notes_markdown TEXT DEFAULT '',
    odia_summary TEXT,
    board_questions_count INTEGER DEFAULT 0,
    mcq_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NOTICES TABLE (Live Announcement Bulletins)
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_odia TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'CHSE Exam Alert',
    target_stream TEXT DEFAULT 'All' CHECK (target_stream IN ('All', 'Science', 'Arts', 'Commerce')),
    is_high_priority BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    published_date TEXT DEFAULT to_char(CURRENT_DATE, 'YYYY-MM-DD'),
    pdf_attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOARD_QUESTIONS TABLE (CHSE Model 2-Mark, 3-Mark, Long Questions)
CREATE TABLE IF NOT EXISTS public.board_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id TEXT,
    mark_type TEXT NOT NULL,
    question_text TEXT NOT NULL,
    question_odia TEXT,
    answer_text TEXT NOT NULL,
    answer_odia TEXT,
    year_appeared TEXT DEFAULT 'CHSE Model',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MCQS TABLE (4-Option MCQs with Explanations & Answer Key)
CREATE TABLE IF NOT EXISTS public.mcqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id TEXT,
    question TEXT NOT NULL,
    question_odia TEXT,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    options_odia JSONB DEFAULT '[]'::jsonb,
    correct_option_index INTEGER NOT NULL DEFAULT 0,
    explanation TEXT,
    explanation_odia TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PYQ PAPERS TABLE (10-Year CHSE Board Question Papers & Solutions)
CREATE TABLE IF NOT EXISTS public.pyq_papers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Arts', 'Commerce')),
    subject TEXT NOT NULL,
    total_marks INTEGER DEFAULT 100,
    duration TEXT DEFAULT '3 Hours',
    question_pattern TEXT,
    download_url TEXT,
    has_solutions BOOLEAN DEFAULT TRUE,
    highlights JSONB DEFAULT '[]'::jsonb,
    key_topics JSONB DEFAULT '[]'::jsonb,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BUREAU BOOKS TABLE (Official Odisha State Bureau Textbooks & Formulas)
CREATE TABLE IF NOT EXISTS public.bureau_books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_odia TEXT,
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Arts', 'Commerce')),
    subject TEXT NOT NULL,
    volume TEXT DEFAULT 'Part 1',
    publisher TEXT DEFAULT 'Odisha State Bureau of Textbook Preparation and Production',
    download_url TEXT,
    formula_sheet_url TEXT,
    chapters_count INTEGER DEFAULT 10,
    page_count INTEGER DEFAULT 250,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PRACTICALS TABLE (30-Marks Practical Exam Experiments & Viva Questions)
CREATE TABLE IF NOT EXISTS public.practicals (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    experiment_no INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_odia TEXT,
    apparatus TEXT,
    principle_formula TEXT,
    procedure_steps JSONB DEFAULT '[]'::jsonb,
    precautions JSONB DEFAULT '[]'::jsonb,
    viva_questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. STUDENT DOUBTS TABLE (24x7 Faculty Doubt Resolution)
CREATE TABLE IF NOT EXISTS public.student_doubts (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_name TEXT NOT NULL,
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Arts', 'Commerce')),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    doubt_text TEXT NOT NULL,
    answer_text TEXT,
    answered_by TEXT,
    answered_at TIMESTAMPTZ,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Answered')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bureau_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practicals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_doubts ENABLE ROW LEVEL SECURITY;

-- Allow Public / Authenticated Read & Write with Anon or Service Role
CREATE POLICY "Allow all operations for anon and service" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon and service" ON public.purchases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon and service" ON public.chapters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon and service" ON public.notices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon and service" ON public.board_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon and service" ON public.mcqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon and service on pyqs" ON public.pyq_papers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon and service on books" ON public.bureau_books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon and service on practicals" ON public.practicals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon and service on doubts" ON public.student_doubts FOR ALL USING (true) WITH CHECK (true);
`;

/**
 * Full PostgreSQL DDL Schema for Odisha CHSE +2 2nd Year Administration.
 * Run directly in the Supabase SQL Editor.
 */
export const SUPABASE_SCHEMA_SQL = `-- =========================================================================
-- MY CHSE 12TH CLASSES (ODISHA CHSE +2 2ND YEAR) - PRODUCTION SUPABASE DDL
-- Tables: students, purchases, chapters, notices
-- Architecture: Zero-OTP CHSE Registration & 12-Digit Bank UPI UTR Verification
-- =========================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. STUDENTS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chse_reg_no VARCHAR(50) UNIQUE NOT NULL, -- e.g. MYCHSE-2026-XXXXX
    roll_no VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    stream VARCHAR(30) NOT NULL CHECK (stream IN ('Science', 'Arts', 'Commerce')),
    college VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    account_status VARCHAR(30) DEFAULT 'Active' CHECK (account_status IN ('Active', 'Suspended', 'Pending Review')),
    course_access_approved BOOLEAN DEFAULT FALSE,
    registration_source VARCHAR(100) DEFAULT 'mychse12thclassesedu.netlify.app',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_reg_no ON public.students (chse_reg_no);
CREATE INDEX IF NOT EXISTS idx_students_mobile ON public.students (mobile_number);
CREATE INDEX IF NOT EXISTS idx_students_stream ON public.students (stream);

-- -------------------------------------------------------------------------
-- 2. PURCHASES TABLE (12-Digit Bank UPI UTR Verification)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    student_name VARCHAR(255) NOT NULL,
    student_reg_no VARCHAR(50) NOT NULL,
    stream VARCHAR(30) NOT NULL,
    utr_number VARCHAR(50) UNIQUE NOT NULL, -- Bank 12-digit UPI UTR number
    amount NUMERIC(10, 2) NOT NULL DEFAULT 99.00,
    payment_method VARCHAR(50) DEFAULT 'UPI QR', -- PhonePe, Google Pay, Paytm, BHIM
    payment_gateway VARCHAR(50) DEFAULT 'UPI QR Manual',
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    verified_by VARCHAR(100),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_utr ON public.purchases (utr_number);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases (status);
CREATE INDEX IF NOT EXISTS idx_purchases_reg_no ON public.purchases (student_reg_no);

-- -------------------------------------------------------------------------
-- 3. CHAPTERS TABLE (Curriculum & Odia Notes CMS)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_no INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_odia VARCHAR(255),
    stream VARCHAR(30) NOT NULL CHECK (stream IN ('Science', 'Arts', 'Commerce')),
    subject VARCHAR(100) NOT NULL,
    is_free BOOLEAN DEFAULT FALSE, -- Chapter 1 is Free Preview, Ch 2+ Locked
    notes_markdown TEXT,
    notes_pdf_url TEXT,
    odia_summary TEXT,
    board_questions_count INT DEFAULT 0,
    mcq_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chapters_stream_subject ON public.chapters (stream, subject);

-- -------------------------------------------------------------------------
-- 4. NOTICES TABLE (Exam Alerts & Live Broadcasts)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_odia VARCHAR(255),
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'GENERAL',
    target_stream VARCHAR(30) DEFAULT 'All',
    is_high_priority BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    published_date DATE DEFAULT CURRENT_DATE,
    pdf_attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notices_active ON public.notices (active);

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active notices & free chapters
CREATE POLICY "Allow public read notices" ON public.notices FOR SELECT USING (active = true);
CREATE POLICY "Allow public read chapters" ON public.chapters FOR SELECT USING (true);

-- Allow authenticated admins full access (and anon access if using test keys)
CREATE POLICY "Allow service role & anon full access to students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role & anon full access to purchases" ON public.purchases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role & anon full access to chapters" ON public.chapters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role & anon full access to notices" ON public.notices FOR ALL USING (true) WITH CHECK (true);
`;

