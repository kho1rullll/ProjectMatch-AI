import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel Administrasi Kampus & Smart Kiosk | ProjectMatch AI',
  description:
    'Panel kontrol validasi akademik mahasiswa, analitik UAT sistem, dan manajemen terminal fisik Smart Campus Kiosk RFID.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
