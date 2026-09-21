// services/adminApi.ts — Lapisan API untuk Entitas Mahasiswa & Administrasi Kampus (Modul 7 - Entitas Kedua)
import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string().default('MAHASISWA'),
  university: z.string().optional().default('Politeknik Negeri'),
  nim: z.string().optional().default('2300000000'),
  semester: z.string().optional().default('Semester 5'),
  gpa: z.string().optional().default('3.85'),
  academicVerified: z.boolean().default(true),
  rfidUid: z.string().optional(),
  createdAt: z.string().optional(),
});

export const KioskSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  ipAddress: z.string().optional().default('192.168.1.101'),
  firmware: z.string().optional().default('v2.4.1-ESP32-RC522'),
  totalTapsToday: z.number().optional().default(0),
  status: z.enum(['ONLINE', 'OFFLINE', 'STANDBY']),
  lastHeartbeat: z.string().optional(),
});

export const AdminApplicationSchema = z.object({
  id: z.string(),
  studentName: z.string().optional(),
  projectTitle: z.string().optional(),
  companyName: z.string().optional(),
  matchScore: z.number().optional(),
  status: z.string().optional(),
  appliedAt: z.string().optional(),
});

export const AdminStatsSchema = z.object({
  totalStudents: z.number(),
  registeredStudents: z.number(),
  totalProjects: z.number(),
  totalMatches: z.number(),
  activeKiosks: z.number(),
  averageMatchRate: z.string(),
});

export const AdminDataSchema = z.object({
  success: z.boolean(),
  stats: AdminStatsSchema,
  students: z.array(StudentSchema),
  kiosks: z.array(KioskSchema),
  projects: z.array(z.record(z.string(), z.unknown())).optional().default([]),
  applications: z.array(AdminApplicationSchema).optional().default([]),
});

export type Student = z.infer<typeof StudentSchema>;
export type Kiosk = z.infer<typeof KioskSchema>;
export type AdminApplication = z.infer<typeof AdminApplicationSchema>;
export type AdminStats = z.infer<typeof AdminStatsSchema>;
export type AdminDataResponse = z.infer<typeof AdminDataSchema>;

export const fetchAdminData = async (): Promise<AdminDataResponse> => {
  const response = await fetch('/api/admin', {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Gagal memuat data administrasi dari server.');
  const json = await response.json();
  return AdminDataSchema.parse(json);
};

export const verifyStudentStatus = async ({
  studentId,
  verified,
}: {
  studentId: string;
  verified: boolean;
}): Promise<{ success: boolean; message: string }> => {
  const response = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'verify_student',
      studentId,
      verified,
    }),
  });
  if (!response.ok) throw new Error('Gagal memperbarui status verifikasi mahasiswa.');
  return response.json();
};

export const updateKioskStatusApi = async ({
  kioskId,
  kioskStatus,
}: {
  kioskId: string;
  kioskStatus: string;
}): Promise<{ success: boolean; message: string }> => {
  const response = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update_kiosk',
      kioskId,
      kioskStatus,
    }),
  });
  if (!response.ok) throw new Error('Gagal memperbarui status terminal kiosk.');
  return response.json();
};
