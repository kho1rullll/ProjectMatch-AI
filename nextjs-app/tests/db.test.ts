import { describe, it, expect } from 'vitest';
import {
  getAllProjects,
  getProjectById,
  getAllStudents,
  getUserByEmail,
  getAllKiosks,
  verifyStudent,
  updateKioskStatus,
} from '@/lib/db';

describe('Local Database & Persistence Layer (lib/db.ts)', () => {
  it('should retrieve seeded projects from SQLite / fallback storage', () => {
    const projects = getAllProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);

    const firstProject = projects[0];
    expect(firstProject).toHaveProperty('id');
    expect(firstProject).toHaveProperty('title');
    expect(firstProject).toHaveProperty('company');
    expect(firstProject).toHaveProperty('matchScore');
  });

  it('should find project by ID', () => {
    const projects = getAllProjects();
    const target = projects[0];
    if (target) {
      const found = getProjectById(target.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(target.id);
      expect(found?.title).toBe(target.title);
    }
  });

  it('should retrieve existing users by email', () => {
    const studentUser = getUserByEmail('satria@student.itb.ac.id');
    expect(studentUser).toBeDefined();
    expect(studentUser?.role).toBe('MAHASISWA');
  });

  it('should update student verification state', () => {
    const students = getAllStudents();
    const target = students[0];
    if (target) {
      const updated = verifyStudent(target.id, true);
      expect(updated).toBeDefined();
      expect(updated?.academicVerified).toBe(true);

      // Toggle back safely
      const reverted = verifyStudent(target.id, false);
      expect(reverted?.academicVerified).toBe(false);
    }
  });

  it('should retrieve and update kiosk terminal status', () => {
    const kiosks = getAllKiosks();
    expect(Array.isArray(kiosks)).toBe(true);
    expect(kiosks.length).toBeGreaterThan(0);

    const targetKiosk = kiosks[0];
    if (targetKiosk) {
      const updated = updateKioskStatus(targetKiosk.id, 'STANDBY');
      expect(updated).not.toBeNull();
      expect(updated?.status).toBe('STANDBY');

      // Revert to ONLINE
      const restored = updateKioskStatus(targetKiosk.id, 'ONLINE');
      expect(restored?.status).toBe('ONLINE');
    }
  });

  it('should retrieve all users and all applications', async () => {
    const { getAllUsers, getAllApplications } = await import('@/lib/db');
    const users = getAllUsers();
    expect(users.length).toBeGreaterThan(0);

    const apps = getAllApplications();
    expect(Array.isArray(apps)).toBe(true);
  });

  it('should create new user with hashed password and competency vector', async () => {
    const { createUser, getUserByEmail } = await import('@/lib/db');
    const testEmail = `student-${Date.now()}@uns.ac.id`;
    const newUser = createUser({
      name: 'Testing Student',
      email: testEmail,
      password: 'SecretPassword2026!',
      role: 'MAHASISWA',
    });

    expect(newUser.id).toBeDefined();
    expect(newUser.email).toBe(testEmail);
    expect(newUser.password).not.toBe('SecretPassword2026!'); // Should be bcrypt hash

    const found = getUserByEmail(testEmail);
    expect(found).not.toBeNull();
    expect(found?.name).toBe('Testing Student');
  });

  it('should create new project and retrieve it from database', async () => {
    const { createProject, getProjectById } = await import('@/lib/db');
    const newProj = createProject({
      title: 'Automated Test Project for Verification',
      company: 'SV UNS Lab',
      category: 'AI & Machine Learning',
      workType: 'Remote',
      duration: '3 Bulan',
      stipend: 'Rp 3.000.000',
      description: 'Project created during test execution to verify DB persistence.',
      skillsRequired: 'TypeScript, Vitest, React',
      reqAiml: 88,
      reqFrontend: 85,
    });

    expect(newProj.id).toBeDefined();
    expect(newProj.title).toBe('Automated Test Project for Verification');
    expect(newProj.skillsRequired).toContain('TypeScript');

    const fetched = getProjectById(newProj.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe('Automated Test Project for Verification');
  });
});
