import { describe, it, expect } from 'vitest';
import {
  ProjectSchema,
  CreateProjectSchema,
  toProjectId,
  toStudentId,
  toUserId,
  type AsyncState,
} from '@/types/project';
import { LoginRequestSchema, RegisterRequestSchema } from '@/types/auth';
import { AdminActionSchema } from '@/types/admin';

describe('TypeScript & Zod Runtime Schema Validation', () => {
  it('should validate valid Project object', () => {
    const validProject = {
      id: 'proj-001',
      title: 'Platform Analitik Berbasis LLM',
      company: 'PT Data Cerdas Nusantara',
      category: 'AI & Machine Learning',
      matchScore: 94,
      workType: 'Remote',
      duration: '3 Bulan',
      stipend: 'Rp 5.000.000 / bln',
      description: 'Membangun pipeline ekstraksi data teks dan model klasifikasi NLP.',
      skillsRequired: ['Python', 'PyTorch', 'Transformers', 'FastAPI'],
      verified: true,
      postedAt: '1 hari lalu',
      similarityMetric: 0.94,
    };

    const parsed = ProjectSchema.safeParse(validProject);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.matchScore).toBe(94);
      expect(parsed.data.skillsRequired).toEqual(['Python', 'PyTorch', 'Transformers', 'FastAPI']);
    }
  });

  it('should reject invalid Project with short title or invalid matchScore', () => {
    const invalidProject = {
      id: 'proj-002',
      title: 'AI', // Too short (< 5 chars)
      company: 'PT Test',
      matchScore: 150, // Invalid (> 100)
    };

    const parsed = ProjectSchema.safeParse(invalidProject);
    expect(parsed.success).toBe(false);
  });

  it('should validate and transform CreateProjectSchema with array or comma-separated string', () => {
    const inputWithArray = {
      title: 'Pengembangan Dashboard Analytics Mahasiswa',
      company: 'Laboratorium RPL SV UNS',
      category: 'Web Development',
      workType: 'Hybrid',
      duration: '4 Bulan',
      stipend: 'Rp 4.500.000 / bln',
      skillsRequired: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
      description: 'Membangun antarmuka dashboard analytics performa dan pemantauan proyek.',
    };

    const parsed = CreateProjectSchema.safeParse(inputWithArray);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.skillsRequired).toBe('React, TypeScript, Tailwind, Next.js');
    }

    const inputWithString = {
      ...inputWithArray,
      skillsRequired: 'Node.js, Express, PostgreSQL',
    };
    const parsedString = CreateProjectSchema.safeParse(inputWithString);
    expect(parsedString.success).toBe(true);
    if (parsedString.success) {
      expect(parsedString.data.skillsRequired).toBe('Node.js, Express, PostgreSQL');
    }
  });

  it('should validate Auth schemas for login and registration', () => {
    const validLogin = {
      email: 'satria@student.itb.ac.id',
      password: 'password123',
      role: 'MAHASISWA',
    };
    const loginResult = LoginRequestSchema.safeParse(validLogin);
    expect(loginResult.success).toBe(true);

    const invalidEmailLogin = {
      email: 'not-an-email',
      password: 'password123',
    };
    const invalidResult = LoginRequestSchema.safeParse(invalidEmailLogin);
    expect(invalidResult.success).toBe(false);

    const validRegister = {
      action: 'register' as const,
      name: 'Ahmad Fauzi',
      email: 'fauzi@student.uns.ac.id',
      password: 'secretPassword',
      role: 'MAHASISWA' as const,
    };
    const registerResult = RegisterRequestSchema.safeParse(validRegister);
    expect(registerResult.success).toBe(true);
  });

  it('should validate AdminActionSchema using discriminated union', () => {
    const verifyAction = {
      action: 'verify_student' as const,
      studentId: 'std-001',
      verified: true,
    };
    const verifyResult = AdminActionSchema.safeParse(verifyAction);
    expect(verifyResult.success).toBe(true);

    const kioskAction = {
      action: 'update_kiosk' as const,
      kioskId: 'kiosk-01',
      kioskStatus: 'ONLINE' as const,
    };
    const kioskResult = AdminActionSchema.safeParse(kioskAction);
    expect(kioskResult.success).toBe(true);

    const invalidAction = {
      action: 'unknown_action',
    };
    const invalidResult = AdminActionSchema.safeParse(invalidAction);
    expect(invalidResult.success).toBe(false);
  });

  it('should support Branded Types for domain identifiers', () => {
    const pId = toProjectId('proj-123');
    const sId = toStudentId('student-456');
    const uId = toUserId('user-789');

    expect(pId).toBe('proj-123');
    expect(sId).toBe('student-456');
    expect(uId).toBe('user-789');
  });

  it('should handle Discriminated Union AsyncState transitions', () => {
    type Data = { count: number };

    const idleState: AsyncState<Data> = { status: 'idle' };
    const loadingState: AsyncState<Data> = { status: 'loading' };
    const successState: AsyncState<Data> = { status: 'success', data: { count: 10 } };
    const errorState: AsyncState<Data> = { status: 'error', errorMessage: 'Network failure' };

    expect(idleState.status).toBe('idle');
    expect(loadingState.status).toBe('loading');
    if (successState.status === 'success') {
      expect(successState.data.count).toBe(10);
    }
    if (errorState.status === 'error') {
      expect(errorState.errorMessage).toBe('Network failure');
    }
  });
});
