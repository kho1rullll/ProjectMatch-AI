// types/admin.ts — Skema Zod & Type Safety untuk Aksi Admin (Final Project Bab e & l)
import { z } from 'zod';

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
