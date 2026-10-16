import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Mitra Industri & Rekrutmen Riset | ProjectMatch AI',
  description:
    'Portal terpadu mitra industri dan laboratorium riset untuk mengelola lowongan proyek, meninjau pelamar dengan AI Cosine Similarity, dan eksplorasi talenta mahasiswa 5D.',
};

export default function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
