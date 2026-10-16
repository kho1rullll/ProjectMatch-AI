import { z } from 'zod';
import { ProjectSchema } from '@/types/project';
import { StudentSchema } from '@/services/adminApi';

export const MitraApplicationSchema = z.object({
  id: z.string(),
  studentName: z.string().optional(),
  projectTitle: z.string().optional(),
  companyName: z.string().optional(),
  matchScore: z.number().optional(),
  status: z.string().optional(),
  appliedAt: z.string().optional(),
});

export const MitraStatsSchema = z.object({
  totalProjects: z.number(),
  activeProjects: z.number(),
  totalApplicants: z.number(),
  acceptedApplicants: z.number(),
  averageMatchRate: z.string(),
});

export const MitraDataSchema = z.object({
  success: z.boolean(),
  stats: MitraStatsSchema,
  projects: z.array(ProjectSchema),
  applications: z.array(MitraApplicationSchema),
  students: z.array(StudentSchema),
});

export type MitraApplication = z.infer<typeof MitraApplicationSchema>;
export type MitraStats = z.infer<typeof MitraStatsSchema>;
export type MitraDataResponse = z.infer<typeof MitraDataSchema>;

export const fetchMitraData = async (): Promise<MitraDataResponse> => {
  const res = await fetch('/api/mitra', {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal memuat data mitra dari server.');
  const json = await res.json();
  return MitraDataSchema.parse(json);
};

export const updateApplicantStatusApi = async ({
  applicationId,
  status,
}: {
  applicationId: string;
  status: 'REVIEW' | 'ACCEPTED' | 'REJECTED';
}): Promise<{ success: boolean; message: string }> => {
  const res = await fetch('/api/mitra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update_application_status',
      applicationId,
      status,
    }),
  });
  if (!res.ok) throw new Error('Gagal memperbarui status pelamar.');
  return res.json();
};

export const deleteProjectApi = async ({
  projectId,
}: {
  projectId: string;
}): Promise<{ success: boolean; message: string }> => {
  const res = await fetch('/api/mitra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'delete_project',
      projectId,
    }),
  });
  if (!res.ok) throw new Error('Gagal menghapus lowongan proyek.');
  return res.json();
};
