import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Mitra Industri & Rekrutmen Riset | ProjectMatch AI',
  description:
    'Portal terpadu mitra industri dan laboratorium riset untuk mengelola lowongan proyek, meninjau pelamar dengan rekomendasi AI, dan eksplorasi talenta mahasiswa.',
};

export default function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
