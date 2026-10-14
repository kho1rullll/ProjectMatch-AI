// types/auth.ts — Skema Otentikasi & RBAC Sesuai SKPL & Laporan Arsitektur Backend (FR-01, FR-11)
import { z } from 'zod';

export const UserRoleEnum = z.enum(['mahasiswa', 'admin', 'MAHASISWA', 'ADMIN', 'MITRA']);
export type UserRole = 'mahasiswa' | 'admin';

export const LoginRequestSchema = z.object({
  action: z.literal('login').optional(),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().default('password123'),
  role: z.union([z.string(), UserRoleEnum]).optional().default('mahasiswa'),
  companyName: z.string().optional(),
});

export const RegisterRequestSchema = z.object({
  action: z.literal('register').optional(),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  name: z.string().optional(),
  full_name: z.string().optional(),
  nim: z.string().optional().default('V3925028'),
  github_username: z.string().optional().default('mahasiswa-dev'),
  role: z.union([z.string(), UserRoleEnum]).optional().default('mahasiswa'),
  program_studi: z.string().optional().default('D3 Teknik Informatika PSDKU Madiun UNS'),
  angkatan: z.number().optional().default(2025),
  companyName: z.string().optional(),
}).transform((data) => ({
  ...data,
  full_name: data.full_name || data.name || 'Mahasiswa',
}));

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export interface AuthUser {
  id: string;
  email: string;
  role: 'mahasiswa' | 'admin';
  name?: string;
  full_name?: string;
  nim?: string;
  github_username?: string;
  organization?: string;
}

export interface AuthSuccessResponse {
  success: true;
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface AuthErrorResponse {
  success: false;
  error: string;
  issues?: Array<{ path: string; message: string }>;
}
