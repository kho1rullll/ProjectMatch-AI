import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db';
import { CreateProjectSchema } from '@/types/project';

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST: Pasang lowongan proyek baru ke SQLite Database dengan validasi Zod
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = CreateProjectSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validasi input pembuatan proyek gagal',
          issues: parseResult.error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;

    const newProject = createProject({
      title: validData.title,
      company: validData.company,
      category: validData.category,
      workType: validData.workType,
      duration: validData.duration,
      stipend: validData.stipend,
      skillsRequired: validData.skillsRequired,
      description: validData.description,
      reqAiml: validData.reqAiml,
      reqFrontend: validData.reqFrontend,
      reqUiux: validData.reqUiux,
      reqBackend: validData.reqBackend,
      reqArchitecture: validData.reqArchitecture,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Proyek berhasil disimpan secara permanen ke SQLite Database!',
        data: newProject,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan proyek ke database';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
