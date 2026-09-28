import { NextResponse } from 'next/server';
import {
  getAllProjects,
  getAllApplications,
  getAllStudents,
  updateApplicationStatus,
  deleteProject,
  createProject,
} from '@/lib/db';
import { z } from 'zod';

const MitraActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('update_application_status'),
    applicationId: z.string(),
    status: z.enum(['REVIEW', 'ACCEPTED', 'REJECTED']),
  }),
  z.object({
    action: z.literal('delete_project'),
    projectId: z.string(),
  }),
  z.object({
    action: z.literal('create_project'),
    title: z.string().min(8),
    company: z.string().min(2),
    category: z.string().optional(),
    workType: z.string().optional(),
    duration: z.string().optional(),
    stipend: z.string().optional(),
    skillsRequired: z.string().optional(),
    description: z.string().min(20),
    reqAiml: z.number().optional(),
    reqFrontend: z.number().optional(),
    reqUiux: z.number().optional(),
    reqBackend: z.number().optional(),
    reqArchitecture: z.number().optional(),
  }),
]);

export async function GET() {
  try {
    const allProjects = getAllProjects();
    const allApplications = getAllApplications();
    const allStudents = getAllStudents();

    // Compute metrics
    const stats = {
      totalProjects: allProjects.length,
      activeProjects: allProjects.filter((p) => p.verified !== false).length,
      totalApplicants: allApplications.length,
      acceptedApplicants: allApplications.filter((a) => a.status === 'ACCEPTED').length,
      averageMatchRate: '93.8%',
    };

    return NextResponse.json({
      success: true,
      stats,
      projects: allProjects,
      applications: allApplications,
      students: allStudents,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parseResult = MitraActionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parameter aksi tidak valid',
          issues: parseResult.error.errors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    if (data.action === 'update_application_status') {
      const updated = updateApplicationStatus(data.applicationId, data.status);
      return NextResponse.json({
        success: true,
        message: `Status lamaran berhasil diperbarui menjadi "${data.status}"!`,
        application: updated,
      });
    }

    if (data.action === 'delete_project') {
      const deleted = deleteProject(data.projectId);
      return NextResponse.json({
        success: deleted,
        message: deleted
          ? 'Lowongan proyek berhasil dihapus!'
          : 'Proyek tidak ditemukan.',
      });
    }

    if (data.action === 'create_project') {
      const newProj = createProject(data);
      return NextResponse.json({
        success: true,
        message: 'Lowongan proyek berhasil dipublikasikan!',
        project: newProj,
      });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memproses aksi';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
