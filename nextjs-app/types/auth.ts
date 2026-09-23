// types/auth.ts — Skema Zod & Type Safety untuk Autentikasi (Final Project Bab e & l)
import { z } from 'zod';

export const UserRoleEnum = z.enum(['MAHASISWA', 'MITRA', 'ADMIN']);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const LoginRequestSchema = z.object({
  action: z.literal('login').optional(),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().default('password123'),
  role: UserRoleEnum.optional().default('MAHASISWA'),
  companyName: z.string().optional(),
});

export const RegisterRequestSchema = z.object({
  action: z.literal('register'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: UserRoleEnum.default('MAHASISWA'),
  companyName: z.string().optional(),
});

export const AuthRequestSchema = z.union([RegisterRequestSchema, LoginRequestSchema]);

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthRequest = z.infer<typeof AuthRequestSchema>;

export interface AuthSuccessResponse {
  success: true;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface AuthErrorResponse {
  success: false;
  error: string;
  issues?: Array<{ path: string; message: string }>;
}
