// lib/auth-crypto.ts — Server-Side Cryptographic Password Hashing & JWT Management
// SRS NFR-05 & FR-01: Autentikasi berbasis JWT dan enkripsi password (bcrypt/SHA-256)
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

// Server-side secret key (never exposed to client bundles via NEXT_PUBLIC_)
const JWT_SECRET_STRING = process.env.JWT_SECRET || 'projectmatch-jwt-secret-key-32-chars-min-prod-uns-2026!';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'MAHASISWA' | 'MITRA' | 'ADMIN';
  name: string;
}

/**
 * Hash a plain-text password using bcrypt with 10 salt rounds.
 */
export function hashPassword(plainTextPassword: string): string {
  return bcrypt.hashSync(plainTextPassword, 10);
}

/**
 * Verify a plain-text password against a bcrypt hash.
 * Includes safe backward-compatibility fallback for initial mock seed users.
 */
export function verifyPassword(plainTextPassword: string, storedHashOrPlain: string): boolean {
  if (!storedHashOrPlain) return false;
  // If stored value is already a bcrypt hash (starts with $2a$ or $2b$)
  if (storedHashOrPlain.startsWith('$2a$') || storedHashOrPlain.startsWith('$2b$')) {
    return bcrypt.compareSync(plainTextPassword, storedHashOrPlain);
  }
  // Fallback comparison for unhashed legacy mock data
  return plainTextPassword === storedHashOrPlain;
}

/**
 * Generate a signed JWT token with 24-hour expiration (HS256).
 */
export async function createJwtToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token. Returns decoded payload or null if invalid/expired.
 */
export async function verifyJwtToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as 'MAHASISWA' | 'MITRA' | 'ADMIN',
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}
