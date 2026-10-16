// services/projectApi.ts — Lapisan pemanggilan REST API (Server State)
import { z } from 'zod';
import { Project, ProjectSchema, CreateProjectInput } from '../types/project';

const API_BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE}/api/projects`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Gagal mengambil data proyek dari server.');
  const json = await response.json();
  const rawList = Array.isArray(json) ? json : json.data || [];
  return z.array(ProjectSchema).parse(rawList);
};

export const fetchProjectById = async (id: string): Promise<Project> => {
  const projects = await fetchProjects();
  const found = projects.find((p) => p.id === id);
  if (!found) throw new Error(`Proyek dengan ID '${id}' tidak ditemukan.`);
  return found;
};

export const createProject = async (input: CreateProjectInput): Promise<Project> => {
  const response = await fetch(`${API_BASE}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Gagal menambah lowongan proyek baru.');
  }
  const json = await response.json();
  return ProjectSchema.parse(json.data || json);
};
