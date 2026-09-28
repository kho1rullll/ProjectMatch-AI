import type { Metadata } from 'next';
import AdminDashboardContainer from '@/components/admin/AdminDashboardContainer';

export const metadata: Metadata = {
  title: 'Panel Administrasi Kampus & Smart Kiosk | ProjectMatch AI',
  description:
    'Panel kontrol validasi akademik mahasiswa, monitoring rekrutmen mitra, dan manajemen terminal fisik Smart Campus Kiosk RFID.',
};

export default function AdminPage() {
  return <AdminDashboardContainer />;
}
