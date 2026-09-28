import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, createJwtToken, verifyJwtToken } from '@/lib/auth-crypto';

describe('Server-Side Cryptographic Auth & JWT (SRS FR-01 & NFR-05)', () => {
  const plainPassword = 'PasswordMahasiswa2026!';
  const testPayload = {
    userId: 'usr-test-01',
    email: 'raden.satria@student.uns.ac.id',
    role: 'MAHASISWA' as const,
    name: 'Raden Satria',
  };

  it('should hash password using bcrypt format with salt', () => {
    const hash = hashPassword(plainPassword);
    expect(hash).not.toBe(plainPassword);
    expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
  });

  it('should verify correct password against bcrypt hash', () => {
    const hash = hashPassword(plainPassword);
    expect(verifyPassword(plainPassword, hash)).toBe(true);
  });

  it('should reject incorrect password against bcrypt hash', () => {
    const hash = hashPassword(plainPassword);
    expect(verifyPassword('WrongPassword123!', hash)).toBe(false);
  });

  it('should support legacy plain passwords gracefully', () => {
    expect(verifyPassword('plainpass', 'plainpass')).toBe(true);
    expect(verifyPassword('wrongpass', 'plainpass')).toBe(false);
  });

  it('should sign and verify a valid JWT token with HS256', async () => {
    const token = await createJwtToken(testPayload);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // Header.Payload.Signature

    const decoded = await verifyJwtToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(testPayload.userId);
    expect(decoded?.email).toBe(testPayload.email);
    expect(decoded?.role).toBe(testPayload.role);
    expect(decoded?.name).toBe(testPayload.name);
  });

  it('should reject malformed or tampered JWT tokens', async () => {
    const validToken = await createJwtToken(testPayload);
    const tamperedToken = validToken.slice(0, -5) + 'abcde';

    const result = await verifyJwtToken(tamperedToken);
    expect(result).toBeNull();

    const garbageResult = await verifyJwtToken('not.a.valid.jwt');
    expect(garbageResult).toBeNull();
  });
});
