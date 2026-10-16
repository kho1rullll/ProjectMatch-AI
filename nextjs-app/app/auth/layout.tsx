import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk & Registrasi Akun | ProjectMatch AI',
  description:
    'Autentikasi akun mahasiswa, mitra industri, dan administrator kampus pada platform ProjectMatch AI.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
