import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db';
import { LoginRequestSchema, RegisterRequestSchema } from '@/types/auth';
import { verifyPassword, createJwtToken } from '@/lib/auth-crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    if (rawBody?.action === 'register') {
      const parseResult = RegisterRequestSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validasi data registrasi gagal',
            issues: parseResult.error.errors.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      const { name, email, password, role, companyName } = parseResult.data;
      const existing = getUserByEmail(email);
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Email sudah terdaftar. Silakan login.' },
          { status: 409 }
        );
      }

      const newUser = createUser({
        name,
        email,
        password,
        role,
        companyName,
      });

      const token = await createJwtToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      });

      return NextResponse.json({
        success: true,
        message: 'Registrasi akun berhasil!',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }

    // Default: Login
    const parseResult = LoginRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validasi data login gagal',
          issues: parseResult.error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { email, password, role } = parseResult.data;
    let user = getUserByEmail(email);
    if (!user) {
      // Auto-create test user with hashed password for convenience if logging in for first time
      user = createUser({
        name: role === 'MAHASISWA' ? 'Raden Satria' : 'Mitra Industri',
        email,
        password,
        role,
      });
    } else if (user.password && !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { success: false, error: 'Kredensial tidak valid. Password salah.' },
        { status: 401 }
      );
    }

    const token = await createJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memproses autentikasi';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
