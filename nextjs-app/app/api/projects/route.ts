import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db';

// GET: Ambil daftar seluruh lowongan proyek dari SQLite Database
export async function GET() {
  try {
    const projects = getAllProjects();
    return NextResponse.json({
      success: true,
      database: 'SQLite (projectmatch.db)',
      count: projects.length,
      data: projects,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Pasang lowongan proyek baru ke SQLite Database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      company,
      category,
      workType,
      duration,
      stipend,
      skillsRequired,
      description,
      reqAiml,
      reqFrontend,
      reqUiux,
      reqBackend,
      reqArchitecture,
    } = body;

    if (!title || !company || !description) {
      return NextResponse.json(
        { success: false, error: 'Judul, nama mitra, dan deskripsi wajib diisi.' },
        { status: 400 }
      );
    }

    const skillsString = Array.isArray(skillsRequired)
      ? skillsRequired.join(', ')
      : skillsRequired || 'General Tech';

    const newProject = createProject({
      title,
      company,
      category: category || 'AI & Machine Learning',
      workType: workType || 'Hybrid',
      duration: duration || '3 Bulan',
      stipend: stipend || 'Rp 4.000.000 / bln',
      skillsRequired: skillsString,
      description,
      reqAiml: Number(reqAiml) || 85,
      reqFrontend: Number(reqFrontend) || 70,
      reqUiux: Number(reqUiux) || 65,
      reqBackend: Number(reqBackend) || 80,
      reqArchitecture: Number(reqArchitecture) || 75,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Proyek berhasil disimpan secara permanen ke SQLite Database!',
        data: newProject,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan proyek ke database' },
      { status: 500 }
    );
  }
}
