import { NextResponse } from 'next/server';
import {
  getAllStudents,
  getAllProjects,
  getAllApplications,
  getAllKiosks,
  verifyStudent,
  updateKioskStatus,
} from '@/lib/db';

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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, studentId, verified, kioskId, kioskStatus } = await request.json();

    if (action === 'verify_student') {
      const updated = verifyStudent(studentId, verified);
      return NextResponse.json({
        success: true,
        message: `Status akademik mahasiswa berhasil ${verified ? 'Diverifikasi' : 'Dibatalkan'}!`,
        student: updated,
      });
    }

    if (action === 'update_kiosk') {
      const updated = updateKioskStatus(kioskId, kioskStatus);
      return NextResponse.json({
        success: true,
        message: `Status terminal kiosk ${kioskId} diperbarui menjadi ${kioskStatus}!`,
        kiosk: updated,
      });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memproses aksi admin' },
      { status: 500 }
    );
  }
}
