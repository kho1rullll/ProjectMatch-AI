import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { action, name, email, password, role, companyName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email wajib diisi' },
        { status: 400 }
      );
    }

    if (action === 'register') {
      const existing = getUserByEmail(email);
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Email sudah terdaftar. Silakan login.' },
          { status: 409 }
        );
      }

      const newUser = createUser({
        name: name || (role === 'MAHASISWA' ? 'Mahasiswa Baru' : 'Mitra Industri'),
        email,
        password: password || 'password123',
        role: role || 'MAHASISWA',
        companyName,
      });

      return NextResponse.json({
        success: true,
        message: 'Registrasi akun berhasil!',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }

    // Default: Login
    let user = getUserByEmail(email);
    if (!user) {
      // Auto-create test user for convenience if logging in for the first time
      user = createUser({
        name: role === 'MAHASISWA' ? 'Raden Satria' : 'Mitra Industri',
        email,
        password: password || 'password123',
        role: role || 'MAHASISWA',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Login berhasil!',
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
