import { describe, it, expect } from 'vitest';
import {
  StudentSchema,
  KioskSchema,
  AdminStatsSchema,
  AdminDataSchema,
} from '@/services/adminApi';
import { ALL_PROJECTS, STUDENT_PROFILE } from '@/lib/data';
import { ProjectSchema } from '@/types/project';

describe('Admin Service Schemas & Data Layer (Bab l & SRS FR-10..12)', () => {
  it('should validate valid student records', () => {
    const validStudent = {
      id: 'usr-001',
      name: 'Raden Satria',
      email: 'raden.satria@student.uns.ac.id',
      role: 'MAHASISWA',
      university: 'Universitas Sebelas Maret',
      nim: 'V3925028',
      semester: 'Semester 6',
      gpa: '3.88',
      academicVerified: true,
    };

    const parsed = StudentSchema.safeParse(validStudent);
    expect(parsed.success).toBe(true);
  });

  it('should validate valid kiosk hardware records', () => {
    const validKiosk = {
      id: 'KIOSK-01',
      name: 'Smart Kiosk Gedung Vokasi',
      location: 'Lantai 1',
      status: 'ONLINE' as const,
      ipAddress: '192.168.1.100',
      firmware: 'v2.4.1-ESP32',
      totalTapsToday: 142,
    };

    const parsed = KioskSchema.safeParse(validKiosk);
    expect(parsed.success).toBe(true);
  });

  it('should reject invalid kiosk statuses', () => {
    const invalidKiosk = {
      id: 'KIOSK-01',
      name: 'Smart Kiosk Gedung Vokasi',
      location: 'Lantai 1',
      status: 'BROKEN', // Not in enum
    };

    const parsed = KioskSchema.safeParse(invalidKiosk);
    expect(parsed.success).toBe(false);
  });

  it('should validate comprehensive admin overview response payload', () => {
    const mockAdminResponse = {
      success: true,
      stats: {
        totalStudents: 1240,
        registeredStudents: 312,
        totalProjects: 8,
        totalMatches: 890,
        activeKiosks: 3,
        averageMatchRate: '94.2%',
      },
      students: [
        {
          id: 'usr-001',
          name: 'Raden Satria',
          email: 'raden@student.uns.ac.id',
          role: 'MAHASISWA',
          academicVerified: true,
        },
      ],
      kiosks: [
        {
          id: 'KIOSK-01',
          name: 'Terminal Utama',
          location: 'Lobby',
          status: 'ONLINE',
        },
      ],
      applications: [],
    };

    const parsed = AdminDataSchema.safeParse(mockAdminResponse);
    expect(parsed.success).toBe(true);
  });
});

describe('Academic Mock Data & Project Integrity (SRS FR-04, FR-06, FR-07)', () => {
  it('should confirm all seed projects satisfy strict ProjectSchema', () => {
    expect(ALL_PROJECTS.length).toBeGreaterThanOrEqual(6);

    for (const project of ALL_PROJECTS) {
      const parsed = ProjectSchema.safeParse(project);
      expect(parsed.success, `Project ${project.id} failed validation`).toBe(true);
      expect(project.matchScore).toBeGreaterThanOrEqual(0);
      expect(project.matchScore).toBeLessThanOrEqual(100);
      expect(project.skillsRequired.length).toBeGreaterThan(0);
    }
  });

  it('should verify student profile structure and academic details', async () => {
    expect(STUDENT_PROFILE.name).toBe('Raden Satria');
    expect(STUDENT_PROFILE.badges.length).toBeGreaterThan(0);
    expect(STUDENT_PROFILE.radarStats.aiml).toBe(92);

    const featured = await import('@/lib/data').then((m) => m.getFeaturedProjects());
    expect(featured.length).toBeGreaterThanOrEqual(6);

    const single = await import('@/lib/data').then((m) => m.getProjectById('proj-001'));
    expect(single).not.toBeNull();
    expect(single?.title).toContain('NLP');
  });
});

describe('API Client Services Integration (services/projectApi & services/adminApi)', () => {
  const originalFetch = globalThis.fetch;

  it('should successfully fetch projects and parse with ProjectSchema', async () => {
    const mockList = [ALL_PROJECTS[0]];
    globalThis.fetch = async () =>
      new Response(JSON.stringify(mockList), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const { fetchProjects, fetchProjectById } = await import('@/services/projectApi');
    const result = await fetchProjects();
    expect(result.length).toBe(1);
    expect(result[0]?.id).toBe('proj-001');

    const byId = await fetchProjectById('proj-001');
    expect(byId.id).toBe('proj-001');

    globalThis.fetch = originalFetch;
  });

  it('should handle fetch errors in projectApi', async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: 'Server Down' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });

    const { fetchProjects } = await import('@/services/projectApi');
    await expect(fetchProjects()).rejects.toThrow('Gagal mengambil data proyek dari server.');

    globalThis.fetch = originalFetch;
  });

  it('should execute verifyStudentStatus and updateKioskStatusApi successfully', async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ success: true, message: 'Status updated' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const { verifyStudentStatus, updateKioskStatusApi } = await import('@/services/adminApi');

    const res1 = await verifyStudentStatus({ studentId: 'usr-001', verified: true });
    expect(res1.success).toBe(true);

    const res2 = await updateKioskStatusApi({ kioskId: 'KIOSK-01', kioskStatus: 'ONLINE' });
    expect(res2.success).toBe(true);

    globalThis.fetch = originalFetch;
  });

  it('should post and create a project via createProject', async () => {
    const mockCreated = {
      ...ALL_PROJECTS[0],
      id: 'proj-new-99',
      title: 'Created via Service API',
    };

    globalThis.fetch = async () =>
      new Response(JSON.stringify(mockCreated), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const { createProject } = await import('@/services/projectApi');
    const created = await createProject({
      title: 'Created via Service API',
      company: 'Test Org',
      category: 'AI & Machine Learning',
      workType: 'Remote',
      duration: '3 Bulan',
      stipend: 'Rp 4.000.000',
      description: 'Detailed description test',
      skillsRequired: 'Python, PyTorch',
      reqAiml: 90,
      reqFrontend: 70,
      reqUiux: 60,
      reqBackend: 85,
      reqArchitecture: 75,
    });

    expect(created.id).toBe('proj-new-99');
    expect(created.title).toBe('Created via Service API');

    globalThis.fetch = originalFetch;
  });

  it('should fetch admin overview data via fetchAdminData', async () => {
    const mockAdminData = {
      success: true,
      stats: {
        totalStudents: 1240,
        registeredStudents: 312,
        totalProjects: 8,
        totalMatches: 890,
        activeKiosks: 3,
        averageMatchRate: '94.2%',
      },
      students: [],
      kiosks: [],
      applications: [],
    };

    globalThis.fetch = async () =>
      new Response(JSON.stringify(mockAdminData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const { fetchAdminData } = await import('@/services/adminApi');
    const res = await fetchAdminData();
    expect(res.success).toBe(true);
    expect(res.stats.totalStudents).toBe(1240);
    expect(AdminStatsSchema.safeParse(res.stats).success).toBe(true);

    globalThis.fetch = originalFetch;
  });
});
