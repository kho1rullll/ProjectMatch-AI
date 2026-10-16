// types/admin.ts — Skema Modul Admin Sesuai SKPL FR-11 & FR-12
import { z } from 'zod';

export interface AdminUserItem {
  id: string;
  email: string;
  role: 'mahasiswa' | 'admin';
  is_active: boolean;
  created_at: string;
  full_name?: string;
  nim?: string;
  github_username?: string;
}

export interface UserUpdateStatusRoleInput {
  user_id: string;
  is_active?: boolean;
  role?: 'mahasiswa' | 'admin';
}

export interface AdminStatistics {
  total_users: number;
  active_users: number;
  total_mahasiswa: number;
  total_admin: number;
  total_jobs: number;
  jobs_by_platform: {
    linkedin: number;
    fiverr: number;
    upwork: number;
    manual?: number;
  };
  jobs_by_type: {
    freelance: number;
    part_time: number;
  };
  total_matches_computed: number;
  total_bookmarks: number;
  average_similarity_score: number;
}

// Schemas for compatibility with existing tests
export const VerifyStudentActionSchema = z.object({
  action: z.literal('verify_student'),
  studentId: z.string().min(1, 'ID mahasiswa wajib disertakan'),
  verified: z.boolean(),
});

export const UpdateKioskActionSchema = z.object({
  action: z.literal('update_kiosk'),
  kioskId: z.string().min(1, 'ID kiosk wajib disertakan'),
  kioskStatus: z.enum(['ONLINE', 'STANDBY', 'OFFLINE']),
});

export const AdminActionSchema = z.discriminatedUnion('action', [
  VerifyStudentActionSchema,
  UpdateKioskActionSchema,
]);

export type VerifyStudentAction = z.infer<typeof VerifyStudentActionSchema>;
export type UpdateKioskAction = z.infer<typeof UpdateKioskActionSchema>;
export type AdminAction = z.infer<typeof AdminActionSchema>;
