import { NextResponse } from 'next/server';
import {
  getAllStudents,
  getAllProjects,
  getAllApplications,
  getAllKiosks,
  verifyStudent,
  updateKioskStatus,
} from '@/lib/db';
import { AdminActionSchema } from '@/types/admin';

export async function GET() {
  try {
    const students = getAllStudents();
    const projects = getAllProjects();
    const applications = getAllApplications();
    const kiosks = getAllKiosks();

    const stats = {
      totalStudents: 1240, // Campus active aggregate
      registeredStudents: students.length,
      totalProjects: projects.length,
      totalMatches: 890,
      activeKiosks: kiosks.filter((k) => k.status === 'ONLINE').length,
      averageMatchRate: '92.4%',
    };

    return NextResponse.json({
      success: true,
      stats,
      students,
      projects,
      applications,
      kiosks,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parseResult = AdminActionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Aksi admin tidak valid atau parameter tidak lengkap',
          issues: parseResult.error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    if (data.action === 'verify_student') {
      const updated = verifyStudent(data.studentId, data.verified);
      return NextResponse.json({
        success: true,
        message: `Status akademik mahasiswa berhasil ${data.verified ? 'Diverifikasi' : 'Dibatalkan'}!`,
        student: updated,
      });
    }

    if (data.action === 'update_kiosk') {
      const updated = updateKioskStatus(data.kioskId, data.kioskStatus);
      return NextResponse.json({
        success: true,
        message: `Status terminal kiosk ${data.kioskId} diperbarui menjadi ${data.kioskStatus}!`,
        kiosk: updated,
      });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memproses aksi admin';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
