// types/project.ts — Skema Zod & tipe TypeScript untuk entitas Project ProjectMatch AI
import { z } from 'zod';

export const RequirementsBreakdownSchema = z.object({
  aiml: z.number().default(85),
  frontend: z.number().default(70),
  uiux: z.number().default(65),
  backend: z.number().default(80),
  architecture: z.number().default(75),
}).optional();

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(5, "Judul proyek minimal 5 karakter"),
  company: z.string().min(2, "Nama mitra wajib diisi"),
  category: z.string().default("AI & Machine Learning"),
  matchScore: z.number().min(0).max(100).default(90),
  workType: z.string().default("Hybrid"),
  duration: z.string().optional().default("3 Bulan"),
  stipend: z.string().optional().default("Rp 4.000.000 / bln"),
  description: z.string().default(""),
  skillsRequired: z.union([z.array(z.string()), z.string()]).transform((val) => {
    if (Array.isArray(val)) return val;
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }).default([]),
  requirementsBreakdown: RequirementsBreakdownSchema,
  verified: z.boolean().default(true),
  postedAt: z.string().optional().default("Baru saja"),
  similarityMetric: z.number().optional().default(0.90),
});

export const CreateProjectSchema = z.object({
  title: z.string().min(8, "Judul proyek minimal 8 karakter"),
  company: z.string().min(2, "Nama mitra wajib diisi"),
  category: z.string().default("AI & Machine Learning"),
  workType: z.string().default("Hybrid"),
  duration: z.string().default("3 Bulan"),
  stipend: z.string().default("Rp 4.000.000 / bln"),
  skillsRequired: z.string().min(2, "Minimal cantumkan 1 keahlian teknis"),
  description: z.string().min(15, "Deskripsi proyek minimal 15 karakter"),
  reqAiml: z.number().optional().default(85),
  reqFrontend: z.number().optional().default(70),
  reqUiux: z.number().optional().default(65),
  reqBackend: z.number().optional().default(80),
  reqArchitecture: z.number().optional().default(75),
});

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
