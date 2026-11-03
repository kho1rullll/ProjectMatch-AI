import type { Metadata } from 'next';
import MitraDashboardContainer from '@/components/mitra/MitraDashboardContainer';

export const metadata: Metadata = {
  title: 'Dashboard Mitra Industri & Riset Kampus | ProjectMatch AI',
  description:
    'Kelola lowongan proyek, tinjau pelamar dengan rekomendasi AI, dan eksplorasi profil talenta mahasiswa.',
};

export default function MitraPage() {
  return <MitraDashboardContainer />;
}
